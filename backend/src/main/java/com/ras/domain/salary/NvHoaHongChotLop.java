package com.ras.domain.salary;

import lombok.*;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "nv_hoa_hong_chot_lop",
       indexes = {
           @Index(name = "idx_hh_ky_nv", columnList = "ky_luong_id, nhan_vien_id")
       })
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class NvHoaHongChotLop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ky_luong_id", nullable = false)
    private Long kyLuongId;

    @Column(name = "chi_nhanh_id")
    private Long chiNhanhId;

    @Column(name = "nhan_vien_id", nullable = false)
    private Long nhanVienId;

    @Column(name = "hoc_vien_id", nullable = false)
    private Long hocVienId;

    @Column(name = "dang_ky_id")
    private Long dangKyId;

    @Column(name = "khoa_hoc_mau_id")
    private Long khoaHocMauId;

    @Column(name = "hoc_phi_ap_dung", precision = 12, scale = 0, nullable = false)
    private BigDecimal hocPhiApDung;

    @Column(name = "ty_le_pct", precision = 5, scale = 2, nullable = false)
    private BigDecimal tyLePct;

    @Column(name = "so_tien", precision = 12, scale = 0, nullable = false)
    private BigDecimal soTien;

    @Column(name = "ghi_chu", length = 300)
    private String ghiChu;

    @Column(name = "tao_luc", nullable = false, updatable = false, insertable = false)
    private Instant taoLuc;
}
