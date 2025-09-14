package com.ras.service.account;

import com.ras.domain.account.NguoiDung;
import com.ras.service.account.dto.*;

public class AccountMapper {

    public static AccountListDto toList(NguoiDung e) {
        return new AccountListDto(
            e.getId(),
            e.getUsername(),
            e.getEmail(),

            e.getVaiTro(),
            e.getHoatDong(),
            e.getLanDangNhapCuoi(),
            e.getIdNhanVien(),

            // alias
            e.getVaiTro(),
            e.getHoatDong(),
            e.getLanDangNhapCuoi()
        );
    }

    public static AccountDetailDto toDetail(NguoiDung e) {
        return new AccountDetailDto(
            e.getId(),
            e.getUsername(),
            e.getEmail(),

            e.getVaiTro(),
            e.getHoatDong(),
            e.getLanDangNhapCuoi(),
            e.getIdNhanVien(),

            // alias
            e.getVaiTro(),
            e.getHoatDong(),
            e.getLanDangNhapCuoi(),

            e.getNgayTao(),
            e.getNgaySua()
        );
    }
}
