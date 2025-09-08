package com.ras.dto.attendance;

import java.util.List;

public class AttendanceRowDto {
  private Long id;         // id GV/HS
  private String name;     // tên hiển thị
  private List<String> codes; // 7 phần tử ứng với thứ 2..CN

  public AttendanceRowDto() {}
  public AttendanceRowDto(Long id, String name, List<String> codes) {
    this.id = id; this.name = name; this.codes = codes;
  }

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public List<String> getCodes() { return codes; }
  public void setCodes(List<String> codes) { this.codes = codes; }
}
