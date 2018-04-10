
window.OriginalPromise = window.Promise;
window.timeMeasurements = {};
window.Promise =
    class Promise{


        constructor(resolve, reject){

            const functionTakingTime = Error().stack.split('\n')
                .map((str) => str.trim().replace(/^at /, ''))
        .find((str) => str.match(/\s/) && !str.match(/Error|Promise|Function\.resolve|step|Function\.all|Function\.reject|Function\.race/));
            if(!functionTakingTime){
                return new OriginalPromise(resolve, reject);
            }
            const startTime = performance.now();
            if(!timeMeasurements[functionTakingTime]){
                timeMeasurements[functionTakingTime] = {time: 0, timesCalled: 0, stack: Error().stack.split('\n').slice(1).join('\n')};
            }
            const hijackedPromise = new OriginalPromise(resolve,reject);
            const originalThenFunction = hijackedPromise.then;
            hijackedPromise.then = (callback) => {
                return originalThenFunction.call(hijackedPromise, function() {
                    const endTime = performance.now();
                    timeMeasurements[functionTakingTime].time += endTime - startTime;
                    timeMeasurements[functionTakingTime].timesCalled ++;
                    callback(...arguments);
                })
            };
            return hijackedPromise;
        }
    };
Promise.resolve = OriginalPromise.resolve;
Promise.reject = OriginalPromise.reject;
Promise.all = OriginalPromise.all;
Promise.race = OriginalPromise.race;

window.resetPromiseProfiles = () => {window.timeMeasurements = {};};

window.getPromiseProfiles = () => {
    const worthReporting = {};
    for(let [name, data] of Object.entries(timeMeasurements).sort(([,{time: firstTime}], [,{time: secondTime}]) => firstTime < secondTime ? 1 : -1)){
        if(data.time > 20){
            worthReporting[name] = data;
        }
    }
    console.table(worthReporting);
};