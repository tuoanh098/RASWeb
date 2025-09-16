package com.ras.service.commission;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;

@Service
@RequiredArgsConstructor
public class CommissionAwardServiceImpl implements CommissionAwardService {

  private final EntityManager em;

  private static String rootMsg(Throwable t) {
    Throwable c = t;
    while (c.getCause() != null) c = c.getCause();
    return c.getMessage();
  }

  @Override
  @Transactional(propagation = Propagation.REQUIRES_NEW)
  public void awardFromSignup(CommissionAwardInput in) {
    if (in.getNhanVienTuVanId() == null || in.getNhanVienTuVanId() == 0L) {
      return; // không có NV tư vấn -> bỏ qua
    }
    try {
      em.createNativeQuery("CALL sp_nv_hoa_hong_from_signup(?,?,?,?,?,?,?)")
          .setParameter(1, in.getDangKyId())
          .setParameter(2, Date.valueOf(in.getNgayDangKy()))
          .setParameter(3, in.getHocVienId())
          .setParameter(4, in.getChiNhanhId())
          .setParameter(5, in.getNhanVienTuVanId())
          .setParameter(6, in.getKhoaHocMauId())
          .setParameter(7, in.getHocPhiApDung() == null ? 0 : in.getHocPhiApDung().longValue())
          .executeUpdate();
      // Nếu proc hoa hồng của bạn đã tự CALL sp_recalc_ky_luong_commission thì không cần gọi lại ở đây.
    } catch (Exception ex) {
      // Không throw để tránh rollback giao dịch ngoài
      System.err.println("[CommissionAward] PROC failed: " + rootMsg(ex));
    }
  }
}
