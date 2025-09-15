package com.ras.service.course.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class MonthlySignUpStatDTO {
    private int year;
    private int month;
    private long total;

    public MonthlySignUpStatDTO() {}
    public MonthlySignUpStatDTO(int year, int month, long total) {
        this.year = year; this.month = month; this.total = total;
    }

    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }
    public int getMonth() { return month; }
    public void setMonth(int month) { this.month = month; }
    public long getTotal() { return total; }
    public void setTotal(long total) { this.total = total; }
}
