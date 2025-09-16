package com.ras.service.pricing;
import java.time.LocalDate;

/** Nghiệp vụ lấy học phí theo chi nhánh + khóa học (hoặc theo khóa học mẫu). */
public interface PricingService {

    /**
     * Nếu chỉ có khoaHocMauId, service sẽ tự ánh xạ sang khoaHocId (dùng KhoaHocMauRepository).
     * Trả về 0 khi không tìm thấy.
     */
    TuitionResponse resolveTuition(Long chiNhanhId,
                                   Long khoaHocId,
                                   Long khoaHocMauId,
                                   LocalDate ngay);
}
