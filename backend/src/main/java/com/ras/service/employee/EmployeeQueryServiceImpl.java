package com.ras.service.employee;

import com.ras.domain.employee.Employee;
import com.ras.domain.employee.EmployeeRepository;
import com.ras.service.employee.dto.EmployeeDetailDto;
import com.ras.service.employee.dto.EmployeeListDto;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeQueryServiceImpl implements EmployeeQueryService {

    private final EmployeeRepository employeeRepository;

    @Override
    public Page<EmployeeListDto> search(String kw, String role, int page, int size) {
        Specification<Employee> spec = buildSpec(kw, role);
        Page<Employee> p = employeeRepository.findAll(spec, PageRequest.of(page, size));
        List<EmployeeListDto> items = p.getContent().stream()
                .map(EmployeeMapper::toListDto)
                .toList();
        return new PageImpl<>(items, p.getPageable(), p.getTotalElements());
    }

    @Override
    public EmployeeDetailDto getById(Integer id) {
        Employee e = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhân viên id=" + id));
        return EmployeeMapper.toDetailDto(e);
    }

    @SuppressWarnings("null")
    private Specification<Employee> buildSpec(String kw, String role) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(kw)) {
                String like = "%" + kw.trim().toLowerCase() + "%";
                Predicate byName = cb.like(cb.lower(root.get("hoTen")), like);
                Predicate byPhone = cb.like(cb.lower(root.get("soDienThoai")), like);
                Predicate byEmail = cb.like(cb.lower(root.get("email")), like);
                predicates.add(cb.or(byName, byPhone, byEmail));
            }

            if (StringUtils.hasText(role)) {
                predicates.add(cb.equal(cb.lower(root.get("vaiTro")), role.trim().toLowerCase()));
            }

            // mặc định sắp xếp theo id desc (nếu controller không override sort)
            query.orderBy(cb.desc(root.get("id")));

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
