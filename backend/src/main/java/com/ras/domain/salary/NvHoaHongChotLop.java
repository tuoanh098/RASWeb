package com.ras.domain.salary;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "nv_hoa_hong_chot_lop")
public class NvHoaHongChotLop {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "ky_luong_id", nullable = false)
  private Long kyLuongId;

  @Column(name = "chi_nhanh_id")
  private Long chiNhanhId;

  @Column(name = "nhan_vien_id", nullable = false)
  private Long nhanVienId;

  @Column(name = "hoc_vien_id", nullable = false)
  private Long hocVienId;

  @Column(name = "dang_ky_id")
  private Long dangKyId;

  @Column(name = "khoa_hoc_mau_id")
  private Long khoaHocMauId;

  // DECIMAL(12,0)
  @Column(name = "hoc_phi_ap_dung", nullable = false)
  private BigDecimal hocPhiApDung;

  // DECIMAL(5,2) — lưu dạng 0.02 cho 2%
  @Column(name = "ty_le_pct", nullable = false)
  private BigDecimal tyLePct;

  // DECIMAL(12,0)
  @Column(name = "so_tien", nullable = false)
  private BigDecimal soTien;

  @Column(name = "ghi_chu")
  private String ghiChu;

  @Column(name = "tao_luc", nullable = false)
  private LocalDateTime taoLuc;

  // ===== getter/setter =====
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public Long getKyLuongId() { return kyLuongId; }
  public void setKyLuongId(Long kyLuongId) { this.kyLuongId = kyLuongId; }

  public Long getChiNhanhId() { return chiNhanhId; }
  public void setChiNhanhId(Long chiNhanhId) { this.chiNhanhId = chiNhanhId; }

  public Long getNhanVienId() { return nhanVienId; }
  public void setNhanVienId(Long nhanVienId) { this.nhanVienId = nhanVienId; }

  public Long getHocVienId() { return hocVienId; }
  public void setHocVienId(Long hocVienId) { this.hocVienId = hocVienId; }

  public Long getDangKyId() { return dangKyId; }
  public void setDangKyId(Long dangKyId) { this.dangKyId = dangKyId; }

  public Long getKhoaHocMauId() { return khoaHocMauId; }
  public void setKhoaHocMauId(Long khoaHocMauId) { this.khoaHocMauId = khoaHocMauId; }

  public BigDecimal getHocPhiApDung() { return hocPhiApDung; }
  public void setHocPhiApDung(BigDecimal hocPhiApDung) { this.hocPhiApDung = hocPhiApDung; }

  public BigDecimal getTyLePct() { return tyLePct; }
  public void setTyLePct(BigDecimal tyLePct) { this.tyLePct = tyLePct; }

  public BigDecimal getSoTien() { return soTien; }
  public void setSoTien(BigDecimal soTien) { this.soTien = soTien; }

  public String getGhiChu() { return ghiChu; }
  public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }

  public LocalDateTime getTaoLuc() { return taoLuc; }
  @PrePersist
    public void prePersist() {
      if (taoLuc == null) taoLuc = LocalDateTime.now();
    }
}
