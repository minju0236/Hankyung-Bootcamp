package com.example.wms.inventory.repository;

import com.example.wms.inventory.model.Inventory;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class InventoryRepository {
    private final JdbcTemplate jdbcTemplate;

    public InventoryRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Inventory> rowMapper = (rs, rowNum) -> new Inventory(
            rs.getLong("id"),
            rs.getString("item_name"),
            rs.getString("warehouse_name"),
            rs.getInt("quantity"),
            rs.getInt("safety_stock"),
            rs.getTimestamp("created_at").toLocalDateTime(),
            rs.getTimestamp("updated_at").toLocalDateTime()
    );

    public List<Inventory> findAll() {
        String sql = "SELECT id, item_name, warehouse_name, quantity, safety_stock, created_at, updated_at FROM inventories ORDER BY id DESC";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public Optional<Inventory> findById(Long id) {
        String sql = "SELECT id, item_name, warehouse_name, quantity, safety_stock, created_at, updated_at FROM inventories WHERE id = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(sql, rowMapper, id));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public int save(Inventory item) {
        String sql = "INSERT INTO inventories (item_name, warehouse_name, quantity, safety_stock) VALUES (?, ?, ?, ?)";
        return jdbcTemplate.update(sql, item.itemName(), item.warehouseName(), item.quantity(), item.safetyStock());
    }

    public int update(Long id, Inventory item) {
        String sql = "UPDATE inventories SET item_name = ?, warehouse_name = ?, quantity = ?, safety_stock = ? WHERE id = ?";
        return jdbcTemplate.update(sql, item.itemName(), item.warehouseName(), item.quantity(), item.safetyStock(), id);
    }

    public int deleteById(Long id) {
        String sql = "DELETE FROM inventories WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }
}
