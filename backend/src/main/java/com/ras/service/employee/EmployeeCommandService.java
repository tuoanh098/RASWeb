package com.ras.service.employee;

import com.ras.domain.employee.Employee;
import org.springframework.web.multipart.MultipartFile;

public interface EmployeeCommandService {
  Employee create(Employee payload);
  Employee update(Integer id, Employee patch);
  void deleteHard(Integer id);
  Employee deactivate(Integer id);
  String saveAvatarAndReturnUrl(Integer id, MultipartFile file);
}
