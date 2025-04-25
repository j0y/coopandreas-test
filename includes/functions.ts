
export function teleport(plc:Char, char: Char, x: float, y: float, z: float, heading: float, interior: int = 0, loadScene: boolean = true) {
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
