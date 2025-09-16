package com.ras.service.schedule.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class XepLopRecurringDto {
  // thông tin buổi gốc
  public Long   khoa_hoc_id;
  public String khoa_hoc_ten;
  public Long   hoc_vien_id;
  public String hoc_vien_ten;
  public Long   giao_vien_id;
  public String giao_vien_ten;
  public Long   chi_nhanh_id;
  public String chi_nhanh_ten;
  public Integer so_buoi_du_kien;

  public LocalDate ngay_bat_dau;   // ngày đầu tiên của chuỗi
  public LocalTime bat_dau_luc;
  public LocalTime ket_thuc_luc;

  // tham số lặp
  public Integer so_tuan;          // ví dụ 8 (mỗi tuần 1 buổi)
  public String  ghi_chu;          // "lịch cố định"...
}
