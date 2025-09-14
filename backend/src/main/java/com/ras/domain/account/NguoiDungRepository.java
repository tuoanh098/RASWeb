package com.ras.domain.account;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface NguoiDungRepository extends JpaRepository<NguoiDung, Long> {
    Optional<NguoiDung> findByUsername(String username);
    boolean existsByUsername(String username);
}
