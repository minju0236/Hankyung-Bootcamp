package com.example.wms.contract.repository;

import com.example.wms.contract.model.Contract;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class ContractRepository {
    private final JdbcTemplate jdbcTemplate;

    public ContractRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Contract> rowMapper = (rs, rowNum) -> new Contract(
            rs.getLong("id"),
            rs.getString("customer_name"),
            rs.getString("item_name"),
            rs.getInt("quantity"),
            rs.getString("warehouse_name"),
            rs.getString("contract_status"),
            rs.getString("request_note"),
            rs.getTimestamp("created_at").toLocalDateTime(),
            rs.getTimestamp("updated_at").toLocalDateTime()
    );

    public List<Contract> findAll() {
        String sql = "SELECT id, customer_name, item_name, quantity, warehouse_name, contract_status, request_note, created_at, updated_at FROM contracts ORDER BY id DESC";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public Optional<Contract> findById(Long id) {
        String sql = "SELECT id, customer_name, item_name, quantity, warehouse_name, contract_status, request_note, created_at, updated_at FROM contracts WHERE id = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(sql, rowMapper, id));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public int save(Contract item) {
        String sql = "INSERT INTO contracts (customer_name, item_name, quantity, warehouse_name, contract_status, request_note) VALUES (?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, item.customerName(), item.itemName(), item.quantity(), item.warehouseName(), item.contractStatus(), item.requestNote());
    }

    public int update(Long id, Contract item) {
        String sql = "UPDATE contracts SET customer_name = ?, item_name = ?, quantity = ?, warehouse_name = ?, contract_status = ?, request_note = ? WHERE id = ?";
        return jdbcTemplate.update(sql, item.customerName(), item.itemName(), item.quantity(), item.warehouseName(), item.contractStatus(), item.requestNote(), id);
    }

    public int deleteById(Long id) {
        String sql = "DELETE FROM contracts WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }
}
