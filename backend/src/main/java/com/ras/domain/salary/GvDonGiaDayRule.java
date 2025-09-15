package com.ras.domain.salary;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity @Table(name="gv_don_gia_day_rule")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class GvDonGiaDayRule {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;

  @Column(name="mon_hoc_id") private Long monHocId;
  @Column(name="cap_do_id") private Long capDoId;

  @Column(name="loai_lop") private String loaiLop;           // ca_nhan/nhom/nhom2/...
  @Column(name="thoi_luong_phut") private Short thoiLuongPhut; // 45/60/90
  @Column(name="hinh_thuc") private String hinhThuc;          // offline/online

  @Column(name="kieu_tinh") private String kieuTinh;          // so_tien | phan_tram_hoc_phi_buoi
  @Column(name="so_tien") private BigDecimal soTien;          // nếu kieu_tinh=so_tien
  @Column(name="ty_le_pct") private BigDecimal tyLePct;       // nếu kieu_tinh=phan_tram_hoc_phi_buoi

  @Column(name="uu_tien") private Short uuTien;               // số nhỏ ưu tiên cao
  @Column(name="hieu_luc_tu") private LocalDate hieuLucTu;
  @Column(name="hieu_luc_den") private LocalDate hieuLucDen;

  @Column(name="ghi_chu") private String ghiChu;
}
