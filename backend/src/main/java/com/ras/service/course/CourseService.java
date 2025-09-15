package com.ras.service.course;
import com.ras.domain.course.LoaiLop;
import com.ras.service.course.dto.CourseDTO;
import com.ras.service.course.dto.CourseUpsertDTO;

import java.util.List;

public interface CourseService {
    List<CourseDTO> search(String q, Long monHocId, LoaiLop loaiLop, Short thoiLuongPhut);
    CourseDTO get(Long id);
    CourseDTO create(CourseUpsertDTO dto);
    CourseDTO update(Long id, CourseUpsertDTO dto);
    void delete(Long id);
}
