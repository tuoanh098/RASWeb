package com.ras.dto.classes;

public record ClassListItemDto(
  Long lop_id,
  String ten_lop,
  String mon_hoc,
  Long chi_nhanh_id,
  String ma_chi_nhanh,
  String chi_nhanh,
  Long giao_vien_id,
  String giao_vien,
  String trang_thai,
  Integer so_hoc_vien
) {}

