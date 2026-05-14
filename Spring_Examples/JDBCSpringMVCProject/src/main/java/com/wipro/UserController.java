package com.wipro;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class UserController {

	@Autowired
	private UserDAO userDAO;

	@GetMapping("/")
	public String home() {

		return "redirect:/register";
	}

	@GetMapping("/register")
	public String showForm(Model model) {

		model.addAttribute("user", new UserModel());

		return "register";
	}

	@PostMapping("/register")
	public String saveUser(@ModelAttribute UserModel user, Model model) {

		userDAO.saveUser(user);

		model.addAttribute("data", user);

		model.addAttribute("message", "User Added Successfully!");

		return "success";
	}

	@GetMapping("/users")
	public String getUsers(Model model) {

		model.addAttribute("users", userDAO.getUsers());

		return "users";
	}

	@GetMapping("/edit/{id}")
	public String editUser(@PathVariable("id") int id, Model model) {

		UserModel user = userDAO.getUserById(id);

		model.addAttribute("user", user);

		return "editUser";
	}

	@PostMapping("/update")
	public String updateUser(@ModelAttribute UserModel user) {

		userDAO.updateUser(user);

		return "redirect:/users";
	}

	@GetMapping("/delete/{id}")
	public String deleteUser(@PathVariable("id") int id) {

		userDAO.deleteUser(id);

		return "redirect:/users";
	}
}