package com.ras.service.salary;

import java.util.List;

import com.ras.domain.salary.NvBangLuongThang;
import com.ras.domain.salary.NvHoaHongChotLop;

public interface SalaryService {
    List<NvBangLuongThang> getBangLuongThang(Long kyLuongId);
    Double getTongLuongThang(Long kyLuongId);

    List<NvHoaHongChotLop> getHoaHongChiTiet(Long kyLuongId, Long nhanVienId);
    NvHoaHongChotLop saveHoaHong(NvHoaHongChotLop hoaHong);
}
