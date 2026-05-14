package com.ecomm.servlet;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.*;

public class ProductsDashboard extends HttpServlet {

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		// create product list
		List<String> products = new ArrayList<>();

		products.add("iPhone 15");
		products.add("Samsung Galaxy S23");
		products.add("MacBook Air");
		products.add("Sony Headphones");
		products.add("Boat Earbuds");

		// send to JSP
		request.setAttribute("productList", products);

		request.getRequestDispatcher("product.jsp").forward(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		doGet(request, response);
	}
}