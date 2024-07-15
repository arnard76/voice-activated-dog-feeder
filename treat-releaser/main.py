from machine import Pin
import bluetooth
import time
from led_peripheral import BLESimplePeripheral

def demo():
    led_onboard = Pin("LED", Pin.OUT)
    ble = bluetooth.BLE()
    p = BLESimplePeripheral(ble)
    
    def on_rx(v):
        print("RX", v)

    p.on_write(on_rx)
    while True:
        if p.is_connected():
            time.sleep_ms(2000)
        else:
            time.sleep_ms(100)
    
    


if __name__ == "__main__":
    demo()