package com.ras.web.api.salary;

import com.ras.domain.salary.GvThanhToanBuoi; // nếu cần check foreign key khi xóa rule, bỏ qua
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.*;
import org.springframework.data.domain.PageRequest;

import com.ras.domain.salary.GvBonus; // placeholder

@RestController
@RequestMapping("/api/salary/rules")
@RequiredArgsConstructor
public class RuleController {
  private final com.ras.domain.salary.GvBonusRepository bonusRepo; // ví dụ: rule khác thì tạo thêm entity/repo tương ứng

  @GetMapping("/bonus")
  public Page<com.ras.domain.salary.GvBonus> bonus(@RequestParam(defaultValue="0") int page,
                                                   @RequestParam(defaultValue="20") int size) {
    return bonusRepo.findAll(PageRequest.of(page, size));
  }
  @PostMapping("/bonus") public GvBonus create(@RequestBody GvBonus x){ return bonusRepo.save(x); }
  @PutMapping("/bonus/{id}") public GvBonus update(@PathVariable Long id, @RequestBody GvBonus x){ x.setId(id); return bonusRepo.save(x); }
  @DeleteMapping("/bonus/{id}") public void delete(@PathVariable Long id){ bonusRepo.deleteById(id); }
}
