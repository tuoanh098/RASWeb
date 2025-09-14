package com.ras.service.account.dto;

public record AccountUpsertReq(
    String username,
    String email,
    String new_password,

    // chấp nhận cả 2 khoá tên, ưu tiên *tiếng Việt*
    String vai_tro,
    String role,

    Long id_nhan_vien,

    Boolean hoat_dong,
    Boolean active
) {}
