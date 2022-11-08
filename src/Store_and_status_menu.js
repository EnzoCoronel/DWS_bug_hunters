import read from "../resources/read.js";
import { clear } from "console";
import { getApi, patchApi } from "./index.js";

export const stats = (you) => {
  clear();
  console.log("Inventory:");
  if (you.equipment) {
    you.equipment.forEach((item) => {
      console.log(`${item.name}`);
    });
  }
  console.log(
    `\nGold : ${you.gold}\n\nAttributes:\nHealth: ${you.hp}\nAttack: ${you.atk}\nDefense: ${you.def}\nAgility: ${you.agi}\n`
  );
  let facName = [];
  you.factions.forEach((fac) => {
    facName.push(fac.name);
  });
  console.log(`You are a member of ${facName} devs.\n`);
};

export const changeStats = (person, piece, mod) => {
  let attribute, amount;
  amount = piece.affected_amount;
  attribute = piece.affected_attribute;
  if (mod == 1) {
    if (attribute == "atk") person.atk += amount;
    else if (attribute == "def") person.def += amount;
    else if (attribute == "agi") person.agi += amount;
    else person.hp += amount;
  } else {
    if (attribute == "atk") person.atk -= amount;
    else if (attribute == "def") person.def -= amount;
    else if (attribute == "agi") person.agi -= amount;
    else person.hp -= amount;
  }
};

export const store = async (customer) => {
  clear();
  try {
    console.log(
      `You want it? It's your's my friend! As long as you have enough gold.\nGold: ${customer.gold}\n`
    );
    let equipList = await getApi("equipment");
    let buy = 1;
    while (buy != 0) {
      console.log(`             *%%#,,,/%%%.,./%%#,,,/%%%..,*%%%,.,*%%%*,,,#%%.
            #%#/.,./%##,...%%#(.../%#%....#%#(.../%##*...#%%(
         .###(....#%##....(###....(###*...*###/...,#%#(...,###(
      .####,....####*... %%##*....####(....(%##(..../###(..../#%#(
 .*####*.. .,####(.....(####*....,#####... .#####*....*####(..  ,/###(*
.%%%%#******#%%%%**,**/%%%%%*****/%%%%%*****/%%%%%*****(%%%%#*****/%%%%#
.%%%%#,,,,,,#%%%#,,,,,*#%%%#,,,,,*#%%%#,,,,,*#%%%#.,,,,/%%%%#,,,,,/%%%%#
 ,(#(, ...,/*(#(. .... *##(,  ... ,##(. ...  *##(. ...  *##/**..., *##(.
       *,.,*                                                ,, ,,*\n`);
      equipList.forEach((equipn, index) => {
        console.log(
          ` ${index + 1} - ${equipn.name}\n Price: ${equipn.value} gold\n Stat: +${
            equipn.affected_amount
          } ${equipn.affected_attribute}\n`
        );
      });
      console.log(`      ,,//**************************************************//*,,
    ****************************************************************,
   ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
     .*************************************************************\n`);
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
        if (pick.value <= customer.gold) {
          let parameter = pick;
          customer.equipment.push(parameter);
          customer.gold -= pick.value;
          await patchApi(
            {
              gold: customer.gold,
              equipment: customer.equipment,
              id: customer.id,
            },
            `characters`
          );
          changeStats(customer, parameter, 1);
          clear();
          console.log(
            `Thanks for your Purchase! Do you want anything else?\nGold: ${customer.gold}\n`
          );
        } else {
          console.log(
            `Sorry, ${customer.name}. I can't give credit. Come back when you are a little... mmmmmm richer!\n\nGold: ${customer.gold}\n`
          );
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
};
