package com.ras.web.api.salary;

import com.ras.domain.salary.*;
import com.ras.service.salary.*;
import com.ras.service.salary.dto.SalaryDtos.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/salary")
@RequiredArgsConstructor
public class SalaryController {
  private final GvThanhToanBuoiRepository buoiRepo;
  private final GvBangLuongThangRepository gvTongRepo;
  private final NvBangLuongThangRepository nvTongRepo;
  private final GvBonusRepository bonusRepo;
  private final GvKhauTruRepository khauTruRepo;
  private final SalaryOpsService ops;
  private final CellEditService cell;

  // ===== Meta (màu theme cho FE trang trí theo RAS) =====
  @GetMapping("/meta")
  public Meta meta() {
    return Meta.builder()
      .themePrimary("#E51A4C") // hồng RAS
      .themeDark("#121212")
      .themeAccent("#FFC107")
      .build();
  }

  // ===== Buổi GV (grid chính) =====
  @GetMapping("/teacher/buoi")
  public Page<GvThanhToanBuoi> listBuoi(@RequestParam(required=false) Long kyLuongId,
                                        @RequestParam(required=false) Long chiNhanhId,
                                        @RequestParam(required=false) Long nhanVienId,
                                        @RequestParam(defaultValue="0") int page,
                                        @RequestParam(defaultValue="20") int size) {
    return buoiRepo.search(kyLuongId, chiNhanhId, nhanVienId, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC,"ngayDay")));
  }

  // ===== Tổng hợp tháng GV/NV =====
  @GetMapping("/teacher/payroll")
  public Page<GvBangLuongThang> gvPayroll(@RequestParam Long kyLuongId,
                                          @RequestParam(defaultValue="0") int page,
                                          @RequestParam(defaultValue="20") int size) {
    return gvTongRepo.byKyLuong(kyLuongId, PageRequest.of(page, size, Sort.by("nhanVienId")));
  }

  @GetMapping("/staff/payroll")
  public Page<NvBangLuongThang> nvPayroll(@RequestParam Long kyLuongId,
                                          @RequestParam(defaultValue="0") int page,
                                          @RequestParam(defaultValue="20") int size) {
    return nvTongRepo.byKyLuong(kyLuongId, PageRequest.of(page, size, Sort.by("nhanVienId")));
  }

  // ===== Chạy SP tổng hợp (Teacher/Staff) =====
  public record RunReq(String thang, Long chiNhanhId) {}
  @PostMapping("/run/teacher") public void runTeacher(@RequestBody RunReq r) throws Exception { ops.runTeacher(r.thang(), r.chiNhanhId()); }
  @PostMapping("/run/staff")   public void runStaff(@RequestBody RunReq r)   throws Exception { ops.runStaff(r.thang(), r.chiNhanhId()); }

  // ===== Bonus & Khấu trừ (CRUD nhanh cho tab phụ) =====
  @GetMapping("/teacher/bonus") public Page<GvBonus> listBonus(@RequestParam(defaultValue="0") int page,
                                                               @RequestParam(defaultValue="20") int size) {
    return bonusRepo.findAll(PageRequest.of(page, size));
  }
  @PostMapping("/teacher/bonus") public GvBonus addBonus(@RequestBody GvBonus x){ return bonusRepo.save(x); }
  @PutMapping("/teacher/bonus/{id}") public GvBonus updBonus(@PathVariable Long id, @RequestBody GvBonus x){ x.setId(id); return bonusRepo.save(x); }
  @DeleteMapping("/teacher/bonus/{id}") public void delBonus(@PathVariable Long id){ bonusRepo.deleteById(id); }

  @GetMapping("/teacher/khau-tru") public Page<GvKhauTru> listKT(@RequestParam(defaultValue="0") int page,
                                                                 @RequestParam(defaultValue="20") int size) {
    return khauTruRepo.findAll(PageRequest.of(page, size));
  }
  @PostMapping("/teacher/khau-tru") public GvKhauTru addKT(@RequestBody GvKhauTru x){ return khauTruRepo.save(x); }
  @PutMapping("/teacher/khau-tru/{id}") public GvKhauTru updKT(@PathVariable Long id, @RequestBody GvKhauTru x){ x.setId(id); return khauTruRepo.save(x); }
  @DeleteMapping("/teacher/khau-tru/{id}") public void delKT(@PathVariable Long id){ khauTruRepo.deleteById(id); }

  // ===== Double-click cell (update 1 ô) =====
  public record CellEditReq(String table, Long id, String column, Object value) {}
  @PatchMapping("/cell")
  public int editCell(@RequestBody CellEditReq req) { return cell.updateCell(req.table(), req.id(), req.column(), req.value()); }
}
