import { spawn } from "child_process";
import { Glob } from "bun";

const exeProcess = spawn("../autoitrunner/resize.exe");

console.log("Launched .exe file.");

setTimeout(() => {
    console.log("Starting Bun script...");
    const bunProcess = spawn("bun", ["run", "index.ts"], { stdio: "inherit" });

    process.on("SIGINT", async () => {
        console.log("\nCleaning up processes...");
        exeProcess.kill();//not working for child anyawy
        bunProcess.kill();
        const glob = new Glob("*.ini");

        for await (const file of glob.scan("..")) {
            const bunFile = Bun.file("../"+file);
            await bunFile.delete();
        }
       
        process.exit();
    });
}, 15000);