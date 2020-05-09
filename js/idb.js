import { openDB } from 'idb';

export async function initDB() {
  const config = window.config;
  const db = await openDB('awesome-todo', config.version || 1, {
    upgrade(db) {
      // Create a store of objects
      const store = db.createObjectStore('todos', {
      // The 'id' property of the object will be the key.
      keyPath: 'id',
      });
      // Create an index on the 'date' property of the objects.
      store.createIndex('id', 'id');
      store.createIndex('content', 'content');
      store.createIndex('done', 'done');
      store.createIndex('isSync', 'isSync');
      store.createIndex('isDeleted', 'isDeleted');
    },
  });
  return db;
}

export async function setTodos(data) {
  const db = await initDB();
  const tx = db.transaction('todos', 'readwrite');
  data.forEach(item => {
    tx.store.put(item);
  });
  await tx.done;
  return await db.getAll('todos');
}

export async function setTodo(data) {
  const db = await initDB();
  const tx = db.transaction('todos', 'readwrite');
  return await tx.store.put(data);
}

export async function getTodos() {
  const db = await initDB();
  return await db.getAll('todos');
}

export async function getTodo(id) {
  const db = await initDB();
  const tx = db.transaction('todos', 'readwrite').objectStore('todos');
  return await tx.get(parseInt(id));
}

export async function unsetTodo(id) {
  const db = await initDB();
  const tx = db.transaction('todos', 'readwrite').objectStore('todos');
  const objectStore = await tx.get(parseInt(id));
  objectStore.isDeleted = true;
  await tx.put(objectStore);
  tx.done;
}

export async function deleteTodoIDB(id) {
  const db = await initDB();
  return await db.delete('todos', id);
}

export async function checkTodoIDB(isDone, id) {
  const db = await initDB();
  const tx = db.transaction('todos', 'readwrite').objectStore('todos');
  const objectStore = await tx.get(parseInt(id));
  objectStore.done = isDone;
  objectStore.isUpdate = true;
  await tx.put(objectStore);
  tx.done;
}

export async function updateTodoIDB(item) {
  const db = await initDB();
  const tx = db.transaction('todos', 'readwrite').objectStore('todos');
  const objectStore = await tx.get(parseInt(item.id));
  objectStore.title = item.title;
  objectStore.content = item.content;
  objectStore.isUpdate = true;
  await tx.put(objectStore);
  tx.done;
}