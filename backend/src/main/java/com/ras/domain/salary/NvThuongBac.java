package com.ras.domain.salary;

import lombok.*;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "nv_thuong_bac",
       indexes = {
           @Index(name = "idx_tb_ky_nv", columnList = "ky_luong_id, nhan_vien_id")
       })
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class NvThuongBac {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ky_luong_id", nullable = false)
    private Long kyLuongId;

    @Column(name = "chi_nhanh_id")
    private Long chiNhanhId;

    @Column(name = "nhan_vien_id", nullable = false)
    private Long nhanVienId;

    @Column(name = "so_hv_moi", nullable = false)
    private Integer soHvMoi;

    @Column(name = "muc_thuong", precision = 12, scale = 0, nullable = false)
    private BigDecimal mucThuong;

    @Column(name = "ghi_chu", length = 300)
    private String ghiChu;

    @Column(name = "tao_luc", nullable = false, updatable = false, insertable = false)
    private Instant taoLuc;
}

