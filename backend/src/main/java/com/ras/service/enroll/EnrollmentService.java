package com.ras.service.enroll;

import com.ras.service.enroll.dto.EnrollmentCreateDto;
import com.ras.service.enroll.dto.EnrollmentDto;
import com.ras.service.enroll.dto.MonthlySignUpStatDTO;
import java.util.List;

public interface EnrollmentService {
  EnrollmentDto create(EnrollmentCreateDto req);
  List<EnrollmentDto> listByStudent(Long studentId);
  MonthlySignUpStatDTO summaryByMonth(String ym);
}
