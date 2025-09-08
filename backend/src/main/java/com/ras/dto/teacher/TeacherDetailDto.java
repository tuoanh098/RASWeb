package com.ras.dto.teacher;

public record TeacherDetailDto(
  Long giao_vien_id,
  String ten_giao_vien,
  String email,
  String so_dien_thoai,
  String chuyen_mon,
  Double he_so_luong,
  Integer so_lop_dang_day
) {}
