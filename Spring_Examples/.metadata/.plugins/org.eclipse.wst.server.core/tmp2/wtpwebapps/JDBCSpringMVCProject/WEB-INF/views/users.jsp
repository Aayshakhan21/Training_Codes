<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>

<%@ taglib prefix="c" uri="jakarta.tags.core"%>

<html>

<head>
<title>User List</title>
</head>

<body>

	<h2>All Users</h2>

	<table border="1" cellpadding="10">

		<tr>
			<th>Id</th>
			<th>Name</th>
			<th>Email</th>
			<th>Action</th>
		</tr>

		<c:forEach var="u" items="${users}">

			<tr>

				<td>${u.id}</td>

				<td>${u.name}</td>

				<td>${u.email}</td>

				<td><a href="edit/${u.id}"> Edit </a> | <a
					href="delete/${u.id}"> Delete </a></td>

			</tr>

		</c:forEach>

	</table>

	<br />

	<a href="register"> Add New User </a>

</body>

</html>