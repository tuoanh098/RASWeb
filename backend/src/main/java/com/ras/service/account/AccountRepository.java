package com.ras.service.account;

import com.ras.domain.account.NguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<NguoiDung, Long> {
    Optional<NguoiDung> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByNhanVien_Id(Long idNhanVien);
}
