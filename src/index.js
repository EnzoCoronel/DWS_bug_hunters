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

  const patchApi = async (equip, item) => {
    const response = await axios.patch(api + item, equip);
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

  const battle = async (enemy, player, playerDmg, enemyDmg) => {
    try {
      let turn;
      console.log(`You found ${enemy.name}!\n`);
      if (player.agi >= enemy.agi) {
        console.log("You attack first!\n");
        turn = 1;
      } else {
        console.log("The bug attacks first!\n");
        turn = 0;
      }
      while (player.hp > 0 && enemy.hp > 0) {
        console.log(`${player.name}: ${player.hp}\n${enemy.name}: ${enemy.hp}`);
        if (turn) {
          if (playerDmg >= 0) {
            enemy.hp -= playerDmg;
            console.log(`You dealt ${playerDmg} dmg to the bug\n`);
          } else {
            console.log("Your dmg is null against this bug!\n");
          }
          turn--;
        } else {
          if (enemyDmg >= 0) {
            player.hp -= enemyDmg;
            console.log(`The bug deals ${enemyDmg} dmg to you\n`);
          } else {
            console.log(
              "This bug is so easy to you that it can't deal dmg to you\n"
            );
          }
          turn++;
        }
      }
      if (enemy.hp <= 0) {
        console.log(`${player.name} wins! Congratulations.\n`);
      } else if (player.hp <= 0) {
        console.log(
          `${enemy.name} wins! Get up and ready to win the next time.\n`
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const mission = async (gamer, task, enemies) => {
    clear();
    let pDmg,
      bDmg,
      enemyList = [1],
      weak,
      b4battle = gamer.hp;
    task.bugs.forEach((enemyId) => {
      let enemyInfo = enemies.find((bug) => bug.id == enemyId);
      enemyList.push(enemyInfo);
    });
    enemyList.shift();
    enemyList.forEach(async (foe) => {
      pDmg = gamer.atk - foe.def;
      bDmg = foe.atk - gamer.def;
      if (pDmg <= 0) {
        weak = 1;
      } else if (gamer.hp > 0) {
        await battle(foe, gamer, pDmg, bDmg);
      } else {
        console.log(
          "You start fainting, so you return to the base and leave behind an item!"
        );
      }
    });
    if (gamer.hp > 0 && weak != 1) {
      console.log(`You won ${task.reward} gold!\n`);
      gamer.gold += task.reward;
      await patchApi({ gold: gamer.gold }, `characters/${gamer.id}`);
    } else if (gamer.hp <= 0) {
      if (gamer.equipments.length > 0) {
        let remove = Math.floor(Math.random() * gamer.equipments.length);
        console.log(`You lost ${gamer.equipments[remove].equipments_id.name}`);
        gamer.equipments.splice(remove, 1);
        await patchApi(
          { equipments: gamer.equipments },
          `characters/${gamer.id}`
        );
      } else {
        console.log("You are so poor that you got nothing to lose!\n");
      }
    }
    else {
      console.log(
        "You are about to start the fight, but notice you are too weak and return to the base."
      );
    }
    gamer.hp = b4battle;
  };

  const quests = async (playerInfo) => {
    clear();
    let select = 1;
    try {
      while (select != 0) {
        console.log("select a quest:\n");
        let questList = await getApi("tasks");
        let bugList = await getApi("bugs");
        questList.forEach((questn, index) => {
          let bugHp = [1];
          questn.bugs.forEach((monstern) => {
            //n sabia os bugs tinha a key task_id
            let bugn = bugList.find((bug) => bug.id == monstern);
            bugHp.push(bugn.hp);
          });
          bugHp.shift();
          console.log(
            `${index + 1}: ${questn.name}\nDescription: ${
              questn.description
            }\nBug hp: ${bugHp}\nReward: ${questn.reward}\nComplexity level: ${
              questn.complexity_level
            }\n`
          );
        });
        select = await read("0 - Exit");
        if (select == 0) {
          clear();
          console.log(
            "Remember to come back at any time! The world needs to be saved!\n"
          );
          return 0;
        }
        if (select < 0 || select > 6) {
          clear();
          console.log(
            "We need you to do missions, but please, select one that we have.\n"
          );
        } else {
          mission(playerInfo, questList[select - 1], bugList);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const store = async (costumer) => {
    clear();
    try {
      console.log(
        `You want it? It's your's my friend! As long as you have enough gold.\nGold: ${costumer.gold}\n`
      );
      let equipList = await getApi("equipments");
      let buy = 1;
      while (buy != 0) {
        equipList.forEach((equipn, index) => {
          console.log(
            `${index + 1} - ${equipn.name}\nPrice: ${
              equipn.value
            } gold\nStat: +${equipn.affected_amount} ${
              equipn.affected_attribute
            }\n`
          );
        });
        buy = await read("0 - Exit\n");
        if (buy == 0) {
          clear();
          console.log("Take care out there my friend!");
          return 0;
        }
        let pick = equipList[buy - 1];
        if (buy < 0 || buy > 10) {
          clear();
          console.log(
            "This item is out of stock. Do you want to buy anything else?\n"
          );
        } else {
          if (pick.value <= costumer.gold) {
            let parameter = { equipments_id: pick };
            costumer.equipments.push(parameter);
            costumer.gold -= pick.value;
            await patchApi(
              { gold: costumer.gold },
              `characters/${costumer.id}`
            );
            await patchApi(
              { equipments: costumer.equipments },
              `characters/${costumer.id}`
            );
            clear();
            console.log(
              `Thanks for your Purchase! Do you want anything else?\nGold: ${costumer.gold}\n`
            );
          } else {
            console.log(
              `Sorry, ${costumer.name}. I can't give credit. Come back when you are a little... mmmmmm richer!\n\nGold: ${costumer.gold}\n`
            );
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const stats = async (you) => {
    clear();
    let fatk = you.atk,
      fdef = you.def,
      fagi = you.agi,
      fhp = you.hp,
      attribute,
      amount;
    console.log("Inventory:");
    you.equipments.forEach((item) => {
      console.log(`${item.equipments_id.name}`);
      amount = item.equipments_id.affected_amount;
      attribute = item.equipments_id.affected_attribute;
      if (attribute == "atk") {
        fatk += amount;
      } else if (attribute == "def") {
        fdef += amount;
      } else if (attribute == "agi") {
        fagi += amount;
      } else {
        fhp += amount;
      }
    });
    console.log(
      `\nGold : ${you.gold}\n\nAttributes:\nHealth: ${fhp}\nAttack: ${fatk}\nDefense: ${fdef}\nAgility: ${fagi}\n`
    );
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
        `What do you want to do now ${name}?\n1 - Stats\n2 - Store \n3 - Quests\n0 - Exit\n`
      );
      switch (nav) {
        case "1":
          await stats(user);
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
