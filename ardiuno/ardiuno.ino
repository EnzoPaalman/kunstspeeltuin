const int buttonPin = 2;

bool buttonPressed = false;

void setup() {
  Serial.begin(115200);
  pinMode(buttonPin, INPUT_PULLUP);
}

void loop() {
  int buttonState = digitalRead(buttonPin);
  if (buttonState == LOW && !buttonPressed) {
    Serial.println("<fotogemaakt>");
    buttonPressed = true;
  } else if (buttonState == HIGH) {
    buttonPressed = false;
  }
}