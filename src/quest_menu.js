import read from "../resources/read.js";
import { clear } from "console";
import { getApi, patchApi } from "./index.js";
import { genRandNum } from "./utilities.js";
import { changeStats } from "./Store_and_status_menu.js";

const battle = (enemy, player, playerDmg, enemyDmg) => {
  try {
    let turn;
    console.log(`You found ${enemy.name}!\n`);
    if (enemy.agi > player.agi) {
      console.log("The bug attacks first!\n");
      turn = 1;
    } else {
      console.log("You attack first!\n");
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
        turn = 0;
      } else {
        if (enemyDmg >= 0) {
          player.hp -= enemyDmg;
          console.log(`The bug deals ${enemyDmg} dmg to you\n`);
        } else {
          console.log(
            "This bug is so easy to you that it can't deal dmg to you\n"
          );
        }
        turn = 1;
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
    console.error(error);
  }
};

const mission = async (gamer, task) => {
  clear();
  let pDmg,
    bDmg,
    weak,
    b4battle = gamer.hp;
  let enemyList = task.bugs;
  enemyList.forEach((foe) => {
    pDmg = gamer.atk - foe.def;
    bDmg = foe.atk - gamer.def;
    if (pDmg <= 0) {
      weak = 1;
    } else if (gamer.hp > 0) {
      battle(foe, gamer, pDmg, bDmg);
    } else {
      console.log(
        "You start fainting, so you return to the base and leave behind an item!"
      );
    }
  });
  if (gamer.hp > 0 && weak != 1) {
    console.log(`You won ${task.reward} gold!\n`);
    gamer.gold += task.reward;
    await patchApi({ gold: gamer.gold, id: gamer.id }, "characters");
  } else if (gamer.hp <= 0) {
    if (gamer.equipment.length > 0) {
      let remove = genRandNum(gamer.equipment.length);
      console.log(`You lost ${gamer.equipment[remove].name}`);
      changeStats(gamer, gamer.equipment[remove], 0);
      gamer.equipment.splice(remove, 1);
      await patchApi(
        { equipment: gamer.equipment, id: gamer.id },
        "characters"
      );
    } else {
      console.log("You are so poor that you got nothing to lose!\n");
    }
  } else {
    console.log(
      `You are about to start the fight, but notice you are too weak and return to the base.\nYou need ${Math.abs(
        pDmg
      )} more dmg to fix the bug!`
    );
  }
  gamer.hp = b4battle;
};

export const quests = async (playerInfo) => {
  clear();
  let select = 1;
  try {
    let questList = await getApi("tasks");
    while (select != 0) {
      console.log("select a quest:\n");
      questList.forEach((questn, index) => {
        let bugName = [];
        questn.bugs.forEach((bug) => {
          bugName.push(bug.name);
        });
        let factionName = [];
        questn.factions.forEach((faction) => {
          factionName.push(faction.name);
        });
        console.log(
          `${index + 1}: ${questn.name}\nDescription: ${
            questn.description
          }\nBugs: ${bugName}\nReward: ${questn.reward}\nComplexity level: ${
            questn.complexity
          }\nFaction required: ${factionName}\n`
        );
      });
      select = await read("0 - Exit");
      if (select == 0) {
        clear();
        console.log(
          "Remember to come back at any time! The world needs to be saved!\n"
        );
        break;
      }
      if (select < 0 || select > 6) {
        clear();
        console.log(
          "We need you to do tasks, but please, select one that we have.\n"
        );
      } else {
        let found;
        questList[select - 1].factions.forEach((fac) => {
          if (playerInfo.factions.find((element) => element.name == fac.name)) {
            found = 1;
          }
        });
        if (found) {
          mission(playerInfo, questList[select - 1]);
        } else {
          clear();
          console.log(
            "You're not from the function we asked for, call another dev!\n"
          );
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
};
