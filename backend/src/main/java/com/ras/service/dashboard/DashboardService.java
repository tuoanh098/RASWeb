// com/ras/dashboard/service/DashboardService.java
package com.ras.service.dashboard;

import com.ras.domain.dashboard.*;
import java.util.List;

public interface DashboardService {
  VwDashboardKpis getKpis();
  List<VwDutyToday> getDutyToday();
  List<VwRevenueByMonth> getRevenueMonthly(int year);
  List<VwRevenueByYear> getRevenueYearly();
  List<VwFinanceYear> getFinanceYear();
  List<VwTopAdvisors> getTopAdvisors(int year, int limit);
}
