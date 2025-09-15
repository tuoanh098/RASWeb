package com.ras.service.salary;

import com.ras.domain.salary.*;
import com.ras.service.salary.dto.*;
import com.ras.domain.salary.KyLuongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class StaffSalaryServiceImpl implements StaffSalaryService {

    private final KyLuongRepository kyLuongRepo;
    private final NvBangLuongThangRepository blRepo;
    private final NvPhatKyLuatRepository phatRepo;
    private final ProcCaller procCaller;
    private final JdbcTemplate jdbc;

    @Override
    public Page<StaffSalaryRow> list(String ky, Pageable pageable) {
        Long kyId = requireKyId(ky);
        String baseSql = """
                FROM nv_bang_luong_thang bl
                JOIN nhan_vien nv ON nv.id = bl.nhan_vien_id
                WHERE bl.ky_luong_id = ? AND (nv.vai_tro IS NULL OR UPPER(nv.vai_tro) NOT IN ('TEACHER','GV'))
                """;
        Long total = jdbc.queryForObject("SELECT COUNT(*) " + baseSql, Long.class, kyId);

        String dataSql = """
                SELECT bl.id, bl.nhan_vien_id, nv.ten,
                       bl.luong_cung, bl.tong_hoa_hong, bl.tong_thuong,
                       bl.tong_truc, bl.tong_phu_cap_khac, bl.tong_phat, bl.tong_luong
                """ + baseSql + " ORDER BY bl.id DESC LIMIT ? OFFSET ?";

        var rows = jdbc.query(dataSql,
                (ResultSet rs, int i) -> StaffSalaryRow.builder()
                        .id(rs.getLong(1))
                        .nhanVienId(rs.getLong(2))
                        .tenNhanVien(rs.getString(3))
                        .luongCung(rs.getBigDecimal(4))
                        .tongHoaHong(rs.getBigDecimal(5))
                        .tongThuong(rs.getBigDecimal(6))
                        .tongTruc(rs.getBigDecimal(7))
                        .tongPhuCapKhac(rs.getBigDecimal(8))
                        .tongPhat(rs.getBigDecimal(9))
                        .tongLuong(rs.getBigDecimal(10))
                        .build(),
                kyId, pageable.getPageSize(), pageable.getOffset());

        return new PageImpl<>(rows, pageable, total);
    }

    @Override
    public void updateLuong(Long bangLuongId, StaffLuongUpdateReq req) {
        var bl = blRepo.findById(bangLuongId).orElseThrow();
        if (req.getLuongCung() != null) bl.setLuongCung(req.getLuongCung());
        if (req.getGhiChu() != null) bl.setGhiChu(req.getGhiChu());
        // Không tự đổi tổng ở đây — sẽ recalc bằng SP để an toàn
        blRepo.save(bl);
    }

    @Override
    public NvPhatKyLuat addPenalty(StaffPenaltyReq req) {
        Long kyId = requireKyId(req.getKy());
        NvPhatKyLuat p = NvPhatKyLuat.builder()
                .kyLuongId(kyId)
                .nhanVienId(req.getNhanVienId())
                .chiNhanhId(req.getChiNhanhId())
                .ngayThang(req.getNgayThang() != null ? req.getNgayThang() : LocalDate.now())
                .noiDungLoi(req.getNoiDungLoi())
                .soTienPhat(req.getSoTienPhat() != null ? req.getSoTienPhat() : BigDecimal.ZERO)
                .taoLuc(LocalDateTime.now())
                .build();
        p = phatRepo.save(p);
        // chạy SP tổng hợp lại lương NV cho kỳ này
        recalc(req.getKy());
        return p;
    }

    @Override
    public Page<NvPhatKyLuat> listPenalties(String ky, Long nhanVienId, Pageable pageable) {
        Long kyId = requireKyId(ky);
        return phatRepo.findByKyLuongIdAndNhanVienId(kyId, nhanVienId, pageable);
    }

    @Override
    public void recalc(String ky) {
        // proc: dùng bản không SIGNAL đã bạn xác nhận OK
        procCaller.call("sp_nv_ket_so_ky", ky);
    }

    private Long requireKyId(String ky) {
        return kyLuongRepo.findByNamThang(ky).map(KyLuong::getId)
                .orElseThrow(() -> new IllegalArgumentException("Không thấy kỳ lương: " + ky));
    }
}
