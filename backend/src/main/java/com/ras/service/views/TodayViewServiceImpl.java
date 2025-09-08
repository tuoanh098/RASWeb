package com.ras.service.views;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import com.ras.dto.views.StaffOnDutyTodayDto;
import com.ras.dto.views.TodayLessonDto;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
public class TodayViewServiceImpl implements TodayViewService {

  private final NamedParameterJdbcTemplate jdbc;

  public TodayViewServiceImpl(NamedParameterJdbcTemplate jdbc) {
    this.jdbc = jdbc;
  }

  @Override
  public List<StaffOnDutyTodayDto> staffOnDutyToday(Long branchId) {
    String sql = """
      SELECT id, chi_nhanh_id, ma_chi_nhanh, chi_nhanh, nhan_vien,
             ngay_truc, gio_bat_dau, gio_ket_thuc,
             loai_ca, trang_thai_ca, trang_thai_runtime
      FROM v_staff_on_duty_today
      WHERE (:branchId IS NULL OR chi_nhanh_id = :branchId)
      ORDER BY gio_bat_dau, nhan_vien
    """;
    var params = new MapSqlParameterSource("branchId", branchId);
    return jdbc.query(sql, params, (rs, i) -> mapStaff(rs));
  }

  @Override
  public List<TodayLessonDto> todayLessons(Long branchId) {
    String sql = """
      SELECT buoi_hoc_id, lop_id, ten_lop, chi_nhanh_id, ma_chi_nhanh,
             bat_dau_luc, ket_thuc_luc, trang_thai_buoi,
             giao_vien_id, giao_vien, phong,
             so_dang_ky, so_diem_danh,
             ds_dang_ky, ds_co_mat, trang_thai_runtime
      FROM v_today_lessons
      WHERE (:branchId IS NULL OR chi_nhanh_id = :branchId)
      ORDER BY bat_dau_luc, ten_lop
    """;
    var params = new MapSqlParameterSource("branchId", branchId);
    return jdbc.query(sql, params, (rs, i) -> mapLesson(rs));
  }

  private StaffOnDutyTodayDto mapStaff(ResultSet rs) throws SQLException {
    return new StaffOnDutyTodayDto(
      rs.getLong("id"),
      rs.getLong("chi_nhanh_id"),
      rs.getString("ma_chi_nhanh"),
      rs.getString("chi_nhanh"),
      rs.getString("nhan_vien"),
      rs.getObject("ngay_truc", LocalDate.class),
      rs.getObject("gio_bat_dau", LocalTime.class),
      rs.getObject("gio_ket_thuc", LocalTime.class),
      rs.getString("loai_ca"),
      rs.getString("trang_thai_ca"),
      rs.getString("trang_thai_runtime")
    );
  }

  private TodayLessonDto mapLesson(ResultSet rs) throws SQLException {
    return new TodayLessonDto(
      rs.getLong("buoi_hoc_id"),
      rs.getLong("lop_id"),
      rs.getString("ten_lop"),
      rs.getLong("chi_nhanh_id"),
      rs.getString("ma_chi_nhanh"),
      rs.getObject("bat_dau_luc", LocalDateTime.class),
      rs.getObject("ket_thuc_luc", LocalDateTime.class),
      rs.getString("trang_thai_buoi"),
      (Long) rs.getObject("giao_vien_id"),
      rs.getString("giao_vien"),
      rs.getString("phong"),
      toInt(rs, "so_dang_ky"),
      toInt(rs, "so_diem_danh"),
      split(rs.getString("ds_dang_ky")),
      split(rs.getString("ds_co_mat")),
      rs.getString("trang_thai_runtime")
    );
  }

  private Integer toInt(ResultSet rs, String col) throws SQLException {
    Object o = rs.getObject(col);
    return o == null ? null : ((Number) o).intValue(); // an toàn cho BIGINT/INT
  }

  private List<String> split(String s) {
    if (s == null || s.isBlank()) return Collections.emptyList();
    return Arrays.stream(s.split("\\s*,\\s*"))
        .filter(t -> !t.isBlank())
        .toList();
  }
}
