#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>

const int SENSOR_IN_PIN = 18;
const int SENSOR_OUT_PIN = 19;

const int SENSOR_ACTIVE_LEVEL = HIGH;
const unsigned long SEQUENCE_TIMEOUT_MS = 2000;

const char* WIFI_SSID = "Pk_internet";
const char* WIFI_PASSWORD = "123456789";
const char* MQTT_BROKER = "10.225.155.155";
const uint16_t MQTT_PORT = 1883;
const char* MQTT_TOPIC = "telemetry";
const char* DEVICE_ID = "esp32-test001";

int peopleCount = 0;

WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);

enum SequenceState {
  WAITING_FOR_FIRST_TRIGGER,
  IN_TRIGGERED_FIRST,
  OUT_TRIGGERED_FIRST
};

SequenceState sequenceState = WAITING_FOR_FIRST_TRIGGER;
unsigned long sequenceStartMs = 0;

int previousInState = LOW;
int previousOutState = LOW;

unsigned long lastWifiReconnectAttemptMs = 0;
unsigned long lastMqttReconnectAttemptMs = 0;
bool wifiConnectRequested = false;

const char* wifiStatusToText(wl_status_t status) {
  switch (status) {
    case WL_NO_SHIELD:
      return "WL_NO_SHIELD";
    case WL_IDLE_STATUS:
      return "WL_IDLE_STATUS";
    case WL_NO_SSID_AVAIL:
      return "WL_NO_SSID_AVAIL";
    case WL_SCAN_COMPLETED:
      return "WL_SCAN_COMPLETED";
    case WL_CONNECTED:
      return "WL_CONNECTED";
    case WL_CONNECT_FAILED:
      return "WL_CONNECT_FAILED";
    case WL_CONNECTION_LOST:
      return "WL_CONNECTION_LOST";
    case WL_DISCONNECTED:
      return "WL_DISCONNECTED";
    default:
      return "UNKNOWN";
  }
}

void onWiFiEvent(WiFiEvent_t event, WiFiEventInfo_t info) {
  switch (event) {
    case ARDUINO_EVENT_WIFI_STA_START:
      Serial.println("WiFi STA start");
      break;
    case ARDUINO_EVENT_WIFI_STA_CONNECTED:
      Serial.println("WiFi polaczony z AP");
      break;
    case ARDUINO_EVENT_WIFI_STA_GOT_IP:
      Serial.print("WiFi got IP: ");
      Serial.println(WiFi.localIP());
      break;
    case ARDUINO_EVENT_WIFI_STA_DISCONNECTED:
      Serial.print("WiFi rozlaczony, reason=");
      Serial.println(info.wifi_sta_disconnected.reason);
      wifiConnectRequested = false;
      break;
    default:
      break;
  }
}

bool isRisingEdge(int currentState, int previousState) {
  return currentState == SENSOR_ACTIVE_LEVEL && previousState != SENSOR_ACTIVE_LEVEL;
}

void publishPeopleCount();

void printPeopleCount() {
  Serial.print("Liczba osob w pomieszczeniu: ");
  Serial.println(peopleCount);
}

void connectWiFi() {
  if (WiFi.status() == WL_CONNECTED) {
    return;
  }

  const unsigned long now = millis();
  if (now - lastWifiReconnectAttemptMs < 5000) {
    return;
  }
  lastWifiReconnectAttemptMs = now;

  Serial.println("Laczenie z WiFi...");
  if (!wifiConnectRequested) {
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    wifiConnectRequested = true;
  } else {
    WiFi.reconnect();
  }
}

void connectMqtt() {
  if (!WiFi.isConnected()) {
    return;
  }

  if (mqttClient.connected()) {
    return;
  }

  const unsigned long now = millis();
  if (now - lastMqttReconnectAttemptMs < 5000) {
    return;
  }
  lastMqttReconnectAttemptMs = now;

  Serial.println("Laczenie z MQTT...");
  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);

  if (mqttClient.connect(DEVICE_ID)) {
    Serial.println("MQTT polaczony");
    publishPeopleCount();
  } else {
    Serial.print("MQTT blad, rc=");
    Serial.println(mqttClient.state());
  }
}

void publishPeopleCount() {
  if (!mqttClient.connected()) {
    return;
  }

  char payload[96];
  snprintf(payload, sizeof(payload), "{\"device_id\":\"%s\",\"count\":%d}", DEVICE_ID, peopleCount);
  mqttClient.publish(MQTT_TOPIC, payload);
  Serial.print("Wyslano MQTT: ");
  Serial.println(payload);
}


void setup() {
  pinMode(SENSOR_IN_PIN, INPUT);
  pinMode(SENSOR_OUT_PIN, INPUT);

  Serial.begin(115200);
  delay(200);
  Serial.println("Start licznika osob");

  WiFi.mode(WIFI_STA);
  WiFi.setSleep(false);
  WiFi.persistent(false);
  WiFi.setAutoReconnect(true);
  WiFi.onEvent(onWiFiEvent);
  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  wifiConnectRequested = true;

  previousInState = digitalRead(SENSOR_IN_PIN);
  previousOutState = digitalRead(SENSOR_OUT_PIN);
  printPeopleCount();
}

void loop() {
  connectWiFi();

  if (WiFi.status() != WL_CONNECTED && millis() - lastWifiReconnectAttemptMs < 1000) {
    Serial.print("WiFi status: ");
    Serial.println(wifiStatusToText(WiFi.status()));
  }

  if (WiFi.status() == WL_CONNECTED && WiFi.localIP() != INADDR_NONE) {
    static bool ipPrinted = false;
    if (!ipPrinted) {
      Serial.print("WiFi polaczony, IP: ");
      Serial.println(WiFi.localIP());
      ipPrinted = true;
    }
  }

  if (WiFi.isConnected()) {
    connectMqtt();
  }

  mqttClient.loop();

  const int inState = digitalRead(SENSOR_IN_PIN);
  const int outState = digitalRead(SENSOR_OUT_PIN);

  const bool inRising = isRisingEdge(inState, previousInState);
  const bool outRising = isRisingEdge(outState, previousOutState);

  const unsigned long now = millis();

  if (sequenceState != WAITING_FOR_FIRST_TRIGGER && (now - sequenceStartMs) > SEQUENCE_TIMEOUT_MS) {
    sequenceState = WAITING_FOR_FIRST_TRIGGER;
  }

  if (sequenceState == WAITING_FOR_FIRST_TRIGGER) {
    if (inRising) {
      sequenceState = IN_TRIGGERED_FIRST;
      sequenceStartMs = now;
    } else if (outRising) {
      sequenceState = OUT_TRIGGERED_FIRST;
      sequenceStartMs = now;
    }
  } else if (sequenceState == IN_TRIGGERED_FIRST) {
    if (outRising) {
      peopleCount++;
      printPeopleCount();
      publishPeopleCount();
      sequenceState = WAITING_FOR_FIRST_TRIGGER;
    }
  } else if (sequenceState == OUT_TRIGGERED_FIRST) {
    if (inRising) {
      if (peopleCount > 0) {
        peopleCount--;
      }
      printPeopleCount();
      publishPeopleCount();
      sequenceState = WAITING_FOR_FIRST_TRIGGER;
    }
  }

  previousInState = inState;
  previousOutState = outState;

  delay(10);
}

