package com.ras.domain.employee;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "nhan_vien")
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
    private String chucDanh;        // NV/QL

    @Column(name = "chuyen_mon")
    private String chuyenMon;       // GV

    @Column(name = "vai_tro")
    private String vaiTro;          // TEACHER | STAFF | MANAGER

    @Column(name = "gioi_tinh")
    private String gioiTinh;        // "Nam"/"Nữ"/...

    @Column(name = "ngay_sinh")
    private LocalDate ngaySinh;

    @Column(name = "dia_chi")
    private String diaChi;

    @Column(name = "cccd")
    private String cccd;

    @Column(name = "ma_so_thue")
    private String ma_so_thue;

    @Column(name = "ngay_vao_lam")
    private LocalDate ngayVaoLam;

    @Column(name = "so_nam_kinh_nghiem")
    private Integer soNamKinhNghiem;

    @Column(name = "hinh_thuc_lam_viec")
    private String hinhThucLamViec; // Full-time/Part-time

    @Column(name = "ghi_chu", columnDefinition = "TEXT")
    private String ghiChu;

    @Column(name = "hoat_dong")
    private Boolean hoatDong = Boolean.TRUE;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao;

    @Column(name = "ngay_sua")
    private LocalDateTime ngaySua;

    /* ==== getters & setters ==== */

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getHoTen() { return hoTen; }
    public void setHoTen(String hoTen) { this.hoTen = hoTen; }

    public String getSoDienThoai() { return soDienThoai; }
    public void setSoDienThoai(String soDienThoai) { this.soDienThoai = soDienThoai; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getChucDanh() { return chucDanh; }
    public void setChucDanh(String chucDanh) { this.chucDanh = chucDanh; }

    public String getChuyenMon() { return chuyenMon; }
    public void setChuyenMon(String chuyenMon) { this.chuyenMon = chuyenMon; }

    public String getVaiTro() { return vaiTro; }
    public void setVaiTro(String vaiTro) { this.vaiTro = vaiTro; }

    public String getGioiTinh() { return gioiTinh; }
    public void setGioiTinh(String gioiTinh) { this.gioiTinh = gioiTinh; }

    public LocalDate getNgaySinh() { return ngaySinh; }
    public void setNgaySinh(LocalDate ngaySinh) { this.ngaySinh = ngaySinh; }

    public String getDiaChi() { return diaChi; }
    public void setDiaChi(String diaChi) { this.diaChi = diaChi; }

    public String getCccd() { return cccd; }
    public void setCccd(String cccd) { this.cccd = cccd; }

    public String getMaSoThue() { return ma_so_thue; }
    public void setMaSoThue(String ma_so_thue) { this.ma_so_thue = ma_so_thue; }
    
    public LocalDate getNgayVaoLam() { return ngayVaoLam; }
    public void setNgayVaoLam(LocalDate ngayVaoLam) { this.ngayVaoLam = ngayVaoLam; }

    public Integer getSoNamKinhNghiem() { return soNamKinhNghiem; }
    public void setSoNamKinhNghiem(Integer soNamKinhNghiem) { this.soNamKinhNghiem = soNamKinhNghiem; }


    public String getHinhThucLamViec() { return hinhThucLamViec; }
    public void setHinhThucLamViec(String hinhThucLamViec) { this.hinhThucLamViec = hinhThucLamViec; }

    public String getGhiChu() { return ghiChu; }
    public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }

    public Boolean getHoatDong() { return hoatDong; }
    public void setHoatDong(Boolean hoatDong) { this.hoatDong = hoatDong; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public LocalDateTime getNgayTao() { return ngayTao; }
    public void setNgayTao(LocalDateTime ngayTao) { this.ngayTao = ngayTao; }

    public LocalDateTime getNgaySua() { return ngaySua; }
    public void setNgaySua(LocalDateTime ngaySua) { this.ngaySua = ngaySua; }
}
