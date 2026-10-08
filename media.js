import media from './media-manifest.js';
export async function serveMedia(request, env) {
 const url=new URL(request.url), file=media[url.pathname]; if(!file)return null;
 if(!['GET','HEAD'].includes(request.method))return new Response(null,{status:405});
 let start=0,end=file.size-1;const range=request.headers.get('Range');
 if(range){const m=/^bytes=(\d*)-(\d*)$/.exec(range);if(!m||(!m[1]&&!m[2]))return new Response(null,{status:416,headers:{'Content-Range':`bytes */${file.size}`}});
 if(!m[1])start=Math.max(0,file.size-Number(m[2]));else{start=Number(m[1]);if(m[2])end=Math.min(end,Number(m[2]));}
 if(start>end||start>=file.size)return new Response(null,{status:416,headers:{'Content-Range':`bytes */${file.size}`}});}
 const headers={'Content-Type':'video/mp4','Accept-Ranges':'bytes','Content-Length':String(end-start+1),'Cache-Control':'public, max-age=86400'};
 if(range)headers['Content-Range']=`bytes ${start}-${end}/${file.size}`;
 if(request.method==='HEAD')return new Response(null,{status:range?206:200,headers});
 let cursor=start;
 const stream=new ReadableStream({async pull(controller){try{
 if(cursor>end){controller.close();return;}
 const part=Math.floor(cursor/file.chunkSize),offset=cursor%file.chunkSize;
 const response=await env.ASSETS.fetch(new Request(new URL(file.prefix+part+'.bin',url)));
 if(!response.ok)throw Error('Missing media segment');
 const data=new Uint8Array(await response.arrayBuffer());const length=Math.min(data.length-offset,end-cursor+1);
 if(length<=0)throw Error('Invalid media segment');controller.enqueue(data.subarray(offset,offset+length));cursor+=length;
 }catch(error){controller.error(error);}}});
 return new Response(stream,{status:range?206:200,headers});
}
