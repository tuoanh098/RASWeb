package com.ras.web.api.salary;

import com.ras.domain.salary.NvHoaHongChotLop;
import lombok.RequiredArgsConstructor;
import com.ras.service.salary.SalaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ras.service.salary.dto.HoaHongDTO;
import com.ras.service.salary.dto.SalaryRowDTO;
import com.ras.service.salary.SalaryMappers;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/salary")
@RequiredArgsConstructor
public class SalaryController {

    private final SalaryService salaryService;

    @GetMapping
    public ResponseEntity<List<SalaryRowDTO>> getBangLuong(@RequestParam(name="ky_luong_id") Long kyLuongId) {
        var rows = salaryService.getBangLuongThang(kyLuongId);
        return ResponseEntity.ok(rows.stream().map(SalaryMappers::toSalaryRowDTO).toList());
    }

    @GetMapping("/total")
    public ResponseEntity<BigDecimal> getTongLuong(@RequestParam(name="ky_luong_id") Long kyLuongId) {
        return ResponseEntity.ok(salaryService.getTongLuongThang(kyLuongId));
    }

    // GET /api/salary/{nhan_vien_id}/hoa-hong?ky_luong_id=123 → list chi tiết hoa hồng
    @GetMapping("/{nhan_vien_id}/hoa-hong")
    public ResponseEntity<List<HoaHongDTO>> getHoaHong(
            @PathVariable("nhan_vien_id") Long nhanVienId,
            @RequestParam(name = "ky_luong_id") Long kyLuongId
    ) {
        List<NvHoaHongChotLop> list = salaryService.getHoaHongChiTiet(kyLuongId, nhanVienId);
        return ResponseEntity.ok(list.stream().map(SalaryMappers::toHoaHongDTO).toList());
    }

    // POST /api/salary/{nhan_vien_id}/hoa-hong  → thêm/sửa một dòng hoa hồng
    @PostMapping("/{nhan_vien_id}/hoa-hong")
    public ResponseEntity<HoaHongDTO> upsertHoaHong(
            @PathVariable("nhan_vien_id") Long nhanVienId,
            @RequestBody HoaHongDTO payload
    ) {
        // đảm bảo path vs body khớp
        payload.setNhan_vien_id(nhanVienId);

        NvHoaHongChotLop entity = SalaryMappers.toHoaHongEntity(payload);
        NvHoaHongChotLop saved = salaryService.saveHoaHong(entity);
        return ResponseEntity.ok(SalaryMappers.toHoaHongDTO(saved));
    }
}
