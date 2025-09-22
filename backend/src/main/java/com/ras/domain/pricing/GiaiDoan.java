package com.ras.domain.pricing;

public enum GiaiDoan {
  SO_CAP,
  SO_TRUNG_CAP_CO_BAN,
  SO_TRUNG_CAP_NANG_CAO,
  TRUNG_CAP,
  TRUNG_CAP_CHUYEN_SAU,
  TIEN_CHUYEN_NGHIEP;

  public static GiaiDoan from(String s) {
    if (s == null) return null;
    return GiaiDoan.valueOf(s.trim().toUpperCase());
  }
}
