package com.ras.service.account;

import com.ras.domain.account.NguoiDung;
import com.ras.domain.account.NguoiDungRepository;
import com.ras.service.account.dto.*;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class AccountCommandServiceImpl implements AccountCommandService {

    private final NguoiDungRepository repo;
    private final BCryptPasswordEncoder bcrypt = new BCryptPasswordEncoder();

    public AccountCommandServiceImpl(NguoiDungRepository repo) { this.repo = repo; }

    @Override
    public AccountDetailDto create(AccountUpsertReq r) {
        if (r.username() == null || r.username().isBlank())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thiếu username");
        if (r.new_password() == null || r.new_password().isBlank())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thiếu mật khẩu");

        NguoiDung e = new NguoiDung();
        e.setUsername(r.username().trim());
        e.setPasswordHash(bcrypt.encode(r.new_password()));
        e.setEmail(r.email());
        // ưu tiên tên Việt
        String vaiTro = r.vai_tro() != null && !r.vai_tro().isBlank()
                ? r.vai_tro().trim()
                : (r.role() != null ? r.role().trim() : "STAFF");
        e.setVaiTro(vaiTro);
        e.setIdNhanVien(r.id_nhan_vien());
        e.setHoatDong(r.hoat_dong() != null ? r.hoat_dong() : (r.active() != null ? r.active() : true));

        try {
            e = repo.save(e);
            return AccountMapper.toDetail(e);
        } catch (DataIntegrityViolationException dup) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username đã tồn tại");
        }
    }

    @Override
    public AccountDetailDto update(Long id, AccountUpsertReq r) {
        var e = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy tài khoản"));
        if (r.username()!=null && !r.username().isBlank()) e.setUsername(r.username().trim());
        if (r.email()!=null && !r.email().isBlank()) e.setEmail(r.email().trim());
        if (r.vai_tro()!=null && !r.vai_tro().isBlank()) e.setVaiTro(r.vai_tro().trim());
        else if (r.role()!=null && !r.role().isBlank()) e.setVaiTro(r.role().trim());
        if (r.id_nhan_vien()!=null) e.setIdNhanVien(r.id_nhan_vien());
        if (r.hoat_dong()!=null) e.setHoatDong(r.hoat_dong());
        else if (r.active()!=null) e.setHoatDong(r.active());
        if (r.new_password()!=null && !r.new_password().isBlank()) e.setPasswordHash(bcrypt.encode(r.new_password()));

        try {
            e = repo.save(e);
            return AccountMapper.toDetail(e);
        } catch (DataIntegrityViolationException dup) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username đã tồn tại");
        }
    }

    @Override
    public void delete(Long id) {
        if (!repo.existsById(id))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy tài khoản");
        repo.deleteById(id);
    }

    @Override
    public void changePassword(Long id, String newPassword) {
        if (newPassword == null || newPassword.isBlank())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thiếu mật khẩu mới");
        var e = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy tài khoản"));
        e.setPasswordHash(bcrypt.encode(newPassword));
        repo.save(e);
    }
}
