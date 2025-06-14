let tareas = [];

const lista = document.getElementById("lista-tareas");
const form = document.getElementById("form-tarea");
const input = document.getElementById("tarea");
const btnBorrar = document.getElementById("borrar-todo");
const btnConfirmar = document.getElementById("confirmar-borrado");

// Cargar tareas guardadas
document.addEventListener("DOMContentLoaded", () => {
  const datos = localStorage.getItem("tareas");
  if (datos) {
    tareas = JSON.parse(datos);
    tareas.forEach(mostrarTarea);
  }
});

// Guardar en localStorage
function guardarTareas(tareas) {
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

// Mostrar una tarea
function mostrarTarea(tarea) {
  const li = document.createElement("li");
  li.classList.add("tarea-item");
  li.setAttribute("data-id", tarea.id);

  const texto = document.createElement("span");
  texto.textContent = tarea.texto;
  texto.classList.add("texto-tarea");

  const acciones = document.createElement("div");
  acciones.classList.add("acciones");

  const btnEditar = document.createElement("button");
  btnEditar.textContent = "Editar";

  const btnEliminar = document.createElement("button");
  btnEliminar.textContent = "Eliminar";

  // Editar
  btnEditar.addEventListener("click", () => {
    const nuevoTexto = prompt("Edita la tarea:", tarea.texto);
    if (nuevoTexto && nuevoTexto.trim() !== "") {
      tarea.texto = nuevoTexto.trim();
      guardarTareas(tareas);
      texto.textContent = tarea.texto;
    }
  });

  // Eliminar
  btnEliminar.addEventListener("click", () => {

    if (acciones.querySelector(".confirmar-eliminar")) return;

    const btnConfirmar = document.createElement("button");
    btnConfirmar.textContent="¿Seguro?";
    btnConfirmar.classList.add("confirmar-eliminar");
    btnEliminar.style.display = "none";
    btnConfirmar.addEventListener("click", () => {

      tareas = tareas.filter(t => t.id !== tarea.id);
      guardarTareas(tareas);
      li.remove();
  });
  acciones.appendChild(btnConfirmar);
  });

  acciones.appendChild(btnEditar);
  acciones.appendChild(btnEliminar);

  li.appendChild(texto);
  li.appendChild(acciones);
  lista.appendChild(li);
}

// Agregar nueva tarea
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const texto = input.value.trim();
  if (texto === "") return;

  const nuevaTarea = {
    id: Date.now(),
    texto: texto
  };

  tareas.push(nuevaTarea);
  guardarTareas(tareas);
  mostrarTarea(nuevaTarea);
  input.value = "";
});

// Botón de eliminar todas
btnBorrar.addEventListener("click", () => {
  btnBorrar.style.display = "none";
  btnConfirmar.style.display = "inline-block";
});

btnConfirmar.addEventListener("click", () => {
  tareas = [];
  guardarTareas(tareas);
  lista.innerHTML = "";
  btnBorrar.style.display = "inline-block";
  btnConfirmar.style.display = "none";
});


document.getElementById("btn-descargar").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const tituloDocumento = document.getElementById("nombre-lista");
  const tituloLista = tituloDocumento.textContent;
  doc.setFontSize(16);
  doc.text(tituloLista, 10, 10);

  let y = 20;
  tareas.forEach((tarea, index) => {
    doc.setFontSize(12);
    doc.text(`${index + 1}. ${tarea.texto}`, 10, y);
    y += 10;
  });

  doc.save("ListaDeTareas.pdf");
});
