# Tests Documentation

Esta carpeta contiene todos los archivos de test para el sistema de autenticación.

## Archivos de Test

### `test-auth.js`
Test completo de autenticación que verifica:
- Validación de datos de usuario
- Hashing de contraseñas
- Creación de usuarios
- Comparación de contraseñas (correcta, incorrecta, vacía, null, undefined, número, objeto)
- Creación de usuarios desde datos
- Perfil público de usuario
- Operaciones de base de datos
- Generación y verificación de JWT

**Comando:** `npm run test:auth`

### `test-login-bug.js`
Test específico para reproducir el bug de login que permitía entrar con cualquier contraseña:
- Registro de usuario
- Login con contraseña correcta
- Login con contraseña incorrecta
- Test directo de bcrypt
- Test de métodos de la clase User
- Test de persistencia de base de datos

**Comando:** `npm run test:bug`

### `test-server-restart.js`
Test para verificar que los datos persisten correctamente después de reiniciar el servidor:
- Creación de usuarios iniciales
- Simulación de reinicio de servidor
- Verificación de carga de usuarios
- Test de autenticación después del reinicio
- Adición de nuevos usuarios después del reinicio

**Comando:** `npm run test:restart`

### `quick-test.js`
Test rápido y simple de bcrypt:
- Hashing básico
- Comparación básica
- Casos extremos (contraseña vacía, null, undefined)
- Múltiples hashes de la misma contraseña

**Comando:** `npm run quick:test`

### `test-frontend-login.js`
Test de integración frontend-backend:
- Conexión al servidor
- Registro de usuario
- Login con contraseña correcta
- Login con contraseña incorrecta
- Login con contraseña vacía
- Login con usuario inexistente
- Obtención de estadísticas de base de datos

**Comando:** `npm run test:frontend`

### `debug-auth.js`
Script de debug para diagnosticar problemas de autenticación:
- Verificación de usuarios en base de datos
- Creación de usuario de prueba si no existe
- Test de comparación de contraseñas
- Test directo de la clase User
- Test directo de bcrypt
- Test de persistencia de base de datos

**Comando:** `npm run debug:auth`

## Ejecución de Tests

Para ejecutar todos los tests en secuencia:

```bash
npm run test:auth
npm run test:bug
npm run test:restart
npm run quick:test
npm run test:frontend
npm run debug:auth
```

## Notas Importantes

- Todos los tests usan la base de datos en memoria
- Los tests pueden modificar los datos en `data/users.json`
- Algunos tests crean usuarios de prueba que pueden persistir entre ejecuciones
- Para limpiar los datos de prueba, elimina el archivo `data/users.json` 