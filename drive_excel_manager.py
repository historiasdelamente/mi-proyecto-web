import os
import json
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload, MediaIoBaseDownload
import pandas as pd
import io

class DriveExcelManager:
    def __init__(self, credentials_file=None):
        self.credentials_file = credentials_file
        self.scopes = ['https://www.googleapis.com/auth/drive.file']
        self.service = None
        self.spreadsheet_id = None
        self.authenticate()
    
    def authenticate(self):
        """Autentica con Google Drive API usando variables de entorno"""
        # Crear credenciales desde variables de entorno
        credentials_info = {
            "web": {
                "client_id": os.getenv('GOOGLE_CLIENT_ID'),
                "client_secret": os.getenv('GOOGLE_CLIENT_SECRET'),
                "project_id": os.getenv('GOOGLE_PROJECT_ID', 'eighth-zenith-380906'),
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs"
            }
        }
        
        # Si hay token guardado en variables de entorno, usarlo
        if os.getenv('GOOGLE_ACCESS_TOKEN'):
            creds_data = {
                'token': os.getenv('GOOGLE_ACCESS_TOKEN'),
                'refresh_token': os.getenv('GOOGLE_REFRESH_TOKEN'),
                'token_uri': credentials_info['web']['token_uri'],
                'client_id': credentials_info['web']['client_id'],
                'client_secret': credentials_info['web']['client_secret'],
                'scopes': self.scopes
            }
            creds = Credentials.from_authorized_user_info(creds_data, self.scopes)
        else:
            # Para desarrollo local, usar flujo normal
            if self.credentials_file and os.path.exists(self.credentials_file):
                flow = Flow.from_client_secrets_file(self.credentials_file, self.scopes)
                flow.redirect_uri = 'urn:ietf:wg:oauth:2.0:oob'
                
                auth_url, _ = flow.authorization_url(prompt='consent')
                print(f'Ve a esta URL para autorizar: {auth_url}')
                code = input('Ingresa el código de autorización: ')
                flow.fetch_token(code=code)
                creds = flow.credentials
            else:
                raise Exception("No se encontraron credenciales válidas")
        
        self.service = build('drive', 'v3', credentials=creds)
    
    def create_excel_file(self, filename='delamente_datos.xlsx'):
        """Crea un archivo Excel en Google Drive con las columnas necesarias"""
        # Crear DataFrame con columnas
        df = pd.DataFrame(columns=['Nombre', 'Email', 'WhatsApp'])
        
        # Guardar localmente primero
        local_file = f'/tmp/{filename}'
        df.to_excel(local_file, index=False)
        
        # Subir a Google Drive
        file_metadata = {
            'name': filename,
            'mimeType': 'application/vnd.google-apps.spreadsheet'
        }
        
        media = MediaFileUpload(local_file, 
                               mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        
        file = self.service.files().create(body=file_metadata,
                                         media_body=media,
                                         fields='id').execute()
        
        self.spreadsheet_id = file.get('id')
        print(f'Archivo creado con ID: {self.spreadsheet_id}')
        
        # Limpiar archivo temporal
        os.remove(local_file)
        return self.spreadsheet_id
    
    def add_contact(self, nombre, email, whatsapp):
        """Añade un nuevo contacto al archivo Excel"""
        if not self.spreadsheet_id:
            print("Primero crea un archivo Excel")
            return
        
        # Descargar archivo actual
        df = self.download_excel()
        
        # Añadir nueva fila
        new_row = pd.DataFrame([{
            'Nombre': nombre,
            'Email': email, 
            'WhatsApp': whatsapp
        }])
        
        df = pd.concat([df, new_row], ignore_index=True)
        
        # Actualizar archivo
        self.update_excel(df)
        print(f"Contacto añadido: {nombre}")
    
    def download_excel(self):
        """Descarga y lee el archivo Excel actual"""
        request = self.service.files().export_media(fileId=self.spreadsheet_id,
                                                   mimeType='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        
        file_io = io.BytesIO()
        downloader = MediaIoBaseDownload(file_io, request)
        done = False
        while done is False:
            status, done = downloader.next_chunk()
        
        file_io.seek(0)
        df = pd.read_excel(file_io)
        return df
    
    def update_excel(self, df):
        """Actualiza el archivo Excel en Google Drive"""
        local_file = '/tmp/temp_update.xlsx'
        df.to_excel(local_file, index=False)
        
        media = MediaFileUpload(local_file, 
                               mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        
        self.service.files().update(fileId=self.spreadsheet_id,
                                  media_body=media).execute()
        
        os.remove(local_file)
    
    def get_all_contacts(self):
        """Obtiene todos los contactos del archivo"""
        df = self.download_excel()
        return df.to_dict('records')
    
    def set_spreadsheet_id(self, spreadsheet_id):
        """Establece el ID de un archivo existente"""
        self.spreadsheet_id = spreadsheet_id

# Ejemplo de uso
if __name__ == "__main__":
    manager = DriveExcelManager()
    
    # Crear archivo Excel (solo la primera vez)
    # spreadsheet_id = manager.create_excel_file()
    
    # O usar un archivo existente
    # manager.set_spreadsheet_id('tu_spreadsheet_id_aqui')
    
    # Añadir contactos
    # manager.add_contact("Juan Pérez", "juan@email.com", "+1234567890")
    
    # Ver todos los contactos
    # contacts = manager.get_all_contacts()
    # print(contacts)