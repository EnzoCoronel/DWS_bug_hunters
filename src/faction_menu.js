import read from "../resources/read.js";
import { clear } from "console";
import { getApi, patchApi } from "./index.js";

export const join = async (rookie) => {
  const facList = await getApi("factions");
  let condition = 1;
  clear();
  console.log(
    "Due to the low amount of members, there is no fee to join a faction at the moment.\nWhich Faction do you want to join?\n"
  );
  facList.forEach((fac, index) => {
    console.log(`${index + 1} - ${fac.name}`);
  });
  let option = await read("0 - Exit\n");
  if (option == 0) {
    clear();
    return 0;
  }
  let unite = option - 1;
  if (unite < 0 || unite > 2) {
    clear();
    console.log("UI/UX faction is currently unavailable.\n");
  } else {
    rookie.factions.forEach((element) => {
      if (element.name == facList[unite].name) {
        clear();
        console.log(`You already are a ${element.name} Dev.`);
        condition = 0;
      }
    });
    if (condition) {
      console.log(`Welcome to the ${facList[unite].name} devs!`);
      rookie.factions.push(facList[unite]);
      await patchApi(
        {
          factions: rookie.factions,
          id: rookie.id,
        },
        `characters`
      );
    } else {
      console.log("Try to join another faction.\n");
    }
  }
};

export const leave = async (renegade) => {
  const facList = await getApi("factions");
  clear();
  console.log("Which faction do you want to leave?");
  renegade.factions.forEach((facn, index) => {
    console.log(`${index + 1} - ${facn.name}`);
  });
  let action = await read("0 - Exit\n");
  if (action == 0) {
    clear();
    return 0;
  }
  let depart = action - 1;
  if (depart < 0 || depart > renegade.factions.length - 1) {
    clear();
    console.log(
      "You can`t leave null. You will always be null in your heart.\n"
    );
  } else {
    console.log(
      `You leave ${renegade.factions[depart].name} devs. They will miss you... I think.`
    );
    renegade.factions.splice(depart, 1);
    await patchApi(
      {
        factions: renegade.factions,
        id: renegade.id,
      },
      `characters`
    );
  }
};
