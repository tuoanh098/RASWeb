package com.ras.service.schedule;

import com.ras.service.schedule.dto.*;
import java.time.LocalDate;
import java.util.List;

public interface XepLopService {
  XepLopDto createOne(XepLopCreateDto req);
  List<XepLopDto> createRecurring(XepLopRecurringDto req);
  List<XepLopDto> getWeek(LocalDate weekStart, Long branchId, Long teacherId, Long studentId);
  void cancelOne(Long id);
  int  deleteSeriesFrom(Long coDinhGroupId, LocalDate fromInclusive);
}
