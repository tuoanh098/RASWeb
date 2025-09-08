package com.ras.service.teacher;

import com.ras.dto.common.PageResponse;
import com.ras.dto.teacher.TeacherSummaryDto;

public interface TeacherQueryService {
    PageResponse<TeacherSummaryDto> search(String keyword, Integer page, Integer size);
}
