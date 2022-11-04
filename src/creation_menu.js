import read from "../resources/read.js";
import { clear } from "console";
import { getApi, postApi } from "./index.js";

const form = async () => {
  let facChoice = 5;
  try {
    while (facChoice < 1 || facChoice > 3) {
      const factions = await getApi("factions");
      factions.forEach((facn, index) => {
        console.log(`${index + 1} - ${facn.name}`);
      });
      facChoice = await read("");
      facChoice--;
      if (facChoice >= 0 && facChoice < 3) {
        return { name: factions[facChoice].name, id: factions[facChoice].id }; //olhar essa line. Transformar array em object
      } else {
        clear();
        console.error("Chose a valid option.");
      }
      facChoice++;
    }
  } catch (error) {
    console.error(error);
  }
};

export const create = async () => {
  console.log("Tell me traveller, who's side are you on?");
  let faction = await form();
  let newName = await read("What is your name?\n"); //example for read user input
  clear();
  console.log(
    `Welcome ${newName} from the ${faction.name} devs! You are now registered in our army.\n`
  );
  let persona = {
    name: newName,
    hp: 100,
    atk: 10,
    def: 10,
    agi: 10,
    gold: 100,
    factions: [
      {
        id: faction.id,
        name: faction.name,
      },
    ],
    equipment: [],
  };
  try {
    await postApi(persona, "characters");
  } catch (error) {
    console.error(error);
  }
};
