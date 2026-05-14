package com.dependencyinjection;

import org.springframework.stereotype.Component;

@Component
public class Manager  implements Allocator{

	Manager(){
		System.out.println("Manager Bean Created");
	}
	
	@Override
	public void taskAllocation(String user) {	
		System.out.println("Task is allocated by : Manager to user" + user);
	}

	
}
