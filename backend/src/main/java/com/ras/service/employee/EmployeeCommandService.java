package com.ras.service.employee;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

import com.ras.service.employee.dto.EmployeeUpsertReq;

public interface EmployeeCommandService {
    Long create(EmployeeUpsertReq req);
    void update(Long id, EmployeeUpsertReq req);
    void delete(Long id);
        /** Lưu file avatar lên server và trả về URL public */
    String saveAvatarAndReturnUrl(Long id, MultipartFile file) throws IOException;

    /** Cập nhật cột avatar_url của nhân viên */
    void updateAvatarUrl(Long id, String url);
}
