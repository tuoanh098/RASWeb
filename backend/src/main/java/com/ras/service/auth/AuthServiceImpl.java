// src/main/java/com/ras/service/auth/AuthServiceImpl.java
package com.ras.service.auth;

import com.ras.domain.account.NguoiDung;
import com.ras.domain.account.NguoiDungRepository;
import com.ras.service.auth.dto.LoginRequest;
import com.ras.service.auth.dto.LoginResponse;
import com.ras.service.auth.dto.MeDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

  private final NguoiDungRepository nguoiDungRepo;
  private final AuthSessionStore sessions;

  @Override
  @Transactional
  public LoginResponse login(LoginRequest req) {
    if (req == null || req.getUser() == null || req.getUser().isBlank()
        || req.getPassword() == null || req.getPassword().isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thiếu thông tin đăng nhập");
    }

    String login = req.getUser().trim();
    String raw = req.getPassword();

    Optional<NguoiDung> opt = nguoiDungRepo.findByHoatDongTrueAndUsername(login);
    if (opt.isEmpty()) opt = nguoiDungRepo.findByHoatDongTrueAndEmail(login);

    NguoiDung nd = opt.orElseThrow(
        () -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sai tài khoản hoặc mật khẩu"));

    // So sánh plaintext
    String stored = nd.getPasswordHash() == null ? "" : nd.getPasswordHash();
    if (!stored.equals(raw)) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sai tài khoản hoặc mật khẩu");
    }

    // Cập nhật lần đăng nhập cuối
    nd.setLanDangNhapCuoi(LocalDateTime.now());
    nguoiDungRepo.save(nd);

    // Phát hành token phiên
    String token = sessions.issue(nd.getId());

    return new LoginResponse(
        token,
        nd.getId(),
        nd.getUsername(),
        nd.getEmail(),
        nd.getUsername(),    // fullName tạm dùng username
        nd.getVaiTro()
    );
  }

  @Override
  @Transactional(readOnly = true)
  public MeDto me(String token) {
    Long uid = sessions.verify(token);
    if (uid == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token hết hạn/không hợp lệ");

    NguoiDung nd = nguoiDungRepo.findById(uid)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Tài khoản không tồn tại"));

    if (Boolean.FALSE.equals(nd.getHoatDong())) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Tài khoản đã bị vô hiệu hoá");
    }

    return new MeDto(
        nd.getId(),
        nd.getUsername(),
        nd.getEmail(),
        nd.getUsername(),
        nd.getVaiTro()
    );
  }

  @Override
  public void logout(String token) {
    if (token != null && !token.isBlank()) sessions.revoke(token);
  }
}
