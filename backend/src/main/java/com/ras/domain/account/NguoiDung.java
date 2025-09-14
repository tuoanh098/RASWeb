package com.ras.domain.account;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "nguoi_dung", uniqueConstraints = @UniqueConstraint(columnNames = "username"))
public class NguoiDung {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="username", nullable=false, length=100)
    private String username;

    @Column(name="password_hash", nullable=false, length=255)
    private String passwordHash;

    @Column(name="email", length=255)
    private String email;

    @Column(name="vai_tro", nullable=false, length=20) // TEACHER | STAFF | MANAGER
    private String vaiTro;

    @Column(name="hoat_dong", nullable=false)
    private Boolean hoatDong = true;

    @Column(name="lan_dang_nhap_cuoi")
    private LocalDateTime lanDangNhapCuoi;

    @Column(name="id_nhan_vien")
    private Long idNhanVien;

    @Column(name="ngay_tao", updatable=false)
    private LocalDateTime ngayTao;

    @Column(name="ngay_sua")
    private LocalDateTime ngaySua;

    @PrePersist
    void prePersist() { ngayTao = LocalDateTime.now(); ngaySua = ngayTao; }

    @PreUpdate
    void preUpdate() { ngaySua = LocalDateTime.now(); }

    // getters/setters
    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getPasswordHash() { return passwordHash; }
    public String getEmail() { return email; }
    public String getVaiTro() { return vaiTro; }
    public Boolean getHoatDong() { return hoatDong; }
    public LocalDateTime getLanDangNhapCuoi() { return lanDangNhapCuoi; }
    public Long getIdNhanVien() { return idNhanVien; }
    public LocalDateTime getNgayTao() { return ngayTao; }
    public LocalDateTime getNgaySua() { return ngaySua; }

    public void setId(Long id) { this.id = id; }
    public void setUsername(String username) { this.username = username; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public void setEmail(String email) { this.email = email; }
    public void setVaiTro(String vaiTro) { this.vaiTro = vaiTro; }
    public void setHoatDong(Boolean hoatDong) { this.hoatDong = hoatDong; }
    public void setLanDangNhapCuoi(LocalDateTime lanDangNhapCuoi) { this.lanDangNhapCuoi = lanDangNhapCuoi; }
    public void setIdNhanVien(Long idNhanVien) { this.idNhanVien = idNhanVien; }
    public void setNgayTao(LocalDateTime ngayTao) { this.ngayTao = ngayTao; }
    public void setNgaySua(LocalDateTime ngaySua) { this.ngaySua = ngaySua; }
}
