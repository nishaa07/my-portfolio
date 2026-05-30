int trigPin = 6;
int echoPin = 7;
int led = 4;
int buzzer = 5;
long duration;
int distanceCm;

void setup()
{ 
  Serial.begin(9600); 

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  pinMode(led, OUTPUT);
  pinMode(buzzer, OUTPUT);
}

void loop()
{
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);

  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  duration = pulseIn(echoPin, HIGH);
  distanceCm = duration * 0.034 / 2;

  Serial.println("Distance: ");
  Serial.println(distanceCm);
  delay (100);

  if(distanceCm < 40)
  {
    digitalWrite(buzzer, HIGH);
    digitalWrite(led, HIGH);
  }
  else
  {
      digitalWrite(buzzer, LOW);
      digitalWrite(led, LOW);
  }
}