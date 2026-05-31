package pl.presence.tracker.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.InfluxDBClientFactory;
import com.influxdb.client.WriteApi;
import com.influxdb.client.WriteOptions;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class InfluxDbConfig {

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }

    @Bean(destroyMethod = "close")
    public InfluxDBClient influxDBClient(
            @Value("${influx.url}") String url,
            @Value("${influx.token}") String token,
            @Value("${influx.org}") String org,
            @Value("${influx.bucket}") String bucket) {
        return InfluxDBClientFactory.create(url, token.toCharArray(), org, bucket);
    }

    @Bean(destroyMethod = "close")
    public WriteApi influxWriteApi(
            InfluxDBClient influxDBClient,
            @Value("${influx.write.batch-size:1000}") int batchSize,
            @Value("${influx.write.flush-interval-ms:1000}") int flushIntervalMs) {
        WriteOptions writeOptions = WriteOptions.builder()
                .batchSize(batchSize)
                .flushInterval(flushIntervalMs)
                .build();
        return influxDBClient.getWriteApi(writeOptions);
    }
}
