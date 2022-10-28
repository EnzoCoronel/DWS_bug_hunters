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
        return [factions[facChoice].name, factions[facChoice].id]; //olhar essa line. Transformar array em object
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

export const create = async () => {
  console.log("Tell me traveller, who's side are you on?");
  let factionArray = await form();
  let newName = await read("What is your name?\n"); //example for read user input
  clear();
  console.log(
    `Welcome ${newName} from the ${factionArray[0]} devs! You are now registered in our army.\n`
  );
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
