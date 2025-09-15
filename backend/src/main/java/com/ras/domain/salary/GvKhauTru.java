package com.ras.domain.salary;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity @Table(name="gv_khau_tru")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class GvKhauTru {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  @Column(name="ky_luong_id") private Long kyLuongId;
  @Column(name="chi_nhanh_id") private Long chiNhanhId;
  @Column(name="nhan_vien_id") private Long nhanVienId;
  private LocalDate ngay;
  @Column(name="noi_dung") private String noiDung;
  @Column(name="so_tien") private BigDecimal soTien;
}
