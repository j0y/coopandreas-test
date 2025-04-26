import { connect } from "nats";

import { MovePlayerTask } from "../includes/MovePlayerTask"
import { SpawnPEDTask } from "../includes/SpawnPEDTask"
import { readIniFileWithAccessCheck } from "./tools/read-ini-file";
import { writeIniFile } from "./tools/write-ini-file";
import { Tasks } from "../includes/tasks";
import type { Command } from "./server";

const clientName = await getLastIniFilename();
const iniTaskFile = `../${clientName}.ini`
const nc = await connect({ servers: "nats://localhost:4222" });


// Broadcast client name
const publishMessage = () => {
  nc.publish("hello", clientName);
};
const interval = setInterval(publishMessage, 1000);

async function worker() {
  // Listen for requests
  let sub = nc.subscribe("compute." + clientName);
  const done = (async () => {
    for await (const msg of sub) {
      console.log(`${msg.string()} on subject ${msg.subject}`);
      let args: Command = JSON.parse(msg.data.toString());
      let task;
      if (args.task === Tasks.MovePlayer) {
        task = new MovePlayerTask()
      } else if (args.task === Tasks.SpawnPED) {
        task = new SpawnPEDTask()
      } else {
        continue;
      }
      await writeIniFile(iniTaskFile, task.Setup(args.params), {})
      let finished = false
      while (!finished) {
        const output = await readIniFileWithAccessCheck(iniTaskFile, { nothrow: true }) as { RESULT?: { Done?: number } }
        finished = output?.RESULT?.Done === 1
      }
      msg.respond(Buffer.from("1"));
    }
  })()


  console.log(`Worker ${clientName} is running...`);
}

worker();

async function getLastIniFilename() {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';

  for (let i = 0; i < alphabet.length; i++) {
    const filename = `../${alphabet[i]}.ini`;

    const file = Bun.file(filename);
    const exists = await file.exists();
    if (!exists && i > 0) {
      return alphabet[i - 1]
    }
  }

  return "last"; // not ideal
}
