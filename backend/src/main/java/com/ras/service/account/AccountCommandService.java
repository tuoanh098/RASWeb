package com.ras.service.account;

import com.ras.service.account.dto.*;

public interface AccountCommandService {
    AccountDetailDto create(AccountUpsertReq req);
    AccountDetailDto update(Long id, AccountUpsertReq req);
    void delete(Long id);
    void changePassword(Long id, String newPassword);
}
    