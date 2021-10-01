function myOnLoad() {
  cargarDepartamentos();
}

function cargarDepartamentos() {
  fetch("data_departamentos.json")
    .then((res) => res.json())
    .then((res) => {
      array = res.Departamentos;
      addOptions("departamento", array);
    });
}

function addOptions(domElement, array) {
  let select = document.getElementsByName(domElement)[0];

  for (value in array) {
    let option = document.createElement("option");
    option.text = array[value];
    option.value = array[value];
    select.add(option);
  }
}

function cargarCiudades() {
  // Objeto de departamentos con ciudades

  fetch("data_ciudades.json")
    .then((res) => res.json())
    .then((res) => {
      listaCiudades = res;
      let Departamentos = document.getElementById("departamento");
      let ciudades = document.getElementById("ciudad");
      let departamentoSeleccionado = Departamentos.value;

      // Se limpian los ciudades
      ciudades.innerHTML = '<option value="">Seleccione una ciudad...</option>';

      if (departamentoSeleccionado !== "") {
        // Se seleccionan los ciudades y se ordenan
        departamentoSeleccionado = listaCiudades[departamentoSeleccionado];
        departamentoSeleccionado.sort();

        // Insertamos los ciudades
        departamentoSeleccionado.forEach(function (ciudad) {
          let opcion = document.createElement("option");
          opcion.value = ciudad;
          opcion.text = ciudad;
          ciudades.add(opcion);
        });
      }
    });
}
