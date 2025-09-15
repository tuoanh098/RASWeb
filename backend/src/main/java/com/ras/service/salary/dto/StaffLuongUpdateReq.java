package com.ras.service.salary.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class StaffLuongUpdateReq {
    private BigDecimal luongCung;  // cho phép sửa nhanh
    private String ghiChu;         // ghi chú ở nv_bang_luong_thang
}
