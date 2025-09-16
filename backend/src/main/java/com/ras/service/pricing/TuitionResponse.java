package com.ras.service.pricing;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

public record TuitionResponse(
    @JsonProperty("chi_nhanh_id") Long chiNhanhId,
    @JsonProperty("khoa_hoc_id")   Long khoaHocId,
    @JsonProperty("so_buoi_khoa")  Integer soBuoiKhoa,
    @JsonProperty("hoc_phi")       BigDecimal hocPhi,
    @JsonProperty("nguon")         String nguon
) {
  public static TuitionResponse zero(String reason) {
    return new TuitionResponse(null, null, null, BigDecimal.ZERO, reason);
  }
}
