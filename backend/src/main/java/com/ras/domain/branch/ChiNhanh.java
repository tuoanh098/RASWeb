package com.ras.domain.branch;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chi_nhanh")
public class ChiNhanh {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "ma", length = 50, nullable = false)
  private String ma;

  @Column(name = "ten", length = 255, nullable = false)
  private String ten;

  @Column(name = "dia_chi", length = 500)
  private String diaChi;

  @Column(name = "so_dien_thoai", length = 30)
  private String soDienThoai;

  @Column(name = "hoat_dong")
  private Boolean hoatDong;

  @Column(name = "ngay_tao")
  private LocalDateTime ngayTao;

  @Column(name = "ngay_sua")
  private LocalDateTime ngaySua;

  // getters/setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getMa() { return ma; }
  public void setMa(String ma) { this.ma = ma; }

  public String getTen() { return ten; }
  public void setTen(String ten) { this.ten = ten; }

  public String getDiaChi() { return diaChi; }
  public void setDiaChi(String diaChi) { this.diaChi = diaChi; }

  public String getSoDienThoai() { return soDienThoai; }
  public void setSoDienThoai(String soDienThoai) { this.soDienThoai = soDienThoai; }

  public Boolean getHoatDong() { return hoatDong; }
  public void setHoatDong(Boolean hoatDong) { this.hoatDong = hoatDong; }

  public LocalDateTime getNgayTao() { return ngayTao; }
  public void setNgayTao(LocalDateTime ngayTao) { this.ngayTao = ngayTao; }

  public LocalDateTime getNgaySua() { return ngaySua; }
  public void setNgaySua(LocalDateTime ngaySua) { this.ngaySua = ngaySua; }
}
