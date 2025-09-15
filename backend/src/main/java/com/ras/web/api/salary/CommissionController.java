package com.ras.web.api.salary;

import com.ras.domain.salary.*;
import com.ras.service.salary.dto.*;
import com.ras.service.salary.SalaryService;
import com.ras.service.salary.SalaryMappers;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/commissions")
public class CommissionController {

    private final SalaryService salaryService;

    // GET /api/commissions?ky_luong_id=&nhan_vien_id=
    @GetMapping
    public ResponseEntity<List<HoaHongDTO>> list(
            @RequestParam("ky_luong_id") Long kyLuongId,
            @RequestParam("nhan_vien_id") Long nhanVienId
    ){
        List<NvHoaHongChotLop> list = salaryService.getHoaHongChiTiet(kyLuongId, nhanVienId);
        return ResponseEntity.ok(list.stream().map(SalaryMappers::toHoaHongDTO).toList());
    }

    // POST /api/commissions  (upsert)
    @PostMapping
    public ResponseEntity<HoaHongDTO> upsert(@RequestBody HoaHongDTO body){
        NvHoaHongChotLop saved = salaryService.saveHoaHong(SalaryMappers.toHoaHongEntity(body));
        return ResponseEntity.ok(SalaryMappers.toHoaHongDTO(saved));
    }

    // DELETE /api/commissions/{id}?ky_luong_id=&nhan_vien_id=
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @RequestParam("ky_luong_id") Long kyLuongId,
            @RequestParam("nhan_vien_id") Long nhanVienId
    ){
        salaryService.deleteHoaHong(id, kyLuongId, nhanVienId);
        return ResponseEntity.noContent().build();
    }
}
