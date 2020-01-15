
const todoController = (function() {

    return {
            //?Function to add new todo
            addTodo: text => {

            let todoItems = [];
            
            const todo = {
                text,
                id: Date.now()
            };

            todoItems.push(todo);
            //console.log(todoItems);
            return todo;
        }
    }
})();

const UIController = (function() {

    //?Contains all classes for the DOM
    const DOMStrings = {
        todoList: '.todo-list',
        userInput: '.user-input__input',
        add: '.js-add',
        delete: '.js-delete',
        container: '.contain'
    }

    return {
        //?Get input from user 
        getInput:() => {
             //Get input
             return {
                value: document.querySelector(DOMStrings.userInput).value
             }
        },

        //?Add todo item to the UI
        addTodoItem: obj => {
            let markup, newMarkup;
            markup = `
            <div class="todo-item" id="%id%">
                <div class="todo-item__value">%value%</div>
                <div class="todo-item__delete">
                    <button class="todo-item__deleteBtn js-delete">
                        <svg class="todo-item__deleteIcon">
                            <use xlink:href="img/sprite.svg#icon-circle-with-cross"></use>
                        </svg>
                    </button>
                </div>
            </div>
            `;
            
            newMarkup = markup.replace('%id%', obj.id);
            newMarkup = newMarkup.replace('%value%', obj.text);

            document.querySelector(DOMStrings.todoList).insertAdjacentHTML('beforeend', newMarkup);
        },

        //?Method to delete todo from the UI
        deleteTodoItem: selectorID => {
            let el = document.getElementById(selectorID);
            
            el.parentElement.removeChild(el);
        },

        //?Method to clear input field
        clearField: () => {
            let field;
            field = document.querySelector(DOMStrings.userInput);
            field.value = '';
            field.focus();
        },

        showAlert: (message, className) => {
            let markup, newMarkup;
            markup = `
            <div class="alert">
                <div class="alert__%class%">%msg%</div>
            </div>
            `
            newMarkup = markup.replace('%msg%', message);
            newMarkup = newMarkup.replace('%class%', className);

            document.querySelector(DOMStrings.container).insertAdjacentHTML('afterbegin', newMarkup);

            //Vanish in 3 secs
            setTimeout(() => document.querySelector('.alert').remove(), 2000);
        },

        getDOMstrings: () => {
            return DOMStrings;
        }
    }

})();

const controller = (function(todoCtrl, UICtrl) {

    //?All event listeners
    const allEventListeners = () => {
        let DOM = UICtrl.getDOMstrings();
        const addItem = document.querySelector(DOM.add);

            addItem.addEventListener('click', event => {
            event.preventDefault();
            addTodo();
        });

        const deleteItem = document.querySelector(DOM.container);
        deleteItem.addEventListener('click', removeTodo);

        document.addEventListener('DOMContentLoaded', displayTodos);
    }

    //?Function to add todo
    const addTodo = () => {
        let input, text, newTodo;
        //1. Get input from user
        input = UICtrl.getInput();
            
        if (input.value !== '') {
            //Trim the input of whitespaces
            text = input.value.trim();
            
            //Add new todo to the todoController
            newTodo = todoCtrl.addTodo(text);
            //console.log(newTodo);

            //Clear field
            UICtrl.clearField();

            //Add to localstorage
            addNewTodo(newTodo);

            //Render in the UI
            UICtrl.addTodoItem(newTodo);
        }    
    }

    //?Function to remove todo from UI and local storage
    const removeTodo = event => {
        let itemID;
        itemID = parseInt((event.target.closest('.js-delete').parentNode.parentNode.id));

        //console.log(typeof(itemID));

        if (itemID) {
            //Remove from UI
            UICtrl.deleteTodoItem(itemID);

            //Remove from local storage
            deleteTodo(itemID);
        }
    }

    //?Function to check if localstorage contains todo
    const getTodos = () => {
        let todos;

        if (localStorage.getItem('todos') === null) {
            todos = [];
        } else {
            todos = JSON.parse(localStorage.getItem('todos'));
        }

        return todos;
    }

    //?Function to add new todo to local storage
    const addNewTodo = todo => {
        //First get the todos from the local storage
        const todos = getTodos();

        //Push new the new todo
        todos.push(todo);

        //Show alert
        UICtrl.showAlert('Task added', 'success');

        //Save todos in the local storage
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    //?Function to remove todo from local storage
    const deleteTodo = id => {
        //Get the todos from the local storage
        const todos = getTodos();

        //Call each todo and it's index
        todos.forEach((todo, index) => {
            //Check if the id of the current book matches the id of the todo passed
            if (todo.id === id) {
                todos.splice(index, 1);
            }
        });

         //Show alert
         UICtrl.showAlert('Task removed', 'success');
        
        //Update the local storage after removing an item
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    //?Function to display the todos in the localstorage in the UI
    const displayTodos = () => {
        //Get books from local storage
        const todos = getTodos();

        //Display in the UI
        todos.forEach(todo => UICtrl.addTodoItem(todo));

        //console.log(todos);
    }


    return {
        init: () => {
            console.log('App has started');
            allEventListeners();
        }
    }

})(todoController, UIController);
controller.init();