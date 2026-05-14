package com.company.dao;

import com.company.beans.Todo;

import java.util.List;

public interface TodoDao {

    int saveTodo(Todo todo);

    int updateTodo(Todo todo);

    int deleteTodo(int id);

    Todo getTodo(int id);

    List<Todo> getAllTodos();
}