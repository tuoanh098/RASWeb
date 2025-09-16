package com.ras.service.enroll.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SignupSummaryDTO {

    private String thang;   // Format: YYYY-MM
    private long tongDangKy;
}