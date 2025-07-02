from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from drive_excel_manager import DriveExcelManager
import logging

app = Flask(__name__)
CORS(app)  # Permitir CORS para el frontend

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Inicializar el manager de Drive
drive_manager = DriveExcelManager()

@app.route('/api/save-user-data', methods=['POST'])
def save_user_data():
    """Endpoint para guardar datos del usuario en Google Drive"""
    try:
        data = request.get_json()
        
        # Validar datos requeridos
        required_fields = ['nombre', 'email', 'whatsapp']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({
                    'success': False, 
                    'error': f'Campo requerido faltante: {field}'
                }), 400
        
        # Guardar en Google Drive
        drive_manager.add_contact(
            nombre=data['nombre'],
            email=data['email'],
            whatsapp=data['whatsapp']
        )
        
        logger.info(f"Usuario guardado: {data['nombre']} - {data['email']}")
        
        return jsonify({
            'success': True,
            'message': 'Datos guardados exitosamente'
        })
        
    except Exception as e:
        logger.error(f"Error guardando usuario: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Error interno del servidor'
        }), 500

@app.route('/api/save-test-results', methods=['POST'])
def save_test_results():
    """Endpoint para guardar resultados del test"""
    try:
        data = request.get_json()
        
        # Validar datos
        required_fields = ['userData', 'score', 'percentage', 'answers']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Campo requerido faltante: {field}'
                }), 400
        
        # Aquí podrías guardar los resultados en otra hoja o base de datos
        logger.info(f"Resultados del test para {data['userData']['nombre']}: {data['percentage']}%")
        
        # Por ahora solo logueamos, pero podrías extender para guardar en Drive
        
        return jsonify({
            'success': True,
            'message': 'Resultados guardados exitosamente'
        })
        
    except Exception as e:
        logger.error(f"Error guardando resultados: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Error interno del servidor'
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Endpoint de salud para verificar que el servidor esté funcionando"""
    return jsonify({
        'status': 'healthy',
        'message': 'Servidor funcionando correctamente'
    })

if __name__ == '__main__':
    # Crear archivo Excel si no existe
    try:
        # Puedes descomentar esto para crear el archivo inicial
        # drive_manager.create_excel_file()
        pass
    except Exception as e:
        logger.warning(f"No se pudo crear archivo inicial: {str(e)}")
    
    app.run(debug=True, host='0.0.0.0', port=5000)