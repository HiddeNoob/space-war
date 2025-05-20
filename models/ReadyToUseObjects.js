class ReadyToUseObjects{
    static bullets = {
        "DEFAULT_BULLET" : new Bullet(1,new DrawAttributes(ShapeFactory.polygonToShell(GlobalShapes.THIN_AND_LONG_RECTANGLE.copy().scaleBy(2),1.5,50,50))),
        "SQUARE_BULLET" : new Bullet(1,new DrawAttributes(ShapeFactory.polygonToShell(GlobalShapes.SQUARE,0.8,20,20)))
        
    }

    static weapons = {
        "REVOLVER" : new Weapon("Revolver",120,8,1,2000,8,this.bullets.DEFAULT_BULLET.copy().setDamage(70)),
        "PISTOL" : new Weapon("Pistol", 100, 12, 2, 1000, 12,this.bullets.SQUARE_BULLET.copy().setDamage(60)),
        "MACHINE_GUN" : new Weapon("Machine Gun",60,100,15,4000,100,this.bullets.SQUARE_BULLET.copy().setDamage(50).setDurability(0.5)),
        "SNIPER" : new Weapon("Sniper", 400, 6, 1, 2000, 6,this.bullets.DEFAULT_BULLET.copy().setDamage(130)),
    }

    static attackers = {
        "mini-drone" : new Attacker([this.weapons.SNIPER],new DrawAttributes(ShapeFactory.polygonToShell(GlobalShapes.TRIANGLE))).setDurability(2).setVelocitySlowdownRate(0.995)
    }

    static players = {
        "DEFAULT_PLAYER" : new Player(0,1,1,[this.weapons.PISTOL.copy()],new DrawAttributes(ShapeFactory.polygonToShell(GlobalShapes.TRIANGLE.copy().scaleBy(2),8,10,10)))
    }


}

