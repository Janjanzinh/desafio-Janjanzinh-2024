import { RecintosZoo } from "./recintos-zoo.js";

import DBEngine from "./db.engine.js";


async function main() {

 const app = new  RecintosZoo();

  const result = await app.analisaRecintos("MACACO",10)
  
 
}


main();