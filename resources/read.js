async function readlineSync() {
  return await new Promise((resolve, reject) => {
    process.stdin.once("data", (answer) => {
      resolve(answer.toString().replace("\n", ""));
    });
  });
}

const read = async (question) => {
  process.stdout.write(question.toString());
  const value = await readlineSync();
  return value;
};

export default read;
