package com.ras.dto.views;

import java.time.LocalDateTime;
import java.util.List;

public record TodayLessonDto(
    Long buoi_hoc_id,
    Long lop_id,
    String ten_lop,
    Long chi_nhanh_id,
    String ma_chi_nhanh,
    LocalDateTime bat_dau_luc,
    LocalDateTime ket_thuc_luc,
    String trang_thai_buoi,
    Long giao_vien_id,
    String giao_vien,
    String phong,
    Integer so_dang_ky,
    Integer so_diem_danh,
    List<String> ds_dang_ky,
    List<String> ds_co_mat,
    String trang_thai_runtime
) {}

