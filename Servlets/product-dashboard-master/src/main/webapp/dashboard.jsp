<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>User Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body>

<div class="container mt-5">

    <h2 class="text-success mb-4">User Dashboard</h2>

    <p>
        <strong>Welcome:</strong> ${user != null ? user : "Guest"}
    </p>

    <div class="mt-4">

        <a href="form.jsp" class="btn btn-secondary me-2">
            Go to Form Page
        </a>

        <a href="products" class="btn btn-primary">
            Go to Product Dashboard
        </a>

    </div>

</div>

</body>
</html>