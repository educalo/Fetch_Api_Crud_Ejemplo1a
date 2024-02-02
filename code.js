//Definición de variables
//url de nuestra api
const url = 'http://localhost:3000/api/articulos/'
const contenedor = document.querySelector('tbody')
let resultados = ''

//definición de las variables
//para el modal nos vamos a bootstrap v5 y nos dice como se referencia
const modalArticulo = new bootstrap.Modal(document.getElementById('modalArticulo'))
const formArticulo = document.querySelector('form')
const descripcion = document.getElementById('descripcion')
const precio = document.getElementById('precio')
const stock = document.getElementById('stock')
//para diferenciar si es una inserción o una edición
var opcion = ''

//boton clic para el botón "Crear"
btnCrear.addEventListener('click', ()=>{
    descripcion.value = ''
    precio.value = ''
    stock.value = ''
    modalArticulo.show()
    opcion = 'crear'
})

//funcion para mostrar los resultados
//tr filas
//td celdas
//los resultados los añado en el contenedor definido al principio en el tbody
const mostrar = (articulos) => {
    articulos.forEach(articulo => {
        resultados += `<tr>
                            <td>${articulo.id}</td>
                            <td>${articulo.descripcion}</td>
                            <td>${articulo.precio}</td>
                            <td>${articulo.stock}</td>
                            <td class="text-center"><a class="btnEditar btn btn-primary">Editar</a><a class="btnBorrar btn btn-danger">Borrar</a></td>
                       </tr>
                    `    
    })
    contenedor.innerHTML = resultados
    
}

//Procedimiento Mostrar
//llamo en la segunda promesa a la función mostrar
fetch(url)
    .then( response => response.json() )
    .then( data => mostrar(data) )
    .catch( error => console.log(error))


//Metodo "on" en jquery para la creación de botones de forma dinámica
//Podemos descomentar los console.log para ver que nos devuelve cada parametro del on   
//Este on es uno generico para hacer pruebas el siguiente on es el personalizado
const on = (element, event, selector, handler) => {
    //console.log(element)
    //console.log(event)
    //console.log(selector)
    //console.log(handler)
    element.addEventListener(event, e => {
        if(e.target.closest(selector)){
            handler(e)
        }
    })
}
//metodo on de jquery para manejar eventos a los objetos de DOM, en nuestro caso los botones que se crean de forma dinámica
//Procedimiento Borrar
on(document, 'click', '.btnBorrar', e => {
    const fila = e.target.parentNode.parentNode
    //tenemos que capturar el id para borrar
    //nos devuelve toda la fila que hemos capturado
    //console.log(fila)
    //obtenemos el primer elemento de la fila anteriormente caputrada
    const id = fila.firstElementChild.innerHTML
    //console.log(id)
    //utilizo alertify para hacer una u otra cosa en función de la opción elegida en la alerta
    alertify.confirm("This is a confirm dialog.",
    function(){
        fetch(url+id, {
            method: 'DELETE'
        })
        .then( res => res.json() )
        //hace una recarga
        .then( ()=> location.reload())
        //nos muetra una confirmación en la parte de abajo de la página
        //alertify.success('Ok')
    },
    function(){
        //nos muetra una confirmación en la parte de abajo de la página
        alertify.error('Cancel')
    })
})

//metodo on de jquery para manejar botones que se crean de forma dinámica
//Procedimiento Editar
//esta variable se utiliza en editar en el metodo de envio PUT
let idForm = 0
on(document, 'click', '.btnEditar', e => {    
    const fila = e.target.parentNode.parentNode
    idForm = fila.children[0].innerHTML
    const descripcionForm = fila.children[1].innerHTML
    const precioForm = fila.children[2].innerHTML
    const stockForm = fila.children[3].innerHTML
    //asigno estas variables a nuestro formulario a traves del id del componente
    descripcion.value =  descripcionForm
    precio.value =  precioForm
    stock.value =  stockForm
    opcion = 'editar'
    modalArticulo.show()
     
})

//Procedimiento para Crear y Editar
//El mismo evento lo utilizamos tanto en la creación como en la edición
formArticulo.addEventListener('submit', (e)=>{
    //para que no se recarge la página
    e.preventDefault()
    if(opcion=='crear'){        
        //console.log('OPCION CREAR')
        //se conecta a nuestra API por el metodo POST
        fetch(url, {
            method:'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                descripcion:descripcion.value,
                precio:precio.value,
                stock:stock.value
            })
        })
        .then( response => response.json() )
        .then( data => {
            const nuevoArticulo = []
            nuevoArticulo.push(data)
            //llamo al prodecimiento mostrar y le paso el arreglo nuevoArticulo
            mostrar(nuevoArticulo)
        })
    }
    if(opcion=='editar'){    
        //console.log('OPCION EDITAR')
        //se conecta a nuestra API por el metodo PUT
        fetch(url+idForm,{
            method: 'PUT',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                descripcion:descripcion.value,
                precio:precio.value,
                stock:stock.value
            })
        })
        .then( response => response.json() )
        .then( response => location.reload() )
    }
    //ocultamos el modal
    modalArticulo.hide()
})

