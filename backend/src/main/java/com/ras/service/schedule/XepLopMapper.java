package com.ras.service.schedule;

import com.ras.domain.schedule.XepLopHoc;
import com.ras.service.schedule.dto.*;

public class XepLopMapper {
  public static XepLopHoc toEntity(XepLopCreateDto d){
    XepLopHoc x = new XepLopHoc();
    x.setKhoaHocId(d.khoa_hoc_id);
    x.setKhoaHocTen(d.khoa_hoc_ten);
    x.setHocVienId(d.hoc_vien_id);
    x.setHocVienTen(d.hoc_vien_ten);
    x.setGiaoVienId(d.giao_vien_id);
    x.setGiaoVienTen(d.giao_vien_ten);
    x.setChiNhanhId(d.chi_nhanh_id);
    x.setChiNhanhTen(d.chi_nhanh_ten);
    x.setSoBuoiDuKien(d.so_buoi_du_kien);
    x.setSoBuoiDaHoc(d.so_buoi_da_hoc == null ? 0 : d.so_buoi_da_hoc);
    x.setNgay(d.ngay);
    x.setBatDauLuc(d.bat_dau_luc);
    x.setKetThucLuc(d.ket_thuc_luc);
    x.setCoDinhGroupId(d.co_dinh_group_id);
    if (d.trang_thai_buoi != null) {
      x.setTrangThaiBuoi(XepLopHoc.TrangThaiBuoi.valueOf(d.trang_thai_buoi));
    }
    x.setGhiChu(d.ghi_chu);
    return x;
  }

  public static XepLopDto toDto(XepLopHoc x){
    XepLopDto d = new XepLopDto();
    d.id = x.getId();
    d.khoa_hoc_id  = x.getKhoaHocId();
    d.khoa_hoc_ten = x.getKhoaHocTen();
    d.hoc_vien_id  = x.getHocVienId();
    d.hoc_vien_ten = x.getHocVienTen();
    d.giao_vien_id  = x.getGiaoVienId();
    d.giao_vien_ten = x.getGiaoVienTen();
    d.chi_nhanh_id  = x.getChiNhanhId();
    d.chi_nhanh_ten = x.getChiNhanhTen();
    d.so_buoi_du_kien = x.getSoBuoiDuKien();
    d.so_buoi_da_hoc  = x.getSoBuoiDaHoc();
    d.ngay = x.getNgay();
    d.bat_dau_luc = x.getBatDauLuc();
    d.ket_thuc_luc = x.getKetThucLuc();
    d.thoi_luong_phut = x.getThoiLuongPhut();
    d.co_dinh_group_id = x.getCoDinhGroupId();
    d.trang_thai_buoi = x.getTrangThaiBuoi().name();
    d.ghi_chu = x.getGhiChu();
    return d;
  }
}
