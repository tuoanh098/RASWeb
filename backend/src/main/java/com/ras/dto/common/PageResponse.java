package com.ras.dto.common;

public class PageResponse<T> {
  private java.util.List<T> items;
  private long totalElements;
  private int page;
  private int size;
  private int totalPages;
  public PageResponse(){}
  public PageResponse(java.util.List<T> items, long totalElements, int page, int size, int totalPages) {
    this.items = items; this.totalElements = totalElements; this.page = page; this.size = size; this.totalPages = totalPages;
  }
  public java.util.List<T> getItems() { return items; }
  public void setItems(java.util.List<T> items) { this.items = items; }
  public long getTotalElements() { return totalElements; }
  public void setTotalElements(long totalElements) { this.totalElements = totalElements; }
  public int getPage() { return page; }
  public void setPage(int page) { this.page = page; }
  public int getSize() { return size; }
  public void setSize(int size) { this.size = size; }
  public int getTotalPages() { return totalPages; }
  public void setTotalPages(int totalPages) { this.totalPages = totalPages; }
  
}
