// sends a message via bluetooth
//  from phone (or computer) to a raspberry pi pico w
//  which releases a dog treat!

const uart_service_uuid = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E".toLowerCase();
const characteristic_uuid =
  "6E400002-B5A3-F393-E0A9-E50E24DCCA9E".toLowerCase();
export async function getReleaseDevice() {
  try {
    const device = await navigator.bluetooth.requestDevice({
      // acceptAllDevices: true,
      filters: [{ name: "mpy-uart" }],
      optionalServices: [uart_service_uuid], // Required to access service later.
    });
    return device;
  } catch (e) {
    console.error(e);
    throw Error(e);
  }
}

export async function connectToReleaseDevice(device) {
  // Human-readable name of the device.
  console.log(device.name);

  // Attempts to connect to remote GATT Server.
  return await device.gatt.connect();
}

export async function sendReleaseMessage(server) {
  const service = await server.getPrimaryService(uart_service_uuid);
  // return service;
  const characteristic = await service.getCharacteristic(characteristic_uuid);

  const result = await characteristic.writeValue(Uint8Array.of(1));

  // .startNotifications().then(_ => {
  //     log('> Notifications started');
  //     myCharacteristic.addEventListener('characteristicvaluechanged',
  //         handleNotifications);
  //   });
  return result;
}
