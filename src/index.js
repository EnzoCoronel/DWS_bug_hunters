import read from "../resources/read.js";
import axios from "axios";
import { clear } from "console";

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
      let facList = await getApi("factions");
      const sortedFac = facList.map((element) => {
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
          `Oh, i can't believe it! Are you ${found.name} himself?\nPlease, come in!\n`
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

    let newName = await read("What is your name?\n"); //example for read user input
    clear();
    console.log(`Nice to meet you ${newName}!\n`);
    let persona = {
      atk: 10,
      def: 10,
      agi: 10,
      hp: 10,
      gold: 100,
      name: newName,
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
        factions.forEach((facn, index) => {
          console.log(`${index + 1} - ${facn.name}`);
        });
        facChoice = await read("");
        facChoice--;
        if (facChoice >= 0 && facChoice < 3) {
          return [factions[facChoice].name, factions[facChoice].id];
        } else {
          clear();
          console.error("Chose a valid option.");
        }
        facChoice++;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const quests = async () => {
    clear();
    console.log("select a quest:\n");
    let questList = await getApi("tasks");
    let bugList = await getApi("bugs");
    questList.forEach((questn, index) => {
      let bugHp = [1];
      questn.bugs.forEach((monstern) => {
        let bugn = bugList.filter((bug) => bug.id == monstern);
        bugHp.push(bugn[0].hp);
      });
      bugHp.shift();
      console.log(
        `${index + 1}: ${questn.name}\nDescription: ${
          questn.description
        }\nBug hp: ${bugHp}\nReward: ${questn.reward}\n`
      );
    });
  };

  const store = async (costumer) => {
    clear();
    console.log(
      `You want it? It's your's my friend! As long as you have enough gold.\nGold: ${costumer.gold}\n`
    );
    let equipList = await getApi("equipments");
    let buy = 1;
    while (buy != 0) {
      equipList.forEach((equipn, index) => {
        console.log(
          `${index + 1} - ${equipn.name}\nPrice: ${equipn.value} gold\nStat: +${
            equipn.affected_amount
          } ${equipn.affected_attribute}\n`
        );
      });
      buy = await read("0 - Exit");
      if (buy == 0) {
        clear();
        console.log("Take care out there my friend!");
        return 0;
      }
      let pick = equipList[buy - 1];
      if (pick.value <= costumer.gold) {
        costumer.equipments.push(pick);
        costumer.gold -= pick.value;
        clear();
        console.log(
          `Thanks for your Purchase! Do you want anything else?\nGold: ${costumer.gold}\n`
        );
      } else {
        console.log(
          `Sorry, ${costumer.name}. I can't give credit. Come back when you are a little... mmmmmm richer!`
        );
      }
    }
  };

  const stats = async (you) => {
    clear();
    let fatk = you.atk,
      fdef = you.def,
      fagi = you.agi,
      attribute,
      amount;
    you.equipments.forEach((item) => {
      amount = item.equipments_id.affected_amount;
      attribute = item.equipments_id.affected_attribute;
      if (attribute == "atk") {
        fatk += amount;
      } else if (attribute == "def") {
        fdef += amount;
      } else {
        fagi += amount;
      }
    });
    console.log(`Attack: ${fatk}\nDefense: ${fdef}\nAgility: ${fagi}\n`);
  };

  const menu = async () => {
    clear();
    let name, nav;
    name = await read("Do i remember you? Tell me your name.\n");
    clear();
    const user = await search(name);
    if (!user) return 0;
    while (nav != "0") {
      nav = await read(
        `\nWhat do you want to do now ${name}?\n1 - Stats\n2 - Store \n3 - Quests\n0 - Exit\n`
      );
      switch (nav) {
        case "1":
          await stats(user);
          break;
        case "2":
          await store(user);
          break;
        case "3":
          await quests();
          break;
        case "0":
          clear();
          console.log(`Goodbye ${name}. Until next time!`);
          break;
        default:
          clear();
          console.error("Chose a valid option.\n");
          break;
      }
    }
  };

  let choice;
  clear();

  while (choice != "0") {
    console.log("\n---------------\nDWS BUG HUNTERS\n---------------\n");
    choice = await read("1 - Create Character\n2 - Log in\n0 - Exit\n");
    switch (choice) {
      case "1":
        await create();
        break;
      case "2":
        await menu();
        break;
      case "0":
        clear();
        console.log("We will miss you!\n");
        break;
      default:
        clear();
        console.error("Chose a valid option.\n");
        break;
    }
  }
};

export default menu;
