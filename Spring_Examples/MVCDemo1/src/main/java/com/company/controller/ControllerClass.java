package com.company.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class ControllerClass {
	
	//@RequestMapping(path="/home", method=RequestMethod.GET)
	//It is returning only the view page and configuration is given in spring-servlet.xml ( dispatcherservlet will take a help of view resolver)
	@GetMapping("/message")
	public String home()
	{
		System.out.println("This is home URL");
		return "form";  //Return view page and view resolver will resolve this page
	}
	
	
	//Here it is returning both view + Model ( here in model we are setting dummy data)
	@GetMapping("/data")
	public String home(Model model)
	{
		System.out.println("This is data URL");
		model.addAttribute("name", "Niti Dwivedi");
		model.addAttribute("Designation", "Trainer");
		return "data";  //Return view page and view resolver will resolve this page
	}
	
	//Here it is returning both view + Model 
	//( here in model we are setting data by binding the form.jsp elements with the model class attributes i.e User)
	@RequestMapping(path="/display" , method=RequestMethod.POST)
	public String display(@ModelAttribute User user , Model model)
	{
		//From data is then setting into a model class object after binding with an entity class attribute
		System.out.println(user);
		model.addAttribute("namevalue", user);
		return "display";  //Return view page and view resolver will resolve this page
	}

}