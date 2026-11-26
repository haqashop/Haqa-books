/* promo.js - kode promo ready stock HAQA Books
   Harga di katalog TIDAK berubah. Diskon hanya berlaku saat kode dimasukkan di checkout.
   Ubah tanggal (from/to), persen (pct), atau daftar buku (ids) di bagian PROMO di bawah ini.
   Tanggal memakai waktu WIB (UTC+7), format TAHUN-BULAN-TANGGAL. "to" = hari terakhir (inklusif). */
(function(){
var STEP=100; /* pembulatan harga kode promo (Rp) */
var PROMO=[
{code:"SIKECIL12",name:"Si Kecil Mulai Baca",tag:"Boardbook dan buku pertama untuk usia 0–3 tahun",pct:12,from:"2026-11-30",to:"2026-12-06",
 ids:[0, 1, 2, 7, 19, 24, 83, 84, 85, 90, 91, 92, 97, 98, 99, 101, 102, 103, 104, 109, 110, 111, 117, 118, 121, 123, 155, 156, 157, 158, 173, 174, 175, 189, 191, 190, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 362, 364, 365]},
{code:"ADABMULIA10",name:"Pekan Adab Mulia",tag:"Adab dan akhlak, mulai dari rumah",pct:10,from:"2026-12-07",to:"2026-12-13",
 ids:[2, 14, 19, 86, 87, 90, 123, 198, 155, 156, 157, 158, 362, 365]},
{code:"SAINS10",name:"Petualangan Sains",tag:"Rasa ingin tahu anak, dijawab lewat buku",pct:10,from:"2026-12-14",to:"2026-12-20",
 ids:[48, 49, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 92, 94, 97, 98, 99, 101, 106, 107, 108, 110, 111, 189, 190, 363]},
{code:"JAGOAN10",name:"Jagoan Cilik 7+",tag:"Bacaan untuk anak yang sudah lancar membaca",pct:10,from:"2026-12-21",to:"2026-12-27",
 ids:[29, 39, 48, 49, 78, 79, 80, 81, 82, 87, 149, 150, 363, 433]},
{code:"BERKAH10",name:"Jumat Berkah: Al-Qur’an & Tauhid",tag:"Mengenal Allah dan ibadah sejak dini",pct:10,from:"2026-12-28",to:"2027-01-03",
 ids:[0, 1, 7, 16, 29, 39, 91, 95, 96, 103, 109, 118, 124, 199, 191, 364]},
{code:"TENANG12",name:"Tenang Hatiku",tag:"Mengenal dan mengelola emosi anak",pct:12,from:"2027-01-04",to:"2027-01-10",
 ids:[27, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285]},
{code:"BALITA10",name:"Balita Pintar 4–6 Tahun",tag:"Calistung, aktivitas, dan belajar seru",pct:10,from:"2027-01-11",to:"2027-01-17",
 ids:[14, 15, 27, 75, 76, 77, 86, 94, 95, 96, 105, 106, 107, 108, 164, 198, 199, 432]},
{code:"TELADAN10",name:"Kisah Teladan",tag:"Kisah nabi, sahabat, dan cerita penuh hikmah",pct:10,from:"2027-01-18",to:"2027-01-24",
 ids:[15, 149, 150, 200, 432, 433]},
{code:"GAJIAN10",name:"Spesial Gajian: Ayah Bunda",tag:"Parenting dan bacaan untuk orang tua",pct:10,from:"2027-01-25",to:"2027-01-31",
 ids:[112, 113, 114, 122]}
];
var BLN=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
function today(){return new Date(Date.now()+7*36e5).toISOString().slice(0,10)}
var H={list:PROMO,
 find:function(c){c=String(c==null?'':c).trim().toUpperCase();for(var i=0;i<PROMO.length;i++)if(PROMO[i].code===c)return PROMO[i];return null},
 state:function(p,t){t=t||today();return t<p.from?'soon':t>p.to?'ended':'live'},
 date:function(s){var a=String(s).split('-');return(+a[2])+' '+BLN[+a[1]-1]+' '+a[0]},
 has:function(p,b){return!!(p&&b&&p.ids.indexOf(b.i)>-1)},
 price:function(p,b){if(!p||!b||!b.pr)return 0;return Math.min(b.pr,Math.round(b.pr*(1-p.pct/100)/STEP)*STEP)}};
window.HQP=H})();
