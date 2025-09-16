package com.ras.service.course.dto;

import com.ras.domain.course.LoaiLop;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CourseTemplateDTO {
    private Long id;
    private Long monHocId;
    private LoaiLop loaiLop;
    private Short thoiLuongPhut;
    private Long  khoaHocId;     // mapping sang course “thực”
    private String ten;          // hiển thị (dùng moTa)
}
