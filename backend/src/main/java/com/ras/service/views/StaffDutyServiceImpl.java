package com.ras.service.views;

import com.ras.dto.views.StaffOnDutyTodayDto;
import com.ras.service.views.StaffDutyService;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class StaffDutyServiceImpl implements StaffDutyService {

    private final JdbcTemplate jdbc;

    public StaffDutyServiceImpl(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public List<StaffOnDutyTodayDto> find(LocalDate date, Long branchId, String q) {
        LocalDate d = (date != null) ? date : LocalDate.now();

        // Query trực tiếp view v_staff_on_duty_today (đã alias ma -> ma_chi_nhanh, ten -> chi_nhanh)
        StringBuilder sql = new StringBuilder("""
            SELECT
              id,
              chi_nhanh_id,
              ma_chi_nhanh,
              chi_nhanh,
              nhan_vien,
              ngay_truc,
              gio_bat_dau,
              gio_ket_thuc,
              loai_ca,
              trang_thai_ca,
              trang_thai_runtime
            FROM v_staff_on_duty_today
            WHERE ngay_truc = ?
        """);

        List<Object> args = new ArrayList<>();
        args.add(d);

        if (branchId != null) {
            sql.append(" AND chi_nhanh_id = ?");
            args.add(branchId);
        }
        if (q != null && !q.isBlank()) {
            sql.append(" AND (LOWER(nhan_vien) LIKE ? OR LOWER(chi_nhanh) LIKE ? OR LOWER(ma_chi_nhanh) LIKE ?)");
            String like = "%" + q.toLowerCase().trim() + "%";
            args.add(like);
            args.add(like);
            args.add(like);
        }
        sql.append(" ORDER BY gio_bat_dau ASC");

        return jdbc.query(sql.toString(), args.toArray(), ROW_MAPPER);
    }

    /** RowMapper rõ ràng để tránh overload ambiguous */
    private static final RowMapper<StaffOnDutyTodayDto> ROW_MAPPER = (rs, rowNum) -> map(rs);

    private static StaffOnDutyTodayDto map(ResultSet rs) throws SQLException {
        // Nếu nhan_vien null (chưa phân công), trả chuỗi rỗng để FE không crash
        String nv = rs.getString("nhan_vien");
        if (nv == null) nv = "";

        return new StaffOnDutyTodayDto(
            rs.getLong("id"),
            rs.getLong("chi_nhanh_id"),
            rs.getString("ma_chi_nhanh"),
            rs.getString("chi_nhanh"),
            nv,
            rs.getObject("ngay_truc", LocalDate.class),
            rs.getObject("gio_bat_dau", LocalTime.class),
            rs.getObject("gio_ket_thuc", LocalTime.class),
            rs.getString("loai_ca"),
            rs.getString("trang_thai_ca"),
            rs.getString("trang_thai_runtime")
        );
    }
}
