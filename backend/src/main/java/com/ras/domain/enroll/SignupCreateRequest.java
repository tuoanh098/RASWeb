package com.ras.domain.enroll;

import java.math.BigDecimal;

public class SignupCreateRequest {
  public Long hoc_vien_id;
  public Long khoa_hoc_id;

  public String giai_doan;     // enum string
  public String cap_do;        // enum string
  public Integer so_buoi_khoa;

  // client vẫn gửi 1 chi_nhanh_id, nhưng khi lưu sẽ chuyển thành "6,7"
  public Long chi_nhanh_id;    // optional

  public Long nhan_vien_tu_van_id;
  public Long giao_vien_id;

  public BigDecimal hoc_phi_ap_dung;
  public String ngay_dang_ky;  // yyyy-MM-dd
  public String ghi_chu;
}
