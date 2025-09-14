package com.ras.service.student;

import com.ras.service.student.dto.StudentUpsertReq;

public interface StudentCommandService {
    Long create(StudentUpsertReq req);
    void update(Long id, StudentUpsertReq req);
    void delete(Long id);
}