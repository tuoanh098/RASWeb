package com.ras.domain.dashboard;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RevenueByMonthRepo extends JpaRepository<VwRevenueByMonth, String> {
  List<VwRevenueByMonth> findByYearOrderByMonthAsc(Integer year);
}