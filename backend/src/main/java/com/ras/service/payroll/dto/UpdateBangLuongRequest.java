package com.ras.service.payroll.dto;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class UpdateBangLuongRequest {
    private Long ky_luong_id;
    private Long nhan_vien_id;

    private BigDecimal luong_cung;        // nullable: chỉ cập nhật khi có
    private BigDecimal tong_thuong;       // nullable
    private BigDecimal tong_truc;         // nullable
    private BigDecimal tong_phu_cap_khac; // nullable
    private BigDecimal tong_phat;         // nullable
}