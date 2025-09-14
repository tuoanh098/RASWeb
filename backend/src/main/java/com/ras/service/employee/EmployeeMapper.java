package com.ras.service.employee;

import com.ras.domain.employee.Employee;
import com.ras.service.employee.dto.*;
import org.springframework.stereotype.Component;

@Component
public class EmployeeMapper {

    public EmployeeListDto toList(Employee e) {
        return EmployeeListDto.builder()
            .id(e.getId())
            .hoTen(e.getHoTen())
            .soDienThoai(e.getSoDienThoai())
            .email(e.getEmail())
            .vaiTro(e.getVaiTro())
            .chuyenMon(e.getChuyenMon())
            .chucDanh(e.getChucDanh())
            .hoatDong(e.getHoatDong())
            .build();
    }

    public EmployeeDetailDto toDetail(Employee e) {
        return EmployeeDetailDto.builder()
            .id(e.getId())
            .hoTen(e.getHoTen())
            .soDienThoai(e.getSoDienThoai())
            .email(e.getEmail())
            .vaiTro(e.getVaiTro())
            .chuyenMon(e.getChuyenMon())
            .chucDanh(e.getChucDanh())
            .hoatDong(e.getHoatDong())
            .ngaySinh(e.getNgaySinh())
            .gioiTinh(e.getGioiTinh())
            .diaChi(e.getDiaChi())
            .cccd(e.getCccd())
            .maSoThue(e.getMaSoThue())
            .ngayVaoLam(e.getNgayVaoLam())
            .soNamKinhNghiem(e.getSoNamKinhNghiem())
            .luongCoBan(e.getLuongCoBan())
            .heSoLuong(e.getHeSoLuong())
            .phuCap(e.getPhuCap())
            .hinhThucLamViec(e.getHinhThucLamViec())
            .ghiChu(e.getGhiChu())
            .avatarUrl(e.getAvatarUrl())
            .ngayTao(e.getNgayTao())
            .ngaySua(e.getNgaySua())
            .build();
    }

    /** Gán dữ liệu từ req vào entity (create/update) */
    public void apply(EmployeeUpsertReq r, Employee e) {
        e.setHoTen(r.getHoTen());
        e.setSoDienThoai(r.getSoDienThoai());
        e.setEmail(r.getEmail());
        e.setVaiTro(r.getVaiTro());

        // Đảm bảo đúng semantics theo vai trò
        if ("TEACHER".equals(r.getVaiTro())) {
            e.setChuyenMon(r.getChuyenMon());
            e.setChucDanh(null);
        } else {
            e.setChuyenMon(null);
            e.setChucDanh(r.getChucDanh());
        }

        if (r.getHoatDong() != null) e.setHoatDong(r.getHoatDong());

        // optional
        e.setNgaySinh(r.getNgaySinh());
        e.setGioiTinh(r.getGioiTinh());
        e.setDiaChi(r.getDiaChi());
        e.setCccd(r.getCccd());
        e.setMaSoThue(r.getMaSoThue());
        e.setNgayVaoLam(r.getNgayVaoLam());
        e.setSoNamKinhNghiem(r.getSoNamKinhNghiem());
        e.setLuongCoBan(r.getLuongCoBan());
        e.setHeSoLuong(r.getHeSoLuong());
        e.setPhuCap(r.getPhuCap());
        e.setHinhThucLamViec(r.getHinhThucLamViec());
        e.setGhiChu(r.getGhiChu());
        e.setAvatarUrl(r.getAvatarUrl());
    }
}
