package com.ras.service.employee;

import com.ras.service.employee.dto.EmployeeDetailDto;
import com.ras.service.employee.dto.EmployeeListDto;
import org.springframework.data.domain.Page;

public interface EmployeeQueryService {
    Page<EmployeeListDto> search(String kw, String role, int page, int size);
    EmployeeDetailDto getById(Integer id);
}
