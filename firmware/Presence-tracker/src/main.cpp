#include <Arduino.h>

const int SENSOR_IN_PIN = 18;
const int SENSOR_OUT_PIN = 19;

const int SENSOR_ACTIVE_LEVEL = HIGH;
const unsigned long SEQUENCE_TIMEOUT_MS = 2000;

int peopleCount = 0;

enum SequenceState {
  WAITING_FOR_FIRST_TRIGGER,
  IN_TRIGGERED_FIRST,
  OUT_TRIGGERED_FIRST
};

SequenceState sequenceState = WAITING_FOR_FIRST_TRIGGER;
unsigned long sequenceStartMs = 0;

int previousInState = LOW;
int previousOutState = LOW;

bool isRisingEdge(int currentState, int previousState) {
  return currentState == SENSOR_ACTIVE_LEVEL && previousState != SENSOR_ACTIVE_LEVEL;
}

void printPeopleCount() {
  Serial.print("Liczba osob w pomieszczeniu: ");
  Serial.println(peopleCount);
}


void setup() {
  pinMode(SENSOR_IN_PIN, INPUT);
  pinMode(SENSOR_OUT_PIN, INPUT);

  Serial.begin(115200);
  delay(200);
  Serial.println("Start licznika osob");

  previousInState = digitalRead(SENSOR_IN_PIN);
  previousOutState = digitalRead(SENSOR_OUT_PIN);
  printPeopleCount();
}

void loop() {
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
      sequenceState = WAITING_FOR_FIRST_TRIGGER;
    }
  } else if (sequenceState == OUT_TRIGGERED_FIRST) {
    if (inRising) {
      if (peopleCount > 0) {
        peopleCount--;
      }
      printPeopleCount();
      sequenceState = WAITING_FOR_FIRST_TRIGGER;
    }
  }

  previousInState = inState;
  previousOutState = outState;

  delay(10);
}

