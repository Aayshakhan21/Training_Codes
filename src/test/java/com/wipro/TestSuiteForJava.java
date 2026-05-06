package com.wipro;

import org.junit.platform.suite.api.SelectClasses;

import org.junit.platform.suite.api.Suite;

	@Suite
	@SelectClasses({ TestAddition.class, TestStudent.class, PracticeTest.class, PracticeTest2.class })
	public class TestSuiteForJava {
	
	}
