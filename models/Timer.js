
/**
 * Timer sınıfı, belirli bir süre bekledikten sonra bir callback fonksiyonunu çağırmak için kullanılır.
 * Bu sınıf, oyun döngüsü içinde zamanlayıcıları yönetir.
 */
class Timer {

    /**
     * @type {Set<Task>}
     */
    static #oneTimeTasks = new Set();

    /**
     * @type {Set<Task>}
    */
    static #intervalTasks = new Set();


    /**
     * delay kadar süre bekleyip callback fonksiyonunu çağırır
     * @param {Task} task - Zamanlayıcı görevi
     */
    static addOneTimeTask(task) {
        this.#oneTimeTasks.add(task);
    }

    /**
     * @param {Task} task 
     */
    static addIntervalTask(task) {
        this.#intervalTasks.add(task);
    }

    /**
     * Bu fonksiyon, her zamanlayıcının kalan süresini günceller ve süresi dolmuş olanları çağırır. 
     * Her frame'de çağrılmalıdır.
     */
    static update(deltaTime) {
        Timer.#oneTimeTasks.forEach((timer) => {
            timer.passTime(deltaTime);
            if (timer.remainingTime <= 0) {
                timer.callback();
                Timer.#oneTimeTasks.delete(timer); // Timer'ı sil
            }
        });
        Timer.#intervalTasks.forEach((timer) => {
            timer.passTime(deltaTime);
            if (timer.remainingTime <= 0) {
                timer.callback();
                timer.resetRemainingTime(); // Timer'ı sıfırla
            }
        });
    }
}

class Task{
    /** @type {function} */
    #callback; // Zamanlayıcı tamamlandığında çağrılacak fonksiyon

    /** @type {number} */
    #remainingTime; // Kalan süre

    /** @type {number} */
    #delay; // Başlangıçta ayarlanan süre

    /**
     * Zamanlayıcı oluşturucu
     * @param {function} callback - Zamanlayıcı tamamlandığında çağrılacak fonksiyon
     * @param {number} delay - Zamanlayıcı süresi
     */
    constructor(delay,callback){
        this.#callback = callback;
        this.#remainingTime = delay;
        this.#delay = delay;
    }

    resetRemainingTime(){
        this.#remainingTime = this.#delay;
    }

    passTime(time){
        this.#remainingTime -= time;
    }

    /**
     * Kalan süreyi alır
     * @returns {number} - Kalan süre
     */
    get remainingTime(){
        return this.#remainingTime;
    }

    /**
     *  Zamanlanan callback fonksiyonunu alır
     */
    get callback(){
        return this.#callback;
    }
}