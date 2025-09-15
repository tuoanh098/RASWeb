package com.ras.domain.salary;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "nv_phat_ky_luat")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class NvPhatKyLuat {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ky_luong_id", nullable = false)
    private Long kyLuongId;

    @Column(name = "nhan_vien_id", nullable = false)
    private Long nhanVienId;

    @Column(name = "chi_nhanh_id")
    private Long chiNhanhId;

    @Column(name = "ngay_thang")
    private LocalDate ngayThang;

    @Column(name = "noi_dung_loi")
    private String noiDungLoi;

    @Column(name = "so_tien_phat", nullable = false)
    private BigDecimal soTienPhat;

    @Column(name = "tao_luc")
    private LocalDateTime taoLuc;
}
