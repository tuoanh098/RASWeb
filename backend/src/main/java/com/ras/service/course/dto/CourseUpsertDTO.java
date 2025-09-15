package com.ras.service.course.dto;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.ras.domain.course.LoaiLop;
import jakarta.validation.constraints.*;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class CourseUpsertDTO {
    @NotNull
    private Long monHocId;

    @NotNull
    private LoaiLop loaiLop;

    @NotNull
    @Min(15) @Max(600)
    private Short thoiLuongPhut;

    @Size(max = 60)
    private String ma;

    @NotBlank @Size(max = 150)
    private String tenHienThi;

    // getters/setters
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
