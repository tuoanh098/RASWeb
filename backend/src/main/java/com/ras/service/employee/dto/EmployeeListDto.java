package com.ras.service.employee.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class EmployeeListDto {
    private Integer id;
    private String hoTen;         // ho_ten
    private String soDienThoai;   // so_dien_thoai
    private String email;
    private String vaiTro;        // TEACHER | STAFF | MANAGER
    private String chuyenMon;     // cho TEACHER
    private String chucDanh;      // cho STAFF/MANAGER
    private Boolean hoatDong;
}
