'use strict';
let token='',offset=0,total=0,generation=0;
const $=s=>document.querySelector(s);
const statuses={new:'Nová',in_progress:'Řeší se',completed:'Vyřízená',cancelled:'Zrušená'};
const message=text=>{$('#admin-message').textContent=text;};
async function api(path,options={}){const response=await fetch(path,{...options,headers:{...options.headers,Authorization:'Bearer '+token},signal:AbortSignal.timeout(30000)});if(!response.ok){const data=await response.json().catch(()=>({}));throw new Error(data.detail||'Server neodpovídá.');}return response;}
function el(tag,text,cls){const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(cls)node.className=cls;return node;}
function render(record){
 const card=el('article',undefined,'record'),head=el('div',undefined,'record-head');
 const title=el('div');title.append(el('h2',record.id),el('p',(record.kind==='order'?'Produkty':'Tisk na míru')+' · '+new Date(record.created_at).toLocaleString('cs-CZ')));head.append(title);
 const select=el('select');select.setAttribute('aria-label','Stav zakázky '+record.id);
 Object.entries(statuses).forEach(([value,label])=>{const option=el('option',label);option.value=value;select.append(option);});select.value=record.status;
 select.addEventListener('change',async()=>{select.disabled=true;try{await api('/api/admin/submissions/'+encodeURIComponent(record.id),{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status:select.value})});record.status=select.value;message('Stav byl uložen.');}catch(e){select.value=record.status;message(e.message);}finally{select.disabled=false;}});head.append(select);card.append(head);
 const p=record.payload;card.append(el('p',p.customer.name+'\n'+p.customer.email+(p.customer.phone?'\n'+p.customer.phone:'')));
 if(p.items){const list=el('ul');p.items.forEach(i=>list.append(el('li',`${i.quantity}× ${i.name} · ${i.color} · ${i.material} · ${(i.unit_cents*i.quantity/100).toLocaleString('cs-CZ')} Kč`)));card.append(list,el('p','Celkem produkty: '+(record.total_cents/100).toLocaleString('cs-CZ')+' Kč včetně DPH. Doprava a platba: po domluvě.'));}
 const labels={note:'Poznámka',description:'Popis',material:'Materiál',color:'Barva',quality:'Kvalita',infill:'Výplň',environment:'Prostředí',load:'Namáhání',dimensions:'Rozměry',url:'Odkaz'};
 const dl=el('dl');Object.entries(labels).forEach(([key,label])=>{if(p[key])dl.append(el('dt',label),el('dd',p[key]));});card.append(dl);
 const attachments=el('div',undefined,'attachments');record.attachments.forEach(file=>{const button=el('button',file.filename+' ↓','btn btn-outline');button.addEventListener('click',async()=>{button.disabled=true;try{const response=await api('/api/admin/attachments/'+encodeURIComponent(file.id));const blob=await response.blob();const url=URL.createObjectURL(blob);const a=el('a');a.href=url;a.download=file.filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}catch(e){message(e.message);}finally{button.disabled=false;}});attachments.append(button);});card.append(attachments);return card;
}
async function load(){const current=++generation;const response=await api('/api/admin/submissions?offset='+offset);const data=await response.json();if(current!==generation||!token)return;total=data.total;$('#records').replaceChildren(...data.items.map(render));if(!total)$('#records').append(el('p','Zatím nemáte žádné poptávky.'));$('#total').textContent=`Celkem ${total} · Zobrazeno ${total?offset+1:0}–${Math.min(offset+50,total)}`;$('#prev').disabled=offset===0;$('#next').disabled=offset+50>=total;$('#login').hidden=true;$('#dashboard').hidden=false;message('');}
$('#login').addEventListener('submit',async e=>{e.preventDefault();token=$('#token').value;const button=e.target.querySelector('button');button.disabled=true;try{await load();$('#token').value='';}catch(err){token='';message(err.message);}finally{button.disabled=false;}});
$('#refresh').addEventListener('click',()=>load().catch(e=>message(e.message)));
$('#logout').addEventListener('click',()=>{token='';generation++;offset=0;$('#records').replaceChildren();$('#token').value='';$('#dashboard').hidden=true;$('#login').hidden=false;message('Odhlášeno.');});
$('#prev').addEventListener('click',()=>{offset=Math.max(0,offset-50);load().catch(e=>message(e.message));});
$('#next').addEventListener('click',()=>{offset+=50;load().catch(e=>message(e.message));});
