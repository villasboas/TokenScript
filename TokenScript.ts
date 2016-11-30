import Token     = require('jsonwebtoken');
import Validator = require('validator');

/**
 * 
 * TokenScript
 * 
 * Classe para manipulação e criação de JsonWebTokens. 
 * 
 * @author villasboas
 * @since 11/2016
 * 
 */
export default class TokenScript {

    /**
     * @private
     * @type {string}
     * @desc chave usada na encriptação
     */
    private _privateKey : string = 'osnfoanOJASOjsdoifjaosnKLJNOjas';

    /**
     * @private
     * @type {any}
     * @desc algoritimo de encriptação
     */
    private _algorithm : any    = 'HS256';

    /**
     * @private
     * @type {string}
     * @desc token gerado
     */
    private _token : string;

    /**
     * @private
     * @type {object}
     * @desc regras de validação para o token
     */
    private _validationRules : {};

    /**
     * @private
     * @type {any}
     * @desc prazo de validade
     */
    private _expiration : any = false;

    /**
     * @private
     * @type {object}
     * @desc dados descriptografados
     */
    private _decoded : {};

    /**
     * Método construtor
     * 
     * @param token {string} token de inicialização ( não obrigatório )
     */
    constructor( token? : string ) {

        //seta o token se ele nao existir
        this._token = token ? token : "";
    }

    /**
     * set algoritihm
     * define qual o algoritimo usado na geração do token
     * 
     * @public
     * @param type {string} o algoritimo que será usado 
     */
    set algoritihm( type : string ){
        this._algorithm = type;
    }

    /**
     * set validationRules
     * seta as regras de validação usadas na verificação de token
     * 
     * @public
     * @param rules {object} objeto com as regras de configuração
     */
    set validationRules( rules : {} ) {
        this._validationRules = rules;
    } 

    /**
     * set token
     * seta um token qualquer 
     * 
     * @public
     * @param token {string} um token TokenScript
     */
    set token( token : string ) {
        this.token = token;
    }

     /**
     * set expiration
     * seta um prazo de validade para o token
     * 
     * @public
     * @param expiration {any} um dado que pode ser convertido em data
     */
    set expiration( expiration : any ) {
        this._expiration = expiration;
    }

    /**
     * _checkRules
     * Verifica se o token está dentro das regras estabelecidas
     * 
     * @private
     * @return {boolean}
     */
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

    /**
     * create
     * Cria um novo TokenScript
     * 
     * @private
     * @param data {object} um objeto que será guardado no token gerado
     * @return {create}
     */
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

    /**
     * valid
     * Informa se um TokenScript é válido ou não, de acordo com as regras definidas
     * 
     * @private
     * @return {boolean}
     */
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

    /**
     * item
     * Retorna o item informado do token decodificado
     * 
     * @private
     * @param key {string} o item a ser recuperado
     * @return {any}
     */
    public item( key : string ) : any {
        
        //verifica se a chave esta definida
        return typeof this._decoded[key] === "undefined" ? false : this._decoded;
    }
}