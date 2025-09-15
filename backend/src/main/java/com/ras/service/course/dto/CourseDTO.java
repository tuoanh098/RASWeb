package com.ras.service.course.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.ras.domain.course.LoaiLop;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class CourseDTO {
    private Long id;
    private Long monHocId;
    private LoaiLop loaiLop;
    private Short thoiLuongPhut;
    private String ma;
    private String tenHienThi;

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getMonHocId() { return monHocId; }
    public void setMonHocId(Long monHocId) { this.monHocId = monHocId; }
    public LoaiLop getLoaiLop() { return loaiLop; }
    public void setLoaiLop(LoaiLop loaiLop) { this.loaiLop = loaiLop; }
    public Short getThoiLuongPhut() { return thoiLuongPhut; }
    public void setThoiLuongPhut(Short thoiLuongPhut) { this.thoiLuongPhut = thoiLuongPhut; }
    public String getMa() { return ma; }
    public void setMa(String ma) { this.ma = ma; }
    public String getTenHienThi() { return tenHienThi; }
    public void setTenHienThi(String tenHienThi) { this.tenHienThi = tenHienThi; }
}
