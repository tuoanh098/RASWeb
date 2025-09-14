package com.ras.web.api.account;

import com.ras.service.account.*;
import com.ras.service.account.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin
public class AccountController {

    private final AccountQueryService query;
    private final AccountCommandService command;

    public AccountController(AccountQueryService query, AccountCommandService command) {
        this.query = query; this.command = command;
    }

    @GetMapping
    public Map<String, Object> list(
            @RequestParam(required = false) String kw,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Boolean active,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<AccountListDto> p = query.list(kw, role, page, size, active);
        return Map.of(
                "items", p.getContent(),
                "page", p.getNumber(),
                "size", p.getSize(),
                "totalElements", p.getTotalElements(),
                "totalPages", p.getTotalPages()
        );
    }

    @GetMapping("/{id}")
    public AccountDetailDto get(@PathVariable Long id) {
        return query.get(id);
    }

    @PostMapping
    public Map<String, Long> create(@RequestBody AccountUpsertReq req) {
        return Map.of("id", command.create(req));
    }

    @PutMapping("/{id}")
    public void update(@PathVariable Long id, @RequestBody AccountUpsertReq req) {
        command.update(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        command.delete(id);
    }

    @PostMapping("/{id}/reset-password")
    public void resetPassword(@PathVariable Long id, @RequestBody Map<String, String> body) {
        command.resetPassword(id, body.getOrDefault("new_password", ""));
    }
}
