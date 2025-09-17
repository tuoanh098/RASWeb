package com.ras.service.employee;

import com.ras.domain.employee.Employee;
import com.ras.domain.employee.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.util.UriComponentsBuilder;
import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Transactional
public class EmployeeCommandServiceImpl implements EmployeeCommandService {

    private final EmployeeRepository employeeRepository;

    public EmployeeCommandServiceImpl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public Employee create(Employee payload) {
        // ID = 4 số cuối SĐT (Integer), chèn trực tiếp
        String digits = payload.getSoDienThoai().replaceAll("\\D", "");
        Integer genId = Integer.parseInt(digits.substring(digits.length() - 4));
        payload.setId(genId);

        payload.setNgayTao(LocalDateTime.now());
        payload.setNgaySua(LocalDateTime.now());
        if (payload.getHoatDong() == null) payload.setHoatDong(Boolean.TRUE);
        return employeeRepository.save(payload);
    }

    @Override
    public Employee update(Integer id, Employee patch) {
        Employee e = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhân viên id=" + id));

        if (patch.getHoTen() != null) e.setHoTen(patch.getHoTen());
        if (patch.getSoDienThoai() != null) e.setSoDienThoai(patch.getSoDienThoai());
        if (patch.getEmail() != null) e.setEmail(patch.getEmail());
        if (patch.getChucDanh() != null) e.setChucDanh(patch.getChucDanh());
        if (patch.getChuyenMon() != null) e.setChuyenMon(patch.getChuyenMon());
        if (patch.getVaiTro() != null) e.setVaiTro(patch.getVaiTro());
        if (patch.getGioiTinh() != null) e.setGioiTinh(patch.getGioiTinh());
        if (patch.getNgaySinh() != null) e.setNgaySinh(patch.getNgaySinh());
        if (patch.getDiaChi() != null) e.setDiaChi(patch.getDiaChi());
        if (patch.getCccd() != null) e.setCccd(patch.getCccd());
        if (patch.getNgayVaoLam() != null) e.setNgayVaoLam(patch.getNgayVaoLam());
        if (patch.getSoNamKinhNghiem() != null) e.setSoNamKinhNghiem(patch.getSoNamKinhNghiem());
        if (patch.getHinhThucLamViec() != null) e.setHinhThucLamViec(patch.getHinhThucLamViec());
        if (patch.getGhiChu() != null) e.setGhiChu(patch.getGhiChu());
        if (patch.getHoatDong() != null) e.setHoatDong(patch.getHoatDong());

        e.setNgaySua(LocalDateTime.now());
        return employeeRepository.save(e);
    }

    @Override
    public void deleteHard(Integer id) {
        employeeRepository.deleteById(id);
        employeeRepository.flush();
    }

    @Override
    public Employee deactivate(Integer id) {
        Employee e = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhân viên id=" + id));
        e.setHoatDong(Boolean.FALSE);
        e.setNgaySua(LocalDateTime.now());
        return employeeRepository.save(e);
    }

    @Value("${app.public-base-url:}")
    private String publicBaseUrl;

    @Override
public String saveAvatarAndReturnUrl(Integer id, MultipartFile file) {
    if (file == null || file.isEmpty()) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File rỗng");
    }

    Employee e = employeeRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy nhân viên id=" + id));

    try {
        // Lấy đuôi file (mặc định .jpg nếu không có)
        String orig = Optional.ofNullable(file.getOriginalFilename()).orElse("avatar.jpg");
        String ext = ".jpg";
        int dot = orig.lastIndexOf('.');
        if (dot >= 0 && dot < orig.length() - 1) {
            ext = orig.substring(dot);
        }

        String filename = System.currentTimeMillis() + ext;

        // Lưu file vật lý: uploads/avatars/{id}/{timestamp}.ext
        Path dir = Paths.get("uploads", "avatars", String.valueOf(id));
        Files.createDirectories(dir);
        Path dest = dir.resolve(filename);
        Files.copy(file.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);

        // Tạo base URL: ưu tiên cấu hình app.public-base-url, nếu trống thì lấy từ request hiện tại
        String base = (publicBaseUrl != null && !publicBaseUrl.isBlank())
                ? publicBaseUrl.replaceAll("/+$", "")     // bỏ '/' cuối
                : ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();

        // Ghép URL tuyệt đối để lưu DB
        String url = UriComponentsBuilder.fromUriString(base)
                .path("/uploads/avatars/")
                .path(String.valueOf(id))
                .path("/")
                .path(filename)
                .build(true) // encode
                .toUriString();

        e.setAvatarUrl(url);
        e.setNgaySua(LocalDateTime.now());
        employeeRepository.save(e);

        return url;
    } catch (IOException ex) {
        throw new RuntimeException("Lưu avatar thất bại", ex);
    }
}

    }
