package com.ras.service.course;

import com.ras.domain.course.KhoaHoc;
import com.ras.domain.course.LoaiLop;
import com.ras.domain.course.MonHoc;
import jakarta.persistence.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class KhoaHocService {

    private final EntityManager em;

    public KhoaHocService(EntityManager em) { this.em = em; }

    // -------- Search + Pagination + Sorting ----------
    public PageResult<KhoaHoc> search(String q, Long monHocId, String loaiLopStr,
                                      int page, int size, String sort) {
        LoaiLop loai = parseLoaiLop(loaiLopStr);

        StringBuilder jpql = new StringBuilder("SELECT kh FROM KhoaHoc kh WHERE 1=1");
        StringBuilder jpqlCount = new StringBuilder("SELECT COUNT(kh) FROM KhoaHoc kh WHERE 1=1");
        Map<String,Object> params = new HashMap<>();

        if (monHocId != null) {
            jpql.append(" AND kh.monHoc.id = :monHocId");
            jpqlCount.append(" AND kh.monHoc.id = :monHocId");
            params.put("monHocId", monHocId);
        }
        if (loai != null) {
            jpql.append(" AND kh.loaiLop = :loai");
            jpqlCount.append(" AND kh.loaiLop = :loai");
            params.put("loai", loai);
        }
        if (q != null && !q.isBlank()) {
            jpql.append(" AND (LOWER(kh.ma) LIKE :q OR LOWER(kh.tenHienThi) LIKE :q)");
            jpqlCount.append(" AND (LOWER(kh.ma) LIKE :q OR LOWER(kh.tenHienThi) LIKE :q)");
            params.put("q", "%" + q.toLowerCase().trim() + "%");
        }

        String orderBy = mapSort(sort);
        jpql.append(" ORDER BY ").append(orderBy.isBlank() ? "kh.id ASC" : orderBy);

        TypedQuery<KhoaHoc> query = em.createQuery(jpql.toString(), KhoaHoc.class);
        TypedQuery<Long> queryCount = em.createQuery(jpqlCount.toString(), Long.class);
        params.forEach((k,v) -> { query.setParameter(k,v); queryCount.setParameter(k,v); });

        int safePage = Math.max(page, 0);
        int safeSize = Math.max(size, 1);
        query.setFirstResult(safePage * safeSize);
        query.setMaxResults(safeSize);

        List<KhoaHoc> items = query.getResultList();
        long total = queryCount.getSingleResult();
        int totalPages = (int) Math.ceil((double) total / safeSize);

        return new PageResult<>(items, safePage, safeSize, total, totalPages);
    }

    // -------- Read ----------
    public KhoaHoc getById(Long id) {
        KhoaHoc kh = em.find(KhoaHoc.class, id);
        if (kh == null) throw new EntityNotFoundException("Không tìm thấy khóa học id=" + id);
        return kh;
    }

    // -------- Create ----------
    @Transactional
    public KhoaHoc create(Long monHocId, String loaiLopStr, Integer thoiLuongPhut, String ma, String tenHienThi) {
        if (monHocId == null) throw new IllegalArgumentException("mon_hoc_id là bắt buộc");
        if (thoiLuongPhut == null || thoiLuongPhut < 1) throw new IllegalArgumentException("thoi_luong_phut không hợp lệ");
        if (tenHienThi == null || tenHienThi.isBlank()) throw new IllegalArgumentException("ten_hien_thi là bắt buộc");

        LoaiLop loai = requireLoaiLop(loaiLopStr);

        if (existsCombo(monHocId, loai, thoiLuongPhut))
            throw new IllegalArgumentException("Bộ (mon_hoc_id, loai_lop, thoi_luong_phut) đã tồn tại.");

        if (ma != null && !ma.isBlank() && existsMa(ma))
            throw new IllegalArgumentException("Mã khóa học đã tồn tại: " + ma);

        KhoaHoc kh = new KhoaHoc();
        MonHoc mon = em.getReference(MonHoc.class, monHocId);
        kh.setMonHoc(mon);
        kh.setLoaiLop(loai);
        kh.setThoiLuongPhut(thoiLuongPhut);
        kh.setMa(isBlank(ma) ? null : ma.trim());
        kh.setTenHienThi(tenHienThi.trim());

        em.persist(kh);
        em.flush();
        return kh;
    }

    // -------- Update ----------
    @Transactional
    public KhoaHoc update(Long id, Long monHocId, String loaiLopStr, Integer thoiLuongPhut, String ma, String tenHienThi) {
        KhoaHoc kh = getById(id);

        if (monHocId == null) throw new IllegalArgumentException("mon_hoc_id là bắt buộc");
        if (thoiLuongPhut == null || thoiLuongPhut < 1) throw new IllegalArgumentException("thoi_luong_phut không hợp lệ");
        if (tenHienThi == null || tenHienThi.isBlank()) throw new IllegalArgumentException("ten_hien_thi là bắt buộc");

        LoaiLop loai = requireLoaiLop(loaiLopStr);

        if (existsCombo(monHocId, loai, thoiLuongPhut)) {
            boolean sameAsSelf = kh.getMonHoc().getId().equals(monHocId)
                    && kh.getLoaiLop() == loai
                    && kh.getThoiLuongPhut().equals(thoiLuongPhut);
            if (!sameAsSelf) throw new IllegalArgumentException("Bộ (mon_hoc_id, loai_lop, thoi_luong_phut) đã tồn tại.");
        }

        if (!isBlank(ma) && existsMaOther(ma, id))
            throw new IllegalArgumentException("Mã khóa học đã tồn tại: " + ma);

        kh.setMonHoc(em.getReference(MonHoc.class, monHocId));
        kh.setLoaiLop(loai);
        kh.setThoiLuongPhut(thoiLuongPhut);
        kh.setMa(isBlank(ma) ? null : ma.trim());
        kh.setTenHienThi(tenHienThi.trim());

        em.merge(kh);
        em.flush();
        return kh;
    }

    // -------- Delete ----------
    @Transactional
    public void delete(Long id) {
        KhoaHoc kh = em.find(KhoaHoc.class, id);
        if (kh == null) throw new EntityNotFoundException("Không tìm thấy khóa học id=" + id);
        em.remove(kh);
        em.flush();
    }

    // -------- Helpers ----------
    private boolean isBlank(String s){ return s == null || s.isBlank(); }

    private LoaiLop parseLoaiLop(String s) {
        if (s == null || s.isBlank()) return null;
        return requireLoaiLop(s);
    }

    private LoaiLop requireLoaiLop(String s) {
        try {
            return LoaiLop.valueOf(s);
        } catch (Exception ex) {
            throw new IllegalArgumentException("loai_lop không hợp lệ. Hợp lệ: ca_nhan, nhom2, nhom5");
        }
    }

    private boolean existsCombo(Long monHocId, LoaiLop loai, Integer thoiLuongPhut) {
        Long c = em.createQuery("""
                SELECT COUNT(kh) FROM KhoaHoc kh
                WHERE kh.monHoc.id = :monHocId AND kh.loaiLop = :loai AND kh.thoiLuongPhut = :tl
                """, Long.class)
                .setParameter("monHocId", monHocId)
                .setParameter("loai", loai)
                .setParameter("tl", thoiLuongPhut)
                .getSingleResult();
        return c != null && c > 0;
    }

    private boolean existsMa(String ma) {
        Long c = em.createQuery("SELECT COUNT(kh) FROM KhoaHoc kh WHERE kh.ma = :ma", Long.class)
                .setParameter("ma", ma)
                .getSingleResult();
        return c != null && c > 0;
    }

    private boolean existsMaOther(String ma, Long excludeId) {
        Long c = em.createQuery("SELECT COUNT(kh) FROM KhoaHoc kh WHERE kh.ma = :ma AND kh.id <> :id", Long.class)
                .setParameter("ma", ma)
                .setParameter("id", excludeId)
                .getSingleResult();
        return c != null && c > 0;
    }

    /** Map sort FE -> JPQL field. Ex: "ten_hien_thi,asc" */
    private String mapSort(String sort) {
        if (sort == null || sort.isBlank()) return "";
        String[] parts = sort.split(",", 2);
        String field = parts[0].trim();
        String dir = (parts.length > 1 ? parts[1].trim() : "asc");
        String mapped = switch (field) {
            case "id" -> "kh.id";
            case "mon_hoc_id" -> "kh.monHoc.id";
            case "loai_lop" -> "kh.loaiLop";
            case "thoi_luong_phut" -> "kh.thoiLuongPhut";
            case "ma" -> "kh.ma";
            case "ten_hien_thi" -> "kh.tenHienThi";
            default -> "kh.id";
        };
        return mapped + ("desc".equalsIgnoreCase(dir) ? " DESC" : " ASC");
    }

    public record PageResult<T>(List<T> items, int page, int size, long totalElements, int totalPages) {}
}
