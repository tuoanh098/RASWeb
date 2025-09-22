package com.ras.service.payroll.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CommissionUpsertRequest {
    private Long ky_luong_id;
    private Long nhan_vien_id;
    private Long hoc_vien_id; // optional
    private Long dang_ky_id;  // optional

    private BigDecimal hoc_phi_ap_dung; // required để tính % nếu so_tien null
    private BigDecimal ty_le_pct;       // %
    private BigDecimal so_tien;         // optional; nếu null sẽ = hoc_phi * % / 100
    private String ghi_chu;
}
