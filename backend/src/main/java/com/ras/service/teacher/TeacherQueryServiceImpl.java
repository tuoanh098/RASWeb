package com.ras.service.teacher;

import com.ras.dto.common.PageResponse;
import com.ras.dto.teacher.TeacherSummaryDto;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeacherQueryServiceImpl implements TeacherQueryService {

  private final NamedParameterJdbcTemplate jdbc;
  public TeacherQueryServiceImpl(NamedParameterJdbcTemplate jdbc){ this.jdbc = jdbc; }

  @Override
  public PageResponse<TeacherSummaryDto> search(String keyword, Integer page, Integer size) {
    int p = page == null ? 0 : Math.max(0, page);
    int s = (size == null || size <= 0) ? 10 : size;
    String kw = (keyword == null || keyword.isBlank()) ? null : keyword.trim();

    String countSql = """
      SELECT COUNT(*)
      FROM giao_vien gv
      JOIN nguoi_dung nd ON nd.id = gv.id
      WHERE (:kw IS NULL OR nd.ho_ten LIKE CONCAT('%',:kw,'%') OR nd.so_dien_thoai LIKE CONCAT('%',:kw,'%'))
    """;

    String dataSql = """
      SELECT nd.id, nd.ho_ten, nd.email, nd.so_dien_thoai, gv.chuyen_mon, gv.he_so_luong,
             COALESCE(cnt.so_lop, 0) AS so_lop_dang_day
      FROM giao_vien gv
      JOIN nguoi_dung nd ON nd.id = gv.id
      LEFT JOIN (
        SELECT t.giao_vien_id, COUNT(DISTINCT t.lop_id) AS so_lop
        FROM (
          SELECT l.giao_vien_chinh_id AS giao_vien_id, l.id AS lop_id
          FROM lop l
          JOIN dang_ky_lop dk ON dk.lop_id = l.id AND dk.trang_thai = 'dang_hoc'
          WHERE l.trang_thai = 'dang_day'
          UNION ALL
          SELECT lg.giao_vien_id, l.id
          FROM lop l
          JOIN lop_giao_vien lg ON lg.lop_id = l.id
          JOIN dang_ky_lop dk ON dk.lop_id = l.id AND dk.trang_thai = 'dang_hoc'
          WHERE l.trang_thai = 'dang_day'
        ) t
        GROUP BY t.giao_vien_id
      ) cnt ON cnt.giao_vien_id = gv.id
      WHERE (:kw IS NULL OR nd.ho_ten LIKE CONCAT('%',:kw,'%') OR nd.so_dien_thoai LIKE CONCAT('%',:kw,'%'))
      ORDER BY nd.ho_ten
      LIMIT :limit OFFSET :offset
    """;

    var countParams = new MapSqlParameterSource().addValue("kw", kw);
    Long totalObj = jdbc.queryForObject(countSql, countParams, Long.class);
    long total = totalObj == null ? 0L : totalObj;

    var dataParams = new MapSqlParameterSource()
        .addValue("kw", kw)
        .addValue("limit", s)
        .addValue("offset", p * s);

    List<TeacherSummaryDto> items = jdbc.query(dataSql, dataParams, (rs,i) -> new TeacherSummaryDto(
      rs.getLong("id"),
      rs.getString("ho_ten"),
      rs.getString("email"),
      rs.getString("so_dien_thoai"),
      rs.getString("chuyen_mon"),
      rs.getObject("he_so_luong") == null ? null : rs.getDouble("he_so_luong"),
      ((Number) rs.getObject("so_lop_dang_day")).intValue()
    ));

    int totalPages = (int) Math.ceil(total / (double) s);
    return new PageResponse<>(items, total, p, s, totalPages);
  }
}
