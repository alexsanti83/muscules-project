/* Muscules Project · lógica de la app
   Datos: Supabase (tablas perfiles, mediciones, sesiones, series) + copia en el móvil.
   Cada cambio se guarda al momento en el móvil y se sube en cuanto hay conexión. */
(function(){
"use strict";

/* =================== PLAN =================== */
var EX = {
 press_pecho:{n:"Press de pecho en banco",k:"kg",r:[10,12],kg:12,st:2,rest:120,side:"por mano",warm:"Calentamiento: 10 reps con la mitad de peso y 1 min de descanso.",how:"Tumbado en el banco, mancuernas a la altura del pecho y codos a unos 45° del cuerpo. Empuja hasta casi juntarlas sin bloquear el codo y baja controlado."},
 remo_mancuerna:{n:"Remo a una mano en banco",k:"kg",r:[10,12],kg:14,st:2,rest:90,side:"por brazo · empieza por el izquierdo",warm:"Calentamiento: 10 por brazo con la mitad de peso.",how:"Rodilla y mano del mismo lado en el banco, espalda recta y paralela al suelo. Tira de la mancuerna hacia la cadera con el codo pegado y baja controlado. Haz los dos brazos seguidos y descansa después."},
 press_hombros:{n:"Press de hombros sentado",k:"kg",r:[10,12],kg:8,st:1,rest:90,side:"por mano",how:"Sentado con respaldo, mancuernas a la altura de los hombros y palmas al frente. Empuja hasta casi estirar los brazos sin arquear la espalda."},
 curl:{n:"Curl de bíceps",k:"kg",r:[10,12],kg:8,st:1,rest:60,side:"por mano · manda el brazo más débil",how:"Sube doblando el codo sin balancear el cuerpo y baja controlado. Las repeticiones las marca el brazo más débil: no hagas más con el otro."},
 triceps:{n:"Extensión de tríceps sobre la cabeza",k:"kg",r:[10,12],kg:10,st:2,rest:60,side:"una mancuerna",how:"Sentado, una mancuerna con las dos manos detrás de la cabeza. Baja doblando los codos y sube estirando, con los codos hacia el techo."},
 plancha:{n:"Plancha",k:"time",r:[20,40],rest:45,how:"Apoyado en antebrazos y puntas de los pies, cuerpo recto de cabeza a talones y abdomen apretado, sin hundir ni subir la cadera."},
 sentadilla:{n:"Sentadilla con mancuernas",k:"kg",r:[10,12],kg:10,st:2,rest:120,side:"por mano · la rodilla marca el límite",warm:"Calentamiento: 10 reps con la mitad de peso.",how:"Mancuernas a los lados, pies algo más anchos que los hombros. Caderas atrás y pecho erguido, solo hasta donde la rodilla no moleste. Sube empujando con los talones."},
 peso_muerto_rumano:{n:"Peso muerto rumano",k:"kg",r:[10,12],kg:12,st:2,rest:120,side:"por mano",warm:"Calentamiento: 10 reps con la mitad de peso.",how:"Rodillas un poco flexionadas y fijas. Lleva la cadera atrás bajando las mancuernas pegadas a las piernas con la espalda recta, hasta notar tirón detrás del muslo. Sube empujando la cadera."},
 zancada:{n:"Zancada atrás",k:"kg",r:[8,10],kg:0,st:2,rest:90,side:"por pierna · 0 kg = sin peso",how:"Da un paso atrás y baja doblando ambas rodillas hasta casi rozar el suelo con la de atrás. Sin peso las 2 primeras semanas. Si la rodilla molesta más de 3 sobre 10, cámbiala por más puente de glúteo."},
 talones:{n:"Elevación de talones",k:"kg",r:[12,15],kg:12,st:2,rest:60,side:"por mano",how:"Sube los talones todo lo que puedas y baja despacio, en unos 3 segundos. Apóyate en algo si hace falta."},
 elevacion_piernas:{n:"Elevación de piernas tumbado",k:"bw",unit:"reps",r:[12,15],rest:45,how:"Boca arriba, piernas estiradas. Súbelas hasta la vertical sin despegar la lumbar y baja sin tocar el suelo. Si molesta la lumbar, dobla un poco las rodillas."},
 remo_maquina:{n:"Remo en máquina (fuerza)",k:"bw",unit:"remadas",r:[12,15],rest:90,side:"resistencia alta",warm:"Calentamiento: 2 min remando suave.",how:"Empuja primero con las piernas, luego inclina el torso un poco atrás y al final tira del mango hacia el abdomen. Para volver: brazos, torso y por último rodillas."},
 pajaro:{n:"Pájaro (elevación posterior)",k:"kg",r:[12,15],kg:3,st:1,rest:60,side:"por mano",how:"Inclinado hacia delante con la espalda recta y los brazos casi estirados. Sube las mancuernas hacia los lados apretando los omóplatos."},
 laterales:{n:"Elevaciones laterales",k:"kg",r:[12,15],kg:4,st:1,rest:60,side:"por mano",how:"De pie, sube los brazos hacia los lados hasta la altura de los hombros, sin balancear el cuerpo, y baja despacio."},
 curl_martillo:{n:"Curl martillo",k:"kg",r:[10,12],kg:8,st:1,rest:60,side:"por mano",how:"Como el curl normal, pero con las palmas mirando hacia el cuerpo durante todo el movimiento."},
 crunch:{n:"Crunch en banco",k:"bw",unit:"reps",r:[12,15],rest:45,how:"Manos detrás de la cabeza sin tirar del cuello. Sube el torso contrayendo el abdomen y baja controlado."},
 sentadilla_copa:{n:"Sentadilla copa",k:"kg",r:[10,12],kg:14,st:2,rest:120,side:"una mancuerna",warm:"Calentamiento: 10 reps con la mitad de peso.",how:"Sujeta una mancuerna en vertical contra el pecho con las dos manos. Baja con el pecho erguido y los codos por dentro de las rodillas, solo hasta donde la rodilla no moleste."},
 puente_gluteo:{n:"Puente de glúteo",k:"kg",r:[12,15],kg:10,st:2,rest:90,side:"sobre la cadera",how:"Boca arriba, rodillas dobladas y pies cerca del glúteo. Sube la cadera apretando el glúteo hasta la línea rodillas–hombros, aguanta 1 segundo y baja."},
 plancha_lateral:{n:"Plancha lateral",k:"time",r:[20,30],rest:45,side:"por lado",how:"De lado, apoyado en un antebrazo y el canto del pie, con el cuerpo recto. Si cuesta, apoya la rodilla de abajo."}
};
var SESS = {
 TA:{n:"Torso A",ab:"TA",ex:["press_pecho","remo_mancuerna","press_hombros","curl","triceps","plancha"],warm:"5–10 min de bici suave.",end:"Al terminar: 10–15 min de bici suave."},
 PA:{n:"Pierna A",ab:"PA",ex:["sentadilla","peso_muerto_rumano","zancada","talones","elevacion_piernas"],warm:"5–10 min de bici suave + 10 sentadillas sin peso."},
 TB:{n:"Torso B",ab:"TB",ex:["remo_maquina","press_pecho","pajaro","laterales","curl_martillo","crunch"],warm:"5–10 min de bici suave.",end:"Al terminar: 10–15 min de bici suave."},
 PB:{n:"Pierna B",ab:"PB",ex:["sentadilla_copa","puente_gluteo","peso_muerto_rumano","talones","plancha_lateral"],warm:"5–10 min de bici suave + 10 puentes de glúteo sin peso."}
};
var DEFAULT_BY_DOW = {1:"TA",2:"PA",4:"TB",5:"PB"};
var DOW = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
var DOW_S = ["D","L","M","X","J","V","S"];
var MON = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];

/* =================== UTILIDADES =================== */
function pad(n){return (n<10?"0":"")+n}
function iso(d){return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())}
function parse(s){var p=s.split("-");return new Date(+p[0],+p[1]-1,+p[2],12)}
function addDays(s,n){var d=parse(s);d.setDate(d.getDate()+n);return iso(d)}
function today(){return iso(new Date())}
function daysBetween(a,b){return Math.round((parse(b)-parse(a))/86400000)}
function nice(s){var d=parse(s);return d.getDate()+" "+MON[d.getMonth()]}
function hhmm(ms){var d=new Date(ms);return pad(d.getHours())+":"+pad(d.getMinutes())}
function fmt(n,dec){if(n==null||isNaN(n))return "–";var o=dec==null?{maximumFractionDigits:1}:{minimumFractionDigits:dec,maximumFractionDigits:dec};return Number(n).toLocaleString("es-ES",o)}
function num(v){if(v==null||v==="")return null;var x=parseFloat(String(v).replace(",","."));return isNaN(x)?null:x}
function mmss(s){s=Math.max(0,Math.ceil(s));return Math.floor(s/60)+":"+pad(s%60)}
function esc(t){return String(t==null?"":t).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function tsIso(ms){return new Date(ms||Date.now()).toISOString()}
function tsMs(s){var t=Date.parse(s);return isNaN(t)?0:t}
function sleep(ms){return new Promise(function(r){setTimeout(r,ms)})}

/* =================== ESTADO =================== */
var S={uid:null,email:"",authReady:false,pulled:false,perfil:null,ses:{},sets:{},meds:{},override:{},
  tab:"hoy",date:today(),msg:"",loginErr:"",formErr:"",confirmDel:null,sync:"idle",lastErr:"",editPerfil:false,saveErr:false};
var Q={}; // cambios pendientes de subir: clave -> marca de tiempo
try{var t0=localStorage.getItem("muscules_tab");if(t0)S.tab=t0}catch(e){}
function lsKey(k){return "muscules_v2_"+S.uid+"_"+k}
function lsGet(k,def){try{var v=localStorage.getItem(lsKey(k));return v?JSON.parse(v):def}catch(e){return def}}
function lsSet(k,v){try{localStorage.setItem(lsKey(k),JSON.stringify(v));return true}catch(e){return false}}
function saveLocal(){if(!S.uid)return;var ok=lsSet("data",{perfil:S.perfil,ses:S.ses,sets:S.sets,meds:S.meds});ok=lsSet("queue",Q)&&ok;S.saveErr=!ok}
function loadLocal(){var d=lsGet("data",{});S.perfil=d.perfil||null;S.ses=d.ses||{};S.sets=d.sets||{};S.meds=d.meds||{};Q=lsGet("queue",{})||{};S.override=lsGet("override",{})||{}}
function touch(o){o.t=Date.now();o.sy=false;return o}
function enq(k){Q[k]=Date.now()}
function persist(now){saveLocal();paintSync();flushSoon(now?0:1200)}

/* =================== PLAN DEL USUARIO =================== */
function P(){return S.perfil}
function planStart(){return P()?P().fecha_inicio:today()}
function nWeeks(){return P()?P().semanas:15}
function weekOf(s){var d=daysBetween(planStart(),s);return d<0?0:Math.floor(d/7)+1}
function weekStart(w){return addDays(planStart(),(w-1)*7)}
function isHold(w){if(w<1)return false;var th=parse(addDays(weekStart(w),3)),m=th.getMonth(),d=th.getDate();return (m===11&&d>=21)||(m===0&&d<=6)}
function targets(){
  var p=P(),N=p.semanas,holds=0,w;for(w=1;w<=N;w++)if(isHold(w))holds++;
  var step=(p.peso_inicial-p.peso_objetivo)/Math.max(1,N-holds),t=[p.peso_inicial];
  for(w=1;w<=N;w++)t.push(t[w-1]-(isHold(w)?0:step));return t;
}
function setsFor(date){return weekOf(date)<=2?2:3}

/* =================== BASE DE DATOS (SUPABASE) =================== */
var CFG=window.MUSCULES_CONFIG||{};
var configured=!!(window.supabase&&CFG.supabaseUrl&&CFG.supabaseKey&&!/PEGA_AQUI/.test(CFG.supabaseUrl+CFG.supabaseKey));
var sb=null;
try{if(configured)sb=window.supabase.createClient(String(CFG.supabaseUrl).trim(),String(CFG.supabaseKey).trim(),{auth:{persistSession:true,autoRefreshToken:true}})}catch(e){console.warn(e);configured=false}
function isNetErr(e){return navigator.onLine===false||/fetch|load failed|network|internet/i.test((e&&(e.message||e.details))||"")}

function rowPerfil(){var p=P();return{user_id:S.uid,nombre:p.nombre,sexo:p.sexo,altura_cm:p.altura_cm,fecha_inicio:p.fecha_inicio,peso_inicial:p.peso_inicial,peso_objetivo:p.peso_objetivo,semanas:p.semanas,pesos_plan:!!p.pesos_plan,actualizado:tsIso(p.t)}}
function rowSes(d,s){return{user_id:S.uid,fecha:d,plantilla:s.plantilla,iniciada:tsIso(s.iniciada),terminada:s.terminada?tsIso(s.terminada):null,actualizado:tsIso(s.t)}}
function rowSet(k,r){var p=k.split("|");return{user_id:S.uid,fecha:p[0],ejercicio:p[1],serie:+p[2]+1,kg:r.kg,reps:r.reps==null?null:Math.round(r.reps),hecha:!!r.done,hecha_en:r.at?tsIso(r.at):null,actualizado:tsIso(r.t)}}
function rowMed(d,m){return{user_id:S.uid,fecha:d,peso_kg:m.peso,grasa_pct:m.grasa,visceral:m.visceral,musculo_pct:m.musculo,agua_pct:m.agua,cuello_cm:m.cuello,cintura_cm:m.cintura,cadera_cm:m.cadera,actualizado:tsIso(m.t)}}
function objFor(k){var p=k.split("|"),kind=p[0];if(kind==="perfil")return S.perfil;if(kind==="ses")return S.ses[p[1]];if(kind==="med")return S.meds[p[1]];if(kind==="set")return S.sets[p.slice(1).join("|")];return null}

async function up(table,rows,conflict){var r=await sb.from(table).upsert(rows,{onConflict:conflict});if(r.error)throw r.error}
var flushT=null,flushing=false,fkRetry=0;
function flushSoon(ms){clearTimeout(flushT);flushT=setTimeout(flush,ms==null?400:ms)}
async function flush(){
  if(flushing)return;
  if(!sb||!S.uid){paintSync();return}
  var keys=Object.keys(Q);if(!keys.length){S.sync="idle";paintSync();return}
  flushing=true;S.sync="saving";paintSync();
  var stamps={},perfil=[],ses=[],sets=[],meds=[],delMeds=[];
  keys.forEach(function(k){
    stamps[k]=Q[k];var p=k.split("|"),kind=p[0];
    if(kind==="perfil"){if(S.perfil)perfil.push(rowPerfil())}
    else if(kind==="ses"){if(S.ses[p[1]])ses.push(rowSes(p[1],S.ses[p[1]]))}
    else if(kind==="set"){var sk=p.slice(1).join("|");if(S.sets[sk])sets.push(rowSet(sk,S.sets[sk]))}
    else if(kind==="med"){if(S.meds[p[1]])meds.push(rowMed(p[1],S.meds[p[1]]));else delMeds.push(p[1])}
  });
  try{
    if(perfil.length)await up("perfiles",perfil,"user_id");
    if(ses.length)await up("sesiones",ses,"user_id,fecha");
    if(sets.length)await up("series",sets,"user_id,fecha,ejercicio,serie");
    if(meds.length)await up("mediciones",meds,"user_id,fecha");
    for(var i=0;i<delMeds.length;i++){var r=await sb.from("mediciones").delete().eq("fecha",delMeds[i]);if(r.error)throw r.error}
    keys.forEach(function(k){if(Q[k]===stamps[k]){delete Q[k];var o=objFor(k);if(o)o.sy=true}});
    S.sync="idle";S.lastErr="";fkRetry=0;
  }catch(e){
    console.warn("No se pudo guardar",e);
    if(e&&e.code==="23503"&&fkRetry<2){ // falta la sesión de alguna serie: se vuelve a subir
      fkRetry++;sets.forEach(function(r){if(S.ses[r.fecha])enq("ses|"+r.fecha)});flushing=false;saveLocal();flushSoon(0);return;
    }
    S.sync=isNetErr(e)?"offline":"error";S.lastErr=(e&&e.message)||"";flushSoon(15000);
  }
  flushing=false;saveLocal();paintSync();if(S.tab==="prog")scheduleRender();
  if(S.sync==="idle"&&Object.keys(Q).length)flushSoon(0);
}

async function selectAll(table,cols,orders){
  var out=[],from=0,size=1000;
  for(;;){var q=sb.from(table).select(cols);orders.forEach(function(o){q=q.order(o)});var r=await q.range(from,from+size-1);
    if(r.error)throw r.error;out=out.concat(r.data||[]);if(!r.data||r.data.length<size)break;from+=size}
  return out;
}
function mergeMap(local,rows,keyFn,toObj,qp){
  var seen={};
  rows.forEach(function(row){
    var k=keyFn(row);seen[k]=1;if(Q[qp+k])return;
    var rt=tsMs(row.actualizado),l=local[k];
    if(!l||rt>=(l.t||0)){local[k]=toObj(row);local[k].t=rt;local[k].sy=true}
    else if(!l.sy)enq(qp+k);
  });
  Object.keys(local).forEach(function(k){if(seen[k]||Q[qp+k])return;if(local[k].sy)delete local[k];else enq(qp+k)});
}
var pulling=false;
async function pull(){
  if(!sb||!S.uid||pulling)return;pulling=true;var uid=S.uid;
  try{
    var res=await Promise.all([
      sb.from("perfiles").select("*").maybeSingle(),
      selectAll("sesiones","fecha,plantilla,iniciada,terminada,actualizado",["fecha"]),
      selectAll("series","fecha,ejercicio,serie,kg,reps,hecha,hecha_en,actualizado",["fecha","ejercicio","serie"]),
      selectAll("mediciones","*",["fecha"])
    ]);
    if(uid!==S.uid){pulling=false;return}
    if(res[0].error)throw res[0].error;
    var rp=res[0].data;
    if(!Q["perfil"]){
      if(rp&&(!S.perfil||tsMs(rp.actualizado)>=(S.perfil.t||0))){S.perfil={nombre:rp.nombre,sexo:rp.sexo,altura_cm:num(rp.altura_cm),fecha_inicio:rp.fecha_inicio,peso_inicial:num(rp.peso_inicial),peso_objetivo:num(rp.peso_objetivo),semanas:rp.semanas,pesos_plan:rp.pesos_plan,t:tsMs(rp.actualizado),sy:true}}
      else if(!rp&&S.perfil){if(S.perfil.sy)S.perfil=null;else enq("perfil")}
      else if(rp&&S.perfil&&!S.perfil.sy)enq("perfil");
    }
    mergeMap(S.ses,res[1],function(r){return r.fecha},function(r){return{plantilla:r.plantilla,iniciada:tsMs(r.iniciada),terminada:r.terminada?tsMs(r.terminada):null}},"ses|");
    mergeMap(S.sets,res[2],function(r){return r.fecha+"|"+r.ejercicio+"|"+(r.serie-1)},function(r){return{kg:num(r.kg),reps:num(r.reps),done:!!r.hecha,at:r.hecha_en?tsMs(r.hecha_en):null}},"set|");
    mergeMap(S.meds,res[3],function(r){return r.fecha},function(r){return{peso:num(r.peso_kg),grasa:num(r.grasa_pct),visceral:num(r.visceral),musculo:num(r.musculo_pct),agua:num(r.agua_pct),cuello:num(r.cuello_cm),cintura:num(r.cintura_cm),cadera:num(r.cadera_cm)}},"med|");
    if(S.sync!=="saving"){S.sync="idle";S.lastErr=""}
  }catch(e){
    console.warn("No se pudieron leer los datos",e);S.sync=isNetErr(e)?"offline":"error";S.lastErr=(e&&e.message)||"";
  }
  pulling=false;S.pulled=true;saveLocal();paintSync();scheduleRender();flushSoon(0);
}

/* =================== SESIÓN DE USUARIO =================== */
function onUser(u){
  var id=u?u.id:null;S.authReady=true;
  if(id===S.uid){render();paintSync();return}
  S.uid=id;S.email=u&&u.email||"";S.msg="";S.pulled=false;S.editPerfil=false;S.date=today();
  if(id){loadLocal();render();paintSync();pull()}
  else{S.perfil=null;S.ses={};S.sets={};S.meds={};Q={};render();paintSync()}
}
async function initAuth(){
  if(!sb){S.authReady=true;render();paintSync();return}
  try{var s=await sb.auth.getSession();onUser(s.data&&s.data.session?s.data.session.user:null)}catch(e){console.warn(e);onUser(null)}
  sb.auth.onAuthStateChange(function(ev,session){var u=session?session.user:null;setTimeout(function(){onUser(u)},0)});
}
window.addEventListener("online",function(){flushSoon(0)});
document.addEventListener("visibilitychange",function(){if(document.visibilityState==="visible"&&S.uid)pull()});

function paintSync(){
  var el=document.getElementById("sync"),n=Object.keys(Q).length,t,c="sync";
  if(!configured){t="Sin configurar";c+=" bad"}
  else if(!S.uid){t=S.authReady?"Sin sesión":"Conectando…";c+=" busy"}
  else if(S.saveErr){t="Móvil sin espacio";c+=" bad"}
  else if(S.sync==="error"){t="Error al guardar";c+=" bad"}
  else if(S.sync==="offline"){t="Sin conexión"+(n?" · "+n:"");c+=" busy"}
  else if(n||S.sync==="saving"){t="Guardando…";c+=" busy"}
  else{t="Guardado";c+=" db"}
  el.className=c;el.querySelector("span").textContent=t;
}

/* =================== ENTRENAMIENTO =================== */
function sessionFor(date){var s=S.ses[date];if(s&&s.plantilla)return s.plantilla;if(S.override[date])return S.override[date];return DEFAULT_BY_DOW[parse(date).getDay()]||null}
function setKey(d,ex,i){return d+"|"+ex+"|"+i}
function getSet(d,ex,i){return S.sets[setKey(d,ex,i)]||{}}
function ensureSes(d){var s=S.ses[d];if(!s){s=S.ses[d]=touch({plantilla:sessionFor(d),iniciada:Date.now(),terminada:null});enq("ses|"+d)}return s}
function updSet(d,ex,i,patch){
  ensureSes(d);var k=setKey(d,ex,i),r=S.sets[k]||(S.sets[k]={kg:null,reps:null,done:false,at:null});
  for(var f in patch)r[f]=patch[f];touch(r);enq("set|"+k);
}
function historyFor(ex,before){
  var by={};
  Object.keys(S.sets).forEach(function(k){var p=k.split("|");if(p[1]!==ex)return;if(before&&p[0]>=before)return;var r=S.sets[k];if(!r.done)return;(by[p[0]]=by[p[0]]||[])[+p[2]]=r});
  return Object.keys(by).sort().map(function(d){return{date:d,sets:by[d].filter(Boolean)}});
}
function suggestion(ex,date){
  var E=EX[ex],h=historyFor(ex,date),last=h[h.length-1];
  if(!last){var plan=E.k==="kg"&&P()&&P().pesos_plan;return{val:plan?E.kg:null,up:false,last:null,first:E.k==="kg"&&!plan}}
  if(E.k!=="kg")return{val:null,up:false,last:last};
  var W=Math.max.apply(null,last.sets.map(function(s){return s.kg||0}));
  var atW=last.sets.filter(function(s){return (s.kg||0)===W});
  if(atW.length>=2&&atW.every(function(s){return (s.reps||0)>=E.r[1]})){
    if(ex==="zancada"&&W===0&&weekOf(date)<3)return{val:0,up:false,last:last};
    return{val:W===0?6:W+E.st,up:true,last:last};
  }
  return{val:W,up:false,last:last};
}
function lastText(ex,last){
  if(!last)return "";var E=EX[ex];
  var reps=last.sets.map(function(s){return s.reps==null?"–":fmt(s.reps)}).join(" · ");
  var w=E.k==="kg"?fmt(Math.max.apply(null,last.sets.map(function(s){return s.kg||0})))+" kg × ":"";
  return "Última ("+nice(last.date)+"): "+w+reps+(E.k==="time"?" s":"");
}
function progressOf(date){
  var ses=sessionFor(date);if(!ses)return{done:0,total:0};
  var n=setsFor(date),total=SESS[ses].ex.length*n,done=0;
  SESS[ses].ex.forEach(function(ex){for(var i=0;i<n;i++)if(getSet(date,ex,i).done)done++});
  return{done:done,total:total};
}
function exDone(date,ex){var n=setsFor(date);for(var i=0;i<n;i++)if(!getSet(date,ex,i).done)return false;return true}
function isTrained(date){if(!S.ses[date])return false;var p=progressOf(date);return p.total>0&&(p.done>=p.total/2||!!S.ses[date].terminada)}

/* =================== MEDICIONES =================== */
function navy(m){
  var p=P();if(!p||m.cuello==null||m.cintura==null)return null;var h=p.altura_cm,v;
  if(p.sexo==="mujer"){if(m.cadera==null)return null;var a=m.cintura+m.cadera-m.cuello;if(a<=0)return null;v=495/(1.29579-0.35004*Math.log10(a)+0.22100*Math.log10(h))-450}
  else{var b=m.cintura-m.cuello;if(b<=0)return null;v=495/(1.0324-0.19077*Math.log10(b)+0.15456*Math.log10(h))-450}
  return v>2&&v<70?v:null;
}
var MET=[
 {k:"peso",n:"Peso",u:"kg",dir:-1},
 {k:"imc",n:"IMC",u:"",dir:-1,f:function(m){var a=P().altura_cm/100;return m.peso!=null?m.peso/(a*a):null},goal:"Saludable: 18,5–25"},
 {k:"grasa",n:"Grasa corporal (báscula)",u:"%",dir:-1},
 {k:"naval",n:"Grasa corporal (cinta)",u:"%",dir:-1,f:navy,goal:"Fórmula de la Marina de EE. UU."},
 {k:"mgrasa",n:"Masa grasa",u:"kg",dir:-1,f:function(m){return m.peso!=null&&m.grasa!=null?m.peso*m.grasa/100:null}},
 {k:"mmagra",n:"Masa magra",u:"kg",dir:1,f:function(m){return m.peso!=null&&m.grasa!=null?m.peso*(1-m.grasa/100):null},goal:"Lo ideal es que se mantenga"},
 {k:"visceral",n:"Grasa visceral",u:"",dir:-1,goal:"Objetivo: menos de 10"},
 {k:"musculo",n:"Músculo esquelético",u:"%",dir:1},
 {k:"agua",n:"Agua corporal",u:"%",dir:1},
 {k:"cintura",n:"Cintura",u:"cm",dir:-1},
 {k:"cadera",n:"Cadera",u:"cm",dir:-1},
 {k:"cuello",n:"Cuello",u:"cm",dir:0},
 {k:"cal",n:"Cintura / altura",u:"",dir:-1,dec:2,f:function(m){return m.cintura!=null?m.cintura/P().altura_cm:null},goal:"Objetivo: menos de 0,50"},
 {k:"cca",n:"Cintura / cadera",u:"",dir:-1,dec:2,f:function(m){return m.cintura!=null&&m.cadera?m.cintura/m.cadera:null},goal:null}
];
function metSeries(M){
  return Object.keys(S.meds).sort().map(function(d){var m=S.meds[d],v=M.f?M.f(m):m[M.k];return v==null||isNaN(v)?null:{d:d,v:v}}).filter(Boolean);
}

/* =================== PINTADO =================== */
var view=document.getElementById("view"),needsRender=false;
function scheduleRender(){var a=document.activeElement;if(a&&(a.tagName==="INPUT"||a.tagName==="SELECT")&&view.contains(a)){needsRender=true;return}render()}
view.addEventListener("focusout",function(){setTimeout(function(){if(needsRender){needsRender=false;scheduleRender()}},0)});

function render(){
  var nav=document.querySelector("nav.tabs");
  if(!S.uid){nav.hidden=true;stopTimer();view.innerHTML=renderLogin();return}
  if(!S.perfil&&!S.pulled){nav.hidden=true;view.innerHTML='<p class="empty">Cargando tus datos…</p>';return}
  if(!S.perfil||S.editPerfil){nav.hidden=!S.perfil;view.innerHTML=renderPerfil();return}
  nav.hidden=false;
  document.querySelectorAll(".tab").forEach(function(b){if(b.dataset.tab===S.tab)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current")});
  if(S.tab==="peso"){view.innerHTML=renderPeso();bindChart()}
  else if(S.tab==="prog")view.innerHTML=renderProg();
  else view.innerHTML=renderHoy();
}

function renderLogin(){
  if(!configured)return '<div><div class="eyebrow">Configuración</div><h2 class="sess">Falta conectar la base de datos</h2></div><div class="card"><p class="ex-meta" style="margin:0">Edita el archivo <strong>config.js</strong> en GitHub y pega la URL y la clave publishable de tu proyecto de Supabase. Después recarga esta página.</p></div>';
  if(!S.authReady)return '<p class="empty">Conectando…</p>';
  return '<div><div class="eyebrow">Tu cuenta</div><h2 class="sess">Entrar</h2></div><form class="card form" id="lform" novalidate>'+
   '<label class="full">Email<span class="fld"><input class="txt" id="l-email" type="email" autocomplete="username" autocapitalize="off" spellcheck="false"></span></label>'+
   '<label class="full">Contraseña<span class="fld"><input class="txt" id="l-pass" type="password" autocomplete="current-password"></span></label>'+
   (S.loginErr?'<p class="full err">'+esc(S.loginErr)+'</p>':'')+
   '<div class="full btnrow"><button class="btn" type="submit" id="l-btn">Entrar</button></div></form>'+
   '<p class="ex-meta">Usa el usuario que se creó para ti en Supabase. Solo tendrás que entrar una vez en este móvil.</p>';
}

function renderPerfil(){
  var p=P()||{},isNew=!P();
  function v(x){return x==null?"":esc(fmt(x))}
  var h='<div><div class="eyebrow">'+(isNew?"Primer paso":"Tu perfil")+'</div><h2 class="sess">'+(isNew?"Tus datos de partida":"Editar perfil")+'</h2></div>';
  if(isNew)h+='<p class="ex-meta" style="margin:0">Con esto la app calcula tu objetivo semana a semana y tus indicadores. Las medidas (cintura, grasa…) se apuntan luego en la pestaña Peso.</p>';
  h+='<form class="card form" id="pform" novalidate>'+
   '<label class="full">Nombre<span class="fld"><input class="txt" id="p-nombre" autocomplete="given-name" value="'+esc(p.nombre||"")+'"></span></label>'+
   '<label>Sexo<span class="fld"><select id="p-sexo"><option value="hombre"'+(p.sexo!=="mujer"?" selected":"")+'>Hombre</option><option value="mujer"'+(p.sexo==="mujer"?" selected":"")+'>Mujer</option></select></span></label>'+
   '<label>Altura<span class="fld"><input id="p-altura" inputmode="decimal" placeholder="175" value="'+v(p.altura_cm)+'"><span>cm</span></span></label>'+
   '<label>Peso inicial<span class="fld"><input id="p-pi" inputmode="decimal" placeholder="80" value="'+v(p.peso_inicial)+'"><span>kg</span></span></label>'+
   '<label>Peso objetivo<span class="fld"><input id="p-po" inputmode="decimal" placeholder="72" value="'+v(p.peso_objetivo)+'"><span>kg</span></span></label>'+
   '<label>Inicio del plan<input type="date" id="p-ini" value="'+esc(p.fecha_inicio||today())+'"></label>'+
   '<label>Duración<span class="fld"><input id="p-sem" inputmode="numeric" placeholder="15" value="'+v(p.semanas||15)+'"><span>semanas</span></span></label>'+
   '<label class="full chk"><input type="checkbox" id="p-plan"'+(p.pesos_plan===false?"":" checked")+'> <span>Usar los pesos de partida del plan<br><small>Desmárcalo si la rutina no se calculó para ti: la primera vez eliges tú el peso de cada ejercicio y desde ahí la app te va subiendo.</small></span></label>'+
   (S.formErr?'<p class="full err">'+esc(S.formErr)+'</p>':'')+
   '<div class="full btnrow"><button class="btn" type="submit">Guardar</button>'+(isNew?'':'<button class="btn ghost" type="button" data-act="cancel-perfil">Cancelar</button>')+'</div></form>'+
   '<p class="ex-meta">Las semanas que caen en Navidad (21 dic – 6 ene) cuentan como mantenimiento: el objetivo no baja.</p>';
  return h;
}

var CHECK='<svg viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

function renderHoy(){
  var d=S.date,dow=parse(d).getDay(),wk=weekOf(d),ses=sessionFor(d),isToday=d===today(),row=S.ses[d];
  var h='<div class="daynav"><button type="button" data-act="prev" aria-label="Día anterior">‹</button><div class="dlabel"><div class="eyebrow">'+(isToday?"Hoy · ":"")+DOW[dow]+" "+nice(d)+(wk?" · Semana "+wk:"")+'</div><h2 class="sess">'+(ses?SESS[ses].n:(dow===0?"Descanso":"Cardio"))+'</h2></div><button type="button" data-act="next" aria-label="Día siguiente"'+(isToday?" disabled":"")+'>›</button></div>';
  h+='<div class="chips" role="group" aria-label="Elegir sesión">';
  Object.keys(SESS).forEach(function(k){h+='<button class="chip" type="button" data-ses="'+k+'" aria-pressed="'+(ses===k)+'">'+SESS[k].n+'</button>'});
  h+='</div>';
  if(!ses){
    h+='<div class="card rest-day">';
    if(dow===0)h+='<h3>Día de descanso</h3><p class="ex-meta">Camina tus 7–8 mil pasos y descansa. Si ayer quedó una sesión pendiente, no la recuperes hoy.</p>';
    else h+='<h3>Cardio (bici o remo)</h3><p class="ex-meta">'+(dow===6?"45–60 min suave o un paseo largo.":"40–60 min a ritmo moderado: puedes hablar pero te cuesta un poco.")+' Remo solo si la rodilla lo tolera. Suma tus 7–8 mil pasos.</p>';
    return h+'<p class="ex-meta">¿Hoy toca fuerza? Elige la sesión arriba.</p></div>';
  }
  var p=progressOf(d),n=setsFor(d),SS=SESS[ses];
  h+='<div class="bar" aria-label="Progreso de la sesión"><b style="width:'+(p.total?Math.round(p.done/p.total*100):0)+'%"></b></div>';
  h+='<div class="note"><strong>Calentamiento:</strong> '+SS.warm+(wk<=2?'<br><strong>Semanas 1–2:</strong> '+n+' series de trabajo por ejercicio.':'')+'</div>';
  SS.ex.forEach(function(ex,idx){
    var E=EX[ex],sg=suggestion(ex,d),unit=E.k==="time"?"s":(E.unit||"reps"),done=exDone(d,ex);
    h+='<section class="card'+(done?" ex-done":"")+'"><div class="ex-head"><div class="ex-n">'+(idx+1)+'</div><div class="ex-t"><h3>'+E.n+'</h3><div class="ex-meta">'+n+' × '+E.r[0]+'–'+E.r[1]+(E.k==="time"?" s":"")+' · descanso '+mmss(E.rest)+(E.side?' · '+E.side:'')+'</div></div>'+(done?'<span class="okpill">'+CHECK+'Hecho</span>':'')+'</div>';
    if(E.k==="kg"||sg.last){
      h+='<div class="sugg">';
      if(E.k==="kg"){if(sg.up)h+='<span class="pill up">Sube a '+fmt(sg.val)+' kg</span>';else if(sg.val!=null)h+='<span class="pill">Hoy: '+fmt(sg.val)+' kg</span>';else if(sg.first)h+='<span class="pill">Primera vez: elige un peso que te deje 2–3 reps en reserva</span>'}
      if(sg.last)h+='<span class="last">'+lastText(ex,sg.last)+'</span>';
      h+='</div>';
    }
    if(E.warm)h+='<div class="warm">'+E.warm+'</div>';
    h+='<div class="sets">';
    for(var i=0;i<n;i++){
      var st=getSet(d,ex,i),prev=sg.last&&sg.last.sets[i];
      var repPh=prev&&prev.reps!=null&&!sg.up?prev.reps:E.r[0];
      var kgVal=st.kg!=null?st.kg:(sg.val!=null?sg.val:null);
      h+='<div class="set'+(E.k==="kg"?"":" nokg")+(st.done?" done":"")+'"><div class="si">S'+(i+1)+'</div>';
      if(E.k==="kg")h+='<label class="fld"><input inputmode="decimal" id="kg-'+ex+'-'+i+'" data-f="kg" data-ex="'+ex+'" data-i="'+i+'" value="'+(kgVal==null?"":fmt(kgVal))+'" placeholder="kg" aria-label="Kilos serie '+(i+1)+'"><span>kg</span></label>';
      h+='<label class="fld"><input inputmode="numeric" id="rp-'+ex+'-'+i+'" data-f="reps" data-ex="'+ex+'" data-i="'+i+'" value="'+(st.reps!=null?fmt(st.reps):"")+'" placeholder="'+repPh+'" aria-label="'+unit+' serie '+(i+1)+'"><span>'+unit+'</span></label>';
      h+='<button class="ck" type="button" data-act="done" data-ex="'+ex+'" data-i="'+i+'" aria-pressed="'+(!!st.done)+'" aria-label="Serie '+(i+1)+' hecha">'+CHECK+'</button></div>';
    }
    h+='</div><details class="how"><summary>Cómo se hace</summary><p>'+E.how+'</p></details></section>';
  });
  if(SS.end)h+='<div class="note">'+SS.end+'</div>';
  if(row&&row.terminada)h+='<div class="status ok"><span class="dot"></span><div><b>Sesión terminada a las '+hhmm(row.terminada)+'</b><p>'+p.done+' de '+p.total+' series hechas. Queda guardada en tu registro.</p></div></div>';
  else if(p.done>0)h+='<div class="btnrow"><button class="btn" type="button" data-act="finish">Terminar sesión</button></div>';
  h+='<p class="ex-meta">Cada serie que marcas se guarda al momento. Usa un peso con el que podrías hacer 2–3 repeticiones más; cuando completes todas las series con el máximo, la app te propondrá subir.</p>';
  return h;
}

/* ---------- Peso ---------- */
function weeklyData(){
  var T=targets(),N=nWeeks(),by={};
  Object.keys(S.meds).forEach(function(d){var m=S.meds[d],w=weekOf(d);if(w>N)return;var b=by[w]||(by[w]={kg:[],cin:null,cd:""});if(m.peso!=null)b.kg.push(m.peso);if(m.cintura!=null&&d>=b.cd){b.cin=m.cintura;b.cd=d}});
  var out=[];
  for(var w=0;w<=N;w++){var b=by[w],avg=null;if(b&&b.kg.length)avg=b.kg.reduce(function(a,c){return a+c},0)/b.kg.length;
    if(w===0&&avg==null)avg=P().peso_inicial;out.push({w:w,avg:avg,cin:b?b.cin:null,n:b?b.kg.length:0,target:T[w]})}
  return out;
}
function statusBox(wd){
  var curW=Math.min(weekOf(today()),nWeeks()+1),done=wd.filter(function(x){return x.w<curW&&x.w>0&&x.avg!=null});
  if(curW<=4)return{c:"info",t:"Semanas 1–4: ritmo aún no fiable",p:"Al principio es normal bajar 2–3 kg de agua y glucógeno. Las reglas de ajuste se aplican desde la semana 5."};
  if(done.length<3)return{c:"info",t:"Faltan pesajes",p:"Necesito la media de al menos 3 semanas para valorar el ritmo. Pésate varias mañanas por semana."};
  var a=done[done.length-1],b=done[done.length-2],c=done[done.length-3],d1=b.avg-a.avg,d2=c.avg-b.avg;
  if(isHold(a.w))return{c:"info",t:"Semana de mantenimiento",p:"En Navidad el objetivo es no subir. Mira la media semanal, no el día."};
  if(d1>1.2&&d2>1.2)return{c:"bad",t:"Bajas demasiado rápido",p:"Más de 1,2 kg por semana dos semanas seguidas. Come 150–200 kcal más al día para no perder músculo."};
  if(d1<0.5&&d2<0.5){
    if(a.cin!=null&&c.cin!=null&&c.cin-a.cin>=0.5)return{c:"warn",t:"Peso parado, pero la cintura baja",p:"No toques nada una semana más: probablemente retienes agua en el músculo."};
    return{c:"warn",t:"Ritmo por debajo de 0,5 kg/semana",p:"Y la cintura no se mueve. Recorta 150–200 kcal al día o camina 2000 pasos más."};
  }
  return{c:"ok",t:"Vas bien",p:"Bajas entre 0,5 y 1,2 kg por semana. No cambies nada."};
}
var FIELDS=[
 {k:"peso",id:"m-peso",n:"Peso (en ayunas)",u:"kg",g:0},
 {k:"grasa",id:"m-grasa",n:"Grasa corporal",u:"%",g:1},
 {k:"visceral",id:"m-visc",n:"Grasa visceral",u:"",g:1},
 {k:"musculo",id:"m-musc",n:"Músculo esquelético",u:"%",g:1},
 {k:"agua",id:"m-agua",n:"Agua corporal",u:"%",g:1},
 {k:"cuello",id:"m-cuello",n:"Cuello",u:"cm",g:2},
 {k:"cintura",id:"m-cintura",n:"Cintura (ombligo)",u:"cm",g:2},
 {k:"cadera",id:"m-cadera",n:"Cadera",u:"cm",g:2}
];
function lastOf(k){var ds=Object.keys(S.meds).sort().reverse();for(var i=0;i<ds.length;i++)if(S.meds[ds[i]][k]!=null)return S.meds[ds[i]][k];return null}
function fieldHtml(F,m){var last=lastOf(F.k);return '<label>'+F.n+'<span class="fld"><input inputmode="decimal" id="'+F.id+'" placeholder="'+(last!=null?esc(fmt(last)):"")+'" value="'+(m[F.k]!=null?esc(fmt(m[F.k])):"")+'">'+(F.u?'<span>'+F.u+'</span>':'')+'</span></label>'}
function renderPeso(){
  var t=today(),m=S.meds[t]||{},wd=weeklyData(),curW=weekOf(t),T=targets(),N=nWeeks();
  var lastKg=lastOf("peso"),lastCin=lastOf("cintura");
  var cur=curW<=N&&wd[curW]&&wd[curW].avg!=null?wd[curW].avg:null;
  var h='<div><div class="eyebrow">Semana '+curW+(curW<=N?' · objetivo ~'+fmt(T[curW])+' kg':'')+'</div><h2 class="sess">Peso y medidas</h2></div>';
  h+='<form class="card form" id="wform" novalidate><label>Fecha<input type="date" id="m-fecha" value="'+t+'" max="'+t+'"></label>'+fieldHtml(FIELDS[0],m);
  h+='<details class="more full"'+(FIELDS.some(function(F){return F.g===1&&m[F.k]!=null})?" open":"")+'><summary>Báscula (opcional)</summary><div class="form">'+FIELDS.filter(function(F){return F.g===1}).map(function(F){return fieldHtml(F,m)}).join("")+'</div></details>';
  h+='<details class="more full"'+(FIELDS.some(function(F){return F.g===2&&m[F.k]!=null})?" open":"")+'><summary>Cinta métrica (una vez por semana)</summary><div class="form">'+FIELDS.filter(function(F){return F.g===2}).map(function(F){return fieldHtml(F,m)}).join("")+'</div></details>';
  h+=(S.formErr?'<p class="full err">'+esc(S.formErr)+'</p>':'')+'<div class="full btnrow"><button class="btn" type="submit">Guardar medición</button></div></form>';
  h+='<div class="stats"><div class="stat"><div class="v">'+(cur!=null?fmt(cur):"–")+'</div><div class="l">Media esta semana</div></div><div class="stat"><div class="v">'+(lastKg!=null?fmt(P().peso_inicial-lastKg):"–")+'</div><div class="l">kg perdidos</div></div><div class="stat"><div class="v">'+(lastCin!=null?fmt(lastCin):"–")+'</div><div class="l">Cintura (cm)</div></div></div>';
  var sb_=statusBox(wd);
  h+='<div class="status '+sb_.c+'"><span class="dot"></span><div><b>'+sb_.t+'</b><p>'+sb_.p+'</p></div></div>';
  h+='<div class="card"><div class="eyebrow">Media semanal frente al objetivo</div><div class="chartbox" id="chart">'+chartSvg(wd)+'<div class="tip" id="tip" hidden></div></div>';
  h+='<div class="legend"><span><i style="width:16px;border-top:2px dashed var(--muted)"></i>Objetivo</span><span><i style="width:16px;border-top:2px solid var(--plate)"></i>Media semanal</span><span><i style="width:7px;height:7px;border-radius:50%;background:var(--muted);opacity:.6"></i>Pesajes</span><span><i style="width:12px;height:10px;background:var(--plate-soft)"></i>Navidad</span></div></div>';
  h+='<h3 class="sec">Indicadores</h3>'+renderIndicators();
  h+='<h3 class="sec">Semana a semana</h3><div class="tblwrap card" style="padding:4px 10px"><table><thead><tr><th>Sem.</th><th>Desde</th><th>Objetivo</th><th>Media</th><th>Dif.</th><th>Cintura</th></tr></thead><tbody>';
  wd.forEach(function(x){
    var dif=x.avg!=null&&x.w>0?x.avg-x.target:null;
    h+='<tr'+(x.w===curW?' class="now"':'')+'><td class="num">'+x.w+'</td><td>'+(x.w===0?"Inicio":nice(weekStart(x.w))+(isHold(x.w)?" ★":""))+'</td><td class="num">'+fmt(x.target)+'</td><td class="num">'+(x.avg!=null&&(x.w>0||x.n)?fmt(x.avg):"")+'</td><td class="num '+(dif==null?"":dif<=0.3?"d-good":"d-bad")+'">'+(dif!=null?(dif>0?"+":"")+fmt(dif):"")+'</td><td class="num">'+(x.cin!=null?fmt(x.cin):"")+'</td></tr>';
  });
  h+='</tbody></table></div><p class="ex-meta" style="margin:0">★ Semana de Navidad: se mantiene el peso.</p>';
  var ds=Object.keys(S.meds).sort().reverse();
  h+='<h3 class="sec">Registro de mediciones</h3><div class="card entries" style="padding:2px 14px">';
  if(!ds.length)h+='<p class="empty">Aún no hay mediciones. Pésate por la mañana en ayunas, después de ir al baño, y apúntalo arriba.</p>';
  ds.slice(0,60).forEach(function(d){
    var x=S.meds[d],extra=[];
    if(x.grasa!=null)extra.push("grasa "+fmt(x.grasa)+" %");if(x.cintura!=null)extra.push("cintura "+fmt(x.cintura));if(x.cadera!=null)extra.push("cadera "+fmt(x.cadera));if(x.cuello!=null)extra.push("cuello "+fmt(x.cuello));
    h+='<div class="entry"><div class="ed">'+DOW[parse(d).getDay()]+' '+nice(d)+(extra.length?'<br><small>'+extra.join(" · ")+'</small>':'')+'</div><div class="ek">'+(x.peso!=null?fmt(x.peso)+' kg':'')+'</div><button type="button" data-act="editmed" data-d="'+d+'">Editar</button><button type="button" data-act="del" data-d="'+d+'" class="'+(S.confirmDel===d?"confirm":"")+'">'+(S.confirmDel===d?"¿Borrar?":"Borrar")+'</button></div>';
  });
  return h+'</div>';
}
function renderIndicators(){
  var rows="";
  MET.forEach(function(M){
    var s=metSeries(M);if(!s.length)return;
    var last=s[s.length-1],first=s[0],dlt=last.v-first.v,dec=M.dec==null?1:M.dec;
    var cls=M.dir===0||Math.abs(dlt)<Math.pow(10,-dec)?"neu":((dlt<0)===(M.dir<0)?"good":"bad");
    var goal=M.k==="cca"?(P().sexo==="mujer"?"Objetivo: menos de 0,85":"Objetivo: menos de 0,90"):M.goal;
    rows+='<div class="prow"><div style="min-width:0"><h4>'+M.n+'</h4><div class="pm"><span class="mv">'+fmt(last.v,M.dec)+(M.u?" "+M.u:"")+'</span>'+(s.length>1?' <span class="delta '+cls+'">'+(dlt>0?"+":"")+fmt(dlt,M.dec)+(M.u?" "+M.u:"")+' desde '+nice(first.d)+'</span>':'')+'</div>'+(goal?'<div class="pm">'+goal+'</div>':'')+'</div>'+(s.length>1?spark(s.slice(-16).map(function(x){return x.v})):'<span></span>')+'</div>';
  });
  if(!rows)return '<div class="card"><p class="empty" style="margin:0">Apunta tu peso, los datos de la báscula y las medidas con la cinta, y aquí verás cómo evoluciona cada uno.</p></div>';
  return '<div class="card" style="gap:0;padding:4px 14px">'+rows+'</div><p class="ex-meta" style="margin:0">La masa grasa y la magra se calculan con el peso y el % de grasa de la báscula. Las cifras de la báscula sirven para ver la tendencia, no el valor exacto.</p>';
}
var CH={W:340,H:210,pl:30,pr:16,pt:10,pb:24};
function chartSvg(wd){
  var N=nWeeks(),vals=wd.map(function(x){return x.target});
  Object.keys(S.meds).forEach(function(d){if(S.meds[d].peso!=null&&weekOf(d)<=N)vals.push(S.meds[d].peso)});
  wd.forEach(function(x){if(x.avg!=null)vals.push(x.avg)});
  var lo=Math.floor(Math.min.apply(null,vals)-0.5),hi=Math.ceil(Math.max.apply(null,vals)+0.5);if((hi-lo)%2)lo--;
  var gs=(hi-lo)>16?4:2;
  function X(w){return CH.pl+w/N*(CH.W-CH.pl-CH.pr)}
  function Y(v){return CH.pt+(hi-v)/(hi-lo)*(CH.H-CH.pt-CH.pb)}
  CH.X=X;CH.Y=Y;CH.N=N;
  var s='<svg viewBox="0 0 '+CH.W+' '+CH.H+'" role="img" aria-label="Peso medio por semana frente al objetivo">',w;
  for(w=1;w<=N;w++)if(isHold(w))s+='<rect x="'+X(w-0.5)+'" y="'+CH.pt+'" width="'+(X(1)-X(0))+'" height="'+(CH.H-CH.pt-CH.pb)+'" fill="var(--plate-soft)" fill-opacity=".55"/>';
  for(var v=lo;v<=hi;v+=gs)s+='<line x1="'+CH.pl+'" x2="'+(CH.W-CH.pr)+'" y1="'+Y(v)+'" y2="'+Y(v)+'" stroke="var(--line)" stroke-width="1"/><text x="'+(CH.pl-5)+'" y="'+(Y(v)+3.5)+'" text-anchor="end">'+v+'</text>';
  var step=Math.max(1,Math.ceil(N/5));for(w=0;w<=N;w+=step)s+='<text x="'+X(w)+'" y="'+(CH.H-6)+'" text-anchor="middle">S'+w+'</text>';
  s+='<polyline fill="none" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="4 4" points="'+wd.map(function(x){return X(x.w)+","+Y(x.target)}).join(" ")+'"/>';
  Object.keys(S.meds).forEach(function(d){var e=S.meds[d];if(e.peso==null)return;var wk=weekOf(d);if(wk>N)return;var off=wk===0?0:(daysBetween(weekStart(wk),d)-3)/7;s+='<circle cx="'+X(Math.max(0,wk+off))+'" cy="'+Y(e.peso)+'" r="2.5" fill="var(--muted)" fill-opacity=".55"/>'});
  var pts=wd.filter(function(x){return x.avg!=null&&(x.w>0||x.n||true)});
  if(pts.length>1)s+='<polyline fill="none" stroke="var(--plate)" stroke-width="2" stroke-linejoin="round" points="'+pts.map(function(x){return X(x.w)+","+Y(x.avg)}).join(" ")+'"/>';
  pts.forEach(function(x,i){s+='<circle cx="'+X(x.w)+'" cy="'+Y(x.avg)+'" r="'+(i===pts.length-1?5:3.5)+'" fill="var(--plate)" stroke="var(--surface)" stroke-width="2"/>'});
  s+='<line id="xh" x1="0" x2="0" y1="'+CH.pt+'" y2="'+(CH.H-CH.pb)+'" stroke="var(--muted)" stroke-width="1" visibility="hidden"/>';
  for(w=0;w<=N;w++){var x0=Math.max(CH.pl,X(w-0.5)),x1=Math.min(CH.W-CH.pr,X(w+0.5));s+='<rect data-w="'+w+'" x="'+x0+'" y="0" width="'+(x1-x0)+'" height="'+CH.H+'" fill="transparent"/>'}
  return s+'</svg>';
}
function bindChart(){
  var box=document.getElementById("chart");if(!box)return;
  var svg=box.querySelector("svg"),tip=document.getElementById("tip"),xh=svg.querySelector("#xh"),wd=weeklyData();
  function show(w){var x=wd[w];xh.setAttribute("x1",CH.X(w));xh.setAttribute("x2",CH.X(w));xh.setAttribute("visibility","visible");
    tip.innerHTML="<b>Semana "+w+"</b><br>Objetivo "+fmt(x.target)+" kg"+(x.avg!=null&&(w>0||x.n)?"<br>Media "+fmt(x.avg)+" kg"+(x.n?" ("+x.n+" pesajes)":""):"");
    var r=svg.getBoundingClientRect(),sc=r.width/CH.W;tip.style.left=Math.min(Math.max(CH.X(w)*sc,60),r.width-60)+"px";tip.style.top=(CH.Y(x.avg!=null?x.avg:x.target)*sc-10)+"px";tip.hidden=false}
  function hide(){tip.hidden=true;xh.setAttribute("visibility","hidden")}
  function on(ev){var t=ev.target;if(t&&t.dataset&&t.dataset.w!=null)show(+t.dataset.w)}
  svg.addEventListener("pointermove",on);svg.addEventListener("pointerdown",on);svg.addEventListener("pointerleave",hide);
}

/* ---------- Progreso ---------- */
function spark(vals){
  var W=110,H=34,p=4,lo=Math.min.apply(null,vals),hi=Math.max.apply(null,vals);if(hi===lo){hi+=1;lo-=1}
  function X(i){return vals.length===1?W/2:p+i/(vals.length-1)*(W-2*p)}
  function Y(v){return p+(hi-v)/(hi-lo)*(H-2*p)}
  var pts=vals.map(function(v,i){return X(i)+","+Y(v)}).join(" ");
  var area=vals.length>1?'<polygon points="'+X(0)+','+(H-1)+' '+pts+' '+X(vals.length-1)+','+(H-1)+'" fill="var(--plate)" fill-opacity=".12"/>':"";
  return '<svg viewBox="0 0 '+W+' '+H+'" aria-hidden="true">'+area+(vals.length>1?'<polyline points="'+pts+'" fill="none" stroke="var(--plate)" stroke-width="2" stroke-linejoin="round"/>':'')+'<circle cx="'+X(vals.length-1)+'" cy="'+Y(vals[vals.length-1])+'" r="3.5" fill="var(--plate)"/></svg>';
}
function renderProg(){
  var t=today(),wk=weekOf(t),mon=addDays(t,-((parse(t).getDay()+6)%7)),count=0,i;
  var h='<div><div class="eyebrow">'+esc(P().nombre)+(wk?" · Semana "+wk:" · empieza el "+nice(planStart()))+'</div><h2 class="sess">Progreso</h2></div><div class="week">';
  for(i=0;i<7;i++){var d=addDays(mon,i),dn=parse(d).getDay(),tr=isTrained(d);if(tr)count++;
    var lab=S.ses[d]?SESS[S.ses[d].plantilla].ab:(DEFAULT_BY_DOW[dn]||(dn===0?"–":"C"));
    h+='<div class="wd'+(tr?" done":"")+(d===t?" today":"")+'">'+DOW_S[dn]+'<b>'+lab+'</b></div>'}
  h+='</div><div class="note"><strong>'+count+' de 4</strong> sesiones de fuerza esta semana.</div>';
  // registro de sesiones
  var sd=Object.keys(S.ses).sort().reverse();
  h+='<h3 class="sec">Registro de sesiones</h3><div class="card" style="gap:0;padding:2px 14px">';
  if(!sd.length)h+='<p class="empty" style="padding:10px 0">Cuando marques tu primera serie, la sesión aparecerá aquí.</p>';
  sd.slice(0,40).forEach(function(d){
    var s=S.ses[d],p=progressOf(d),SS=SESS[s.plantilla],tops=[];
    SS.ex.forEach(function(ex){if(EX[ex].k!=="kg")return;var best=null;for(var j=0;j<10;j++){var r=S.sets[setKey(d,ex,j)];if(r&&r.done&&r.kg!=null)best=Math.max(best||0,r.kg)}if(best!=null)tops.push(EX[ex].n.split(" (")[0]+" "+fmt(best))});
    h+='<button type="button" class="logrow" data-act="goto" data-d="'+d+'"><span class="lr-main"><b>'+DOW[parse(d).getDay()]+' '+nice(d)+' · '+SS.n+'</b><small>'+p.done+'/'+p.total+' series · '+(s.terminada?'terminada '+hhmm(s.terminada):'sin terminar')+'</small>'+(tops.length?'<small class="lr-tops">'+esc(tops.join(" · "))+'</small>':'')+'</span><span class="lr-st '+(s.terminada?"ok":"open")+'">'+(s.terminada?CHECK:"")+'</span></button>';
  });
  h+='</div>';
  // ejercicios
  var all=[];Object.keys(SESS).forEach(function(k){SESS[k].ex.forEach(function(e){if(all.indexOf(e)<0)all.push(e)})});
  h+='<h3 class="sec">Ejercicios</h3><div class="card" style="gap:0;padding:4px 14px">';var any=false;
  all.forEach(function(ex){
    var E=EX[ex],hist=historyFor(ex,null);if(!hist.length)return;any=true;
    var vals=hist.map(function(x){return Math.max.apply(null,x.sets.map(function(s){return E.k==="kg"?(s.kg||0):(s.reps||0)}))});
    var sg=suggestion(ex,addDays(t,1)),best=Math.max.apply(null,vals),u=E.k==="kg"?" kg":(E.k==="time"?" s":" "+(E.unit||"reps"));
    h+='<div class="prow"><div style="min-width:0"><h4>'+E.n+'</h4><div class="pm">'+lastText(ex,hist[hist.length-1])+'</div><div class="pm">Mejor: '+fmt(best)+u+(sg.up?' · <span class="pill up">Sube a '+fmt(sg.val)+' kg</span>':'')+'</div></div>'+spark(vals.slice(-12))+'</div>';
  });
  if(!any)h+='<p class="empty" style="padding:10px 0">Cuando completes series en la pestaña Hoy, aquí verás cómo sube cada ejercicio y cuándo toca aumentar el peso.</p>';
  h+='</div>';
  // cuenta
  var n=Object.keys(Q).length,lb=0;try{lb=+localStorage.getItem(lsKey("backup"))||0}catch(e){}
  h+='<h3 class="sec">Cuenta</h3><div class="card"><p class="ex-meta" style="margin:0"><strong>'+esc(P().nombre)+'</strong>'+(S.email?' · '+esc(S.email):'')+'</p><p class="ex-meta" style="margin:0">Tus datos se guardan en tu base de datos de Supabase y una copia en este móvil. Sin cobertura, cada serie queda guardada aquí y se sube sola al volver la conexión.</p>'+
   (n?'<p class="ex-meta" style="margin:0"><strong>'+n+'</strong> cambio'+(n===1?'':'s')+' pendiente'+(n===1?'':'s')+' de subir.</p>':'')+
   (S.lastErr&&S.sync==="error"?'<p class="err" style="margin:0">Error: '+esc(S.lastErr)+'</p>':'')+
   '<p class="ex-meta" style="margin:0">Copia extra en Archivos (opcional). Última: <strong>'+(lb?nice(iso(new Date(lb))):"nunca")+'</strong></p>'+(S.msg?'<div class="note">'+esc(S.msg)+'</div>':'')+
   '<div class="btnrow"><button class="btn ghost" type="button" data-act="edit-perfil">Editar perfil</button><button class="btn ghost" type="button" data-act="export">Exportar copia</button><label class="btn ghost" for="imp">Importar copia</label><input class="vh" type="file" id="imp" accept=".json,application/json"><button class="btn ghost" type="button" data-act="logout">Cerrar sesión</button></div></div>';
  return h;
}

/* =================== TEMPORIZADOR DE DESCANSO =================== */
var T={end:0,total:0,iv:null,fired:false},audio=null,wake=null;
var tEl=document.getElementById("timer"),tfg=document.getElementById("tfg"),tleft=document.getElementById("tleft");
function unlockAudio(){try{if(!audio){var AC=window.AudioContext||window.webkitAudioContext;if(AC)audio=new AC()}if(audio&&audio.state==="suspended")audio.resume()}catch(e){}}
function beep(){if(!audio)return;try{[0,0.25,0.5].forEach(function(o){var os=audio.createOscillator(),g=audio.createGain();os.frequency.value=880;os.connect(g);g.connect(audio.destination);var t0=audio.currentTime+o;g.gain.setValueAtTime(0.0001,t0);g.gain.exponentialRampToValueAtTime(0.3,t0+0.02);g.gain.exponentialRampToValueAtTime(0.0001,t0+0.18);os.start(t0);os.stop(t0+0.2)})}catch(e){}}
function keepAwake(){try{if(navigator.wakeLock&&!wake)navigator.wakeLock.request("screen").then(function(l){wake=l;l.addEventListener("release",function(){wake=null})}).catch(function(){})}catch(e){}}
function startTimer(sec,next){T.total=sec;T.end=Date.now()+sec*1000;T.fired=false;document.getElementById("ttitle").textContent="Descanso";document.getElementById("tnext").textContent=next||"";tEl.classList.remove("end");tEl.hidden=false;tick();clearInterval(T.iv);T.iv=setInterval(tick,250)}
function tick(){var left=(T.end-Date.now())/1000;
  if(left<=0){tleft.textContent="0:00";tfg.setAttribute("stroke-dashoffset","144.5");if(!T.fired){T.fired=true;beep();if(navigator.vibrate)try{navigator.vibrate(300)}catch(e){}tEl.classList.add("end");document.getElementById("ttitle").textContent="¡A por la siguiente!";setTimeout(function(){if(T.fired)stopTimer()},6000)}return}
  tleft.textContent=mmss(left);tfg.setAttribute("stroke-dashoffset",String(144.5*(1-left/T.total)))}
function stopTimer(){clearInterval(T.iv);tEl.hidden=true;T.fired=false}
tEl.addEventListener("click",function(ev){var b=ev.target.closest("button");if(!b)return;
  if(b.dataset.t==="add"){if(T.fired){T.end=Date.now()+15000;T.total=15;T.fired=false;tEl.classList.remove("end");clearInterval(T.iv);T.iv=setInterval(tick,250)}else{T.end+=15000;T.total+=15}tick()}else stopTimer()});
document.addEventListener("visibilitychange",function(){if(document.visibilityState==="visible"&&!tEl.hidden)keepAwake()});
function nextLabel(date,ex,i){var ses=SESS[sessionFor(date)],n=setsFor(date);if(i+1<n)return "Siguiente: serie "+(i+2)+" de "+EX[ex].n.toLowerCase();var k=ses.ex.indexOf(ex);return k+1<ses.ex.length?"Siguiente: "+EX[ses.ex[k+1]].n:""}

/* =================== COPIA DE SEGURIDAD =================== */
async function exportBackup(){
  var data={app:"muscules",version:2,exportedAt:new Date().toISOString(),perfil:S.perfil,ses:S.ses,sets:S.sets,meds:S.meds};
  var name="muscules-"+(P()?P().nombre.toLowerCase().replace(/[^a-z0-9]+/g,"-"):"copia")+"-"+today()+".json";
  var blob=new Blob([JSON.stringify(data)],{type:"application/json"}),file=null;
  try{file=new File([blob],name,{type:"application/json"})}catch(e){}
  if(file&&navigator.canShare&&navigator.share){try{if(navigator.canShare({files:[file]})){await navigator.share({files:[file],title:"Copia Muscules Project"});markBackup();return}}catch(e){if(e&&e.name==="AbortError")return}}
  var a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},2000);markBackup();
}
function markBackup(){try{localStorage.setItem(lsKey("backup"),String(Date.now()))}catch(e){}S.msg="Copia exportada.";render()}
var DAY_RE=/^\d{4}-\d{2}-\d{2}$/;
function importBackup(f){
  var r=new FileReader();
  r.onload=function(){
    var d=null;try{d=JSON.parse(r.result)}catch(e){}
    if(!d||d.app!=="muscules"||d.version!==2||typeof d.ses!=="object"||typeof d.sets!=="object"||typeof d.meds!=="object"){S.msg="Ese archivo no es una copia válida de Muscules Project.";render();return}
    var c=0;
    function mergeIn(local,remote,qp,valid){Object.keys(remote||{}).forEach(function(k){var b=remote[k],a=local[k];if(!valid(k,b))return;if(!a||(b.t||0)>(a.t||0)){b.sy=false;local[k]=b;enq(qp+k);c++}})}
    mergeIn(S.ses,d.ses,"ses|",function(k,b){return DAY_RE.test(k)&&b&&SESS[b.plantilla]});
    mergeIn(S.meds,d.meds,"med|",function(k,b){return DAY_RE.test(k)&&b&&typeof b==="object"});
    mergeIn(S.sets,d.sets,"set|",function(k,b){var p=k.split("|");return p.length===3&&DAY_RE.test(p[0])&&EX[p[1]]&&b&&typeof b==="object"});
    Object.keys(S.sets).forEach(function(k){var dd=k.split("|")[0];if(!S.ses[dd]){S.ses[dd]=touch({plantilla:DEFAULT_BY_DOW[parse(dd).getDay()]||"TA",iniciada:Date.now(),terminada:null});enq("ses|"+dd)}});
    persist(true);S.msg="Copia importada: "+c+" registros recuperados.";render();
  };
  r.onerror=function(){S.msg="No se pudo leer el archivo.";render()};
  r.readAsText(f);
}

/* =================== EVENTOS =================== */
document.querySelector(".tabs").addEventListener("click",function(ev){var b=ev.target.closest(".tab");if(!b)return;S.tab=b.dataset.tab;S.confirmDel=null;S.msg="";S.formErr="";try{localStorage.setItem("muscules_tab",S.tab)}catch(e){}render();window.scrollTo(0,0)});
document.getElementById("sync").addEventListener("click",function(){if(!S.perfil)return;S.tab="prog";S.msg="";render();window.scrollTo(0,document.body.scrollHeight)});

view.addEventListener("click",function(ev){
  var b=ev.target.closest("button");if(!b)return;var act=b.dataset.act;
  if(b.dataset.ses){
    var k=b.dataset.ses,s=S.ses[S.date];
    if(s){s.plantilla=k;touch(s);enq("ses|"+S.date);persist(true)}
    else{S.override[S.date]=k;lsSet("override",S.override)}
    render();return;
  }
  if(act==="prev"){S.date=addDays(S.date,-1);stopTimer();render();return}
  if(act==="next"){if(S.date<today())S.date=addDays(S.date,1);stopTimer();render();return}
  if(act==="done"){
    unlockAudio();
    var ex=b.dataset.ex,i=+b.dataset.i,E=EX[ex],st=getSet(S.date,ex,i);
    var row=b.closest(".set"),kgIn=row.querySelector('[data-f="kg"]'),rpIn=row.querySelector('[data-f="reps"]');
    if(!st.done){
      var kv=kgIn?num(kgIn.value):null,rv=num(rpIn.value);if(rv==null)rv=num(rpIn.placeholder);
      updSet(S.date,ex,i,{kg:kgIn?(kv!=null?kv:0):null,reps:rv,done:true,at:Date.now()});
      keepAwake();var p=progressOf(S.date),ses=S.ses[S.date];
      if(p.done>=p.total&&!ses.terminada){ses.terminada=Date.now();touch(ses);enq("ses|"+S.date)}
      persist(true);var nl=nextLabel(S.date,ex,i);render();
      if(p.done<p.total)startTimer(E.rest,nl);else stopTimer();
    }else{updSet(S.date,ex,i,{done:false,at:null});persist(true);render()}
    return;
  }
  if(act==="finish"){var s2=ensureSes(S.date);s2.terminada=Date.now();touch(s2);enq("ses|"+S.date);persist(true);stopTimer();render();return}
  if(act==="goto"){S.date=b.dataset.d;S.tab="hoy";try{localStorage.setItem("muscules_tab","hoy")}catch(e){}render();window.scrollTo(0,0);return}
  if(act==="editmed"){var inp=document.getElementById("m-fecha");inp.value=b.dataset.d;fillMedForm(b.dataset.d);window.scrollTo(0,0);return}
  if(act==="del"){var d=b.dataset.d;if(S.confirmDel===d){delete S.meds[d];S.confirmDel=null;enq("med|"+d);persist(true)}else S.confirmDel=d;render();return}
  if(act==="export"){exportBackup();return}
  if(act==="edit-perfil"){S.editPerfil=true;S.formErr="";render();window.scrollTo(0,0);return}
  if(act==="cancel-perfil"){S.editPerfil=false;S.formErr="";render();return}
  if(act==="logout"){
    if(Object.keys(Q).length){S.msg="Hay cambios sin subir. Conéctate a internet y espera a que arriba ponga «Guardado» antes de cerrar sesión.";render();return}
    stopTimer();sb.auth.signOut().catch(function(){}).then(function(){onUser(null)});return;
  }
});
// Lo que se escribe en kg/reps se guarda en el móvil al momento y se sube poco después.
view.addEventListener("input",function(ev){
  var el=ev.target;if(!el.dataset||!el.dataset.f)return;
  var v=num(el.value),patch={};patch[el.dataset.f]=v;updSet(S.date,el.dataset.ex,+el.dataset.i,patch);persist(false);
});
function fillMedForm(d){var m=S.meds[d]||{};FIELDS.forEach(function(F){var e=document.getElementById(F.id);if(e)e.value=m[F.k]!=null?fmt(m[F.k]):""});
  document.querySelectorAll("details.more").forEach(function(x,i){if(FIELDS.some(function(F){return F.g===i+1&&m[F.k]!=null}))x.open=true})}
view.addEventListener("change",function(ev){
  var el=ev.target;
  if(el.id==="imp"&&el.files&&el.files[0]){importBackup(el.files[0]);el.value="";return}
  if(el.id==="m-fecha"){fillMedForm(el.value);return}
});
var RANGES={peso:[30,300],grasa:[2,70],visceral:[1,60],musculo:[10,80],agua:[20,80],cuello:[20,70],cintura:[40,200],cadera:[50,200]};
view.addEventListener("submit",function(ev){
  var f=ev.target;ev.preventDefault();
  if(f.id==="lform"){
    var em=document.getElementById("l-email").value.trim(),pw=document.getElementById("l-pass").value,btn=document.getElementById("l-btn");
    if(!em||!pw){S.loginErr="Escribe tu email y tu contraseña.";render();return}
    btn.disabled=true;btn.textContent="Entrando…";S.loginErr="";
    sb.auth.signInWithPassword({email:em,password:pw}).then(function(r){
      if(r.error){S.loginErr=/invalid/i.test(r.error.message)?"Email o contraseña incorrectos.":(isNetErr(r.error)?"Sin conexión. Prueba de nuevo.":"No se pudo entrar: "+r.error.message);render()}
    }).catch(function(e){S.loginErr="No se pudo entrar: "+((e&&e.message)||"error desconocido");render()});
    return;
  }
  if(f.id==="pform"){
    var p={nombre:document.getElementById("p-nombre").value.trim(),sexo:document.getElementById("p-sexo").value,altura_cm:num(document.getElementById("p-altura").value),
      peso_inicial:num(document.getElementById("p-pi").value),peso_objetivo:num(document.getElementById("p-po").value),fecha_inicio:document.getElementById("p-ini").value,
      semanas:Math.round(num(document.getElementById("p-sem").value)||0),pesos_plan:document.getElementById("p-plan").checked};
    var err=!p.nombre?"Escribe tu nombre.":(p.altura_cm==null||p.altura_cm<100||p.altura_cm>250)?"La altura va en centímetros, entre 100 y 250.":
      (p.peso_inicial==null||p.peso_inicial<30||p.peso_inicial>300)?"Revisa el peso inicial (en kg).":(p.peso_objetivo==null||p.peso_objetivo<30||p.peso_objetivo>300)?"Revisa el peso objetivo (en kg).":
      !DAY_RE.test(p.fecha_inicio)?"Elige la fecha de inicio del plan.":(p.semanas<4||p.semanas>104)?"La duración va de 4 a 104 semanas.":"";
    if(err){S.formErr=err;render();return}
    S.formErr="";S.perfil=touch(p);enq("perfil");S.editPerfil=false;persist(true);render();window.scrollTo(0,0);return;
  }
  if(f.id==="wform"){
    var d=document.getElementById("m-fecha").value||today(),m={},any=false,bad="";
    FIELDS.forEach(function(F){var v=num(document.getElementById(F.id).value);if(v!=null){var R=RANGES[F.k];if(v<R[0]||v>R[1])bad=bad||F.n+" fuera de rango ("+R[0]+"–"+R[1]+(F.u?" "+F.u:"")+").";any=true}m[F.k]=v});
    if(bad){S.formErr=bad;render();return}
    if(!any){S.formErr="Apunta al menos un dato.";render();return}
    if(d>today()){S.formErr="La fecha no puede ser futura.";render();return}
    S.formErr="";S.meds[d]=touch(m);enq("med|"+d);persist(true);var a=document.activeElement;if(a)a.blur();needsRender=false;render();
  }
});

/* cambio de día con la app abierta */
var lastToday=today();
setInterval(function(){var t=today();if(t!==lastToday){if(S.date===lastToday)S.date=t;lastToday=t;scheduleRender()}},60000);

paintSync();render();initAuth();
})();
