package com.ras.domain.dashboard;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.Immutable;
import java.math.BigDecimal;

@Entity @Immutable
@Table(name = "vw_revenue_by_month")
public class VwRevenueByMonth {
  @Id
  private String month;   // dùng (year + '-' + month) làm id ảo ở Repo
  private Integer year;
  private BigDecimal revenue;
  // getters ...
}
