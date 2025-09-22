package com.ras.domain.course;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(
    name = "khoa_hoc",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_kh", columnNames = {"mon_hoc_id","loai_lop","thoi_luong_phut"}),
        @UniqueConstraint(name = "uk_khoa_hoc_ma", columnNames = {"ma"})
    }
)
public class KhoaHoc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "mon_hoc_id", nullable = false, foreignKey = @ForeignKey(name = "fk_kh_mon"))
    private MonHoc monHoc;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "loai_lop", nullable = false, columnDefinition = "enum('ca_nhan','nhom2','nhom5')")
    private LoaiLop loaiLop;

    @NotNull
    @Column(name = "thoi_luong_phut", nullable = false)
    private Integer thoiLuongPhut;

    @Column(name = "ma", unique = true)
    private String ma;

    @NotNull
    @Column(name = "ten_hien_thi", nullable = false)
    private String tenHienThi;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public MonHoc getMonHoc() { return monHoc; }
    public void setMonHoc(MonHoc monHoc) { this.monHoc = monHoc; }

    public LoaiLop getLoaiLop() { return loaiLop; }
    public void setLoaiLop(LoaiLop loaiLop) { this.loaiLop = loaiLop; }

    public Integer getThoiLuongPhut() { return thoiLuongPhut; }
    public void setThoiLuongPhut(Integer thoiLuongPhut) { this.thoiLuongPhut = thoiLuongPhut; }

    public String getMa() { return ma; }
    public void setMa(String ma) { this.ma = ma; }

    public String getTenHienThi() { return tenHienThi; }
    public void setTenHienThi(String tenHienThi) { this.tenHienThi = tenHienThi; }
}
