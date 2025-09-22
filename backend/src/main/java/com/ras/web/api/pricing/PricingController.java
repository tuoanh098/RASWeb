package com.ras.web.api.pricing;

import com.ras.domain.pricing.CapDo;
import com.ras.domain.pricing.GiaiDoan;
import com.ras.service.pricing.PricingService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/pricing")
public class PricingController {

  private final PricingService service;

  public PricingController(PricingService service) {
    this.service = service;
  }

  @GetMapping("/tuition")
  public Map<String, Object> tuition(
      @RequestParam("khoa_hoc_id") Long khoaHocId,
      @RequestParam(value = "chi_nhanh_id", required = false) Long chiNhanhId,
      @RequestParam("giai_doan") String giaiDoan,
      @RequestParam("cap_do") String capDo,
      @RequestParam("so_buoi") Integer soBuoi
  ) {
    return service.getTuition(
        khoaHocId,
        chiNhanhId == null ? null : String.valueOf(chiNhanhId),
        GiaiDoan.from(giaiDoan),
        CapDo.from(capDo),
        soBuoi
    );
  }
}
