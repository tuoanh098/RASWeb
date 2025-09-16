package com.ras.service.schedule;

import com.ras.domain.schedule.XepLopHoc;
import com.ras.domain.schedule.XepLopHocRepository;
import com.ras.service.schedule.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class XepLopServiceImpl implements XepLopService {
  private final XepLopHocRepository repo;

  private int calcMinutes(LocalDate day, LocalTime start, LocalTime end){
    return (int) Duration.between(start.atDate(day), end.atDate(day)).toMinutes();
  }

  @Override
  @Transactional
  public XepLopDto createOne(XepLopCreateDto req) {
    if (req.ket_thuc_luc.isBefore(req.bat_dau_luc))
      throw new IllegalArgumentException("ket_thuc_luc phải sau bat_dau_luc");

    XepLopHoc e = XepLopMapper.toEntity(req);
    e.setThoiLuongPhut(calcMinutes(req.ngay, req.bat_dau_luc, req.ket_thuc_luc));
    XepLopHoc saved = repo.save(e);
    return XepLopMapper.toDto(saved);
  }

  @Override
  @Transactional
  public List<XepLopDto> createRecurring(XepLopRecurringDto r) {
    if (r.so_tuan == null || r.so_tuan <= 0) throw new IllegalArgumentException("so_tuan > 0");

    Long groupId = null;
    List<XepLopHoc> list = new ArrayList<>();

    for (int i=0;i<r.so_tuan;i++){
      LocalDate day = r.ngay_bat_dau.plusWeeks(i);

      XepLopCreateDto d = new XepLopCreateDto();
      d.khoa_hoc_id = r.khoa_hoc_id;
      d.khoa_hoc_ten = r.khoa_hoc_ten;
      d.hoc_vien_id = r.hoc_vien_id;
      d.hoc_vien_ten = r.hoc_vien_ten;
      d.giao_vien_id = r.giao_vien_id;
      d.giao_vien_ten = r.giao_vien_ten;
      d.chi_nhanh_id  = r.chi_nhanh_id;
      d.chi_nhanh_ten = r.chi_nhanh_ten;
      d.so_buoi_du_kien = r.so_buoi_du_kien;
      d.so_buoi_da_hoc  = 0;
      d.ngay = day;
      d.bat_dau_luc = r.bat_dau_luc;
      d.ket_thuc_luc = r.ket_thuc_luc;
      d.ghi_chu = r.ghi_chu;

      XepLopHoc e = XepLopMapper.toEntity(d);
      e.setThoiLuongPhut(calcMinutes(day, r.bat_dau_luc, r.ket_thuc_luc));

      if (groupId == null) {
        // tạm thời chưa có id, sẽ set sau khi save lần đầu
      } else {
        e.setCoDinhGroupId(groupId);
      }
      XepLopHoc saved = repo.save(e);

      if (groupId == null) {
        groupId = saved.getId(); // dùng id bản ghi đầu làm group
        saved.setCoDinhGroupId(groupId);
        repo.save(saved);
      }
      list.add(saved);
    }
    return list.stream().map(XepLopMapper::toDto).collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public List<XepLopDto> getWeek(LocalDate weekStart, Long branchId, Long teacherId, Long studentId) {
    LocalDate from = weekStart;
    LocalDate to = weekStart.plusDays(6);
    return repo.findInRange(from, to, branchId, teacherId, studentId)
               .stream().map(XepLopMapper::toDto).toList();
  }

  @Override
  @Transactional
  public void cancelOne(Long id) {
    XepLopHoc e = repo.findById(id).orElseThrow();
    e.setTrangThaiBuoi(XepLopHoc.TrangThaiBuoi.cancelled);
    repo.save(e);
  }

  @Override
  @Transactional
  public int deleteSeriesFrom(Long groupId, LocalDate fromInclusive) {
    List<XepLopHoc> list = repo.findByCoDinhGroupIdAndNgayGreaterThanEqualOrderByNgayAsc(groupId, fromInclusive);
    repo.deleteAll(list);
    return list.size();
  }
}
