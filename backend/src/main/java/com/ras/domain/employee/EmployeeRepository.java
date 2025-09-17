package com.ras.domain.employee;

import org.springframework.data.jpa.repository.*;

public interface EmployeeRepository
        extends JpaRepository<Employee, Integer>, JpaSpecificationExecutor<Employee> {
}
