/* HAQA Books – logika katalog.
   Data produk : products.js (variabel B)   ·   Tampilan : styles.css   ·   Foto : images/ */
var WA='6285846189815';
var PO_DISC=0.05;            /* potongan harga per pcs untuk PO jika qty > 1 (tidak ditampilkan sebagai persen) */
var PS=30;                   /* produk per halaman */
var THEMES=['Aqidah','Ibadah','Adab & Akhlak','Al-Qur\u2019an','Hadits','Sirah','Bahasa','Sains','Aktivitas','Pengetahuan Umum','Parenting','Emosi','Bayi & Stimulasi','Kisah & Cerita','Renungan & Nasihat','Muslimah & Keluarga'];
var AGES=[['','Semua Umur'],['0-2','0\u20132 tahun'],['2-4','2\u20134 tahun'],['4-6','4\u20136 tahun'],['6-8','6\u20138 tahun'],['8-12','8\u201312 tahun'],['12-18','12\u201318 tahun'],['18-99','Dewasa']];
var TYPES=['Boardbook','Softcover','Hardcover','Activity','Puzzle','Bebas'];

/* ---------- util ---------- */
function $(i){return document.getElementById(i)}
function money(n){return'Rp'+n.toLocaleString('id-ID')}
function rp(n){return'Rp '+n.toLocaleString('id-ID')}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function waUrl(t){return'https://wa.me/'+WA+(t?'?text='+encodeURIComponent(t):'')}
function toast(m){var t=$('toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(function(){t.classList.remove('on')},2600)}
function isV(b){return !!(b&&b.vr&&b.vr.length)}
function isCard(b){return !!b&&!b.hid&&!b.pid}
function pname(b){return b.pid&&B[b.pid]?B[b.pid].t:b.t}
function adult(b){return /Dewasa|Orang tua/.test(b.a||'')}
function grp(b){return{ready:1,po:2,poon:3}[b.st]||4}
function norm(s){return String(s||'').toLowerCase().replace(/[\u2019\u2018]/g,"'")}

/* ---------- state ---------- */
var S={q:'',u:'',t:'',p:'',f:'',st:'',o:''},pg=1,cart={},likes={},G={};
try{cart=JSON.parse(localStorage.getItem('hq_cart')||'{}')}catch(e){}
try{likes=JSON.parse(localStorage.getItem('hq_likes')||'{}')}catch(e){}
B.forEach(function(b){if(b.images&&b.images.length>1)G[b.i]=b.images.slice(1)});

/* ---------- status & badge ---------- */
var STX={ready:'Ready Stock',po:'Produk Ready dalam 3\u20135 hari',habis:'Habis',closed:'PO Closed',kirim:'Dalam tahap pengiriman',poon:'Pre Order Berlangsung'};
function stText(b){return STX[b.st]+(b.st==='poon'&&b.ps?' \u00B7 '+b.ps:'')+(b.st==='ready'&&b.lw?' \u00B7 Stok menipis':'')}
function badge(b){
 if(b.st==='po')return['po','Ready dalam 3\u20135 hari'];
 if(b.st==='ready'&&b.lw)return['low','Stok menipis'];
 if(b.st==='poon')return[b.ps==='Segera Tutup'?'low':'po','PO \u00B7 '+b.ps];
 if(b.st==='kirim')return['po','Dalam pengiriman'];
 if(b.st==='closed')return['out','PO Closed'];
 if(b.st==='habis')return['out','Habis'];
 return null}

/* ---------- urutan default: Ready Stock > Ready 3-5 hari > PO berlangsung > lainnya; anak dulu, baru dewasa ---------- */
function rank(){var L=B.filter(isCard);
 L.sort(function(x,y){var gx=grp(x),gy=grp(y);if(gx!==gy)return gx-gy;if(gx<3&&adult(x)!==adult(y))return adult(x)?1:-1;return x.i-y.i});
 L.forEach(function(b,k){b._o=k+1});return L}

/* ---------- kartu produk ---------- */
function skey(b){var v=(b.vr||[]).map(function(x){return B[x].vl}).join(' ');
 return norm([b.t,b.p,b.c,b.sub,(b.themes||[]).join(' '),b.au,b.il,b.pm,b.ed,b.f,b.a,v].filter(Boolean).join(' '))+' '}
function cardHTML(b,n){var a=badge(b),img=b.images&&b.images[0],
 sv=(b.sp>b.pr&&b.pr)?'<span class="sv">Hemat '+rp(b.sp-b.pr)+'</span>':'',
 m=b.cm||[b.p,b.f&&b.f!=='Lainnya'?b.f:'',b.w].filter(Boolean).join(' \u00B7 '),
 price=b.pr?'<p><span class="now">'+(isV(b)?'Mulai dari ':'')+rp(b.pr)+'</span>'+(b.sp?' <s>'+rp(b.sp)+'</s>':'')+'</p>':'<p class="nop">Harga belum tertera</p>',
 pic=img?'<img src="'+esc(img)+'" alt="Sampul '+esc(b.t)+'" loading="'+(n<6?'eager':'lazy')+'"'+(n<2?' fetchpriority="high"':'')+'>':'<div class="ph" aria-hidden="true">'+esc(b.t.charAt(0).toUpperCase())+'</div>';
 return'<article class="c'+(b.st==='closed'||b.st==='habis'?' gone':'')+'" data-i="'+b.i+'" data-c="'+esc(b.c)+'" data-th="'+esc((b.themes||[]).join('|'))+'" data-tm="'+esc(b.sub||'')+'" data-o="'+b._o+'" data-st="'+b.st+'" data-pr="'+(b.pr||0)+'" data-t="'+esc(norm(b.t))+'" data-f="'+esc(b.f||'Lainnya')+'" data-x="" data-lo="'+b.lo+'" data-hi="'+b.hi+'" data-p="'+esc(b.p)+'" data-s="'+esc(skey(b))+'">'
 +sv+pic+'<div class="t"><div class="tags"><span class="tag">'+esc(b.a)+'</span>'+(a?'<span class="b '+a[0]+'">'+esc(a[1])+'</span>':'')+'</div><h2><button class="ttl" data-i="'+b.i+'">'+esc(b.t)+'</button></h2><p class="m">'+esc(m)+'</p><p class="d">'+esc(b.cd||b.d)+'</p>'+(b.cn?'<p class="n">'+esc(b.cn)+'</p>':'')+price+'<div class="act"></div></div></article>'}

var g=$('g'),ORDER=rank();
g.innerHTML=ORDER.map(cardHTML).join('');
var cs=[].slice.call(g.querySelectorAll('.c'));

/* ---------- pilihan filter (dibangun dari data) ---------- */
function fillSelects(){var vis=ORDER,cnt={},pubs={},fm={};
 vis.forEach(function(b){(b.themes||[]).forEach(function(t){cnt[t]=(cnt[t]||0)+1});pubs[b.p]=1;fm[b.f||'Lainnya']=1});
 var ths=THEMES.filter(function(t){return cnt[t]});Object.keys(cnt).forEach(function(t){if(ths.indexOf(t)<0)ths.push(t)});
 $('sc').innerHTML='<option value="">Semua Kategori</option>'+ths.map(function(t){return'<option value="'+esc(t)+'">'+esc(t)+' ('+cnt[t]+')</option>'}).join('');
 var pl=Object.keys(pubs).filter(function(p){return p!=='Lainnya'}).sort(function(a,b){return a.toLowerCase()<b.toLowerCase()?-1:1});if(pubs['Lainnya'])pl.push('Lainnya');
 $('sp').innerHTML='<option value="">Semua penerbit</option>'+pl.map(function(p){return'<option value="'+esc(p)+'">'+esc(p)+'</option>'}).join('');
 var pref=['Boardbook','Softcover','Hardcover','Lift-the-flap','Flashcard','Activity book','Komik','Lainnya'],fl=pref.filter(function(f){return fm[f]});Object.keys(fm).forEach(function(f){if(fl.indexOf(f)<0)fl.push(f)});
 $('sf').innerHTML='<option value="">Semua jenis</option>'+fl.map(function(f){return'<option value="'+esc(f)+'">'+esc(f)+'</option>'}).join('')}
fillSelects();

/* ---------- favorit ---------- */
function lkSave(){try{localStorage.setItem('hq_likes',JSON.stringify(likes))}catch(e){}}
var HT='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
function lkHtml(i,full){var on=!!likes[i];return'<button class="lk'+(on?' on':'')+'" data-a="lk" data-i="'+i+'" aria-pressed="'+on+'" aria-label="'+(on?'Batal suka':'Suka')+'">'+HT+(full?'<span>'+(on?'Disukai':'Suka')+'</span>':'')+'</button>'}
function favCount(){var n=Object.keys(likes).filter(function(k){return B[k]}).length;$('fc').textContent=n;$('fb').classList.toggle('has',n>0)}
function lkSync(i){var on=!!likes[i];document.querySelectorAll('button[data-a="lk"][data-i="'+i+'"]').forEach(function(x){x.classList.toggle('on',on);x.setAttribute('aria-pressed',on);x.setAttribute('aria-label',on?'Batal suka':'Suka');var sp=x.querySelector('span');if(sp)sp.textContent=on?'Disukai':'Suka'});favCount()}

/* ---------- harga, stok & batas jumlah ---------- */
function purch(b){return !!b&&!isV(b)&&(b.st==='ready'||b.st==='po'||(b.st==='poon'&&b.ps!=='Belum Dibuka'))}
function maxQ(b){if(b.st==='ready')return Math.max(1,typeof b.sk==='number'?b.sk:1);if(b.st==='po')return 1;if(b.st==='poon')return 9999;return 1}
function unit(b,q){return(b.st==='poon'&&q>1&&b.pr)?Math.round(b.pr*(1-PO_DISC)):b.pr}
function line(b){return b.pid?pname(b)+' \u2013 Varian: '+b.vl+(b.tr?' ('+b.tr+')':''):b.t+(b.f&&b.f!=='Lainnya'?' ('+b.f+')':'')}
function items(){return Object.keys(cart).map(function(k){return B[k]}).filter(Boolean)}
function fixCart(){var ch=false,pop=null;Object.keys(cart).forEach(function(k){var b=B[k],q=cart[k];
 if(b&&isV(b)){var to=k==='89'?158:0;if(to&&!cart[to])cart[to]=q;delete cart[k];ch=true;return}
 if(!b||!purch(b)){delete cart[k];ch=true;return}
 q=Math.floor(Number(q));if(!isFinite(q)||q<1)q=1;var m=maxQ(b);if(q>m){if(b.st==='po')pop=b;q=m}
 if(q!==cart[k]){cart[k]=q;ch=true}});
 if(ch){try{localStorage.setItem('hq_cart',JSON.stringify(cart))}catch(e){}}return pop}
function save(){var p=fixCart();try{localStorage.setItem('hq_cart',JSON.stringify(cart))}catch(e){}bar();if(p)qpop(p)}
function cartMsg(){fixCart();var L=items(),n=0,t=0;var r=L.map(function(b,k){var q=cart[b.i],u=unit(b,q);n+=q;t+=u*q;return(k+1)+'. '+line(b)+'\n   '+q+' x '+money(u)+' = '+money(u*q)}).join('\n');return'Assalamu\u2019alaikum, saya ingin pesan:\n'+r+'\n\nTotal ('+n+' buku): '+money(t)}
function buyMsg(b,q){q=q||1;var u=unit(b,q);return'Assalamu\u2019alaikum, saya ingin pesan:\n'+line(b)+'\nJumlah: '+q+' pcs\nHarga: '+(b.pr?money(u)+'/pcs':'(mohon info harga)')+(q>1&&b.pr?'\nSubtotal: '+money(u*q):'')}
function bar(){fixCart();var n=0,t=0;items().forEach(function(b){var q=cart[b.i];n+=q;t+=unit(b,q)*q});$('cb').textContent='\uD83D\uDED2 '+n+' buku'+(n?' \u00B7 '+money(t):'');var w=$('cw');w.textContent=n?'Pesan via WA':'Chat WA';w.href=waUrl(n?cartMsg():'');cs.forEach(function(c){var a=c.querySelector('.add');if(a){var on=!!cart[c.dataset.i];a.classList.toggle('in',on);a.textContent=on?'\u2713 Di keranjang':'+ Keranjang'}})}

/* ---------- link produk & pesan WhatsApp ---------- */
function pUrl(i){return location.href.split('#')[0]+'#book-'+i}
function askMsg(b,more){var P=b.pid?B[b.pid]:b,v=b.pid?b.vl:'',pub=P.p&&P.p!=='Lainnya'?'\nPenerbit: '+P.p:'',info=P.t+(v?'\nVarian: '+v:'')+pub+'\nLink: '+pUrl(P.i);
 if(more)return'Halo Admin HAQA Books, saya ingin membeli:\n\n'+info+'\n\nlebih dari 1 pcs. Apakah bisa dibantu untuk quantity lebih dari 1?';
 if(b.st==='po')return'Halo Admin HAQA Books, saya mau bertanya tentang buku:\n\n'+info+'\n\nBuku ini ready dalam 3\u20135 hari. Boleh dibantu informasinya?';
 if(v||b.st==='poon')return'Halo Admin HAQA Books, saya mau bertanya tentang:\n'+info+'\n\nBoleh dibantu informasinya?';
 return'Halo Admin HAQA Books, saya mau bertanya tentang buku:\n'+info+'\n\nBoleh dibantu informasinya?'}
function shMsg(b){return'Lihat buku ini di Katalog HAQA Books:\n'+b.t+(b.p&&b.p!=='Lainnya'?'\nPenerbit: '+b.p:'')+'\n'+pUrl(b.i)}
function copyText(t){if(navigator.clipboard&&navigator.clipboard.writeText){return navigator.clipboard.writeText(t)}
 return new Promise(function(ok,no){try{var a=document.createElement('textarea');a.value=t;a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();document.execCommand('copy');document.body.removeChild(a);ok()}catch(e){no(e)}})}
function setHash(i){try{history.replaceState(null,'',location.pathname+location.search+'#book-'+i)}catch(e){}}
function clearHash(){try{if(location.hash)history.replaceState(null,'',location.pathname+location.search)}catch(e){}}
function openFromHash(){var m=/^#book-(\d+)$/.exec(location.hash||'');if(!m)return;var b=B[+m[1]];if(b&&!b.hid){detail(b.pid||b.i,true)}}

/* ---------- modal umum ---------- */
function open_(h){$('mb').innerHTML=h;$('mb').dataset.v='';$('ov').hidden=false;document.body.style.overflow='hidden';var md=$('ov').querySelector('.md');if(md)md.scrollTop=0;$('x').focus()}
function close_(){$('ov').hidden=true;document.body.style.overflow='';clearHash()}
function ldr(t){var o='',l=0;t.split('\n').forEach(function(x){var li=x.indexOf('- ')===0;if(l&&!li){o+='</ul>';l=0}if(!x)return;if(x.indexOf('## ')===0)o+='<h4>'+esc(x.slice(3))+'</h4>';else if(li){if(!l){o+='<ul>';l=1}o+='<li>'+esc(x.slice(2))+'</li>'}else o+='<p>'+esc(x)+'</p>'});if(l)o+='</ul>';return o}
function sections(ld){var parts=[],cur=null;(ld||'').split('\n').forEach(function(x){if(x.indexOf('## ')===0){cur={h:x.slice(3),l:[]};parts.push(cur)}else{if(!cur){cur={h:'',l:[]};parts.push(cur)}cur.l.push(x)}});return parts}
function secHTML(p){return(p.h?'<h4>'+esc(p.h)+'</h4>':'')+ldr(p.l.join('\n'))}
function dl(rows){rows=rows.filter(function(r){return r[1]&&r[1]!=='-'});return rows.length?'<dl>'+rows.map(function(r){return'<dt>'+r[0]+'</dt><dd>'+esc(r[1])+'</dd>'}).join('')+'</dl>':''}

/* ---------- galeri ---------- */
var GV={list:[],k:0};
function galHTML(b){var list=b.images||[];GV={list:list,k:0};if(!list.length)return'';var many=list.length>1;
 return'<div class="gm'+(many?'':' one')+'"><img class="big'+(many?' ph3':'')+'" id="bg" src="'+esc(list[0])+'" alt="Sampul '+esc(b.t)+'">'+(many?'<button type="button" class="gnav gp" data-a="gp" aria-label="Foto sebelumnya">\u2039</button><button type="button" class="gnav gn" data-a="gn" aria-label="Foto berikutnya">\u203A</button><span class="gc" id="gc">1/'+list.length+'</span>':'')+'</div>'
 +(many?'<div class="gal" aria-label="Foto produk">'+list.map(function(u,k){return'<button type="button" data-a="g" data-k="'+k+'" aria-label="Foto '+(k+1)+'" aria-current="'+(k===0)+'"><img src="'+esc(u)+'" alt="" loading="lazy"></button>'}).join('')+'</div>':'')}
function gShow(k){var n=GV.list.length;if(n<2||!$('bg'))return;GV.k=(k+n)%n;$('bg').src=GV.list[GV.k];if($('gc'))$('gc').textContent=(GV.k+1)+'/'+n;document.querySelectorAll('.gal button').forEach(function(y,j){y.setAttribute('aria-current',j===GV.k)})}
function swipe(){var el=$('mb').querySelector('.gm');if(!el||GV.list.length<2)return;var x0=null;
 el.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});
 el.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>40)gShow(GV.k+(dx<0?1:-1))},{passive:true})}

/* ---------- rekomendasi ---------- */
function recs(b,n){var ths=b.themes||[];
 return B.filter(function(x){return isCard(x)&&x.i!==b.i}).map(function(x){
  var th=(x.themes||[]).some(function(t){return ths.indexOf(t)>-1}),ag=x.lo<b.hi&&x.hi>b.lo;
  var s=th&&ag?5:th?4:ag?3:(x.f&&x.f===b.f)?2:(x.p===b.p)?1:0;return{x:x,s:s}})
  .filter(function(r){return r.s>0}).sort(function(a,c){return c.s-a.s||grp(a.x)-grp(c.x)||a.x._o-c.x._o}).slice(0,n).map(function(r){return r.x})}
function recsHTML(b){var L=recs(b,4);if(!L.length)return'';
 return'<h4>Rekomendasi untukmu</h4><div class="recs">'+L.map(function(x){var im=x.images&&x.images[0];return'<button type="button" class="rc" data-a="fd" data-i="'+x.i+'">'+(im?'<img src="'+esc(im)+'" alt="" loading="lazy">':'<span class="rph">'+esc(x.t.charAt(0))+'</span>')+'<span><b>'+esc(x.t)+'</b><i>'+(x.pr?(isV(x)?'Mulai dari ':'')+rp(x.pr):'')+'</i></span></button>'}).join('')+'</div>'}

/* ---------- detail produk (urutan: galeri, favorit/share, status, judul, info, harga, deskripsi, spesifikasi, penulis, cocok untuk, rekomendasi, aksi) ---------- */
function vprice(x){return money(x.pr)+(x.sp?' <s>'+money(x.sp)+'</s>':'')}
function detail(i,fromHash){var b=B[i];if(!b||b.hid)return;if(b.pid){b=B[b.pid];i=b.i}
 var parts=sections(b.ld),spec=parts.filter(function(p){return p.h==='Spesifikasi'})[0],cocok=parts.filter(function(p){return p.h==='Cocok untuk'})[0],rest=parts.filter(function(p){return p!==spec&&p!==cocok});
 var h=galHTML(b)
 +'<div class="tools">'+lkHtml(i,1)+'<button type="button" class="tl" data-a="sh" data-i="'+i+'">Bagikan</button><button type="button" class="tl" data-a="shw" data-i="'+i+'">WhatsApp</button><button type="button" class="tl" data-a="cl" data-i="'+i+'">Salin Link</button></div>'
 +'<p class="stt">'+esc(stText(b))+'</p><h3>'+esc(b.t)+'</h3>'
 +dl([['Penerbit',b.p!=='Lainnya'?b.p:''],['Format',b.f&&b.f!=='Lainnya'?b.f:''],['Usia',b.a],['Tema',b.sub],['PO',b.po],['Estimasi ready',b.er]]);
 if(isV(b)){h+='<h4>Pilih varian</h4><div class="vrs">'+b.vr.map(function(v){var x=B[v];return'<button class="vb" data-a="vr" data-i="'+i+'" data-v="'+v+'" aria-pressed="false"><b>'+esc(x.vl)+'</b><span>'+vprice(x)+'</span></button>'}).join('')+'</div><p class="mp" id="vp">Mulai '+vprice(b)+'</p>'}
 else h+='<p class="mp">'+(b.pr?vprice(b):'Harga belum tertera')+'</p>';
 h+='<p>'+esc(b.d)+'</p>'+rest.map(secHTML).join('')+(b.pv?'<p><a class="pvl" target="_blank" rel="noopener" href="'+esc(b.pv)+'">Lihat preview lengkap \u2197</a></p>':'');
 h+=spec?secHTML(spec):(b.n&&b.n!=='-'?'<h4>Spesifikasi</h4><p>'+esc(b.n)+'</p>':'');
 h+=dl([['Penulis',b.au],['Ilustrator',b.il],['Pemuroja\u2019ah',b.pm],['Editor Ahli',b.ed],['Berat',b.w]]);
 h+=cocok?secHTML(cocok):((b.cf&&b.cf.length)?'<h4>Cocok untuk</h4><ul>'+b.cf.map(function(x){return'<li>'+esc(x)+'</li>'}).join('')+'</ul>':'');
 h+=recsHTML(b)+'<div class="mact"><span id="'+(isV(b)?'va':'da')+'" style="display:contents">'+(isV(b)?'<button class="buy" disabled>Pilih varian dulu</button>':'')+'</span></div>';
 open_(h);swipe();setHash(i);
 if(isV(b)){var dv=pickVar(b);if(dv)selVar(i,dv)}else fillAct(i,$('da'))}
function pickVar(b){var q=norm(S.q).trim();if(q.length>=3){for(var k=0;k<b.vr.length;k++){if(norm(B[b.vr[k]].vl).indexOf(q)>-1)return b.vr[k]}}return b.dv||0}
function selVar(pid,vid){var x=B[vid];document.querySelectorAll('.vb').forEach(function(y){y.setAttribute('aria-pressed',y.dataset.v===String(vid))});
 $('vp').innerHTML=esc(x.vl)+': '+vprice(x)+(x.tr?' \u00B7 '+esc(x.tr):'');if(x.img&&$('bg')){$('bg').src=x.img;if($('gc'))$('gc').textContent='Varian'}fillAct(vid,$('va'))}

/* ---------- aksi produk: jumlah, beli, keranjang, tanya admin ---------- */
function fillAct(i,el,short){var b=B[i],ask='<button type="button" class="ask" data-a="ask" data-i="'+i+'">'+(short?'Tanya Admin':'Tanya Admin tentang buku ini')+'</button>';
 if(!purch(b)){el.innerHTML='<div class="ac">'+ask+'<button class="buy" disabled>'+(b.st==='poon'?'Belum dibuka':({habis:'Habis',closed:'PO Closed',kirim:'Dalam pengiriman'}[b.st]||'Tidak tersedia'))+'</button></div>';return}
 el.innerHTML='<div class="ac" data-i="'+i+'"><div class="qrow"><div class="qty" data-i="'+i+'"><button type="button" data-a="qm" data-i="'+i+'" aria-label="Kurangi jumlah">\u2212</button><span class="qn" aria-live="polite">1</span><button type="button" data-a="qp" data-i="'+i+'" aria-label="Tambah jumlah">+</button></div>'+ask+'</div><p class="qs" hidden></p><button type="button" class="buy" data-a="buy" data-i="'+i+'">'+(short?'Beli':'Beli via WhatsApp')+'</button><button type="button" class="add" data-a="addc" data-i="'+i+'">'+(cart[i]?'\u2713 Di keranjang':'+ Keranjang')+'</button></div>';qShow(el.querySelector('.qty'))}
function initCards(){cs.forEach(function(c){var i=+c.dataset.i,b=B[i],a=c.querySelector('.act');if(!a||!b)return;
 if(isV(b)){a.innerHTML=lkHtml(i)+'<div class="ac"><div class="qrow"><button type="button" class="buy" data-a="fd" data-i="'+i+'">Pilih varian</button><button type="button" class="ask" data-a="ask" data-i="'+i+'">Tanya Admin</button></div></div>';return}
 a.innerHTML=lkHtml(i)+'<span class="cx" style="display:contents"></span>';fillAct(i,a.querySelector('.cx'),1)})}
function qShow(box){var i=+box.dataset.i,b=B[i],qn=box.querySelector('.qn'),q=+qn.textContent,m=maxQ(b),ac=box.closest('.ac'),s=ac.querySelector('.qs');
 box.querySelector('[data-a="qp"]').classList.toggle('mx',b.st!=='po'&&q>=m);box.querySelector('[data-a="qm"]').classList.toggle('mx',q<=1);
 if(q>1&&b.pr){var u=unit(b,q);s.textContent=(b.st==='poon'?money(u)+'/pcs \u00B7 ':'')+'Subtotal '+money(u*q);s.hidden=false}else{s.textContent='';s.hidden=true}}
function qStep(box,d){var i=+box.dataset.i,b=B[i],qn=box.querySelector('.qn'),q=+qn.textContent||1;
 if(d>0){if(b.st==='po'){qpop(b);return}if(q>=maxQ(b)){toast('Jumlah maksimal untuk produk ini sudah tercapai');return}q++}else q=Math.max(1,q-1);
 qn.textContent=q;qShow(box)}
function addQty(i,q){var b=B[i];if(!purch(b))return;var cur=cart[i]||0,n=cur+q,m=maxQ(b);
 if(b.st==='po'&&n>1){qpop(b);return}
 if(n>m){n=m;toast('Jumlah maksimal untuk produk ini sudah tercapai')}else toast('Ditambahkan ke keranjang');
 cart[i]=n;save()}
function qpop(b){var el=$('qm');if(!el){el=document.createElement('div');el.id='qm';el.className='qm';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');document.body.appendChild(el);el.addEventListener('click',function(e){if(e.target===el)qclose()})}
 el.innerHTML='<div class="qb"><p>Untuk pembelian lebih dari 1 pcs, silakan hubungi admin terlebih dahulu ya \uD83D\uDE0A</p><a class="qa" target="_blank" rel="noopener" href="'+waUrl(askMsg(b,true))+'">Hubungi Admin</a><button type="button" class="qc" data-a="qc">Tutup</button></div>';el.hidden=false;document.body.style.overflow='hidden'}
function qclose(){var el=$('qm');if(el)el.hidden=true;if($('ov').hidden)document.body.style.overflow=''}

/* ---------- keranjang & favorit ---------- */
function cartView(){fixCart();var L=items();if(!L.length){open_('<h3>Keranjang</h3><p>Belum ada buku. Klik <b>+ Keranjang</b> pada buku pilihan Anda.</p>');return}
 var n=0,t=0,h='<h3>Keranjang</h3>'+L.map(function(b){var q=cart[b.i],u=unit(b,q);n+=q;t+=u*q;return'<div class="ci cx"><div class="cn"><b>'+esc(pname(b))+'</b>'+(b.pid?'<em>Varian: '+esc(b.vl)+(b.tr?' \u00B7 '+esc(b.tr):'')+'</em>':'')+'<span>'+money(u)+'/pcs</span></div><div class="q"><button type="button" data-a="cm" data-i="'+b.i+'" aria-label="Kurangi">\u2212</button><span class="qv">'+q+'</span><button type="button" data-a="cp" data-i="'+b.i+'" aria-label="Tambah">+</button></div><div class="cs"><span>Subtotal: <b>'+money(u*q)+'</b></span><button type="button" class="cdel" data-a="cd" data-i="'+b.i+'">Hapus</button></div></div>'}).join('')+'<div class="tot"><span>'+n+' buku</span><span>'+money(t)+'</span></div><a class="cw" target="_blank" rel="noopener" href="'+waUrl(cartMsg())+'" style="display:block;text-align:center;text-decoration:none">Pesan semua via WhatsApp</a>';open_(h)}
function favView(){var L=Object.keys(likes).map(function(k){return B[k]}).filter(Boolean);if(!L.length){open_('<h3>Favorit</h3><p>Belum ada favorit. Klik ikon love pada buku yang Anda suka.</p>');$('mb').dataset.v='fav';return}
 var h='<h3>Favorit ('+L.length+' buku)</h3>'+L.map(function(b){return'<div class="ci"><div><b>'+esc(b.t)+'</b><span>'+(b.pr?money(b.pr):'Harga belum tertera')+'</span></div><div class="fa"><button class="fv" data-a="fd" data-i="'+b.i+'">Lihat</button>'+lkHtml(b.i)+'</div></div>'}).join('');open_(h);$('mb').dataset.v='fav'}

/* ---------- Bantu Aku Pilih ---------- */
var W={u:'',t:'',f:'Bebas'};
function typeOk(b,t){if(t==='Bebas')return true;if(t==='Activity')return b.f==='Activity book'||(b.themes||[]).indexOf('Aktivitas')>-1;if(t==='Puzzle')return /puzzle/i.test(b.t+' '+(b.sub||''));return b.f===t}
function ageOk(b,u){if(!u)return true;var a=u.split('-').map(Number);return b.lo<a[1]&&b.hi>a[0]}
function wizHTML(){function chips(k,opts,cur){return'<div class="wo">'+opts.map(function(o){return'<button type="button" class="wc" data-a="ws" data-k="'+k+'" data-v="'+esc(o[0])+'" aria-pressed="'+(cur===o[0])+'">'+esc(o[1])+'</button>'}).join('')+'</div>'}
 var ths=[['','Semua tema']].concat(THEMES.filter(function(t){return ORDER.some(function(b){return(b.themes||[]).indexOf(t)>-1})}).map(function(t){return[t,t]}));
 return'<h3>Bantu Aku Pilih</h3><p class="wh">Jawab 3 pertanyaan singkat, kami tampilkan buku yang cocok.</p><h4>1. Usia anak</h4>'+chips('u',AGES,W.u)+'<h4>2. Tema</h4>'+chips('t',ths,W.t)+'<h4>3. Jenis buku</h4>'+chips('f',TYPES.map(function(t){return[t,t]}),W.f)+'<button type="button" class="wgo" data-a="wgo">Tampilkan buku yang cocok</button><div id="wr"></div>'}
function wizResult(){var L=ORDER.filter(function(b){return ageOk(b,W.u)&&(!W.t||(b.themes||[]).indexOf(W.t)>-1)&&typeOk(b,W.f)});
 L.sort(function(a,c){return grp(a)-grp(c)||a._o-c._o});var top=L.slice(0,6);
 $('wr').innerHTML=L.length?'<h4>'+L.length+' buku cocok</h4>'+top.map(function(x){var im=x.images&&x.images[0];return'<button type="button" class="rc wi" data-a="fd" data-i="'+x.i+'">'+(im?'<img src="'+esc(im)+'" alt="" loading="lazy">':'<span class="rph">'+esc(x.t.charAt(0))+'</span>')+'<span><b>'+esc(x.t)+'</b><i>'+(x.pr?(isV(x)?'Mulai dari ':'')+rp(x.pr):'')+' \u00B7 '+esc(x.st==='ready'?'Ready Stock':x.st==='po'?'Ready 3\u20135 hari':x.st==='poon'?'Pre Order':'')+'</i></span></button>'}).join('')+(L.length>6?'<button type="button" class="wgo wall" data-a="wall">Lihat semua '+L.length+' hasil di katalog</button>':''):'<p class="wh">Belum ada buku yang cocok. Coba ubah pilihan usia, tema, atau jenis buku.</p>'}
function wizApply(){S.u=W.u;S.t=W.t;S.f='';S.q='';if(W.f==='Boardbook'||W.f==='Softcover'||W.f==='Hardcover')S.f=W.f;else if(W.f==='Activity')S.f='Activity book';else if(W.f==='Puzzle')S.q='puzzle';
 $('su').value=S.u;$('sc').value=S.t;$('sf').value=S.f;$('q').value=S.q;pg=1;close_();render();$('q').scrollIntoView({behavior:'smooth'})}

/* ---------- daftar produk: filter, urut, halaman ---------- */
function render(){var s=norm(S.q).trim(),ub=S.u?S.u.split('-').map(Number):null;
 var L=cs.filter(function(c){var d=c.dataset;return(!S.t||('|'+d.th+'|').indexOf('|'+S.t+'|')>-1)&&(!S.p||d.p===S.p)&&(!S.f||d.f===S.f||d.x.split('|').indexOf(S.f)>-1)&&(!S.st||d.st===S.st)&&(!ub||(+d.lo<ub[1]&&+d.hi>ub[0]))&&d.s.indexOf(s)>-1});
 L.sort(function(a,b){var x=a.dataset,y=b.dataset,px=+x.pr||0,py=+y.pr||0;
  if(S.o==='lo'||S.o==='hi'){if(!px!==!py)return px?-1:1;return(S.o==='lo'?px-py:py-px)||x.i-y.i}
  if(S.o==='sv'){var vx=B[+x.i],vy=B[+y.i],sx=vx&&vx.sp>vx.pr&&vx.pr?vx.sp-vx.pr:0,sy=vy&&vy.sp>vy.pr&&vy.pr?vy.sp-vy.pr:0;return sy-sx||x.i-y.i}
  if(S.o==='az')return x.t.localeCompare(y.t,'id');
  return(+x.o||0)-(+y.o||0)||x.i-y.i});
 var T=Math.max(1,Math.ceil(L.length/PS));if(pg>T)pg=T;var a=(pg-1)*PS,b=Math.min(a+PS,L.length);
 cs.forEach(function(c){c.classList.add('hide')});L.forEach(function(c,i){g.appendChild(c);c.classList.toggle('hide',i<a||i>=b)});
 $('cnt').textContent=L.length?('Menampilkan '+(a+1)+'\u2013'+b+' dari '+L.length+' judul'):'Tidak ada judul yang cocok';$('pg').textContent='Halaman '+pg+'/'+T;$('pc').textContent=pg+'/'+T;
 var P=[],i;for(i=1;i<=T;i++){if(i===1||i===T||Math.abs(i-pg)<=1||(pg<=3&&i<=4)||(pg>=T-2&&i>=T-3))P.push(i);else if(P[P.length-1]!=='\u2026')P.push('\u2026')}
 var N=$('nums');N.innerHTML='';P.forEach(function(p){var e=document.createElement(p==='\u2026'?'span':'button');e.textContent=p;if(p!=='\u2026'){e.setAttribute('aria-label','Halaman '+p);if(p===pg)e.setAttribute('aria-current','page');e.onclick=function(){pg=p;render();$('q').scrollIntoView({behavior:'smooth'})}}N.appendChild(e)});
 $('pv').disabled=pg<=1;$('nx').disabled=pg>=T}
function set(k,v){S[k]=v;pg=1;render()}

/* ---------- event ---------- */
document.addEventListener('click',function(e){var t=e.target.closest('button,a');if(!t)return;
 if(t.tagName==='A'&&(t.id==='cw'||t.classList.contains('cw'))){var pp=fixCart();t.href=waUrl(cartMsg());if(pp)qpop(pp);return}
 var a=t.dataset&&t.dataset.a,i=t.dataset&&t.dataset.i,b=i!==undefined?B[i]:null;
 if(t.id==='x')return close_();
 if(t.id==='cb')return cartView();
 if(t.id==='fb')return favView();
 if(t.id==='bp'){open_(wizHTML());return}
 if(t.classList.contains('ttl'))return detail(+i);
 if(!a)return;
 switch(a){
  case'lk':if(likes[i])delete likes[i];else likes[i]=1;lkSave();lkSync(i);if($('mb').dataset.v==='fav')favView();return;
  case'fd':return detail(+i);
  case'vr':return selVar(+i,+t.dataset.v);
  case'g':return gShow(+t.dataset.k);
  case'gp':return gShow(GV.k-1);
  case'gn':return gShow(GV.k+1);
  case'qp':case'qm':return qStep(t.closest('.qty'),a==='qp'?1:-1);
  case'ask':window.open(waUrl(askMsg(b)),'_blank');return;
  case'buy':case'addc':{var ac=t.closest('.ac'),qn=ac.querySelector('.qn'),q=+qn.textContent||1;if(!purch(b))return;if(q>maxQ(b))q=maxQ(b);
   if(a==='buy'){if(b.st==='po'&&q>1){qn.textContent=1;qShow(ac.querySelector('.qty'));qpop(b);return}window.open(waUrl(buyMsg(b,q)),'_blank');return}
   addQty(i,q);qn.textContent=1;qShow(ac.querySelector('.qty'));return}
  case'qc':return qclose();
  case'cp':case'cm':case'cd':{var q2=cart[i]||1;
   if(a==='cd')delete cart[i];else if(a==='cm'){if(q2>1)cart[i]=q2-1}else{if(b.st==='po'){qpop(b);return}if(q2>=maxQ(b)){toast('Jumlah maksimal untuk produk ini sudah tercapai');return}cart[i]=q2+1}
   save();cartView();return}
  case'sh':{var u=pUrl(+i),d={title:b.t,text:shMsg(b),url:u};if(navigator.share){navigator.share(d).catch(function(){})}else window.open('https://wa.me/?text='+encodeURIComponent(shMsg(b)),'_blank');return}
  case'shw':window.open('https://wa.me/?text='+encodeURIComponent(shMsg(b)),'_blank');return;
  case'cl':copyText(pUrl(+i)).then(function(){toast('Link produk disalin')},function(){toast('Salin manual: '+pUrl(+i))});return;
  case'ws':W[t.dataset.k]=t.dataset.v;t.parentNode.querySelectorAll('button').forEach(function(y){y.setAttribute('aria-pressed',y===t)});if($('wr')&&$('wr').innerHTML)wizResult();return;
  case'wgo':wizResult();return;
  case'wall':return wizApply();
 }});
$('ov').addEventListener('click',function(e){if(e.target===this)close_()});
document.addEventListener('keydown',function(e){if(e.key!=='Escape')return;if($('qm')&&!$('qm').hidden)qclose();else close_()});
window.addEventListener('hashchange',openFromHash);
$('q').addEventListener('input',function(){set('q',this.value)});
[['sp','p'],['sf','f'],['su','u'],['sc','t'],['so','o']].forEach(function(x){$(x[0]).addEventListener('change',function(){set(x[1],this.value)})});
$('nt').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;this.querySelectorAll('button').forEach(function(y){y.setAttribute('aria-pressed',y===b)});set('st',b.dataset.v)});
$('pv').onclick=function(){pg--;render();$('q').scrollIntoView({behavior:'smooth'})};
$('nx').onclick=function(){pg++;render();$('q').scrollIntoView({behavior:'smooth'})};

/* ---------- promo member / reseller ---------- */
(function(){var p=$('mp');try{if(sessionStorage.getItem('hq_promo_x')==='1')p.hidden=true}catch(e){}$('mpx').addEventListener('click',function(){p.hidden=true;try{sessionStorage.setItem('hq_promo_x','1')}catch(e){}})})();

/* ---------- mulai ---------- */
$('sh').href='https://wa.me/?text='+encodeURIComponent('Katalog buku anak dan keluarga HAQA Books:\n'+location.href.split('#')[0]);
initCards();Object.keys(likes).forEach(lkSync);favCount();
var _pp=fixCart();render();bar();if(_pp)qpop(_pp);openFromHash();
