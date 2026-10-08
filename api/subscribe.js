import {get,put} from '@vercel/blob';
import worker from '../cloudflare-worker.js';
export default async function handler(req,res){
 const host=req.headers.host;
 const request=new Request('https://'+host+'/api/subscribe',{method:req.method,headers:req.headers,...(req.method==='GET'||req.method==='HEAD'?{}:{body:typeof req.body==='string'?req.body:JSON.stringify(req.body||{})})});
 const store=(process.env.BLOB_READ_WRITE_TOKEN||process.env.BLOB_STORE_ID)?{
  async get(key){const result=await get('contacts/'+key+'.json',{access:'private'});if(!result||result.statusCode!==200)return null;return JSON.parse(await new Response(result.stream).text());},
  async put(key,value){await put('contacts/'+key+'.json',value,{access:'private',addRandomSuffix:false,allowOverwrite:true,contentType:'application/json'});}
 }:undefined;
 const response=await worker.fetch(request,{SUBSCRIBERS:store});
 res.status(response.status);response.headers.forEach((v,k)=>res.setHeader(k,v));res.end(await response.text());
}
