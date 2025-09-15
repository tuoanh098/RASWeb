package com.ras.service.salary;

import com.ras.domain.salary.NvBangLuongThang;
import com.ras.domain.salary.NvHoaHongChotLop;
import com.ras.service.salary.dto.HoaHongDTO;
import com.ras.service.salary.dto.SalaryRowDTO;

public final class SalaryMappers {
    private SalaryMappers(){}

    // nv_bang_luong_thang → DTO
    public static SalaryRowDTO toSalaryRowDTO(NvBangLuongThang e) {
        SalaryRowDTO d = new SalaryRowDTO();
        d.setId(e.getId());
        d.setKy_luong_id(e.getKyLuongId());
        d.setNhan_vien_id(e.getNhanVienId());
        d.setLuong_cung(e.getLuongCung());
        d.setTong_hoa_hong(e.getTongHoaHong());
        d.setTong_thuong(e.getTongThuong());
        d.setTong_truc(e.getTongTruc());
        d.setTong_phu_cap_khac(e.getTongPhuCapKhac());
        d.setTong_phat(e.getTongPhat());
        d.setTong_luong(e.getTongLuong());
        d.setGhi_chu(e.getGhiChu());
        d.setTao_luc(e.getTaoLuc());
        return d;
    }

    // nv_hoa_hong_chot_lop → DTO
    public static HoaHongDTO toHoaHongDTO(NvHoaHongChotLop e) {
        HoaHongDTO d = new HoaHongDTO();
        d.setId(e.getId());
        d.setKy_luong_id(e.getKyLuongId());
        d.setChi_nhanh_id(e.getChiNhanhId());
        d.setNhan_vien_id(e.getNhanVienId());
        d.setHoc_vien_id(e.getHocVienId());
        d.setDang_ky_id(e.getDangKyId());
        d.setKhoa_hoc_mau_id(e.getKhoaHocMauId());
        d.setHoc_phi_ap_dung(e.getHocPhiApDung());
        d.setTy_le_pct(e.getTyLePct());
        d.setSo_tien(e.getSoTien());
        d.setGhi_chu(e.getGhiChu());
        d.setTao_luc(e.getTaoLuc());
        return d;
    }

    // DTO → entity (upsert)
    public static NvHoaHongChotLop toHoaHongEntity(HoaHongDTO d) {
        NvHoaHongChotLop e = new NvHoaHongChotLop();
        e.setId(d.getId());
        e.setKyLuongId(d.getKy_luong_id());
        e.setChiNhanhId(d.getChi_nhanh_id());
        e.setNhanVienId(d.getNhan_vien_id());
        e.setHocVienId(d.getHoc_vien_id());
        e.setDangKyId(d.getDang_ky_id());
        e.setKhoaHocMauId(d.getKhoa_hoc_mau_id());
        e.setHocPhiApDung(d.getHoc_phi_ap_dung());
        e.setTyLePct(d.getTy_le_pct());
        e.setSoTien(d.getSo_tien());
        e.setGhiChu(d.getGhi_chu());
        // tao_luc do DB tự set
        return e;
    }
}

