
### Escuela Colombiana de Ingeniería
### Arquitecturas de Software - ARSW
## Laboratorio Construción de un cliente 'grueso' con un API REST, HTML5, Javascript y CSS3. Parte II.

### Dependencias:
* [Laboratorio API REST para la gestión de planos.](https://github.com/ARSW-ECI-beta/REST_API-JAVA-BLUEPRINTS_PART2)
* [Laboratorio construción de un cliente ‘grueso’ con un API REST, HTML5, Javascript y CSS3. Parte I](https://github.com/ARSW-ECI-beta/REST_CLIENT-HTML5_JAVASCRIPT_CSS3_GRADLE-BLUEPRINTS_PART1)

### Descripción 
Este laboratorio tiene como fin, actualizar en Front para que se pueda comunicar con los servicios del REST API desarrollado anteriormente
### Parte I

![](img/mock2.png)

1. Agregue al canvas de la página un manejador de eventos que permita capturar los 'clicks' realizados, bien sea a través del mouse, o a través de una pantalla táctil. Para esto, tenga en cuenta [este ejemplo de uso de los eventos de tipo 'PointerEvent'](https://mobiforge.com/design-development/html5-pointer-events-api-combining-touch-mouse-and-pen) (aún no soportado por todos los navegadores) para este fin. Recuerde que a diferencia del ejemplo anterior (donde el código JS está incrustado en la vista), se espera tener la inicialización de los manejadores de eventos correctamente modularizado, tal [como se muestra en este codepen](https://codepen.io/hcadavid/pen/BwWbrw).

	**A continuación, se agregó el siguiente canvas, en el cual el usuario es capaz de manejar los eventos capturando los 'clicks' realizados en Abrir, en la tercera columna de la tabla. El canvas fue implementado en ```app.js```, y quedó de la siguiente forma.**

	```javascript
	var _funcDraw = function (vari) {
		if (vari) {
		    var lastx = null;
		    var lasty = null;
		    var actx = null;
		    var acty = null;
		    var c = document.getElementById("myCanvas");
		    var ctx = c.getContext("2d");

		    ctx.clearRect(0, 0, 500, 500);
		    ctx.beginPath();

		    vari.points.map(function (prue){
			if (lastx == null) {
			    lastx = prue.x;
			    lasty = prue.y;
			} else {
			    actx = prue.x;
			    acty = prue.y;
			    ctx.moveTo(lastx, lasty);
			    ctx.lineTo(actx, acty);
			    ctx.stroke();
			    lastx = actx;
			    lasty = acty;
			}
		    });
		}
	}
	```

2. Agregue lo que haga falta en sus módulos para que cuando se capturen nuevos puntos en el canvas abierto (si no se ha seleccionado un canvas NO se debe hacer nada):
	1. Se agregue el punto al final de la secuencia de puntos del canvas actual (sólo en la memoria de la aplicación, AÚN NO EN EL API!).
	2. Se repinte el dibujo.

	**Luego de agregar lo que hace falta en los módulos para que cada ves que se capturen nuevos puntos en el canvas abierto se agreguen el punto al final de la secuencia de puntos del canvas actual y se repinte el dibujo, al compilar y desplegar la página, se observa que al abrir el plano de ```John Connor``` se grafica de la siguiente forma.**

	![img](https://github.com/Skullzo/ARSW-Lab7/blob/main/img/Punto2.PNG)

3. Agregue el botón Save/Update. Respetando la arquitectura de módulos actual del cliente, haga que al oprimirse el botón:

	**Primero se agrega el botón Save/Update en el ```index.html```, quedando el código de la siguiente forma.**

	```html
	<div class="column" >
		</br>
		</br>
		</br>
		<canvas id="myCanvas" width="400" height="400" style="border:1px solid #000000;"></canvas>
		</br>
		<button type="button" onclick="app.modify()">Save/Update</button>
	</div>	
	```
	
	**Luego de compilarlo para posteriormente desplegarlo en localhost, el botón queda de la siguiente forma.**
	
	![img](https://github.com/Skullzo/ARSW-Lab7/blob/main/img/Punto3.PNG)
	
	1. Se haga PUT al API, con el plano actualizado, en su recurso REST correspondiente.
	
	**Para hacer el PUT en el API con el plano actualizado en su recurso GET correspondiente, se implementa la función ```putBlueprint``` en ```app.js``` para que realice el correspondiente PUT del plano. La implementación queda de la siguiente forma.**
	
	```javascript
	var putBlueprint = function(){
	      if (blueprintAct != null){
		  $.ajax({
		      url: "/blueprints/"+blueprintAct.author+"/"+blueprintAct.name,
		      type: 'PUT',
		      data: JSON.stringify(blueprintAct),
		      contentType: "application/json"
		  });
	      }
	}
	```

	3. Se haga GET al recurso /blueprints, para obtener de nuevo todos los planos realizados.

	**Para hacer el GET al recurso ```/blueprints```, y así obtener de nuevo todos los planos realizados, se implementa nuevamente en ```app.js``` la función ```blueprintsA```, quedando el código de la siguiente forma.**
	
	```javascript
	var blueprintsA = function(){
	      allBlueprints=$.get("http://localhost:8080/blueprints");
	      allBlueprints.then(
		  function (data) {
		      responseAll = data;
		  },
		  function () {
		      alert("$.get failed!");
		  }
	      );
	      return responseAll;
	};
	```

	5. Se calculen nuevamente los puntos totales del usuario.

	Para lo anterior tenga en cuenta:

	* jQuery no tiene funciones para peticiones PUT o DELETE, por lo que es necesario 'configurarlas' manualmente a través de su API para AJAX. Por ejemplo, para hacer una peticion PUT a un recurso /myrecurso:

	```javascript
    return $.ajax({
        url: "/mirecurso",
        type: 'PUT',
        data: '{"prop1":1000,"prop2":"papas"}',
        contentType: "application/json"
    });
    
	```
	Para éste note que la propiedad 'data' del objeto enviado a $.ajax debe ser un objeto jSON (en formato de texto). Si el dato que quiere enviar es un objeto JavaScript, puede convertirlo a jSON con: 
	
	```javascript
	JSON.stringify(objetojavascript),
	```
	* Como en este caso se tienen tres operaciones basadas en _callbacks_, y que las mismas requieren realizarse en un orden específico, tenga en cuenta cómo usar las promesas de JavaScript [mediante alguno de los ejemplos disponibles](http://codepen.io/hcadavid/pen/jrwdgK).

	**Luego de ingresar a la página después de desplegarla, se ve que ahora se calcula nuevamente los puntos totales de usuario, como se ve a continuación.**

	![img](https://github.com/Skullzo/ARSW-Lab7/blob/main/img/Puntaje.PNG)

4. Agregue el botón 'Create new blueprint', de manera que cuando se oprima: 
	* Se borre el canvas actual.
	* Se solicite el nombre del nuevo 'blueprint' (usted decide la manera de hacerlo).
	
	**Primero se agrega el botón ```Create new blueprint``` en el ```index.html```, quedando el código de la siguiente forma.**

	```html
	<div class="column" >
		<button type="button" onclick="app">Create new blueprint</button>
		</br>
		</br>
		</br>
		<canvas id="myCanvas" width="400" height="400" style="border:1px solid #000000;"></canvas>
		</br>
		<button type="button" onclick="app.modify()">Save/Update</button>
	</div>
	```
	
	**Luego de compilarlo para posteriormente desplegarlo en localhost, el botón queda de la siguiente forma, luego de graficar en el canvas el plano.**
	
	![img](https://github.com/Skullzo/ARSW-Lab7/blob/main/img/Punto4.0.PNG)
	
	**Después de oprimirlo, se borra el canvas actual, como se ve a continuación.**
	
	![img](https://github.com/Skullzo/ARSW-Lab7/blob/main/img/Punto4.1.PNG)
	
	Esta opción debe cambiar la manera como funciona la opción 'save/update', pues en este caso, al oprimirse la primera vez debe (igualmente, usando promesas):

	1. Hacer POST al recurso /blueprints, para crear el nuevo plano.

	2. Hacer GET a este mismo recurso, para actualizar el listado de planos y el puntaje del usuario
	
	**Luego de realizar el POST al recurso ```/blueprints```, se crea el nuevo plano, y al dirigirnos al recurso ```http://localhost:8080/blueprints```, se observa que ahora el plano de ```JhonConnor``` que es el que ha sido agregado, aparece añadido en el recurso ```/blueprints```. Asimismo, al hacer GET a ese mismo recurso, se actualiza el listado de planos, como se ve a continuación.**

	![img](https://github.com/Skullzo/ARSW-Lab7/blob/main/img/BlueprintsAdded.PNG)

5. Agregue el botón 'DELETE', de manera que (también con promesas):
	* Borre el canvas.
	* Haga DELETE del recurso correspondiente.
	* Haga GET de los planos ahora disponibles.

	**Primero se agrega el botón ```Delete``` en el ```index.html```, quedando el código de la siguiente forma.**

	```html
	<div class="column" >
		<button type="button" onclick="app">Create new blueprint</button>
		</br>
		</br>
		</br>
		<canvas id="myCanvas" width="400" height="400" style="border:1px solid #000000;"></canvas>
		</br>
		<button type="button" onclick="app.modify()">Save/Update</button>
		<button type="button" onclick="app.delete()">Delete</button>
	</div>
	```

	**Luego de compilarlo para posteriormente desplegarlo en localhost, el botón queda de la siguiente forma.**

	![img](https://github.com/Skullzo/ARSW-Lab7/blob/main/img/Punto5.1.PNG)

	**Ahora en ```app.js``` se agregó la función ```deleteBlueprint``` encargada de realizar el ```Delete``` en el Canvas. La función se implementó de la siguiente forma.**

	```javascript
	var deleteBlueprint = function(){
		var prom = $.ajax({
		    url: "/blueprints/"+blueprintAct.author+"/"+blueprintAct.name,
		    type: 'DELETE',
		    contentType: "application/json"
		});

		prom.then(
		    function(){
			console.info('Delete OK');
		    },
		    function(){
			console.info('Delete No OK');
		    }
		);

		return prom;
	}
	```

	**Para garantizar el funcionamiento de ```Delete```, se tuvo que implementar en el código fuente, específicamente en la clase ```BlueprintsPersistence``` en donde se añadió el método ```deleteBlueprint``` para poder garantizar el funcionamiento del DELETE, quedando el método de la siguiente forma.**

	```java
	public void deleteBlueprint(String author, String name) throws BlueprintNotFoundException;
	```

	**Luego, en el mismo código fuente pero en la clase ```InMemoryBlueprintPersistence```, se implementó el método ```deleteBlueprint```, quedando el método de la siguiente forma.**

	```java
	@Override
	public void deleteBlueprint(String author, String name) throws BlueprintNotFoundException{
		blueprints.remove(new Tuple<>(author, name));
	}
	```

	**Por último, se añadió a la clase ```BlueprintsServices``` el método ```deleteBlueprint``` para finalmente terminar de implementar el funcionamiento del DELETE en el recurso correspondiente. El método se implementó de la siguiente forma.**

	```java
	public void deleteBlueprint(String author, String name) throws BlueprintNotFoundException{
		bpp.deleteBlueprint(author, name);
	}
	```

	**Para probar el funcionamiento del ```Delete```, se despliega la página en el navegador, y luego de dibujar el plano y guardarlo, se oprime el botón ```Delete```. Luego de primir el botón ```Delete```, al ir al recurso de ```/blueprints``` ingresando la URL en el navegador ```http://localhost:8080/blueprints```. Como se ve a continuación, el plano que ha sido creado con anterioridad ha sido borrado.**

	![img](https://github.com/Skullzo/ARSW-Lab7/blob/main/img/BlueprintsDeleted.PNG)

## Autores
[Alejandro Toro Daza](https://github.com/Skullzo)

[David Fernando Rivera Vargas](https://github.com/DavidRiveraRvD)
## Licencia & Derechos de Autor
**©** Alejandro Toro Daza, David Fernando Rivera Vargas. Estudiantes de Ingeniería de Sistemas de la [Escuela Colombiana de Ingeniería Julio Garavito](https://www.escuelaing.edu.co/es/).

Licencia bajo la [GNU General Public License](https://github.com/Skullzo/ARSW-Lab7/blob/main/LICENSE).
