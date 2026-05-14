<%@ page language="java" contentType="text/html; charset=UTF-8"
   session = "true" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>


<jsp:include page ="header.jsp"/>
<%

String email = request.getParameter("email"); // it is also an implicit object
String password = request.getParameter("password");
session.setAttribute("email",email);
if( email.isEmpty() ||  password.isEmpty())
	response.sendRedirect("error.jsp"); // response is an obj
    // out.println();    // PrintWriter class i.e. out
%>

<h2>Welcome , <%= email  %></h2>
<br>
<%-- <jsp:forward page ="add.jsp"/> --%>
<a href="add.jsp">Add </a>
</body>
</html> 