import { teleport } from "./functions";
import { iniTaskFile, Params, TaskSection } from "./tasks";
export class MovePlayerTask {
    plc: Char;
    x: float = 0;
    y: float = 0;
    z: float = 0;

    constructor(plc: Char) {
        this.plc = plc;
        this.x = IniFile.ReadFloat(iniTaskFile, TaskSection, Params.X);
        this.y = IniFile.ReadFloat(iniTaskFile, TaskSection, Params.Y);
        this.z = IniFile.ReadFloat(iniTaskFile, TaskSection, Params.Z);
    }
    Run() {
        teleport(this.plc, this.plc, this.x, this.y, this.z, this.plc.getHeading(), 0);
    }
}