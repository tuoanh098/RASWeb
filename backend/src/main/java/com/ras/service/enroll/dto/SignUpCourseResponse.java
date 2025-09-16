package com.ras.service.enroll.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SignUpCourseResponse {

    private Long dangKyId;
    private Long kyLuongId;
    private Long hoaHongId;
}