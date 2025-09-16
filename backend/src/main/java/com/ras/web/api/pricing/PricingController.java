package com.ras.web.api.pricing;

import com.ras.service.pricing.PricingService;
import com.ras.service.pricing.TuitionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/pricing")
@RequiredArgsConstructor
public class PricingController {

  private final PricingService pricing;

  @GetMapping("/tuition")
  public TuitionResponse getTuition(
      @RequestParam(name = "khoaHocMauId",    required = false) Long khm1,
      @RequestParam(name = "khoa_hoc_mau_id", required = false) Long khm2,
      @RequestParam(name = "khoaHocId",       required = false) Long kh1,
      @RequestParam(name = "khoa_hoc_id",     required = false) Long kh2,
      @RequestParam(name = "chiNhanhId",      required = false) Long cn1,
      @RequestParam(name = "chi_nhanh_id",    required = false) Long cn2,
      @RequestParam(name = "date",            required = false) String date
  ) {
    Long khTemplateId = (khm1 != null ? khm1 : khm2);
    Long khId         = (kh1  != null ? kh1  : kh2);
    Long cnId         = (cn1  != null ? cn1  : cn2);

    LocalDate d = null;
    try { if (date != null && !date.isBlank()) d = LocalDate.parse(date); } catch (Exception ignore) {}

    return pricing.resolveTuition(cnId, khId, khTemplateId, d);
  }
}
