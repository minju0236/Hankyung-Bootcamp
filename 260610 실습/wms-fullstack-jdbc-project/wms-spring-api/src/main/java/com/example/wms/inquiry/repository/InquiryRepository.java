package com.example.wms.inquiry.repository;

import com.example.wms.inquiry.model.Inquiry;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class InquiryRepository {
    private final JdbcTemplate jdbcTemplate;

    public InquiryRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Inquiry> rowMapper = (rs, rowNum) -> new Inquiry(
            rs.getLong("id"),
            rs.getString("title"),
            rs.getString("content"),
            rs.getString("status"),
            rs.getTimestamp("created_at").toLocalDateTime(),
            rs.getTimestamp("updated_at").toLocalDateTime()
    );

    public List<Inquiry> findAll() {
        String sql = "SELECT id, title, content, status, created_at, updated_at FROM inquiries ORDER BY id DESC";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public Optional<Inquiry> findById(Long id) {
        String sql = "SELECT id, title, content, status, created_at, updated_at FROM inquiries WHERE id = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(sql, rowMapper, id));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public int save(Inquiry item) {
        String sql = "INSERT INTO inquiries (title, content, status) VALUES (?, ?, ?)";
        return jdbcTemplate.update(sql, item.title(), item.content(), item.status());
    }

    public int update(Long id, Inquiry item) {
        String sql = "UPDATE inquiries SET title = ?, content = ?, status = ? WHERE id = ?";
        return jdbcTemplate.update(sql, item.title(), item.content(), item.status(), id);
    }

    public int deleteById(Long id) {
        String sql = "DELETE FROM inquiries WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }
}
