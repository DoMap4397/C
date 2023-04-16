package fpt.edu.vn.Cinema.controllers;

import fpt.edu.vn.Cinema.models.Branch;
import fpt.edu.vn.Cinema.models.Movie;
import fpt.edu.vn.Cinema.repository.BranchRepository;
import fpt.edu.vn.Cinema.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Controller
public class BranchController {
    @Autowired
    private BranchRepository branchRepository;

    @RequestMapping(value = "/branchs", method = RequestMethod.GET)
    public String getAllMovies(ModelMap modelMap, HttpServletRequest request) {
        if(request.getSession().getAttribute("login") == null){
            return "redirect:/login";
        }
        Iterable<Branch> datas = branchRepository.findAll();
        modelMap.addAttribute("branchs", datas);
        return "branch";
    }

    @RequestMapping(value = "/branch/add", method = RequestMethod.GET)
    public String addMovie() {
        return "add-new-branch";
    }

    @RequestMapping(value = "/branch/delete/{id}", method = RequestMethod.GET)
    public String deleteMovie(@PathVariable("id") Integer id, HttpServletRequest request) {
        if(request.getSession().getAttribute("login") == null){
            return "redirect:/login";
        }
        branchRepository.deleteById(id);
        return "redirect:/branchs";
    }

    @RequestMapping(value = "/branch/detail/{id}", method = RequestMethod.GET)
    public String detailMovie(@PathVariable("id") Integer id, HttpServletRequest request) {
        if(request.getSession().getAttribute("login") == null){
            return "redirect:/login";
        }
        Branch branch = branchRepository.findById(id).orElse(null);

        request.setAttribute("branch", branch);

        return "detail-branch";
    }

    @RequestMapping(value = "/branch/edit/{id}", method = RequestMethod.POST)
    public String editMoviePost(@PathVariable("id") Integer id, HttpServletRequest request) {
        if(request.getSession().getAttribute("login") == null){
            return "redirect:/login";
        }
        Branch branch = new Branch();
        branch.setId(id);
        branch.setName(request.getParameter("name"));
        branch.setImgURL(request.getParameter("smallImageUrl"));
        branch.setDiaChi(request.getParameter("address"));
        branch.setPhoneNo(request.getParameter("phone"));
        branchRepository.save(branch);
        return "redirect:/branchs";
    }

    @RequestMapping(value = "/branch/add", method = RequestMethod.POST)
    public String addNewMovie(HttpServletRequest request) {
        if(request.getSession().getAttribute("login") == null){
            return "redirect:/login";
        }
        Branch branch = new Branch();
        branch.setName(request.getParameter("name"));
        branch.setImgURL(request.getParameter("smallImageUrl"));
        branch.setDiaChi(request.getParameter("address"));
        branch.setPhoneNo(request.getParameter("phone"));
        branchRepository.save(branch);
        return "redirect:/branchs";
    }
}
