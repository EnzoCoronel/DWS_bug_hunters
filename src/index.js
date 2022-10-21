import read from "../resources/read.js";
import axios from "axios";

//your code goes here;
const menu = async () => {
  const api = "https://ir39vnlo.directus.app/items/";
  const getApi = async (item) => {
    const response = (await axios.get(api + item)).data.data;
    return response;
  };

  const postApi = async (character, item) => {
    const response = await axios.post (api + item, character)
    return response;
  };

  const getFactions = async () => {
    try {
      let rawFac = await getApi("factions");
      const sortedFac = rawFac.map(element => {
        //console.log(`${element.id} - ${element.name}`)
        const {id, name} = element;
        return {id, name};
      });
      return sortedFac;
    } catch (error) {
      console.log(error);
    }
  };

  let choice;

  while (choice != "0") {
    choice = await read("1 - Create Character\n 2 - Log in\n 0 - Exit");
    switch (choice) {
      case "1":
        console.log("Tell me traveller, who's side are you on?");
        const factions = await getFactions();
        factions.forEach((element, index) => {
          console.log(index + " - " + element.name);
        });

        let faction;
        let facId;
        let facChoice = await read("");
        switch (facChoice) {
          case "0":
            faction = factions[0].name;
            facId = factions[0].id;
            break;
            case "1":
              faction = factions[1].name;
              facId = factions[1].id;
              break;
            case "2":
              faction = factions[2].name;
              facId = factions[2].id;
            break;
          default:
            console.error("Chose a valid option");
            break;
        }
        console.log(`Welcome ${faction} dev!`);

        const name = await read("What is your name?\n"); //example for read user input
        console.log(`Nice to meet you ${name}!`);
        let user = {
          "atk": 10,
          "def": 10,
          "agi": 10,
          "hp": 10,
          "gold": 100,
          "name": name,
          "factions": [
            {
              "factions_id": {
                "id": facId,
                "name": faction
              }
            }
          ],
          "equipments": []
        };
        try{
          const print = await postApi(user, "characters?fields=*,equipments.equipments_id.*,factions.factions_id.*")
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