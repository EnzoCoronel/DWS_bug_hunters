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
    const response = await axios.post(api + item, character);
    return response;
  };

  const getFactions = async () => {
    try {
      let rawFac = await getApi("factions");
      const sortedFac = rawFac.map((element) => {
        //console.log(`${element.id} - ${element.name}`)
        const { id, name } = element;
        return { id, name };
      });
      return sortedFac;
    } catch (error) {
      console.log(error);
    }
  };

  const search = async (criteria) => {
    try {
      let charList = await getApi(
        "characters?fields=*,equipments.equipments_id.*,factions.factions_id.*"
      );
      let found = charList.find((char) => char.name === criteria);
      if (found) {
        console.log(
          `Oh, i can't believe it! Are you ${found.name} himself?\nPlease, come in!`
        );
        return found;
      } else {
        console.log("You are not registered in our army, sorry mate");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const create = async () => {
    console.log("Tell me traveller, who's side are you on?");
    let factionArray = await form();
    console.log(`Welcome ${factionArray[0]} dev!`);

    name = await read("What is your name?\n"); //example for read user input
    console.log(`Nice to meet you ${name}!\n`);
    let persona = {
      atk: 10,
      def: 10,
      agi: 10,
      hp: 10,
      gold: 100,
      name: name,
      factions: [
        {
          factions_id: {
            id: factionArray[1],
            name: factionArray[0],
          },
        },
      ],
      equipments: [],
    };
    try {
      const print = persona; //await postApi(persona, "characters?fields=*,equipments.equipments_id.*,factions.factions_id.*")
    } catch (error) {
      console.log(error);
    }
  };

  const form = async () => {
    let facChoice = 5;
    try {
      while (facChoice < 1 || facChoice > 3) {
        const factions = await getFactions();
        factions.forEach((element, index) => {
          console.log(`${index + 1} - ${element.name}`);
        });
        facChoice = await read("");
        facChoice--;
        if (facChoice >= 0 && facChoice < 3) {
          return [factions[facChoice].name, factions[facChoice].id];
        } else {
          console.error("Chose a valid option.");
        }
        facChoice++;
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log("DWS BUG HUNTERS\n");

  let choice, menu, name, facId, faction;

  while (choice != "0") {
    choice = await read("1 - Create Character\n2 - Log in\n0 - Exit\n");
    switch (choice) {
      case "1":
        await create();
        break;
      case "2":
        name = await read("Do i remember you? Tell me your name.\n");
        const user = await search(name);
        while (menu != "0") {
          menu = await read("1 - Stats\n2 - Store \n3 - Quests\n0 - Exit\n");
          switch (menu) {
            case "1":
              console.log(user);
              break;
            case "2":
            console.log("Store");
              break;
            case "3":
            console.log("Quests");
              break;
            default:
              console.error("Chose a valid option.\n");
              break;
          }
        }
        break;
      case "0":
        console.log("We will miss you!\n");
        break;
      default:
        console.error("Chose a valid option.\n");
        break;
    }
  }
};

export default menu;
