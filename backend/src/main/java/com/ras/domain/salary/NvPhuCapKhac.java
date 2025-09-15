package com.ras.domain.salary;

import lombok.*;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "nv_phu_cap_khac",
       indexes = {
           @Index(name = "idx_pc_ky_nv", columnList = "ky_luong_id, nhan_vien_id")
       })
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class NvPhuCapKhac {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ky_luong_id", nullable = false)
    private Long kyLuongId;

    @Column(name = "chi_nhanh_id")
    private Long chiNhanhId;

    @Column(name = "nhan_vien_id", nullable = false)
    private Long nhanVienId;

    @Column(name = "noi_dung", length = 300, nullable = false)
    private String noiDung;

    @Column(name = "so_tien", precision = 12, scale = 0, nullable = false)
    private BigDecimal soTien;

    @Column(name = "tao_luc", nullable = false, updatable = false, insertable = false)
    private Instant taoLuc;
}
