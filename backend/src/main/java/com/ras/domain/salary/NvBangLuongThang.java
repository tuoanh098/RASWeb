package com.ras.domain.salary;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "nv_bang_luong_thang",
       uniqueConstraints = @UniqueConstraint(name = "uk_nvbl_ky_nv", columnNames = {"ky_luong_id","nhan_vien_id"}))
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class NvBangLuongThang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ky_luong_id", nullable = false)
    private Long kyLuongId;

    @Column(name = "nhan_vien_id", nullable = false)
    private Long nhanVienId;

    @Column(name = "luong_cung")
    private BigDecimal luongCung;

    @Column(name = "tong_hoa_hong")
    private BigDecimal tongHoaHong;

    @Column(name = "tong_thuong")
    private BigDecimal tongThuong;

    @Column(name = "tong_truc")
    private BigDecimal tongTruc;

    @Column(name = "tong_phu_cap_khac")
    private BigDecimal tongPhuCapKhac;

    @Column(name = "tong_phat")
    private BigDecimal tongPhat;

    @Column(name = "tong_luong")
    private BigDecimal tongLuong;

    @Column(name = "ghi_chu")
    private String ghiChu;

    @Column(name = "tao_luc")
    private LocalDateTime taoLuc;
}
