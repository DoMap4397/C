<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE-EDGE">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Movie List</title>
    <style>
        table,
        th,
        td {
            border: 1px solid black;
        }
    </style>
</head>

<body>
<h1>Movie List</h1>
<a href="/movie/add" style="color: blue">Add new movie</a>
<a href="/" style="color: blue">Back to home</a>

<table>
    <tr>
        <th>ID Phim</th>
        <th>Ten Phim</th>
        <th>Short Image</th>
        <th>Director</th>
        <th>Ngay Cong Chieu</th>
        <th>Ngay Ket Thuc</th>
        <th>Option</th>
    </tr>
    <c:forEach var="movie" items="${movies}">
        <tr>
            <td>${movie.movieId}</td>
            <td>${movie.movieName}</td>
            <td style="text-align: center"><image style="min-width: 50px; min-height: 40px; max-width: 50px; max-height: 40px"  src="${movie.smallImageURl}"></image></td>
            <td>${movie.director}</td>
            <td>${movie.releaseDate}</td>
            <td>${movie.endDate}</td>
            <td>
                <a href="/movie/detail/${movie.movieId}">Chi Tiet</a>
                <a href="/movie/delete/${movie.movieId}" onclick="return confirm('Are you sure?')">Xóa</a>
            </td>
        </tr>
    </c:forEach>
</table>
</body>
</html>