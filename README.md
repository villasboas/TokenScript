# TokenScript ( Alpha )

 TokenScript é uma classe desenvolvida em TypeScript para Node.js. O objetivo é trabalhar com Jason Web Tokens de forma simples, usando o pacote **_jsonwebtoken_** e adicionando validações com o **_validator_**.
 
 Para usa-lo, deve-se clonar ou fazer o download desse repositório ( em breve no NPM ). Deve-se instalar as dependências e certificar-se que todos os typings das mesmas também estão instalados.
 
 ## Configurações iniciais
 Para manter a segurança do token gerado, deve-se entrar na classe TokenScript e setar a propriedade **__privateKey_** para uma string aleatória. Por padrão, essa propriedade ja vem setada, mas para manter a integridade do seu sistema, recomendo altera-la para outro valor.
 
 ## Criando um token
 
 Para criar um token, basta definar os dados que se deseja guardar, entao usar o método create da classe TokenScript
 
 ``` js
 //importa a classe Token Script
 import TokenScript from 'TokenScript';
 
 //prepara os dados que serão guardados no token
 let data = {
    email : "email@email.com",
    id    : 342
 }
 
 //cria o token
 let token = new TokenScript().create( data );
 
 ```
 
 ## Criando um token com data de validade
Os tokens criados com o TokenScript também pode ter prazo de validade

 ``` js
 
 //importa a classe Token Script
 import TokenScript from 'TokenScript';
 
 //prepara os dados que serão guardados no token
 let data = {
    email : "email@email.com",
    id    : 342
 }
 
 //instância um objeto da classe TokenScript
 let TokenScriptObject = new TokenScript();
 
 //define o prazo de validade para 1 hora
 TokenScriptObject.expiration = '1h';
 
 //cria o token
 let token = TokenScriptObject.create( data );
 ```
 
 ## Validando um Token
 Para validar um token, deve-se passar-lo na instanciação do objeto e simplesmente usar o método valid() da classe TokenScript
 
 ```js
 
 //um token qualquer
 let  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imd1LmJvYXMxM0BnbWFpbC5jb20iLCJpYXQiOjE0ODA1MjQ0NDd9.65B1gk8qJa0XwBU86Gklo_5siCV64SUBSEI8kGbeOAQ"; 
//seta o token usado
let receivedToken = new TokenScript( token );

//verifica se o token é valido
if( receivedToken.valid())
    console.log('token válido');
else
    console.log('token inválido'); 
 ```
 
 ## Definindo regras de validação
 Pode-se definir regras de validação para os dados do token, setando a propriedade validationRules para um objeto de configuracao
 
 ```js
 
 //seta as regras de validacao do campo do token
 let config = {
 
    //está setado para false pois isEmail nao precisa de nenhum outro parametro
    email : { isEmail : false, } ,
    idade : { isNumeric : false, },
    
    //quando existem parametros, os mesmo devem ser passados como valores para sua respectiva regra
    telefone : {
        isNumeric : false,
        isLength : { min : 8 , max : 15 }
    }
 }
 
 //seta o token usado
let receivedToken = new TokenScript( token );

//Adiciona as regras de validacao
receivedToken.validationRules = config;

//verifica se o token é valido
if( receivedToken.valid())
    console.log('token válido');
else
    console.log('token inválido'); 
 ```
 
 ### Regras de validação
  As regras de validação são as mesma usadas no pacote [ Validator ](https://www.npmjs.com/package/validator). A chave do objeto informa qual a regra sendo aplicada, e o valor do objeto será passado como parametros para a função de validação

```js

    //um objeto de configuração padrão
    let config = {
        email : { isEmail : false },
        idade : { isNumeric : false },
        nascimento : { isAfter : date.getTime() }
    }
```
 
 ## Recuperando dados de um token válidado
 
 Após validar um token, pode-ser obter os dados do mesmo. Para isso, basta usar o metodo item(), Passando a referência do objeto que se deseja pegar as informações.

 ```js
 
  //um token qualquer
 let  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imd1LmJvYXMxM0BnbWFpbC5jb20iLCJpYXQiOjE0ODA1MjQ0NDd9.65B1gk8qJa0XwBU86Gklo_5siCV64SUBSEI8kGbeOAQ"; 
 
 //seta as regras de validacao do campo do token
 let config = {
 
    //está setado para false pois isEmail nao precisa de nenhum outro parametro
    email : { isEmail : false, } ,
    idade : { isNumeric : false, },
    
    //quando existem parametros, os mesmo devem ser passados como valores para sua respectiva regra
    telefone : {
        isNumeric : false,
        isLength : { min : 8 , max : 15 }
    }
 }
 
 //seta o token usado
let receivedToken = new TokenScript( token );

//Adiciona as regras de validacao
receivedToken.validationRules = config;

//verifica se o token é valido
if( receivedToken.valid())
    console.log(receivedToken.item('email');// imprime o e-mail válidado
else
    console.log('token inválido'); 
 ```
 
## Considerações
  Embora seja possivel validar os dados contidos no token, não deve-se guardar informações importantes no mesmo. Os dados guardados servem apenas para validações de usuários nas requisições de uma API, por exemplo.
  
## Referências
  
#### constructor( token? : string ) 
 Pode receber um token gerado anteriormente
##### algorithm( type : string )
 Define o algoritimo de encriptação usado. O padrão é 'HS256'
#### validationRules( rules : {} ) 
 Recebe as regras de validação do token
#### token( token : string )
 Recebe um token padrão
### expiration( expiration : any )
 Recebe um prazo de válidade, pode ser uma string que representa um data, ou numérica. O padrão é nulo.
#### create( data : {} ) : string
 Retorna um token válido, encriptografado de acordo com o algoritimo recorrente, a palavra chave e os dados informados.
#### valid() : booleand
 Informa se o token atual é válido ou não
#### item( key : string ) : string 
 Retorna o valor da chave, se o token estiver setado e se a chave existir
 
