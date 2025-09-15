package com.ras.service.course.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class AssignClassDTO {
    private Long lopHocId;     // gán vào lớp có sẵn
    private Long giaoVienId;   // hoặc gán GV trực tiếp (nếu chưa có lớp)

    // getters/setters
    public Long getLopHocId() { return lopHocId; }
    public void setLopHocId(Long lopHocId) { this.lopHocId = lopHocId; }
    public Long getGiaoVienId() { return giaoVienId; }
    public void setGiaoVienId(Long giaoVienId) { this.giaoVienId = giaoVienId; }
}
