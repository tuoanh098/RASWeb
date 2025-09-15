package com.ras.service.employee;

import com.ras.domain.employee.Employee;
import com.ras.domain.employee.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

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
        payload.setId(null);
        payload.setNgayTao(LocalDateTime.now());
        payload.setNgaySua(LocalDateTime.now());
        if (payload.getHoatDong() == null) payload.setHoatDong(Boolean.TRUE);
        return employeeRepository.save(payload);
    }

    @Override
    public Employee update(Long id, Employee patch) {
        Employee e = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhân viên id=" + id));

        // cập nhật các trường cho phép (để nhanh gọn, patch-null nghĩa là bỏ qua)
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
    public void deleteHard(Long id) {
        // sẽ ném DataIntegrityViolationException nếu FK cản — cho controller tự fallback
        employeeRepository.deleteById(id);
        employeeRepository.flush();
    }

    @Override
    public Employee deactivate(Long id) {
        Employee e = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhân viên id=" + id));
        e.setHoatDong(Boolean.FALSE);
        e.setNgaySua(LocalDateTime.now());
        return employeeRepository.save(e);
    }

    @Override
    public String saveAvatarAndReturnUrl(Long id, MultipartFile file) {
        if (file == null || file.isEmpty()) throw new IllegalArgumentException("File rỗng");

        Employee e = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhân viên id=" + id));

        try {
            Path root = Paths.get("uploads", "avatars", String.valueOf(id));
            Files.createDirectories(root);
            String ext = Optional.ofNullable(file.getOriginalFilename())
                    .filter(fn -> fn.contains("."))
                    .map(fn -> fn.substring(fn.lastIndexOf(".")))
                    .orElse(".jpg");
            String filename = System.currentTimeMillis() + ext;
            Path dest = root.resolve(filename);
            Files.copy(file.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);

            // URL tĩnh do WebConfig map /uploads/** -> thư mục ./uploads
            String url = "/uploads/avatars/" + id + "/" + filename;
            e.setAvatarUrl(url);
            e.setNgaySua(LocalDateTime.now());
            employeeRepository.save(e);
            return url;
        } catch (IOException ex) {
            throw new RuntimeException("Lưu avatar thất bại", ex);
        }
    }
}
