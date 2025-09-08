package com.ras.service.employee;

import com.ras.dto.employee.EmployeeItemDto;
import com.ras.dto.common.PageResponse; // dùng PageResponse bạn đã có
public interface EmployeeQueryService {
  PageResponse<EmployeeItemDto> search(String kw, int page, int size);
}
