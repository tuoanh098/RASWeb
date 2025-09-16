package com.ras.service.enroll;

import com.ras.domain.enroll.DangKyLop;
import com.ras.service.enroll.dto.SignUpCourseRequest;
import com.ras.service.enroll.dto.SignUpCourseResponse;
import com.ras.service.enroll.dto.SignupSummaryDTO;

import java.util.List;

public interface SignUpCourseService {

    SignUpCourseResponse signUp(SignUpCourseRequest req);

    List<DangKyLop> listOfStudent(Long hocVienId);

    SignupSummaryDTO monthlySummary(String yyyyMM);
}