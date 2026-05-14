package com.quickcart.controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;

import java.io.IOException;

public class LoginServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String email = request.getParameter("email");
        String password = request.getParameter("password");

        if ("vishal@quickcart.com".equals(email) && "1234".equals(password)) {

            // redirect to ProductServlet
            response.sendRedirect("product");

        } else {

            // forward to error.jsp
            request.getRequestDispatcher("error.jsp").forward(request, response);
        }
    }
}