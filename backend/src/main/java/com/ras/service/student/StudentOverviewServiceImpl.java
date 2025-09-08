package com.ras.service.student;

import com.ras.dto.common.PageResponse;
import com.ras.dto.student.StudentListItemDto;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class StudentOverviewServiceImpl implements StudentOverviewService {

  private final NamedParameterJdbcTemplate jdbc;
  public StudentOverviewServiceImpl(NamedParameterJdbcTemplate jdbc){ this.jdbc = jdbc; }

  @Override
  public PageResponse<StudentListItemDto> list(Integer page, Integer size, String q) {
    String sql = "SELECT hoc_vien_id, hoc_sinh, thoi_gian_bat_dau_hoc, hs_phone, phu_huynh, phu_huynh_phone, " +
                 "       nhan_vien_ho_tro, chi_nhanh_ho_tro, so_lop_dang_hoc, giao_vien_dang_day " +
                 "FROM v_student_overview";
    List<StudentListItemDto> all = jdbc.query(sql, (rs,i) -> map(rs));

    if (q != null && !q.isBlank()) {
      String query = q.toLowerCase(Locale.ROOT);
      all = all.stream().filter(s ->
        (s.hoc_sinh() != null && s.hoc_sinh().toLowerCase(Locale.ROOT).contains(query)) ||
        (s.hs_phone() != null && s.hs_phone().toLowerCase(Locale.ROOT).contains(query))
      ).collect(Collectors.toList());
    }

    int total = all.size();
    int from = Math.max(0, page * size);
    int to = Math.min(total, from + size);
    List<StudentListItemDto> items = from >= total ? List.of() : all.subList(from, to);
    int totalPages = (int) Math.ceil(total / (double) size);
    return new PageResponse<>(items, total, page, size, totalPages);
  }

  private StudentListItemDto map(ResultSet rs) throws SQLException {
    Long id = (Long) rs.getObject("hoc_vien_id");
    String name = rs.getString("hoc_sinh");
    LocalDate start = rs.getObject("thoi_gian_bat_dau_hoc", LocalDate.class);
    String phone = rs.getString("hs_phone");
    String parent = rs.getString("phu_huynh");
    String parentPhone = rs.getString("phu_huynh_phone");
    String supporter = rs.getString("nhan_vien_ho_tro");
    String branch = rs.getString("chi_nhanh_ho_tro");
    Integer classCount = getInt(rs, "so_lop_dang_hoc");   // ⬅️ an toàn
    String teachers = rs.getString("giao_vien_dang_day");
    return new StudentListItemDto(id, name, start, phone, parent, parentPhone, supporter, branch, classCount, teachers);
  }

  private Integer getInt(ResultSet rs, String col) throws SQLException {
    Object o = rs.getObject(col);
    return o == null ? null : ((Number) o).intValue();
  }
}


