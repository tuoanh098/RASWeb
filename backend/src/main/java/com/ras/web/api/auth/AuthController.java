// src/main/java/com/ras/web/AuthController.java
package com.ras.web.api.auth;

import com.ras.service.auth.AuthService;
import com.ras.service.auth.dto.LoginRequest;
import com.ras.service.auth.dto.LoginResponse;
import com.ras.service.auth.dto.MeDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService auth;

  @PostMapping("/login")
  public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest req) {
    return ResponseEntity.ok(auth.login(req));
  }

  @GetMapping("/me")
  public ResponseEntity<MeDto> me(@RequestHeader(value = "Authorization", required = false) String authorization) {
    String token = extractBearer(authorization);
    return ResponseEntity.ok(auth.me(token));
  }

  @PostMapping("/logout")
  public ResponseEntity<Void> logout(@RequestHeader(value = "Authorization", required = false) String authorization) {
    String token = extractBearer(authorization);
    auth.logout(token);
    return ResponseEntity.noContent().build();
  }

  private String extractBearer(String authorization) {
    if (authorization == null || !authorization.startsWith("Bearer ")) return null;
    return authorization.substring("Bearer ".length());
  }
}
