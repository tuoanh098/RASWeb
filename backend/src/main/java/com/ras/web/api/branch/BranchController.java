package com.ras.web.api.branch;

import com.ras.domain.branch.ChiNhanh;
import com.ras.domain.branch.ChiNhanhRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;
import com.ras.service.branch.BranchDto;
import java.util.List;

@RestController
@RequestMapping("/api/chi-nhanh")
@RequiredArgsConstructor
public class BranchController {

  private final ChiNhanhRepository repo;

  @GetMapping
  public List<BranchDto> list(
      @RequestParam(name = "q", required = false) String q,
      @RequestParam(name = "size", required = false, defaultValue = "20") int size,
      @RequestParam(name = "activeOnly", required = false, defaultValue = "true") boolean activeOnly
  ) {
    String kw = (q == null || q.isBlank()) ? null : q.trim();
    int limit = Math.max(1, Math.min(size, 200));
    List<ChiNhanh> list = repo.search(kw, activeOnly, PageRequest.of(0, limit));
    return list.stream().map(this::toDto).toList();
  }

  @GetMapping("/{id}")
  public BranchDto getOne(@PathVariable("id") Long id) {
    ChiNhanh c = repo.findById(id).orElseThrow();
    return toDto(c);
  }

  private BranchDto toDto(ChiNhanh c) {
    return new BranchDto(
        c.getId(),
        c.getMa(),
        c.getTen(),
        c.getDiaChi(),
        c.getSoDienThoai()
    );
  }
}
