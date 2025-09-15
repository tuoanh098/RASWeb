package com.ras.web.api.salary;
import com.ras.domain.salary.NvPhuCapKhac;
import com.ras.service.salary.SalaryService;    
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/allowances")
public class AllowanceController {

    private final SalaryService salaryService;

    // GET /api/allowances?ky_luong_id=&nhan_vien_id=
    @GetMapping
    public ResponseEntity<List<NvPhuCapKhac>> list(
            @RequestParam("ky_luong_id") Long kyLuongId,
            @RequestParam("nhan_vien_id") Long nhanVienId
    ){
        return ResponseEntity.ok(salaryService.getPhuCapKhac(kyLuongId, nhanVienId));
    }

    // POST /api/allowances
    @PostMapping
    public ResponseEntity<NvPhuCapKhac> upsert(@RequestBody NvPhuCapKhac body){
        return ResponseEntity.ok(salaryService.savePhuCapKhac(body));
    }

    // DELETE /api/allowances/{id}?ky_luong_id=&nhan_vien_id=
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @RequestParam("ky_luong_id") Long kyLuongId,
            @RequestParam("nhan_vien_id") Long nhanVienId
    ){
        salaryService.deletePhuCapKhac(id, kyLuongId, nhanVienId);
        return ResponseEntity.noContent().build();
    }
}
