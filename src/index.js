import read from "../resources/read.js";
import axios from "axios";

//your code goes here;
const menu = async () => {
  const api = "https://ir39vnlo.directus.app/items/";
  const getApi = async (fac) => {
    const response = (await axios.get(api + fac)).data.data;
    return response;
  };

  const printFactions = async () => {
    try {
      const rawFac = await getApi("factions");
      rawFac.forEach(element => {
        console.log(`${element.id} - ${element.name}`)
      });
      console.log(rawFac);
      return rawFac;
    } catch (error) {
      console.log(error);
    }
  };

  let choice = 2;

  while (choice != "0") {
    choice = await read("1 - Create Character\n 2 - Log in\n 0 - Exit");
    switch (choice) {
      case "1":
        console.log("Tell me traveller, who's side are you on?");
        const factions = await printFactions();
        const userFaction = await read("");
        switch (userFaction) {
          case "1":
            console.log(`Welcome Frontend dev!`);
            break;
            case "2":
              console.log(`Welcome Backend dev!`);
              break;
            case "13":
              console.log(`Welcome Mobile dev!`);
            break;
          default:
            console.error("Chose a valid option");
            break;
        }

        const name = await read("What is your name?\n"); //example for read user input
        console.log(`Nice to meet you ${name}!`);

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

