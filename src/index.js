import read from "../resources/read.js";

//your code goes here;
const menu = async () => {
  const nome = await read("Digite seu nome: "); //example for read user input
  console.log(`Olá ${nome}`);
};

export default menu;
