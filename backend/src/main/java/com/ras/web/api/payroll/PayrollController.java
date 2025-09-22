package com.ras.web.api.payroll;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.ras.service.payroll.PayrollService;
import com.ras.service.payroll.dto.BangLuongRow;
import com.ras.service.payroll.dto.CommissionUpsertRequest;
import com.ras.service.payroll.dto.UpdateBangLuongRequest;
import com.ras.service.payroll.dto.UpdateTyLePctRequest;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payroll")
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollService payrollService;

    /* ===== PERIODS ===== */
    @GetMapping("/periods")
    public List<Map<String,Object>> listPeriods() {
        return payrollService.listPeriods();
    }

    @PostMapping("/periods")
    public Map<String,Object> createPeriod(@RequestBody(required = false) Map<String,Object> body,
                                           @RequestParam(value = "thangKy", required = false) String thangKyQP,
                                           @RequestParam(value = "trangThai", required = false) String trangThaiQP) {
        String thangKy = null, trangThai = null;
        if (body != null) {
            Object tk = body.get("thangKy");
            Object tt = body.get("trangThai");
            if (tk != null) thangKy = tk.toString();
            if (tt != null) trangThai = tt.toString();
        }
        if (thangKy == null) thangKy = thangKyQP;
        if (trangThai == null) trangThai = trangThaiQP;

        if (thangKy == null || !thangKy.matches("\\d{4}-(0[1-9]|1[0-2])")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "thangKy phải là 'YYYY-MM'");
        }
        return payrollService.createPeriod(thangKy, trangThai);
        }

    /* ===== SALARY HEADER (nv_bang_luong_thang) ===== */
    @GetMapping("/salaries")
    public List<BangLuongRow> listSalaries(@RequestParam("ky_luong_id") Long kyLuongId) {
        return payrollService.listSalaries(kyLuongId);
    }

    @PatchMapping("/salaries")
    public BangLuongRow updateSalary(@RequestBody UpdateBangLuongRequest req) {
        return payrollService.updateSalary(req);
    }

    /* ===== COMMISSIONS (nv_hoa_hong_chot_lop) ===== */
    @GetMapping("/commissions")
    public List<Map<String, Object>> listCommissions(
            @RequestParam(value = "ky_luong_id", required = false) Long kyLuongId,
            @RequestParam(value = "kyLuongId",   required = false) Long kyLuongIdAlt,
            @RequestParam(value = "nhan_vien_id", required = false) Long nhanVienId,
            @RequestParam(value = "nhanVienId",   required = false) Long nhanVienIdAlt
    ) {
        // chấp nhận cả 2 kiểu đặt tên tham số
        Long ky = (kyLuongId != null) ? kyLuongId : kyLuongIdAlt;
        Long nv = (nhanVienId != null) ? nhanVienId : nhanVienIdAlt;

        if (ky == null || nv == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Thiếu tham số ky_luong_id và/hoặc nhan_vien_id"
            );
        }
        return payrollService.listCommissions(ky, nv);
    }

    @PostMapping("/commissions")
    public Map<String,Object> upsertCommission(@RequestBody CommissionUpsertRequest req) {
        return payrollService.upsertCommission(req);
    }

    @PatchMapping("/commissions/{id}")
    public Map<String,Object> updateCommissionPct(@PathVariable Long id,
                                                  @RequestBody UpdateTyLePctRequest req) {
        return payrollService.updateCommissionPercent(id, req.getTy_le_pct(), req.isRecalc());
    }

    @DeleteMapping("/commissions/{id}")
    public void deleteCommission(@PathVariable Long id) {
        payrollService.deleteCommission(id);
    }
}
