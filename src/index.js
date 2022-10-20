import read from "../resources/read.js";
import axios from "axios";

//your code goes here;
const menu = async () => {
  const api = "https://ir39vnlo.directus.app/items/";
  const getApi = async (item) => {
    const response = (await axios.get(api + item)).data.data;
    return response;
  };

  const postApi = async (userName, userFaction, fac_id, item) => {
    const response = (await axios.post(api + item).data,  {
      "atk": 10,
      "def": 10,
      "agi": 10,
      "hp": 10,
      "gold": 100,
      "name": userName,
      "factions": [
        {
          "factions_id": {
            "id": fac_id,
            "name": userFaction
          }
        }
      ],
      "equipments": [
        {
          "equipments_id": {
            "id": 4,
            "name": "Excalibug",
            "affected_attribute": "atk",
            "affected_amount": 50,
            "value": 5000
          }
        }
      ]
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
        let faction = '';
        switch (numFaction) {
          case "1":
            faction = 'Frontend';
            break;
            case "2":
              faction = 'Backend';
              break;
            case "13":
              faction = 'Mobile';
            break;
          default:
            console.error("Chose a valid option");
            break;
        }
        console.log(`Welcome ${faction} dev!`);

        const name = await read("What is your name?\n"); //example for read user input
        console.log(`Nice to meet you ${name}!`);

        try{
          const print = await postApi(name, faction, numFaction,"characters?fields=*,equipments.equipments_id.*,factions.factions_id.*")
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

