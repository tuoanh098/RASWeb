package com.ras.web.api.employee;

import com.ras.service.employee.*;
import com.ras.service.employee.dto.*;
import com.ras.web.api.common.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeQueryService queryService;
    private final EmployeeCommandService commandService;
    
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public PageResponse<EmployeeListDto> list(
            @RequestParam(name="page", defaultValue="0") int page,
            @RequestParam(name="size", defaultValue="10") int size,
            @RequestParam(name="q", required=false) String q,
            @RequestParam(name="role", required=false) String role
    ) {
        Pageable pageable = PageRequest.of(Math.max(page,0), Math.min(size,500), Sort.by(Sort.Direction.DESC, "id"));
        return queryService.list(q, role, pageable);
    }

    @GetMapping(value="/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public EmployeeDetailDto get(@PathVariable("id") Long id) {
        return queryService.get(id);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Long> create(@RequestBody EmployeeUpsertReq req) {
        return Map.of("id", commandService.create(req));
    }

    @PutMapping(value="/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Long> update(@PathVariable("id") Long id, @RequestBody EmployeeUpsertReq req) {
        commandService.update(id, req);
        return Map.of("id", id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") Long id) {
        commandService.delete(id);
    }

    @PostMapping(path = "/{id}/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, String> uploadAvatar(
            @PathVariable("id") Long id,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        String url = commandService.saveAvatarAndReturnUrl(id, file);
        commandService.updateAvatarUrl(id, url);
        return Map.of("avatar_url", url);
    }
}
