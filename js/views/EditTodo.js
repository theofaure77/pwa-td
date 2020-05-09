import page from 'page';
import { getTodo, updateTodoIDB } from '../idb';
import { updateTodo } from '../api/todo';

export default async function EditTodo(EditToDoPage, itemId) {
    EditToDoPage.innerHTML = '';
    let todoItem = await getTodo(itemId);
    const constructor = document.createElement('div');
    constructor.innerHTML = `
        <section name="EditTodo">
            <h1>Edition de mon todo "${todoItem.title}" :</h1>
            <div class="block-edit-item">
                <form id="edit-item-form" class="edit-item-form flex column">
                    <label for="edit-title">Titre :</label>
                    <input type="text" id="edit-title" placeholder="Titre" value="${todoItem.title}" />
                    <label for="edit-content">Valeur :</label>
                    <input type="text" id="edit-content" placeholder="Valeur du todo" value="${todoItem.content}" />
                    <button type="submit" id="submit-edit" class="cta-submit">
                        Valider les modifications
                    </button>
                </form>
            </div>
            <button id="cta-back" class="cta-back">Retour</button>
        </section>
    `;

    const view = constructor
        .querySelector('[name="EditTodo"]')
        .cloneNode(true);

    EditToDoPage.appendChild(view);

    document.getElementById("cta-back").addEventListener("click", function(e){
        page("/todos");
        e.preventDefault();
    })

    let asyncEditItem = async(title, value) => {
        let item = {
            ...todoItem,
            title: title,
            content: value,
            isUpdate: true
        }
        await updateTodoIDB(item);
        if(navigator.onLine){
            await updateTodo({
                ...item,
                isUpdate: false
            });
        }
    }

    document.getElementById("edit-item-form").addEventListener("submit", function(e){
        let title = event.currentTarget.children[1].value;
        let value = event.currentTarget.children[3].value;
        asyncEditItem(title, value);
        e.preventDefault();
        //page("/todos");
    })
}