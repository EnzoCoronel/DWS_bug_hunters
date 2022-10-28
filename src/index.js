import read from "../resources/read.js";
import axios from "axios";
import { clear } from "console";
import { create } from "./creation_menu.js";
import { search } from "./utilities.js";
import { quests } from "./quest_menu.js";
import { stats, changeStats, store } from "./Store_and_status_menu.js";

const api = "https://ir39vnlo.directus.app/items/";

export const getApi = async (item) => {
  const response = (await axios.get(api + item)).data.data;
  return response;
};

export const postApi = async (character, item) => {
  const response = await axios.post(api + item, character);
  return response;
};

export const patchApi = async (equip, item) => {
  const response = await axios.patch(api + item, equip);
  return response;
};

const menu = async () => {
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
        await list();
        break;
      case "0":
        clear();
        break;
      default:
        clear();
        console.error("Chose a valid option.\n");
        break;
    }
  }
};

const list = async () => {
  clear();
  let name, nav;
  name = await read("Do i remember you? Tell me your name.\n");
  clear();
  const user = await search(name);
  if (!user) return 0;
  user.equipments.forEach((item) => {
    changeStats(user, item, 1);
  });
  while (nav != "0") {
    nav = await read(
      `What do you want to do now ${name}?\n1 - Stats\n2 - Store \n3 - Quests\n0 - Exit\n`
    );
    switch (nav) {
      case "1":
        stats(user);
        break;
      case "2":
        await store(user);
        break;
      case "3":
        await quests(user);
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

export default menu;
