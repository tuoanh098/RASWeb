package com.ras.domain.course;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "bang_gia_hoc_phi_muc")
public class BangGiaHocPhiMuc {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "bang_gia_id")   private Long bangGiaId;
  @Column(name = "chi_nhanh_id")  private Long chiNhanhId;
  @Column(name = "khoa_hoc_id")   private Long khoaHocId;
  @Column(name = "so_buoi_khoa")  private Integer soBuoiKhoa;
  @Column(name = "hoc_phi_khoa")  private BigDecimal hocPhiKhoa;
  @Column(name = "hoc_phi_buoi")  private BigDecimal hocPhiBuoi;
  @Column(name = "hoc_phi_buoi_tinh") private BigDecimal hocPhiBuoiTinh;
  @Column(name = "ghi_chu")       private String ghiChu;

  // getters/setters...
    public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public Long getBangGiaId() { return bangGiaId; }
  public void setBangGiaId(Long bangGiaId) { this.bangGiaId = bangGiaId; }

  public Long getChiNhanhId() { return chiNhanhId; }
  public void setChiNhanhId(Long chiNhanhId) { this.chiNhanhId = chiNhanhId; }

  public Long getKhoaHocId() { return khoaHocId; }
  public void setKhoaHocId(Long khoaHocId) { this.khoaHocId = khoaHocId; }

  public Integer getSoBuoiKhoa() { return soBuoiKhoa; }
  public void setSoBuoiKhoa(Integer soBuoiKhoa) { this.soBuoiKhoa = soBuoiKhoa; }

  public BigDecimal getHocPhiKhoa() { return hocPhiKhoa; }
  public void setHocPhiKhoa(BigDecimal hocPhiKhoa) { this.hocPhiKhoa = hocPhiKhoa; }

  public BigDecimal getHocPhiBuoi() { return hocPhiBuoi; }
  public void setHocPhiBuoi(BigDecimal hocPhiBuoi) { this.hocPhiBuoi = hocPhiBuoi; }

  public BigDecimal getHocPhiBuoiTinh() { return hocPhiBuoiTinh; }
  public void setHocPhiBuoiTinh(BigDecimal hocPhiBuoiTinh) { this.hocPhiBuoiTinh = hocPhiBuoiTinh; }

  public String getGhiChu() { return ghiChu; }
  public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }
}
