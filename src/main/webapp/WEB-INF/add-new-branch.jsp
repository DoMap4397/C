<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>

<html>

<head>
    <title> Add Movie</title>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
</head>
<body>
<h1 style="text-align: center; color: blue;">Add New Movie</h1>

<div style="text-align: center;">
    <a style="text-align: center;" href="/home">Back to home</a>
    <form action="/branch/add" method="POST">
        <div class="input" style="display:flex; justify-content: center;">
            <h3 class="lable" style="width:136px ; text-align: left;">Branch name:</h3>
            <input type="text" required name="name"  style="width: 400px;height: 30px;margin: auto 20px;" >
        </div>
        <div class="input"style="display:flex; justify-content: center;">
            <h3 class="lable"style="width:136px ; text-align: left;">Branch Image URL:</h3>
            <input type="text" name="smallImageUrl" style="width: 400px;height: 30px;margin: auto 20px;">
        </div>
        <div class="input"style="display:flex; justify-content: center;">
            <h3 class="lable"style="width:136px ; text-align: left;">Branch Address:</h3>
            <input type="text" required name="address"  style="width: 400px;height: 30px;margin: auto 20px;">
        </div>
        <div class="input"style="display:flex; justify-content: center;">
            <h3 class="lable"style="width:136px ; text-align: left;">Branch phone:</h3>
            <input type="text" required name="phone"  style="width: 400px;height: 30px;margin: auto 20px;">
        </div>

        <button style="min-width: 270px; min-height: 30px; background-color: red;">Add</button>
    </form>
</div>


</body>

</html>
