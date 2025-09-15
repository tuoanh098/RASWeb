package com.ras.domain.salary;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "nv_bang_luong_thang",
       indexes = {
           @Index(name = "idx_nvbl_ky_nv", columnList = "ky_luong_id, nhan_vien_id")
       },
       uniqueConstraints = {
           @UniqueConstraint(name = "uk_nvbl_ky_nv", columnNames = {"ky_luong_id","nhan_vien_id"})
       })
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class NvBangLuongThang {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ky_luong_id", nullable = false)
    private Long kyLuongId;

    @Column(name = "nhan_vien_id", nullable = false)
    private Long nhanVienId;

    // Đồng bộ VND nguyên: DECIMAL(12,0)
    @Column(name = "luong_cung", precision = 12, scale = 0)
    private BigDecimal luongCung;

    @Column(name = "tong_hoa_hong", precision = 12, scale = 0)
    private BigDecimal tongHoaHong;

    @Column(name = "tong_thuong", precision = 12, scale = 0)
    private BigDecimal tongThuong;

    @Column(name = "tong_truc", precision = 12, scale = 0)
    private BigDecimal tongTruc;

    @Column(name = "tong_phu_cap_khac", precision = 12, scale = 0)
    private BigDecimal tongPhuCapKhac;

    @Column(name = "tong_phat", precision = 12, scale = 0)
    private BigDecimal tongPhat;

    @Column(name = "tong_luong", precision = 12, scale = 0)
    private BigDecimal tongLuong;

    @Column(name = "ghi_chu", length = 255)
    private String ghiChu;

    @Column(name = "tao_luc", nullable = false, updatable = false, insertable = false)
    private Instant taoLuc;
}
