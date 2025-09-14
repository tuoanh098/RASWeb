package com.ras.domain.employee;

import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface EmployeeRepository extends JpaRepository<Employee, Long>, JpaSpecificationExecutor<Employee> {

    @Query("""
      SELECT e FROM Employee e
      WHERE (:q IS NULL OR
             lower(e.hoTen) LIKE lower(concat('%', :q, '%')) OR
             lower(e.email) LIKE lower(concat('%', :q, '%')) OR
             e.soDienThoai LIKE concat('%', :q, '%'))
        AND (:role IS NULL OR e.vaiTro = :role)
      """)
    Page<Employee> search(@Param("q") String q, @Param("role") String role, Pageable pageable);
}
