package com.ras.web.api.employee;

import com.ras.dto.employee.EmployeeItemDto;
import com.ras.dto.common.PageResponse;
import com.ras.service.employee.EmployeeQueryService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin
public class EmployeeController {

  private final EmployeeQueryService service;
  public EmployeeController(EmployeeQueryService service) { this.service = service; }

  @GetMapping
  public PageResponse<EmployeeItemDto> search(
      @RequestParam(defaultValue = "") String kw,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    return service.search(kw, page, size);
  }
}
