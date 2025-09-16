// src/main/java/com/ras/service/duty/dto/NvLichTrucDto.java
package com.ras.service.duty.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Data
public class NvLichTrucDto {
  private Long id;
  private Long nhan_vien_id;
  private String nhan_vien_ten;
  private Long chi_nhanh_id;
  private String chi_nhanh_ten;
  private LocalDate ngay;
  private String ghi_chu;
  private OffsetDateTime tao_luc;
  private OffsetDateTime cap_nhat_luc;
}
