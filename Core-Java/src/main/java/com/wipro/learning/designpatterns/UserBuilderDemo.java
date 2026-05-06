package com.wipro.learning.designpatterns;

public class UserBuilderDemo {

    public static void main(String[] args) {

        User user1 = new User.Builder()
                .setName("Vishal")
                .setEmail("vishal12@gmail.com")
                .setAge(22)
                .build();

        User user2 = new User.Builder()
                .setName("Aman")
                .setEmail("amanwipro@gmail.com")
                .setAge(23)
                .build();

        user1.display();
        System.out.println("------------------");
        user2.display();
    }
}

// Product Class
class User {

    private String name;
    private String email;
    private int age;

    // Private constructor
    private User(Builder builder) {
        this.name = builder.name;
        this.email = builder.email;
        this.age = builder.age;
    }

    public void display() {
        System.out.println("Name: " + name);
        System.out.println("Email: " + email);
        System.out.println("Age: " + age);
    }

    // Static Builder Class
    public static class Builder {

        private String name;
        private String email;
        private int age;

        public Builder setName(String name) {
            this.name = name;
            return this;
        }

        public Builder setEmail(String email) {
            this.email = email;
            return this;
        }

        public Builder setAge(int age) {
            this.age = age;
            return this;
        }

        public User build() {

            // Validation (important for interviews)
            if (name == null || email == null) {
                throw new IllegalStateException("Name and Email are required");
            }

            return new User(this);
        }
    }
}