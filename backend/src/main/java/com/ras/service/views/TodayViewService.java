package com.ras.service.views;

import com.ras.dto.views.StaffOnDutyTodayDto;
import com.ras.dto.views.TodayLessonDto;

public interface TodayViewService {
  java.util.List<StaffOnDutyTodayDto> staffOnDutyToday(Long branchId);
  java.util.List<TodayLessonDto> todayLessons(Long branchId);
}
