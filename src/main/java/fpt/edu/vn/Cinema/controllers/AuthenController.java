package fpt.edu.vn.Cinema.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import javax.servlet.http.HttpServletRequest;

@Controller
public class AuthenController {
    @GetMapping("/login")
    public String login(){
        return "login";
    }

    @PostMapping("/login")
    public String login(HttpServletRequest request){
       String user = request.getParameter("uname");
       String pwd = request.getParameter("psw");
       if(user.equals("admin") && pwd.equals("admin")){
           request.getSession().setAttribute("login", 1);
           return "redirect:/";
       } else {
           return "redirect:/login?error=1";
       }
    }
}
