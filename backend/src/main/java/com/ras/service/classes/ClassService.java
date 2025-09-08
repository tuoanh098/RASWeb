package com.ras.service.classes;

import com.ras.dto.common.PageResponse;
import com.ras.dto.classes.ClassListItemDto;

public interface ClassService {
  PageResponse<ClassListItemDto> list(Integer page, Integer size, Long branchId, String q);
}


