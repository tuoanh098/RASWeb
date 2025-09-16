package com.ras.web.api.enroll;

import com.ras.service.enroll.EnrollmentService;
import com.ras.service.enroll.dto.EnrollmentCreateDto;
import com.ras.service.enroll.dto.EnrollmentDto;
import com.ras.service.enroll.dto.MonthlySignUpStatDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/signups")
@RequiredArgsConstructor
public class EnrollmentController {

  private final EnrollmentService service;

  @PostMapping
  public EnrollmentDto create(@RequestBody EnrollmentCreateDto req) {
    return service.create(req);
  }

  @GetMapping
  public List<EnrollmentDto> listByStudent(@RequestParam("studentId") Long studentId) {
    return service.listByStudent(studentId);
  }

  @GetMapping("/summary")
  public MonthlySignUpStatDTO summary(@RequestParam("month") String ym) {
    return service.summaryByMonth(ym);
  }
}
