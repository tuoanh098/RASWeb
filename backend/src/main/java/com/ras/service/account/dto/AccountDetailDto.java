package com.ras.service.account.dto;

import java.time.LocalDateTime;

public class AccountDetailDto {
    public Long id;
    public String username;
    public String email;
    public String vai_tro;
    public Boolean hoat_dong;
    public LocalDateTime lan_dang_nhap_cuoi;
    public Long id_nhan_vien;
    public String ho_ten_nhan_vien;

    public LocalDateTime ngay_tao;
    public LocalDateTime ngay_sua;
}
