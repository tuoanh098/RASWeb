package com.ras.service.account;

import com.ras.domain.account.*;
import com.ras.service.account.dto.*;

public class AccountMapper {
    public static AccountListDto toList(NguoiDung e) {
        var dto = new AccountListDto();
        dto.id = e.getId();
        dto.username = e.getUsername();
        dto.email = e.getEmail();
        dto.vai_tro = e.getVaiTro();
        dto.hoat_dong = e.getHoatDong();
        dto.lan_dang_nhap_cuoi = e.getLanDangNhapCuoi();
        if (e.getNhanVien()!=null) {
            dto.id_nhan_vien = e.getNhanVien().getId();
            dto.ho_ten_nhan_vien = e.getNhanVien().getHoTen();
        }
        return dto;
    }

    public static AccountDetailDto toDetail(NguoiDung e) {
        var dto = new AccountDetailDto();
        dto.id = e.getId();
        dto.username = e.getUsername();
        dto.email = e.getEmail();
        dto.vai_tro = e.getVaiTro();
        dto.hoat_dong = e.getHoatDong();
        dto.lan_dang_nhap_cuoi = e.getLanDangNhapCuoi();
        dto.ngay_tao = e.getNgayTao();
        dto.ngay_sua = e.getNgaySua();
        if (e.getNhanVien()!=null) {
            dto.id_nhan_vien = e.getNhanVien().getId();
            dto.ho_ten_nhan_vien = e.getNhanVien().getHoTen();
        }
        return dto;
    }
}
