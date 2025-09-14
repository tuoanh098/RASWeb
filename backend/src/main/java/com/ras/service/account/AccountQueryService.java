package com.ras.service.account;

import com.ras.service.account.dto.AccountDetailDto;
import com.ras.service.account.dto.AccountListDto;
import org.springframework.data.domain.Page;

public interface AccountQueryService {
    Page<AccountListDto> list(String kw, String role, int page, int size, Boolean active);
    AccountDetailDto get(Long id);
}
