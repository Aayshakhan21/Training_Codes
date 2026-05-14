package com.quickcart.controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.util.*;

public class ProductServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // simple product list
        List<String> products = Arrays.asList(
                "Asus Tuf F15",
                "Samsung Galaxy S23",
                "MacBook Air",
                "Sony Headphones",
                "Bonkers"
        );

        // send data to JSP
        request.setAttribute("productList", products);

        request.getRequestDispatcher("dashboard.jsp").forward(request, response);
    }
}