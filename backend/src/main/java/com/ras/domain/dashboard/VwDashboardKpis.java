// com/ras/dashboard/entity/VwDashboardKpis.java
package com.ras.domain.dashboard;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.Immutable;

@Entity @Immutable
@Table(name = "vw_dashboard_kpis")
public class VwDashboardKpis {
  @Id
  private Long id;                  // luôn = 1
  private Long totalEmployees;
  private Long totalStudents;
  private Long totalCoursesRegistered;
  private java.math.BigDecimal revenueMonth;
  private java.math.BigDecimal revenueYear;

  // getters ...
}
