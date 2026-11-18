// The only file that knows WHERE data is stored.
// Today: the browser. Later: the Pi (edit only this file).

function loadRecords(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveRecord(key, record) {
    const records = loadRecords(key);
    records.push(record);
    localStorage.setItem(key, JSON.stringify(records));
}