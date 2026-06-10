package com.example.wms.outbound.repository;

import com.example.wms.outbound.model.Outbound;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class OutboundRepository {
    private final JdbcTemplate jdbcTemplate;

    public OutboundRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Outbound> rowMapper = (rs, rowNum) -> new Outbound(
            rs.getLong("id"),
            rs.getString("item_name"),
            rs.getInt("quantity"),
            rs.getString("outbound_status"),
            rs.getString("receiver_name"),
            rs.getString("outbound_date"),
            rs.getTimestamp("created_at").toLocalDateTime(),
            rs.getTimestamp("updated_at").toLocalDateTime()
    );

    public List<Outbound> findAll() {
        String sql = "SELECT id, item_name, quantity, outbound_status, receiver_name, outbound_date, created_at, updated_at FROM outbounds ORDER BY id DESC";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public Optional<Outbound> findById(Long id) {
        String sql = "SELECT id, item_name, quantity, outbound_status, receiver_name, outbound_date, created_at, updated_at FROM outbounds WHERE id = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(sql, rowMapper, id));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public int save(Outbound item) {
        String sql = "INSERT INTO outbounds (item_name, quantity, outbound_status, receiver_name, outbound_date) VALUES (?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, item.itemName(), item.quantity(), item.outboundStatus(), item.receiverName(), item.outboundDate());
    }

    public int update(Long id, Outbound item) {
        String sql = "UPDATE outbounds SET item_name = ?, quantity = ?, outbound_status = ?, receiver_name = ?, outbound_date = ? WHERE id = ?";
        return jdbcTemplate.update(sql, item.itemName(), item.quantity(), item.outboundStatus(), item.receiverName(), item.outboundDate(), id);
    }

    public int deleteById(Long id) {
        String sql = "DELETE FROM outbounds WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }
}
