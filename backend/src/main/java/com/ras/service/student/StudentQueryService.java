package com.ras.service.student;

import com.ras.service.student.dto.*;
import org.springframework.data.domain.Pageable;
import com.ras.web.api.common.PageResponse;
public interface StudentQueryService {
    PageResponse<StudentListItemDto> list(String q, Long branchId, Pageable pageable);
    StudentDetailDto get(Long id);
}