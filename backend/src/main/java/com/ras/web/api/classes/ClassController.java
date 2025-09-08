package com.ras.web.api.classes;

import com.ras.dto.common.ApiResponse;
import com.ras.dto.common.PageResponse;
import com.ras.dto.classes.ClassListItemDto;
import com.ras.service.classes.ClassService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/classes")
public class ClassController {

  private final ClassService service;
  public ClassController(ClassService service){ this.service = service; }

  @GetMapping
  public ApiResponse<PageResponse<ClassListItemDto>> list(@RequestParam(defaultValue = "0") Integer page,
                                                          @RequestParam(defaultValue = "10") Integer size,
                                                          @RequestParam(required = false) Long branchId,
                                                          @RequestParam(required = false) String q) {
    return ApiResponse.ok(service.list(page, size, branchId, q));
  }
}


