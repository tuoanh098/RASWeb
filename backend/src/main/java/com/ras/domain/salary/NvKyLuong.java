package com.ras.domain.salary;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ky_luong")
public class NvKyLuong {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // yyyy-MM, ví dụ "2025-09"
    @Column(name = "nam_thang", nullable = false, length = 7, unique = true)
    private String namThang;

    @Column(name = "trang_thai", length = 50)
    private String trangThai;

    @Column(name = "tao_luc")
    private LocalDateTime taoLuc;

    public NvKyLuong() {}

    public Long getId() {
        return id;
    }

    public String getNamThang() {
        return namThang;
    }

    public void setNamThang(String namThang) {
        this.namThang = namThang;
    }

    public String getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(String trangThai) {
        this.trangThai = trangThai;
    }

    public LocalDateTime getTaoLuc() {
        return taoLuc;
    }

    public void setTaoLuc(LocalDateTime taoLuc) {
        this.taoLuc = taoLuc;
    }
}
