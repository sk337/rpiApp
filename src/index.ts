import { Gpio } from 'onoff';
import { getData } from './tide';


// declare I/O for 1602A-4 LCD

interface Config {
  RS: number;
  RW: number;
  E: number;
  DB0: number;
  DB1: number;
  DB2: number;
  DB3: number;
  DB4: number;
  DB5: number;
  DB6: number;
  DB7: number;
}

const defaultConfig: Config = {
  RS: 2,
  RW: 3,
  E: 4,
  DB0: 17,
  DB1: 27,
  DB2: 22,
  DB3: 10,
  DB4: 9,
  DB5: 11,
  DB6: 5,
  DB7: 6,
};



class lcd {
  RS: Gpio;
  RW: Gpio;
  E: Gpio;
  DB0: Gpio;
  DB1: Gpio;
  DB2: Gpio;
  DB3: Gpio;
  DB4: Gpio;
  DB5: Gpio;
  DB6: Gpio;
  DB7: Gpio;

  constructor(config: Config = defaultConfig) {
    this.RS = new Gpio(config.RS, 'out');
    this.RW = new Gpio(config.RW, 'out');
    this.E = new Gpio(config.E, 'out');
    this.DB0 = new Gpio(config.DB0, 'out');
    this.DB1 = new Gpio(config.DB1, 'out');
    this.DB2 = new Gpio(config.DB2, 'out');
    this.DB3 = new Gpio(config.DB3, 'out');
    this.DB4 = new Gpio(config.DB4, 'out');
    this.DB5 = new Gpio(config.DB5, 'out');
    this.DB6 = new Gpio(config.DB6, 'out');
    this.DB7 = new Gpio(config.DB7, 'out');
  }

  writeCharacterAtPosition(char: string, line: number, col: number) {
    // Calculate the position based on line and column
    let position = col + (line === 1 ? 0x80 : 0xC0);

    // Set the cursor position
    this.sendCommand(position);

    // Set RS to high to indicate character data
    this.RS.writeSync(1);

    // Write the character data
    this.sendData(char.charCodeAt(0));
  }

  // Function to send a command to the LCD
  sendCommand(command: number) {
    // Set RS to low to indicate command data
    this.RS.writeSync(0);

    // Send the command
    this.sendData(command);
  }

  // Function to send data to the LCD
  sendData(data: number) {
    // Set data pins with the value of 'data'
    this.DB0.writeSync(data & 0b00000001 ? 1 : 0);
    this.DB1.writeSync((data >> 1) & 0b00000001 ? 1 : 0);
    this.DB2.writeSync((data >> 2) & 0b00000001 ? 1 : 0);
    this.DB3.writeSync((data >> 3) & 0b00000001 ? 1 : 0);
    this.DB4.writeSync((data >> 4) & 0b00000001 ? 1 : 0);
    this.DB5.writeSync((data >> 5) & 0b00000001 ? 1 : 0);
    this.DB6.writeSync((data >> 6) & 0b00000001 ? 1 : 0);
    this.DB7.writeSync((data >> 7) & 0b00000001 ? 1 : 0);

    // Toggle the Enable (E) pin to send data
    this.toggleEnable();
  }

  // Function to toggle the Enable (E) pin
  toggleEnable() {
    this.E.writeSync(1);
    // Wait for a short delay
    setTimeout(() => {
      this.E.writeSync(0);
    }, 1); // Adjust this delay as needed
  }
  clear() {
    // Send the clear command to the LCD
    this.sendCommand(0x01);
  }
  writeLn(line: number, text: string) {
    this.clearLn(line);
    for (let i = 0; i < Math.min(text.length, 16); i++) {
      this.writeCharacterAtPosition(text[i], line, i);
    }
  }
  clearLn(line: number) {
    Array.from({ length: 16 }).forEach((_, i) => {
      this.writeCharacterAtPosition(" ", line, i);
    })
  }
}

const config: Config = {
  RS: 2+512,
  RW: 3+512,
  E: 4+512,
  DB0: 17+512,
  DB1: 27+512,
  DB2: 22+512,
  DB3: 10+512,
  DB4: 9+512,
  DB5: 11+512,
  DB6: 5+512,
  DB7: 6+512,
};
// Initialize the LCD
const panel = new lcd(config);


function format(input: number): string{
  if (input <= 0 && input > -1){
    return `${Math.ceil(input*12)} in`;
  } else {
    return `${input} ft`;
  }
}

async function mainLoop(panel: lcd){
  const tideData = await getData();
  // console.log(tideData[tideData.length - 1]);
  let text2Write = `Tide: ${format(tideData[tideData.length - 1].value)}`;
  console.log(text2Write);
  panel.writeLn(0, text2Write);
}

setInterval(mainLoop, 5000, panel);