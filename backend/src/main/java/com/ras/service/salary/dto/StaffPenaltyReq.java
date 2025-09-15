package com.ras.service.salary.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class StaffPenaltyReq {
    private String ky;          // "2025-09"
    private Long nhanVienId;
    private Long chiNhanhId;    // optional
    private LocalDate ngayThang;
    private BigDecimal soTienPhat; // âm hay dương đều được, khuyến nghị âm
    private String noiDungLoi;
}
