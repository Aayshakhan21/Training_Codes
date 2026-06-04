<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>

<html>

<head>
<title>Success</title>
</head>

<body>

	<h2 style="color: green;">${message}</h2>

	<hr>

	<h3>User Details</h3>

	Id :
	<h3>${data.id}</h3>

	Name :
	<h3>${data.name}</h3>

	Email :
	<h3>${data.email}</h3>

	<br />

	<a href="register"> Add Another User </a>

	<br />
	<br />

	<a href="users"> View All Users </a>

</body>

</html>