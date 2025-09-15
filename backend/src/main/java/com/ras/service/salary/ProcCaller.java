package com.ras.service.salary;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.*;

@Component @RequiredArgsConstructor
public class ProcCaller {
  private final DataSource dataSource;

  public void runTinhLuongGv(String thang, Long chiNhanhId) throws SQLException {
    try (Connection c = dataSource.getConnection();
         CallableStatement cs = c.prepareCall("{ call sp_tinh_luong_gv(?,?) }")) {
      cs.setString(1, thang);
      if (chiNhanhId == null) cs.setNull(2, Types.BIGINT); else cs.setLong(2, chiNhanhId);
      cs.execute();
    }
  }

  public void runTinhLuongNv(String thang, Long chiNhanhId) throws SQLException {
    try (Connection c = dataSource.getConnection();
         CallableStatement cs = c.prepareCall("{ call sp_tinh_luong_nv(?,?) }")) {
      cs.setString(1, thang);
      if (chiNhanhId == null) cs.setNull(2, Types.BIGINT); else cs.setLong(2, chiNhanhId);
      cs.execute();
    }
  }
}
