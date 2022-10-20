import read from "../resources/read.js";
import axios from "axios";

//your code goes here;
const menu = async () => {
  const api = "https://ir39vnlo.directus.app/items/";
  const getFac = async (fac) => {
    const response = (
      await axios.get(api + fac)
    ).data;
    return response;
  }

  let choice = 2;

  while (choice != "0") {
    choice = await read("1 - Create Character\n 2- Log in\n 0 - Exit");
    switch (choice) {
      case "1":
        try {
          const factions = await getFac("factions");
          console.log(factions);
        } catch (error) {
          console.log(error);
        }
        const nome = await read("Type your name: "); //example for read user input
        console.log(`Olá ${nome}`);
        break;
      case "2":
        console.log("No data");
        break;
      case "0":
        console.log("We will miss you!");
        break;
      default:
        console.error("Chose a valid option");
        break;
    }
  }
};

export default menu;
