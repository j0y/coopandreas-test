import { connect } from "nats";
import { type MovePlayerTaskParams } from "../includes/MovePlayerTask"
import { Tasks } from "../includes/tasks";

export interface Command {
    task: Tasks,
    params: MovePlayerTaskParams,
}

let Clients: string[] = [];

const nc = await connect({ servers: "nats://localhost:4222" });

let sub = nc.subscribe("hello");
const timeout = setTimeout(async () => {
    sub.unsubscribe();
    console.log("Collected clients:", Clients);
}, 2000); // Stop collecting messages after 5 seconds

console.log("Listening for clients...");

for await (const msg of sub) {
    const name = msg.data.toString()
    if (Clients.includes(name)) {
        continue;
    }
    console.log(`connected ${name}`);
    Clients = [...Clients, name]
}

console.log(`start`);
const delay = (durationMs: number) => {
    return new Promise(resolve => setTimeout(resolve, durationMs));
}
await delay(1000);


const commandToString = (data: Command): string => {
    return JSON.stringify(data)
}

async function MoveAllPlayers(x: number, y: number) {
    for (const [index, clientName] of Clients.entries()) {
        try {
            let response = await nc.request("compute." + clientName, commandToString({ task: Tasks.MovePlayer, params: { x: x + index * 2, y: y + index * 2, z: 1 } }), { timeout: 4000 });
            console.log("Received:", response.data.toString());
        } catch (error) {
            console.error(`Timeout or error for ${clientName}:`, error);
        }
    }
}
async function SpawnPED(clientName: string, x: number, y: number) {
    try {
        let response = await nc.request("compute." + clientName, commandToString({ task: Tasks.SpawnPED, params: { x, y, z: 1 } }), { timeout: 4000 });
        console.log("Received:", response.data.toString());
    } catch (error) {
        console.error(`Timeout or error for ${clientName}:`, error);
    }
}

await MoveAllPlayers(50, 50);
if (Clients[0]) {
    await SpawnPED(Clients[0], 50, 48);
}
await nc.close();
