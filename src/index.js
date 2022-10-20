import read from "../resources/read.js";
import axios from "axios";

//your code goes here;
const menu = async () => {
  const api = "https://ir39vnlo.directus.app/items/";
  const getApi = async (item) => {
    const response = (await axios.get(api + item)).data.data;
    return response;
  };

  const postApi = async (char, item) => {
    const response = (await axios.post(api + item).data, {
      name: username,
      factions: userFaction
    })
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
        const numFaction = await read("");
        let userFaction = '';
        switch (numFaction) {
          case "1":
            userFaction = 'Frontend';
            break;
            case "2":
              userFaction = 'Backend';
              break;
            case "13":
              userFaction = 'Mobile';
            break;
          default:
            console.error("Chose a valid option");
            break;
        }
        console.log(`Welcome ${userFaction} dev!`);

        const name = await read("What is your name?\n"); //example for read user input
        console.log(`Nice to meet you ${name}!`);

        try{
          const print = await postApi("characters?fields=*,equipments.equipments_id.*,factions.factions_id.*")
          console.log(print);
        } catch (error){
          console.log(error);
        }
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

