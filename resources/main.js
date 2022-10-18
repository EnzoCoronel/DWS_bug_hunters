const run = async (menu) => {
  await menu();
  process.stdin.pause();
};

export default run;
