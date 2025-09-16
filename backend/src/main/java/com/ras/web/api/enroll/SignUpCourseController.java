package com.ras.web.api.enroll;

import com.ras.domain.enroll.DangKyLop;
import com.ras.service.enroll.dto.SignUpCourseRequest;
import com.ras.service.enroll.dto.SignUpCourseResponse;
import com.ras.service.enroll.dto.SignupSummaryDTO;
import com.ras.service.enroll.SignUpCourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/signups")
@RequiredArgsConstructor
public class SignUpCourseController {

  private final SignUpCourseService service;

  /** Tạo đăng ký + tự ghi hoa hồng 2% cho NV tư vấn */
  @PostMapping
  public SignUpCourseResponse signUp(@RequestBody SignUpCourseRequest req) {
    return service.signUp(req);
  }

  /** Danh sách đăng ký của 1 học viên */
  @GetMapping("/student/{hocVienId}")
  public List<DangKyLop> listOfStudent(@PathVariable Long hocVienId) {
    return service.listOfStudent(hocVienId);
  }

  /** Tổng số đăng ký trong 1 tháng (YYYY-MM) */
  @GetMapping("/summary")
  public SignupSummaryDTO monthlySummary(@RequestParam("month") String yyyyMM) {
    return service.monthlySummary(yyyyMM);
  }
}
