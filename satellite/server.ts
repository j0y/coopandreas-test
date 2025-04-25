import {connect} from "nats";

const nc = await connect({ servers: "nats://localhost:4222" });

// Send a request and await the response
let response = await nc.request("compute.sum", JSON.stringify({ a: 5, b: 10 }), {timeout: 4000});

console.log("Received:", response.data.toString());
await nc.close();