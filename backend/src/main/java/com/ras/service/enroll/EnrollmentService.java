// src/main/java/com/ras/service/enroll/EnrollmentService.java
package com.ras.service.enroll;

import com.ras.domain.enroll.DangKyKhoaHoc;
import com.ras.domain.enroll.DangKyKhoaHocRepo;
import com.ras.domain.enroll.SignupCreateRequest;
import com.ras.domain.pricing.CapDo;
import com.ras.domain.pricing.GiaiDoan;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;

@Service
public class EnrollmentService {

  private final DangKyKhoaHocRepo repo;

  public EnrollmentService(DangKyKhoaHocRepo repo) {
    this.repo = repo;
  }

  public DangKyKhoaHoc create(SignupCreateRequest r) {
    DangKyKhoaHoc e = new DangKyKhoaHoc();
    e.setHocVienId(r.hoc_vien_id);
    e.setKhoaHocId(r.khoa_hoc_id);
    e.setGiaiDoan(GiaiDoan.from(r.giai_doan));
    e.setCapDo(CapDo.from(r.cap_do));
    e.setSoBuoiKhoa(r.so_buoi_khoa);

    // LƯU Ý: theo yêu cầu — luôn lưu "6,7"
    // (sau này UI có thể hiển thị Quận 2 / Quận 7 từ chuỗi này)
    e.setChiNhanh("6,7");

    e.setNhanVienTuVanId(r.nhan_vien_tu_van_id);
    e.setGiaoVienId(r.giao_vien_id);
    e.setHocPhiApDung(r.hoc_phi_ap_dung);
    if (StringUtils.hasText(r.ngay_dang_ky)) {
      e.setNgayDangKy(LocalDate.parse(r.ngay_dang_ky));
    }
    e.setGhiChu(r.ghi_chu);

    return repo.save(e);
  }

  public DangKyKhoaHocRepo.SummaryRow summaryByMonth(String ym) {
    return repo.summaryByMonth(ym);
  }
}
