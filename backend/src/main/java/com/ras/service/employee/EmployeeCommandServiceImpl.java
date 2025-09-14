package com.ras.service.employee;

import com.ras.domain.employee.*;
import com.ras.service.employee.dto.EmployeeUpsertReq;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;
import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.Objects;

@Service @RequiredArgsConstructor
public class EmployeeCommandServiceImpl implements EmployeeCommandService {

    private final EmployeeRepository repo;
    private final EmployeeMapper mapper;
    @Value("${app.upload.dir:uploads}")        // thư mục gốc lưu file
    private String uploadRoot;

    @Override @Transactional
    public Long create(EmployeeUpsertReq req) {
        Employee e = new Employee();
        mapper.apply(req, e);
        repo.save(e);
        return e.getId();
    }

    @Override @Transactional
    public void update(Long id, EmployeeUpsertReq req) {
        Employee e = repo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Nhân viên không tồn tại: id=" + id));
        mapper.apply(req, e);
        repo.save(e);
    }

    @Override @Transactional
    public void delete(Long id) {
        repo.deleteById(id);
    }
        /** Lưu file và trả URL public để FE hiển thị */
    @Override
    public String saveAvatarAndReturnUrl(Long id, MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) throw new IOException("File trống");

        String original = Optional.ofNullable(file.getOriginalFilename()).orElse("avatar.jpg");
        String ext = original.contains(".") ? original.substring(original.lastIndexOf('.') + 1) : "jpg";

        Path dir = Paths.get(uploadRoot, "avatars");
        Files.createDirectories(dir);

        String filename = id + "-" + System.currentTimeMillis() + "." + ext.toLowerCase();
        Path dest = dir.resolve(filename);

        Files.copy(file.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);

        // Trả URL public (đã map trong WebConfig)
        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/avatars/")
                .path(filename)
                .toUriString();
    }

    @Override
    @Transactional
    public void updateAvatarUrl(Long id, String url) {
        Employee emp = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found: " + id));
        emp.setAvatarUrl(url);
        emp.setNgaySua(LocalDateTime.now());
        repo.save(emp);
    }
}
