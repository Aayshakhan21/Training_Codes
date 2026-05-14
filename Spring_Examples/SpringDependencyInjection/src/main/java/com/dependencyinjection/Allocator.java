package com.dependencyinjection;

@FunctionalInterface
public interface Allocator {

	// method implemented by manager class while implementing the interface
	void taskAllocation(String user);
}
