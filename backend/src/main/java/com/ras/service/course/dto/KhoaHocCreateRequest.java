package com.ras.service.course.dto;

import jakarta.validation.constraints.*;

public class KhoaHocCreateRequest {
    @NotNull public Long mon_hoc_id;
    @NotBlank public String loai_lop;               // enum string
    @NotNull @Min(1) @Max(1000) public Integer thoi_luong_phut;
    public String ma;                               // optional
    @NotBlank public String ten_hien_thi;
}