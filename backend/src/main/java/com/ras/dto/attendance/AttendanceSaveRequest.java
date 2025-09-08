package com.ras.dto.attendance;

import java.time.LocalDate;
import java.util.List;

public class AttendanceSaveRequest {
  public String type; 
  public LocalDate weekStart; 
  public List<Item> items;

  public static class Item {
    public Long id;
    public List<String> codes;
  }
}
