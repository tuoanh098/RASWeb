package com.ras.domain.enroll;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "dang_ky_lop",
       indexes = {
         @Index(name="idx_dk_hv", columnList = "hoc_vien_id"),
         @Index(name="idx_dk_lop", columnList = "lop_id"),
         @Index(name="idx_dk_nv_tv", columnList = "nv_tu_van_id")
       })
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class DangKyLop {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "hoc_vien_id", nullable = false)
  private Long hocVienId;

  @Column(name = "lop_id", nullable = false)
  private Long lopId;

  /** Nhân viên tư vấn (để cộng hoa hồng 2%) */
  @Column(name = "nv_tu_van_id", nullable = false)
  private Long nvTuVanId;

  /** Học phí áp dụng cho lần đăng ký này (để tính 2%) */
  @Column(name = "hoc_phi_ap_dung", precision = 12, scale = 0, nullable = false)
  private java.math.BigDecimal hocPhiApDung;

  @Column(name = "ngay_dang_ky", nullable = false)
  private LocalDate ngayDangKy;

  @Column(name = "ghi_chu", length = 300)
  private String ghiChu;

  @Column(name = "tao_luc", updatable = false, insertable = false)
  private Instant taoLuc;
}
