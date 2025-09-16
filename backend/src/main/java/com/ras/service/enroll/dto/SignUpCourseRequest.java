package com.ras.service.enroll.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class SignUpCourseRequest {

    private Long hocVienId;
    private Long lopId;
    private Long nvTuVanId;

    /** Học phí áp dụng (VND) – dùng để tính 2% hoa hồng */
    private BigDecimal hocPhiApDung;

    /** Ghi chú tuỳ chọn */
    private String ghiChu;

    /** Tháng lương để ghi hoa hồng, format YYYY-MM. Nếu null -> lấy theo ngày đăng ký */
    private String kyLuongThang; // Example: "2025-09"
}