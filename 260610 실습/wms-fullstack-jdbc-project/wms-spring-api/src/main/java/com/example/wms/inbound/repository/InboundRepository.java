package com.example.wms.inbound.repository;

import com.example.wms.inbound.model.Inbound;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class InboundRepository {
    private final JdbcTemplate jdbcTemplate;

    public InboundRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Inbound> rowMapper = (rs, rowNum) -> new Inbound(
            rs.getLong("id"),
            rs.getObject("contract_id", Long.class),
            rs.getString("item_name"),
            rs.getInt("quantity"),
            rs.getString("inbound_status"),
            rs.getString("inbound_date"),
            rs.getTimestamp("created_at").toLocalDateTime(),
            rs.getTimestamp("updated_at").toLocalDateTime()
    );

    public List<Inbound> findAll() {
        String sql = "SELECT id, contract_id, item_name, quantity, inbound_status, inbound_date, created_at, updated_at FROM inbounds ORDER BY id DESC";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public Optional<Inbound> findById(Long id) {
        String sql = "SELECT id, contract_id, item_name, quantity, inbound_status, inbound_date, created_at, updated_at FROM inbounds WHERE id = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(sql, rowMapper, id));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public int save(Inbound item) {
        String sql = "INSERT INTO inbounds (contract_id, item_name, quantity, inbound_status, inbound_date) VALUES (?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, item.contractId(), item.itemName(), item.quantity(), item.inboundStatus(), item.inboundDate());
    }

    public int update(Long id, Inbound item) {
        String sql = "UPDATE inbounds SET contract_id = ?, item_name = ?, quantity = ?, inbound_status = ?, inbound_date = ? WHERE id = ?";
        return jdbcTemplate.update(sql, item.contractId(), item.itemName(), item.quantity(), item.inboundStatus(), item.inboundDate(), id);
    }

    public int deleteById(Long id) {
        String sql = "DELETE FROM inbounds WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }
}
