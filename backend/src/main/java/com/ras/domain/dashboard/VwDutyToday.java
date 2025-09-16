package com.ras.domain.dashboard;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.Immutable;
import java.time.LocalDate;

@Entity @Immutable
@Table(name = "vw_duty_today")
public class VwDutyToday {
  @Id
  private Long id;
  private Long nhanVienId;
  private String nhanVienTen;
  private Long chiNhanhId;
  private String chiNhanhTen;
  private LocalDate ngay;
  private String ghiChu;
  // getters ...
}
