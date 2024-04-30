import { existsSync, writeFileSync, readFileSync } from "fs";
import axios from "axios";

class tides{
  filePath: string;
  tideData: Array<{date: number; value:number;}>;

  constructor(filePath = "database.json") {
    this.filePath = filePath;

    if(!existsSync(filePath)){
      console.log("Database file not found. Creating a new one.")
      writeFileSync(filePath, JSON.stringify([]));
      this.tideData = [];
    } else {
      const data = readFileSync(filePath, "utf-8");
      try {
        this.tideData = JSON.parse(data);
      } catch {
        console.log("Database file is corrupted. Creating a new one.")
        writeFileSync(filePath, JSON.stringify([]));
        this.tideData = [];
      }
    }
  }

  saveData(){
    writeFileSync(this.filePath, JSON.stringify(this.tideData));
  }

  addData(value: number){
    this.tideData.push({date: Date.now(), value});
    this.saveData();
  }

  getLast5Minutes(){
    const now = Date.now();
    return this.tideData.filter(data => now - data.date < 5 * 60 * 1000);
  }
}



// harcon for further development
// https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations/9414501/harcon.json

interface Data {
  date: Date;
  value: number;
}

async function getData(): Promise<Data[]> {
  const startDate = new Date(Date.now() - 1000 * 60 * 60 * 12);
  const endDate = new Date();
  // console.log(startDate.toISOString());
  const url = "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?"+ new URLSearchParams({
    product: "water_level",
    begin_date: `${startDate.getFullYear()}${(startDate.getMonth()+1).toString().padStart(2,"0")}${startDate.getDate().toString().padStart(2,"0")} ${startDate.getHours().toString().padStart(2,"0")}:${startDate.getMinutes().toString().padStart(2,"0")}`,
    end_date: `${endDate.getFullYear()}${(endDate.getMonth()+1).toString().padStart(2,"0")}${endDate.getDate().toString().padStart(2,"0")} ${endDate.getHours().toString().padStart(2,"0")}:${endDate.getMinutes().toString().padStart(2,"0")}`,
    format: "json",
    time_zone: "LST_LDT",
    station: "9414523",
    datum:"MLLW",
    units:"english"
  });
  // console.log(url)
  const data = (await axios.get(url)).data.data as {t: string; v: string}[];
  return data.map(d => ({date: new Date(d.t), value: parseFloat(d.v)}));
}

export { getData }

export type {Data};