package com.ras.domain.course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
@Repository
public interface KhoaHocMauRepository extends JpaRepository<KhoaHocMau, Long> {
    @Query(value = "select khoa_hoc_id from khoa_hoc_mau where id = :id limit 1", nativeQuery = true)
    Long findKhoaHocIdByTemplateId(@Param("id") Long templateId);
}
