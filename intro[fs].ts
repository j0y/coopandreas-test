import { MovePlayerTask } from './includes/MovePlayerTask.ts';
import {Tasks, getCurrentTask, markTaskDone, isTaskDone} from './includes/tasks.ts';
log("Hello world");


const plr: Player = new Player(0);
const plc: Char = plr.getChar();

while (true) {
  wait(0);

  if (plr.isPlaying() && !isTaskDone()) {
   
    let newTask = getCurrentTask();
    if (newTask === Tasks.None) {
      continue;
    }
    switch (newTask) {
      case Tasks.MovePlayer: {
        new MovePlayerTask(plc).Run()
      }
      case Tasks.CheckIfPEDExists: {

      }
    }
    markTaskDone();
  }
}


