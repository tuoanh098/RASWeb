package com.ras.dto.teacher;

public record TeacherClassItemDto(
  Long lop_id,
  String ten_lop,
  String mon_hoc,
  Long chi_nhanh_id,
  String ma_chi_nhanh,
  String chi_nhanh,
  Integer so_hoc_vien,
  String trang_thai
) {}
