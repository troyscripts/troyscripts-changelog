import {createServer} from 'node:http';
import {readFileSync,statSync} from 'node:fs';
import {join,normalize,extname} from 'node:path';
const base=normalize(new URL('../dist/',import.meta.url).pathname);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};
const port=Number(process.env.PORT||4173);
createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost');const path=normalize(join(base,decodeURIComponent(url.pathname)));
  if(!path.startsWith(base)){res.writeHead(403);res.end();return;}
  try{let target=path;if(statSync(target).isDirectory())target=join(target,'index.html');const body=readFileSync(target);res.writeHead(200,{'content-type':types[extname(target)]||'application/octet-stream'});res.end(body)}catch{res.writeHead(404);res.end('Niet gevonden');}
}).listen(port,()=>console.log(`Website lokaal: http://localhost:${port}/`));
