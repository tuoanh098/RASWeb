package com.ras.dto.teacher;

public record TeacherSummaryDto(
    Long id,
    String hoTen,
    String email,
    String soDienThoai,
    String chuyenMon,
    Double heSoLuong,
    Integer soLopDangDay
) {}
