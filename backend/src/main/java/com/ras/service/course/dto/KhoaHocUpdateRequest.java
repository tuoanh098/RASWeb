package com.ras.service.course.dto;

import jakarta.validation.constraints.*;

public class KhoaHocUpdateRequest {
    @NotNull public Long mon_hoc_id;
    @NotBlank public String loai_lop;
    @NotNull @Min(1) @Max(1000) public Integer thoi_luong_phut;
    public String ma;
    @NotBlank public String ten_hien_thi;
}