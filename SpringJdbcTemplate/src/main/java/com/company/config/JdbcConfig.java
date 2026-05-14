package com.company.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;

@Configuration
@ComponentScan("com.company.dao")
public class JdbcConfig {

    @Bean("dataSource")
    public DataSource getDataSource() {

        DriverManagerDataSource dataSource =
                new DriverManagerDataSource();

        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");

        dataSource.setUrl(
                "jdbc:mysql://localhost:3306/hibernate_db"
        );

        dataSource.setUsername("root");

        dataSource.setPassword("root");

        return dataSource;
    }

    @Bean("jdbcTemplate")
    public JdbcTemplate getJdbcTemplate() {

        JdbcTemplate jdbcTemplate =
                new JdbcTemplate();

        jdbcTemplate.setDataSource(getDataSource());

        return jdbcTemplate;
    }
}