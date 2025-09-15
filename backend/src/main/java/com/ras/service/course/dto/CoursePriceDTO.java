package com.ras.service.course.dto;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;

import java.math.BigDecimal;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class CoursePriceDTO {
    private Long mucId;
    private Long chiNhanhId;     // null = áp dụng all
    private Short soBuoiKhoa;
    private BigDecimal hocPhiKhoa;
    private BigDecimal hocPhiBuoi;

    // getters/setters
    public Long getMucId() { return mucId; }
    public void setMucId(Long mucId) { this.mucId = mucId; }
    public Long getChiNhanhId() { return chiNhanhId; }
    public void setChiNhanhId(Long chiNhanhId) { this.chiNhanhId = chiNhanhId; }
    public Short getSoBuoiKhoa() { return soBuoiKhoa; }
    public void setSoBuoiKhoa(Short soBuoiKhoa) { this.soBuoiKhoa = soBuoiKhoa; }
    public BigDecimal getHocPhiKhoa() { return hocPhiKhoa; }
    public void setHocPhiKhoa(BigDecimal hocPhiKhoa) { this.hocPhiKhoa = hocPhiKhoa; }
    public BigDecimal getHocPhiBuoi() { return hocPhiBuoi; }
    public void setHocPhiBuoi(BigDecimal hocPhiBuoi) { this.hocPhiBuoi = hocPhiBuoi; }
}
