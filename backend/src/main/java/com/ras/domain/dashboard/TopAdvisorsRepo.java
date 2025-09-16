package com.ras.domain.dashboard;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TopAdvisorsRepo extends JpaRepository<VwTopAdvisors, Long> {
  List<VwTopAdvisors> findTop5ByYearOrderBySignupCountDesc(Integer year);
  List<VwTopAdvisors> findByYearOrderBySignupCountDesc(Integer year);
}
