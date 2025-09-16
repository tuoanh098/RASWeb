package com.ras.service.course.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ras.domain.course.LoaiLop;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseDTO {
  @JsonProperty("id")           private Long    id;
  @JsonProperty("ma")           private String  ma;
  @JsonProperty("ten")          private String  ten;
  @JsonProperty("ten_hien_thi") private String  tenHienThi;
  @JsonProperty("mon_hoc_id")   private Long    monHocId;
  @JsonProperty("loai_lop")     private LoaiLop loaiLop;
  @JsonProperty("thoi_luong")   private Short   thoiLuongPhut;
  @JsonProperty("khoa_hoc_id")  private Long    khoaHocId;
}
