package com.ras.service.student.dto;

import lombok.*;

@Getter @Setter
public class StudentUpsertReq {
  private String hoc_sinh;
  private String hs_phone;
  private String email;
  private String phu_huynh;
  private String phu_huynh_phone;
  private String chi_nhanh_ho_tro;
}
