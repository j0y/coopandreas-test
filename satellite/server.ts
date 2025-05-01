import { connect } from "nats";
import { type MovePlayerTaskParams } from "../includes/MovePlayerTask"
import { Tasks } from "../includes/tasks";
import { arrangeInACircle } from "./server_tools/circle";
import type { SpawnPEDTaskParams } from "../includes/SpawnPEDTask";

export interface Command {
    task: Tasks,
    params: MovePlayerTaskParams | SpawnPEDTaskParams,
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
    const placements = arrangeInACircle(x,y, 5, Clients.length)
    for (const [index, clientName] of Clients.entries()) {
        try {
            let response = await nc.request("compute." + clientName, commandToString({ task: Tasks.MovePlayer, params: { x: placements[index]!.x, y: placements[index]!.y, z: 5, a: placements[index]!.angle } }), { timeout: 4000 });
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
    await SpawnPED(Clients[0], 50, 50);
}
await nc.close();
