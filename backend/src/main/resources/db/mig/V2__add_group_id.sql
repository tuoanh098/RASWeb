-- Thêm cột group_id + index (idempotent)
SET @col_exists := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME='buoi_hoc' AND COLUMN_NAME='group_id');
SET @sql := IF(@col_exists=0, 'ALTER TABLE buoi_hoc ADD COLUMN group_id VARCHAR(64) NULL', 'DO 0');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;

SET @idx_exists := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME='buoi_hoc' AND INDEX_NAME='idx_buoi_hoc_group_id');
SET @sql := IF(@idx_exists=0, 'CREATE INDEX idx_buoi_hoc_group_id ON buoi_hoc(group_id)', 'DO 0');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;
