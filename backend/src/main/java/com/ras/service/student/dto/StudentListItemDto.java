package com.ras.service.student.dto;

import lombok.*;
import java.time.LocalDate;

@Getter @Setter @Builder
public class StudentListItemDto {
  private Long id;
  private String hoc_sinh;
  private String hs_phone;
  private String email;
  private String phu_huynh;
  private String phu_huynh_phone;
  private String chi_nhanh_ho_tro;
  private LocalDate thoi_gian_bat_dau_hoc;

  // các field hiển thị thêm (UI dùng được)
  private Integer so_lop_dang_hoc;
  private String giao_vien_dang_day;
}