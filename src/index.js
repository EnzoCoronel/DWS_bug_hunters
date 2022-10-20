import read from "../resources/read.js";

//your code goes here;
const menu = async () => {
  let choice = 2;
  while (choice != "0") {
    console.log("1 - Create Character\n 2- Log in\n 0 - Sair");
    choice = await read("Sua escolha:");

    switch (choice) {
      case "1":
        const nome = await read("Digite seu nome: "); //example for read user input
        console.log(`Olá ${nome}`);
        break;
      case "2":
        console.log("No data");
        break;
      case "0":
        console.log("Vamos sentir saudades!");
        break;
      default:
        console.error("Chose a valid option");
        break;
    }
  }
};

export default menu;