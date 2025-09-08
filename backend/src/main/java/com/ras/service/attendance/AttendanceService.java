package com.ras.service.attendance;

import com.ras.dto.attendance.AttendanceRowDto;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {
  List<AttendanceRowDto> loadTeachers(LocalDate weekStart, Long branchId, String q);
  void saveTeachers(LocalDate weekStart, List<AttendanceRowDto> rows);
}
