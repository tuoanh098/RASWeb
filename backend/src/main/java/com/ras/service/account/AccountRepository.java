package com.ras.service.account;

import com.ras.domain.account.NguoiDung;
import jakarta.persistence.*;
import jakarta.persistence.criteria.*;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Repository;
import java.util.ArrayList;
import java.util.List;

@Repository
public class AccountRepository {
    @PersistenceContext
    private EntityManager em;

    public Page<NguoiDung> findPage(String q, String roleOrVaiTro, Boolean activeOrHoatDong, Pageable pageable) {
        CriteriaBuilder cb = em.getCriteriaBuilder();

        // count
        CriteriaQuery<Long> cqCount = cb.createQuery(Long.class);
        Root<NguoiDung> rc = cqCount.from(NguoiDung.class);
        var pc = build(cb, rc, q, roleOrVaiTro, activeOrHoatDong);
        cqCount.select(cb.count(rc)).where(pc.toArray(Predicate[]::new));
        long total = em.createQuery(cqCount).getSingleResult();

        // data
        CriteriaQuery<NguoiDung> cq = cb.createQuery(NguoiDung.class);
        Root<NguoiDung> r = cq.from(NguoiDung.class);
        var ps = build(cb, r, q, roleOrVaiTro, activeOrHoatDong);
        cq.select(r).where(ps.toArray(Predicate[]::new)).orderBy(cb.desc(r.get("id")));
        List<NguoiDung> content = em.createQuery(cq)
            .setFirstResult((int) pageable.getOffset())
            .setMaxResults(pageable.getPageSize())
            .getResultList();

        return new PageImpl<>(content, pageable, total);
    }

    private List<Predicate> build(CriteriaBuilder cb, Root<NguoiDung> r, String q, String roleOrVaiTro, Boolean activeOrHoatDong) {
        List<Predicate> ps = new ArrayList<>();
        if (q != null && !q.isBlank()) {
            String like = "%" + q.toLowerCase() + "%";
            ps.add(cb.or(
                cb.like(cb.lower(r.get("username")), like),
                cb.like(cb.lower(r.get("email")), like),
                cb.like(cb.lower(r.get("vaiTro")), like)
            ));
        }
        if (roleOrVaiTro != null && !roleOrVaiTro.isBlank()) {
            ps.add(cb.equal(r.get("vaiTro"), roleOrVaiTro));
        }
        if (activeOrHoatDong != null) {
            ps.add(cb.equal(r.get("hoatDong"), activeOrHoatDong));
        }
        return ps;
    }
}
