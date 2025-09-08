package com.ras.service.teacher;

import com.ras.dto.teacher.TeacherDetailResponse;

public interface TeacherProfileService {
  TeacherDetailResponse getTeacherWithClasses(Long teacherId, Long branchId);
}
