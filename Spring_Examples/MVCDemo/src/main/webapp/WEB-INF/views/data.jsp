<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>

<%
	String name=(String)request.getAttribute("name");
String desig=(String)request.getAttribute("Designation");
%>

<h1> Name is  :  <%=name%> </h1>
<h1> Designation is  :  <%=desig%> </h1>
</body>
</html>