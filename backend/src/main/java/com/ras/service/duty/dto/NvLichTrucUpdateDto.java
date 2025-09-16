// src/main/java/com/ras/service/duty/dto/NvLichTrucUpdateDto.java
package com.ras.service.duty.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class NvLichTrucUpdateDto {
  private Long nhan_vien_id;
  private String nhan_vien_ten;
  private Long chi_nhanh_id;
  private String chi_nhanh_ten;
  private LocalDate ngay;
  private String ghi_chu;
}
