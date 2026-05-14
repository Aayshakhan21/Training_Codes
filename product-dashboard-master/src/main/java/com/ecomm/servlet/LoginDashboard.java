package com.ecomm.servlet;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;

public class LoginDashboard extends HttpServlet {

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String username = request.getParameter("username");
		String password = request.getParameter("password");

		if ("admin".equalsIgnoreCase(username) && "1234".equals(password)) {

			request.setAttribute("user", username);
			request.getRequestDispatcher("/user").forward(request, response);

		} else {

			request.setAttribute("error", "Invalid username or password");
			request.getRequestDispatcher("login.jsp").forward(request, response);
		}
	}
}