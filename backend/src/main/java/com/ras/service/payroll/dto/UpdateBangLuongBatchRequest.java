package com.ras.service.payroll.dto;

import java.math.BigDecimal;
import java.util.List;

public record UpdateBangLuongBatchRequest(List<Item> items) {
    public record Item(
            Long id,
            BigDecimal luongCung,
            BigDecimal tongThuong,
            BigDecimal tongTruc,
            BigDecimal tongPhuCapKhac,
            BigDecimal tongPhat,
            String ghiChu,
            Boolean overrideHoaHong,
            BigDecimal tongHoaHongOverride
    ) {}
}