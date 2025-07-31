# Sistema de Login y Registro - Frontend y Backend

Un sistema completo de autenticación con frontend responsive y backend API REST, construido con tecnologías modernas y base de datos en memoria.

## 📁 Estructura del Proyecto

```
loginwitCursorIA/
├── front/                    # Frontend
│   └── src/
│       ├── css/
│       │   └── styles.css
│       ├── js/
│       │   ├── script.js
│       │   └── register.js
│       └── html/
│           ├── index.html
│           └── register.html
├── backend/                  # Backend API
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js   # Base de datos en memoria
│   │   ├── controllers/
│   │   │   └── authController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── validate.js
│   │   ├── models/
│   │   │   └── User.js       # Modelo de usuario
│   │   ├── routes/
│   │   │   └── auth.js
│   │   ├── utils/
│   │   │   └── config.js     # Validación de configuración
│   │   └── server.js
│   ├── tests/                # Tests organizados
│   │   ├── test-auth.js
│   │   ├── test-login-bug.js
│   │   ├── test-server-restart.js
│   │   ├── quick-test.js
│   │   ├── test-frontend-login.js
│   │   ├── debug-auth.js
│   │   ├── test-config-validation.js
│   │   └── README.md
│   ├── data/                 # Datos persistentes (se crea automáticamente)
│   │   └── users.json        # Archivo de usuarios
│   ├── package.json
│   └── env.example
└── README.md
```

## 🚀 Inicio Rápido

### Frontend
1. **Abrir el formulario de login:**
   ```bash
   # Navegar a la carpeta front
   cd front/src/html
   
   # Abrir index.html en tu navegador
   open index.html
   ```

2. **O usar un servidor local:**
   ```bash
   # Desde la raíz del proyecto
   python -m http.server 8000
   # Luego abrir http://localhost:8000/front/src/html/index.html
   ```

### Backend
1. **Instalar dependencias:**
   ```bash
   cd backend
   npm install
   ```

2. **Configurar variables de entorno:**
   ```bash
   cp env.example .env
   # Editar .env con tus configuraciones
   ```

3. **Iniciar el servidor:**
   ```bash
   npm run dev
   ```

## 🎨 Características del Frontend

### ✨ Diseño Moderno
- Interfaz limpia y responsive
- Animaciones suaves y transiciones
- Gradientes atractivos
- Compatible con móviles y desktop

### ✅ Validación Completa
- Validación en tiempo real
- Mensajes de error claros
- Validación de formato de email
- Validación de contraseñas
- Confirmación de contraseña

### 📱 Responsive Design
- Adaptable a diferentes pantallas
- Breakpoints optimizados
- Flexbox para layouts flexibles

## 🔧 Características del Backend

### 🛡️ Seguridad
- Contraseñas hasheadas con bcrypt
- JWT para autenticación con validación estricta de configuración
- Validación de datos con express-validator
- Middleware de autenticación
- CORS configurado
- **Validación de variables de entorno requeridas** (JWT_SECRET obligatorio)
- **Sin valores por defecto inseguros** para secretos

### 💾 Base de Datos en Memoria
- **Almacenamiento en memoria** para máximo rendimiento
- **Persistencia automática** en archivo JSON
- **Sin dependencias externas** de base de datos
- **Fácil de usar** y configurar
- **Datos persistentes** entre reinicios del servidor

### 🔌 API REST
- Endpoints para login y registro
- Manejo de errores centralizado
- Respuestas JSON consistentes
- Documentación de endpoints

## 📋 Endpoints de la API

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil (protegido)
- `PUT /api/auth/profile` - Actualizar perfil (protegido)
- `GET /api/auth/stats` - Estadísticas de la BD (protegido)

### Información del Sistema
- `GET /` - Información general de la API
- `GET /api/stats` - Estadísticas de la base de datos

### Ejemplo de uso:
```javascript
// Registro
fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        password: '123456'
    })
});

// Login
fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: 'juan@example.com',
        password: '123456'
    })
});

// Obtener estadísticas
fetch('/api/stats', {
    headers: { 'Authorization': 'Bearer ' + token }
});
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos y responsive
- **JavaScript ES6+** - Validación e interactividad

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **Base de datos en memoria** - Almacenamiento rápido
- **JWT** - Autenticación stateless
- **bcryptjs** - Hashing de contraseñas
- **express-validator** - Validación de datos
- **fs.promises** - Persistencia en archivos JSON

## 💾 Base de Datos en Memoria

### Características
- **Rendimiento máximo**: Todos los datos en memoria RAM
- **Persistencia automática**: Se guarda en `backend/data/users.json`
- **Sin configuración**: No requiere instalación de MongoDB
- **Fácil respaldo**: Solo copiar el archivo JSON
- **Escalable**: Ideal para aplicaciones pequeñas y medianas

### Estructura de datos
```json
[
  {
    "id": "unique-id",
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@example.com",
    "password": "hashed-password",
    "isActive": true,
    "lastLogin": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

## 🔗 Conectar Frontend con Backend

Para conectar el frontend con el backend, actualiza los archivos JavaScript:

### En `front/src/js/script.js`:
```javascript
// Reemplazar la simulación de envío con:
const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
});

const data = await response.json();
if (data.success) {
    localStorage.setItem('token', data.data.token);
    // Redirigir o mostrar mensaje de éxito
}
```

### En `front/src/js/register.js`:
```javascript
// Reemplazar la simulación de envío con:
const response = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName, lastName, email, password })
});

const data = await response.json();
if (data.success) {
    localStorage.setItem('token', data.data.token);
    // Redirigir o mostrar mensaje de éxito
}
```

## 📦 Instalación Completa

1. **Clonar el repositorio:**
   ```bash
   git clone <tu-repositorio>
   cd loginwitCursorIA
   ```

2. **Configurar backend:**
   ```bash
   cd backend
   npm install
   cp env.example .env
   # Editar .env con tus configuraciones
   ```

3. **Iniciar el servidor:**
   ```bash
   npm run dev
   ```

4. **Abrir frontend:**
   ```bash
   # En otra terminal, desde la raíz del proyecto
   cd front/src/html
   # Abrir index.html en tu navegador
   ```

## 🔒 Variables de Entorno

Crea un archivo `.env` en la carpeta `backend/` con:

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=tu-super-secreto-jwt-muy-seguro-y-unico
CORS_ORIGIN=http://localhost:3000
```

**⚠️ Importante:** La variable `JWT_SECRET` es **OBLIGATORIA**. Sin ella, la aplicación no iniciará por motivos de seguridad.

## 📝 Scripts Disponibles

### Backend
- `npm start` - Iniciar en producción
- `npm run dev` - Iniciar en desarrollo con nodemon
- `npm test` - Ejecutar tests

### Tests Organizados
- `npm run test:auth` - Test completo de autenticación
- `npm run test:bug` - Test específico del bug de login
- `npm run test:restart` - Test de persistencia después de reinicio
- `npm run quick:test` - Test rápido de bcrypt
- `npm run test:frontend` - Test de integración frontend-backend
- `npm run debug:auth` - Script de debug para autenticación
- `npm run test:config` - Test de validación de configuración

## 🔍 Monitoreo y Estadísticas

### Endpoints de monitoreo
- `GET /` - Información general y estadísticas básicas
- `GET /api/stats` - Estadísticas detalladas de la base de datos
- `GET /api/auth/stats` - Estadísticas de usuarios (requiere autenticación)

### Información disponible
- Total de usuarios registrados
- Usuarios activos
- Estado de la base de datos
- Archivo de persistencia

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:
1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema

## 🤖 Asistencia con CursorIA

Este proyecto fue desarrollado con la asistencia de **CursorIA**, un asistente de programación inteligente. Durante el desarrollo, se implementaron las siguientes mejoras y funcionalidades:

### 🔧 Mejoras Implementadas

#### 1. **Organización de Tests**
- ✅ Reorganización de archivos de test en carpeta `backend/tests/`
- ✅ Documentación completa de cada test en `tests/README.md`
- ✅ Actualización de scripts en `package.json`
- ✅ Mantenimiento de funcionalidad existente

#### 2. **Validación de Configuración de Seguridad**
- ✅ Eliminación de valores por defecto inseguros para JWT_SECRET
- ✅ Implementación de validación estricta de variables de entorno
- ✅ Creación de utilidades de configuración (`backend/src/utils/config.js`)
- ✅ Validación al inicio del servidor
- ✅ Tests específicos para validación de configuración

#### 3. **Debugging y Resolución de Bugs**
- ✅ Identificación y resolución del bug de login con contraseñas incorrectas
- ✅ Creación de múltiples scripts de test para diferentes escenarios
- ✅ Debugging de problemas de persistencia de base de datos
- ✅ Verificación de integridad de objetos User después de carga desde JSON

#### 4. **Mejoras de Estructura**
- ✅ Separación clara de responsabilidades
- ✅ Documentación mejorada
- ✅ Scripts de test organizados y documentados
- ✅ Validación de seguridad robusta

### 🛠️ Funcionalidades Desarrolladas

#### **Sistema de Tests Completo**
```bash
# Tests disponibles
npm run test:auth          # Test completo de autenticación
npm run test:bug           # Test del bug de login
npm run test:restart       # Test de persistencia
npm run quick:test         # Test rápido de bcrypt
npm run test:frontend      # Test de integración
npm run debug:auth         # Script de debug
npm run test:config        # Test de configuración
```

#### **Validación de Seguridad**
- La aplicación **no iniciará** si `JWT_SECRET` no está configurado
- Validación temprana de configuración requerida
- Mensajes de error claros y específicos

#### **Base de Datos en Memoria Robusta**
- Persistencia automática en archivo JSON
- Carga correcta de objetos User con métodos
- Manejo de errores mejorado

### 📚 Documentación Generada

- **README.md principal** - Documentación completa del proyecto
- **tests/README.md** - Documentación específica de tests
- **env.example** - Ejemplo de configuración con notas de seguridad
- **Comentarios en código** - Explicaciones detalladas de funcionalidades

### 🎯 Beneficios de la Asistencia con CursorIA

1. **Desarrollo Rápido**: Implementación eficiente de funcionalidades complejas
2. **Calidad de Código**: Mejores prácticas y patrones de diseño
3. **Debugging Eficiente**: Identificación rápida y resolución de problemas
4. **Documentación Completa**: Explicaciones claras y ejemplos de uso
5. **Seguridad Mejorada**: Implementación de validaciones y mejores prácticas de seguridad

### 💡 Consejos para Usar CursorIA

- **Sé específico** en tus solicitudes
- **Proporciona contexto** sobre el problema
- **Revisa el código** generado antes de implementarlo
- **Pregunta por explicaciones** cuando algo no esté claro
- **Solicita documentación** para funcionalidades complejas
