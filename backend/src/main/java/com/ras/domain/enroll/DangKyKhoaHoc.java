package com.ras.domain.enroll;

import com.ras.domain.pricing.CapDo;
import com.ras.domain.pricing.GiaiDoan;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "dang_ky_khoa_hoc")
public class DangKyKhoaHoc {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "hoc_vien_id", nullable = false)
  private Long hocVienId;

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

  // VARCHAR CSV: ví dụ “6,7”
  @Column(name = "chi_nhanh", length = 64)
  private String chiNhanh;

  @Column(name = "nhan_vien_tu_van_id")
  private Long nhanVienTuVanId;

  // Lưu ý: đây cũng là nhan_vien_id (giáo viên)
  @Column(name = "giao_vien_id")
  private Long giaoVienId;

  @Column(name = "hoc_phi_ap_dung", precision = 38, scale = 2)
  private BigDecimal hocPhiApDung;

  @Column(name = "hoa_hong_2pct", precision = 38, scale = 2)
  private BigDecimal hoaHong2pct;

  @Column(name = "ngay_dang_ky")
  private LocalDate ngayDangKy;

  @Column(name = "ghi_chu")
  private String ghiChu;

  @Column(name = "tao_luc")
  private LocalDateTime taoLuc;

  @PrePersist
  void prePersist() {
    if (taoLuc == null) taoLuc = LocalDateTime.now();
    if (ngayDangKy == null) ngayDangKy = LocalDate.now();
    if (hoaHong2pct == null && hocPhiApDung != null) {
      this.hoaHong2pct = hocPhiApDung.multiply(new BigDecimal("0.02"));
    }
  }

    // getters/setters
    public Long getId() { return id; }
    public Long getHocVienId() { return hocVienId; }
    public void setHocVienId(Long hocVienId) { this.hocVienId = hocVienId; }
    public Long getKhoaHocId() { return khoaHocId; }
    public void setKhoaHocId(Long khoaHocId) { this.khoaHocId = khoaHocId; }
    public GiaiDoan getGiaiDoan() { return giaiDoan; }
    public void setGiaiDoan(GiaiDoan giaiDoan) { this.giaiDoan = giaiDoan; }
    public CapDo getCapDo() { return capDo; }
    public void setCapDo(CapDo capDo) { this.capDo = capDo; }
    public Integer getSoBuoiKhoa() { return soBuoiKhoa; }
    public void setSoBuoiKhoa(Integer soBuoiKhoa) { this.soBuoiKhoa = soBuoiKhoa; }
    public String getChiNhanh() { return chiNhanh; }
    public void setChiNhanh(String chiNhanh) { this.chiNhanh = chiNhanh; }
    public Long getNhanVienTuVanId() { return nhanVienTuVanId; }
    public void setNhanVienTuVanId(Long nhanVienTuVanId) { this.nhanVienTuVanId = nhanVienTuVanId; }
    public Long getGiaoVienId() { return giaoVienId; }
    public void setGiaoVienId(Long giaoVienId) { this.giaoVienId = giaoVienId; }
    public BigDecimal getHocPhiApDung() { return hocPhiApDung; }
    public void setHocPhiApDung(BigDecimal hocPhiApDung) { this.hocPhiApDung = hocPhiApDung; }
    public BigDecimal getHoaHong2pct() { return hoaHong2pct; }
    public void setHoaHong2pct(BigDecimal hoaHong2pct) { this.hoaHong2pct = hoaHong2pct; }
    public LocalDate getNgayDangKy() { return ngayDangKy; }
    public void setNgayDangKy(LocalDate ngayDangKy) { this.ngayDangKy = ngayDangKy; }
    public String getGhiChu() { return ghiChu; }
    public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }
    public LocalDateTime getTaoLuc() { return taoLuc; }
}
