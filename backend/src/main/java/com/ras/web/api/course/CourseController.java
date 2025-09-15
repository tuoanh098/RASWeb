package com.ras.web.api.course;
import com.ras.domain.course.BangGiaHocPhiMucRepository;
import com.ras.domain.course.LoaiLop;
import com.ras.service.course.CourseService;
import com.ras.service.course.dto.CourseDTO;
import com.ras.service.course.dto.CoursePriceDTO;
import com.ras.service.course.dto.CourseUpsertDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService service;
    // inject thêm repo
    private final BangGiaHocPhiMucRepository priceRepo;

    public CourseController(CourseService service, BangGiaHocPhiMucRepository priceRepo) {
        this.service = service;
        this.priceRepo = priceRepo;
    }

    @GetMapping("/{id}/pricing")
    public ResponseEntity<List<CoursePriceDTO>> getPricing(@PathVariable Long id,
                                                        @RequestParam(name = "chi_nhanh_id", required = false) Long cnId) {
        var list = priceRepo.findAppliedForCourse(id, cnId).stream().map(m -> {
            var d = new com.ras.service.course.dto.CoursePriceDTO();
            d.setMucId(m.getId());
            d.setChiNhanhId(m.getChiNhanhId());
            d.setSoBuoiKhoa(m.getSoBuoiKhoa());
            d.setHocPhiKhoa(m.getHocPhiKhoa());
            d.setHocPhiBuoi(m.getHocPhiBuoi());
            return d;
        }).toList();
        return ResponseEntity.ok(list);
    }

    @GetMapping
    public ResponseEntity<List<CourseDTO>> search(
            @RequestParam(required = false) String q,
            @RequestParam(name = "mon_hoc_id", required = false) Long monHocId,
            @RequestParam(name = "loai_lop", required = false) LoaiLop loaiLop,
            @RequestParam(name = "thoi_luong_phut", required = false) Short thoiLuongPhut
    ) {
        return ResponseEntity.ok(service.search(q, monHocId, loaiLop, thoiLuongPhut));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.get(id));
    }

    @PostMapping
    public ResponseEntity<CourseDTO> create(@Valid @RequestBody CourseUpsertDTO body) {
        return ResponseEntity.ok(service.create(body));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourseDTO> update(@PathVariable Long id, @Valid @RequestBody CourseUpsertDTO body) {
        return ResponseEntity.ok(service.update(id, body));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
