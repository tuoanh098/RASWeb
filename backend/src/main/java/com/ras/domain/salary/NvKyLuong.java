package com.ras.domain.salary;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "ky_luong")
public class NvKyLuong {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  // ví dụ "2025-09"
  @Column(name = "nam_thang", nullable = false, length = 7, unique = true)
  private String namThang;

  @Column(name = "trang_thai", nullable = false)
  private String trangThai;

  @Column(name = "tao_luc")
  private Instant taoLuc;

  // ===== getter/setter =====
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getNamThang() { return namThang; }
  public void setNamThang(String namThang) { this.namThang = namThang; }

  public String getTrangThai() { return trangThai; }
  public void setTrangThai(String trangThai) { this.trangThai = trangThai; }

  public Instant getTaoLuc() { return taoLuc; }
  public void setTaoLuc(Instant taoLuc) { this.taoLuc = taoLuc; }
}
