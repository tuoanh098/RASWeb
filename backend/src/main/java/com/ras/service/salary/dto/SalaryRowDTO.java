package com.ras.service.salary.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.time.Instant;

public class SalaryRowDTO {

    @JsonProperty("id")
    private Long id;

    @JsonProperty("ky_luong_id")
    private Long ky_luong_id;

    @JsonProperty("nhan_vien_id")
    private Long nhan_vien_id;

    @JsonProperty("luong_cung")
    private BigDecimal luong_cung;

    @JsonProperty("tong_hoa_hong")
    private BigDecimal tong_hoa_hong;

    @JsonProperty("tong_thuong")
    private BigDecimal tong_thuong;

    @JsonProperty("tong_truc")
    private BigDecimal tong_truc;

    @JsonProperty("tong_phu_cap_khac")
    private BigDecimal tong_phu_cap_khac;

    @JsonProperty("tong_phat")
    private BigDecimal tong_phat;

    @JsonProperty("tong_luong")
    private BigDecimal tong_luong;

    @JsonProperty("ghi_chu")
    private String ghi_chu;

    @JsonProperty("tao_luc")
    private Instant tao_luc;

    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getKy_luong_id() { return ky_luong_id; }
    public void setKy_luong_id(Long ky_luong_id) { this.ky_luong_id = ky_luong_id; }

    public Long getNhan_vien_id() { return nhan_vien_id; }
    public void setNhan_vien_id(Long nhan_vien_id) { this.nhan_vien_id = nhan_vien_id; }

    public BigDecimal getLuong_cung() { return luong_cung; }
    public void setLuong_cung(BigDecimal luong_cung) { this.luong_cung = luong_cung; }

    public BigDecimal getTong_hoa_hong() { return tong_hoa_hong; }
    public void setTong_hoa_hong(BigDecimal tong_hoa_hong) { this.tong_hoa_hong = tong_hoa_hong; }

    public BigDecimal getTong_thuong() { return tong_thuong; }
    public void setTong_thuong(BigDecimal tong_thuong) { this.tong_thuong = tong_thuong; }

    public BigDecimal getTong_truc() { return tong_truc; }
    public void setTong_truc(BigDecimal tong_truc) { this.tong_truc = tong_truc; }

    public BigDecimal getTong_phu_cap_khac() { return tong_phu_cap_khac; }
    public void setTong_phu_cap_khac(BigDecimal tong_phu_cap_khac) { this.tong_phu_cap_khac = tong_phu_cap_khac; }

    public BigDecimal getTong_phat() { return tong_phat; }
    public void setTong_phat(BigDecimal tong_phat) { this.tong_phat = tong_phat; }

    public BigDecimal getTong_luong() { return tong_luong; }
    public void setTong_luong(BigDecimal tong_luong) { this.tong_luong = tong_luong; }

    public String getGhi_chu() { return ghi_chu; }
    public void setGhi_chu(String ghi_chu) { this.ghi_chu = ghi_chu; }

    public Instant getTao_luc() { return tao_luc; }
    public void setTao_luc(Instant tao_luc) { this.tao_luc = tao_luc; }
}
