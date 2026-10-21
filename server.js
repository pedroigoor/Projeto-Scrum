import http from 'node:http';
import { readFile } from 'node:fs/promises';
const files = {'/':'index.html','/app.js':'app.js','/game.js':'game.js','/style.css':'style.css'};
const types = {html:'text/html; charset=utf-8',js:'text/javascript; charset=utf-8',css:'text/css; charset=utf-8'};
const server = http.createServer(async (req,res) => {
  const file = files[new URL(req.url,'http://localhost').pathname];
  if (!file) { res.writeHead(404); return res.end('Não encontrado'); }
  try { const body = await readFile(new URL('./public/'+file,import.meta.url)); res.writeHead(200,{'Content-Type':types[file.split('.').pop()],'Cache-Control':'no-store'}); res.end(body); }
  catch { res.writeHead(500); res.end('Erro ao carregar aplicação'); }
});
server.listen(Number(process.env.PORT || 3000),'127.0.0.1',()=>console.log('Jogo em http://localhost:'+(process.env.PORT || 3000)));
