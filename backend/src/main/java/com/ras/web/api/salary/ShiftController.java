package com.ras.web.api.salary;
import com.ras.domain.salary.NvTruc;
import com.ras.service.salary.SalaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/shifts")
public class ShiftController {

    private final SalaryService salaryService;

    // GET /api/shifts?ky_luong_id=&nhan_vien_id=
    @GetMapping
    public ResponseEntity<List<NvTruc>> list(
            @RequestParam("ky_luong_id") Long kyLuongId,
            @RequestParam("nhan_vien_id") Long nhanVienId
    ){
        return ResponseEntity.ok(salaryService.getTruc(kyLuongId, nhanVienId));
    }

    // POST /api/shifts
    @PostMapping
    public ResponseEntity<NvTruc> upsert(@RequestBody NvTruc body){
        return ResponseEntity.ok(salaryService.saveTruc(body));
    }

    // DELETE /api/shifts/{id}?ky_luong_id=&nhan_vien_id=
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @RequestParam("ky_luong_id") Long kyLuongId,
            @RequestParam("nhan_vien_id") Long nhanVienId
    ){
        salaryService.deleteTruc(id, kyLuongId, nhanVienId);
        return ResponseEntity.noContent().build();
    }
}
