package com.ras.service.salary.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PayrollPeriodDTO {
    private Long id;

    @JsonProperty("nam_thang")
    private String namThang;

    public PayrollPeriodDTO() {}

    public PayrollPeriodDTO(Long id, String namThang) {
        this.id = id;
        this.namThang = namThang;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    @JsonProperty("nam_thang")
    public String getNamThang() { return namThang; }
    @JsonProperty("nam_thang")
    public void setNamThang(String namThang) { this.namThang = namThang; }
}