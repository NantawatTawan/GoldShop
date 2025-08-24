package com.maneelak.stockpawn;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class StockpawnApplication {

	public static void main(String[] args) {
		SpringApplication.run(StockpawnApplication.class, args);
	}

}
