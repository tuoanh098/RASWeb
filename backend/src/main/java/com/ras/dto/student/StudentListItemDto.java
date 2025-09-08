package com.ras.dto.student;

public record StudentListItemDto(
  Long hoc_vien_id,
  String hoc_sinh,
  java.time.LocalDate thoi_gian_bat_dau_hoc,
  String hs_phone,
  String phu_huynh,
  String phu_huynh_phone,
  String nhan_vien_ho_tro,
  String chi_nhanh_ho_tro,
  Integer so_lop_dang_hoc,
  String giao_vien_dang_day
) {}

