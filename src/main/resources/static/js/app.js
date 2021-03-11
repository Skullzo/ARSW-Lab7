app= (function (){
    var valorTotal = null;
    var blueprintAct = null;
    var arreglo = [];
    var _funcModify = function (variable) {
        if(variable != null){
            arreglo = variable.map(function(blueprint){
                return {key:blueprint.name, value:blueprint.points.length}
            })
            $("#tabla tbody").empty();
            arreglo.map(function(blueprint){
                var temporal = '<tr><td id="nombreActor">'+blueprint.key+'</td><td id="puntos">'+blueprint.value+'</td><td type="button" onclick="app.drawPlan(\''+blueprint.key+'\'),app.funListener()">Open</td></tr>';

                $("#tabla tbody").append(temporal);
            })

            valorTotal = arreglo.reduce(function(total, valor){
                return total.value + valor.value;
            })
            document.getElementById("autorLabel").innerHTML = authorP;
            document.getElementById("puntosLabel").innerHTML = valorTotal;
        }
    };
    var _funcDraw = function (vari) {
        if (vari) {
            blueprintAct = vari;
            var lastx = null;
            var lasty = null;
            var actx = null;
            var acty = null;
            var c = document.getElementById("myCanvas");
            var ctx = c.getContext("2d");
            ctx.clearRect(0, 0, 400, 400);
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
    var holi = 0;
    var memoriaTemporal = null;
    _funcListener = function () {
        var lastx = null;
        var lasty = null;
        var actx = null;
        var acty = null;
        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");
        memoriaTemporal = [];
        if( holi == 1 ){
            c.removeEventListener("click", fun, false);
            holi =0;
        }
        holi=holi+1;
        c.addEventListener("click", fun = function (evt) {
            mousePos = getMousePos(c, evt);
            var pareja = [mousePos.x,mousePos.y];
            memoriaTemporal.push(pareja);
            if (lastx == null) {
                lastx = mousePos.x;
                lasty = mousePos.y;
            } else {
                actx = mousePos.x;
                acty = mousePos.y;
                ctx.moveTo(lastx, lasty);
                ctx.lineTo(actx, acty);
                ctx.stroke();
                lastx = actx;
                lasty = acty;
            }
        }, false);
    };
    var saveBlueprint = function () {
        var arregloS = [];
        blueprintAct.points.map(function (value) {
            arregloS.push(value);
        });
        memoriaTemporal.map( function (valor) {
            var x1=valor[0];
            var y1=valor[1];
            arregloS.push({x:x1,y:y1});

        });
        blueprintAct.points = arregloS;
        putBlueprint();
        document.getElementById("puntosLabel").innerHTML = valorTotal+memoriaTemporal.length-1;
    };
    var putBlueprint = function(){
        if (blueprintAct != null){
            $.ajax({
                url: "/blueprints/"+blueprintAct.author+"/"+blueprintAct.name,
                type: 'PUT',
                data: JSON.stringify(blueprintAct),
                contentType: "application/json"
            });
        }
        else {
            alert("Error.");
        }
    }
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
                console.info('Delete Fallo');
            }
        );
        return prom;
    }
    var responseAll = null;
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
    var insertBlueprint=(function () {
    })
    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return{
             x: evt.clientX - rect.left,
             y: evt.clientY - rect.top
        };
    }
    return {
            allBlueprints:blueprintsA,
            plansAuthor: function () {
                authorP = document.getElementById("autor").value;
                apimok.getBlueprintsByAuthor(authorP,_funcModify);
            },

            drawPlan: function(name) {
                author = document.getElementById("autor").value;
                obra = name;
                apimok.getBlueprintsByNameAndAuthor(author,obra,_funcDraw);
            },
            funListener: _funcListener,
            modify: saveBlueprint,
            delete:deleteBlueprint
        };
})();