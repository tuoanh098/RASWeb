// src/main/java/com/ras/service/duty/NvLichTrucServiceImpl.java
package com.ras.service.duty;

import com.ras.domain.duty.NvLichTruc;
import com.ras.domain.duty.NvLichTrucRepository;
import com.ras.service.duty.dto.NvLichTrucCreateDto;
import com.ras.service.duty.dto.NvLichTrucDto;
import com.ras.service.duty.dto.NvLichTrucUpdateDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import jakarta.persistence.criteria.Predicate;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NvLichTrucServiceImpl implements NvLichTrucService {

  private final NvLichTrucRepository repo;

  @Override
  public NvLichTrucDto create(NvLichTrucCreateDto req) {
    if (req.getNhan_vien_id() == null || req.getChi_nhanh_id() == null || req.getNgay() == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thiếu nhan_vien_id/chi_nhanh_id/ngay");
    }
    // chặn trùng ca trực trong ngày theo unique
    if (repo.existsByNhanVienIdAndNgayAndChiNhanhId(req.getNhan_vien_id(), req.getNgay(), req.getChi_nhanh_id())) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Đã tồn tại lịch trực trùng nhân viên/chi nhánh/ngày");
    }
    NvLichTruc e = NvLichTrucMapper.fromCreate(req);
    e = repo.save(e);
    return NvLichTrucMapper.toDto(e);
  }

  @Override
  public NvLichTrucDto update(Long id, NvLichTrucUpdateDto req) {
    NvLichTruc e = repo.findById(id).orElseThrow(() ->
        new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy lịch trực #" + id));
    // nếu đổi sang tổ hợp (nv,cn,ngày) khác -> check trùng
    Long nvId = req.getNhan_vien_id() != null ? req.getNhan_vien_id() : e.getNhanVienId();
    Long cnId = req.getChi_nhanh_id() != null ? req.getChi_nhanh_id() : e.getChiNhanhId();
    LocalDate ngay = req.getNgay() != null ? req.getNgay() : e.getNgay();
    boolean dup = repo.existsByNhanVienIdAndNgayAndChiNhanhId(nvId, ngay, cnId) &&
                  !(e.getNhanVienId().equals(nvId) && e.getChiNhanhId().equals(cnId) && e.getNgay().equals(ngay));
    if (dup) throw new ResponseStatusException(HttpStatus.CONFLICT, "Trùng lịch trực");

    NvLichTrucMapper.applyUpdate(e, req);
    e = repo.save(e);
    return NvLichTrucMapper.toDto(e);
  }

  @Override
  public void delete(Long id) {
    if (!repo.existsById(id)) return;
    repo.deleteById(id);
  }

  @Override
  public Optional<NvLichTrucDto> get(Long id) {
    return repo.findById(id).map(NvLichTrucMapper::toDto);
  }

  @Override
  public Page<NvLichTrucDto> search(Integer page, Integer size, Long nhanVienId, Long chiNhanhId, LocalDate from, LocalDate to, String q) {
    int p = page == null || page < 0 ? 0 : page;
    int s = size == null || size <= 0 ? 20 : Math.min(size, 200);
    Pageable pageable = PageRequest.of(p, s, Sort.by(Sort.Direction.DESC, "ngay", "id"));

    Specification<NvLichTruc> spec = (root, query, cb) -> {
      ArrayList<Predicate> preds = new ArrayList<>();
      if (nhanVienId != null) preds.add(cb.equal(root.get("nhanVienId"), nhanVienId));
      if (chiNhanhId != null) preds.add(cb.equal(root.get("chiNhanhId"), chiNhanhId));
      if (from != null) preds.add(cb.greaterThanOrEqualTo(root.get("ngay"), from));
      if (to != null) preds.add(cb.lessThanOrEqualTo(root.get("ngay"), to));
      if (q != null && !q.isBlank()) {
        String like = "%" + q.trim().toLowerCase() + "%";
        preds.add(cb.or(
          cb.like(cb.lower(root.get("nhanVienTen")), like),
          cb.like(cb.lower(root.get("chiNhanhTen")), like)
        ));
      }
      return cb.and(preds.toArray(new Predicate[0]));
    };

    Page<NvLichTruc> pg = repo.findAll(spec, pageable);
    return new PageImpl<>(
      pg.getContent().stream().map(NvLichTrucMapper::toDto).collect(Collectors.toList()),
      pageable,
      pg.getTotalElements()
    );
  }
}
