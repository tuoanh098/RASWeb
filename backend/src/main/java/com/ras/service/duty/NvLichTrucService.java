// src/main/java/com/ras/service/duty/NvLichTrucService.java
package com.ras.service.duty;

import com.ras.service.duty.dto.NvLichTrucCreateDto;
import com.ras.service.duty.dto.NvLichTrucDto;
import com.ras.service.duty.dto.NvLichTrucUpdateDto;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.util.Optional;

public interface NvLichTrucService {
  NvLichTrucDto create(NvLichTrucCreateDto req);
  NvLichTrucDto update(Long id, NvLichTrucUpdateDto req);
  void delete(Long id);
  Optional<NvLichTrucDto> get(Long id);

  Page<NvLichTrucDto> search(
      Integer page, Integer size,
      Long nhanVienId, Long chiNhanhId,
      LocalDate from, LocalDate to,
      String q // tìm fuzzy theo tên NV/chi nhánh
  );
}
