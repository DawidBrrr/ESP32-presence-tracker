package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"sync"
	"syscall"
	"time"

	mqtt "github.com/eclipse/paho.mqtt.golang"
)

type RegisterPayload struct {
	ID    string `json:"id"`
	Token string `json:"token"`
}

type TelemetryPayload struct {
	DeviceID string `json:"device_id"`
	Count    int    `json:"count"`
}

var (
	restURL  = getEnv("REST_URL", "http://host.docker.internal:8080")
	mqttURL  = getEnv("MQTT_URL", "tcp://host.docker.internal:1883")
	maxDevs  = getEnvAsInt("MAX_DEVICES", 1000)
	mqttTopic = getEnv("MQTT_TOPIC", "telemetry")
)

func getEnv(key, defaultVal string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultVal
}

func getEnvAsInt(name string, defaultVal int) int {
	valStr := getEnv(name, "")
	if val, err := strconv.Atoi(valStr); err == nil {
		return val
	}
	return defaultVal
}

func main() {
	log.Printf("Starting StressTester. MAX_DEVICES=%d, REST_URL=%s, MQTT_URL=%s\n", maxDevs, restURL, mqttURL)

	stopChan := make(chan os.Signal, 1)
	signal.Notify(stopChan, os.Interrupt, syscall.SIGTERM)

	var wg sync.WaitGroup
	ticker := time.NewTicker(time.Minute)
	defer ticker.Stop()

	currentDevices := 0
	
	// Start initial batch
	currentDevices = addDevices(currentDevices, 100, &wg)

	for {
		select {
		case <-stopChan:
			log.Println("Interrupt received, shutting down gracefully...")
			return
		case <-ticker.C:
			if currentDevices >= maxDevs {
				log.Printf("Reached MAX_DEVICES cap (%d). Steady state.\n", maxDevs)
				continue
			}

			increment := 100
			if currentDevices >= 1000 {
				increment = 1000
			}

			if currentDevices+increment > maxDevs {
				increment = maxDevs - currentDevices
			}

			currentDevices = addDevices(currentDevices, increment, &wg)
		}
	}
}

func addDevices(current int, increment int, wg *sync.WaitGroup) int {
	log.Printf("[Ramp-up] Adding %d new devices... (Total will be %d)\n", increment, current+increment)
	for i := 0; i < increment; i++ {
		deviceID := fmt.Sprintf("esp32-%07d", current+i+1)
		wg.Add(1)
		go runDevice(deviceID, wg)
		// Slight sleep to avoid overwhelming the HTTP API concurrently during ramp-up
		time.Sleep(10 * time.Millisecond)
	}
	return current + increment
}

func runDevice(deviceID string, wg *sync.WaitGroup) {
	defer wg.Done()

	// 1. HTTP Registration
	err := registerDevice(deviceID)
	if err != nil {
		log.Printf("[%s] Registration failed: %v\n", deviceID, err)
		return
	}

	// 2. MQTT Connection
	opts := mqtt.NewClientOptions()
	opts.AddBroker(mqttURL)
	opts.SetClientID(deviceID)
	opts.SetAutoReconnect(true)
	opts.SetConnectionLostHandler(func(c mqtt.Client, e error) {
		log.Printf("[%s] Connection lost: %v", deviceID, e)
	})

	client := mqtt.NewClient(opts)
	if token := client.Connect(); token.Wait() && token.Error() != nil {
		log.Printf("[%s] MQTT connect error: %v\n", deviceID, token.Error())
		return
	}
	defer client.Disconnect(250)

	// 3. Telemetry Loop
	ticker := time.NewTicker(100 * time.Millisecond) // 0.1s
	defer ticker.Stop()

	payload := TelemetryPayload{
		DeviceID: deviceID,
		Count:    7, // Static count as requested
	}

	for range ticker.C {
		jsonBytes, _ := json.Marshal(payload)
		token := client.Publish(mqttTopic, 0, false, jsonBytes)
		// We don't wait for token to maximize throughput and avoid blocking on ACK
		// token.Wait()
		_ = token
	}
}

func registerDevice(deviceID string) error {
	payload := RegisterPayload{
		ID:    deviceID,
		Token: "dev-7b3c2f9a",
	}
	jsonData, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	url := fmt.Sprintf("%s/api/devices/register", restURL)
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return fmt.Errorf("HTTP status %d", resp.StatusCode)
	}

	return nil
}
