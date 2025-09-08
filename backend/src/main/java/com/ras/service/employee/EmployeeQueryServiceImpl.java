package com.ras.service.employee;

import com.ras.dto.employee.EmployeeItemDto;
import com.ras.dto.common.PageResponse;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Service
public class EmployeeQueryServiceImpl implements EmployeeQueryService {

  private final NamedParameterJdbcTemplate jdbc;
  public EmployeeQueryServiceImpl(NamedParameterJdbcTemplate jdbc) { this.jdbc = jdbc; }

  @Override
  public PageResponse<EmployeeItemDto> search(String kw, int page, int size) {
    String like = "%" + (kw == null ? "" : kw.trim()) + "%";
    int offset = Math.max(0, page) * Math.max(1, size);

    String base =
      " FROM v_employees ve " +
      " WHERE (:kw = '' OR ve.ho_ten LIKE :like OR ve.so_dien_thoai LIKE :like OR ve.email LIKE :like OR ve.chuc_vu LIKE :like) ";

    var params = new MapSqlParameterSource()
      .addValue("kw", kw == null ? "" : kw.trim())
      .addValue("like", like)
      .addValue("limit", size)
      .addValue("offset", offset);

    Long total = jdbc.queryForObject("SELECT COUNT(*)" + base, params, Long.class);

    List<EmployeeItemDto> items = jdbc.query(
      "SELECT ve.id, ve.ho_ten, ve.so_dien_thoai, ve.email, ve.chuc_vu " + base +
      " ORDER BY ve.ho_ten ASC LIMIT :limit OFFSET :offset",
      params,
      (rs, i) -> map(rs)
    );

    int totalPages = (int) Math.ceil((total == null ? 0 : total) / (double) Math.max(1, size));
    return new PageResponse<>(items, total == null ? 0 : total, page, size, totalPages);
  }

  private EmployeeItemDto map(ResultSet rs) throws SQLException {
    return new EmployeeItemDto(
      rs.getLong("id"),
      rs.getString("ho_ten"),
      rs.getString("so_dien_thoai"),
      rs.getString("email"),
      rs.getString("chuc_vu")
    );
  }
}
