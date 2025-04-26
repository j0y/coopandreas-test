import { Params, Tasks, TaskSection } from "./tasks";
import { PedType } from '../.config/enums'

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
        loadModel(70);
        spawnPed(70, PedType.CivMale, { x: this.x, y: this.y, z: this.z })
        //Char.CreateRandom( this.x, this.y, this.z)
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

/**
 * @param {(number|string)} id
 * @param {boolean} [special=false]
 * @param {int} [slot=null]
 */
export function loadModel(id, special = false, slot = null) {
    if (typeof id === "string" && special == true && slot != null) {
        Streaming.LoadSpecialCharacter(slot, id);

        while (!Streaming.HasSpecialCharacterLoaded(slot)) {
            wait(100);
        }
    } else {
        Streaming.RequestModel(id);

        while (!Streaming.HasModelLoaded(id)) {
            wait(100);
        }
    }
}

/**
* @param {{x: float, y: float, z: float}} pos
* @param {string} spec solid/car/char/object/particle
*/
function areaOccupied(pos, spec) {
    if (spec === "solid") {
        return World.IsAreaOccupied(
            pos.x - 2.0,
            pos.y - 2.0,
            pos.z - 2.0,
            pos.x + 2.0,
            pos.y + 2.0,
            pos.z + 2.0,
            true,
            false,
            false,
            false,
            false
        );
    } else if (spec === "car") {
        return World.IsAreaOccupied(
            pos.x - 2.0,
            pos.y - 2.0,
            pos.z - 2.0,
            pos.x + 2.0,
            pos.y + 2.0,
            pos.z + 2.0,
            false,
            true,
            false,
            false,
            false
        );
    } else if (spec === "char") {
        return World.IsAreaOccupied(
            pos.x - 2.0,
            pos.y - 2.0,
            pos.z - 2.0,
            pos.x + 2.0,
            pos.y + 2.0,
            pos.z + 2.0,
            false,
            false,
            true,
            false,
            false
        );
    } else if (spec === "object") {
        return World.IsAreaOccupied(
            pos.x - 2.0,
            pos.y - 2.0,
            pos.z - 2.0,
            pos.x + 2.0,
            pos.y + 2.0,
            pos.z + 2.0,
            false,
            false,
            false,
            true,
            false
        );
    } else if (spec === "particle") {
        return World.IsAreaOccupied(
            pos.x - 2.0,
            pos.y - 2.0,
            pos.z - 2.0,
            pos.x + 2.0,
            pos.y + 2.0,
            pos.z + 2.0,
            false,
            false,
            false,
            false,
            true
        );
    } else {
        return false;
    }
}

/**
* @param {int} id Needs to be loaded first via "loadModel"! / "Streaming.MarkModelAsNoLongerNeeded" not needed
* @param {int} type
* @param {{x: float, y: float, z: float, a?: float}} pos
*/
function spawnPed(id, type, pos) {
    let ped;
    // loadModel(id);

    if (areaOccupied(pos, "char")) {
        World.ClearAreaOfChars(
            pos.x - 0.5,
            pos.y - 0.5,
            pos.z - 0.5,
            pos.x + 0.5,
            pos.y + 0.5,
            pos.z + 0.5
        );
    }

    let ground = World.GetGroundZFor3DCoord(pos.x, pos.y, pos.z);

    ped = Char.Create(type, id, pos.x, pos.y, ground);
    if (pos.hasOwnProperty("a")) {
        ped.setHeading(pos.a);
    }

    Streaming.MarkModelAsNoLongerNeeded(id);

    return ped;
}