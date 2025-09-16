package com.ras.domain.salary;

import lombok.*;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "nv_luong_cung",
uniqueConstraints = {
    @UniqueConstraint(name = "uk_nv_luong", columnNames = {"nhan_vien_id","hieu_luc_tu"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NvLuongCung {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nhan_vien_id", nullable = false)
    private Long nhanVienId;

    @Column(name = "hieu_luc_tu", nullable = false)
    private LocalDate hieuLucTu;

    @Column(name = "hieu_luc_den")
    private LocalDate hieuLucDen;

    @Column(name = "so_tien_thang", precision = 12, scale = 0, nullable = false)
    private BigDecimal soTienThang;

    @Column(name = "ghi_chu", length = 300)
    private String ghiChu;

    @Column(name = "tao_luc", nullable = false, updatable = false, insertable = false)
    private Instant taoLuc;
}
