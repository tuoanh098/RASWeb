package com.ras.service.salary;

import com.ras.domain.salary.KyLuong;
import com.ras.domain.salary.KyLuongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service @RequiredArgsConstructor
public class SalaryOpsService {
  private final ProcCaller proc;
  private final KyLuongRepository kyLuongRepo;

  public Long ensureKyLuong(String thang) {
    return kyLuongRepo.findByNamThang(thang)
      .orElseGet(() -> kyLuongRepo.save(KyLuong.builder().namThang(thang).trangThai("nhap").build()))
      .getId();
  }

  public void runTeacher(String thang, Long chiNhanhId) throws Exception {
    ensureKyLuong(thang);
    proc.runTinhLuongGv(thang, chiNhanhId);
  }

  public void runStaff(String thang, Long chiNhanhId) throws Exception {
    ensureKyLuong(thang);
    proc.runTinhLuongNv(thang, chiNhanhId);
  }
}
