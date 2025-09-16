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
        SELECT id, ma, ten, khoa_hoc_id, mon_hoc_id, loai_lop, thoi_luong_phut
        FROM khoa_hoc_mau
        /**WHERE**/
        ORDER BY id DESC
        LIMIT :lim
      """;
    String where = "";
    if (q != null && !q.isBlank()) {
      where = "WHERE (LOWER(ten) LIKE :kw OR LOWER(ma) LIKE :kw)";
    }
    Query query = em.createNativeQuery(sql.replace("/**WHERE**/", where));
    query.setParameter("lim", limit);
    if (!where.isEmpty()) query.setParameter("kw", "%" + q.toLowerCase(Locale.ROOT).trim() + "%");

    @SuppressWarnings("unchecked")
    List<Object[]> rows = query.getResultList();
    return mapRows(rows);
  }

  @Override
  @Transactional(readOnly = true)
  public CourseDTO templateDetail(Long id) {
    String sql = """
        SELECT id, ma, ten, khoa_hoc_id, mon_hoc_id, loai_lop, thoi_luong_phut
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
    String ten = normalizeTen(req);
    String sql = """
        INSERT INTO khoa_hoc_mau (ma, ten, mon_hoc_id, loai_lop, thoi_luong_phut, khoa_hoc_id)
        VALUES (:ma, :ten, :mon, :loai, :dur, :kh)
      """;
    em.createNativeQuery(sql)
        .setParameter("ma",  nullToEmpty(req.getMa()))
        .setParameter("ten", nullToEmpty(ten))
        .setParameter("mon", req.getMonHocId())
        .setParameter("loai", req.getLoaiLop() == null ? null : req.getLoaiLop().name())
        .setParameter("dur", req.getThoiLuongPhut())
        .setParameter("kh",  req.getKhoaHocId())
        .executeUpdate();
    Long id = ((Number) em.createNativeQuery("SELECT LAST_INSERT_ID()").getSingleResult()).longValue();
    return get(id);
  }

  @Override
  @Transactional(readOnly = true)
  public CourseDTO get(Long id) {
    String sql = """
        SELECT id, ma, ten, khoa_hoc_id, mon_hoc_id, loai_lop, thoi_luong_phut
        FROM khoa_hoc_mau WHERE id = :id
      """;
    Object[] r = (Object[]) em.createNativeQuery(sql)
        .setParameter("id", id)
        .getSingleResult();
    return mapRow(r);
  }

  @Override
  @Transactional
  public CourseDTO update(Long id, CourseUpsertDTO req) {
    String ten = normalizeTen(req);
    String sql = """
        UPDATE khoa_hoc_mau
        SET ma = :ma,
            ten = :ten,
            mon_hoc_id = :mon,
            loai_lop = :loai,
            thoi_luong_phut = :dur,
            khoa_hoc_id = :kh
        WHERE id = :id
      """;
    em.createNativeQuery(sql)
        .setParameter("ma",  nullToEmpty(req.getMa()))
        .setParameter("ten", nullToEmpty(ten))
        .setParameter("mon", req.getMonHocId())
        .setParameter("loai", req.getLoaiLop() == null ? null : req.getLoaiLop().name())
        .setParameter("dur", req.getThoiLuongPhut())
        .setParameter("kh",  req.getKhoaHocId())
        .setParameter("id",  id)
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
        SELECT id, ma, ten, khoa_hoc_id, mon_hoc_id, loai_lop, thoi_luong_phut
        FROM khoa_hoc_mau
        WHERE 1=1
      """);
    if (q != null && !q.isBlank())        sb.append(" AND (LOWER(ten) LIKE :kw OR LOWER(ma) LIKE :kw) ");
    if (monHocId != null)                  sb.append(" AND mon_hoc_id = :mon ");
    if (loaiLop != null)                   sb.append(" AND loai_lop = :loai ");
    if (thoiLuongPhut != null && thoiLuongPhut > 0)
                                           sb.append(" AND thoi_luong_phut = :dur ");
    sb.append(" ORDER BY id DESC LIMIT 200 ");

    Query query = em.createNativeQuery(sb.toString());
    if (q != null && !q.isBlank()) query.setParameter("kw", "%" + q.toLowerCase(Locale.ROOT).trim() + "%");
    if (monHocId != null)          query.setParameter("mon", monHocId);
    if (loaiLop != null)           query.setParameter("loai", loaiLop.name());
    if (thoiLuongPhut != null && thoiLuongPhut > 0) query.setParameter("dur", thoiLuongPhut);

    @SuppressWarnings("unchecked")
    List<Object[]> rows = query.getResultList();
    return mapRows(rows);
  }

  /* =================== Helpers =================== */

  private static String nullToEmpty(String s) { return s == null ? "" : s; }

  private static String normalizeTen(CourseUpsertDTO req) {
    if (req.getTen() != null && !req.getTen().isBlank()) return req.getTen();
    if (req.getTenHienThi() != null && !req.getTenHienThi().isBlank()) return req.getTenHienThi();
    if (req.getMa() != null && !req.getMa().isBlank()) return req.getMa();
    return "";
  }

  private List<CourseDTO> mapRows(List<Object[]> rows) {
    List<CourseDTO> out = new ArrayList<>(rows.size());
    for (Object[] r : rows) out.add(mapRow(r));
    return out;
  }

  private CourseDTO mapRow(Object[] r) {
    // 0:id, 1:ma, 2:ten, 3:khoa_hoc_id, 4:mon_hoc_id, 5:loai_lop, 6:thoi_luong_phut
    CourseDTO dto = new CourseDTO();
    dto.setId(                 r[0] == null ? null : ((Number) r[0]).longValue());
    dto.setMa(                 r[1] == null ? null : String.valueOf(r[1]));
    dto.setTen(                r[2] == null ? null : String.valueOf(r[2]));
    dto.setTenHienThi(         dto.getTen() != null && !dto.getTen().isBlank() ? dto.getTen() : dto.getMa());
    dto.setKhoaHocId(          r[3] == null ? null : ((Number) r[3]).longValue());
    dto.setMonHocId(           r[4] == null ? null : ((Number) r[4]).longValue());
    dto.setLoaiLop(            r[5] == null ? null : LoaiLop.valueOf(String.valueOf(r[5])));
    dto.setThoiLuongPhut(      r[6] == null ? null : ((Number) r[6]).shortValue());
    return dto;
  }
}
