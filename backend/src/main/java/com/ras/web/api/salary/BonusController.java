package com.ras.web.api.salary;
import com.ras.domain.salary.*;
import com.ras.service.salary.SalaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bonuses")
@RequiredArgsConstructor
public class BonusController {
  private final SalaryService salaryService;

  @GetMapping("/tiers")
  public ResponseEntity<List<NvThuongBac>> listTiers(@RequestParam("ky_luong_id") Long ky, @RequestParam("nhan_vien_id") Long nv) {
    return ResponseEntity.ok(salaryService.getThuongBac(ky, nv));
  }
  @PostMapping("/tiers")
  public ResponseEntity<NvThuongBac> upsertTier(@RequestBody NvThuongBac b) {
    return ResponseEntity.ok(salaryService.saveThuongBac(b));
  }
  @DeleteMapping("/tiers/{id}")
  public ResponseEntity<Void> deleteTier(@PathVariable Long id, @RequestParam("ky_luong_id") Long ky, @RequestParam("nhan_vien_id") Long nv) {
    salaryService.deleteThuongBac(id, ky, nv); return ResponseEntity.noContent().build();
  }

  @GetMapping("/others")
  public ResponseEntity<List<NvThuongKhac>> listOthers(@RequestParam("ky_luong_id") Long ky, @RequestParam("nhan_vien_id") Long nv) {
    return ResponseEntity.ok(salaryService.getThuongKhac(ky, nv));
  }
  @PostMapping("/others")
  public ResponseEntity<NvThuongKhac> upsertOther(@RequestBody NvThuongKhac b) {
    return ResponseEntity.ok(salaryService.saveThuongKhac(b));
  }
  @DeleteMapping("/others/{id}")
  public ResponseEntity<Void> deleteOther(@PathVariable Long id, @RequestParam("ky_luong_id") Long ky, @RequestParam("nhan_vien_id") Long nv) {
    salaryService.deleteThuongKhac(id, ky, nv); return ResponseEntity.noContent().build();
  }
}

