package pl.presence.tracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.context.annotation.Import;

import pl.presence.tracker.config.KafkaConfig;

@SpringBootApplication
@EnableKafka
@Import(KafkaConfig.class)
public class PresenceTrackerBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(PresenceTrackerBackendApplication.class, args);
	}

}
