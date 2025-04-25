import { connect } from "nats";

const clientName = "a";
const nc = await connect({ servers: "nats://localhost:4222" });

nc.publish("hello", clientName);


async function server() {
  // Listen for requests
  let sub = nc.subscribe("compute." + clientName);
  const done = (async () => {
    for await (const msg of sub) {
      console.log(`${msg.string()} on subject ${msg.subject}`);
      let { a, b } = JSON.parse(msg.data.toString());
      msg.respond(Buffer.from(JSON.stringify({ result: a + b })));
    }
  })()


  console.log("Worker is running...");
}

server();
