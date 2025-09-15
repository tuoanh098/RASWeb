package com.ras.service.salary.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.time.Instant;

public class HoaHongDTO {

    @JsonProperty("id")
    private Long id;

    @JsonProperty("ky_luong_id")
    private Long ky_luong_id;

    @JsonProperty("chi_nhanh_id")
    private Long chi_nhanh_id;

    @JsonProperty("nhan_vien_id")
    private Long nhan_vien_id;

    @JsonProperty("hoc_vien_id")
    private Long hoc_vien_id;

    @JsonProperty("dang_ky_id")
    private Long dang_ky_id;

    @JsonProperty("khoa_hoc_mau_id")
    private Long khoa_hoc_mau_id;

    @JsonProperty("hoc_phi_ap_dung")
    private BigDecimal hoc_phi_ap_dung;

    @JsonProperty("ty_le_pct")
    private BigDecimal ty_le_pct;

    @JsonProperty("so_tien")
    private BigDecimal so_tien;

    @JsonProperty("ghi_chu")
    private String ghi_chu;

    @JsonProperty("tao_luc")
    private Instant tao_luc;

    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getKy_luong_id() { return ky_luong_id; }
    public void setKy_luong_id(Long ky_luong_id) { this.ky_luong_id = ky_luong_id; }

    public Long getChi_nhanh_id() { return chi_nhanh_id; }
    public void setChi_nhanh_id(Long chi_nhanh_id) { this.chi_nhanh_id = chi_nhanh_id; }

    public Long getNhan_vien_id() { return nhan_vien_id; }
    public void setNhan_vien_id(Long nhan_vien_id) { this.nhan_vien_id = nhan_vien_id; }

    public Long getHoc_vien_id() { return hoc_vien_id; }
    public void setHoc_vien_id(Long hoc_vien_id) { this.hoc_vien_id = hoc_vien_id; }

    public Long getDang_ky_id() { return dang_ky_id; }
    public void setDang_ky_id(Long dang_ky_id) { this.dang_ky_id = dang_ky_id; }

    public Long getKhoa_hoc_mau_id() { return khoa_hoc_mau_id; }
    public void setKhoa_hoc_mau_id(Long khoa_hoc_mau_id) { this.khoa_hoc_mau_id = khoa_hoc_mau_id; }

    public BigDecimal getHoc_phi_ap_dung() { return hoc_phi_ap_dung; }
    public void setHoc_phi_ap_dung(BigDecimal hoc_phi_ap_dung) { this.hoc_phi_ap_dung = hoc_phi_ap_dung; }

    public BigDecimal getTy_le_pct() { return ty_le_pct; }
    public void setTy_le_pct(BigDecimal ty_le_pct) { this.ty_le_pct = ty_le_pct; }

    public BigDecimal getSo_tien() { return so_tien; }
    public void setSo_tien(BigDecimal so_tien) { this.so_tien = so_tien; }

    public String getGhi_chu() { return ghi_chu; }
    public void setGhi_chu(String ghi_chu) { this.ghi_chu = ghi_chu; }

    public Instant getTao_luc() { return tao_luc; }
    public void setTao_luc(Instant tao_luc) { this.tao_luc = tao_luc; }
}

