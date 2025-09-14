package com.ras.service.employee;

import com.ras.domain.employee.*;
import com.ras.service.employee.dto.EmployeeListDto;
import com.ras.service.employee.dto.EmployeeDetailDto;
import com.ras.web.api.common.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service @RequiredArgsConstructor
public class EmployeeQueryServiceImpl implements EmployeeQueryService {

    private final EmployeeRepository repo;
    private final EmployeeMapper mapper;

    @Override
    public PageResponse<EmployeeListDto> list(String q, String role, Pageable pageable) {
        Page<Employee> page = repo.search(
            (q == null || q.isBlank()) ? null : q.trim(),
            (role == null || role.isBlank()) ? null : role.trim(),
            pageable
        );
        return PageResponse.of(page.map(mapper::toList));
    }

    @Override
    public EmployeeDetailDto get(Long id) {
        Employee e = repo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Nhân viên không tồn tại: id=" + id));
        return mapper.toDetail(e);
    }
}
