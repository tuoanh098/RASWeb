package com.ras.domain.salary;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "nv_ky_luong")
@Getter @Setter
public class NvKyLuong {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "nam_thang", nullable = false) // "YYYY-MM"
  private String namThang;

  @Column(name = "trang_thai")
  private String trangThai;

  @Column(name = "tao_luc")
  private java.time.LocalDateTime taoLuc;

}
