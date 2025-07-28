// Validación del formulario de login
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const submitBtn = document.querySelector('.submit-btn');

    // Función para limpiar errores
    function clearErrors() {
        emailError.textContent = '';
        passwordError.textContent = '';
        emailInput.classList.remove('error');
        passwordInput.classList.remove('error');
    }

    // Función para mostrar error
    function showError(input, errorElement, message) {
        errorElement.textContent = message;
        input.classList.add('error');
    }

    // Función para validar email
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validación en tiempo real
    emailInput.addEventListener('input', function() {
        if (this.value.trim() === '') {
            showError(this, emailError, 'El email es requerido');
        } else if (!validateEmail(this.value)) {
            showError(this, emailError, 'Ingresa un email válido');
        } else {
            emailError.textContent = '';
            this.classList.remove('error');
        }
    });

    passwordInput.addEventListener('input', function() {
        if (this.value.trim() === '') {
            showError(this, passwordError, 'La contraseña es requerida');
        } else if (this.value.length < 6) {
            showError(this, passwordError, 'La contraseña debe tener al menos 6 caracteres');
        } else {
            passwordError.textContent = '';
            this.classList.remove('error');
        }
    });

    // Manejo del envío del formulario
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        clearErrors();

        // Validar email
        const email = emailInput.value.trim();
        if (email === '') {
            showError(emailInput, emailError, 'El email es requerido');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError(emailInput, emailError, 'Ingresa un email válido');
            isValid = false;
        }

        // Validar contraseña
        const password = passwordInput.value.trim();
        if (password === '') {
            showError(passwordInput, passwordError, 'La contraseña es requerida');
            isValid = false;
        } else if (password.length < 6) {
            showError(passwordInput, passwordError, 'La contraseña debe tener al menos 6 caracteres');
            isValid = false;
        }

        // Si el formulario es válido, simular envío
        if (isValid) {
            // Mostrar estado de carga
            submitBtn.textContent = 'Iniciando sesión...';
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            // Simular envío (aquí iría tu lógica de autenticación)
            setTimeout(() => {
                alert('¡Inicio de sesión exitoso!\nEmail: ' + email);
                
                // Restaurar botón
                submitBtn.textContent = 'Iniciar Sesión';
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                
                // Limpiar formulario
                loginForm.reset();
            }, 2000);
        }
    });

    // Limpiar errores al hacer focus en los campos
    emailInput.addEventListener('focus', function() {
        if (this.classList.contains('error')) {
            emailError.textContent = '';
            this.classList.remove('error');
        }
    });

    passwordInput.addEventListener('focus', function() {
        if (this.classList.contains('error')) {
            passwordError.textContent = '';
            this.classList.remove('error');
        }
    });
}); 