package com.ras.web.api.employee;

import com.ras.domain.employee.Employee;
import com.ras.domain.employee.EmployeeRepository;
import com.ras.service.employee.EmployeeCommandService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.criteria.Predicate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeRepository repo;
    private final EmployeeCommandService commandService;

    public EmployeeController(EmployeeRepository repo, EmployeeCommandService commandService) {
        this.repo = repo;
        this.commandService = commandService;
    }

    /* =================== LIST (có tìm kiếm) =================== */
    @GetMapping
    public Map<String, Object> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false, name = "q") String q,
            @RequestParam(required = false, name = "role") String role
    ) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(size, 1), Sort.by(Sort.Direction.DESC, "id"));

        Specification<Employee> spec = (root, query, cb) -> {
            List<Predicate> ps = new ArrayList<>();
            if (q != null && !q.isBlank()) {
                String like = "%" + q.trim() + "%";
                ps.add(cb.or(
                        cb.like(cb.lower(root.get("hoTen")), like.toLowerCase()),
                        cb.like(cb.lower(root.get("soDienThoai")), like.toLowerCase()),
                        cb.like(cb.lower(root.get("email")), like.toLowerCase())
                ));
            }
            if (role != null && !role.isBlank()) {
                ps.add(cb.equal(root.get("vaiTro"), role));
            }
            return cb.and(ps.toArray(new Predicate[0]));
        };

        Page<Employee> p = repo.findAll(spec, pageable);
        Map<String, Object> res = new LinkedHashMap<>();
        res.put("items", p.getContent());
        res.put("page", p.getNumber());
        res.put("size", p.getSize());
        res.put("totalElements", p.getTotalElements());
        res.put("totalPages", p.getTotalPages());
        return res;
    }

    /* =================== DETAIL =================== */
    @GetMapping("/{id}")
    public Employee get(@PathVariable("id") Long id) {
        return repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhân viên"));
    }

    /* =================== CREATE =================== */
    @PostMapping
    public ResponseEntity<Employee> create(@RequestBody Employee body) {
        Employee saved = commandService.create(body);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    /* =================== UPDATE =================== */
    @PutMapping("/{id}")
    public Employee update(@PathVariable("id") Long id, @RequestBody Employee patch) {
        return commandService.update(id, patch);
    }

    /* =================== DELETE: cứng -> fallback ngưng hoạt động =================== */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        try {
            commandService.deleteHard(id); // thử xoá cứng
            return ResponseEntity.noContent().build();
        } catch (DataIntegrityViolationException ex) {
            // bị FK cản, chuyển sang ngưng hoạt động
            Employee e = commandService.deactivate(id);
            Map<String, Object> body = Map.of(
                    "message", "Nhân viên còn được tham chiếu (ví dụ: lịch trực). Đã chuyển trạng thái sang 'Ngưng hoạt động'.",
                    "employee", e
            );
            return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
        }
    }

    /* =================== UPLOAD AVATAR =================== */
    @PostMapping(path = "/{id}/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, Object> uploadAvatar(@PathVariable("id") Long id, @RequestParam("file") MultipartFile file) {
        String url = commandService.saveAvatarAndReturnUrl(id, file);
        return Map.of("url", url, "updatedAt", LocalDateTime.now());
    }
}
