<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE-EDGE">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Branch List</title>
    <style>
        table,
        th,
        td {
            border: 1px solid black;
        }
    </style>
</head>

<body>
<h1>Branch List</h1>
<a href="/branch/add" style="color: blue">Add new branch</a>
<a href="/" style="color: blue">Back to home</a>

<table>
    <tr>
        <th>ID Branch</th>
        <th>Ten Rạp</th>
        <th>Image</th>
        <th>Dia chi</th>
        <th>SĐT</th>
        <th>Option</th>
    </tr>
    <c:forEach var="branch" items="${branchs}">
        <tr>
            <td>${branch.id}</td>
            <td>${branch.name}</td>
            <td style="text-align: center"><image style="min-width: 50px; min-height: 40px; max-width: 50px; max-height: 40px"  src="${branch.imgURL}"></image></td>
            <td>${branch.diaChi}</td>
            <td>${branch.phoneNo}</td>
            <td>
                <a href="/branch/detail/${branch.id}">Chi Tiet</a>
                <a href="/branch/delete/${branch.id}" onclick="return confirm('Are you sure?')">Xóa</a>
            </td>
        </tr>
    </c:forEach>
</table>
</body>
</html>