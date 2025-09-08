package com.ras.web.api.advice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.ras") 
public class RasApplication {
  public static void main(String[] args) {
    SpringApplication.run(RasApplication.class, args);
  }
}
