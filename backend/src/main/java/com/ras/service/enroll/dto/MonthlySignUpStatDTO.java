package com.ras.service.enroll.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

public record MonthlySignUpStatDTO(
    @JsonProperty("month")                 String month,
    @JsonProperty("total_enrollments")     long totalEnrollments,
    @JsonProperty("total_tuition")         BigDecimal totalTuition,
    @JsonProperty("total_commission_2pct") BigDecimal totalCommission2pct
) {}
