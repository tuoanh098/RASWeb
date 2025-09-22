package com.ras.service.pricing;

import com.ras.domain.pricing.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;

@Service
public class PricingService {

  private final BangGiaHocPhiMucRepo repo;

  public PricingService(BangGiaHocPhiMucRepo repo) {
    this.repo = repo;
  }

  public Map<String, Object> getTuition(Long khoaHocId, String chiNhanhId,
                                        GiaiDoan giaiDoan, CapDo capDo, Integer soBuoi) {
    var row = repo.findMatch(
        khoaHocId,
        chiNhanhId == null ? "" : chiNhanhId.trim(),
        giaiDoan.name(),
        capDo.name(),
        soBuoi
    ).orElse(null);

    BigDecimal hocPhi = row != null ? row.getHocPhiKhoa() : BigDecimal.ZERO;

    return Map.of(
        "khoa_hoc_id", khoaHocId,
        "chi_nhanh_id", chiNhanhId,
        "giai_doan", giaiDoan.name(),
        "cap_do", capDo.name(),
        "so_buoi", soBuoi,
        "hoc_phi_khoa", hocPhi
    );
  }
}
