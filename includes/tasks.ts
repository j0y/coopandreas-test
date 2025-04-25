export const iniTaskFile = './testTasks.ini';
export const TaskSection = 'CURRENT'
export const ResultSection = 'RESULT'

export enum Tasks {
    None = "",
    MovePlayer = "MovePlayer",
    CheckIfPEDExists = "CheckIfPEDExists",
}

export enum Params {
    Task= "Task",
    Done = "Done",
    X = 'X',
    Y = "Y",
    Z = "Z",
}

export function getCurrentTask(): Tasks {
    return IniFile.ReadString(iniTaskFile, TaskSection, Params.Task) as Tasks
}

export function isTaskDone(): boolean {
    return IniFile.ReadInt(iniTaskFile, ResultSection, Params.Done) === 1
}

export function markTaskDone() {
    IniFile.WriteInt(1, iniTaskFile, ResultSection, Params.Done);
}
