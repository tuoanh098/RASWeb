package com.ras.domain.employee;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "nhan_vien")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ho_ten")
    private String hoTen;

    @Column(name = "so_dien_thoai")
    private String soDienThoai;

    @Column(name = "email")
    private String email;

    @Column(name = "chuc_danh")
    private String chucDanh;

    @Column(name = "vai_tro")
    private String vaiTro;

    @Column(name = "chuyen_mon")
    private String chuyenMon;

    @Column(name = "gioi_tinh")
    private String gioiTinh;

    @Column(name = "dia_chi")
    private String diaChi;

    @Column(name = "cccd")
    private String cccd;

    @Column(name = "ma_so_thue")
    private String maSoThue;

    @Column(name = "ngay_sinh")
    private LocalDate ngaySinh;

    @Column(name = "ngay_vao_lam")
    private LocalDate ngayVaoLam;

    @Column(name = "so_nam_kinh_nghiem")
    private Integer soNamKinhNghiem;

    @Column(name = "luong_co_ban")
    private BigDecimal luongCoBan;

    @Column(name = "he_so_luong")
    private BigDecimal heSoLuong;

    @Column(name = "phu_cap")
    private BigDecimal phuCap;

    @Column(name = "hinh_thuc_lam_viec")
    private String hinhThucLamViec;

    @Column(name = "hoat_dong")
    private Boolean hoatDong;

    @Column(name = "ghi_chu")
    private String ghiChu;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao;

    @Column(name = "ngay_sua")
    private LocalDateTime ngaySua;

    // --- getter/setter quan trọng để code upload dùng ---
    public Long getId() { return id; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public LocalDateTime getNgaySua() { return ngaySua; }
    public void setNgaySua(LocalDateTime ngaySua) { this.ngaySua = ngaySua; }

    @PrePersist
    void prePersist() {
        this.ngayTao = LocalDateTime.now();
        this.ngaySua = this.ngayTao;
        if (hoatDong == null) hoatDong = true;
    }
    @PreUpdate
    void preUpdate() {
        this.ngaySua = LocalDateTime.now();
    }
}
