package com.ras.service.enroll;

import com.ras.domain.enroll.Enrollment;
import com.ras.domain.enroll.EnrollmentRepository;
import com.ras.service.commission.CommissionAwardInput;
import com.ras.service.commission.CommissionAwardService;
import com.ras.service.enroll.dto.EnrollmentCreateDto;
import com.ras.service.enroll.dto.EnrollmentDto;
import com.ras.service.enroll.dto.MonthlySignUpStatDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EnrollmentServiceImpl implements EnrollmentService {

  private final EnrollmentRepository enrollmentRepo;
  private final CommissionAwardService commissionAwardService;

  @Override
  @Transactional
  public EnrollmentDto create(EnrollmentCreateDto req) {
    validateCreate(req);

    // Map DTO -> Entity
    Enrollment e = new Enrollment();
    e.setHocVienId(req.getHocVienId());
    e.setKhoaHocMauId(req.getKhoaHocMauId());
    e.setNhanVienTuVanId(req.getNhanVienTuVanId());
    e.setGiaoVienId(req.getGiaoVienId());
    e.setChiNhanhId(req.getChiNhanhId());
    e.setHocPhiApDung(safeMoney(req.getHocPhiApDung()));
    e.setNgayDangKy(req.getNgayDangKy());
    e.setTaoLuc(java.time.LocalDateTime.now());
    e.setGhiChu(req.getGhiChu());

    try { 
      // Lưu & flush để có ID
      enrollmentRepo.saveAndFlush(e);

      // Chấm hoa hồng ở transaction riêng (REQUIRES_NEW trong service kia)
      commissionAwardService.awardFromSignup(
          CommissionAwardInput.builder()
              .dangKyId(e.getId())
              .ngayDangKy(req.getNgayDangKy())
              .hocVienId(req.getHocVienId())
              .chiNhanhId(req.getChiNhanhId())
              .nhanVienTuVanId(req.getNhanVienTuVanId())
              .khoaHocMauId(req.getKhoaHocMauId())
              .hocPhiApDung(e.getHocPhiApDung())
              .build()
      );

      return toDto(e);
      } catch (org.springframework.dao.DataIntegrityViolationException ex) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
            "Dữ liệu không hợp lệ: " + rootMsg(ex), ex);
      } catch (jakarta.persistence.PersistenceException ex) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
            "Lỗi CSDL: " + rootMsg(ex), ex);
      } catch (Exception ex) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
            "Tạo đăng ký thất bại: " + rootMsg(ex), ex);
      }
  }

  @Override
  @Transactional(readOnly = true)
  public List<EnrollmentDto> listByStudent(Long studentId) {
    if (studentId == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thiếu studentId");
    }
    return enrollmentRepo.findByHocVienIdOrderByNgayDangKyDesc(studentId)
        .stream()
        .map(this::toDto)
        .toList();
  }

  @Override
  @Transactional(readOnly = true)
  public MonthlySignUpStatDTO summaryByMonth(String ym) {
    if (ym == null || ym.isBlank())
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thiếu tham số month (YYYY-MM)");

    long totalEnrollments = enrollmentRepo.countByMonth(ym);
    BigDecimal totalTuition = enrollmentRepo.sumTuitionByMonth(ym);
    if (totalTuition == null) totalTuition = BigDecimal.ZERO;

    // Hoa hồng 2% tổng quan (tham khảo hiển thị dashboard)
    BigDecimal totalCommission2pct = totalTuition
        .multiply(new BigDecimal("0.02"))
        .setScale(0, RoundingMode.HALF_UP);

    return new MonthlySignUpStatDTO(ym, totalEnrollments, totalTuition, totalCommission2pct);
  }

  /* ====================== Helpers ====================== */

  private static BigDecimal safeMoney(BigDecimal v) {
    if (v == null) return BigDecimal.ZERO;
    // Ép scale = 0 cho VND
    return v.setScale(0, RoundingMode.HALF_UP);
  }

  private static String rootMsg(Throwable t) {
    Throwable c = t;
    while (c.getCause() != null) c = c.getCause();
    String m = String.valueOf(c.getMessage());
    // vài thông điệp phổ biến để bạn dễ đọc:
    if (m.contains("tao_luc")) return "cột 'tao_luc' đang NULL hoặc thiếu DEFAULT";
    if (m.contains("foreign key")) return "Sai khoá ngoại (ID không tồn tại)";
    return m;
  }

  private static void validateCreate(EnrollmentCreateDto req) {
    if (req == null)
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request rỗng");

    if (req.getHocVienId() == null || req.getHocVienId() <= 0)
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thiếu/không hợp lệ hoc_vien_id");

    if (req.getKhoaHocMauId() == null || req.getKhoaHocMauId() <= 0)
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thiếu/không hợp lệ khoa_hoc_mau_id");

    LocalDate d = req.getNgayDangKy();
    if (d == null)
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thiếu ngay_dang_ky");
  }

  private EnrollmentDto toDto(Enrollment e) {
    BigDecimal hocPhi = safeMoney(e.getHocPhiApDung());
    BigDecimal hh2pct = hocPhi.multiply(new BigDecimal("0.02")).setScale(0, RoundingMode.HALF_UP);

    return EnrollmentDto.builder()
        .id(e.getId())
        .hocVienId(e.getHocVienId())
        .khoaHocMauId(e.getKhoaHocMauId())
        .nhanVienTuVanId(e.getNhanVienTuVanId())
        .giaoVienId(e.getGiaoVienId())
        .chiNhanhId(e.getChiNhanhId())
        .hocPhiApDung(hocPhi)
        .hoaHong2pct(hh2pct)               // FE hiển thị trực tiếp cột hoa hồng dự kiến
        .ngayDangKy(e.getNgayDangKy())
        .ghiChu(e.getGhiChu())
        .build();
  }
}
