package com.ras.domain.salary;

import lombok.*;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "nv_thuong_khac",
       indexes = {
           @Index(name = "idx_tk_ky_nv", columnList = "ky_luong_id, nhan_vien_id")
       })
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class NvThuongKhac {
    public enum LoaiThuong { cs_khach_hang, khac }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ky_luong_id", nullable = false)
    private Long kyLuongId;

    @Column(name = "chi_nhanh_id")
    private Long chiNhanhId;

    @Column(name = "nhan_vien_id", nullable = false)
    private Long nhanVienId;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_thuong", nullable = false)
    private LoaiThuong loaiThuong;

    @Column(name = "co_so_tinh", length = 200)
    private String coSoTinh;

    @Column(name = "ty_le_pct", precision = 5, scale = 2)
    private BigDecimal tyLePct;

    @Column(name = "so_tien", precision = 12, scale = 0, nullable = false)
    private BigDecimal soTien;

    @Column(name = "ghi_chu", length = 300)
    private String ghiChu;

    @Column(name = "tao_luc", nullable = false, updatable = false, insertable = false)
    private Instant taoLuc;
}
