package com.ras.service.payroll.dto;


import lombok.Data;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;

@Data
public class BangLuongRow {
    private Long id;
    private Long ky_luong_id;
    private Long nhan_vien_id;
    private BigDecimal luong_cung;
    private BigDecimal tong_hoa_hong;
    private BigDecimal tong_thuong;
    private BigDecimal tong_truc;
    private BigDecimal tong_phu_cap_khac;
    private BigDecimal tong_phat;
    private BigDecimal tong_luong;

    public static BangLuongRow from(ResultSet rs) throws SQLException {
        BangLuongRow r = new BangLuongRow();
        r.setId(rs.getLong(1));
        r.setKy_luong_id(rs.getLong(2));
        r.setNhan_vien_id(rs.getLong(3));
        r.setLuong_cung(rs.getBigDecimal(4));
        r.setTong_hoa_hong(rs.getBigDecimal(5));
        r.setTong_thuong(rs.getBigDecimal(6));
        r.setTong_truc(rs.getBigDecimal(7));
        r.setTong_phu_cap_khac(rs.getBigDecimal(8));
        r.setTong_phat(rs.getBigDecimal(9));
        r.setTong_luong(rs.getBigDecimal(10));
        return r;
    }
}

