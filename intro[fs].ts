import { MovePlayerTask } from './includes/MovePlayerTask.ts';
import { SpawnPEDTask } from './includes/SpawnPEDTask.ts';
import { Tasks, getCurrentTask, markTaskDone, isTaskDone, claimFreeIniFile } from './includes/tasks.ts';
log("Hello world");


const plr: Player = new Player(0);
const plc: Char = plr.getChar();

const iniFilename = claimFreeIniFile()

while (true) {
  wait(0);

  if (plr.isPlaying() && !isTaskDone(iniFilename)) {

    let newTask = getCurrentTask(iniFilename);
    if (newTask === Tasks.None) {
      continue;
    }
    switch (newTask) {
      case Tasks.MovePlayer: {
        new MovePlayerTask().Configure(iniFilename, plc).Run()
        break;
      }
      case Tasks.SpawnPED: {
        new SpawnPEDTask().Configure(iniFilename).Run();
        break;
      }
    }
    markTaskDone(iniFilename);
  }
}


