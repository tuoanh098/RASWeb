package com.ras.web.api.salary;
import com.ras.domain.salary.NvKyLuongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/api/payroll")
@RequiredArgsConstructor
public class PayrollController {

  private final NvKyLuongRepository repo;

  @GetMapping("/resolve")
  public ResponseEntity<?> resolve(@RequestParam int month, @RequestParam int year) {
    if (month < 1 || month > 12) return ResponseEntity.badRequest().body("month invalid");
    String namThang = String.format("%04d-%02d", year, month); // "2025-09"

    var k = repo.findByNamThang(namThang)
                .orElse(null);
    if (k == null) return ResponseEntity.notFound().build();

    record Res(Long id, String nam_thang) {}
    return ResponseEntity.ok(new Res(k.getId(), k.getNamThang()));
  }
}