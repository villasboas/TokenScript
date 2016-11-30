import express = require('express');
import TokenScript from './TokenScript';

const app   = express();

app.get('/', (req, res) => {

    //prepara os dados do token
    let data = {
        email      : "gu.boas13@gmail.com"
    };

    //cria o token
    let key = new TokenScript().create(data);

    let  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imd1LmJvYXMxM0BnbWFpbC5jb20iLCJpYXQiOjE0ODA1MjQ0NDd9.65B1gk8qJa0XwBU86Gklo_5siCV64SUBSEI8kGbeOAQ"; 

    //seta o token usado
    let receivedToken = new TokenScript( token );

    //seta as regras de validacao
    receivedToken.validationRules = {
        email : {
            'isEmail' : false,
        }
    };

    //verifica se o token é valido
    if( receivedToken.valid( )) {

        res.send( 'valido' );
    } else {

        res.send( 'invalido' );
    }    
});

app.listen(3000, () => {
    console.log("Server rodando na porta "+3000);
});
