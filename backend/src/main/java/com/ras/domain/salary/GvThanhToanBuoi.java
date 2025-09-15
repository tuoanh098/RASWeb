package com.ras.domain.salary;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity @Table(name="gv_thanh_toan_buoi")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class GvThanhToanBuoi {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  @Column(name="ky_luong_id") private Long kyLuongId;
  @Column(name="chi_nhanh_id") private Long chiNhanhId;
  @Column(name="nhan_vien_id") private Long nhanVienId;
  @Column(name="lop_id") private Long lopId;
  @Column(name="buoi_hoc_id") private Long buoiHocId;
  @Column(name="ngay_day") private LocalDate ngayDay;
  @Column(name="mon_hoc_id") private Long monHocId;
  @Column(name="cap_do_id") private Long capDoId;
  @Column(name="loai_lop") private String loaiLop;
  @Column(name="thoi_luong_phut") private Short thoiLuongPhut;
  @Column(name="hinh_thuc") private String hinhThuc;
  @Column(name="si_so_thuc_te") private Short siSoThucTe;
  @Column(name="hoc_phi_moi_buoi") private BigDecimal hocPhiMoiBuoi;
  @Column(name="rule_id_ap_dung") private Long ruleIdApDung;
  @Column(name="so_tien_giao_vien") private BigDecimal soTienGiaoVien;
  @Column(name="ghi_chu") private String ghiChu;
  @Column(name="loai_buoi") private String loaiBuoi;
  @Column(name="he_so") private BigDecimal heSo;
  @Column(name="is_override_amount") private Boolean isOverrideAmount;
  @Column(name="import_ref_id") private Long importRefId;
}
