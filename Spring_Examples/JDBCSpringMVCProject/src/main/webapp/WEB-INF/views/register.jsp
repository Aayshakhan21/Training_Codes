<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>

<html>

<head>
<title>Register User</title>
</head>

<body>

	<h2>Add User</h2>

	<form action="register" method="post">

		Id : <input type="text" name="id" /> <br />
		<br /> Name : <input type="text" name="name" /> <br />
		<br /> Email : <input type="text" name="email" /> <br />
		<br /> <input type="submit" value="Add User" />

	</form>

	<br />

	<a href="users"> View All Users </a>

</body>

</html>