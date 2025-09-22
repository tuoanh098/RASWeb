package com.ras.service.payroll.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class UpdateTyLePctRequest {
    private BigDecimal ty_le_pct;
    private boolean recalc = true;
}