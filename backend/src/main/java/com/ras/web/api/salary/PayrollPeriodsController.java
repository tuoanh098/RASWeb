package com.ras.web.api.salary;
import com.ras.domain.salary.NvKyLuongRepository;
import com.ras.domain.salary.NvKyLuongRepository.PeriodView;
import com.ras.service.salary.dto.PayrollPeriodDTO;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import java.util.List;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/payroll")
@RequiredArgsConstructor
public class PayrollPeriodsController {

    private final NvKyLuongRepository kyLuongRepo;
    @GetMapping("/periods")
    public List<PayrollPeriodDTO> listPeriods() {
        List<PeriodView> rows = kyLuongRepo.findAllPeriodsDesc();
        return rows.stream()
                .map(r -> new PayrollPeriodDTO(r.getId(), r.getNam_thang()))
                .collect(Collectors.toList());
    }
}

