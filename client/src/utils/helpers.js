export function pluralize(name, count) { // define pluralize function with name and count as arguments
  if (count === 1) { // if count is 1
    return name; // return name
  }
  return name + 's'; // return name + 's'
}

export function idbPromise(storeName, method, object) { // define idbPromise function with storeName, method, and object as arguments
  return new Promise((resolve, reject) => { // return new Promise
    const request = window.indexedDB.open('shop-shop', 1); // set request to window.indexedDB.open with 'shop-shop' and 1 as arguments
    let db, tx, store; // declare db, tx, and store
    request.onupgradeneeded = function(e) { // set request.onupgradeneeded to function with e as argument
      const db = request.result; // set db to request.result
      db.createObjectStore('products', { keyPath: '_id' }); // createObjectStore with 'products' and { keyPath: '_id' } as arguments
      db.createObjectStore('categories', { keyPath: '_id' }); // createObjectStore with 'categories' and { keyPath: '_id' } as arguments
      db.createObjectStore('cart', { keyPath: '_id' }); // createObjectStore with 'cart' and { keyPath: '_id' } as arguments
    };

    request.onerror = function(e) { // set request.onerror to function with e as argument
      console.log('There was an error'); // log 'There was an error'
    };

    request.onsuccess = function(e) { // set request.onsuccess to function with e as argument
      db = request.result; // set db to request.result
      tx = db.transaction(storeName, 'readwrite'); // set tx to db.transaction with storeName and 'readwrite' as arguments
      store = tx.objectStore(storeName); // set store to tx.objectStore with storeName as argument

      db.onerror = function(e) { // set db.onerror to function with e as argument
        console.log('error', e); // log 'error' and e
      };

      switch (method) { // switch method
        case 'put': // if method is 'put'
          store.put(object); // call store.put with object as argument
          resolve(object); // resolve object
          break; // break switch
        case 'get': // if method is 'get'
          const all = store.getAll(); // set all to store.getAll
          all.onsuccess = function() { // set all.onsuccess to function
            resolve(all.result); // resolve all.result
          };
          break; // break switch
        case 'delete': // if method is 'delete'
          store.delete(object._id); // call store.delete with object._id as argument
          break; // break switch
        default: // default case
          console.log('No valid method'); // log 'No valid method'
          break; // break switch
      }

      tx.oncomplete = function() { // set tx.oncomplete to function
        db.close(); // close db
      };
    };
  });
}
