package com.ras.domain.course;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(
    name = "mon_hoc",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_monhoc_ma_mon", columnNames = {"ma_mon"})
    }
)
public class MonHoc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="ma_mon", length=50, nullable=false, unique=true)
    private String maMon;

    @Column(name="ten_mon", length=200, nullable=false)
    private String tenMon;

    @Column(name="tao_luc", nullable=false, columnDefinition="timestamp default current_timestamp")
    private Instant taoLuc;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMaMon() { return maMon; }
    public void setMaMon(String maMon) { this.maMon = maMon; }

    public String getTenMon() { return tenMon; }
    public void setTenMon(String tenMon) { this.tenMon = tenMon; }

    public Instant getTaoLuc() { return taoLuc; }
    public void setTaoLuc(Instant taoLuc) { this.taoLuc = taoLuc; }
}
