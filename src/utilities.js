import { getApi } from "./index.js";

export const search = async (criteria) => {
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

export const genRandNum = (max) => Math.floor(Math.random() * max);