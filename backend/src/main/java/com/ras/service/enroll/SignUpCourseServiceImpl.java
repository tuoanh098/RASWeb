package com.ras.service.enroll;

import com.ras.domain.enroll.DangKyLop;
import com.ras.domain.salary.NvHoaHongChotLop;
import com.ras.domain.salary.NvKyLuong;
import com.ras.service.enroll.dto.SignUpCourseRequest;
import com.ras.service.enroll.dto.SignUpCourseResponse;
import com.ras.service.enroll.dto.SignupSummaryDTO;
import com.ras.domain.salary.NvHoaHongChotLopRepository;
import com.ras.domain.salary.NvKyLuongRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SignUpCourseServiceImpl implements SignUpCourseService {

    private final NvKyLuongRepository kyLuongRepo;
    private final NvHoaHongChotLopRepository hoaHongRepo;

    public SignUpCourseServiceImpl(
            NvKyLuongRepository kyLuongRepo,
            NvHoaHongChotLopRepository hoaHongRepo
    ) {
        this.kyLuongRepo = kyLuongRepo;
        this.hoaHongRepo = hoaHongRepo;
    }

    @Override
    @Transactional
    public SignUpCourseResponse signUp(SignUpCourseRequest req) {
        String yyyyMM = req.getKyLuongThang();
        if (yyyyMM == null) {
            yyyyMM = toYearMonth(LocalDateTime.now().getYear(), LocalDateTime.now().getMonthValue());
        }
        NvKyLuong kyLuong = ensurePayrollPeriod(yyyyMM);

        BigDecimal commission = safe(req.getHocPhiApDung())
                .multiply(new BigDecimal("0.02"))
                .setScale(0, RoundingMode.HALF_UP);

        NvHoaHongChotLop hh = NvHoaHongChotLop.builder()
                .kyLuongId(kyLuong.getId())
                .nhanVienId(req.getNvTuVanId())
                .hocPhiApDung(req.getHocPhiApDung())
                .soTien(commission)
                .ghiChu(safeText(req.getGhiChu()))
                .build();

        NvHoaHongChotLop saved = hoaHongRepo.save(hh);

        return new SignUpCourseResponse(req.getLopId(), kyLuong.getId(), saved.getId());
    }

    @Override
    public List<DangKyLop> listOfStudent(Long hocVienId) {
        // Lấy danh sách hoa hồng dựa trên học viên
        List<NvHoaHongChotLop> hoaHongList = hoaHongRepo.findAll().stream()
                .filter(hh -> hh.getHocVienId().equals(hocVienId))
                .toList();

        return hoaHongList.stream()
                .map(hh -> new DangKyLop(
                        hh.getHocVienId(),
                        hh.getDangKyId(),
                        hh.getKhoaHocMauId(),
                        hocVienId, null, null, hh.getGhiChu(), null
                ))
                .toList();
    }

    @Override 
    public SignupSummaryDTO monthlySummary(String yyyyMM) {
        // Tính tổng số lượng đăng ký trong một tháng
        List<NvHoaHongChotLop> hoaHongList = hoaHongRepo.findAll();
        long tongDangKy = hoaHongList.stream()
                .filter(hh -> yyyyMM.equals(hh.getKyLuongId().toString()))
                .count();

        return new SignupSummaryDTO(yyyyMM, tongDangKy);
    }

    private NvKyLuong ensurePayrollPeriod(String yyyyMM) {
        return kyLuongRepo.findByNamThang(yyyyMM)
                .orElseGet(() -> {
                    NvKyLuong e = new NvKyLuong();
                    e.setNamThang(yyyyMM);
                    e.setTrangThai("nhap");
                    e.setTaoLuc(java.time.LocalDateTime.now()); // đúng kiểu LocalDateTime
                    return kyLuongRepo.save(e);
                });
    }

    private static BigDecimal safe(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    private static String safeText(String text) {
        return text == null || text.isBlank() ? "Ghi chú" : text.trim();
    }

    private static String toYearMonth(int year, int month) {
        return String.format("%04d-%02d", year, month);
    }
}