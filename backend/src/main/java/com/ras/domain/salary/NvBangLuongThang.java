package com.ras.domain.salary;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity @Table(name="nv_bang_luong_thang")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class NvBangLuongThang {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  @Column(name="ky_luong_id") private Long kyLuongId;
  @Column(name="nhan_vien_id") private Long nhanVienId;
  @Column(name="luong_cung") private BigDecimal luongCung;
  @Column(name="tong_hoa_hong") private BigDecimal tongHoaHong;
  @Column(name="tong_thuong") private BigDecimal tongThuong;
  @Column(name="tong_truc") private BigDecimal tongTruc;
  @Column(name="tong_phu_cap_khac") private BigDecimal tongPhuCapKhac;
  @Column(name="tong_phat") private BigDecimal tongPhat;
  @Column(name="tong_luong") private BigDecimal tongLuong;
  @Column(name="ghi_chu") private String ghiChu;
}
