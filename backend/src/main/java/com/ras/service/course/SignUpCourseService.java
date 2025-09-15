package com.ras.service.course;

import java.util.List;
import com.ras.service.course.dto.*;
public interface SignUpCourseService {
    SignUpDTO create(SignUpCreateDTO dto);
    SignUpDTO assign(Long id, AssignClassDTO dto);
    List<SignUpDTO> findByStudent(Long hocVienId);
    MonthlySignUpStatDTO statByMonth(int year, int month);
    List<SignUpDTO> listByMonth(int year, int month);
    SignUpDTO get(Long id);
    void delete(Long id);
}
