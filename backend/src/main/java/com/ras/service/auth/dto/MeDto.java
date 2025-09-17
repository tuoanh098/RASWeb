// src/main/java/com/ras/service/auth/dto/MeDto.java
package com.ras.service.auth.dto;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data @AllArgsConstructor
public class MeDto {
  private Long id;
  private String username;
  private String email;
  private String fullName;
  private String role;
}
