import psycopg2
from jsonrpc import JSONRPCResponseManager, dispatcher
from werkzeug.wrappers import Request, Response
import json
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)




db_connection = psycopg2.connect(
    host="localhost",
    port=5432,
    user="postgres",
    password="123456",
    database="PracticaCrud"
)
#Metodo para listar a las personas 
#@app.route('/ss',  methods=['GET'])
#def index():
     #return "Hola desde el servidor!"

@dispatcher.add_method
def obtener_datos():
    try:
        cursor = db_connection.cursor()

        # Realizar la consulta SELECT
        cursor.execute("SELECT * FROM Persona")

        # Obtener los resultados
        resultados = cursor.fetchall()

        # Convertir los resultados a un formato JSON
        resultados_json = json.dumps(resultados)

        return resultados_json
    except Exception as e:
        # Manejo de errores
        return f"Error al obtener datos de la base de datos: {str(e)}"
    finally:
        # Cerrar el cursor
        cursor.close()


#Metodo para registrar Persona 
@dispatcher.add_method
def registrar_persona(p_nombres, p_apellidos,p_correo,p_direccion):
    try:
        cursor = db_connection.cursor()

        # Llamada al procedimiento almacenado
        #cursor.callproc('ingresar_persona', (p_nombres, p_apellidos,p_correo,p_direccion))
        cursor.execute("CALL ingresar_persona(%s, %s, %s, %s)", (p_nombres, p_apellidos,p_correo,p_direccion))
        # Confirmar los cambios en la base de datos
        db_connection.commit()

        return "Datos guardados exitosamente en la base de datos"
    except Exception as e:
        # Manejo de errores
        return f"Error al guardar datos en la base de datos: {str(e)}"
    finally:
        # Cerrar el cursor
        cursor.close()

#metodo para editar persona
@dispatcher.add_method
def actualizar_persona(p_id_persona,p_nombres, p_apellidos,p_correo,p_direccion):
    try:
        cursor = db_connection.cursor()

        # Llamada al procedimiento almacenado
        cursor.execute("CALL actualizar_persona(%s,%s, %s, %s, %s)", (p_id_persona,p_nombres, p_apellidos,p_correo,p_direccion))
        # Confirmar los cambios en la base de datos
        db_connection.commit()

        return "Datos guardados exitosamente en la base de datos"
    except Exception as e:
        # Manejo de errores
        return f"Error al guardar datos en la base de datos: {str(e)}"
    finally:
        # Cerrar el cursor
        cursor.close()
        
#metodo para eliminar persona
@dispatcher.add_method
def eliminar_persona(p_id_persona):
    try:
        cursor = db_connection.cursor()

        # Llamada al procedimiento almacenado
        cursor.execute("CALL eliminar_persona(%s)", (p_id_persona))
        # Confirmar los cambios en la base de datos
        db_connection.commit()

        return "Datos eliminados exitosamente de la base de datos"
    except Exception as e:
        # Manejo de errores
        return f"Error al guardar datos en la base de datos: {str(e)}"
    finally:
        # Cerrar el cursor
        cursor.close()


@dispatcher.add_method
def mi_metodo_remoto():
    return "Hola desde el servidor!"

@dispatcher.add_method
def otro_metodo():
    return "Skere modo diablo!"


#if __name__ == "__main__":
 #   app.run(host='0.0.0.0', port=81)

@Request.application
def application(request):
    response = JSONRPCResponseManager.handle(
        request.get_data(as_text=True),
        dispatcher
    )
    
    # Configuración de los encabezados CORS
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    return Response(response.json, content_type='application/json', headers=headers)

if __name__ == '__main__':
    from werkzeug.serving import run_simple
    run_simple('localhost', 4000, application)