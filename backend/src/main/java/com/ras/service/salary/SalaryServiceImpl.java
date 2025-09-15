package com.ras.service.salary;

import com.ras.domain.salary.NvBangLuongThang;
import com.ras.domain.salary.NvHoaHongChotLop;
import com.ras.domain.salary.NvBangLuongThangRepository;
import com.ras.domain.salary.NvHoaHongChotLopRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SalaryServiceImpl implements SalaryService {

    private final NvBangLuongThangRepository bangLuongRepo;
    private final NvHoaHongChotLopRepository hoaHongRepo;

    @Override
    public List<NvBangLuongThang> getBangLuongThang(Long kyLuongId) {
        return bangLuongRepo.findByKyLuong(kyLuongId);
    }

    @Override
    public Double getTongLuongThang(Long kyLuongId) {
        return bangLuongRepo.sumTongLuongByKyLuong(kyLuongId);
    }

    @Override
    public List<NvHoaHongChotLop> getHoaHongChiTiet(Long kyLuongId, Long nhanVienId) {
        return hoaHongRepo.findByKyLuongIdAndNhanVienId(kyLuongId, nhanVienId);
    }

    @Override
    @Transactional
    public NvHoaHongChotLop saveHoaHong(NvHoaHongChotLop hoaHong) {
        NvHoaHongChotLop saved = hoaHongRepo.save(hoaHong);
        // Sau khi lưu hoa hồng → cập nhật lại tổng hoa hồng và tổng lương trong nv_bang_luong_thang
        Long kyId = hoaHong.getKyLuongId();
        Long nvId = hoaHong.getNhanVienId();
        List<NvHoaHongChotLop> ds = hoaHongRepo.findByKyLuongIdAndNhanVienId(kyId, nvId);

        BigDecimal tong = ds.stream()
                .map(NvHoaHongChotLop::getSoTien)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        NvBangLuongThang bl = bangLuongRepo.findByKyLuong(kyId).stream()
                .filter(b -> b.getNhanVienId().equals(nvId))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy bảng lương tháng"));

        bl.setTongHoaHong(tong);
        bl.setTongLuong(
                (bl.getLuongCung() == null ? BigDecimal.ZERO : bl.getLuongCung())
                        .add(tong)
                        .add(bl.getTongThuong() == null ? BigDecimal.ZERO : bl.getTongThuong())
                        .subtract(bl.getTongPhat() == null ? BigDecimal.ZERO : bl.getTongPhat())
        );
        bangLuongRepo.save(bl);

        return saved;
    }
}
