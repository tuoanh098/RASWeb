package com.ras.domain.salary;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity @Table(name="gv_bonus_rule")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class GvBonusRule {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;

  @Column(name="loai_buoi") private String loaiBuoi;          // trial/cover/makeup/workshop/...
  @Column(name="mon_hoc_id") private Long monHocId;           // null = all
  @Column(name="thoi_luong_phut") private Short thoiLuongPhut;// null = all

  @Column(name="so_tien") private BigDecimal soTien;          // bonus cố định
  @Column(name="he_so") private BigDecimal heSo;              // nếu có hệ số

  @Column(name="uu_tien") private Short uuTien;
  @Column(name="hieu_luc_tu") private LocalDate hieuLucTu;
  @Column(name="hieu_luc_den") private LocalDate hieuLucDen;

  @Column(name="ghi_chu") private String ghiChu;
}
