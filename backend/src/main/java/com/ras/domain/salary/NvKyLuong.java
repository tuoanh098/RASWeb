package com.ras.domain.salary;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "ky_luong")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class NvKyLuong {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  // Lưu dạng "YYYY-MM", ví dụ "2025-09"
  @Column(name = "nam_thang", nullable = false, length = 7)
  private String namThang;
}
