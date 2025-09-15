package com.ras.web.api.salary;

import com.ras.domain.salary.GvBonusRule;
import com.ras.domain.salary.GvDonGiaDayRule;
import com.ras.domain.salary.GvBonusRuleRepository;
import com.ras.domain.salary.GvDonGiaDayRuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Optional;

@RestController
@RequestMapping("/api/salary/rules")
@RequiredArgsConstructor
public class RuleAdminController {

  private final GvDonGiaDayRuleRepository donGiaRepo;
  private final GvBonusRuleRepository bonusRepo;

  // ===== ĐƠN GIÁ DẠY (GV) =====
  @GetMapping("/don-gia")
  public Page<GvDonGiaDayRule> listDonGia(
      @RequestParam(required=false) Long monHocId,
      @RequestParam(required=false) Long capDoId,
      @RequestParam(required=false) String loaiLop,
      @RequestParam(required=false) Short thoiLuongPhut,
      @RequestParam(required=false) String hinhThuc,
      @RequestParam(required=false) String tuNgay,    // yyyy-MM-dd
      @RequestParam(required=false) String denNgay,
      @RequestParam(defaultValue="0") int page,
      @RequestParam(defaultValue="20") int size) {
    return donGiaRepo.search(monHocId, capDoId, loaiLop, thoiLuongPhut, hinhThuc,
        tuNgay!=null? LocalDate.parse(tuNgay) : null,
        denNgay!=null? LocalDate.parse(denNgay) : null,
        PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "hieuLucTu")));
  }

  @PostMapping("/don-gia")
  public GvDonGiaDayRule createDonGia(@RequestBody GvDonGiaDayRule r){ return donGiaRepo.save(r); }

  @PutMapping("/don-gia/{id}")
  public GvDonGiaDayRule updateDonGia(@PathVariable Long id, @RequestBody GvDonGiaDayRule r){
    r.setId(id); return donGiaRepo.save(r);
  }

  @DeleteMapping("/don-gia/{id}")
  public void deleteDonGia(@PathVariable Long id){ donGiaRepo.deleteById(id); }

  // test-match đơn giá (trả rule tốt nhất)
  public record DonGiaMatchReq(Long monHocId, String loaiLop, Short thoiLuongPhut, String hinhThuc, String ngay){}
  @PostMapping("/don-gia/match")
  public Optional<GvDonGiaDayRule> matchDonGia(@RequestBody DonGiaMatchReq req){
    var list = donGiaRepo.findBest(
        req.monHocId(), req.loaiLop(), req.thoiLuongPhut(), req.hinhThuc(),
        req.ngay()!=null? LocalDate.parse(req.ngay()) : LocalDate.now(),
        PageRequest.of(0,1));
    return list.stream().findFirst();
  }

  // ===== BONUS RULE =====
  @GetMapping("/bonus")
  public Page<GvBonusRule> listBonusRule(
      @RequestParam(required=false) String loaiBuoi,
      @RequestParam(required=false) Long monHocId,
      @RequestParam(required=false) Short thoiLuongPhut,
      @RequestParam(required=false) String tuNgay,
      @RequestParam(required=false) String denNgay,
      @RequestParam(defaultValue="0") int page,
      @RequestParam(defaultValue="20") int size) {
    return bonusRepo.search(loaiBuoi, monHocId, thoiLuongPhut,
        tuNgay!=null? LocalDate.parse(tuNgay) : null,
        denNgay!=null? LocalDate.parse(denNgay) : null,
        PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "hieuLucTu")));
  }

  @PostMapping("/bonus")
  public GvBonusRule createBonusRule(@RequestBody GvBonusRule r){ return bonusRepo.save(r); }

  @PutMapping("/bonus/{id}")
  public GvBonusRule updateBonusRule(@PathVariable Long id, @RequestBody GvBonusRule r){
    r.setId(id); return bonusRepo.save(r);
  }

  @DeleteMapping("/bonus/{id}")
  public void deleteBonusRule(@PathVariable Long id){ bonusRepo.deleteById(id); }

  // test-match bonus (trả rule tốt nhất)
  public record BonusMatchReq(String loaiBuoi, Long monHocId, Short thoiLuongPhut, String ngay){}
  @PostMapping("/bonus/match")
  public Optional<GvBonusRule> matchBonus(@RequestBody BonusMatchReq req){
    var list = bonusRepo.findBest(
        req.loaiBuoi(), req.monHocId(), req.thoiLuongPhut(),
        req.ngay()!=null? LocalDate.parse(req.ngay()) : LocalDate.now(),
        PageRequest.of(0,1));
    return list.stream().findFirst();
  }
}
