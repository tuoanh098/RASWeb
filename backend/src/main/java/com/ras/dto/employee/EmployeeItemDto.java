package com.ras.dto.employee;


public record EmployeeItemDto(
    Long id,
    String ho_ten,
    String email,
    String so_dien_thoai,
    String chuc_vu      
) {}