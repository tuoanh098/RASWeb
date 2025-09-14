package com.ras.domain.student;

import jakarta.persistence.*;
import lombok.*;
import java.time.*;

@Entity
@Table(name = "hoc_vien")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HocVien {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "hoc_sinh")
  private String hocSinh;

  @Column(name = "hs_phone")
  private String hsPhone;

  private String email;

  @Column(name = "phu_huynh")
  private String phuHuynh;

  @Column(name = "phu_huynh_phone")
  private String phuHuynhPhone;

  @Column(name = "chi_nhanh_ho_tro")
  private String chiNhanhHoTro;

  @Column(name = "thoi_gian_bat_dau_hoc")
  private LocalDate thoiGianBatDauHoc;

  @Column(name = "ngay_tao")
  private LocalDateTime ngayTao;

  @Column(name = "ngay_sua")
  private LocalDateTime ngaySua;

  @PrePersist void prePersist(){ this.ngayTao = LocalDateTime.now(); }
  @PreUpdate  void preUpdate(){ this.ngaySua = LocalDateTime.now(); }
}
