package com.ras.service.account.dto;

import java.time.LocalDateTime;

public record AccountListDto(
    Long id,
    String username,
    String email,

    // tên đúng DB
    String vai_tro,
    Boolean hoat_dong,
    LocalDateTime lan_dang_nhap_cuoi,
    Long id_nhan_vien,

    // alias giữ tương thích FE cũ
    String role,
    Boolean active,
    LocalDateTime last_login
) {}
