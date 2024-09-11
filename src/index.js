import { RecintosZoo } from "./recintos-zoo.js";

import DBEngine from "./db.engine.js";


async function main() {

 const app = new  RecintosZoo();

  const result = await app.analisaRecintos("LEOPARDO",1)
  
  console.log(result)
 
}


main();