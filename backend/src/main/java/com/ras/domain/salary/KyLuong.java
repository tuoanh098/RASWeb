package com.ras.domain.salary;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ky_luong")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class KyLuong {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Ví dụ: "2025-09"
    @Column(name = "nam_thang", length = 7, nullable = false)
    private String namThang;

    @Column(name = "trang_thai")
    private String trangThai;
}
