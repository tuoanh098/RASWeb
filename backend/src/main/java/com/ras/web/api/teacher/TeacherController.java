package com.ras.web.api.teacher;

import com.ras.dto.common.PageResponse;
import com.ras.dto.teacher.TeacherSummaryDto;
import com.ras.service.teacher.TeacherQueryService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teachers")
@CrossOrigin
public class TeacherController {

  private final TeacherQueryService service;
  public TeacherController(TeacherQueryService service){ this.service = service; }

  @GetMapping
  public PageResponse<TeacherSummaryDto> search(
      @RequestParam(value="kw", required=false) String kw,
      @RequestParam(value="page", defaultValue="0") int page,
      @RequestParam(value="size", defaultValue="10") int size
  ){
    return service.search(kw, page, size);
  }
}
