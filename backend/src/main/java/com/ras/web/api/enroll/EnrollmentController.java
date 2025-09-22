// src/main/java/com/ras/web/api/enroll/EnrollmentController.java
package com.ras.web.api.enroll;

import com.ras.domain.enroll.DangKyKhoaHoc;
import com.ras.domain.enroll.DangKyKhoaHocRepo;
import com.ras.domain.enroll.SignupCreateRequest;
import com.ras.service.enroll.EnrollmentService;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/signups")
public class EnrollmentController {

  private final EnrollmentService service;

  public EnrollmentController(EnrollmentService service) {
    this.service = service;
  }

  @PostMapping
  public DangKyKhoaHoc create(@RequestBody SignupCreateRequest req) {
    return service.create(req);
  }

  @GetMapping("/summary")
  public Map<String, Object> summary(@RequestParam("month") String monthYm) {
    DangKyKhoaHocRepo.SummaryRow r = service.summaryByMonth(monthYm);
    BigDecimal tuition = r.getTotal_tuition() == null ? BigDecimal.ZERO : r.getTotal_tuition();
    BigDecimal commission = r.getTotal_commission() == null ? BigDecimal.ZERO : r.getTotal_commission();
    Long total = r.getTotal() == null ? 0L : r.getTotal();
    return Map.of(
        "month", monthYm,
        "total_enrollments", total,
        "total_tuition", tuition,
        "total_commission_2pct", commission
    );
  }
}
