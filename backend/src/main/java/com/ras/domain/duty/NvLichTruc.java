// src/main/java/com/ras/domain/duty/NvLichTruc.java
package com.ras.domain.duty;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "nv_lich_truc",
  uniqueConstraints = {
    @UniqueConstraint(name = "uq_nv_truc", columnNames = {"nhan_vien_id","ngay","chi_nhanh_id"})
  },
  indexes = {
    @Index(name="idx_truc_ngay", columnList = "ngay"),
    @Index(name="idx_truc_chi_nhanh", columnList = "chi_nhanh_id,ngay")
  }
)
@Getter @Setter
public class NvLichTruc {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "nhan_vien_id", nullable = false)
  private Long nhanVienId;

  @Column(name = "nhan_vien_ten", nullable = false, length = 255)
  private String nhanVienTen;

  @Column(name = "chi_nhanh_id", nullable = false)
  private Long chiNhanhId;

  @Column(name = "chi_nhanh_ten", nullable = false, length = 255)
  private String chiNhanhTen;

  @Column(name = "ngay", nullable = false)
  private LocalDate ngay;

  @Column(name = "ghi_chu")
  private String ghiChu;

  @Column(name = "tao_luc", columnDefinition = "timestamp null default current_timestamp")
  private OffsetDateTime taoLuc;

  @Column(name = "cap_nhat_luc", columnDefinition = "timestamp null default current_timestamp on update current_timestamp")
  private OffsetDateTime capNhatLuc;
}
