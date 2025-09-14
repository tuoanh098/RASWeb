package com.ras.service.account;

import com.ras.domain.account.NguoiDungRepository;
import com.ras.service.account.dto.*;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional(readOnly = true)
public class AccountQueryServiceImpl implements AccountQueryService {

    private final AccountRepository repo;
    private final NguoiDungRepository jpaRepo;

    public AccountQueryServiceImpl(AccountRepository repo, NguoiDungRepository jpaRepo) {
        this.repo = repo;
        this.jpaRepo = jpaRepo;
    }

    @Override
    public Page<AccountListDto> list(String q, String vaiTroOrRole, Boolean activeOrHoatDong, Pageable pageable) {
        return repo.findPage(q, vaiTroOrRole, activeOrHoatDong, pageable).map(AccountMapper::toList);
    }

    @Override
    public AccountDetailDto get(Long id) {
        var e = jpaRepo.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy tài khoản"));
        return AccountMapper.toDetail(e);
    }
}
