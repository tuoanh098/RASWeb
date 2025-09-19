package com.ras.domain.course;
import jakarta.persistence.*;

@Entity
@Table(name = "khoa_hoc",
       uniqueConstraints = {
         @UniqueConstraint(name = "uq_kh", columnNames = {"mon_hoc_id","loai_lop","thoi_luong_phut"}),
         @UniqueConstraint(name = "uk_khoa_hoc_ma", columnNames = {"ma"})
       })
public class KhoaHoc {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "mon_hoc_id", nullable = false)
    private Long monHocId;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_lop", nullable = false, length = 16)
    private LoaiLop loaiLop;
    
    @Column(name = "thoi_luong_phut", nullable = false)
    private Short thoiLuongPhut;

    @Column(name = "ma")
    private String ma;

    @Column(name = "ten_hien_thi", nullable = false)
    private String tenHienThi;

    // getters/setters
    public Long getId() { return id; }
    public Long getMonHocId() { return monHocId; }
    public void setMonHocId(Long monHocId) { this.monHocId = monHocId; }
    public LoaiLop getLoaiLop() { return loaiLop; }
    public void setLoaiLop(LoaiLop loaiLop) { this.loaiLop = loaiLop; }
    public Short getThoiLuongPhut() { return thoiLuongPhut; }
    public void setThoiLuongPhut(Short thoiLuongPhut) { this.thoiLuongPhut = thoiLuongPhut; }
    public String getMa() { return ma; }
    public void setMa(String ma) { this.ma = ma; }
    public String getTenHienThi() { return tenHienThi; }
    public void setTenHienThi(String tenHienThi) { this.tenHienThi = tenHienThi; }
}
