package com.ras.domain.salary;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity @Table(name="gv_bonus")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class GvBonus {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  @Column(name="ky_luong_id") private Long kyLuongId;
  @Column(name="chi_nhanh_id") private Long chiNhanhId;
  @Column(name="nhan_vien_id") private Long nhanVienId;
  private LocalDate ngay;
  @Column(name="loai_bonus") private String loaiBonus;
  @Column(name="so_buoi") private BigDecimal soBuoi;
  @Column(name="so_tien") private BigDecimal soTien;
  private String ghiChu;
  @Column(name="import_ref_id") private Long importRefId;
}
