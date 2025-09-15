package com.ras.service.salary.dto;

import lombok.*;
import java.math.BigDecimal;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class StaffSalaryRow {
    private Long id;                // nv_bang_luong_thang.id
    private Long nhanVienId;
    private String tenNhanVien;
    private BigDecimal luongCung;
    private BigDecimal tongHoaHong;
    private BigDecimal tongThuong;
    private BigDecimal tongTruc;
    private BigDecimal tongPhuCapKhac;
    private BigDecimal tongPhat;
    private BigDecimal tongLuong;
}
