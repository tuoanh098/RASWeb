package com.ras.web.api.attendance;

import com.ras.dto.attendance.AttendanceRowDto;
import com.ras.dto.attendance.AttendanceSaveRequest;
import com.ras.dto.common.ListResponse;
import com.ras.service.attendance.AttendanceService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendances")
public class AttendanceController {
  private final AttendanceService attendanceService;

  public AttendanceController(AttendanceService attendanceService) {
    this.attendanceService = attendanceService;
  }

  @GetMapping
  public ListResponse<AttendanceRowDto> load(
      @RequestParam(defaultValue = "teacher") String type,
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStart,
      @RequestParam(required = false) Long branchId,
      @RequestParam(required = false) String q
  ) {
    if ("teacher".equalsIgnoreCase(type)) {
      List<AttendanceRowDto> list = attendanceService.loadTeachers(weekStart, branchId, q);
      return new ListResponse<>(list);
    }
    return new ListResponse<>(List.of());
  }

  @PostMapping
  public void save(@RequestBody AttendanceSaveRequest req) {
    if ("teacher".equalsIgnoreCase(req.type)) {
      var rows = req.items.stream()
          .map(it -> new AttendanceRowDto(it.id, null, it.codes))
          .toList();
      attendanceService.saveTeachers(req.weekStart, rows);
    } else {
    }
  }
}
