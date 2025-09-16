// src/main/java/com/ras/service/duty/NvLichTrucMapper.java
package com.ras.service.duty;

import com.ras.domain.duty.NvLichTruc;
import com.ras.service.duty.dto.NvLichTrucCreateDto;
import com.ras.service.duty.dto.NvLichTrucDto;
import com.ras.service.duty.dto.NvLichTrucUpdateDto;

public final class NvLichTrucMapper {

  private NvLichTrucMapper() {}

  public static NvLichTrucDto toDto(NvLichTruc e) {
    NvLichTrucDto d = new NvLichTrucDto();
    d.setId(e.getId());
    d.setNhan_vien_id(e.getNhanVienId());
    d.setNhan_vien_ten(e.getNhanVienTen());
    d.setChi_nhanh_id(e.getChiNhanhId());
    d.setChi_nhanh_ten(e.getChiNhanhTen());
    d.setNgay(e.getNgay());
    d.setGhi_chu(e.getGhiChu());
    d.setTao_luc(e.getTaoLuc());
    d.setCap_nhat_luc(e.getCapNhatLuc());
    return d;
  }

  public static NvLichTruc fromCreate(NvLichTrucCreateDto d) {
    NvLichTruc e = new NvLichTruc();
    e.setNhanVienId(d.getNhan_vien_id());
    e.setNhanVienTen(d.getNhan_vien_ten());
    e.setChiNhanhId(d.getChi_nhanh_id());
    e.setChiNhanhTen(d.getChi_nhanh_ten());
    e.setNgay(d.getNgay());
    e.setGhiChu(d.getGhi_chu());
    return e;
  }

  public static void applyUpdate(NvLichTruc e, NvLichTrucUpdateDto d) {
    if (d.getNhan_vien_id() != null) e.setNhanVienId(d.getNhan_vien_id());
    if (d.getNhan_vien_ten() != null) e.setNhanVienTen(d.getNhan_vien_ten());
    if (d.getChi_nhanh_id() != null) e.setChiNhanhId(d.getChi_nhanh_id());
    if (d.getChi_nhanh_ten() != null) e.setChiNhanhTen(d.getChi_nhanh_ten());
    if (d.getNgay() != null) e.setNgay(d.getNgay());
    if (d.getGhi_chu() != null) e.setGhiChu(d.getGhi_chu());
  }
}
