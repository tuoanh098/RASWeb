// src/main/java/com/ras/web/duty/NvLichTrucController.java
package com.ras.web.api.duty;

import com.ras.service.duty.NvLichTrucService;
import com.ras.service.duty.dto.NvLichTrucCreateDto;
import com.ras.service.duty.dto.NvLichTrucDto;
import com.ras.service.duty.dto.NvLichTrucUpdateDto;
import com.ras.web.api.common.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/lich-truc")
@RequiredArgsConstructor
public class NvLichTrucController {

  private final NvLichTrucService service;

  @GetMapping
  public PageResponse<NvLichTrucDto> list(
      @RequestParam(name="page", defaultValue = "0") Integer page,
      @RequestParam(name="size", defaultValue = "20") Integer size,
      @RequestParam(name="nhan_vien_id", required = false) Long nhanVienId,
      @RequestParam(name="chi_nhanh_id", required = false) Long chiNhanhId,
      @RequestParam(name="from", required = false) @DateTimeFormat(iso= DateTimeFormat.ISO.DATE) LocalDate from,
      @RequestParam(name="to", required = false)   @DateTimeFormat(iso= DateTimeFormat.ISO.DATE) LocalDate to,
      @RequestParam(name="q", required = false) String q
  ) {
    Page<NvLichTrucDto> pg = service.search(page, size, nhanVienId, chiNhanhId, from, to, q);
    return new PageResponse<>(pg.getContent(), pg.getNumber(), pg.getSize(), pg.getTotalElements(), pg.getTotalPages());
  }

  @GetMapping("/{id}")
  public NvLichTrucDto get(@PathVariable Long id) {
    return service.get(id).orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
        org.springframework.http.HttpStatus.NOT_FOUND, "Không tìm thấy lịch trực #" + id));
  }

  @PostMapping
  public NvLichTrucDto create(@RequestBody NvLichTrucCreateDto req) {
    return service.create(req);
  }

  @PutMapping("/{id}")
  public NvLichTrucDto update(@PathVariable Long id, @RequestBody NvLichTrucUpdateDto req) {
    return service.update(id, req);
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable Long id) {
    service.delete(id);
  }
}
