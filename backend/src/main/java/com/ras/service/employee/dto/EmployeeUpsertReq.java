package com.ras.service.employee.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class EmployeeUpsertReq {

    @NotBlank(message = "Họ tên không được trống")
    private String hoTen;

    @NotBlank(message = "Số điện thoại không được trống")
    @Pattern(regexp = "^[0-9+()\\-\\s]{8,20}$", message = "SĐT không hợp lệ")
    private String soDienThoai;

    @Email(message = "Email không hợp lệ")
    private String email;

    @NotBlank(message = "Vai trò không được trống")
    @Pattern(regexp = "TEACHER|STAFF|MANAGER", message = "Vai trò không hợp lệ")
    private String vaiTro;

    private String chuyenMon;   // nếu TEACHER
    private String chucDanh;    // nếu STAFF/MANAGER
    private Boolean hoatDong;

    // optional
    private LocalDate ngaySinh;
    private String gioiTinh;
    private String diaChi;
    private String cccd;
    private String maSoThue;
    private LocalDate ngayVaoLam;
    private Integer soNamKinhNghiem;
    private String hinhThucLamViec;
    private String ghiChu;
    private String avatarUrl;
}
