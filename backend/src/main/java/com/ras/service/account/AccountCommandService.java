package com.ras.service.account;

import com.ras.service.account.dto.AccountUpsertReq;

public interface AccountCommandService {
    Long create(AccountUpsertReq req);
    void update(Long id, AccountUpsertReq req);
    void delete(Long id);
    void resetPassword(Long id, String newPassword);
}
