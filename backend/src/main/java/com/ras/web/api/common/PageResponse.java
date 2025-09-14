package com.ras.web.api.common;

import lombok.*;
import java.util.*;

@Getter @Setter @AllArgsConstructor @NoArgsConstructor @Builder
public class PageResponse<T> {
  private List<T> items;
  private int page;
  private int size;
  private long totalElements;
  private int totalPages;

  public static <T> PageResponse<T> of(org.springframework.data.domain.Page<T> p) {
    return PageResponse.<T>builder()
        .items(p.getContent())
        .page(p.getNumber())
        .size(p.getSize())
        .totalElements(p.getTotalElements())
        .totalPages(p.getTotalPages())
        .build();
  }
}
