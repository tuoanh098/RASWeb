package com.ras.service.account;

import com.ras.domain.account.*;
import com.ras.service.account.dto.*;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.*;
import java.util.List;

@Service
public class AccountQueryServiceImpl implements AccountQueryService {

    private final AccountRepository repo;
    private final EntityManager em;

    public AccountQueryServiceImpl(AccountRepository repo, EntityManager em) {
        this.repo = repo; this.em = em;
    }

    @Override
    public Page<AccountListDto> list(String kw, String role, int page, int size, Boolean active) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<NguoiDung> cq = cb.createQuery(NguoiDung.class);
        Root<NguoiDung> root = cq.from(NguoiDung.class);

        Predicate p = cb.conjunction();
        if (kw != null && !kw.isBlank()) {
            String like = "%" + kw.trim().toLowerCase() + "%";
            p = cb.and(p, cb.or(
                    cb.like(cb.lower(root.get("username")), like),
                    cb.like(cb.lower(root.get("email")), like),
                    cb.like(cb.lower(root.join("nhanVien").get("hoTen")), like)
            ));
        }
        if (role != null && !role.isBlank()) p = cb.and(p, cb.equal(root.get("vaiTro"), role));
        if (active != null) p = cb.and(p, cb.equal(root.get("hoatDong"), active));

        cq.where(p).orderBy(cb.desc(root.get("id")));

        List<NguoiDung> rows = em.createQuery(cq)
                .setFirstResult(page * size)
                .setMaxResults(size)
                .getResultList();

        long total = em.createQuery(
                cb.createQuery(Long.class).select(cb.count(root)).where(p)
        ).getSingleResult();

        var items = rows.stream().map(AccountMapper::toList).toList();
        return new PageImpl<>(items, PageRequest.of(page, size), total);
    }

    @Override
    public AccountDetailDto get(Long id) {
        var e = repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Account not found: " + id));
        return AccountMapper.toDetail(e);
    }
}
