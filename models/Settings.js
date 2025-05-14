// Oyun ayarlarını ve debug seçeneklerini tutan sınıf
class Settings{
    static default = {
        volume : 50, // Varsayılan ses seviyesi
        gridCellSize : 100, // Grid hücre boyutu
        spawnerDelay : 20000, // Üreteç gecikmesi
        attackerSpawnDelay : 5000, // Saldırgan üretme gecikmesi
        attackerShotDelay : 3000, // Saldırgan ateş etme
        attackerFollowDistance : 500, // Saldırganın takip mesafesi
        debug : {
            showHandlerLatency : {
                show : true, // Handler gecikmesini göster
                totalLatency : false, // Toplam gecikmeyi göster
                handlerLatency : false, // Handler gecikmesini göster
            }, // Handler gecikmesini göster
            point: {
                show: false, // Nokta gösterimini aç/kapat
            },
            grid: {
                show: true, // Grid gösterimini aç/kapat
                showObjectCount: false, // Gridde obje sayısını göster
            },
            showFPS : {
                show : true, // FPS gösterimini aç/kapat
                showLatency : true, // Gecikmeyi göster
            }, // FPS gösterimini aç/kapat
            showVector : {
                show : false, // Vektör gösterimini aç/kapat
            }
        },
    }
}