package com.ras.dto.common;

public class ApiResponse<T> {
  private boolean success;
  private String message;
  private T data;

  public ApiResponse() {}
  public ApiResponse(boolean success, String message, T data) {
    this.success = success; this.message = message; this.data = data;
  }

  public static <T> ApiResponse<T> ok(T data){ return new ApiResponse<>(true, "OK", data); }
  public static <T> ApiResponse<T> error(String message){ return new ApiResponse<>(false, message, null); }

  public boolean isSuccess() { return success; }
  public void setSuccess(boolean success) { this.success = success; }
  public String getMessage() { return message; }
  public void setMessage(String message) { this.message = message; }
  public T getData() { return data; }
  public void setData(T data) { this.data = data; }
}
