<%@ page contentType="text/html;charset=UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>Login</title>
<link
	href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
	rel="stylesheet">
</head>

<body class="container mt-5">

	<h2>Login Page</h2>

	<p style="color: red">${error}</p>

	<form action="logindashboard" method="post">
		<div class="mb-3">
			<label class="form-label">Username</label> <input type="text"
				name="username" class="form-control" required>
		</div>

		<div class="mb-3">
			<label class="form-label">Password</label> <input type="password"
				name="password" class="form-control" required>
		</div>

		<button type="submit" class="btn btn-primary">Login</button>
	</form>

</body>
</html>