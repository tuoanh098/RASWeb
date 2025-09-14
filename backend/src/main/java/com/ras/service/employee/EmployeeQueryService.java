package com.ras.service.employee;

import com.ras.web.api.common.PageResponse;
import com.ras.service.employee.dto.EmployeeDetailDto;
import com.ras.service.employee.dto.EmployeeListDto;
import org.springframework.data.domain.Pageable;

public interface EmployeeQueryService {
    PageResponse<EmployeeListDto> list(String q, String role, Pageable pageable);
    EmployeeDetailDto get(Long id);
}
