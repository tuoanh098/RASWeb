package com.ras.service.student;

import com.ras.domain.student.HocVien;
import com.ras.service.student.dto.*;

public class StudentMapper {

  public static HocVien toEntity(StudentUpsertReq req, HocVien target) {
    if (target == null) target = new HocVien();
    target.setHocSinh(req.getHoc_sinh());
    target.setHsPhone(req.getHs_phone());
    target.setEmail(req.getEmail());
    target.setPhuHuynh(req.getPhu_huynh());
    target.setPhuHuynhPhone(req.getPhu_huynh_phone());
    target.setChiNhanhHoTro(req.getChi_nhanh_ho_tro());
    return target;
  }

  public static StudentListItemDto toListItem(HocVien h) {
    return StudentListItemDto.builder()
        .id(h.getId())
        .hoc_sinh(h.getHocSinh())
        .hs_phone(h.getHsPhone())
        .email(h.getEmail())
        .phu_huynh(h.getPhuHuynh())
        .phu_huynh_phone(h.getPhuHuynhPhone())
        .chi_nhanh_ho_tro(h.getChiNhanhHoTro())
        .thoi_gian_bat_dau_hoc(h.getThoiGianBatDauHoc())
        .so_lop_dang_hoc(0)
        .giao_vien_dang_day("-")
        .build();
  }

  public static StudentDetailDto toDetail(HocVien h) {
    return StudentDetailDto.builder()
        .id(h.getId())
        .hoc_sinh(h.getHocSinh())
        .hs_phone(h.getHsPhone())
        .email(h.getEmail())
        .phu_huynh(h.getPhuHuynh())
        .phu_huynh_phone(h.getPhuHuynhPhone())
        .chi_nhanh_ho_tro(h.getChiNhanhHoTro())
        .thoi_gian_bat_dau_hoc(h.getThoiGianBatDauHoc())
        .ngay_tao(h.getNgayTao())
        .ngay_sua(h.getNgaySua())
        .build();
  }
}
