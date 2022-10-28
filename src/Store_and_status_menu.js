import read from "../resources/read.js";
import { clear } from "console";
import { getApi, patchApi } from "./index.js";

export const stats = (you) => {
  clear();
  console.log("Inventory:");
  you.equipments.forEach((item) => {
    console.log(`${item.equipments_id.name}`);
  });
  console.log(
    `\nGold : ${you.gold}\n\nAttributes:\nHealth: ${you.hp}\nAttack: ${you.atk}\nDefense: ${you.def}\nAgility: ${you.agi}\n`
  );
};

export const addStats = (person, piece) => {
  let attribute, amount;
  amount = piece.equipments_id.affected_amount;
  attribute = piece.equipments_id.affected_attribute;
  if (attribute == "atk") {
    person.atk += amount;
  } else if (attribute == "def") {
    person.def += amount;
  } else if (attribute == "agi") {
    person.agi += amount;
  } else {
    person.hp += amount;
  }
};

export const store = async (custumer) => {
  clear();
  try {
    console.log(
      `You want it? It's your's my friend! As long as you have enough gold.\nGold: ${custumer.gold}\n`
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
      buy = await read("0 - Exit\n");
      if (buy == 0) {
        clear();
        console.log("Take care out there my friend!");
        break;
      }
      let pick = equipList[buy - 1];
      if (buy < 0 || buy > 10) {
        clear();
        console.log(
          "This item is out of stock. Do you want to buy anything else?\n"
        );
      } else {
        if (pick.value <= custumer.gold) {
          let parameter = { equipments_id: pick };
          custumer.equipments.push(parameter);
          custumer.gold -= pick.value;
          await patchApi({ gold: custumer.gold }, `characters/${custumer.id}`);
          await patchApi(
            { equipments: custumer.equipments },
            `characters/${custumer.id}`
          );
          addStats(custumer, parameter);
          clear();
          console.log(
            `Thanks for your Purchase! Do you want anything else?\nGold: ${custumer.gold}\n`
          );
        } else {
          console.log(
            `Sorry, ${custumer.name}. I can't give credit. Come back when you are a little... mmmmmm richer!\n\nGold: ${custumer.gold}\n`
          );
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
};
