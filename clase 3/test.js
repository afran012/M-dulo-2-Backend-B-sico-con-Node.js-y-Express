const http = require('http');

// Función para realizar una solicitud HTTP
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        console.log(`Respuesta (${res.statusCode}): `, responseData);
        try {
          const parsedData = JSON.parse(responseData);
          resolve({ statusCode: res.statusCode, data: parsedData });
        } catch (e) {
          resolve({ statusCode: res.statusCode, data: responseData });
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('Error en la solicitud:', error.message);
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Función principal para ejecutar las pruebas
async function runTests() {
  try {
    console.log('Iniciando pruebas de autenticación...');
    
    // Test 1: Registrar un usuario
    console.log('\n--- Test 1: Registrar un usuario ---');
    const registerOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const userData = {
      name: 'Usuario Prueba',
      email: `test_${Date.now()}@ejemplo.com`, // Email único usando timestamp
      password: 'password123'
    };
    
    const registerResult = await makeRequest(registerOptions, userData);
    
    // Guardar el token recibido para probar el login y getMe
    let token = registerResult.data.token;
    
    // Test 2: Login del usuario
    console.log('\n--- Test 2: Login del usuario ---');
    const loginOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const loginData = {
      email: userData.email,
      password: userData.password
    };
    
    const loginResult = await makeRequest(loginOptions, loginData);
    
    // Actualizar el token con el recibido del login
    token = loginResult.data.token;
    
    // Test 3: Obtener perfil del usuario
    console.log('\n--- Test 3: Obtener perfil del usuario ---');
    const profileOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/me',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    
    await makeRequest(profileOptions);
    
    // Test 4: Intentar login con contraseña incorrecta
    console.log('\n--- Test 4: Login con contraseña incorrecta ---');
    const badLoginData = {
      email: userData.email,
      password: 'contraseñaIncorrecta'
    };
    
    await makeRequest(loginOptions, badLoginData);
    
    console.log('\nPruebas completadas.');
  } catch (error) {
    console.error('Error ejecutando pruebas:', error);
  }
}

// Ejecutar las pruebas
runTests(); 