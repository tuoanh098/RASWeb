package com.ras.domain.course;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface KhoaHocRepository extends JpaRepository<KhoaHoc, Long>, JpaSpecificationExecutor<KhoaHoc> {

    Optional<KhoaHoc> findByMa(String ma);

    boolean existsByMonHocIdAndLoaiLopAndThoiLuongPhut(Long monHocId, LoaiLop loaiLop, Short thoiLuongPhut);
    boolean existsByMa(String ma);

    @Query("""
           select k from KhoaHoc k
           where (:q is null or lower(k.tenHienThi) like lower(concat('%', :q, '%')) or lower(k.ma) like lower(concat('%', :q, '%')))
             and (:monHocId is null or k.monHocId = :monHocId)
             and (:loaiLop is null or k.loaiLop = :loaiLop)
             and (:tl is null or k.thoiLuongPhut = :tl)
           order by k.id desc
           """)
    List<KhoaHoc> search(
            @Param("q") String q,
            @Param("monHocId") Long monHocId,
            @Param("loaiLop") LoaiLop loaiLop,
            @Param("tl") Short thoiLuongPhut
    );
}