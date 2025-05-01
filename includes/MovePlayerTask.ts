import { Params, Tasks, TaskSection } from "./tasks";

export interface MovePlayerTaskParams {
    x: float;
    y: float;
    z: float;
    a: float;
}

export class MovePlayerTask {
    plc: Char;
    x: float = 0;
    y: float = 0;
    z: float = 0;
    a: float = 0;

    Configure(iniTaskFile, plc: Char) {
        this.plc = plc;
        this.x = IniFile.ReadFloat(iniTaskFile, TaskSection, Params.X);
        this.y = IniFile.ReadFloat(iniTaskFile, TaskSection, Params.Y);
        this.z = IniFile.ReadFloat(iniTaskFile, TaskSection, Params.Z);
        this.a = IniFile.ReadFloat(iniTaskFile, TaskSection, Params.A);
        return this;
    }
    Run() {
        //let ground = World.GetGroundZFor3DCoord(this.x, this.y, this.z);
        teleport(this.plc, this.plc, this.x, this.y, this.z, this.a, 0);
    }
    Setup(param: MovePlayerTaskParams) {
        return {
            CURRENT: {
                Task: Tasks.MovePlayer,
                [Params.X]: param.x,
                [Params.Y]: param.y,
                [Params.Z]: param.z,
                [Params.A]: param.a,
            },
            RESULT: {
                Done: 0
            }
        }
    }
}

export function teleport(plc: Char, char: Char, x: float, y: float, z: float, heading: float, interior: int = 0, loadScene: boolean = true) {
    if (loadScene) {
        Streaming.RequestCollision(x, y);
        Streaming.LoadScene(x, y, z);
    }

    if (!char.isInAnyCar()) {
        char.setCoordinates(x, y, z).setHeading(heading);
    } else {
        char.storeCarIsInNoSave().setCoordinates(x, y, z).setHeading(heading).setAreaVisible(interior);
    }

    char.setAreaVisible(interior);

    if (char === plc) Camera.RestoreJumpcut();
}
