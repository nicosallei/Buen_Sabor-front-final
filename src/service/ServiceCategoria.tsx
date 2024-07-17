

export const MostrarTodasLasCategorias = () => {
  fetch('/traer-todo/')
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la respuesta');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      // Aquí puedes manejar los datos, por ejemplo, estableciendo el estado de tu componente
    })
    .catch(error => {
      console.error('Error:', error);
      // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje de error al usuario
    });
};