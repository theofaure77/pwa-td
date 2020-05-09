import page from 'page';
import todoCard from '../component/todoCard';
import { getTodos, setTodo, unsetTodo, deleteTodoIDB, checkTodoIDB } from '../idb';
import { deleteTodo, createTodo, updateTodo } from '../api/todo';

export default async function Todo(toDoPage) {
    toDoPage.innerHTML = '';
    let todos;
    let lastId = 0;
    todos = await getTodos();
    if(todos.length > 0){
        lastId = Math.max(...todos.map(todo => {
            return todo.id; 
        }));
    }
    //lastId = 
    const constructor = document.createElement('div');
    constructor.innerHTML = `
        <section name="Todo">
            <h1>Ma Todo Liste :</h1>
            <section id="todo-list" class="todolist">
                ${todoCard(todos)}
            </section>
            <section class="section-add-item">
                <form id="form-add-item" class="block-add-item flex column space-between">
                    <label for="add-item-field-1">Titre :</label>
                    <input type="text" id="add-item-field-1" class="add-item-field" placeholder="Titre"/>
                    <label for="add-item-field-2">Valeur :</label>
                    <input type="text" id="add-item-field-2" class="add-item-field" placeholder="Entrer une valeur dans la toList"/>
                    <button type="submit" class="cta-submit">
                        Créer
                    </button>
                </form>
            </section>
        </section>
    `;

    const view = constructor
        .querySelector('[name="Todo"]')
        .cloneNode(true);

    toDoPage.appendChild(view);

    let asyncAddItem = async(title, value) => {
        lastId++;
        let item = {
            id: lastId,
            title: title,
            content: value,
            done: false,
            isDeleted: false,
            isUpdate: false
        }
        let itemOnLine = {
            ...item,
            isSync: true
        }
        let itemOffLine = {
            ...item,
            isSync: false
        }
        let newItem = todoCard([item], true);

        if(navigator.onLine){
            setTodo(itemOnLine);
            createTodo(itemOnLine);
        }else{
            setTodo(itemOffLine);
            createTodo(itemOffLine);
        }
        document.getElementById("todo-list").insertAdjacentHTML('beforeend', newItem);
        itemActionListener();
        todos = await getTodos();
    }

    let asyncDeleteItem = async(itemId) => {
        await unsetTodo(itemId);
        if(navigator.onLine){
            deleteTodo(itemId);
            deleteTodoIDB(parseInt(itemId));
        }
        document.getElementById("item-" + itemId).remove();
    }

    let asyncCheckItem = async(checkbox) => {
        let isChecked = checkbox.checked;
        let itemId = checkbox.dataset.item;
        await checkTodoIDB(isChecked, itemId);
        if(navigator.onLine){
            let item;
            for(let todo of todos){
                if(todo.id == itemId){
                    item = todo;
                }
            }
            updateTodo({
                ...item,
                done: isChecked
            });
        }

        if(isChecked){
            document.getElementById("item-" + itemId).classList.add("item-checked");
        }else{
            document.getElementById("item-" + itemId).classList.remove("item-checked");
        }
    }

    document.getElementById("form-add-item").addEventListener("submit", function(event){
        event.preventDefault();
        let title = event.currentTarget.children[1].value;
        let value = event.currentTarget.children[3].value;
        asyncAddItem(title, value)
    });

    itemActionListener();

    function itemActionListener(){
        let elements = document.querySelectorAll(".action-item");
        elements.forEach(element => {
            element.addEventListener("click", function(el){
                let itemId = el.target.dataset.item;
                switch(el.target.dataset.action){
                    case "check":
                        asyncCheckItem(el.target);
                        break;
                    case "delete":
                        asyncDeleteItem(itemId);
                        break;
                    case "modif":
                        page(`/todos/edit/${itemId}`)
                        el.preventDefault();
                        break;
                }
            });
        })
    }
}