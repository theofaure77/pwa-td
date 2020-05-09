import page from 'page';
import checkConnectivity from './network.js';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from './api/todo.js';
import { setTodos, getTodos, deleteTodoIDB } from './idb.js';

checkConnectivity({});
document.addEventListener('connection-changed', async e => {
  let root = document.documentElement;
  document.offline = !e.detail;
  if (e.detail) {
    let todosIDB = await getTodos();
    todosIDB.map(async todoIDB => {
      if(!todoIDB.isSync){
        await createTodo({...todoIDB, isSync: true});
      }
      if(todoIDB.isUpdate){
        await updateTodo({...todoIDB, isUpdate: false, isSync: true});
      }
      if(todoIDB.isDeleted){
        await deleteTodo(todoIDB.id);
        await deleteTodoIDB(todoIDB.id);
      }
    })
  } else {
    console.log('Connection interrupted');
  }
});

fetch('/config.json')
  .then((result) => result.json())
  .then((config) => {
    window.config = config;

    const app = document.querySelector('#app .outlet');

    page('/todos', async () => {
      const module = await import('./views/Todo.js');
      const Todo = module.default;

      const data = await getTodos();

      let todos = [];
      if (!document.offline) {
        const data = await fetchTodos();
        todos = await setTodos(data);
      } else {
        todos = await getTodos();
      }

      Todo(app, data);
    });

    page('/todos/edit/:id', async (req) => {
      const module = await import('./views/EditTodo.js');
      const EditTodo = module.default;

      EditTodo(app, req.params.id);
    });

    page();
});