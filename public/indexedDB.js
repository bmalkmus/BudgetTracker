export function CheckINDEX(){

const request = indexedDB.open("offlineBudget", 1);

request.onupgradeneeded = function (e) {
    const db = e.target.result;
    db.createObjectStore ("pending", { autoIncrement: true});
};

request.onsuccess = function(e) {
    let db = e.target.result;
    if (navigator.onLine) {
        console.log("checking Database")
    const transaction = db.transaction(["pending"], "readwrite");

    const store = transaction.objectStore("pending");

    const getAll = store.getAll();

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            console.log(getAll.result);
            fetch ("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*", 
                    "Content-Type" : "application/json"
                }
            })
            .then(response => response.json())
            .then (() => {
                const transaction = db.transaction(["pending"], "readwrite");

                const store = transaction.objectStore("pending");


                const ClearDB = store.clear();
                ClearDB.onsuccess = function (event){
                    console.log("Database cleared")
                };
            });
        }
        else {
            console.log("IndexedDB is empty")
        }
    };;
    }
};

request.onerror = function (e) {
    console.log ("Warning!! " + e.target.errorCode + "  Now this message will explode in 5 seconds!");
};
}

 export function saveRecord(r) {
    const request = indexedDB.open("offlineBudget", 1);
    request.onsuccess = function(e) {
        let db = e.target.result;

    const transaction = db.transaction(["pending"], "readwrite");
    
    const store = transaction.objectStore("pending");

    store.add(r);
 }};

