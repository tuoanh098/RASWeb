// com/ras/dashboard/web/DashboardController.java
package com.ras.web.api.dashboard;

import com.ras.domain.dashboard.*;
import com.ras.service.dashboard.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/view/dashboard")
@RequiredArgsConstructor
public class DashboardController {

  private final DashboardService service;

  @GetMapping("/kpis")
  public VwDashboardKpis kpis() { return service.getKpis(); }

  @GetMapping("/duty-today")
  public List<VwDutyToday> dutyToday() { return service.getDutyToday(); }

  @GetMapping("/revenue-monthly")
  public List<VwRevenueByMonth> revenueMonthly(@RequestParam int year) {
    return service.getRevenueMonthly(year);
  }

  @GetMapping("/revenue-yearly")
  public List<VwRevenueByYear> revenueYearly() { return service.getRevenueYearly(); }

  @GetMapping("/finance-year")
  public List<VwFinanceYear> financeYear() { return service.getFinanceYear(); }

  @GetMapping("/top-advisors")
  public List<VwTopAdvisors> topAdvisors(@RequestParam int year, @RequestParam(defaultValue = "5") int limit) {
    return service.getTopAdvisors(year, limit);
  }
}
