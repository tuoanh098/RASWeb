package com.ras.domain.dashboard;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.Immutable;
import java.math.BigDecimal;

@Entity @Immutable
@Table(name = "vw_finance_year")
public class VwFinanceYear {
  @Id
  private Integer year;
  private BigDecimal revenue;
  private BigDecimal payroll;
  private BigDecimal profit;
  // getters ...
}
