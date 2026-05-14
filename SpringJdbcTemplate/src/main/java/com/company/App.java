package com.company;

import com.company.beans.Todo;
import com.company.config.JdbcConfig;
import com.company.dao.TodoDao;
import com.company.dao.TodoDaoImpl;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import java.util.List;

public class App {

    public static void main(String[] args) {

        ApplicationContext context =
                new AnnotationConfigApplicationContext(
                        JdbcConfig.class
                );

        TodoDao dao =
                context.getBean(TodoDaoImpl.class);

        Todo todo =
                new Todo(
                        1,
                        "task1",
                        "Learn Java"
                );

        Todo todo1 =
                new Todo(
                        2,
                        "task2",
                        "Coding"
                );

        Todo todo2 =
                new Todo(
                        3,
                        "task3",
                        "Pushed to Github"
                );

        Todo todo3 =
                new Todo(
                        4,
                        "task4",
                        "Diployed on vercel"
                );

        dao.saveTodo(todo);
        dao.saveTodo(todo1);
        dao.saveTodo(todo2);
        dao.saveTodo(todo3);

        System.out.println(
                dao.getTodo(4)
        );

        dao.deleteTodo(4);

        List<Todo> todos =
                dao.getAllTodos();

        for (Todo t : todos) {

            System.out.println(t);
        }
    }
}