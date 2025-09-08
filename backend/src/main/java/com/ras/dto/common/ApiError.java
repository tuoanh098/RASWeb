package com.ras.dto.common;

public class ApiError {
  public int index;
  public String field;
  public String message;
  public ApiError() {}
  public ApiError(int i, String f, String m){ this.index=i; this.field=f; this.message=m; }
}
