package com.ras.web.api.views;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/views")
public class StaffViewController {

  private final JdbcTemplate jdbc;
  public StaffViewController(JdbcTemplate jdbc) { this.jdbc = jdbc; }

  // GET /api/views/staff-duty-today
  @GetMapping("/staff-duty-today")
  public List<Map<String,Object>> staffDutyToday() {
    // Lấy các buổi học của NGÀY HÔM NAY, kèm tên GV, lớp, phòng, giờ bắt đầu/kết thúc
    // Bạn có thể tùy chỉnh thêm cột trạng thái/chi nhánh nếu cần
    LocalDate today = LocalDate.now();
    Timestamp start = Timestamp.valueOf(today + " 00:00:00");
    Timestamp end   = Timestamp.valueOf(today.plusDays(1) + " 00:00:00");

    return jdbc.queryForList("""
      SELECT bh.id,
             l.ten_lop,
             nd.ho_ten AS giao_vien,
             ph.ten    AS phong,
             bh.bat_dau_luc,
             bh.ket_thuc_luc,
             bh.trang_thai
      FROM buoi_hoc bh
      JOIN lop l            ON l.id = bh.lop_id
      LEFT JOIN giao_vien gv ON gv.id = bh.giao_vien_id
      LEFT JOIN nguoi_dung nd ON nd.id = gv.id
      LEFT JOIN phong_hoc ph  ON ph.id = bh.phong_id
      WHERE bh.bat_dau_luc >= ? AND bh.bat_dau_luc < ?
      ORDER BY bh.bat_dau_luc
    """, start, end);
  }
}
