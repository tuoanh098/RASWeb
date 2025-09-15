package com.ras.service.salary;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service @RequiredArgsConstructor
public class CellEditService {
  private final EntityManager em;

  private static final Map<String, Set<String>> ALLOW = Map.of(
    "gv_thanh_toan_buoi", Set.of("so_tien_giao_vien","he_so","ghi_chu","loai_buoi",
                                 "hoc_phi_moi_buoi","si_so_thuc_te","hinh_thuc",
                                 "rule_id_ap_dung","is_override_amount"),
    "gv_bonus",           Set.of("so_buoi","so_tien","ghi_chu","loai_bonus","ngay"),
    "gv_khau_tru",        Set.of("so_tien","noi_dung","ngay"),
    // 👇 THÊM 2 bảng rule
    "gv_don_gia_day_rule",Set.of("so_tien","ty_le_pct","uu_tien","hinh_thuc","kieu_tinh",
                                 "loai_lop","thoi_luong_phut","hieu_luc_tu","hieu_luc_den","ghi_chu"),
    "gv_bonus_rule",      Set.of("so_tien","he_so","uu_tien","thoi_luong_phut",
                                 "loai_buoi","hieu_luc_tu","hieu_luc_den","ghi_chu","mon_hoc_id")
  );

  @Transactional
  public int updateCell(String table, Long id, String column, Object value) {
    Set<String> cols = ALLOW.get(table);
    if (cols == null || !cols.contains(column))
      throw new IllegalArgumentException("Cột không cho phép: " + column);
    String sql = "UPDATE " + table + " SET " + column + " = :val WHERE id = :id";
    return em.createNativeQuery(sql).setParameter("val", value).setParameter("id", id).executeUpdate();
  }


}
