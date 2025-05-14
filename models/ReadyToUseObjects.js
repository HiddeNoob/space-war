class ReadyToUseObjects{
    static bullets = {
        "DEFAULT_BULLET" : new Bullet(1,new DrawAttributes(ShapeFactory.polygonToShell(GlobalShapes.THIN_AND_LONG_RECTANGLE.copy().scaleBy(2),3,5,5))),
        "SQUARE_BULLET" : new Bullet(1,new DrawAttributes(ShapeFactory.polygonToShell(GlobalShapes.SQUARE,3,5,5)))
        
    }

    static weapons = {
        "REVOLVER" : new Weapon("Revolver",10,8,1,2000,8,this.bullets.DEFAULT_BULLET.copy().setDamage(80)),
        "PISTOL" : new Weapon("Pistol", 50, 12, 2, 1000, 12,this.bullets.SQUARE_BULLET.copy().setDamage(60)),
        "MACHINE_GUN" : new Weapon("Machine Gun",40,50,10,5000,50,this.bullets.SQUARE_BULLET.copy().setDamage(5).setDurability(2)),
        "SNIPER" : new Weapon("Sniper", 100, 6, 0.5, 5000, 6,this.bullets.DEFAULT_BULLET.copy().setDamage(130)),
    }

    static attackers = {
        "mini-drone" : new Attacker(this.weapons.SNIPER,new DrawAttributes(ShapeFactory.polygonToShell(GlobalShapes.TRIANGLE))).setDurability(1)
    }

    static players = {
        "DEFAULT_PLAYER" : new Player(500,1,1,this.weapons.MACHINE_GUN.copy(),new DrawAttributes(ShapeFactory.polygonToShell(GlobalShapes.TRIANGLE.copy().scaleBy(2),1,100,100))).setHealth(50)
    }


}

