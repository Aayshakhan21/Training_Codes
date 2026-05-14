package com.company.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/role")
public class ControllerClass {
	
	//@RequestMapping(path="/home", method=RequestMethod.GET)
	//It is returning only the view page and configuration is given in spring-servlet.xml ( dispatcherservlet will take a help of view resolver)
	@GetMapping("/message")
	public String home()
	{
		System.out.println("This is home URL");
		return "form";  //Return view page and view resolver will resolve this page
	}
	
	
	//Here it is returning both view + Model
	@GetMapping("/data")
	public String home(Model model)
	{
		System.out.println("This is data URL");
		model.addAttribute("name", "Niti Dwivedi");
		model.addAttribute("Designation", "Trainer");
		return "data";  //Return view page and view resolver will resolve this page
	}

}