package com.ras.service.course;

import com.ras.domain.course.LoaiLop;
import com.ras.service.course.dto.CourseDTO;
import com.ras.service.course.dto.CourseUpsertDTO;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

  private final EntityManager em;

  /* ============ Templates for quick selection ============ */

  @Override
  @Transactional(readOnly = true)
  public List<CourseDTO> searchTemplates(String q, int size) {
    int limit = Math.max(1, Math.min(size, 200));
    String sql = """
        SELECT
          id,
          NULL           AS ma,
          mo_ta          AS ten,
          khoa_hoc_id,
          mon_hoc_id,
          loai_lop,
          thoi_luong_phut
        FROM khoa_hoc_mau
        /**WHERE**/
        ORDER BY id DESC
        LIMIT :lim
      """;
    String where = "";
    if (q != null && !q.isBlank()) {
      where = "WHERE (LOWER(mo_ta) LIKE :kw)";
    }
    Query query = em.createNativeQuery(sql.replace("/**WHERE**/", where));
    query.setParameter("lim", limit);
    if (!where.isEmpty()) {
      query.setParameter("kw", "%" + q.toLowerCase(Locale.ROOT).trim() + "%");
    }
    @SuppressWarnings("unchecked")
    List<Object[]> rows = query.getResultList();
    return mapRows(rows);
  }

  @Override
  @Transactional(readOnly = true)
  public CourseDTO templateDetail(Long id) {
    String sql = """
        SELECT
          id,
          NULL           AS ma,
          mo_ta          AS ten,
          khoa_hoc_id,
          mon_hoc_id,
          loai_lop,
          thoi_luong_phut
        FROM khoa_hoc_mau
        WHERE id = :id
      """;
    Object[] r = (Object[]) em.createNativeQuery(sql)
        .setParameter("id", id)
        .getSingleResult();
    return mapRow(r);
  }

  /* =================== CRUD + search ===================== */

  @Override
  @Transactional
  public CourseDTO create(CourseUpsertDTO req) {
    String tenHienThi = normalizeTen(req);

    String sql = """
        INSERT INTO khoa_hoc_mau
          (mon_hoc_id, loai_lop, thoi_luong_phut, mo_ta, khoa_hoc_id)
        VALUES
          (:mon, :loai, :dur, :mota, :kh)
      """;
    em.createNativeQuery(sql)
        .setParameter("mon",  req.getMonHocId())
        .setParameter("loai", req.getLoaiLop())   // <<< ghi theo format DB
        .setParameter("dur",  req.getThoiLuongPhut())
        .setParameter("mota", tenHienThi)
        .setParameter("kh",   req.getKhoaHocId())
        .executeUpdate();

    Long id = ((Number) em.createNativeQuery("SELECT LAST_INSERT_ID()").getSingleResult()).longValue();
    return get(id);
  }

  @Override
  @Transactional(readOnly = true)
  public CourseDTO get(Long id) {
    return templateDetail(id);
  }

  @Override
  @Transactional
  public CourseDTO update(Long id, CourseUpsertDTO req) {
    String tenHienThi = normalizeTen(req);
    String sql = """
        UPDATE khoa_hoc_mau
        SET mon_hoc_id       = :mon,
            loai_lop         = :loai,
            thoi_luong_phut  = :dur,
            mo_ta            = :mota,
            khoa_hoc_id      = :kh
        WHERE id = :id
      """;
    em.createNativeQuery(sql)
        .setParameter("mon",  req.getMonHocId())
        .setParameter("loai", req.getLoaiLop())   // <<< ghi theo format DB
        .setParameter("dur",  req.getThoiLuongPhut())
        .setParameter("mota", tenHienThi)
        .setParameter("kh",   req.getKhoaHocId())
        .setParameter("id",   id)
        .executeUpdate();

    return get(id);
  }

  @Override
  @Transactional
  public void delete(Long id) {
    em.createNativeQuery("DELETE FROM khoa_hoc_mau WHERE id = :id")
        .setParameter("id", id)
        .executeUpdate();
  }

  @Override
  @Transactional(readOnly = true)
  public List<CourseDTO> search(String q, Long monHocId, LoaiLop loaiLop, Short thoiLuongPhut) {
    StringBuilder sb = new StringBuilder("""
        SELECT
          id,
          NULL           AS ma,
          mo_ta          AS ten,
          khoa_hoc_id,
          mon_hoc_id,
          loai_lop,
          thoi_luong_phut
        FROM khoa_hoc_mau
        WHERE 1=1
      """);
    if (q != null && !q.isBlank())        sb.append(" AND (LOWER(mo_ta) LIKE :kw) ");
    if (monHocId != null)                  sb.append(" AND mon_hoc_id = :mon ");
    if (loaiLop != null)                   sb.append(" AND loai_lop = :loai ");  // so sánh theo giá trị DB
    if (thoiLuongPhut != null && thoiLuongPhut > 0)
                                           sb.append(" AND thoi_luong_phut = :dur ");
    sb.append(" ORDER BY id DESC LIMIT 200 ");

    Query query = em.createNativeQuery(sb.toString());
    if (q != null && !q.isBlank()) query.setParameter("kw", "%" + q.toLowerCase(Locale.ROOT).trim() + "%");
    if (monHocId != null)          query.setParameter("mon", monHocId);
    if (loaiLop != null)           query.setParameter("loai", loaiLop);  // <<< param theo DB
    if (thoiLuongPhut != null && thoiLuongPhut > 0) query.setParameter("dur", thoiLuongPhut);

    @SuppressWarnings("unchecked")
    List<Object[]> rows = query.getResultList();
    return mapRows(rows);
  }

  /* =================== Helpers =================== */

  private static String normalizeTen(CourseUpsertDTO req) {
    if (req.getMoTa() != null && !req.getMoTa().isBlank()) return req.getMoTa();
    if (req.getTenHienThi() != null && !req.getTenHienThi().isBlank()) return req.getTenHienThi();
    if (req.getTen() != null && !req.getTen().isBlank()) return req.getTen();
    if (req.getMa() != null && !req.getMa().isBlank()) return req.getMa();
    return "";
  }

  /** Map DB string -> Enum (chịu các biến thể: ca_nhan/canhan; nhom/nhom2) */
  private static LoaiLop toEnumLoaiLop(Object val) {
    if (val == null) return null;
    String s = String.valueOf(val).trim().toLowerCase(Locale.ROOT);
    switch (s) {
      case "ca_nhan":
      case "canhan":
      case "private":
        return LoaiLop.ca_nhan;
      case "nhom":
      case "nhom2":
      case "group":
        // nếu bạn có Enum NHOM_2 thì đổi tại đây
        return LoaiLop.nhom2;
      default:
        try {
          return LoaiLop.valueOf(s.toUpperCase(Locale.ROOT));  // fallback nếu DB đã lưu UPPER_CASE
        } catch (Exception ignore) {
          return null;
        }
    }
  }


  private List<CourseDTO> mapRows(List<Object[]> rows) {
    List<CourseDTO> out = new ArrayList<>(rows.size());
    for (Object[] r : rows) out.add(mapRow(r));
    return out;
  }

  private CourseDTO mapRow(Object[] r) {
    // 0:id, 1:ma(NULL), 2:ten(=mo_ta), 3:khoa_hoc_id, 4:mon_hoc_id, 5:loai_lop, 6:thoi_luong_phut
    CourseDTO dto = new CourseDTO();
    dto.setId(            r[0] == null ? null : ((Number) r[0]).longValue());
    dto.setMa(            null);
    dto.setTen(           r[2] == null ? null : String.valueOf(r[2]));
    dto.setTenHienThi(    dto.getTen());
    dto.setKhoaHocId(     r[3] == null ? null : ((Number) r[3]).longValue());
    dto.setMonHocId(      r[4] == null ? null : ((Number) r[4]).longValue());
    dto.setLoaiLop(       toEnumLoaiLop(r[5]));                   // <<< parse an toàn
    dto.setThoiLuongPhut( r[6] == null ? null : ((Number) r[6]).shortValue());
    return dto;
  }

}
