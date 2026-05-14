<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>

<html>

<head>
<title>Edit User</title>
</head>

<body>

	<h2>Update User</h2>

	<form action="../update" method="post">

		Id : <input type="text" name="id" value="${user.id}" readonly>

		<br />
		<br /> Name : <input type="text" name="name" value="${user.name}">

		<br />
		<br /> Email : <input type="text" name="email" value="${user.email}">

		<br />
		<br /> <input type="submit" value="Update User" />

	</form>

	<br />

	<a href="../users"> Back To User List </a>

</body>

</html>