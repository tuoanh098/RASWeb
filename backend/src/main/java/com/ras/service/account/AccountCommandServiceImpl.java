package com.ras.service.account;

import com.ras.domain.account.*;
import com.ras.domain.employee.*;
import com.ras.service.account.dto.AccountUpsertReq;
import com.ras.domain.employee.EmployeeRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AccountCommandServiceImpl implements AccountCommandService {

    private final AccountRepository repo;
    private final EmployeeRepository employeeRepo;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AccountCommandServiceImpl(AccountRepository repo, EmployeeRepository employeeRepo) {
        this.repo = repo; this.employeeRepo = employeeRepo;
    }

    @Override
    @Transactional
    public Long create(AccountUpsertReq req) {
        if (repo.existsByUsername(req.username)) throw new IllegalArgumentException("Username đã tồn tại");
        if (repo.existsByNhanVien_Id(req.id_nhan_vien)) throw new IllegalArgumentException("Nhân viên đã có tài khoản");

        Employee nv = employeeRepo.findById(req.id_nhan_vien)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhân viên"));

        NguoiDung e = new NguoiDung();
        e.setUsername(req.username.trim());
        if (req.password == null || req.password.isBlank()) throw new IllegalArgumentException("Mật khẩu bắt buộc");
        e.setPasswordHash(encoder.encode(req.password));
        e.setEmail(req.email);
        e.setVaiTro(req.vai_tro);
        e.setHoatDong(req.hoat_dong != null ? req.hoat_dong : true);
        e.setNhanVien(nv);
        e.setNgayTao(LocalDateTime.now());
        repo.save(e);
        return e.getId();
    }

    @Override
    @Transactional
    public void update(Long id, AccountUpsertReq req) {
        NguoiDung e = repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Account not found"));
        if (req.username != null && !req.username.equals(e.getUsername())) {
            if (repo.existsByUsername(req.username)) throw new IllegalArgumentException("Username đã tồn tại");
            e.setUsername(req.username.trim());
        }
        if (req.password != null && !req.password.isBlank()) {
            e.setPasswordHash(encoder.encode(req.password));
        }
        e.setEmail(req.email);
        if (req.vai_tro != null) e.setVaiTro(req.vai_tro);
        if (req.hoat_dong != null) e.setHoatDong(req.hoat_dong);

        if (req.id_nhan_vien != null && (e.getNhanVien()==null || !req.id_nhan_vien.equals(e.getNhanVien().getId()))) {
            if (repo.existsByNhanVien_Id(req.id_nhan_vien)) throw new IllegalArgumentException("Nhân viên đã có tài khoản");
            var nv = employeeRepo.findById(req.id_nhan_vien)
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhân viên"));
            e.setNhanVien(nv);
        }

        e.setNgaySua(LocalDateTime.now());
        repo.save(e);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        repo.deleteById(id);
    }

    @Override
    @Transactional
    public void resetPassword(Long id, String newPassword) {
        NguoiDung e = repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Account not found"));
        e.setPasswordHash(encoder.encode(newPassword));
        e.setNgaySua(LocalDateTime.now());
        repo.save(e);
    }
}
