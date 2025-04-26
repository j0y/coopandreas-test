import { connect } from "nats";
import { MovePlayerTask, type MovePlayerTaskParams } from "../includes/MovePlayerTask"

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

console.log(`start`);
const delay = (durationMs: number) => {
    return new Promise(resolve => setTimeout(resolve, durationMs));
}
await delay(1000);

async function basicTask() {
    for (const clientName of Clients) {
        try {
            let response = await nc.request("compute." + clientName, JSON.stringify({ x: 100, y: 100, z: 100 } as MovePlayerTaskParams), { timeout: 4000 });
            console.log("Received:", response.data.toString());
        } catch (error) {
            console.error(`Timeout or error for ${clientName}:`, error);
        }
    }
}

await basicTask();
await nc.close();
