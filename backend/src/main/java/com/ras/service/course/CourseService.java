package com.ras.service.course;

import com.ras.domain.course.LoaiLop;
import com.ras.service.course.dto.CourseDTO;
import com.ras.service.course.dto.CourseUpsertDTO;

import java.util.List;

public interface CourseService {
  // dùng cho UI dropdown nhanh
  List<CourseDTO> searchTemplates(String q, int size);
  CourseDTO templateDetail(Long id);

  // các hàm CRUD/search theo interface cũ của bạn
  CourseDTO create(CourseUpsertDTO req);
  CourseDTO get(Long id);
  CourseDTO update(Long id, CourseUpsertDTO req);
  void delete(Long id);
  List<CourseDTO> search(String q, Long monHocId, LoaiLop loaiLop, Short thoiLuongPhut);
}
