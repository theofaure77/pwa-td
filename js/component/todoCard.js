export default function TodoCard(todos, async = false) {
    
    return todos.map(todo => {
        return `
          <div id="item-${todo.id}" class="todo-item flex space-between ${todo.done ? "item-checked" : null}">
            <div class="flex column">
              <p>
                ${todo.title}
              </p>
              <p>
                ${todo.content}
              </p>
            </div>
            <div class="block-action-item flex column justify-center align-center">
              <label for="checkbox-${todo.id}">Valider :</label>
              <input type="checkbox" id="checkbox-${todo.id}" data-action="check" class="action-item check-item" data-item="${todo.id}" ${todo.done ? "checked" : null}/>
              <button data-item="${todo.id}" data-action="modif" class="action-item modif-item">
                Modifier
              </button>
              <button data-item="${todo.id}" data-action="delete" class="action-item delete-item">
                Supprimer
              </button>
            </div>
          </div>
        `
    }).join("");
}