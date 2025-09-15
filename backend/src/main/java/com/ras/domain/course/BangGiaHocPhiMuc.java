package com.ras.domain.course;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "bang_gia_hoc_phi_muc",
       uniqueConstraints = @UniqueConstraint(name="uq_bghp_muc", columnNames = {"bang_gia_id","chi_nhanh_id","khoa_hoc_id"}))
public class BangGiaHocPhiMuc {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="bang_gia_id", nullable=false) private Long bangGiaId;
    @Column(name="chi_nhanh_id") private Long chiNhanhId; // cho phép null = áp dụng all
    @Column(name="khoa_hoc_id", nullable=false) private Long khoaHocId;

    @Column(name="so_buoi_khoa") private Short soBuoiKhoa;
    @Column(name="hoc_phi_khoa") private BigDecimal hocPhiKhoa;
    @Column(name="hoc_phi_buoi") private BigDecimal hocPhiBuoi;
    // hoc_phi_buoi_tinh là generated column trong DB, không cần map

    // getters/setters...
    public Long getId() { return id; }
    public Long getBangGiaId() { return bangGiaId; }
    public Long getChiNhanhId() { return chiNhanhId; }
    public Long getKhoaHocId() { return khoaHocId; }
    public Short getSoBuoiKhoa() { return soBuoiKhoa; }
    public java.math.BigDecimal getHocPhiKhoa() { return hocPhiKhoa; }
    public java.math.BigDecimal getHocPhiBuoi() { return hocPhiBuoi; }
}