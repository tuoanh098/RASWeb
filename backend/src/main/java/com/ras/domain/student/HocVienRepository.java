package com.ras.domain.student;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface HocVienRepository
  extends JpaRepository<HocVien, Long>, JpaSpecificationExecutor<HocVien> {}
