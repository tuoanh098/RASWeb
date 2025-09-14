package com.ras.service.student;

import com.ras.domain.student.*;
import com.ras.web.api.common.PageResponse;
import com.ras.service.student.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudentQueryServiceImpl implements StudentQueryService {

  private final HocVienRepository repo;

  @Override
  public PageResponse<StudentListItemDto> list(String q, Long branchId, Pageable pageable) {
    Specification<HocVien> spec = Specification.where(null);

    if (q != null && !q.trim().isEmpty()) {
      final String like = "%" + q.trim().toLowerCase() + "%";
      spec = spec.and((root, cq, cb) -> cb.or(
          cb.like(cb.lower(root.get("hocSinh")), like),
          cb.like(cb.lower(root.get("hsPhone")), like),
          cb.like(cb.lower(root.get("email")), like),
          cb.like(cb.lower(root.get("phuHuynh")), like),
          cb.like(cb.lower(root.get("phuHuynhPhone")), like)
      ));
    }
    if (branchId != null) {
      // placeholder: tuỳ business thật mà join/so sánh
      spec = spec.and((root, cq, cb) -> cb.isNotNull(root.get("chiNhanhHoTro")));
    }

    Page<HocVien> page = repo.findAll(spec, pageable);
    Page<StudentListItemDto> mapped = page.map(StudentMapper::toListItem);
    return PageResponse.of(mapped);
  }

  @Override
  public StudentDetailDto get(Long id) {
    HocVien h = repo.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Học viên không tồn tại: id=" + id));
    return StudentMapper.toDetail(h);
  }
}