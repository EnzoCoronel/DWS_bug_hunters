import read from "../resources/read.js";
import { clear } from "console";
import { getApi, patchApi } from "./index.js";
import { genRandNum } from "./utilities.js";
import { changeStats } from "./Store_and_status_menu.js";

const battle = (enemy, player, playerDmg, enemyDmg) => {
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
    console.log(error);
  }
};

const mission = async (gamer, task, enemies) => {
  clear();
  let pDmg,
    bDmg,
    weak,
    b4battle = gamer.hp;
  let enemyList = task.bugs.map(
    (bug) => (bug = enemies.find((x) => x.id == bug))
  );
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
    await patchApi({ gold: gamer.gold }, `characters/${gamer.id}`);
  } else if (gamer.hp <= 0) {
    if (gamer.equipments.length > 0) {
      let remove = genRandNum(gamer.equipments.length);
      console.log(`You lost ${gamer.equipments[remove].equipments_id.name}`);
      changeStats(gamer, gamer.equipments[remove], 0);
      gamer.equipments.splice(remove, 1);
      await patchApi(
        { equipments: gamer.equipments },
        `characters/${gamer.id}`
      );
    } else {
      console.log("You are so poor that you got nothing to lose!\n");
    }
  } else {
    console.log(
      "You are about to start the fight, but notice you are too weak and return to the base."
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
      let bugList = await getApi("bugs"); //make bug hp return to default
      console.log("select a quest:\n");
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
        break;
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
