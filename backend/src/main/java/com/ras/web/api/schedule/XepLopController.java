package com.ras.web.api.schedule;

import com.ras.service.schedule.XepLopService;
import com.ras.service.schedule.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/xep-lop")
public class XepLopController {
  private final XepLopService service;

  // Tạo 1 buổi / 1 ngày
  @PostMapping
  public XepLopDto createOne(@RequestBody XepLopCreateDto req){
    return service.createOne(req);
  }

  // Tạo lịch cố định hàng tuần (so_tuan lần)
  @PostMapping("/recurring")
  public List<XepLopDto> createRecurring(@RequestBody XepLopRecurringDto req){
    return service.createRecurring(req);
  }

  // Lịch tuần (Mon..Sun)
  @GetMapping("/week")
  public List<XepLopDto> week(
      @RequestParam("start") String weekStartIso,     // YYYY-MM-DD (thứ Hai)
      @RequestParam(value="branchId", required=false) Long branchId,
      @RequestParam(value="teacherId", required=false) Long teacherId,
      @RequestParam(value="studentId", required=false) Long studentId) {
    return service.getWeek(LocalDate.parse(weekStartIso), branchId, teacherId, studentId);
  }

  // Hủy 1 buổi
  @PostMapping("/{id}/cancel")
  public void cancel(@PathVariable Long id) {
    service.cancelOne(id);
  }

  // Xóa chuỗi cố định từ một ngày trở đi
  @DeleteMapping("/series/{groupId}")
  public int deleteSeriesFrom(
      @PathVariable("groupId") Long groupId,
      @RequestParam("from") String fromIso) {
    return service.deleteSeriesFrom(groupId, LocalDate.parse(fromIso));
  }
}
