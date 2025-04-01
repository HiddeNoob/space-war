class UserActionHandler {
  /** @type {Player} */
  player;

  /** @type {Canvas} */
  canvas

  /** @type {Vector} */
  #latestClientMouseLocation = new Vector([0, 0]);

  #isPressed = {
    w: false,
    s: false,
    a: false,
    d: false,
  };

  #forceAction = {
    w: () => (this.player.motionAttributes.force.data[1] -= this.player.thrustPower),
    a: () => (this.player.motionAttributes.force.data[0] -= this.player.thrustPower),
    s: () => (this.player.motionAttributes.force.data[1] += this.player.thrustPower),
    d: () => (this.player.motionAttributes.force.data[0] += this.player.thrustPower),
  };

  /**
   * @param {Player} player
   * @param {Canvas} canvas
   */
  constructor(player, canvas) {
    this.#addEventListener();
    this.player = player;
    this.canvas = canvas;
  }

  update() {
    this.player.motionAttributes.resetInstantVectors(); // her iterasyonda vektörler tekrardan hesaplanmalı
    this.#applyForce();
    this.#updatePlayerAngle();
  }

  #applyForce() {
    Object.keys(this.#isPressed).forEach((key) => {
      if (this.#isPressed[key]) {
        this.#forceAction[key]();
      }
    });
  }


  #addEventListener() {
    window.addEventListener("keypress", (e) => {
      if (e.key in this.#isPressed) this.#isPressed[e.key] = true;
    });
    window.addEventListener("keyup", (e) => {
      if (e.key in this.#isPressed) this.#isPressed[e.key] = false;
    });
    canvas.addEventListener("mousemove", (e) => {
      this.#latestClientMouseLocation = new Vector([e.offsetX, e.offsetY]);
    });

    window.addEventListener("mousedown",(e) => { // create Bullet object and add vector that same angle with user direction angle 
      // get speed with player momentum power
      console.log(this.player.weapon.bulletObject.motionAttributes);
      console.log(this.canvas.grid)
      const bulletStartSpeed = this.player.weapon.bulletEjectPower / this.player.weapon.bulletObject.motionAttributes.mass;
      const playerThrustbackSpeed = this.player.weapon.bulletEjectPower / this.player.motionAttributes.mass;

      const createdBullet = this.player.weapon.bulletObject.copy();
      const bulletAngle = this.player.drawAttributes.angle; //radian

      const bulletXSpeed = Math.cos(bulletAngle) * bulletStartSpeed;
      const bulletYSpeed = Math.sin(bulletAngle) * bulletStartSpeed;

      createdBullet.motionAttributes.speed.add(new Vector([bulletXSpeed,bulletYSpeed]));
      createdBullet.drawAttributes.location= this.player.drawAttributes.location.copy();
      createdBullet.drawAttributes.angle = bulletAngle;

      this.canvas.grid.addEntity(createdBullet);

      this.player.motionAttributes.speed.add(
        new Vector([
          Math.cos(bulletAngle - Math.PI),
          Math.sin(bulletAngle - Math.PI),
        ]).multiply(playerThrustbackSpeed)
      );
  })
  }
  #updatePlayerAngle() {
    const mouseX = this.#latestClientMouseLocation.data[0];
    const mouseY = this.#latestClientMouseLocation.data[1];
    const playerX = this.player.drawAttributes.location.data[0];
    const playerY = this.player.drawAttributes.location.data[1];

    const angle = -Math.atan2(mouseX - playerX, mouseY - playerY) + Math.PI / 2;
    this.player.drawAttributes.angle = angle;
  }
}
