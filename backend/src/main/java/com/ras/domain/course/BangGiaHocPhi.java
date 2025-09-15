package com.ras.domain.course;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "bang_gia_hoc_phi")
public class BangGiaHocPhi {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="ten", nullable=false) private String ten;
    @Column(name="hieu_luc_tu", nullable=false) private LocalDate hieuLucTu;
    @Column(name="hieu_luc_den") private LocalDate hieuLucDen;

    @Enumerated(EnumType.STRING)
    @Column(name="trang_thai")
    private TrangThaiBangGia trangThai; // nhap, ap_dung, het_hieu_luc

    // getters/setters ...
    public Long getId() { return id; }
    public TrangThaiBangGia getTrangThai() { return trangThai; }
    public void setTrangThai(TrangThaiBangGia trangThai) { this.trangThai = trangThai; }
}
