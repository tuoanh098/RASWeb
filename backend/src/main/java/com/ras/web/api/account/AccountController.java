package com.ras.web.api.account;

import com.ras.service.account.*;
import com.ras.service.account.dto.*;
import com.ras.web.api.common.PageResponse;
import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin
public class AccountController {

    private final AccountQueryService queryService;
    private final AccountCommandService commandService;

    public AccountController(AccountQueryService queryService, AccountCommandService commandService) {
        this.queryService = queryService;
        this.commandService = commandService;
    }

    @GetMapping
    public PageResponse<AccountListDto> list(
        @RequestParam(name="page", defaultValue="0") int page,
        @RequestParam(name="size", defaultValue="10") int size,
        @RequestParam(name="q", required=false) String q,
        // nhận filter với cả 2 tên
        @RequestParam(name="vai_tro", required=false) String vaiTro,
        @RequestParam(name="role", required=false) String role,
        @RequestParam(name="hoat_dong", required=false) Boolean hoatDong,
        @RequestParam(name="active", required=false) Boolean active
    ) {
        String roleFilter = (vaiTro != null && !vaiTro.isBlank()) ? vaiTro : role;
        Boolean activeFilter = (hoatDong != null) ? hoatDong : active;

        var p = queryService.list(q, roleFilter, activeFilter, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id")));
        return PageResponse.<AccountListDto>builder()
            .items(p.getContent())
            .page(p.getNumber())
            .size(p.getSize())
            .totalElements(p.getTotalElements())
            .totalPages(p.getTotalPages())
            .build();
    }

    @GetMapping("/{id}")
    public AccountDetailDto get(@PathVariable("id") Long id) { return queryService.get(id); }

    @PostMapping
    public AccountDetailDto create(@RequestBody AccountUpsertReq body) { return commandService.create(body); }

    @PutMapping("/{id}")
    public AccountDetailDto update(@PathVariable("id") Long id, @RequestBody AccountUpsertReq body) {
        return commandService.update(id, body);
    }

    @PutMapping("/{id}/password")
    public void changePassword(@PathVariable("id") Long id, @RequestBody AccountUpsertReq body) {
        commandService.changePassword(id, body.new_password());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") Long id) { commandService.delete(id); }
}
