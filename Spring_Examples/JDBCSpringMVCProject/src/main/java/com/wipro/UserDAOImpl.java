package com.wipro;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class UserDAOImpl implements UserDAO {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	// CREATE
	@Override
	public void saveUser(UserModel user) {

		String sql = "INSERT INTO users(id, name, email) VALUES(?,?,?)";

		jdbcTemplate.update(sql, user.getId(), user.getName(), user.getEmail());
	}

	// READ ALL USERS
	@Override
	public List<UserModel> getUsers() {

		String sql = "SELECT * FROM users";

		return jdbcTemplate.query(sql, new RowMapper<UserModel>() {

			@Override
			public UserModel mapRow(ResultSet rs, int rowNum) throws SQLException {

				UserModel user = new UserModel();

				user.setId(rs.getInt("id"));
				user.setName(rs.getString("name"));
				user.setEmail(rs.getString("email"));

				return user;
			}
		});
	}

	// READ USER BY ID
	@Override
	public UserModel getUserById(int id) {

		String sql = "SELECT * FROM users WHERE id=?";

		return jdbcTemplate.queryForObject(sql, new Object[] { id }, new RowMapper<UserModel>() {

			@Override
			public UserModel mapRow(ResultSet rs, int rowNum) throws SQLException {

				UserModel user = new UserModel();

				user.setId(rs.getInt("id"));
				user.setName(rs.getString("name"));
				user.setEmail(rs.getString("email"));

				return user;
			}
		});
	}

	// UPDATE
	@Override
	public void updateUser(UserModel user) {

		String sql = "UPDATE users SET name=?, email=? WHERE id=?";

		jdbcTemplate.update(sql, user.getName(), user.getEmail(), user.getId());
	}

	// DELETE
	@Override
	public void deleteUser(int id) {

		String sql = "DELETE FROM users WHERE id=?";

		jdbcTemplate.update(sql, id);
	}
}