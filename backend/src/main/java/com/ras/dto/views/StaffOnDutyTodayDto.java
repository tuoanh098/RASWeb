package com.ras.dto.views;

import java.time.LocalDate;
import java.time.LocalTime;

public record StaffOnDutyTodayDto(
    Long id,
    Long chi_nhanh_id,
    String ma_chi_nhanh,
    String chi_nhanh,
    String nhan_vien,
    LocalDate ngay_truc,
    LocalTime gio_bat_dau,
    LocalTime gio_ket_thuc,
    String loai_ca,
    String trang_thai_ca,
    String trang_thai_runtime
) {}
