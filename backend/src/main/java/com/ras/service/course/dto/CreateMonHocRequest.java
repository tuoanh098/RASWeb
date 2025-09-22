package com.ras.service.course.dto;

import jakarta.validation.constraints.*;

public class CreateMonHocRequest {
    @NotBlank @Size(max=50)  public String ma_mon;
    @NotBlank @Size(max=200) public String ten_mon;
}
