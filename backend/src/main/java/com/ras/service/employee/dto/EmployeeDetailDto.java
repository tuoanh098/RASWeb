package com.ras.service.employee.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class EmployeeDetailDto {
    private Long id;
    private String hoTen;
    private String soDienThoai;
    private String email;
    private String vaiTro;
    private String chuyenMon;
    private String chucDanh;
    private Boolean hoatDong;

    private LocalDate ngaySinh;
    private String gioiTinh;
    private String diaChi;
    private String cccd;
    private String maSoThue;
    private LocalDate ngayVaoLam;
    private Integer soNamKinhNghiem;

    private BigDecimal luongCoBan;
    private BigDecimal heSoLuong;
    private BigDecimal phuCap;

    private String hinhThucLamViec;
    private String ghiChu;
    private String avatarUrl;

    private LocalDateTime ngayTao;
    private LocalDateTime ngaySua;
}
