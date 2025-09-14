package com.ras.service.student.dto;

import lombok.*;
import java.time.*;

@Getter @Setter @Builder
public class StudentDetailDto {
  private Long id;
  private String hoc_sinh;
  private String hs_phone;
  private String email;
  private String phu_huynh;
  private String phu_huynh_phone;
  private String chi_nhanh_ho_tro;
  private LocalDate thoi_gian_bat_dau_hoc;
  private LocalDateTime ngay_tao;
  private LocalDateTime ngay_sua;
}
