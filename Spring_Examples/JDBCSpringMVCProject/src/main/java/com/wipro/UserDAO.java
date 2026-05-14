package com.wipro;

import java.util.List;

public interface UserDAO {

	// CREATE
	void saveUser(UserModel user);

	// READ
	List<UserModel> getUsers();

	UserModel getUserById(int id);

	// UPDATE
	void updateUser(UserModel user);

	// DELETE
	void deleteUser(int id);
}