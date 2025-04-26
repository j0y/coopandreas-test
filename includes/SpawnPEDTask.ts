import { Params, Tasks, TaskSection } from "./tasks";

export interface SpawnPEDTaskParams {
    x: float;
    y: float;
    z: float;
}

export class SpawnPEDTask {
    plc: Char;
    x: float = 0;
    y: float = 0;
    z: float = 0;

    Configure(iniTaskFile) {
        this.x = IniFile.ReadFloat(iniTaskFile, TaskSection, Params.X);
        this.y = IniFile.ReadFloat(iniTaskFile, TaskSection, Params.Y);
        this.z = IniFile.ReadFloat(iniTaskFile, TaskSection, Params.Z);
        return this;
    }
    Run() {
        Char.CreateRandom(this.x, this.y, this.z)
    }
    Setup(param: SpawnPEDTaskParams) {
        return {
            CURRENT: {
                Task: Tasks.SpawnPED,
                [Params.X]: param.x,
                [Params.Y]: param.y,
                [Params.Z]: param.z,
            },
            RESULT: {
                Done: 0
            }
        }
    }
}