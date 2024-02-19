import psycopg2
from jsonrpc import JSONRPCResponseManager, dispatcher
from werkzeug.wrappers import Request, Response
import json
from flask import Flask
from flask_cors import CORS
#nuevos imports para MapReduce
from multiprocessing import Pool
from collections import defaultdict
import os
import glob
import random
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




#para el MapReducer 
def read_logs(file_path):
    with open(file_path, 'r') as file:
        return file.readlines()

def mapper(log_lines):
    event_counts = defaultdict(int)
    for line in log_lines:
        parts = line.strip().split(',')
        event_type = parts[1]  # El tipo de evento esta en la segunda columna
        event_counts[event_type] += 1
    return list(event_counts.items())

def reducer(item):
    event_type, counts = item
    return (event_type, sum(counts))

#funcion principal para el MapReducer 
log_dir = "C:\\Users\\casti\\OneDrive\\Escritorio\\Example_Map_reducer\\RPCPY"
@dispatcher.add_method
def MapReducer():
    # C:\Users\casti\OneDrive\Escritorio\Example_Map_reducer\RPCPY
    file_paths = glob.glob(os.path.join(log_dir, "*.log"))
    pool = Pool(processes=4)  # Con esto se puede ajustar el numero de procesos
    logs = pool.map(read_logs, file_paths)
    mapped = pool.map(mapper, logs)
    reduced = defaultdict(list)
    for item_list in mapped:
        for event_type, count in item_list:
            reduced[event_type].append(count)
    result = dict(pool.map(reducer, reduced.items()))
    print(result)

    # Convertir los resultados a un formato JSON específico
    resultados_json = json.dumps([f"{key}: {value}" for key, value in result.items()])
    return resultados_json



#Funcion para crear los archivos .log de manera aleatoria enviadole un nombre 
@dispatcher.add_method
def generar_logs(nombre_archivo, cantidad_lineas):
    cantidad_lineas = int(cantidad_lineas)  # Convertir a entero
    print(nombre_archivo + ":" + str(cantidad_lineas))
    #tipos de eventos para los archivos .log
    event_types = ['login', 'logout', 'click','error','complete']
    with open(nombre_archivo+".log", 'w') as file:
        for i in range(1, cantidad_lineas + 1):
            event_type = random.choice(event_types)
            file.write(f"{i},{event_type}\n")

#funcion para listar los archivos .log
@dispatcher.add_method
def listar_archivos_log():
    archivos_log = [archivo for archivo in os.listdir(log_dir) if archivo.endswith(".log")]
    resultados_json = json.dumps(archivos_log)
    return resultados_json

#funcion para ver el contenido de un archivo .log 
@dispatcher.add_method
def leer_archivo_log(nombre_archivo):
    eventos = []
    with open(nombre_archivo, 'r') as file:
        for linea in file:
            partes = linea.strip().split(',')
            eventos.append({"ID": int(partes[0]), "tipo": partes[1]})
    resultados_json = json.dumps(eventos)
    return resultados_json

#funcion para eliminar un archivo log 
@dispatcher.add_method

def eliminar_archivo_log(nombre_archivo):
    if nombre_archivo.endswith('.log'):
        try:
            os.remove(nombre_archivo)
            print(f"El archivo {nombre_archivo} ha sido eliminado correctamente.")
        except OSError as e:
            print(f"No se pudo eliminar el archivo {nombre_archivo}: {e}")
    else:
        print("El archivo no es un archivo .log válido.")


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