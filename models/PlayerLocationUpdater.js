class PlayerLocationUpdater {
  /** @type {Player} */
  player;

  /** @type {Point} */
  latestClientMouseLocation = new Point(0,0);

  isPressed = {
    w: false,
    s: false,
    a: false,
    d: false,
  };

  forceAction = {
    "w": () => (this.player.motion.force.data[1] -= this.player.thrustPower),
    "a": () => (this.player.motion.force.data[0] -= this.player.thrustPower),
    "s": () => (this.player.motion.force.data[1] += this.player.thrustPower),
    "d": () => (this.player.motion.force.data[0] += this.player.thrustPower),
  };

  constructor(player) {
    this.#addEventListener();
    this.player = player;
  }

  update() {
    this.applyForce();
    this.applyAcceleration();
    this.applySpeed();
    this.updateLocation();
    this.updatePlayerAngle();
    this.player.motion.resetInstantVectors(); // her iterasyonda vektörler tekrardan hesaplanmalı
  }

  applyForce() {
    Object.keys(this.isPressed).forEach((key) => {
      if (this.isPressed[key]) {
        this.forceAction[key]();
      }
    });
  }

  applyAcceleration() {
    this.player.motion.acceleration.add(
      this.player.motion.force.multiply(
        new Vector([1 / this.player.motion.mass, 1 / this.player.motion.mass]) // force / mass = acceleration
      )
    );
  }

  applySpeed(){
    this.player.motion.speed.add(this.player.motion.acceleration);
  }

  updateLocation(){
    this.player.drawOptions.location.add(new Point(this.player.motion.speed.data[0],this.player.motion.speed.data[1]))
  }

  #addEventListener() {
    window.addEventListener("keypress", (e) => {
      if (e.key in this.isPressed) this.isPressed[e.key] = true;
    });
    window.addEventListener("keyup", (e) => {
      if (e.key in this.isPressed) this.isPressed[e.key] = false;
    });
    canvas.addEventListener("mousemove", (e) => {
        this.latestClientMouseLocation = new Point(e.offsetX,e.offsetY);
    })
  }
  updatePlayerAngle(){
    const mouseX = this.latestClientMouseLocation.x;
    const mouseY = this.latestClientMouseLocation.y;
    const playerX = this.player.drawOptions.location.x;
    const playerY = this.player.drawOptions.location.y; 
    

    const angle = - Math.atan2((mouseX - playerX),(mouseY - playerY));
    this.player.drawOptions.angle = angle;
  }
}
