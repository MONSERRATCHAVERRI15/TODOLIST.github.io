// Espera a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function() {
    // Obtiene referencias a elementos del DOM
    const taskInput = document.getElementById("taskInput");
    const tasksBody = document.getElementById("tasksBody");
    const completedTasksBody = document.getElementById("completedTasksBody");

    // Establece el foco en el campo de entrada de tarea
    taskInput.focus();

    // Función para agregar una tarea a la tabla
    function addTaskToTable(taskContent, completed = false) {
        const tr = document.createElement("tr"); // Crea una nueva fila (tr)

        // Crea una celda (td) para el checkbox de completado
        const checkboxTd = document.createElement("td");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = completed;
        checkbox.addEventListener("change", function() {
            // Mueve la fila a la lista de tareas completadas o activas según el estado del checkbox
            if (this.checked) {
                tasksBody.removeChild(tr);
                tr.classList.add("completed");
                completedTasksBody.appendChild(tr);
            } else {
                completedTasksBody.removeChild(tr);
                tr.classList.remove("completed");
                tasksBody.appendChild(tr);
            }
            saveTasks(); // Guarda las tareas en el almacenamiento local
        });
        checkboxTd.appendChild(checkbox);

        // Crea una celda (td) para el contenido de la tarea
        const taskText = document.createElement("td");
        taskText.textContent = taskContent;

        // Crea una celda (td) para el estado de la tarea
        const statusTd = document.createElement("td");
        statusTd.textContent = completed ? "Completed" : "Active";

        // Crea un botón para eliminar la tarea
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function() {
            tr.remove(); // Elimina la fila
            saveTasks(); // Guarda las tareas en el almacenamiento local
        });

        // Agrega las celdas a la fila
        tr.appendChild(checkboxTd);
        tr.appendChild(taskText);
        tr.appendChild(statusTd);
        tr.appendChild(deleteButton);

        // Agrega la fila a la lista correspondiente (activa o completada)
        if (completed) {
            tr.classList.add("completed");
            completedTasksBody.appendChild(tr);
        } else {
            tasksBody.appendChild(tr);
        }

        saveTasks(); // Guarda las tareas en el almacenamiento local
    }

    // Función para guardar las tareas en el almacenamiento local
    function saveTasks() {
        const tasks = Array.from(tasksBody.children).map(function(task) {
            return {
                content: task.querySelector("td:nth-child(2)").textContent, // Obtiene el contenido de la tarea
                completed: task.classList.contains("completed") // Verifica si la tarea está completada
            };
        });
        const completedTasks = Array.from(completedTasksBody.children).map(function(task) {
            return {
                content: task.querySelector("td:nth-child(2)").textContent, // Obtiene el contenido de la tarea
                completed: task.classList.contains("completed") // Verifica si la tarea está completada
            };
        });
        localStorage.setItem("tasks", JSON.stringify(tasks.concat(completedTasks))); // Guarda las tareas en el almacenamiento local
    }

    // Función para cargar las tareas guardadas en el almacenamiento local
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || []; // Obtiene las tareas guardadas o crea un arreglo vacío
        tasks.forEach(function(task) {
            addTaskToTable(task.content, task.completed); // Agrega cada tarea a la tabla
        });
    }

    loadTasks(); // Carga las tareas guardadas al cargar la página

    // Escucha el evento click del botón de añadir tarea
    document.getElementById("addTaskButton").addEventListener("click", function() {
        const taskContent = taskInput.value.trim(); // Obtiene el contenido de la tarea
        if (taskContent !== "") {
            addTaskToTable(taskContent); // Agrega la tarea a la tabla
            taskInput.value = ""; // Limpia el campo de entrada de tarea
        }
        taskInput.focus(); // Establece el foco en el campo de entrada de tarea
    });
});
