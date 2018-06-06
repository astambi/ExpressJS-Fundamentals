const storage = require("./storage");

// // Delete file storage.json before testing

// storage
//     .load()
//     .then(() => {
//         console.log('File loaded');
//     })
//     .catch(err => {
//         console.log(err);
//     });
// storage.loadSync();
storage.load();

storage.put("first", "firstValue");
storage.put("second", "secondValue");
storage.put("third", "thirdValue");
storage.put("fouth", "fourthValue");
console.log(storage.get("first"));
console.log(JSON.stringify(storage.getAll(), null, 4));
storage.delete("second");
storage.update("first", "updatedFirst");

storage.saveSync();
// storage.save();

storage.clear();
console.log(JSON.stringify(storage.getAll(), null, 4));

storage.loadSync();
// storage.load();

console.log(JSON.stringify(storage.getAll(), null, 4));

// // Testing invalid input
// storage.put('first', 'firstValue');
// storage.put('second', 'secondValue');
// storage.delete('second'); // invalid key
// storage.put(2, 'someValue'); // invalid type
// storage.put('cat', 'dog');
// storage.put('cat', 'anotherDog'); // existing key
