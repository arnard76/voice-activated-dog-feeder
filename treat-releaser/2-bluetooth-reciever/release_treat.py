from machine import Pin
from servo import Servo, servo_Angle
import time

s1 = Servo(0)

def release_treat():
    led_pin = Pin("LED", Pin.OUT)
    led_pin.on()
    time.sleep(2)
    
    for i in range(0,180,30):
        servo_Angle(s1, i)
        time.sleep(0.05)
        
    for i in range(180,0,-10):
        servo_Angle(s1, i)
        time.sleep(0.05)
        
    led_pin.off()