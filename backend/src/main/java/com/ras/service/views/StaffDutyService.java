package com.ras.service.views;

import com.ras.dto.views.StaffOnDutyTodayDto;
import java.time.LocalDate;
import java.util.List;

public interface StaffDutyService {
    /**
     * Lấy danh sách ca trực theo ngày (mặc định: hôm nay).
     * @param date     null => LocalDate.now()
     * @param branchId filter theo chi nhánh (null = tất cả)
     * @param q        từ khoá (lọc theo nhân viên/chi nhánh), null/blank = không lọc
     */
    List<StaffOnDutyTodayDto> find(LocalDate date, Long branchId, String q);
}
