package com.ras.web.api.student;

import com.ras.service.student.*;
import com.ras.service.student.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import com.ras.web.api.common.PageResponse;

import java.util.Map;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

  private final StudentQueryService queryService;
  private final StudentCommandService commandService;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public PageResponse<StudentListItemDto> list(
      @RequestParam(name = "page", defaultValue = "0") int page,
      @RequestParam(name = "size", defaultValue = "10") int size,
      @RequestParam(name = "q", required = false) String q,
      @RequestParam(name = "branchId", required = false) Long branchId
  ) {
      Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(size, 500),
              Sort.by(Sort.Direction.DESC, "id"));
      return queryService.list(q, branchId, pageable);
  }

  @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public StudentDetailDto get(@PathVariable("id") Long id) {
    return queryService.get(id);
  }

  @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
  public Map<String, Long> create(@RequestBody StudentUpsertReq req) {
    Long id = commandService.create(req);
    return Map.of("hoc_vien_id", id);
  }

  @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
  public Map<String, Long> update(@PathVariable("id") Long id, @RequestBody StudentUpsertReq req) {
    commandService.update(id, req);
    return Map.of("hoc_vien_id", id);
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable("id") Long id) {
    commandService.delete(id);
  }

  @GetMapping("/_smoke")
  public Map<String,Object> smoke() { return Map.of("ok", true, "ts", System.currentTimeMillis()); }
}
