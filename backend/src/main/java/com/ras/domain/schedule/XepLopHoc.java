package com.ras.domain.schedule;

import jakarta.persistence.*;
import java.time.*;
import java.sql.Timestamp;

@Entity
@Table(name = "xep_lop_hoc",
       uniqueConstraints = {
          @UniqueConstraint(name="uq_xlh_gv_slot",
            columnNames={"giao_vien_id","ngay","bat_dau_luc","ket_thuc_luc"}),
          @UniqueConstraint(name="uq_xlh_hv_slot",
            columnNames={"hoc_vien_id","ngay","bat_dau_luc","ket_thuc_luc"})
       },
       indexes = {
          @Index(name="idx_xlh_ngay", columnList="ngay"),
          @Index(name="idx_xlh_gv_ngay", columnList="giao_vien_id,ngay,bat_dau_luc"),
          @Index(name="idx_xlh_hv_ngay", columnList="hoc_vien_id,ngay,bat_dau_luc"),
          @Index(name="idx_xlh_branch_ngay", columnList="chi_nhanh_id,ngay,bat_dau_luc"),
          @Index(name="idx_xlh_dkkh", columnList="dang_ky_khoa_hoc_id"),
          @Index(name="idx_xlh_group", columnList="co_dinh_group_id")
       })
public class XepLopHoc {
  public enum TrangThaiBuoi { scheduled, cancelled, done }

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name="khoa_hoc_id", nullable=false)  private Long khoaHocId;
  @Column(name="khoa_hoc_ten", nullable=false) private String khoaHocTen;

  @Column(name="hoc_vien_id", nullable=false)  private Long hocVienId;
  @Column(name="giao_vien_id", nullable=false) private Long giaoVienId;
  @Column(name="hoc_vien_ten", nullable=false) private String hocVienTen;
  @Column(name="giao_vien_ten", nullable=false) private String giaoVienTen;

  @Column(name="chi_nhanh_ten", nullable=false) private String chiNhanhTen;
  @Column(name="chi_nhanh_id",  nullable=false) private Long chiNhanhId;

  @Column(name="so_buoi_du_kien", nullable=false) private Integer soBuoiDuKien;
  @Column(name="so_buoi_da_hoc",  nullable=false) private Integer soBuoiDaHoc = 0;

  @Column(name="ngay", nullable=false)          private LocalDate ngay;
  @Column(name="bat_dau_luc", nullable=false)  private LocalTime batDauLuc;
  @Column(name="ket_thuc_luc", nullable=false) private LocalTime ketThucLuc;

  @Column(name="thoi_luong_phut", nullable=false)
  private Integer thoiLuongPhut;

  @Column(name="co_dinh_group_id") private Long coDinhGroupId;

  @Enumerated(EnumType.STRING)
  @Column(name="trang_thai_buoi", nullable=false)
  private TrangThaiBuoi trangThaiBuoi = TrangThaiBuoi.scheduled;

  @Column(name="ghi_chu") private String ghiChu;

  @Column(name="tao_luc", updatable=false, insertable=false,
           columnDefinition="timestamp default current_timestamp")
  private Timestamp taoLuc;

  @Column(name="cap_nhat_luc", insertable=false,
           columnDefinition="timestamp default current_timestamp on update current_timestamp")
  private Timestamp capNhatLuc;

  // Getters and Setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getKhoaHocId() {
    return khoaHocId;
  }

  public void setKhoaHocId(Long khoaHocId) {
    this.khoaHocId = khoaHocId;
  }

  public String getKhoaHocTen() {
    return khoaHocTen;
  }

  public void setKhoaHocTen(String khoaHocTen) {
    this.khoaHocTen = khoaHocTen;
  }

  public Long getHocVienId() {
    return hocVienId;
  }

  public void setHocVienId(Long hocVienId) {
    this.hocVienId = hocVienId;
  }

  public Long getGiaoVienId() {
    return giaoVienId;
  }

  public void setGiaoVienId(Long giaoVienId) {
    this.giaoVienId = giaoVienId;
  }

  public String getHocVienTen() {
    return hocVienTen;
  }

  public void setHocVienTen(String hocVienTen) {
    this.hocVienTen = hocVienTen;
  }

  public String getGiaoVienTen() {
    return giaoVienTen;
  }

  public void setGiaoVienTen(String giaoVienTen) {
    this.giaoVienTen = giaoVienTen;
  }

  public String getChiNhanhTen() {
    return chiNhanhTen;
  }

  public void setChiNhanhTen(String chiNhanhTen) {
    this.chiNhanhTen = chiNhanhTen;
  }

  public Long getChiNhanhId() {
    return chiNhanhId;
  }

  public void setChiNhanhId(Long chiNhanhId) {
    this.chiNhanhId = chiNhanhId;
  }

  public Integer getSoBuoiDuKien() {
    return soBuoiDuKien;
  }

  public void setSoBuoiDuKien(Integer soBuoiDuKien) {
    this.soBuoiDuKien = soBuoiDuKien;
  }

  public Integer getSoBuoiDaHoc() {
    return soBuoiDaHoc;
  }

  public void setSoBuoiDaHoc(Integer soBuoiDaHoc) {
    this.soBuoiDaHoc = soBuoiDaHoc;
  }

  public LocalDate getNgay() {
    return ngay;
  }

  public void setNgay(LocalDate ngay) {
    this.ngay = ngay;
  }

  public LocalTime getBatDauLuc() {
    return batDauLuc;
  }

  public void setBatDauLuc(LocalTime batDauLuc) {
    this.batDauLuc = batDauLuc;
  }

  public LocalTime getKetThucLuc() {
    return ketThucLuc;
  }

  public void setKetThucLuc(LocalTime ketThucLuc) {
    this.ketThucLuc = ketThucLuc;
  }

  public Integer getThoiLuongPhut() {
    return thoiLuongPhut;
  }

  public void setThoiLuongPhut(Integer thoiLuongPhut) {
    this.thoiLuongPhut = thoiLuongPhut;
  }

  public Long getCoDinhGroupId() {
    return coDinhGroupId;
  }

  public void setCoDinhGroupId(Long coDinhGroupId) {
    this.coDinhGroupId = coDinhGroupId;
  }

  public TrangThaiBuoi getTrangThaiBuoi() {
    return trangThaiBuoi;
  }

  public void setTrangThaiBuoi(TrangThaiBuoi trangThaiBuoi) {
    this.trangThaiBuoi = trangThaiBuoi;
  }

  public String getGhiChu() {
    return ghiChu;
  }

  public void setGhiChu(String ghiChu) {
    this.ghiChu = ghiChu;
  }

  public Timestamp getTaoLuc() {
    return taoLuc;
  }

  public void setTaoLuc(Timestamp taoLuc) {
    this.taoLuc = taoLuc;
  }

  public Timestamp getCapNhatLuc() {
    return capNhatLuc;
  }

  public void setCapNhatLuc(Timestamp capNhatLuc) {
    this.capNhatLuc = capNhatLuc;
  }
}