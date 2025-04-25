import { connect } from "nats";

import { MovePlayerTask, type MovePlayerTaskParams } from "../includes/MovePlayerTask"
import { iniTaskFile } from "../includes/tasks";
import { readIniFile } from "./tools/read-ini-file";
import { writeIniFile } from "./tools/write-ini-file";


const clientName = "a";
const nc = await connect({ servers: "nats://localhost:4222" });

nc.publish("hello", clientName);


async function worker() {
  // Listen for requests
  let sub = nc.subscribe("compute." + clientName);
  const done = (async () => {
    for await (const msg of sub) {
      console.log(`${msg.string()} on subject ${msg.subject}`);
      let args: MovePlayerTaskParams = JSON.parse(msg.data.toString());
      const task = new MovePlayerTask()
      await task.Setup(writeIniFile, args)
      let finished = false
      while (!finished) {
        const output = await readIniFile("../" + iniTaskFile, { nothrow: true })
        finished = output?.RESULT?.Done === "1"
      }
      msg.respond(Buffer.from("1"));
    }
  })()


  console.log("Worker is running...");
}

worker();
