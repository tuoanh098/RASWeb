package com.ras.domain.salary;

import lombok.*;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "nv_phat_ky_luat",
       indexes = {
           @Index(name = "idx_ph_ky_nv", columnList = "ky_luong_id, nhan_vien_id")
       })
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class NvPhatKyLuat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ky_luong_id", nullable = false)
    private Long kyLuongId;

    @Column(name = "ngay_thang", nullable = false)
    private LocalDate ngayThang;

    @Column(name = "nhan_vien_id", nullable = false)
    private Long nhanVienId;

    @Column(name = "chi_nhanh_id")
    private Long chiNhanhId;

    @Column(name = "noi_dung_loi", length = 255)
    private String noiDungLoi;

    @Column(name = "so_tien_phat", precision = 38, scale = 2, nullable = false)
    private BigDecimal soTienPhat;

    @Column(name = "tao_luc", nullable = false, updatable = false, insertable = false)
    private Instant taoLuc;
}
