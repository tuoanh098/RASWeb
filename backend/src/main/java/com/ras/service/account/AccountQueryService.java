package com.ras.service.account;

import com.ras.service.account.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AccountQueryService {
    Page<AccountListDto> list(String q, String vaiTroOrRole, Boolean activeOrHoatDong, Pageable pageable);
    AccountDetailDto get(Long id);
}
