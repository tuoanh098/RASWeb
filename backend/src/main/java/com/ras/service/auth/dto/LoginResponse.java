// src/main/java/com/ras/service/auth/dto/LoginResponse.java
package com.ras.service.auth.dto;
import lombok.*;

@Data @AllArgsConstructor
public class LoginResponse {
  private String token;
  private Long id;
  private String username;
  private String email;
  private String fullName; // tạm dùng username làm display
  private String role;     // map từ vaiTro
}
    