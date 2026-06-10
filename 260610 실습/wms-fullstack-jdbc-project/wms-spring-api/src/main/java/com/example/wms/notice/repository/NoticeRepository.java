package com.example.wms.notice.repository;

import com.example.wms.notice.model.Notice;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class NoticeRepository {
    private final JdbcTemplate jdbcTemplate;

    public NoticeRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Notice> rowMapper = (rs, rowNum) -> new Notice(
            rs.getLong("id"),
            rs.getString("title"),
            rs.getString("content"),
            rs.getTimestamp("created_at").toLocalDateTime(),
            rs.getTimestamp("updated_at").toLocalDateTime()
    );

    public List<Notice> findAll() {
        String sql = "SELECT id, title, content, created_at, updated_at FROM notices ORDER BY id DESC";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public Optional<Notice> findById(Long id) {
        String sql = "SELECT id, title, content, created_at, updated_at FROM notices WHERE id = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(sql, rowMapper, id));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public int save(Notice item) {
        String sql = "INSERT INTO notices (title, content) VALUES (?, ?)";
        return jdbcTemplate.update(sql, item.title(), item.content());
    }

    public int update(Long id, Notice item) {
        String sql = "UPDATE notices SET title = ?, content = ? WHERE id = ?";
        return jdbcTemplate.update(sql, item.title(), item.content(), id);
    }

    public int deleteById(Long id) {
        String sql = "DELETE FROM notices WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }
}
