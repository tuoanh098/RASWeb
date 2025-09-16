package com.ras.web.api.course;

import com.ras.domain.course.LoaiLop;
import com.ras.service.course.dto.CourseDTO;
import com.ras.service.course.CourseService;
import com.ras.service.course.dto.CourseUpsertDTO;
import com.ras.service.pricing.PricingService;
import com.ras.service.pricing.TuitionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CoursesController {

  private final CourseService courseService;
  private final PricingService pricingService;

  // GET /api/courses?q=&mon_hoc_id=&loai_lop=&thoi_luong_phut=
  @GetMapping
  public List<CourseDTO> search(
      @RequestParam(name="q", required=false) String q,
      @RequestParam(name="mon_hoc_id", required=false) Long monHocId,
      @RequestParam(name="loai_lop", required=false) LoaiLop loaiLop,
      @RequestParam(name="thoi_luong_phut", required=false) Short thoiLuongPhut
  ) {
    return courseService.search(q, monHocId, loaiLop, thoiLuongPhut);
  }

  // GET /api/courses/{id}
  @GetMapping("/{id}")
  public CourseDTO get(@PathVariable("id") Long id) {
    return courseService.get(id);
  }

  // POST /api/courses
  @PostMapping
  public CourseDTO create(@RequestBody CourseUpsertDTO req) {
    return courseService.create(req);
  }

  // PUT /api/courses/{id}
  @PutMapping("/{id}")
  public CourseDTO update(@PathVariable("id") Long id, @RequestBody CourseUpsertDTO req) {
    return courseService.update(id, req);
  }

  // DELETE /api/courses/{id}
  @DeleteMapping("/{id}")
  public void delete(@PathVariable("id") Long id) {
    courseService.delete(id);
  }

  // GET /api/courses/{id}/pricing?chi_nhanh_id=...&date=YYYY-MM-DD
  @GetMapping("/{id}/pricing")
  public TuitionResponse pricing(
      @PathVariable("id") Long khoaHocMauId,
      @RequestParam(name="chi_nhanh_id") Long chiNhanhId,
      @RequestParam(name="date", required=false) String date
  ) {
    LocalDate d = null;
    try { if (date != null && !date.isBlank()) d = LocalDate.parse(date); } catch (Exception ignore) {}
    return pricingService.resolveTuition(chiNhanhId, null, khoaHocMauId, d);
  }
}
