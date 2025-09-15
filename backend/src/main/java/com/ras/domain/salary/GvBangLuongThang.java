package com.ras.domain.salary;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity @Table(name="gv_bang_luong_thang")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class GvBangLuongThang {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  @Column(name="ky_luong_id") private Long kyLuongId;
  @Column(name="nhan_vien_id") private Long nhanVienId;
  @Column(name="tong_buoi") private BigDecimal tongBuoi;
  @Column(name="tien_day_buoi") private BigDecimal tienDayBuoi;
  @Column(name="tong_bonus") private BigDecimal tongBonus;
  @Column(name="tong_khau_tru") private BigDecimal tongKhauTru;
  @Column(name="tong_luong") private BigDecimal tongLuong;
  @Column(name="ghi_chu") private String ghiChu;
}
