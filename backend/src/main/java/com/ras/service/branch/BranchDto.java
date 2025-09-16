package com.ras.service.branch;

import com.fasterxml.jackson.annotation.JsonProperty;

/** Snake_case DTO cho FE. */
public record BranchDto(
    @JsonProperty("id") Long id,
    @JsonProperty("ma") String ma,
    @JsonProperty("ten") String ten,
    @JsonProperty("dia_chi") String dia_chi,
    @JsonProperty("so_dien_thoai") String so_dien_thoai
) {}