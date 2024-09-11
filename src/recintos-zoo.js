import DBEngine from "./db.engine.js";





class RecintosZoo {

    constructor() {
            this.#dbEngine = new DBEngine();
    }

    #dbEngine
    

    async analisaRecintos(animal, quantidade) {

        

        const quantidadeVerificada =  this.#verificarQuantidadeValida(quantidade);
        console.log(quantidadeVerificada, "testetasfasfgasgasg")
        if(quantidadeVerificada.isError) {
            return {erro: quantidadeVerificada.message, recintosViaveis: false}
        }

        const animalVerificado = await this.#verificarSeAnimalValido(animal)
        if (animalVerificado.isError)  {
            return {erro: animalVerificado.message, recintosViaveis: false}
        }
        
        this.#verificarRecinto(animalVerificado.animal, quantidadeVerificada.quantidade)


        return  {isError: true, message: ""}

    }

    async #verificarRecinto(animal, quantidade) {

        const db = await this.#dbEngine.initDb();

        const matchRecintos = [];
        animal.bioma.forEach((bioma) => {
           matchRecintos.push( db.recintos.filter((elemento) => elemento.bioma.includes(bioma)))
        })
        console.log(matchRecintos);

    }

   async  #verificarSeAnimalValido(animal) {

    const db = await this.#dbEngine.initDb();
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

}

export { RecintosZoo as RecintosZoo };
