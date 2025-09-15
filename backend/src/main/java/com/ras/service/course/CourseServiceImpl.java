package com.ras.service.course;

import com.ras.domain.course.KhoaHoc;
import com.ras.domain.course.KhoaHocRepository;
import com.ras.domain.course.LoaiLop;
import com.ras.service.course.dto.CourseDTO;
import com.ras.service.course.dto.CourseUpsertDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CourseServiceImpl implements CourseService {

    private final KhoaHocRepository repo;

    public CourseServiceImpl(KhoaHocRepository repo) {
        this.repo = repo;
    }

    private static CourseDTO map(KhoaHoc e) {
        CourseDTO d = new CourseDTO();
        d.setId(e.getId());
        d.setMonHocId(e.getMonHocId());
        d.setLoaiLop(e.getLoaiLop());
        d.setThoiLuongPhut(e.getThoiLuongPhut());
        d.setMa(e.getMa());
        d.setTenHienThi(e.getTenHienThi());
        return d;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> search(String q, Long monHocId, LoaiLop loaiLop, Short thoiLuongPhut) {
        return repo.search(q, monHocId, loaiLop, thoiLuongPhut).stream().map(CourseServiceImpl::map).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CourseDTO get(Long id) {
        KhoaHoc e = repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Course not found"));
        return map(e);
    }

    @Override
    public CourseDTO create(CourseUpsertDTO dto) {
        // Unique check
        if (repo.existsByMonHocIdAndLoaiLopAndThoiLuongPhut(dto.getMonHocId(), dto.getLoaiLop(), dto.getThoiLuongPhut())) {
            throw new IllegalArgumentException("Khóa học đã tồn tại (mon_hoc_id, loai_lop, thoi_luong_phut).");
        }
        if (dto.getMa() != null && !dto.getMa().isBlank() && repo.existsByMa(dto.getMa())) {
            throw new IllegalArgumentException("Mã khóa học đã tồn tại.");
        }
        KhoaHoc e = new KhoaHoc();
        e.setMonHocId(dto.getMonHocId());
        e.setLoaiLop(dto.getLoaiLop());
        e.setThoiLuongPhut(dto.getThoiLuongPhut());
        e.setMa(dto.getMa());
        e.setTenHienThi(dto.getTenHienThi());
        return map(repo.save(e));
    }

    @Override
    public CourseDTO update(Long id, CourseUpsertDTO dto) {
        KhoaHoc e = repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Course not found"));
        // Nếu thay đổi bộ unique, kiểm tra lại
        boolean changedKey = !e.getMonHocId().equals(dto.getMonHocId())
                || e.getLoaiLop() != dto.getLoaiLop()
                || !e.getThoiLuongPhut().equals(dto.getThoiLuongPhut());
        if (changedKey && repo.existsByMonHocIdAndLoaiLopAndThoiLuongPhut(dto.getMonHocId(), dto.getLoaiLop(), dto.getThoiLuongPhut())) {
            throw new IllegalArgumentException("Khóa học (mon_hoc_id, loai_lop, thoi_luong_phut) đã tồn tại.");
        }
        if (dto.getMa() != null && !dto.getMa().isBlank()) {
            var existing = repo.findByMa(dto.getMa());
            if (existing.isPresent() && !existing.get().getId().equals(id)) {
                throw new IllegalArgumentException("Mã khóa học đã tồn tại.");
            }
        }
        e.setMonHocId(dto.getMonHocId());
        e.setLoaiLop(dto.getLoaiLop());
        e.setThoiLuongPhut(dto.getThoiLuongPhut());
        e.setMa(dto.getMa());
        e.setTenHienThi(dto.getTenHienThi());
        return map(repo.save(e));
    }

    @Override
    public void delete(Long id) {
        if (!repo.existsById(id)) throw new IllegalArgumentException("Course not found");
        repo.deleteById(id);
    }
}
