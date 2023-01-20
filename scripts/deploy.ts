import fs from "fs";

import IPFS from 'ipfs-api';

//const ipfsClient = require('ipfs-http-client');


let ipfs:any;
let ipfsURI = "https://ipfs.infura.io:5001/api/v0"

let auth = ""
if(process.env.INFURA_IPFS_SECRET !== "" && process.env.INFURA_IPFS_SECRET !== undefined) {
  auth = 'Basic ' + Buffer.from(process.env.INFURA_IPFS_ID + ':' + process.env.INFURA_IPFS_SECRET).toString('base64')
}

try {
  ipfs = new IPFS(
    {
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      apiPath: '/api/v0',
      headers: {
        authorization: auth
      }
    }
  );
} catch (error) {
  console.error("IPFS error ", error);
  ipfs = undefined;
}

interface IAttribute {
  display_type?:string
  trait_type:string
  value:string | number | null
}

interface IMetadata {
  name:string;
  description:string;
  image:string;
  attributes:IAttribute[];
}

interface File {
  path:string,
  content:Buffer,
}

const names = [
  "whispering red meadowlark",
  "metropolitan ivory angelfish",
  "marginal jade albatross",
  "coherent black primate",
  "running orange firefly",
  "victorious amethyst meadowlark",
  "provincial gray mammal",
  "burning purple gayal",
  "superior yellow woodpecker",
  "scary plum haddock",
]

const descriptions = [
  "The Whispering Red Meadowlark is a beautiful and mysterious bird that sings a secret song only heard by the lucky few.",
  "The Metropolitan Ivory Angelfish is a true city slicker, swimming through the concrete jungle with grace and style.",
  "The Marginal Jade Albatross is a rare and exotic bird, soaring above the margins and making a statement wherever it goes.",
  "The Coherent Black Primate is a wise and thoughtful creature, always thinking deeply and making sense of the world around it.",
  "The Running Orange Firefly is a fast and energetic bug, lighting up the night with its bright orange glow.",
  "The Victorious Amethyst Meadowlark is a true champion, singing its victory song with pride and determination.",
  "The Provincial Gray Mammal is a simple and unassuming creature, content to live its quiet life in the countryside.",
  "The Burning Purple Gayal is a fierce and powerful beast, burning with passion and energy.",
  "The Superior Yellow Woodpecker is a master of its craft, drilling and pecking with precision and skill.",
  "The Scary Plum Haddock is a fish that will make you think twice before diving in - its dark plum scales and sharp teeth will send shivers down your spine!",
]



async function main() {

  const result = []
  
  for (const i in names) {
    
    const name = upper(names[i])
    const description = descriptions[i]
    const imageFile = `scripts/images/${names[i]}.png`
    const image = await upload(imageFile)

    const token:IMetadata = {
      name: name,
      description: description,
      image: `ipfs://${image[0].hash}`,
      attributes: [
        {
          trait_type: "Last Interactor",
          value: null
        },
        {
          trait_type: "Count",
          display_type: "number",
          value: null
        },
        {
          trait_type: "Last Interaction",
          display_type: "date",
          value: null
        }
    ]
    }
    console.log(token)
    const metadataFile = `scripts/metadata/${i}.json`
    const content = Buffer.from(JSON.stringify(token, undefined, "  "))
    fs.writeFileSync(metadataFile, content)

    result.push({path: metadataFile, content: content})
  }



  const cid = await upload(`scripts/metadata/`)

  fs.writeFileSync(`scripts/metadata.json`, JSON.stringify(cid, undefined, "  "))
}

const upload = async (file:string) => {
  const baseUri = "ipfs://"
   
  const files = await ipfs.util.addFromFs(file, { recursive: true });



  return files
}

const upper = (content:string) => {
  const words = content.split(" ");

  content = words.map((word) => { 
      return word[0].toUpperCase() + word.substring(1); 
  }).join(" ");

  return content
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


