package com.ras.domain.salary;

import lombok.*;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "nv_truc",
       indexes = {
           @Index(name = "idx_tr_ky_nv", columnList = "ky_luong_id, nhan_vien_id")
       })
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class NvTruc {
    public enum Ca { sang, chieu, toi, ca_ngay }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ky_luong_id", nullable = false)
    private Long kyLuongId;

    @Column(name = "nhan_vien_id", nullable = false)
    private Long nhanVienId;

    @Column(name = "ngay", nullable = false)
    private LocalDate ngay;

    @Enumerated(EnumType.STRING)
    @Column(name = "ca", nullable = false)
    private Ca ca;

    @Column(name = "chi_nhanh_id")
    private Long chiNhanhId;

    @Column(name = "so_tien", precision = 12, scale = 0, nullable = false)
    private BigDecimal soTien;

    @Column(name = "ghi_chu", length = 200)
    private String ghiChu;

    @Column(name = "tao_luc", nullable = false, updatable = false, insertable = false)
    private Instant taoLuc;
}
