export const TaskSection = 'CURRENT'
export const ResultSection = 'RESULT'

export enum Tasks {
    None = "None",
    MovePlayer = "MovePlayer",
    SpawnPED = "SpawnPED",
    CheckIfPEDExists = "CheckIfPEDExists",
}

export enum Params {
    Task= "Task",
    Done = "Done",
    X = 'X',
    Y = "Y",
    Z = "Z",
}

export function claimFreeIniFile(): string {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    
    for (let i = 0; i < alphabet.length; i++) {
        const filename = `./${alphabet[i]}.ini`;
        const exists = IniFile.ReadString(filename, TaskSection, Params.Task)

        if (exists !== Tasks.None) {
            IniFile.WriteString(Tasks.None, filename, TaskSection, Params.Task);
            return filename
        }
    }
}

export function getCurrentTask(iniTaskFile): Tasks {
    return IniFile.ReadString(iniTaskFile, TaskSection, Params.Task) as Tasks
}

export function isTaskDone(iniTaskFile): boolean {
    return IniFile.ReadInt(iniTaskFile, ResultSection, Params.Done) === 1
}

export function markTaskDone(iniTaskFile) {
    IniFile.WriteInt(1, iniTaskFile, ResultSection, Params.Done);
}
