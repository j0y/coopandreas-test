import { connect } from "nats";

const N_ClIENTS = 1;
let Clients: string[] = [];

const nc = await connect({ servers: "nats://localhost:4222" });

let sub = nc.subscribe("hello");
for await (const msg of sub) {
    const name = msg.data.toString()
    console.log(`connected ${name}`);
    Clients = [...Clients, name]
    if (Clients.length === N_ClIENTS) {
        break;
    }
}

const delay = (durationMs: number) => {
    return new Promise(resolve => setTimeout(resolve, durationMs));
}
await delay(7000);

async function basicTask() {
    for (const clientName of Clients) {
        try {
            let response = await nc.request("compute." + clientName, JSON.stringify({ a: 5, b: 10 }), { timeout: 4000 });
            console.log("Received:", response.data.toString());
        } catch (error) {
            console.error(`Timeout or error for ${clientName}:`, error);
        }
    }
}

await basicTask();
await nc.close();
