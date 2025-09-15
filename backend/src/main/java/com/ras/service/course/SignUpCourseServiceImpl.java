package com.ras.service.course;

import com.ras.domain.course.HvDangKyKhoaHoc;
import com.ras.domain.course.HvDangKyKhoaHocRepository;
import com.ras.service.course.dto.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@Transactional
public class SignUpCourseServiceImpl implements SignUpCourseService {

    private final HvDangKyKhoaHocRepository repo;

    public SignUpCourseServiceImpl(HvDangKyKhoaHocRepository repo) {
        this.repo = repo;
    }

    private SignUpDTO map(HvDangKyKhoaHoc e, String nvTuVanTen) {
        SignUpDTO d = new SignUpDTO();
        d.setId(e.getId());
        d.setHocVienId(e.getHocVienId());
        d.setKhoaHocId(e.getKhoaHocId());
        d.setNgayDangKy(e.getNgayDangKy());
        d.setNvTuVanId(e.getNvTuVanId());
        d.setNvTuVanTen(nvTuVanTen);     // có thể null nếu bạn chưa join
        d.setLopHocId(e.getLopHocId());
        d.setGiaoVienId(e.getGiaoVienId());
        d.setGhiChu(e.getGhiChu());
        return d;
    }

    // TODO: nếu bạn có repository/feign cho bảng nhan_vien -> lấy tên tư vấn ở đây
    private String resolveNhanVienTen(Long nvId) {
        // ví dụ: call EmployeesRepository.findById(nvId).map(NhanVien::getHoTen).orElse(null)
        return null;
    }

    @Override
    public SignUpDTO create(SignUpCreateDTO dto) {
        HvDangKyKhoaHoc e = new HvDangKyKhoaHoc();
        e.setHocVienId(dto.getHocVienId());
        e.setKhoaHocId(dto.getKhoaHocId());
        e.setNgayDangKy(dto.getNgayDangKy() != null ? dto.getNgayDangKy() : LocalDate.now());
        e.setNvTuVanId(dto.getNvTuVanId());
        e.setGhiChu(dto.getGhiChu());
        e = repo.save(e);
        return map(e, resolveNhanVienTen(e.getNvTuVanId()));
    }

    @Override
    public SignUpDTO assign(Long id, AssignClassDTO dto) {
        HvDangKyKhoaHoc e = repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Sign up not found"));
        if (dto.getLopHocId() != null) e.setLopHocId(dto.getLopHocId());
        if (dto.getGiaoVienId() != null) e.setGiaoVienId(dto.getGiaoVienId());
        e = repo.save(e);
        return map(e, resolveNhanVienTen(e.getNvTuVanId()));
    }

    @Override
    @Transactional(readOnly = true)
    public List<SignUpDTO> findByStudent(Long hocVienId) {
        return repo.findByHocVien(hocVienId).stream()
                .map(e -> map(e, resolveNhanVienTen(e.getNvTuVanId())))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public MonthlySignUpStatDTO statByMonth(int year, int month) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();
        Long total = repo.countByMonth(start, end);
        return new MonthlySignUpStatDTO(year, month, total == null ? 0 : total);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SignUpDTO> listByMonth(int year, int month) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();
        return repo.findAllByMonth(start, end).stream()
                .map(e -> map(e, resolveNhanVienTen(e.getNvTuVanId())))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SignUpDTO get(Long id) {
        HvDangKyKhoaHoc e = repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Sign up not found"));
        return map(e, resolveNhanVienTen(e.getNvTuVanId()));
    }

    @Override
    public void delete(Long id) {
        if (!repo.existsById(id)) throw new IllegalArgumentException("Sign up not found");
        repo.deleteById(id);
    }
}
