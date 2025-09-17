package com.ras.service.auth;

import com.ras.service.auth.dto.LoginRequest;
import com.ras.service.auth.dto.LoginResponse;
import com.ras.service.auth.dto.MeDto;

public interface AuthService {
  LoginResponse login(LoginRequest req);
  MeDto me(String token);
  void logout(String token);
}
