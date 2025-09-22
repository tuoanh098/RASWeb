package com.ras.domain.payroll;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "ky_luong", uniqueConstraints = @UniqueConstraint(name="uk_ky_luong_thang", columnNames = "thang_ky"))
public class KyLuong {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="thang_ky", nullable=false, length=7) // 'YYYY-MM'
    private String thangKy;

    @Column(name="tu_ngay", nullable=false)
    private LocalDate tuNgay;

    @Column(name="den_ngay", nullable=false)
    private LocalDate denNgay;

    @Enumerated(EnumType.STRING)
    @Column(name="trang_thai", nullable=false, length=20)
    private KyLuongTrangThai trangThai;

    @Column(name="ghi_chu")
    private String ghiChu;

    @Column(name="tao_luc", insertable=false, updatable=false)
    private OffsetDateTime taoLuc;

    // getters/setters
    public Long getId() { return id; }
    public String getThangKy() { return thangKy; }
    public void setThangKy(String thangKy) { this.thangKy = thangKy; }
    public LocalDate getTuNgay() { return tuNgay; }
    public void setTuNgay(LocalDate tuNgay) { this.tuNgay = tuNgay; }
    public LocalDate getDenNgay() { return denNgay; }
    public void setDenNgay(LocalDate denNgay) { this.denNgay = denNgay; }
    public KyLuongTrangThai getTrangThai() { return trangThai; }
    public void setTrangThai(KyLuongTrangThai trangThai) { this.trangThai = trangThai; }
    public String getGhiChu() { return ghiChu; }
    public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }
}