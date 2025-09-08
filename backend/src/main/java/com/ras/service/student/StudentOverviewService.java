package com.ras.service.student;

import com.ras.dto.common.PageResponse;
import com.ras.dto.student.StudentListItemDto;

public interface StudentOverviewService {
  PageResponse<StudentListItemDto> list(Integer page, Integer size, String q);
}


