package com.ras.domain.course;

import jakarta.persistence.*;

@Entity
@Table(name = "khoa_hoc_mau")
public class KhoaHocMau {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "khoa_hoc_id")
  private Long khoaHocId;

  public Long getId() { return id; }
  public Long getKhoaHocId() { return khoaHocId; }
}
