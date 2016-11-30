//importa os pacotes usados
import Token     = require('jsonwebtoken');
import Validator = require('validator');

//classe de implementacao de web tokens
export default class TokenScript {

    //atributos da classe
    private _privateKey      : string = 'osnfoanOJASOjsdoifjaosnKLJNOjas';
    private _algorithm       : any    = 'HS256';
    private _token           : string;
    private _validationRules : {};
    private _expiration      : any = false;
    private _decoded         : {};

    //metodo construtor
    constructor( token? : string ) {

        //seta o token se ele nao existir
        this._token = token ? token : "";
    }

    //seta o algoritimo usado
    set algoritihm( type : string ){
        this._algorithm = type;
    }

    //seta as regras de validacao
    set validationRules( rules : {} ) {
        this._validationRules = rules;
    } 

    //seta o token
    set token( token : string ) {
        this.token = token;
    }

    //seta o prazo de validade
    set expiration( expiration : any ) {
        this._expiration = expiration;
    }

    //verifica se as regras de validacao são iguais as definidas pela classe
    private _checkRules() : boolean{

        //verifica se o campo de validacao existe
        if( this._validationRules  ) {

            //percorre os dados
            for( let i in this._validationRules ) {

                //verifica se existe nas regras
                if( !this._decoded[i] ) {
                    console.error(`A regra ${i} não existe`);
                    return false;
                }

                //pega as regras de validacao
                let rules = this._validationRules[i];

                //percorre as regras
                for( let a in rules ) {

                    //verifica se existem parametros
                    if( rules[a] ) {

                        //valida a regra
                        if( !Validator[a](this._decoded[i], rules[a] )) {
                            
                            console.error(`Regra ${a} do campo ${i} não é válida`);
                            return false;
                        }

                    } else {

                        //valida a regra
                        if( !Validator[a](this._decoded[i])) {
                            
                            console.error(`Regra ${a} do campo ${i} não é válida`);
                            return false;
                        }
                    }                    
                }
            }
        }

        //são válidos
        return true;
    }

    //funcao para criar um novo token
    public create( data : {} ) : string {

        //verifica se uma chave foi informada
        if( this._privateKey.length == 0 )
            throw new Error('Nenhuma chave privada foi informada');
        
        //verifica se possui mais de 16 caracters
        else if ( this._privateKey.length < 16 )
            throw new Error('A chave privada precisa ter mais de 16 caracters');

        //objeto de config
        let config = {
            algorithm : this._algorithm
        }

        //verifica se tem prazo de validade
        if( this._expiration )
            config['expiresIn'] = this._expiration;

        //cria o token
        this._token = Token.sign( data , this._privateKey, config);

        //volta o token
        return this._token;
    }

    //funcao para verificar se um token é valido
    public valid() : boolean {

        // Tenta decodificar o token
        try {
            
            //pega os dados
            this._decoded = Token.verify(this._token, this._privateKey);

            //verifica se as regras sao validas
            return this._checkRules( ); 
        } 
        
        //caso nao seja possivel decodificar o token
        catch(err) {

            //mostra o erro e retorna false
            console.error(err.message);
            return false;
        }
    }

    //pega um item do token decodificado
    public item( key : string ) : any {
        
        //verifica se a chave esta definida
        return typeof this._decoded[key] === "undefined" ? false : this._decoded;
    }
}