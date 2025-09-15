package com.ras.service.employee;

import com.ras.domain.employee.Employee;
import org.springframework.web.multipart.MultipartFile;

public interface EmployeeCommandService {

    Employee create(Employee payload);

    Employee update(Long id, Employee patch);

    /** Thử xoá cứng; nếu DB chặn vì FK thì ném DataIntegrityViolationException cho controller bắt. */
    void deleteHard(Long id);

    /** Fallback khi xoá cứng thất bại: chuyển hoat_dong = false. */
    Employee deactivate(Long id);

    /** Lưu file avatar vào uploads/avatars/ và cập nhật trường avatar_url. */
    String saveAvatarAndReturnUrl(Long id, MultipartFile file);
}
