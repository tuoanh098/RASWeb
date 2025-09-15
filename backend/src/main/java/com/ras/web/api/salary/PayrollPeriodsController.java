package com.ras.web.api.salary;
import com.ras.domain.salary.NvKyLuongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/payroll")
@RequiredArgsConstructor
public class PayrollPeriodsController {

  private final NvKyLuongRepository repo;

  @GetMapping("/periods")
  public List<NvKyLuongRepository.PeriodView> listPeriods() {
    return repo.findAllPeriodsDesc();
  }
}

