// Validación del formulario de registro
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    const firstNameError = document.getElementById('firstNameError');
    const lastNameError = document.getElementById('lastNameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    
    const submitBtn = document.querySelector('.submit-btn');

    // Función para limpiar errores
    function clearErrors() {
        firstNameError.textContent = '';
        lastNameError.textContent = '';
        emailError.textContent = '';
        passwordError.textContent = '';
        confirmPasswordError.textContent = '';
        
        firstNameInput.classList.remove('error');
        lastNameInput.classList.remove('error');
        emailInput.classList.remove('error');
        passwordInput.classList.remove('error');
        confirmPasswordInput.classList.remove('error');
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

    // Función para validar nombre y apellido
    function validateName(name) {
        return name.trim().length >= 2 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name);
    }

    // Validación en tiempo real para nombre
    firstNameInput.addEventListener('input', function() {
        if (this.value.trim() === '') {
            showError(this, firstNameError, 'El nombre es requerido');
        } else if (!validateName(this.value)) {
            showError(this, firstNameError, 'El nombre debe tener al menos 2 caracteres y solo letras');
        } else {
            firstNameError.textContent = '';
            this.classList.remove('error');
        }
    });

    // Validación en tiempo real para apellido
    lastNameInput.addEventListener('input', function() {
        if (this.value.trim() === '') {
            showError(this, lastNameError, 'El apellido es requerido');
        } else if (!validateName(this.value)) {
            showError(this, lastNameError, 'El apellido debe tener al menos 2 caracteres y solo letras');
        } else {
            lastNameError.textContent = '';
            this.classList.remove('error');
        }
    });

    // Validación en tiempo real para email
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

    // Validación en tiempo real para contraseña
    passwordInput.addEventListener('input', function() {
        if (this.value.trim() === '') {
            showError(this, passwordError, 'La contraseña es requerida');
        } else if (this.value.length < 6) {
            showError(this, passwordError, 'La contraseña debe tener al menos 6 caracteres');
        } else {
            passwordError.textContent = '';
            this.classList.remove('error');
        }
        
        // Validar confirmación de contraseña si ya tiene valor
        if (confirmPasswordInput.value) {
            if (this.value !== confirmPasswordInput.value) {
                showError(confirmPasswordInput, confirmPasswordError, 'Las contraseñas no coinciden');
            } else {
                confirmPasswordError.textContent = '';
                confirmPasswordInput.classList.remove('error');
            }
        }
    });

    // Validación en tiempo real para confirmar contraseña
    confirmPasswordInput.addEventListener('input', function() {
        if (this.value.trim() === '') {
            showError(this, confirmPasswordError, 'Confirma tu contraseña');
        } else if (this.value !== passwordInput.value) {
            showError(this, confirmPasswordError, 'Las contraseñas no coinciden');
        } else {
            confirmPasswordError.textContent = '';
            this.classList.remove('error');
        }
    });

    // Manejo del envío del formulario
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        clearErrors();

        // Validar nombre
        const firstName = firstNameInput.value.trim();
        if (firstName === '') {
            showError(firstNameInput, firstNameError, 'El nombre es requerido');
            isValid = false;
        } else if (!validateName(firstName)) {
            showError(firstNameInput, firstNameError, 'El nombre debe tener al menos 2 caracteres y solo letras');
            isValid = false;
        }

        // Validar apellido
        const lastName = lastNameInput.value.trim();
        if (lastName === '') {
            showError(lastNameInput, lastNameError, 'El apellido es requerido');
            isValid = false;
        } else if (!validateName(lastName)) {
            showError(lastNameInput, lastNameError, 'El apellido debe tener al menos 2 caracteres y solo letras');
            isValid = false;
        }

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

        // Validar confirmación de contraseña
        const confirmPassword = confirmPasswordInput.value.trim();
        if (confirmPassword === '') {
            showError(confirmPasswordInput, confirmPasswordError, 'Confirma tu contraseña');
            isValid = false;
        } else if (confirmPassword !== password) {
            showError(confirmPasswordInput, confirmPasswordError, 'Las contraseñas no coinciden');
            isValid = false;
        }

        // Si el formulario es válido, enviar al backend
        if (isValid) {
            // Mostrar estado de carga
            submitBtn.textContent = 'Creando cuenta...';
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            // Enviar datos al backend
            fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Registro exitoso
                    alert('¡Cuenta creada exitosamente!\nNombre: ' + firstName + ' ' + lastName + '\nEmail: ' + email);
                    
                    // Limpiar formulario
                    registerForm.reset();
                } else {
                    // Registro fallido
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error de conexión. Verifica que el servidor esté corriendo.');
            })
            .finally(() => {
                // Restaurar botón
                submitBtn.textContent = 'Crear Cuenta';
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            });
        }
    });

    // Limpiar errores al hacer focus en los campos
    const inputs = [firstNameInput, lastNameInput, emailInput, passwordInput, confirmPasswordInput];
    const errorElements = [firstNameError, lastNameError, emailError, passwordError, confirmPasswordError];

    inputs.forEach((input, index) => {
        input.addEventListener('focus', function() {
            if (this.classList.contains('error')) {
                errorElements[index].textContent = '';
                this.classList.remove('error');
            }
        });
    });
}); 