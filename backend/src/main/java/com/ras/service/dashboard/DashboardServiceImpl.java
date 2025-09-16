// com/ras/dashboard/service/impl/DashboardServiceImpl.java
package com.ras.service.dashboard;

import com.ras.domain.dashboard.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service @RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

  private final DashboardKpisRepo kpisRepo;
  private final DutyTodayRepo dutyRepo;
  private final RevenueByMonthRepo revMonthRepo;
  private final RevenueByYearRepo revYearRepo;
  private final FinanceYearRepo financeYearRepo;
  private final TopAdvisorsRepo topRepo;

  @Override public VwDashboardKpis getKpis() {
    return kpisRepo.findById(1L).orElse(null);
  }

  @Override public List<VwDutyToday> getDutyToday() {
    return dutyRepo.findAll();
  }

  @Override public List<VwRevenueByMonth> getRevenueMonthly(int year) {
    return revMonthRepo.findByYearOrderByMonthAsc(year);
  }

  @Override public List<VwRevenueByYear> getRevenueYearly() {
    return revYearRepo.findAll();
  }

  @Override public List<VwFinanceYear> getFinanceYear() {
    return financeYearRepo.findAll();
  }

  @Override public List<VwTopAdvisors> getTopAdvisors(int year, int limit) {
    List<VwTopAdvisors> all = topRepo.findByYearOrderBySignupCountDesc(year);
    return all.size() > limit ? all.subList(0, limit) : all;
  }
}
