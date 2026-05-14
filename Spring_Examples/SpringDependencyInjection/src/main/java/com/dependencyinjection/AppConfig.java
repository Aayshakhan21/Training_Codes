package com.dependencyinjection;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

//spring container will know that this is configuration file with this annotation
// this annotation will tell the package name where your

@Configuration
@ComponentScan(basePackages ="com.dependencyinjection;")
public class AppConfig {

}
