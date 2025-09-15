package com.ras.service.salary;

import com.ras.domain.salary.*;
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
    private final NvThuongBacRepository thuongBacRepo;
    private final NvThuongKhacRepository thuongKhacRepo;
    private final NvTrucRepository trucRepo;
    private final NvPhuCapKhacRepository phuCapKhacRepo;
    private final NvPhatKyLuatRepository phatRepo;

    // ---- Tổng quan ----
    @Override
    @Transactional(readOnly = true)
    public List<NvBangLuongThang> getBangLuongThang(Long kyLuongId) {
        return bangLuongRepo.findByKyLuong(kyLuongId);
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal getTongLuongThang(Long kyLuongId) {
        return bangLuongRepo.sumTongLuongByKyLuongBD(kyLuongId);
    }

    // ---- Hoa hồng ----
    @Override
    @Transactional(readOnly = true)
    public List<NvHoaHongChotLop> getHoaHongChiTiet(Long kyLuongId, Long nhanVienId) {
        return hoaHongRepo.findByKyLuongIdAndNhanVienId(kyLuongId, nhanVienId);
    }

    @Override
    @Transactional
    public NvHoaHongChotLop saveHoaHong(NvHoaHongChotLop hoaHong) {
        NvHoaHongChotLop saved = hoaHongRepo.save(hoaHong);
        recomputeBangLuong(hoaHong.getKyLuongId(), hoaHong.getNhanVienId());
        return saved;
    }

    @Override
    @Transactional
    public void deleteHoaHong(Long id, Long kyLuongId, Long nhanVienId) {
        hoaHongRepo.deleteById(id);
        recomputeBangLuong(kyLuongId, nhanVienId);
    }

    // ---- Thưởng bậc ----
    @Override
    @Transactional(readOnly = true)
    public List<NvThuongBac> getThuongBac(Long kyLuongId, Long nhanVienId) {
        return thuongBacRepo.findByKyLuongIdAndNhanVienId(kyLuongId, nhanVienId);
    }

    @Override
    @Transactional
    public NvThuongBac saveThuongBac(NvThuongBac thuongBac) {
        NvThuongBac saved = thuongBacRepo.save(thuongBac);
        recomputeBangLuong(thuongBac.getKyLuongId(), thuongBac.getNhanVienId());
        return saved;
    }

    @Override
    @Transactional
    public void deleteThuongBac(Long id, Long kyLuongId, Long nhanVienId) {
        thuongBacRepo.deleteById(id);
        recomputeBangLuong(kyLuongId, nhanVienId);
    }

    // ---- Thưởng khác ----
    @Override
    @Transactional(readOnly = true)
    public List<NvThuongKhac> getThuongKhac(Long kyLuongId, Long nhanVienId) {
        return thuongKhacRepo.findByKyLuongIdAndNhanVienId(kyLuongId, nhanVienId);
    }

    @Override
    @Transactional
    public NvThuongKhac saveThuongKhac(NvThuongKhac thuongKhac) {
        NvThuongKhac saved = thuongKhacRepo.save(thuongKhac);
        recomputeBangLuong(thuongKhac.getKyLuongId(), thuongKhac.getNhanVienId());
        return saved;
    }

    @Override
    @Transactional
    public void deleteThuongKhac(Long id, Long kyLuongId, Long nhanVienId) {
        thuongKhacRepo.deleteById(id);
        recomputeBangLuong(kyLuongId, nhanVienId);
    }

    // ---- Trực ----
    @Override
    @Transactional(readOnly = true)
    public List<NvTruc> getTruc(Long kyLuongId, Long nhanVienId) {
        return trucRepo.findByKyLuongIdAndNhanVienId(kyLuongId, nhanVienId);
    }

    @Override
    @Transactional
    public NvTruc saveTruc(NvTruc truc) {
        NvTruc saved = trucRepo.save(truc);
        recomputeBangLuong(truc.getKyLuongId(), truc.getNhanVienId());
        return saved;
    }

    @Override
    @Transactional
    public void deleteTruc(Long id, Long kyLuongId, Long nhanVienId) {
        trucRepo.deleteById(id);
        recomputeBangLuong(kyLuongId, nhanVienId);
    }

    // ---- Phụ cấp khác ----
    @Override
    @Transactional(readOnly = true)
    public List<NvPhuCapKhac> getPhuCapKhac(Long kyLuongId, Long nhanVienId) {
        return phuCapKhacRepo.findByKyLuongIdAndNhanVienId(kyLuongId, nhanVienId);
    }

    @Override
    @Transactional
    public NvPhuCapKhac savePhuCapKhac(NvPhuCapKhac pc) {
        NvPhuCapKhac saved = phuCapKhacRepo.save(pc);
        recomputeBangLuong(pc.getKyLuongId(), pc.getNhanVienId());
        return saved;
    }

    @Override
    @Transactional
    public void deletePhuCapKhac(Long id, Long kyLuongId, Long nhanVienId) {
        phuCapKhacRepo.deleteById(id);
        recomputeBangLuong(kyLuongId, nhanVienId);
    }

    // ---- Phạt / kỷ luật ----
    @Override
    @Transactional(readOnly = true)
    public List<NvPhatKyLuat> getPhat(Long kyLuongId, Long nhanVienId) {
        return phatRepo.findByKyLuongIdAndNhanVienId(kyLuongId, nhanVienId);
    }

    @Override
    @Transactional
    public NvPhatKyLuat savePhat(NvPhatKyLuat phat) {
        NvPhatKyLuat saved = phatRepo.save(phat);
        recomputeBangLuong(phat.getKyLuongId(), phat.getNhanVienId());
        return saved;
    }

    @Override
    @Transactional
    public void deletePhat(Long id, Long kyLuongId, Long nhanVienId) {
        phatRepo.deleteById(id);
        recomputeBangLuong(kyLuongId, nhanVienId);
    }

    // ---- Recompute ----
    @Override
    @Transactional
    public NvBangLuongThang recomputeBangLuong(Long kyLuongId, Long nhanVienId) {
        BigDecimal tongHoaHong = hoaHongRepo.findByKyLuongIdAndNhanVienId(kyLuongId, nhanVienId).stream()
                .map(NvHoaHongChotLop::getSoTien).reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal tongThuongBac  = thuongBacRepo.sumThuongByKyAndNv(kyLuongId, nhanVienId);
        BigDecimal tongThuongKhac = thuongKhacRepo.sumThuongByKyAndNv(kyLuongId, nhanVienId);
        BigDecimal tongTruc       = trucRepo.sumSoTienByKyAndNv(kyLuongId, nhanVienId);
        BigDecimal tongPhuCapKhac = phuCapKhacRepo.sumSoTienByKyAndNv(kyLuongId, nhanVienId);
        BigDecimal tongPhat       = phatRepo.sumPhatByKyAndNv(kyLuongId, nhanVienId);

        NvBangLuongThang bl = bangLuongRepo.findOneByKyAndNv(kyLuongId, nhanVienId)
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy nv_bang_luong_thang (ky=" + kyLuongId + ", nv=" + nhanVienId + ")"));

        bl.setTongHoaHong(tongHoaHong);
        bl.setTongThuong(SalaryService.nz(tongThuongBac).add(SalaryService.nz(tongThuongKhac)));
        bl.setTongTruc(SalaryService.nz(tongTruc));
        bl.setTongPhuCapKhac(SalaryService.nz(tongPhuCapKhac));
        bl.setTongPhat(SalaryService.nz(tongPhat));

        BigDecimal tongLuong = SalaryService.nz(bl.getLuongCung())
                .add(SalaryService.nz(bl.getTongHoaHong()))
                .add(SalaryService.nz(bl.getTongThuong()))
                .add(SalaryService.nz(bl.getTongTruc()))
                .add(SalaryService.nz(bl.getTongPhuCapKhac()))
                .subtract(SalaryService.nz(bl.getTongPhat()));

        bl.setTongLuong(tongLuong);
        return bangLuongRepo.save(bl);
    }
}
