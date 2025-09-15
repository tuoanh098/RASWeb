package com.ras.web.api.salary;

import com.ras.domain.salary.NvPhatKyLuat;
import com.ras.service.salary.StaffSalaryService;
import com.ras.service.salary.dto.*;
import com.ras.web.api.common.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/staff-salary")
@RequiredArgsConstructor
public class StaffSalaryController {

    private final StaffSalaryService service;

    @GetMapping
    public PageResponse<StaffSalaryRow> list(
            @RequestParam("ky") String ky,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        var pg = PageRequest.of(page, size);
        var data = service.list(ky, pg);
        return PageResponse.of(data); // ⬅️ sửa: truyền Page vào thẳng
    }

    @PostMapping("/recalc")
    public String recalc(@RequestBody RunReq req) {
        service.recalc(req.ky());
        return "OK";
    }

    @PutMapping("/{bangLuongId}")
    public String updateLuong(@PathVariable Long bangLuongId, @RequestBody StaffLuongUpdateReq req) {
        service.updateLuong(bangLuongId, req);
        // recalc sẽ được gọi từ UI (hoặc tự gọi thêm ở đây nếu muốn)
        return "OK";
    }

    @PostMapping("/penalties")
    public NvPhatKyLuat addPenalty(@RequestBody StaffPenaltyReq req) {
        return service.addPenalty(req);
    }

    @GetMapping("/penalties")
    public PageResponse<NvPhatKyLuat> listPenalties(
            @RequestParam("ky") String ky,
            @RequestParam("nhanVienId") Long nhanVienId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        var pg = PageRequest.of(page, size);
        var data = service.listPenalties(ky, nhanVienId, pg);
        return PageResponse.of(data); // ⬅️ sửa: truyền Page vào thẳng
    }

    public record RunReq(String ky) {}
}
