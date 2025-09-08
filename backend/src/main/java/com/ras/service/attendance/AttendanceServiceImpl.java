package com.ras.service.attendance;

import com.ras.dto.attendance.AttendanceRowDto;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class AttendanceServiceImpl implements AttendanceService {

  private final NamedParameterJdbcTemplate jdbc;

  public AttendanceServiceImpl(NamedParameterJdbcTemplate jdbc) {
    this.jdbc = jdbc;
  }

  @Override
  public List<AttendanceRowDto> loadTeachers(LocalDate weekStart, Long branchId, String q) {
    LocalDate weekEnd = weekStart.plusDays(6);

    // 1) Lấy danh sách GV, ưu tiên GV có lịch dạy hôm nay
    String sqlTeachers =
        "SELECT gv.id AS id, nd.ho_ten AS name, " +
        "       CASE WHEN t.giao_vien_id IS NOT NULL THEN 0 ELSE 1 END AS prio " +
        "FROM giao_vien gv " +
        "JOIN nguoi_dung nd ON nd.id = gv.id " +
        "LEFT JOIN (SELECT DISTINCT giao_vien_id " +
        "           FROM v_today_lessons " +
        "           WHERE DATE(bat_dau_luc)=CURRENT_DATE() " +
        "             AND (:branchId IS NULL OR chi_nhanh_id=:branchId)) t " +
        "       ON t.giao_vien_id = gv.id " +
        "WHERE (:q IS NULL OR nd.ho_ten LIKE CONCAT('%',:q,'%') OR nd.so_dien_thoai LIKE CONCAT('%',:q,'%')) " +
        "ORDER BY prio, nd.ho_ten";
    var params = new MapSqlParameterSource()
        .addValue("branchId", branchId)
        .addValue("q", (q == null || q.isBlank()) ? null : q.trim());
    List<Map<String,Object>> rows = jdbc.queryForList(sqlTeachers, params);

    if (rows.isEmpty()) return List.of();

    List<Long> teacherIds = rows.stream().map(r -> ((Number) r.get("id")).longValue()).toList();

    // 2) Lấy mã điểm danh trong tuần
    String sqlCodes =
        "SELECT giao_vien_id, ngay, ma " +
        "FROM diem_danh_gv " +
        "WHERE giao_vien_id IN (:ids) " +
        "  AND ngay BETWEEN :ws AND :we";
    var p2 = new MapSqlParameterSource()
        .addValue("ids", teacherIds)
        .addValue("ws", weekStart)
        .addValue("we", weekEnd);

    Map<Long, Map<LocalDate, String>> map = new HashMap<>();
    jdbc.query(sqlCodes, p2, (ResultSet rs) -> {
      Long id = rs.getLong("giao_vien_id");
      LocalDate d = rs.getObject("ngay", LocalDate.class);
      String c = rs.getString("ma");
      map.computeIfAbsent(id, _k -> new HashMap<>()).put(d, c);
    });

    // 3) Kết hợp -> trả về 7 mã theo thứ 2..CN
    return rows.stream().map(r -> {
      Long id = ((Number) r.get("id")).longValue();
      String name = Objects.toString(r.get("name"), "");
      Map<LocalDate,String> codesByDate = map.getOrDefault(id, Collections.emptyMap());
      List<String> codes = IntStream.range(0, 7)
          .mapToObj(i -> codesByDate.getOrDefault(weekStart.plusDays(i), ""))
          .collect(Collectors.toList());
      return new AttendanceRowDto(id, name, codes);
    }).toList();
  }

  @Override
  public void saveTeachers(LocalDate weekStart, List<AttendanceRowDto> rows) {
    // Chuẩn bị batch upsert / delete theo từng ngày
    List<Object[]> upserts = new ArrayList<>();
    List<Object[]> deletes = new ArrayList<>();

    for (AttendanceRowDto r : rows) {
      for (int i = 0; i < 7; i++) {
        LocalDate d = weekStart.plusDays(i);
        String code = (r.getCodes()!=null && r.getCodes().size()>i) ? Optional.ofNullable(r.getCodes().get(i)).orElse("").trim() : "";
        if (code.isEmpty()) {
          deletes.add(new Object[]{ r.getId(), d });
        } else {
          upserts.add(new Object[]{ r.getId(), d, code });
        }
      }
    }
    // INSERT ... ON DUPLICATE KEY UPDATE
    if (!upserts.isEmpty()) {
      String ins = "INSERT INTO diem_danh_gv (giao_vien_id, ngay, ma) VALUES (?, ?, ?) " +
                   "ON DUPLICATE KEY UPDATE ma=VALUES(ma)";
      jdbc.getJdbcTemplate().batchUpdate(ins, upserts);
    }
    if (!deletes.isEmpty()) {
      String del = "DELETE FROM diem_danh_gv WHERE giao_vien_id=? AND ngay=?";
      jdbc.getJdbcTemplate().batchUpdate(del, deletes);
    }
  }
}
