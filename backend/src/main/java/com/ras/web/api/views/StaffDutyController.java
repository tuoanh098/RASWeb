package com.ras.web.api.views;

import com.ras.dto.views.StaffOnDutyTodayDto;
import com.ras.service.views.StaffDutyService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/views") // ✅ vì bạn đang dùng server.servlet.context-path=/api
public class StaffDutyController {

    private final StaffDutyService service;

    public StaffDutyController(StaffDutyService service) {
        this.service = service;
    }

    /**
     * GET /api/views/staff-duty-today?branchId=&date=YYYY-MM-DD&q=
     *  - branchId/date/q là optional; date = hôm nay nếu không truyền.
     */
    @GetMapping("/staff-duty-today")
    public ResponseEntity<?> staffDutyToday(
            @RequestParam(value = "branchId", required = false) Long branchId,
            @RequestParam(value = "date", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(value = "q", required = false) String q
    ) {
        List<StaffOnDutyTodayDto> data = service.find(date, branchId, q);
        return ResponseEntity.ok(Map.of("success", true, "data", data));
    }
}