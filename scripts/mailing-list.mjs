// Run locally with a server-side BLOB_READ_WRITE_TOKEN. Never put this token in config.js.
import {list,get,del} from '@vercel/blob';
import {writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const [action,arg]=process.argv.slice(2);
if(action==='remove'&&arg){const key=createHash('sha256').update(arg.trim().toLowerCase()).digest('hex');await del('subscribers/'+key+'.json');console.log('Subscriber removed.');}
else if(action==='export'){
 let cursor,rows=[['email','joinedAt','consent']];
 do{const page=await list({prefix:'subscribers/',cursor});for(const b of page.blobs){const result=await get(b.pathname,{access:'private'});if(result?.statusCode===200){const record=JSON.parse(await new Response(result.stream).text());rows.push([record.email,record.joinedAt,String(record.consent)])}}cursor=page.hasMore?page.cursor:undefined;}while(cursor);
 const cell=value=>'"'+String(value).replace(/^[=+@-]/,"'$&").replaceAll('"','""')+'"';
 await writeFile(arg||'subscribers.csv',rows.map(r=>r.map(cell).join(',')).join('\n'));console.log('Exported '+(rows.length-1)+' subscribers.');
}else{console.log('Usage: node scripts/mailing-list.mjs export [file.csv] | remove email@example.com');process.exitCode=1;}
