
let db;

const request = indexedDB.open("offlineBudget", 1);

request.onupgradeneeded = function (e) {
    const db = e.target.result;
    db.createObjectStore ("pending", { autoIncrement: true});
};

request.onsuccess = function(e) {
    db = e.target.result;
    if (navigator.onLine) {
        checkDB();
    }
};

request.onerror = function (e) {
    console.log ("Warning!! " + e.target.errorCode + "  Now this message will explode in 5 seconds!");
};

 export function saveRecord(r) {
    const transaction = db.transaction(["pending"], "readwrite");
    
    const store = transaction.objectStore("pending");

    store.add(r);
};

 function checkDB () {
    const transaction = db.transaction(["pending"], "readwrite");

    const store = transaction.objectStore("pending");

    const getAll = store.getAll();

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
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

                store.clear();
            });
        }
    };
}

window.addEventListener("online", checkDB);
