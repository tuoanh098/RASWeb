package com.ras.web.api.course;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.ras.domain.course.MonHoc;
import com.ras.service.course.dto.CreateMonHocRequest;
import com.ras.service.course.dto.MonHocDto;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
public class MonHocController {

    private final EntityManager em;

    public MonHocController(EntityManager em) { this.em = em; }

    @GetMapping
    public List<MonHocDto> list() {
        var list = em.createQuery("SELECT m FROM MonHoc m ORDER BY m.id DESC", MonHoc.class).getResultList();
        return list.stream().map(m -> new MonHocDto(m.getId(), m.getMaMon(), m.getTenMon())).toList();
    }

    @GetMapping("/{id}")
    public MonHocDto get(@PathVariable Long id) {
        MonHoc m = em.find(MonHoc.class, id);
        if (m == null) throw new jakarta.persistence.EntityNotFoundException("Không tìm thấy mon_hoc id=" + id);
        return new MonHocDto(m.getId(), m.getMaMon(), m.getTenMon());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public MonHocDto create(@RequestBody CreateMonHocRequest req) {
        MonHoc m = new MonHoc();
        m.setMaMon(req.ma_mon);
        m.setTenMon(req.ten_mon);
        em.persist(m);
        em.flush();
        return new MonHocDto(m.getId(), m.getMaMon(), m.getTenMon());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void delete(@PathVariable Long id) {
        MonHoc m = em.find(MonHoc.class, id);
        if (m == null) throw new jakarta.persistence.EntityNotFoundException("Không tìm thấy mon_hoc id=" + id);
        em.remove(m);
        em.flush();
    }
}