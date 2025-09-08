package com.ras.web.api.student;

import com.ras.dto.common.ApiResponse;
import com.ras.dto.common.PageResponse;
import com.ras.dto.student.StudentListItemDto;
import com.ras.service.student.StudentOverviewService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
public class StudentOverviewController {

  private final StudentOverviewService service;
  public StudentOverviewController(StudentOverviewService service){ this.service = service; }

  @GetMapping
  public ApiResponse<PageResponse<StudentListItemDto>> list(@RequestParam(defaultValue="0") Integer page,
                                                            @RequestParam(defaultValue="10") Integer size,
                                                            @RequestParam(required=false) String q){
    return ApiResponse.ok(service.list(page, size, q));
  }
}


