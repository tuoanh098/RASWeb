package com.ras.service.salary;

import com.ras.domain.salary.NvPhatKyLuat;
import com.ras.service.salary.dto.*;
import org.springframework.data.domain.*;

public interface StaffSalaryService {
    Page<StaffSalaryRow> list(String ky, Pageable pageable);
    void updateLuong(Long bangLuongId, StaffLuongUpdateReq req);
    NvPhatKyLuat addPenalty(StaffPenaltyReq req);
    Page<NvPhatKyLuat> listPenalties(String ky, Long nhanVienId, Pageable pageable);
    void recalc(String ky);
}
