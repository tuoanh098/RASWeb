package com.ras.dto.teacher;

public record TeacherDetailResponse(
  TeacherDetailDto giao_vien,
  java.util.List<TeacherClassItemDto> lop_dang_day
) {}
