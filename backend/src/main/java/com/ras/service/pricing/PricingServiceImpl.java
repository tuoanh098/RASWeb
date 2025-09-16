package com.ras.service.pricing;
import com.ras.domain.course.BangGiaHocPhiMuc;
import com.ras.domain.course.BangGiaHocPhiMucRepository;
import com.ras.domain.course.KhoaHocMauRepository; // Bạn đã có sẵn repo này

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PricingServiceImpl implements PricingService {

    private final BangGiaHocPhiMucRepository mucRepo;
    private final KhoaHocMauRepository khoaHocMauRepo;

    @Override
    @Transactional(readOnly = true)
    public TuitionResponse resolveTuition(Long chiNhanhId,
                                          Long khoaHocId,
                                          Long khoaHocMauId,
                                          LocalDate ngay) {

        if (chiNhanhId == null) {
            return TuitionResponse.zero("missing_chi_nhanh_id");
        }

        // Nếu FE chỉ gửi template -> map sang course id
        Long khId = khoaHocId;
        if (khId == null && khoaHocMauId != null) {
            try {
                khId = khoaHocMauRepo.findKhoaHocIdByTemplateId(khoaHocMauId);
            } catch (Exception ignore) {
                // Nếu repo bạn đặt tên hàm khác, chỉ cần đổi chỗ này cho khớp
            }
        }
        if (khId == null) {
            return TuitionResponse.zero("missing_khoa_hoc_id");
        }

        // Lấy mức giá mới nhất theo chi nhánh + khóa học
        Optional<BangGiaHocPhiMuc> opt =
                mucRepo.findTopByChiNhanhIdAndKhoaHocIdOrderByIdDesc(chiNhanhId, khId);

        if (opt.isEmpty()) {
            return TuitionResponse.zero("not_found_in_bang_gia");
        }

        BangGiaHocPhiMuc muc = opt.get();

        // Ưu tiên các cột:
        // 1) hoc_phi_khoa
        // 2) (hoc_phi_buoi_tinh nếu có, ngược lại hoc_phi_buoi) * so_buoi_khoa
        BigDecimal hocPhi = null;
        String source = null;

        if (isPositive(muc.getHocPhiKhoa())) {
            hocPhi = muc.getHocPhiKhoa();
            source = "hoc_phi_khoa";
        } else {
            BigDecimal perSession = isPositive(muc.getHocPhiBuoiTinh())
                    ? muc.getHocPhiBuoiTinh()
                    : muc.getHocPhiBuoi();

            if (isPositive(perSession) && muc.getSoBuoiKhoa() != null && muc.getSoBuoiKhoa() > 0) {
                hocPhi = perSession.multiply(BigDecimal.valueOf(muc.getSoBuoiKhoa()));
                source = (muc.getHocPhiBuoiTinh() != null ? "hoc_phi_buoi_tinh" : "hoc_phi_buoi") + "_x_so_buoi";
            }
        }

        if (hocPhi == null || hocPhi.signum() <= 0) {
            return TuitionResponse.zero("no_price_columns");
        }

        return new TuitionResponse(
                chiNhanhId,
                khId,
                muc.getSoBuoiKhoa(),
                hocPhi,
                source
        );
    }

    private boolean isPositive(BigDecimal v) {
        return v != null && v.signum() > 0;
    }
}
