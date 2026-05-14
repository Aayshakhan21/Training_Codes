<%@ page contentType="text/html;charset=UTF-8"%>
<%@ page import="java.util.*"%>

<!DOCTYPE html>
<html>
<head>
<title>Dashboard</title>
<link
	href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
	rel="stylesheet">
</head>

<body class="container mt-5">

	<h2 class="text-success">You have successfully logged in</h2>

	<h4 class="mt-4">Products</h4>

	<ul class="list-group">

		<%
		List<String> products = (List<String>) request.getAttribute("productList");
		for (String p : products) {
		%>
		<li class="list-group-item"><%=p%></li>
		<%
}
%>

	</ul>

</body>
</html>