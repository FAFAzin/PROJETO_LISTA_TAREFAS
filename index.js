//pegando elementos
const form = document.querySelector("#todo-form");
const taskTitleInput = document.querySelector("#task-title-input");
const todoListUl = document.querySelector("#todo-list");

// dialog
const dialog = document.querySelector("#dialog");
const fecharDialog = document.querySelector("#fechar");

//iniciando a list
let tasks = [];

/* 
A função implementa as tarefas no html, os elementos sõa colocados dentro da ul depois de colocados dentro de uma li

@param {string}

@return {void}
 */
function renderTasksOnHtml(taskTitle, done = false) {
  //adcionando nova tarefa no html
  //* li
  const li = document.createElement("li");

  //elementos que irão dentro da li
  //*checkbox
  const input = document.createElement("input");
  input.setAttribute("type", "checkbox");
  //evento ao clicar no checkbox
  input.addEventListener("change", (e) => {
    const liToToggle = e.target.parentElement;
    const spanToToggle = liToToggle.querySelector("span");

    const done = e.target.checked;

    if (done) {
      spanToToggle.style.textDecoration = "line-through";
      li.style.backgroundColor = "#595959";
    } else {
      spanToToggle.style.textDecoration = "none";
      li.style.backgroundColor = "#ffb800";
    }

    tasks = tasks.map((t) => {
      if (t.title === spanToToggle.textContent) {
        return {
          title: t.title,
          done: !t.done,
        };
      }
      return t;
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
  });

  input.checked = done;

  //* span
  const span = document.createElement("span");
  const p = document.createElement("p");
  p.textContent = taskTitle;
  span.appendChild(p);

  if (done) {
    span.style.textDecoration = "line-through";
    li.style.backgroundColor = "#595959";
  }

  //* button
  const button = document.createElement("button");
  button.textContent = "x";
  button.addEventListener("click", (e) => {
    const liToRemove = e.target.parentElement;

    const titleRemove = liToRemove.querySelector("span").textContent;

    tasks = tasks.filter((t) => t.title !== titleRemove);

    todoListUl.removeChild(liToRemove);

    localStorage.setItem("tasks", JSON.stringify(tasks));
  });

  //adicionando na li e na ul
  li.appendChild(input);
  li.appendChild(span);
  li.appendChild(button);

  todoListUl.appendChild(li);
}

/* 
Pega todos os dados salvo no local storage e os adiciona como tarefas no html

@param {void}

@return {void}
*/
window.onload = () => {
  const tasksOnLocalStorage = localStorage.getItem("tasks");

  if (!tasksOnLocalStorage) return;

  tasks = JSON.parse(tasksOnLocalStorage);

  tasks.forEach((t) => {
    renderTasksOnHtml(t.title, t.done);
  });
};

/* 
Remove a caixa de pop up quando ocorre de o usuário adicionar uma tarefa com o conteúdo menor que 3 caracteres

@param {void}

@return {void}
 */
function removeDialog() {
  fecharDialog.addEventListener("click", () => {
    dialog.style.display = "none";
    dialog.close();
  });
}
//chamando a função removeDialog
removeDialog();

/* 
Verifica se a tarefa passada é menor que 3 caracteres, caso seja, será disparado um pop up informando que o conteúdo precisa ser maior

@param {string}

@return {null} or {string}
*/
function windowErrorInForm(taskTitle) {
  if (taskTitle.length < 3) {
    dialog.style.display = "flex";
    dialog.showModal();
    return;
  } else {
    return taskTitle;
  }
}

/* 
Adiciona as tarefas na lista "tasks" e mantém atualizada

@param {string}

@return {void}
*/
function addInList(taskTitle) {
  tasks.push({
    title: taskTitle,
    done: false,
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* 
evento disparado ao clicar no botão para criar uma nova tarefa
*/
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const taskTitle = taskTitleInput.value;
  const result = windowErrorInForm(taskTitle);

  //verificar se existe erro no nome da tarefa {windowErrorInForm()}
  if (!result) return;

  //Adicionando um novo item na lista de tarefas {addInList()}
  addInList(taskTitle);

  //adicionando a nova tarefa no HTML {renderTasksOnHtml}
  renderTasksOnHtml(taskTitle);

  //limpando input
  taskTitleInput.value = "";
});
