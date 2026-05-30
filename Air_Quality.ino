#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

int mq135 = A0;
int led = 7;
int buzzer = 8;

int threshold = 500;

void setup()
{
    pinMode(led, OUTPUT);
    pinMode(buzzer, OUTPUT);

    Serial.begin(9600);

    lcd.init();
    lcd.backlight();

    lcd.setCursor(0,0);
    lcd.print("Air Quality");
    delay(2000);
    lcd.clear();
}

void loop()
{
    int airValue = analogRead(mq135);

    Serial.print("Air Value: ");
    Serial.println(airValue);

    lcd.setCursor(0,0);
    lcd.print("Air:");
    lcd.print(airValue);

    if(airValue > threshold)
    {
        digitalWrite(led, HIGH);
        digitalWrite(buzzer, HIGH);

        lcd.setCursor(0,1);
        lcd.print("AIR BAD!");
    }
    else
    {
        digitalWrite(led, LOW);
        digitalWrite(buzzer, LOW);

        lcd.setCursor(0, 1);
        lcd.print("AIR GOOD");
    }

    delay(500);
}