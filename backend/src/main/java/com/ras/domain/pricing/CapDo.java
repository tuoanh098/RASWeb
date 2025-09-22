package com.ras.domain.pricing;

public enum CapDo {
  PRE_GRADE,
  GRADE_1, GRADE_2, GRADE_3, GRADE_4, GRADE_5, GRADE_6, GRADE_7, GRADE_8;

  public static CapDo from(String s) {
    if (s == null) return null;
    return CapDo.valueOf(s.trim().toUpperCase());
  }
}
