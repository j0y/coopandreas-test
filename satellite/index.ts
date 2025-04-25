import {connect} from "nats";


async function server() {
  const nc = await connect({ servers: "nats://localhost:4222" });

  // Listen for requests
  let sub = nc.subscribe("compute.sum");
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
