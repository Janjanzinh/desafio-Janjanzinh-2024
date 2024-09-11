import DBEngine from "./db.engine.js";
import util from "util"




class RecintosZoo {

    constructor() {
            this.#dbEngine = new DBEngine();
    }

    #dbEngine
    

    async analisaRecintos(animal, quantidade) {
        return this.#verificarRecinto(animal, quantidade)
    }

    #calcularEspacoRecinto(recinto) {
        return recinto.animais_existentes.map((a) => a.tamanho).reduce((current, next) => current + next, 0);
    }
    async #verificarRecinto(animal, quantidade) {
        
       const quantidadeVerificada =  this.#verificarQuantidadeValida(quantidade);
        if(quantidadeVerificada.isError) {
            return {erro: quantidadeVerificada.message, recintosViaveis: false}
        }

        const db = await this.#dbEngine.initDb();

     

        const animalVerificado = await this.#verificarSeAnimalValido(animal, db)
        if (animalVerificado.isError)  {
            return {erro: animalVerificado.message, recintosViaveis: false}
        }
        let matchRecintos = [];
        animalVerificado.animal.bioma.forEach((bioma) => {
           matchRecintos.push( db.recintos.filter((elemento) => elemento.bioma  === bioma.type ))
        })
        
        matchRecintos = this.#filtrarAnimaisRecintosAnimaisCarnivorosEDisponiveis(animalVerificado,matchRecintos, quantidade);
        console.log(matchRecintos)
        if(animalVerificado.habito_alimentar === "carnivoro" && matchRecintos >= 1 ) {
            let message = matchRecintos.map(recinto => `Recinto ${recinto.numero} (espaço livre: ${this.#calcularEspacoRecinto(recinto)} tolta: ${recinto.tamanho_total})`);
            return {recintosViaveis:message }
        }
        
        if(matchRecintos.length == 0)  return {erro: "Não há recinto viável", recintosViaveis: false}
    }

   async  #verificarSeAnimalValido(animal, db) {

    const animalLowerCase = animal.toLowerCase();
    const result = db.animais.filter((elemento) => elemento.especie === animalLowerCase);     
    if(result.length >= 1) {
        return {isError: false, message: "Animal válido", animal: result[0]}
    } else return {isError: true, message: "Animal inválido"}
     
    } 

    #verificarQuantidadeValida(quantidade) {
        if(quantidade <= 0 ) return {isError: true, message: "Quantidade inválida"};
        else return  {isError: false, message: "Quantidade válida", quantidade};
    }

    #filtrarAnimaisRecintosAnimaisCarnivorosEDisponiveis(animal,recintos, quantidade) {


       return recintos.filter( recinto => {
        const matchVerification = [];         
        
       // console.log(util.inspect(recinto, {showHidden: false, depth: null, colors: true}))
        const animais = recinto.animais_existentes || [] .filter( a => a.habito_alimentar === "carnivoro")
        

        matchVerification.push(animais.length >= 1)

        const espacoGasto = animais.map((a) => a.tamanho).reduce((current, next) => current + next, 0);
       
        matchVerification.push(recinto.tamanho_total - espacoGasto <= animal.tamanho * quantidade)


        return matchVerification.every( m => true)
       });
    }

   
}

export { RecintosZoo as RecintosZoo };
