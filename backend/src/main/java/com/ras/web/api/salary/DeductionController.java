package com.ras.web.api.salary;

import com.ras.domain.salary.NvPhatKyLuat;
import com.ras.service.salary.SalaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/deductions")
public class DeductionController {

    private final SalaryService salaryService;

    // GET /api/deductions?ky_luong_id=&nhan_vien_id=
    @GetMapping
    public ResponseEntity<List<NvPhatKyLuat>> list(
            @RequestParam("ky_luong_id") Long kyLuongId,
            @RequestParam("nhan_vien_id") Long nhanVienId
    ){
        return ResponseEntity.ok(salaryService.getPhat(kyLuongId, nhanVienId));
    }

    // POST /api/deductions (upsert)
    @PostMapping
    public ResponseEntity<NvPhatKyLuat> upsert(@RequestBody NvPhatKyLuat body){
        return ResponseEntity.ok(salaryService.savePhat(body));
    }

    // DELETE /api/deductions/{id}?ky_luong_id=&nhan_vien_id=
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @RequestParam("ky_luong_id") Long kyLuongId,
            @RequestParam("nhan_vien_id") Long nhanVienId
    ){
        salaryService.deletePhat(id, kyLuongId, nhanVienId);
        return ResponseEntity.noContent().build();
    }
}
