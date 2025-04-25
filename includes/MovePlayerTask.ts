import { teleport } from "./functions";
import { iniTaskFile, Params, Tasks, TaskSection } from "./tasks";

export interface MovePlayerTaskParams {
    x: float;
    y: float;
    z: float;
}

export class MovePlayerTask {
    plc: Char;
    x: float = 0;
    y: float = 0;
    z: float = 0;

    Configure(plc: Char) {
        this.plc = plc;
        this.x = IniFile.ReadFloat(iniTaskFile, TaskSection, Params.X);
        this.y = IniFile.ReadFloat(iniTaskFile, TaskSection, Params.Y);
        this.z = IniFile.ReadFloat(iniTaskFile, TaskSection, Params.Z);
        return this;
    }
    Run() {
        teleport(this.plc, this.plc, this.x, this.y, this.z, this.plc.getHeading(), 0);
    }
    async Setup(writer, param: MovePlayerTaskParams) {
        return writer("../" + iniTaskFile, {
            CURRENT: {
                Task: Tasks.MovePlayer,
                [Params.X]: param.x,
                [Params.Y]: param.y,
                [Params.Z]: param.z,
            },
            RESULT: {
                Done: 0
            }
        }, { nothrow: true })
    }
}