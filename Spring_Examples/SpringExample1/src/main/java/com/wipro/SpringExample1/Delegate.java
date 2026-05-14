package com.wipro.SpringExample1;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class Delegate {

	
	private Allocator allocator ; 
	
	@Autowired
	public Delegate(Allocator allocator)
	{
		this.allocator = allocator;
	}
	
	public void notifyUser()
	{
	allocator.taskAllocation("Niti");
	}
}
