package com.ecom.servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;

//@WebServlet("/login")
public class LoginServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    // handle GET (optional)
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/html");
        response.getWriter().println("<h3>Use POST method to login</h3>");
    }

    // handle POST (main login logic)
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // get form data
        String email = request.getParameter("email");
        String password = request.getParameter("password");

        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        // basic validation
        if ("vishal12kl@gmail.com".equals(email) && "1234".equals(password)) {

            out.println("<h2 style='color:green;'>Login Successful</h2>");
            out.println("<p>Welcome " + email + "</p>");

        } else {

            out.println("<h2 style='color:red;'>Invalid Email or Password</h2>");
        }
    }
}