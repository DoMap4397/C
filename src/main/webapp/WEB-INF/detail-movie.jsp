<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>

<html>

<head>
    <title> Update Movie</title>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
</head>
<body>
<h1 style="text-align: center; color: blue;">Update Movie</h1>

<div style="text-align: center;">
    <a style="text-align: center;" href="/home">Back to home</a>
    <form action="/movie/edit/${movie.movieId}" method="POST">
        <div class="input" style="display:flex; justify-content: center;">
            <h3 class="lable" style="width:136px ; text-align: left;">Movie ID:</h3>
            <input type="text" value="${movie.movieId}"  required name="id" readonly  style="width: 400px;height: 30px;margin: auto 20px;" >
        </div>
        <div class="input" style="display:flex; justify-content: center;">
            <h3 class="lable" style="width:136px ; text-align: left;">Movie name:</h3>
            <input type="text"  value="${movie.movieName}" required name="name"  style="width: 400px;height: 30px;margin: auto 20px;" >
        </div>
        <div class="input"style="display:flex; justify-content: center;">
            <h3 class="lable"style="width:136px ; text-align: left;">Small Image URL:</h3>
            <input type="text" value="${movie.smallImageURl}" name="smallImageUrl" style="width: 400px;height: 30px;margin: auto 20px;">
        </div>
        <div class="input"style="display:flex; justify-content: center;">
            <h3 class="lable"style="width:136px ; text-align: left;">Large Image URL:</h3>
            <input type="text" value="${movie.largeImageURL}" name="largeImageURL"  style="width: 400px;height: 30px;margin: auto 20px;">
        </div>
        <div class="input"style="display:flex; justify-content: center;">
            <h3 class="lable"style="width:136px ; text-align: left;">Short Description:</h3>
            <input type="text" value="${movie.shortDescription}" name="shortDescription"  style="width: 400px;height: 30px;margin: auto 20px;">
        </div>


        <div class="input"style="display:flex; justify-content: center;">
            <h3 class="lable"style="width:136px; text-align: left;">Long Description:</h3>
            <input type="text" value="${movie.longDescription}" name="longDescription" style="width: 400px;height: 60px;margin: auto 20px;">
        </div>

        <div class="input"style="display:flex; justify-content: center;">
            <h3 class="lable"style="width:136px ; text-align: left;">Director:</h3>
            <input type="text" value="${movie.director}" required name="director" style="width: 400px;height: 30px;margin: auto 20px;">
        </div>
        <div class="input"style="display:flex; justify-content: center;">
            <h3 class="lable"style="width:136px ; text-align: left;">Actor:</h3>
            <input type="text" value="${movie.actors}" name="actor" style="width: 400px;height: 30px;margin: auto 20px;">
        </div>
        <div class="input"style="display:flex; justify-content: center;">
            <h3 class="lable"style="width:136px ; text-align: left;">Category:</h3>
            <input type="text" value="${movie.categories}" name="Category" style="width: 400px;height: 30px;margin: auto 20px;">
        </div>
        <div class="input"style="display:flex; justify-content: center;">
            <h3 class="lable"style="width:136px ; text-align: left;">Release Date:</h3>
            <input type="datetime-local" value="${releaseDate}" required name="releaseDate" style="width: 400px;height: 30px;margin: auto 20px;">
        </div>
        <div class="input"style="display:flex; justify-content: center;">
            <h3 class="lable"style="width:136px ; text-align: left;">End Date:</h3>
            <input type="datetime-local" value="${endDate}" required name="endDate" style="width: 400px;height: 30px;margin: auto 20px;">
        </div>
        <div class="input"style="display:flex; justify-content: center;">
            <h3 class="lable"style="width:136px ; text-align: left;">Time(minutes):</h3>
            <input type="number" value="${movie.time}" required name="time" style="width: 400px;height: 30px;margin: auto 20px;">
        </div>
        <div class="input"style="display:flex; justify-content: center;">
            <h3 class="lable"style="width:136px ; text-align: left;">Trailer URL:</h3>
            <input type="text" value="${movie.trailerURL}" name="trailerURL" style="width: 400px;height: 30px;margin: auto 20px;">
        </div>
        <button style="min-width: 270px; min-height: 30px; background-color: red;">Update</button>
    </form>
</div>


</body>

</html>
