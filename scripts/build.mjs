import {fileURLToPath} from 'node:url';
process.chdir(fileURLToPath(new URL('..',import.meta.url)));
import { cp, mkdir, rm } from 'node:fs/promises';
await rm('public',{recursive:true,force:true});await mkdir('public',{recursive:true});
for(const path of ['index.html','style.css','app.js','opening.js','config.js','assets','demos'])await cp(path,'public/'+path,{recursive:true});

// Assemble original-quality videos as native static assets for Vercel.
import manifest from '../media-manifest.js';
import {readFile,writeFile} from 'node:fs/promises';
await mkdir('public/media',{recursive:true});
for(const [route,meta] of Object.entries(manifest)){const chunks=[];for(let i=0;i<Math.ceil(meta.size/meta.chunkSize);i++)chunks.push(await readFile('.'+meta.prefix+i+'.bin'));await writeFile('public'+route,Buffer.concat(chunks));}
