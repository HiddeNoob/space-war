
/**
 * Timer sınıfı, belirli bir süre bekledikten sonra bir callback fonksiyonunu çağırmak için kullanılır.
 * Bu sınıf, oyun döngüsü içinde zamanlayıcıları yönetir.
 */
class Timer {

    /**
     * @type {Set<{timeRemaining: number, callback: (currentTime: number) => void}>}
     */
    static #timers = new Set();

    /**
     * delay kadar süre bekleyip callback fonksiyonunu çağırır
     * @param {number} delay 
     * @param {(currentTime : number) => void} callback 
     */
    static add(delay, callback) {
        Timer.#timers.add({
            timeRemaining: delay,
            callback
        });
    }

    /**
     * Bu fonksiyon, her zamanlayıcının kalan süresini günceller ve süresi dolmuş olanları çağırır. 
     * Her frame'de çağrılmalıdır.
     */
    static update() {
        const deltaTime = global.latestPaintTimestamp - global.previousLatestPaintTimestamp;
        Timer.#timers.forEach((timer) => {
            timer.timeRemaining -= deltaTime;
            if (timer.timeRemaining <= 0) {
                timer.callback(global.latestPaintTimestamp);
                Timer.#timers.delete(timer); // Timer'ı sil
            }
        });
    }
}
