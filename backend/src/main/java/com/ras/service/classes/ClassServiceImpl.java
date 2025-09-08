package com.ras.service.classes;

import com.ras.dto.common.PageResponse;
import com.ras.dto.classes.ClassListItemDto;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Service
public class ClassServiceImpl implements ClassService {

  private final NamedParameterJdbcTemplate jdbc;
  public ClassServiceImpl(NamedParameterJdbcTemplate jdbc){ this.jdbc = jdbc; }

  @SuppressWarnings("null")
  @Override
  public PageResponse<ClassListItemDto> list(Integer page, Integer size, Long branchId, String q) {
    int p = page == null ? 0 : page;
    int s = (size == null || size <= 0) ? 10 : size;
    int offset = p * s;

    String baseWhere = " WHERE (:branchId IS NULL OR l.chi_nhanh_id = :branchId) " +
                       "   AND (:q IS NULL OR l.ten_lop LIKE CONCAT('%', :q, '%')) ";

    String sql = """
      SELECT l.id AS lop_id, l.ten_lop, l.mon_hoc, l.chi_nhanh_id,
             cn.ma AS ma_chi_nhanh, cn.ten AS chi_nhanh,
             l.giao_vien_chinh_id AS giao_vien_id, ndgv.ho_ten AS giao_vien,
             l.trang_thai,
             (SELECT COUNT(DISTINCT dk.hoc_vien_id)
                FROM dang_ky_lop dk
               WHERE dk.lop_id = l.id AND dk.trang_thai = 'dang_hoc') AS so_hoc_vien
        FROM lop l
        JOIN chi_nhanh cn ON cn.id = l.chi_nhanh_id
   LEFT JOIN nguoi_dung ndgv ON ndgv.id = l.giao_vien_chinh_id
      """ + baseWhere + """
    ORDER BY l.ten_lop
       LIMIT :limit OFFSET :offset
    """;

    String sqlCount = "SELECT COUNT(*) FROM lop l " + baseWhere;

    MapSqlParameterSource params = new MapSqlParameterSource()
        .addValue("branchId", branchId)
        .addValue("q", (q == null || q.isBlank()) ? null : q.trim())
        .addValue("limit", s)
        .addValue("offset", offset);

    List<ClassListItemDto> items = jdbc.query(sql, params, (rs, i) -> map(rs));
    int total = jdbc.queryForObject(sqlCount, params, Integer.class);
    int totalPages = (int) Math.ceil(total / (double) s);

    return new PageResponse<>(items, total, p, s, totalPages);
  }

  private ClassListItemDto map(ResultSet rs) throws SQLException {
    return new ClassListItemDto(
      rs.getLong("lop_id"),
      rs.getString("ten_lop"),
      rs.getString("mon_hoc"),
      rs.getLong("chi_nhanh_id"),
      rs.getString("ma_chi_nhanh"),
      rs.getString("chi_nhanh"),
      (Long) rs.getObject("giao_vien_id"),
      rs.getString("giao_vien"),
      rs.getString("trang_thai"),
      getInt(rs, "so_hoc_vien")
    );
  }

  private Integer getInt(ResultSet rs, String col) throws SQLException {
    Object o = rs.getObject(col);
    return o == null ? null : ((Number) o).intValue();  // an toàn cho BIGINT/INT
  }
  
}


