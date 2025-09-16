package com.ras.service.schedule.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class XepLopCreateDto {

  public Long   khoa_hoc_id;
  public String khoa_hoc_ten;

  public Long   hoc_vien_id;
  public String hoc_vien_ten;

  public Long   giao_vien_id;
  public String giao_vien_ten;

  public Long   chi_nhanh_id;
  public String chi_nhanh_ten;

  public Integer so_buoi_du_kien;
  public Integer so_buoi_da_hoc;   // optional (mặc định 0)

  public LocalDate ngay;
  public LocalTime bat_dau_luc;
  public LocalTime ket_thuc_luc;

  public Long   co_dinh_group_id;  // optional
  public String trang_thai_buoi;   // scheduled|cancelled|done (optional)
  public String ghi_chu;
}
    