package com.ras.service.employee;

import com.ras.domain.employee.Employee;
import com.ras.service.employee.dto.EmployeeDetailDto;
import com.ras.service.employee.dto.EmployeeListDto;

public final class EmployeeMapper {

    private EmployeeMapper() {}

    public static EmployeeListDto toListDto(Employee e) {
        if (e == null) return null;
        EmployeeListDto dto = new EmployeeListDto();
        dto.setId(e.getId());
        dto.setHoTen(e.getHoTen());
        dto.setSoDienThoai(e.getSoDienThoai());
        dto.setEmail(e.getEmail());
        // hiển thị “chuyên môn” cho TEACHER, còn NV/QL hiển thị “chức danh”
        dto.setChucDanh(e.getVaiTro() != null && e.getVaiTro().equalsIgnoreCase("TEACHER")
                ? e.getChuyenMon()
                : e.getChucDanh());
        dto.setVaiTro(e.getVaiTro());
        dto.setHoatDong(Boolean.TRUE.equals(e.getHoatDong()));
        return dto;
    }

    public static EmployeeDetailDto toDetailDto(Employee e) {
        if (e == null) return null;
        EmployeeDetailDto dto = new EmployeeDetailDto();
        dto.setId(e.getId());
        dto.setAvatarUrl(e.getAvatarUrl());
        dto.setCccd(e.getCccd());
        dto.setChucDanh(e.getChucDanh());
        dto.setChuyenMon(e.getChuyenMon());
        dto.setDiaChi(e.getDiaChi());
        dto.setEmail(e.getEmail());
        dto.setGhiChu(e.getGhiChu());
        dto.setGioiTinh(e.getGioiTinh());
        dto.setHinhThucLamViec(e.getHinhThucLamViec());
        dto.setHoTen(e.getHoTen());
        dto.setHoatDong(Boolean.TRUE.equals(e.getHoatDong()));
        dto.setMaSoThue(e.getMaSoThue());
        dto.setNgaySinh(e.getNgaySinh());
        dto.setNgaySua(e.getNgaySua());
        dto.setNgayTao(e.getNgayTao());
        dto.setNgayVaoLam(e.getNgayVaoLam());
        dto.setSoDienThoai(e.getSoDienThoai());
        dto.setSoNamKinhNghiem(e.getSoNamKinhNghiem());
        dto.setVaiTro(e.getVaiTro());
        return dto;
    }
}
