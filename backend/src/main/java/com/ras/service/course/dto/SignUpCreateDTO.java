package com.ras.service.course.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class SignUpCreateDTO {
    @NotNull
    private Long hocVienId;
    @NotNull
    private Long khoaHocId;

    private LocalDate ngayDangKy;   // nếu null sẽ là today
    private Long nvTuVanId;
    private String ghiChu;

    // getters/setters
    public Long getHocVienId() { return hocVienId; }
    public void setHocVienId(Long hocVienId) { this.hocVienId = hocVienId; }
    public Long getKhoaHocId() { return khoaHocId; }
    public void setKhoaHocId(Long khoaHocId) { this.khoaHocId = khoaHocId; }
    public LocalDate getNgayDangKy() { return ngayDangKy; }
    public void setNgayDangKy(LocalDate ngayDangKy) { this.ngayDangKy = ngayDangKy; }
    public Long getNvTuVanId() { return nvTuVanId; }
    public void setNvTuVanId(Long nvTuVanId) { this.nvTuVanId = nvTuVanId; }
    public String getGhiChu() { return ghiChu; }
    public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }
}
