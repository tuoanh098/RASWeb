package com.ras.domain.account;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.ras.domain.employee.Employee;

@Entity
@Table(name = "nguoi_dung")
public class NguoiDung {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", nullable = false, unique = true, length = 100)
    private String username;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "email", length = 190)
    private String email;

    @Column(name = "vai_tro", nullable = false, length = 20)
    private String vaiTro; // TEACHER, STAFF, MANAGER

    @Column(name = "hoat_dong", nullable = false)
    private Boolean hoatDong = true;

    @Column(name = "lan_dang_nhap_cuoi")
    private LocalDateTime lanDangNhapCuoi;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_nhan_vien", nullable = false, unique = true)
    private Employee nhanVien;

    @Column(name = "ngay_tao", nullable = false)
    private LocalDateTime ngayTao = LocalDateTime.now();

    @Column(name = "ngay_sua")
    private LocalDateTime ngaySua;

    // Getters/Setters
    public Long getId() { return id; }
    public String getUsername() { return username; }
    public void setUsername(String v) { this.username = v; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String v) { this.passwordHash = v; }
    public String getEmail() { return email; }
    public void setEmail(String v) { this.email = v; }
    public String getVaiTro() { return vaiTro; }
    public void setVaiTro(String v) { this.vaiTro = v; }
    public Boolean getHoatDong() { return hoatDong; }
    public void setHoatDong(Boolean v) { this.hoatDong = v; }
    public LocalDateTime getLanDangNhapCuoi() { return lanDangNhapCuoi; }
    public void setLanDangNhapCuoi(LocalDateTime v) { this.lanDangNhapCuoi = v; }
    public Employee getNhanVien() { return nhanVien; }
    public void setNhanVien(Employee nv) { this.nhanVien = nv; }
    public LocalDateTime getNgayTao() { return ngayTao; }
    public void setNgayTao(LocalDateTime v) { this.ngayTao = v; }
    public LocalDateTime getNgaySua() { return ngaySua; }
    public void setNgaySua(LocalDateTime v) { this.ngaySua = v; }
}
