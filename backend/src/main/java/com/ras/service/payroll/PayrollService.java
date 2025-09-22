package com.ras.service.payroll;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;

import com.ras.service.payroll.dto.BangLuongRow;
import com.ras.service.payroll.dto.CommissionUpsertRequest;
import com.ras.service.payroll.dto.UpdateBangLuongRequest;
import java.time.YearMonth;

import java.math.BigDecimal;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PayrollService {

    private final JdbcTemplate jdbc;

    /* ========== PERIODS ========== */
    public List<Map<String, Object>> listPeriods() {
        return jdbc.queryForList("""
            SELECT id,
                thang_ky AS nam_thang,
                tu_ngay,
                den_ngay,
                trang_thai
            FROM ky_luong
            ORDER BY thang_ky DESC
        """);
    }

    public Map<String, Object> createPeriod(String thangKy, String trangThai) {
        // nếu đã có thì trả luôn
        List<Map<String,Object>> existed = jdbc.queryForList(
            "SELECT id, thang_ky AS nam_thang, tu_ngay, den_ngay, trang_thai FROM ky_luong WHERE thang_ky = ?",
            thangKy
        );
        if (!existed.isEmpty()) return existed.get(0);

        // ✅ parse bằng YearMonth thay vì LocalDate
        DateTimeFormatter ymFmt = DateTimeFormatter.ofPattern("yyyy-MM");
        YearMonth ym = YearMonth.parse(thangKy, ymFmt);

        // Kỳ lương: từ ngày 05 của tháng đó → ngày 04 của tháng sau
        LocalDate start = ym.atDay(5);                 // YYYY-MM-05
        LocalDate end   = ym.plusMonths(1).atDay(4);   // (YYYY-MM + 1)-04

        KeyHolder kh = new GeneratedKeyHolder();
        jdbc.update(con -> {
            PreparedStatement ps = con.prepareStatement(
                "INSERT INTO ky_luong(thang_ky, tu_ngay, den_ngay, trang_thai) VALUES(?,?,?,?)",
                Statement.RETURN_GENERATED_KEYS
            );
            ps.setString(1, thangKy);
            ps.setDate(2, java.sql.Date.valueOf(start));
            ps.setDate(3, java.sql.Date.valueOf(end));
            ps.setString(4, (trangThai != null && !trangThai.isBlank()) ? trangThai : "dang_trong_ky");
            return ps;
        }, kh);

        Long id = (kh.getKey() != null)
            ? kh.getKey().longValue()
            : jdbc.queryForObject("SELECT id FROM ky_luong WHERE thang_ky=?", Long.class, thangKy);

        return jdbc.queryForMap("""
            SELECT id,
                thang_ky AS nam_thang,
                tu_ngay,
                den_ngay,
                trang_thai
            FROM ky_luong
            WHERE id=?
        """, id);
    }

    

    /* ========== SALARY HEADER ========== */
    public List<BangLuongRow> listSalaries(Long kyLuongId) {
        return jdbc.query("""
            SELECT id, ky_luong_id, nhan_vien_id,
                   COALESCE(luong_cung,0)            AS luong_cung,
                   COALESCE(tong_hoa_hong,0)         AS tong_hoa_hong,
                   COALESCE(tong_thuong,0)           AS tong_thuong,
                   COALESCE(tong_truc,0)             AS tong_truc,
                   COALESCE(tong_phu_cap_khac,0)     AS tong_phu_cap_khac,
                   COALESCE(tong_phat,0)             AS tong_phat,
                   COALESCE(tong_luong,0)            AS tong_luong
            FROM nv_bang_luong_thang
            WHERE ky_luong_id = ?
            ORDER BY nhan_vien_id
        """, (rs, i) -> BangLuongRow.from(rs), kyLuongId);
    }

    public BangLuongRow updateSalary(UpdateBangLuongRequest r) {
        ensureRow(r.getKy_luong_id(), r.getNhan_vien_id());

        // cập nhật các cột có truyền lên
        jdbc.update("""
            UPDATE nv_bang_luong_thang
            SET
              luong_cung         = COALESCE(?, luong_cung),
              tong_thuong        = COALESCE(?, tong_thuong),
              tong_truc          = COALESCE(?, tong_truc),
              tong_phu_cap_khac  = COALESCE(?, tong_phu_cap_khac),
              tong_phat          = COALESCE(?, tong_phat)
            WHERE ky_luong_id = ? AND nhan_vien_id = ?
        """,
        r.getLuong_cung(), r.getTong_thuong(), r.getTong_truc(), r.getTong_phu_cap_khac(), r.getTong_phat(),
        r.getKy_luong_id(), r.getNhan_vien_id());

        // tính lại tổng lương = lương cứng + hoa hồng + thưởng + trực + phụ cấp - phạt
        recalcTongLuong(r.getKy_luong_id(), r.getNhan_vien_id());

        return getRow(r.getKy_luong_id(), r.getNhan_vien_id());
    }

    private void ensureRow(Long kyLuongId, Long nhanVienId) {
        Integer cnt = jdbc.queryForObject("""
            SELECT COUNT(*) FROM nv_bang_luong_thang WHERE ky_luong_id=? AND nhan_vien_id=?
        """, Integer.class, kyLuongId, nhanVienId);
        if (cnt != null && cnt == 0) {
            jdbc.update("""
                INSERT INTO nv_bang_luong_thang(ky_luong_id, nhan_vien_id,
                    luong_cung, tong_hoa_hong, tong_thuong, tong_truc, tong_phu_cap_khac, tong_phat, tong_luong)
                VALUES(?, ?, 0,0,0,0,0,0,0)
            """, kyLuongId, nhanVienId);
        }
    }

    private BangLuongRow getRow(Long kyLuongId, Long nhanVienId) {
        return jdbc.queryForObject("""
            SELECT id, ky_luong_id, nhan_vien_id,
                   COALESCE(luong_cung,0), COALESCE(tong_hoa_hong,0), COALESCE(tong_thuong,0),
                   COALESCE(tong_truc,0), COALESCE(tong_phu_cap_khac,0), COALESCE(tong_phat,0),
                   COALESCE(tong_luong,0)
            FROM nv_bang_luong_thang WHERE ky_luong_id=? AND nhan_vien_id=?
        """, (rs, i) -> BangLuongRow.from(rs), kyLuongId, nhanVienId);
    }

    private void recalcTongLuong(Long kyLuongId, Long nhanVienId) {
        jdbc.update("""
            UPDATE nv_bang_luong_thang t SET
              tong_hoa_hong = (SELECT COALESCE(SUM(so_tien),0) FROM nv_hoa_hong_chot_lop
                               WHERE ky_luong_id = t.ky_luong_id AND nhan_vien_id = t.nhan_vien_id),
              tong_luong = COALESCE(luong_cung,0)
                         + COALESCE((SELECT SUM(so_tien) FROM nv_hoa_hong_chot_lop
                                     WHERE ky_luong_id=t.ky_luong_id AND nhan_vien_id=t.nhan_vien_id),0)
                         + COALESCE(tong_thuong,0)
                         + COALESCE(tong_truc,0)
                         + COALESCE(tong_phu_cap_khac,0)
                         - COALESCE(tong_phat,0)
            WHERE ky_luong_id=? AND nhan_vien_id=?
        """, kyLuongId, nhanVienId);
    }

    /* ========== COMMISSIONS ========== */
    public List<Map<String, Object>> listCommissions(Long kyLuongId, Long nhanVienId) {
        return jdbc.queryForList("""
            SELECT id, ky_luong_id, nhan_vien_id,
                   COALESCE(hoc_phi_ap_dung,0) AS hoc_phi_ap_dung,
                   COALESCE(ty_le_pct,0)       AS ty_le_pct,
                   COALESCE(so_tien,0)         AS so_tien,
                   ghi_chu
            FROM nv_hoa_hong_chot_lop
            WHERE ky_luong_id=? AND nhan_vien_id=?
            ORDER BY id DESC
        """, kyLuongId, nhanVienId);
    }

    public Map<String, Object> upsertCommission(CommissionUpsertRequest r) {
        ensureRow(r.getKy_luong_id(), r.getNhan_vien_id());
        BigDecimal money = r.getSo_tien();
        if (money == null && r.getHoc_phi_ap_dung() != null && r.getTy_le_pct() != null) {
            money = r.getHoc_phi_ap_dung().multiply(r.getTy_le_pct())
                    .divide(BigDecimal.valueOf(100));
        }

        KeyHolder kh = new GeneratedKeyHolder();
        BigDecimal finalMoney = money == null ? BigDecimal.ZERO : money;
        jdbc.update(con -> {
            PreparedStatement ps = con.prepareStatement("""
                INSERT INTO nv_hoa_hong_chot_lop(ky_luong_id, nhan_vien_id, hoc_vien_id, dang_ky_id,
                                                 hoc_phi_ap_dung, ty_le_pct, so_tien, ghi_chu)
                VALUES(?,?,?,?,?,?,?,?)
            """, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, r.getKy_luong_id());
            ps.setLong(2, r.getNhan_vien_id());
            if (r.getHoc_vien_id() == null) ps.setNull(3, java.sql.Types.BIGINT); else ps.setLong(3, r.getHoc_vien_id());
            if (r.getDang_ky_id() == null) ps.setNull(4, java.sql.Types.BIGINT); else ps.setLong(4, r.getDang_ky_id());
            ps.setBigDecimal(5, r.getHoc_phi_ap_dung());
            ps.setBigDecimal(6, r.getTy_le_pct());
            ps.setBigDecimal(7, finalMoney);
            ps.setString(8, r.getGhi_chu());
            return ps;
        }, kh);

        recalcTongLuong(r.getKy_luong_id(), r.getNhan_vien_id());

        Long id = kh.getKey().longValue();
        return jdbc.queryForMap("SELECT * FROM nv_hoa_hong_chot_lop WHERE id=?", id);
    }

    public Map<String, Object> updateCommissionPercent(Long id, BigDecimal tyLePct, boolean recalc) {
        if (recalc) {
            jdbc.update("""
                UPDATE nv_hoa_hong_chot_lop
                SET ty_le_pct = ?, so_tien = COALESCE(hoc_phi_ap_dung,0) * ? / 100
                WHERE id = ?
            """, tyLePct, tyLePct, id);
        } else {
            jdbc.update("UPDATE nv_hoa_hong_chot_lop SET ty_le_pct=? WHERE id=?", tyLePct, id);
        }

        Map<String, Object> row = jdbc.queryForMap("""
            SELECT id, ky_luong_id, nhan_vien_id FROM nv_hoa_hong_chot_lop WHERE id=?
        """, id);
        recalcTongLuong(((Number) row.get("ky_luong_id")).longValue(), ((Number) row.get("nhan_vien_id")).longValue());

        return jdbc.queryForMap("SELECT * FROM nv_hoa_hong_chot_lop WHERE id=?", id);
    }

    public void deleteCommission(Long id) {
        Map<String, Object> row = jdbc.queryForMap("""
            SELECT ky_luong_id, nhan_vien_id FROM nv_hoa_hong_chot_lop WHERE id=?
        """, id);
        jdbc.update("DELETE FROM nv_hoa_hong_chot_lop WHERE id=?", id);
        recalcTongLuong(((Number) row.get("ky_luong_id")).longValue(), ((Number) row.get("nhan_vien_id")).longValue());
    }
}
