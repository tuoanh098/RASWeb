package com.ras.domain.employee;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface EmployeeRepository
        extends JpaRepository<Employee, Long>, JpaSpecificationExecutor<Employee> {
}
