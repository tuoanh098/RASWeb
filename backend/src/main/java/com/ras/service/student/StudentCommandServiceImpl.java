package com.ras.service.student;

import com.ras.domain.student.*;
import com.ras.service.student.dto.StudentUpsertReq;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudentCommandServiceImpl implements StudentCommandService {

  private final HocVienRepository repo;

  @Override
  public Long create(StudentUpsertReq req) {
    HocVien h = StudentMapper.toEntity(req, null);
    repo.save(h);
    return h.getId();
  }

  @Override
  public void update(Long id, StudentUpsertReq req) {
    HocVien h = repo.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Học viên không tồn tại: id=" + id));
    StudentMapper.toEntity(req, h);
    repo.save(h);
  }

  @Override
  public void delete(Long id) {
    repo.deleteById(id);
  }
}
