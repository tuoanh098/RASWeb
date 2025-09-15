package com.ras.web.api.course;
import java.util.List;
import com.ras.service.course.*;
import com.ras.service.course.dto.*;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/signups")
public class SignUpCourseController {

    private final SignUpCourseService service;

    public SignUpCourseController(SignUpCourseService service) {
        this.service = service;
    }

    // Tạo đăng ký
    @PostMapping
    public ResponseEntity<SignUpDTO> create(@Valid @RequestBody SignUpCreateDTO body) {
        return ResponseEntity.ok(service.create(body));
    }

    // Gán lớp / giáo viên
    @PutMapping("/{id}/assign")
    public ResponseEntity<SignUpDTO> assign(@PathVariable Long id, @RequestBody AssignClassDTO body) {
        return ResponseEntity.ok(service.assign(id, body));
    }

    // Lấy theo học viên
    @GetMapping("/student/{hoc_vien_id}")
    public ResponseEntity<List<SignUpDTO>> byStudent(@PathVariable("hoc_vien_id") Long hocVienId) {
        return ResponseEntity.ok(service.findByStudent(hocVienId));
    }

    // Thống kê theo tháng (ví dụ month=9&year=2025)
    @GetMapping("/stats/month")
    public ResponseEntity<MonthlySignUpStatDTO> statByMonth(@RequestParam int month, @RequestParam int year) {
        return ResponseEntity.ok(service.statByMonth(year, month));
    }

    // Danh sách đăng ký theo tháng (phục vụ bảng chi tiết)
    @GetMapping("/month")
    public ResponseEntity<List<SignUpDTO>> listByMonth(@RequestParam int month, @RequestParam int year) {
        return ResponseEntity.ok(service.listByMonth(year, month));
    }

    // Detail / Delete
    @GetMapping("/{id}")
    public ResponseEntity<SignUpDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.get(id));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}