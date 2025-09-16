package com.ras.domain.dashboard;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.Immutable;

import java.math.BigDecimal;

@Entity @Immutable
@Table(name = "vw_top_advisors")
public class VwTopAdvisors {
  @Id
  private Long advisorId;
  private String advisorName;
  private Integer year;
  private Long signupCount;
  private BigDecimal revenueSum;
  // getters ...
}
