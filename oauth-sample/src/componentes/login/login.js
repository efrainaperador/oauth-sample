import React from "react";
import GoogleLogin from "react-google-login";

function Login() {
    function responseGoogle(response) {
        if(response && response.tokenId) {
            fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: response.tokenId,
                    email: response.profileObj.email,
                    nombres: response.profileObj.givenName,
                    apellidos: response.profileObj.familyName
                })
            }).catch((err)=>console.error(err))
            .then((respuesta)=>respuesta.json())
            .then((respuestaServidor)=>{
                localStorage.setItem('token', response.tokenId);
                localStorage.setItem('usuario', JSON.stringify(respuestaServidor.usuario));
                window.location.href = '/listarUsuarios';
            });
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <GoogleLogin
                clientId="789011637624-7i7mvke7ke6rer0pc7e7f8dgha94igno.apps.googleusercontent.com"
                buttonText="Acceder con Google"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
            />
        </div>
    )
}

export default Login;