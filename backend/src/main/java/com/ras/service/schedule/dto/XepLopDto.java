package com.ras.service.schedule.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class XepLopDto {
  public Long id;
  public Long   khoa_hoc_id;
  public String khoa_hoc_ten;

  public Long   hoc_vien_id;
  public String hoc_vien_ten;

  public Long   giao_vien_id;
  public String giao_vien_ten;

  public Long   chi_nhanh_id;
  public String chi_nhanh_ten;

  public Integer so_buoi_du_kien;
  public Integer so_buoi_da_hoc;

  public LocalDate ngay;
  public LocalTime bat_dau_luc;
  public LocalTime ket_thuc_luc;
  public Integer   thoi_luong_phut;

  public Long   co_dinh_group_id;
  public String trang_thai_buoi;
  public String ghi_chu;
}
