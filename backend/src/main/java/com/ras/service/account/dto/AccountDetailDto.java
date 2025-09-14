package com.ras.service.account.dto;

import java.time.LocalDateTime;

public record AccountDetailDto(
    Long id,
    String username,
    String email,

    String vai_tro,
    Boolean hoat_dong,
    LocalDateTime lan_dang_nhap_cuoi,
    Long id_nhan_vien,

    String role,
    Boolean active,
    LocalDateTime last_login,

    LocalDateTime ngay_tao,
    LocalDateTime ngay_sua
) {}
