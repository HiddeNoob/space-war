// Oyun ayarlarını ve debug seçeneklerini tutan sınıf
class Settings{
    static default = {
        volume : 25, // Varsayılan ses seviyesi
        gridCellSize : 100, // Grid hücre boyutu
        difficulty : 1, // Oyun zorluğu
        spawnerDelay : 20000, // Üreteç gecikmesi
        attackerSpawnDelay : 5000, // Saldırgan üretme gecikmesi
        attackerFollowDistance : 300, // Saldırganın takip mesafesi
        debugMode : false, // Debug modu
        debug : {
            location: true,
            collision: true,
            fps: true,
            latency: true,
            grid: {
                entityCount: true,
                location: true,
            },
            physicVectors: true,
            LinePoints: true,
            entityBaseLine: true,
        },
        
        /**
         * Zorluk değeri alarak oyunun parametrelerini günceller
         * @param {Number} difficulty 1 ile 3 arasında zorluk 
         */
        setDifficulty(difficulty){
            this.difficulty = difficulty;
            this.spawnerDelay = 20000 - (difficulty * 5000); // Zorluk arttıkça üretim süresi azalır
            this.attackerSpawnDelay = 8000 - (difficulty * 2000); // Zorluk arttıkça saldırgan üretim süresi azalır
            this.attackerFollowDistance = (difficulty * 300); // Zorluk arttıkça takip mesafesi artar
            ReadyToUseObjects.attackers["mini-drone"].setDurability(difficulty * 2);
        }
    }

    static 
}