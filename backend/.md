# RAS Backend (DTO tiếng Việt)

- Trả JSON đúng theo tên cột tiếng Việt của các view:
  - `v_student_overview` → `hoc_vien_id, hoc_sinh, thoi_gian_bat_dau_hoc, hs_phone, ...`
  - `v_staff_on_duty_today` → `id, chi_nhanh_id, ma_chi_nhanh, nhan_vien, ...`
  - `v_today_lessons` → `buoi_hoc_id, ten_lop, bat_dau_luc, ket_thuc_luc, ...`

## Chạy
```bash
mvn -U clean spring-boot:run
```

## Cấu hình DB
`src/main/resources/application.yml` đã đặt `jdbc:mysql://localhost:3306/ras_music` (root/123).
