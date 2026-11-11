class Usuario {
    constructor(username, password, rol) {
        this.username = username;
        this.password = password;
        this.rol = rol;
    }
}


function inicializarUsuarios() {
    
    const usuariosGuardados = localStorage.getItem('usuarios');
    
   
    if (!usuariosGuardados) {
       
        const usuarioAdmin = new Usuario('alejo', '123456', 'admin');
        
        const arrayUsuarios = [usuarioAdmin];
        localStorage.setItem('usuarios', JSON.stringify(arrayUsuarios));
        console.log("Usuario administrador creado por defecto.");
    }
}

inicializarUsuarios();

const formLogin = document.getElementById('form-login');

formLogin.addEventListener('submit', function(evento) {
    
    evento.preventDefault();

    const inputUsuario = document.getElementById('usuario').value;
    const inputPassword = document.getElementById('password').value;

    const usuariosLS = JSON.parse(localStorage.getItem('usuarios'));

    const usuarioValido = usuariosLS.find(
        (user) => user.username === inputUsuario && user.password === inputPassword
    );

    if (usuarioValido) {
  
        localStorage.setItem('sesionActiva', JSON.stringify(usuarioValido));
        
        if (usuarioValido.rol === 'admin') {
            window.location.href = "panel.html"; 
        } else {
            window.location.href = "panel-cliente.html"; 
        }
    } else {
        alert("Usuario o contraseña incorrectos. Por favor, intentá de nuevo.");
    }
});