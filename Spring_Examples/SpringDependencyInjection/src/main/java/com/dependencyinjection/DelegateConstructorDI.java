package com.dependencyinjection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DelegateConstructorDI {

	private final Allocator allocator;
	
	@Autowired
	public DelegateConstructorDI(Allocator allocator) {
		
		super();
		this.allocator = allocator;	
		System.out.println("Inside Delegator Constructor - Allocator Impl: "+ allocator.getClass().getSimpleName());
		
	};
	
	public void notifyUser() {
		allocator.taskAllocation("Niti");
	}
}
