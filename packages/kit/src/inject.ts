import path from "path";

export const main = async () => {
  const server = Bun.file("server.ts");
  const output = Bun.file(path.join(process.cwd(), ".wavekit", "server.ts"));
  await Bun.write(output, server);
};

main();
