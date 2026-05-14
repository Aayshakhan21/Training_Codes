package com.company;

import com.company.entity.Student;
import com.company.service.StudentService;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class App {

    public static void main(String[] args) {

        ApplicationContext ctx =
                new ClassPathXmlApplicationContext(
                        "applicationContext.xml");

        StudentService service =
                ctx.getBean(StudentService.class);

        service.create(
                new Student(
                        "Niti",
                        "niti@gmail.com",
                        "Python"
                )
        );

        service.create(
                new Student(
                        "Jatin",
                        "jatin@gmail.com",
                        "MySQL"
                )
        );

        System.out.println(service.list());

        System.out.println(service.get(1L));
    }
}