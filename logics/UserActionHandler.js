class UserActionHandler extends Handler {

  /** @type {Vector} */
  #latestClientMouseLocation = new Vector(0,0);

  #isPressed = {
    w: false,
    s: false,
    a: false,
    d: false,
  };

  #forceAction = {
    w: () => (this.player.motionAttributes.force.y -= this.player.thrustPower),
    a: () => (this.player.motionAttributes.force.x -= this.player.thrustPower),
    s: () => (this.player.motionAttributes.force.y += this.player.thrustPower),
    d: () => (this.player.motionAttributes.force.x += this.player.thrustPower),
  };

  /**
   * @param {Player} player
   * @param {Grid} player
   */
  constructor(player,grid) {
    super(grid,player);
    this.#addEventListener();
  }

  update = () => {
    this.#applyForce();
    this.#applyTorque();
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
      this.#latestClientMouseLocation = new Vector(e.offsetX, e.offsetY);
    });

    window.addEventListener("mousedown",(e) => { // create Bullet object and add vector that same angle with user direction angle 
      // get speed with player momentum power
      const bulletStartSpeed = this.player.weapon.bulletEjectPower / this.player.weapon.bulletObject.motionAttributes.mass;
      const playerThrustbackSpeed = this.player.weapon.bulletEjectPower / this.player.motionAttributes.mass;

      const createdBullet = this.player.weapon.bulletObject.copy();
      const bulletAngle = this.player.drawAttributes.angle; //radian

      const bulletXSpeed = Math.cos(bulletAngle) * bulletStartSpeed;
      const bulletYSpeed = Math.sin(bulletAngle) * bulletStartSpeed;

      createdBullet.motionAttributes.velocity.add(new Vector(bulletXSpeed, bulletYSpeed));
      
      const tipOfPlayer = this.player.drawAttributes.shell.breakableLines[0].startPoint;
      createdBullet.drawAttributes.location= this.player.drawAttributes.location.copy().add(tipOfPlayer.copy().rotate(bulletAngle).multiply(2));
      createdBullet.drawAttributes.angle = bulletAngle;

      this.grid.addEntity(createdBullet);

      this.player.motionAttributes.velocity.add(
        new Vector(
          Math.cos(bulletAngle - Math.PI),
          Math.sin(bulletAngle - Math.PI),
        ).multiply(playerThrustbackSpeed)
      );
  })

  }


  
  #calculateTorque() {
    const mouseX = this.#latestClientMouseLocation.x;
    const mouseY = this.#latestClientMouseLocation.y;
    const playerX = this.player.drawAttributes.location.x;
    const playerY = this.player.drawAttributes.location.y;
    
    const rotateVector = new Vector(mouseX - playerX, mouseY - playerY).normalize();
    
    const forceDirection = new Vector(-Math.cos(this.player.drawAttributes.angle), -Math.sin(this.player.drawAttributes.angle));
    
    const torque = rotateVector.crossProduct(forceDirection) * this.player.rotatePower;
    
    return torque;
  }

  #applyTorque() {


    const torque = this.#calculateTorque();
    const angularAcceleration = torque / this.player.motionAttributes.momentOfInertia;

    this.player.motionAttributes.angularVelocity += angularAcceleration;
    this.player.motionAttributes.angularVelocity *= 0.8; // dalgalanmayi azaltmak icin
  }


}
