<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page isELIgnored="false" %>
<!DOCTYPE html>
<html>
<head><title>Success</title></head>
<body>
    congratulations!
    <!-- 'namevalue' is the key we set in the controller; 'userName' is the field in User class -->
    <h1>Hi, ${namevalue.userName} </h1>
</body>
</html>