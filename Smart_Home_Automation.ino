#include <SoftwareSerial.h>

SoftwareSerial BT(10, 11);

int relay = 8;

void setup()
{
  pinMode(relay, OUTPUT);

  digitalWrite(relay, HIGH);

  Serial.begin(9600);
  BT.begin(9600);

  Serial.println("System Ready");
}

void loop()
{
  if(BT.available())
  {
    char ch = BT.read();

    Serial.print("Received: ");
    Serial.println(ch);

    if(ch == '1')
    {
      digitalWrite(relay, LOW);
      Serial.println("Relay ON");
    }

    if(ch == '0')
    {
      digitalWrite(relay, HIGH);
      Serial.println("Relay OFF");
    }
  }
}