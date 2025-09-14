package com.ras.service.account.dto;

public class AccountUpsertReq {
    public String username;
    public String password;   // chỉ khi tạo mới hoặc đổi mật khẩu
    public String email;
    public String vai_tro;    // TEACHER | STAFF | MANAGER
    public Boolean hoat_dong;
    public Long id_nhan_vien;
}
