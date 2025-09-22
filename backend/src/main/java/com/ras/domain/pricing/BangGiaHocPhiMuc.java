// src/main/java/com/ras/domain/pricing/BangGiaHocPhiMuc.java
package com.ras.domain.pricing;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "bang_gia_hoc_phi_muc")
public class BangGiaHocPhiMuc {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "bang_gia_id")
  private Long bangGiaId;

  // CSV: "6,7" hoặc null (áp dụng mọi chi nhánh)
  @Column(name = "chi_nhanh")
  private String chiNhanh;

  @Column(name = "khoa_hoc_id", nullable = false)
  private Long khoaHocId;

  @Enumerated(EnumType.STRING)
  @Column(name = "giai_doan", nullable = false)
  private GiaiDoan giaiDoan;

  @Enumerated(EnumType.STRING)
  @Column(name = "cap_do", nullable = false)
  private CapDo capDo;

  @Column(name = "so_buoi_khoa", nullable = false)
  private Integer soBuoiKhoa;

  @Column(name = "hoc_phi_khoa")
  private BigDecimal hocPhiKhoa;

  @Column(name = "hoc_phi_buoi")
  private BigDecimal hocPhiBuoi; // Generated column trong DB

  @Column(name = "ghi_chu", nullable = true)
  private String ghiChu;

    // getters/setters
    public Long getId() { return id; }
    public Long getBangGiaId() { return bangGiaId; }
    public void setBangGiaId(Long bangGiaId) { this.bangGiaId = bangGiaId; }
    public String getChiNhanh() { return chiNhanh; }
    public void setChiNhanh(String chiNhanh) { this.chiNhanh = chiNhanh; }
    public Long getKhoaHocId() { return khoaHocId; }
    public void setKhoaHocId(Long khoaHocId) { this.khoaHocId = khoaHocId; }
    public GiaiDoan getGiaiDoan() { return giaiDoan; }
    public void setGiaiDoan(GiaiDoan giaiDoan) { this.giaiDoan = giaiDoan; }
    public CapDo getCapDo() { return capDo; }
    public void setCapDo(CapDo capDo) { this.capDo = capDo; }
    public Integer getSoBuoiKhoa() { return soBuoiKhoa; }
    public void setSoBuoiKhoa(Integer soBuoiKhoa) { this.soBuoiKhoa = soBuoiKhoa; }
    public BigDecimal getHocPhiKhoa() { return hocPhiKhoa; }
    public void setHocPhiKhoa(BigDecimal hocPhiKhoa) { this.hocPhiKhoa = hocPhiKhoa; }
    public String getGhiChu() { return ghiChu; }
    public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }
    public BigDecimal getHocPhiBuoi() { return hocPhiBuoi; }
}
