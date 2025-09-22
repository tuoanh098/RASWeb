package com.ras.web.api.course;

import com.ras.domain.course.KhoaHoc;
import com.ras.service.course.KhoaHocService;
import com.ras.service.course.dto.KhoaHocCreateRequest;
import com.ras.service.course.dto.KhoaHocDto;
import com.ras.service.course.dto.KhoaHocUpdateRequest;
import com.ras.web.api.common.PageResponse;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class KhoaHocController {

    private final KhoaHocService service;

    public KhoaHocController(KhoaHocService service) { this.service = service; }

    private static KhoaHocDto toDto(KhoaHoc e){
        KhoaHocDto d = new KhoaHocDto();
        d.id = e.getId();
        d.mon_hoc_id = e.getMonHoc() != null ? e.getMonHoc().getId() : null;
        if (e.getMonHoc() != null) {
            d.mon_hoc_ma  = e.getMonHoc().getMaMon();
            d.mon_hoc_ten = e.getMonHoc().getTenMon();
        }
        d.loai_lop = e.getLoaiLop().name();
        d.thoi_luong_phut = e.getThoiLuongPhut();
        d.ma = e.getMa();
        d.ten_hien_thi = e.getTenHienThi();
        return d;
    }

    @GetMapping
    public PageResponse<KhoaHocDto> list(
            @RequestParam(name="q", required=false) String q,
            @RequestParam(name="mon_hoc_id", required=false) Long monHocId,
            @RequestParam(name="loai_lop", required=false) String loaiLop,
            @RequestParam(name="page", defaultValue="0") int page,
            @RequestParam(name="size", defaultValue="10") int size,
            @RequestParam(name="sort", required=false) String sort
    ){
        var result = service.search(q, monHocId, loaiLop, page, size, sort);
        List<KhoaHocDto> items = result.items().stream().map(KhoaHocController::toDto).toList();
        return new PageResponse<>(items, result.page(), result.size(), result.totalElements(), result.totalPages());
    }

    @GetMapping("/{id}")
    public KhoaHocDto get(@PathVariable Long id){ return toDto(service.getById(id)); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public KhoaHocDto create(@RequestBody KhoaHocCreateRequest body){
        var e = service.create(body.mon_hoc_id, body.loai_lop, body.thoi_luong_phut, body.ma, body.ten_hien_thi);
        return toDto(e);
    }

    @PutMapping("/{id}")
    public KhoaHocDto update(@PathVariable Long id, @RequestBody KhoaHocUpdateRequest body){
        var e = service.update(id, body.mon_hoc_id, body.loai_lop, body.thoi_luong_phut, body.ma, body.ten_hien_thi);
        return toDto(e);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id){ service.delete(id); }
}
