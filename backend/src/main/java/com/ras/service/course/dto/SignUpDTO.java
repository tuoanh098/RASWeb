package com.ras.service.course.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;

import java.time.LocalDate;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class SignUpDTO {
    private Long id;
    private Long hocVienId;
    private Long khoaHocId;
    private LocalDate ngayDangKy;
    private Long nvTuVanId;
    private String nvTuVanTen;     // tên nhân viên tư vấn (join nhẹ hoặc fill từ service khác)
    private Long lopHocId;
    private Long giaoVienId;
    private String ghiChu;

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getHocVienId() { return hocVienId; }
    public void setHocVienId(Long hocVienId) { this.hocVienId = hocVienId; }
    public Long getKhoaHocId() { return khoaHocId; }
    public void setKhoaHocId(Long khoaHocId) { this.khoaHocId = khoaHocId; }
    public LocalDate getNgayDangKy() { return ngayDangKy; }
    public void setNgayDangKy(LocalDate ngayDangKy) { this.ngayDangKy = ngayDangKy; }
    public Long getNvTuVanId() { return nvTuVanId; }
    public void setNvTuVanId(Long nvTuVanId) { this.nvTuVanId = nvTuVanId; }
    public String getNvTuVanTen() { return nvTuVanTen; }
    public void setNvTuVanTen(String nvTuVanTen) { this.nvTuVanTen = nvTuVanTen; }
    public Long getLopHocId() { return lopHocId; }
    public void setLopHocId(Long lopHocId) { this.lopHocId = lopHocId; }
    public Long getGiaoVienId() { return giaoVienId; }
    public void setGiaoVienId(Long giaoVienId) { this.giaoVienId = giaoVienId; }
    public String getGhiChu() { return ghiChu; }
    public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }
}
