import read from "../resources/read.js";

//your code goes here;
const menu = async () => {
  let choice = 2;
  while (choice != "0") {
    choice = await read("1 - Create Character\n 2- Log in\n 0 - Exit");
    switch (choice) {
      case "1":
        const name = await read("Type your name"); //example for read user input
        console.log(`Hello ${name}`);
        break;
      case "2":
        console.log("No data");
        break;
      case "0":
        console.log("We will miss you!");
        break;
      default:
        console.error("Chose a valid option");
        break;
    }
  }
};

export default menu;