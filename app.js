/* Muscules Project · lógica de la app
   Datos: Supabase (tablas perfiles, mediciones, sesiones, series) + copia en el móvil.
   Cada cambio se guarda al momento en el móvil y se sube en cuanto hay conexión. */
(function(){
"use strict";

/* =================== CATÁLOGO DE EJERCICIOS ===================
   k: "kg" (mancuernas), "band" (goma), "bw" (peso corporal, reps), "time" (segundos)  */
var CAT = {
 // --- fuerza general ---
 press_pecho:{yt:"uii5wbbN99w",n:"Press de pecho en banco",k:"kg",r:[10,12],kg:12,st:2,rest:120,side:"por mano",warm:true,how:"Tumbado en el banco, mancuernas a la altura del pecho y codos a unos 45° del cuerpo. Empuja hasta casi juntarlas sin bloquear el codo y baja controlado."},
 remo_mancuerna:{yt:"Vvnw0EYAlgc",n:"Remo a una mano en banco",k:"kg",r:[10,12],kg:14,st:2,rest:90,side:"por brazo · empieza por el más débil",warm:true,how:"Rodilla y mano del mismo lado en el banco, espalda recta y paralela al suelo. Tira de la mancuerna hacia la cadera con el codo pegado y baja controlado. Haz los dos brazos seguidos y descansa después."},
 press_hombros:{yt:"SYA1r1J49R8",n:"Press de hombros sentado",k:"kg",r:[10,12],kg:8,st:1,rest:90,side:"por mano",how:"Sentado con respaldo, mancuernas a la altura de los hombros y palmas al frente. Empuja hasta casi estirar los brazos sin arquear la espalda."},
 curl:{n:"Curl de bíceps",k:"kg",r:[10,12],kg:8,st:1,rest:60,side:"por mano · manda el brazo más débil",how:"Sube doblando el codo sin balancear el cuerpo y baja controlado. Las repeticiones las marca el brazo más débil: no hagas más con el otro."},
 triceps:{n:"Extensión de tríceps sobre la cabeza",k:"kg",r:[10,12],kg:10,st:2,rest:60,side:"una mancuerna",how:"Sentado, una mancuerna con las dos manos detrás de la cabeza. Baja doblando los codos y sube estirando, con los codos hacia el techo."},
 plancha:{n:"Plancha",k:"time",r:[20,40],rest:45,how:"Apoyado en antebrazos y puntas de los pies, cuerpo recto de cabeza a talones y abdomen apretado, sin hundir ni subir la cadera."},
 sentadilla:{n:"Sentadilla con mancuernas",k:"kg",r:[10,12],kg:10,st:2,rest:120,side:"por mano · la rodilla marca el límite",warm:true,how:"Mancuernas a los lados, pies algo más anchos que los hombros. Caderas atrás y pecho erguido, solo hasta donde la rodilla no moleste. Sube empujando con los talones."},
 peso_muerto_rumano:{yt:"9j_L1KgpK8Y",n:"Peso muerto rumano",k:"kg",r:[10,12],kg:12,st:2,rest:120,side:"por mano",warm:true,how:"Rodillas un poco flexionadas y fijas. Lleva la cadera atrás bajando las mancuernas pegadas a las piernas con la espalda recta, hasta notar tirón detrás del muslo. Sube empujando la cadera."},
 zancada:{n:"Zancada atrás",k:"kg",r:[8,10],kg:0,st:2,rest:90,side:"por pierna · 0 kg = sin peso",how:"Da un paso atrás y baja doblando ambas rodillas hasta casi rozar el suelo con la de atrás. Puedes apoyar una mano en la pared o una silla. Si la rodilla molesta más de 3 sobre 10, cámbiala por más puente de glúteo."},
 talones:{n:"Elevación de talones",k:"kg",r:[12,15],kg:12,st:2,rest:60,side:"por mano",how:"Sube los talones todo lo que puedas y baja despacio, en unos 3 segundos. Apóyate en algo si hace falta."},
 elevacion_piernas:{n:"Elevación de piernas tumbado",k:"bw",unit:"reps",r:[12,15],rest:45,how:"Boca arriba, piernas estiradas. Súbelas hasta la vertical sin despegar la lumbar y baja sin tocar el suelo. Si molesta la lumbar, dobla un poco las rodillas."},
 remo_maquina:{n:"Remo en máquina (fuerza)",k:"bw",unit:"remadas",r:[12,15],rest:90,side:"resistencia alta",how:"Empuja primero con las piernas, luego inclina el torso un poco atrás y al final tira del mango hacia el abdomen. Para volver: brazos, torso y por último rodillas."},
 pajaro:{n:"Pájaro (elevación posterior)",k:"kg",r:[12,15],kg:3,st:1,rest:60,side:"por mano",how:"Inclinado hacia delante con la espalda recta y los brazos casi estirados. Sube las mancuernas hacia los lados apretando los omóplatos."},
 laterales:{n:"Elevaciones laterales",k:"kg",r:[12,15],kg:4,st:1,rest:60,side:"por mano",how:"De pie, sube los brazos hacia los lados hasta la altura de los hombros, sin balancear el cuerpo, y baja despacio."},
 curl_martillo:{n:"Curl martillo",k:"kg",r:[10,12],kg:8,st:1,rest:60,side:"por mano",how:"Como el curl normal, pero con las palmas mirando hacia el cuerpo durante todo el movimiento."},
 crunch:{n:"Crunch en banco",k:"bw",unit:"reps",r:[12,15],rest:45,how:"Manos detrás de la cabeza sin tirar del cuello. Sube el torso contrayendo el abdomen y baja controlado. No recomendable con diástasis abdominal."},
 sentadilla_copa:{yt:"5HHITKuLxUs",n:"Sentadilla copa",k:"kg",r:[10,12],kg:14,st:2,rest:120,side:"una mancuerna",warm:true,how:"Sujeta una mancuerna en vertical contra el pecho con las dos manos. Baja con el pecho erguido y los codos por dentro de las rodillas, solo hasta donde la rodilla no moleste."},
 puente_gluteo:{yt:"bcuxKS2qRGY",n:"Puente de glúteo",k:"kg",r:[12,15],kg:10,st:2,rest:90,side:"peso sobre la cadera",how:"Boca arriba, rodillas dobladas y pies cerca del glúteo. Sube la cadera apretando el glúteo hasta la línea rodillas–hombros, aguanta 1 segundo y baja."},
 plancha_lateral:{n:"Plancha lateral",k:"time",r:[20,30],rest:45,side:"por lado",how:"De lado, apoyado en un antebrazo y el canto del pie, con el cuerpo recto. Si cuesta, apoya la rodilla de abajo."},
 // --- core seguro con diástasis, suelo pélvico y glúteo ---
 respiracion:{yt:"3WpZs-2--U4",n:"Respiración 360 y transverso",k:"bw",unit:"respiraciones",r:[6,8],rest:20,how:"Tumbada boca arriba con las rodillas dobladas. Coge aire por la nariz notando cómo se abren las costillas hacia los lados y la espalda, no solo la tripa. Al soltarlo por la boca, sube suavemente el suelo pélvico y lleva el ombligo hacia dentro, como si te abrocharas un pantalón ajustado. Usa esta misma exhalación en el esfuerzo de todos los ejercicios."},
 kegel:{yt:"gqGZQ67Doqs",n:"Suelo pélvico (Kegel)",k:"bw",unit:"contracciones",r:[8,10],rest:30,how:"Sentada o tumbada. Contrae el suelo pélvico como si cortaras el pis y lo subieras hacia dentro, sin apretar glúteos ni aguantar la respiración. Mantén 5 s y relaja otros 5 s del todo. Si cuesta, empieza con 3 s. Al final, 5 contracciones rápidas."},
 dead_bug:{yt:"HN3wyEcYC2g",n:"Dead bug (bicho muerto)",k:"bw",unit:"por lado",r:[6,10],rest:45,how:"Boca arriba, rodillas a 90° encima de la cadera y brazos hacia el techo. Soltando el aire y con el ombligo hacia dentro, baja un talón hasta rozar el suelo y vuelve; alterna. La zona lumbar no se despega. Más fácil: desliza el talón por el suelo con el otro pie apoyado."},
 deslizamiento_talon:{yt:"Nquw88U8OD4",n:"Deslizamiento de talón",k:"bw",unit:"por lado",r:[8,10],rest:30,how:"Boca arriba, rodillas dobladas. Soltando el aire y activando el transverso, desliza un talón por el suelo hasta estirar la pierna y vuelve, sin que se mueva la pelvis ni se abombe la tripa. Alterna."},
 bird_dog:{yt:"je3s-x58Fuc",n:"Bird dog (cuadrupedia)",k:"bw",unit:"por lado",r:[6,8],rest:45,how:"A cuatro patas, manos bajo los hombros y rodillas bajo la cadera. Estira a la vez un brazo y la pierna contraria sin girar la cadera, aguanta 2 s y vuelve. La tripa no cae hacia el suelo."},
 pallof:{yt:"paOG670vr9c",n:"Pallof press con goma",k:"band",unit:"por lado",r:[8,10],rest:45,how:"Goma atada a un punto fijo a la altura del pecho, de lado a ella. Con la goma en las manos junto al esternón, estira los brazos al frente sin dejar que el tronco gire, aguanta 2 s y vuelve. Trabaja el abdomen profundo sin presión hacia fuera."},
 puente_goma:{yt:"qqLmVHYibRA",n:"Puente de glúteo con goma",k:"band",r:[12,15],rest:60,side:"goma sobre las rodillas",how:"Boca arriba, rodillas dobladas y goma justo encima de las rodillas. Suelta el aire, empuja las rodillas un poco hacia fuera y sube la cadera apretando el glúteo hasta la línea rodillas–hombros. Aguanta 2 s arriba y baja despacio."},
 almeja:{yt:"oiRDE-Vu4to",n:"Almeja con goma (clamshell)",k:"band",unit:"por lado",r:[12,15],rest:45,side:"goma sobre las rodillas",how:"Tumbada de lado, caderas y rodillas dobladas y pies juntos. Abre la rodilla de arriba como una almeja sin girar la pelvis hacia atrás, aguanta 1 s y cierra despacio."},
 abduccion:{n:"Abducción tumbada de lado",k:"bw",unit:"por lado",r:[12,15],rest:45,how:"Tumbada de lado con la pierna de abajo doblada. Sube la pierna de arriba estirada y un poco hacia atrás, con la punta del pie mirando al frente, y baja despacio. Se nota en el lateral del glúteo."},
 patada_gluteo:{n:"Patada de glúteo con goma",k:"band",unit:"por lado",r:[12,15],rest:45,how:"A cuatro patas, goma alrededor de un pie y sujeta con las manos. Empuja el talón hacia el techo con la rodilla doblada, sin arquear la espalda, y baja controlado."},
 hip_thrust:{yt:"8RcEpMQ93Y8",n:"Hip thrust en banco",k:"kg",r:[12,15],kg:6,st:2,rest:75,side:"mancuerna sobre la cadera",how:"Parte alta de la espalda apoyada en el banco, pies en el suelo y mancuerna sobre la cadera (con una toalla). Suelta el aire y sube la cadera hasta quedar recta, apretando glúteo 2 s arriba. Barbilla hacia el pecho."},
 sentadilla_banco:{n:"Sentadilla a banco",k:"kg",r:[10,12],kg:4,st:1,rest:75,side:"mancuerna al pecho",how:"De espaldas al banco, mancuerna sujeta contra el pecho. Baja despacio hasta rozar el banco con el glúteo, sin dejarte caer, y sube soltando el aire. Rodillas en la línea de los pies."},
 sentadilla_sumo:{n:"Sentadilla sumo con mancuerna",k:"kg",r:[10,12],kg:6,st:2,rest:75,side:"una mancuerna",how:"Pies bastante abiertos y puntas hacia fuera, mancuerna colgando entre las piernas. Baja con el pecho erguido y las rodillas hacia fuera, y sube apretando glúteo y soltando el aire."},
 puente_una:{n:"Puente de glúteo a una pierna",k:"bw",unit:"por lado",r:[8,10],rest:45,how:"Como el puente normal pero con una pierna estirada en el aire. Sube la cadera sin que se incline hacia un lado. Si cuesta, deja el pie libre apoyado de talón."},
 face_pull:{n:"Tirón de goma a la cara",k:"band",r:[12,15],rest:45,how:"Goma atada a la altura de la cara. Tira de ella hacia la frente separando los codos hacia fuera y juntando los omóplatos. Mejora la postura y la espalda alta."},
 remo_goma:{n:"Remo sentada con goma",k:"band",r:[12,15],rest:60,how:"Sentada en el suelo con las piernas estiradas y la goma en los pies. Tira de los extremos hacia el abdomen con los codos pegados y junta los omóplatos. Espalda recta."},
 plancha_inclinada:{n:"Plancha inclinada (manos en banco)",k:"time",r:[15,30],rest:45,how:"Manos en el banco y cuerpo recto de cabeza a talones. Suelta el aire y mete el ombligo durante toda la plancha. Si la tripa hace una 'cresta' o bulto en la línea media, para: todavía no toca."}
};
var TIPOS={bici:"Bici",remo:"Remo",paseo:"Paseo",eliptica:"Elíptica",cinta:"Cinta",natacion:"Natación",otro:"Otro"};
var GOMAS=["ligera","media","fuerte","extra"],GOMA_N={ligera:"Ligera",media:"Media",fuerte:"Fuerte",extra:"Extra fuerte"};
var KINDS={kg:"Mancuernas",band:"Goma",bw:"Peso corporal",time:"Tiempo (s)"};

function exCopy(id,over){var o=JSON.parse(JSON.stringify(CAT[id]));if(over)for(var k in over)o[k]=over[k];return o}
function planHombre(){
  var ids=["press_pecho","remo_mancuerna","press_hombros","curl","triceps","plancha","sentadilla","peso_muerto_rumano","zancada","talones","elevacion_piernas","remo_maquina","pajaro","laterales","curl_martillo","crunch","sentadilla_copa","puente_gluteo","plancha_lateral"],ej={};
  ids.forEach(function(i){ej[i]=exCopy(i)});
  return {v:1,tipo:"hombre",series:3,seriesInicio:2,
    notas:"Usa un peso con el que podrías hacer 2–3 repeticiones más. Rodilla: molestia leve (hasta 3 sobre 10) que no va a más es aceptable; si es punzante o al día siguiente está peor, baja peso o recorrido.",
    ejercicios:ej,
    sesiones:{
      TA:{n:"Torso A",ab:"TA",ex:["press_pecho","remo_mancuerna","press_hombros","curl","triceps","plancha"],cal:{tipo:"bici",min:8},fin:{tipo:"bici",min:12}},
      PA:{n:"Pierna A",ab:"PA",ex:["sentadilla","peso_muerto_rumano","zancada","talones","elevacion_piernas"],cal:{tipo:"bici",min:8},fin:null},
      TB:{n:"Torso B",ab:"TB",ex:["remo_maquina","press_pecho","pajaro","laterales","curl_martillo","crunch"],cal:{tipo:"bici",min:8},fin:{tipo:"bici",min:12}},
      PB:{n:"Pierna B",ab:"PB",ex:["sentadilla_copa","puente_gluteo","peso_muerto_rumano","talones","plancha_lateral"],cal:{tipo:"bici",min:8},fin:null}},
    semana:{"1":{t:"ses",k:"TA"},"2":{t:"ses",k:"PA"},"3":{t:"cardio",tipo:"bici",min:45},"4":{t:"ses",k:"TB"},"5":{t:"ses",k:"PB"},"6":{t:"cardio",tipo:"paseo",min:50},"0":{t:"rest"}}};
}
function planMujer(){
  var ov={press_pecho:{kg:4,st:1,rest:60,warm:false},remo_mancuerna:{kg:5,st:1,rest:60,warm:false},laterales:{kg:2,st:1,rest:45},press_hombros:{kg:3,st:1,rest:60},
          peso_muerto_rumano:{kg:4,st:1,rest:75,warm:false},zancada:{kg:0,st:1,rest:60},talones:{kg:4,st:1,rest:45}};
  var ids=["respiracion","kegel","dead_bug","deslizamiento_talon","bird_dog","pallof","puente_goma","almeja","abduccion","patada_gluteo","hip_thrust","sentadilla_banco","sentadilla_sumo","puente_una","face_pull","remo_goma","plancha_inclinada","press_pecho","remo_mancuerna","laterales","press_hombros","peso_muerto_rumano","zancada","talones"],ej={};
  ids.forEach(function(i){ej[i]=exCopy(i,ov[i])});
  return {v:1,tipo:"mujer",series:3,seriesInicio:2,
    notas:"Diástasis abdominal: suelta el aire en el esfuerzo y lleva el ombligo suavemente hacia dentro, sin aguantar la respiración. Si al hacer fuerza la tripa forma una 'cresta' o bulto en la línea media, para y haz una versión más fácil. Evita abdominales clásicos (crunch, sit-up) y planchas largas por ahora. Muy recomendable una revisión con una fisioterapeuta de suelo pélvico.",
    ejercicios:ej,
    sesiones:{
      W1:{n:"Glúteo y core",ab:"GC",ex:["respiracion","puente_goma","sentadilla_banco","peso_muerto_rumano","almeja","dead_bug","kegel"],cal:{tipo:"bici",min:10},fin:{tipo:"bici",min:10}},
      W2:{n:"Espalda, brazos y core",ab:"EB",ex:["respiracion","remo_mancuerna","press_pecho","face_pull","laterales","pallof","bird_dog"],cal:{tipo:"bici",min:10},fin:{tipo:"bici",min:10}},
      W3:{n:"Glúteo y pierna",ab:"GP",ex:["respiracion","hip_thrust","zancada","patada_gluteo","abduccion","talones","deslizamiento_talon"],cal:{tipo:"bici",min:10},fin:{tipo:"bici",min:10}},
      W4:{n:"Cuerpo completo y core",ab:"CC",ex:["respiracion","sentadilla_sumo","remo_goma","puente_una","press_hombros","plancha_inclinada","kegel"],cal:{tipo:"bici",min:10},fin:{tipo:"bici",min:10}}},
    semana:{"1":{t:"ses",k:"W1"},"2":{t:"ses",k:"W2"},"3":{t:"cardio",tipo:"bici",min:40},"4":{t:"ses",k:"W3"},"5":{t:"ses",k:"W4"},"6":{t:"cardio",tipo:"bici",min:45},"0":{t:"rest"}}};
}
function defaultPlan(sexo){return sexo==="mujer"?planMujer():planHombre()}
function validPlan(p){
  try{if(!p||typeof p!=="object"||!p.ejercicios||!p.sesiones||!p.semana)return false;
    var ks=Object.keys(p.sesiones);if(!ks.length)return false;
    for(var i=0;i<ks.length;i++){var s=p.sesiones[ks[i]];if(!s||!s.n||!Array.isArray(s.ex))return false}
    return true}catch(e){return false}
}
function abOf(n){var w=String(n||"").split(/\s+/).filter(function(x){return x.length>1&&!/^(y|de|del|la|el|con)$/i.test(x)});return (w.map(function(x){return x[0]}).join("").slice(0,2)||"S").toUpperCase()}
var EX={},SESS={},DEFAULT_BY_DOW={},WEEK={},PLAN=null;
function applyPlan(){
  var pl=(S.perfil&&validPlan(S.perfil.plan))?S.perfil.plan:defaultPlan(S.perfil&&S.perfil.sexo);
  PLAN=pl;EX=pl.ejercicios;SESS={};DEFAULT_BY_DOW={};WEEK=pl.semana||{};
  Object.keys(pl.sesiones).forEach(function(k){var s=pl.sesiones[k];SESS[k]={n:s.n,ab:s.ab||abOf(s.n),ex:s.ex.filter(function(e){return EX[e]}),cal:s.cal||null,fin:s.fin||null}});
  Object.keys(WEEK).forEach(function(dw){var w=WEEK[dw];if(w&&w.t==="ses"&&SESS[w.k])DEFAULT_BY_DOW[dw]=w.k});
}
var DOW = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
var DOW_S = ["D","L","M","X","J","V","S"];
var MON = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
function sesDef(k){return SESS[k]||{n:(k==="CARDIO"?"Cardio":String(k)),ab:String(k).slice(0,2),ex:[],cal:null,fin:null}}

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
  tab:"hoy",date:today(),skip:{},guided:null,restAsk:null,confirmDelSes:null,msg:"",loginErr:"",formErr:"",confirmDel:null,sync:"idle",lastErr:"",editPerfil:false,saveErr:false};
var Q={}; // cambios pendientes de subir: clave -> marca de tiempo
try{var t0=localStorage.getItem("muscules_tab");if(t0)S.tab=t0}catch(e){}
function lsKey(k){return "muscules_v2_"+S.uid+"_"+k}
function lsGet(k,def){try{var v=localStorage.getItem(lsKey(k));return v?JSON.parse(v):def}catch(e){return def}}
function lsSet(k,v){try{localStorage.setItem(lsKey(k),JSON.stringify(v));return true}catch(e){return false}}
function saveLocal(){if(!S.uid)return;var ok=lsSet("data",{perfil:S.perfil,ses:S.ses,sets:S.sets,meds:S.meds});ok=lsSet("queue",Q)&&ok;S.saveErr=!ok}
function loadLocal(){var d=lsGet("data",{});S.perfil=d.perfil||null;S.ses=d.ses||{};S.sets=d.sets||{};S.meds=d.meds||{};Q=lsGet("queue",{})||{};S.override=lsGet("override",{})||{};S.skip=lsGet("skip",{})||{};S.guided=lsGet("guided",null);S.restAsk=null}
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
function setsFor(date){var p=PLAN||{series:3,seriesInicio:2};return weekOf(date)<=2?(p.seriesInicio||2):(p.series||3)}

/* =================== BASE DE DATOS (SUPABASE) =================== */
var CFG=window.MUSCULES_CONFIG||{};
var configured=!!(window.supabase&&CFG.supabaseUrl&&CFG.supabaseKey&&!/PEGA_AQUI/.test(CFG.supabaseUrl+CFG.supabaseKey));
var sb=null;
try{if(configured)sb=window.supabase.createClient(String(CFG.supabaseUrl).trim(),String(CFG.supabaseKey).trim(),{auth:{persistSession:true,autoRefreshToken:true}})}catch(e){console.warn(e);configured=false}
function isNetErr(e){return navigator.onLine===false||/fetch|load failed|network|internet/i.test((e&&(e.message||e.details))||"")}

function rowPerfil(){var p=P();return{user_id:S.uid,nombre:p.nombre,sexo:p.sexo,altura_cm:p.altura_cm,fecha_inicio:p.fecha_inicio,peso_inicial:p.peso_inicial,peso_objetivo:p.peso_objetivo,semanas:p.semanas,pesos_plan:!!p.pesos_plan,plan:p.plan||null,actualizado:tsIso(p.t)}}
function rowSes(d,s){return{user_id:S.uid,fecha:d,plantilla:s.plantilla,iniciada:tsIso(s.iniciada),terminada:s.terminada?tsIso(s.terminada):null,actualizado:tsIso(s.t)}}
function rowSet(k,r){var p=k.split("|");return{user_id:S.uid,fecha:p[0],ejercicio:p[1],serie:+p[2]+1,kg:r.kg,reps:r.reps==null?null:Math.round(r.reps),nota:r.nota||null,hecha:!!r.done,hecha_en:r.at?tsIso(r.at):null,actualizado:tsIso(r.t)}}
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
  var stamps={},perfil=[],ses=[],sets=[],meds=[],delMeds=[],delSes=[];
  keys.forEach(function(k){
    stamps[k]=Q[k];var p=k.split("|"),kind=p[0];
    if(kind==="perfil"){if(S.perfil)perfil.push(rowPerfil())}
    else if(kind==="ses"){if(S.ses[p[1]])ses.push(rowSes(p[1],S.ses[p[1]]));else delSes.push(p[1])}
    else if(kind==="set"){var sk=p.slice(1).join("|");if(S.sets[sk])sets.push(rowSet(sk,S.sets[sk]))}
    else if(kind==="med"){if(S.meds[p[1]])meds.push(rowMed(p[1],S.meds[p[1]]));else delMeds.push(p[1])}
  });
  try{
    if(perfil.length)await up("perfiles",perfil,"user_id");
    if(ses.length)await up("sesiones",ses,"user_id,fecha");
    if(sets.length)await up("series",sets,"user_id,fecha,ejercicio,serie");
    if(meds.length)await up("mediciones",meds,"user_id,fecha");
    for(var i=0;i<delMeds.length;i++){var r=await sb.from("mediciones").delete().eq("fecha",delMeds[i]);if(r.error)throw r.error}
    for(var j=0;j<delSes.length;j++){var r3=await sb.from("sesiones").delete().eq("fecha",delSes[j]);if(r3.error)throw r3.error}
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
      selectAll("series","fecha,ejercicio,serie,kg,reps,nota,hecha,hecha_en,actualizado",["fecha","ejercicio","serie"]),
      selectAll("mediciones","*",["fecha"])
    ]);
    if(uid!==S.uid){pulling=false;return}
    if(res[0].error)throw res[0].error;
    var rp=res[0].data;
    if(!Q["perfil"]){
      if(rp&&(!S.perfil||tsMs(rp.actualizado)>=(S.perfil.t||0))){S.perfil={nombre:rp.nombre,sexo:rp.sexo,altura_cm:num(rp.altura_cm),fecha_inicio:rp.fecha_inicio,peso_inicial:num(rp.peso_inicial),peso_objetivo:num(rp.peso_objetivo),semanas:rp.semanas,pesos_plan:rp.pesos_plan,plan:rp.plan||null,t:tsMs(rp.actualizado),sy:true}}
      else if(!rp&&S.perfil){if(S.perfil.sy)S.perfil=null;else enq("perfil")}
      else if(rp&&S.perfil&&!S.perfil.sy)enq("perfil");
    }
    mergeMap(S.ses,res[1],function(r){return r.fecha},function(r){return{plantilla:r.plantilla,iniciada:tsMs(r.iniciada),terminada:r.terminada?tsMs(r.terminada):null}},"ses|");
    mergeMap(S.sets,res[2].filter(function(r){return !(Q["ses|"+r.fecha]&&!S.ses[r.fecha])}),function(r){return r.fecha+"|"+r.ejercicio+"|"+(r.serie-1)},function(r){return{kg:num(r.kg),reps:num(r.reps),nota:r.nota||null,done:!!r.hecha,at:r.hecha_en?tsMs(r.hecha_en):null}},"set|");
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
function dayKind(d){
  var s=S.ses[d];if(s)return s.plantilla==="CARDIO"?"cardio":"ses";
  var o=S.override[d];if(o==="CARDIO")return "cardio";if(o==="REST")return "rest";if(o&&SESS[o])return "ses";
  var w=WEEK[String(parse(d).getDay())];if(!w)return "rest";
  if(w.t==="ses"&&SESS[w.k])return "ses";if(w.t==="cardio")return "cardio";return "rest";
}
function sessionFor(d){
  if(dayKind(d)!=="ses")return null;var s=S.ses[d];if(s)return s.plantilla;
  var o=S.override[d];if(o&&SESS[o])return o;return DEFAULT_BY_DOW[String(parse(d).getDay())]||null;
}
function cardioPlan(d){var w=WEEK[String(parse(d).getDay())];if(w&&w.t==="cardio")return{tipo:TIPOS[w.tipo]?w.tipo:"bici",min:w.min||40};return{tipo:"bici",min:40}}
function setKey(d,ex,i){return d+"|"+ex+"|"+i}
function getSet(d,ex,i){return S.sets[setKey(d,ex,i)]||{}}
function ensureSes(d){var s=S.ses[d];if(!s){s=S.ses[d]=touch({plantilla:dayKind(d)==="cardio"?"CARDIO":(sessionFor(d)||"CARDIO"),iniciada:Date.now(),terminada:null});enq("ses|"+d)}return s}
function updSet(d,ex,i,patch){
  ensureSes(d);var k=setKey(d,ex,i),r=S.sets[k]||(S.sets[k]={kg:null,reps:null,nota:null,done:false,at:null});
  for(var f in patch)r[f]=patch[f];touch(r);enq("set|"+k);
}
function hasStrengthDone(d){return Object.keys(S.sets).some(function(k){var p=k.split("|");return p[0]===d&&p[1]!=="cardio"&&S.sets[k].done})}
function delSession(d){
  delete S.ses[d];
  Object.keys(S.sets).forEach(function(k){if(k.indexOf(d+"|")===0)delete S.sets[k]});
  Object.keys(Q).forEach(function(k){if(k.indexOf("set|"+d+"|")===0)delete Q[k]});
  Object.keys(S.skip).forEach(function(k){if(k.indexOf(d+"|")===0)delete S.skip[k]});lsSet("skip",S.skip);
  delete S.override[d];lsSet("override",S.override);
  if(S.guided===d){S.guided=null;lsSet("guided",null)}
  if(S.date===d){S.restAsk=null;stopTimer()}
  enq("ses|"+d);persist(true);
}
function historyFor(ex,before){
  var by={};
  Object.keys(S.sets).forEach(function(k){var p=k.split("|");if(p[1]!==ex)return;if(before&&p[0]>=before)return;var r=S.sets[k];if(!r.done)return;(by[p[0]]=by[p[0]]||[])[+p[2]]=r});
  return Object.keys(by).sort().map(function(d){return{date:d,sets:by[d].filter(Boolean)}});
}
function suggestion(ex,date){
  var E=EX[ex]||{k:"bw",r:[10,12]},h=historyFor(ex,date),last=h[h.length-1];
  if(E.k==="band"){
    if(!last)return{band:"ligera",up:false,last:null};
    var b=last.sets[0].nota&&GOMA_N[last.sets[0].nota]?last.sets[0].nota:"ligera";
    var top=last.sets.length>=2&&last.sets.every(function(s){return (s.reps||0)>=E.r[1]});
    var gi=GOMAS.indexOf(b);
    if(top&&gi<GOMAS.length-1)return{band:GOMAS[gi+1],up:true,last:last};
    return{band:b,up:false,last:last};
  }
  if(!last){var plan=E.k==="kg"&&P()&&P().pesos_plan;return{val:plan?E.kg:null,up:false,last:null,first:E.k==="kg"&&!plan}}
  if(E.k!=="kg")return{val:null,up:false,last:last};
  var W=Math.max.apply(null,last.sets.map(function(s){return s.kg||0}));
  var atW=last.sets.filter(function(s){return (s.kg||0)===W});
  if(atW.length>=2&&atW.every(function(s){return (s.reps||0)>=E.r[1]})){
    if(ex==="zancada"&&W===0&&weekOf(date)<3)return{val:0,up:false,last:last};
    return{val:W===0?(E.k==="kg"&&E.st?E.st*2:2):W+(E.st||1),up:true,last:last};
  }
  return{val:W,up:false,last:last};
}
function lastText(ex,last){
  if(!last)return "";var E=EX[ex]||{k:"bw"};
  var reps=last.sets.map(function(s){return s.reps==null?"–":fmt(s.reps)}).join(" · ");
  var w=E.k==="kg"?fmt(Math.max.apply(null,last.sets.map(function(s){return s.kg||0})))+" kg × ":(E.k==="band"?"goma "+(GOMA_N[last.sets[0].nota]||"ligera").toLowerCase()+" × ":"");
  return "Última ("+nice(last.date)+"): "+w+reps+(E.k==="time"?" s":"");
}
function suggPills(ex,sg){
  var E=EX[ex]||{},h="";
  if(E.k==="kg"){if(sg.up)h+='<span class="pill up">Sube a '+fmt(sg.val)+' kg</span>';else if(sg.val!=null)h+='<span class="pill">Hoy: '+fmt(sg.val)+' kg</span>';else if(sg.first)h+='<span class="pill">Primera vez: elige un peso con 2–3 reps en reserva</span>'}
  if(E.k==="band"){h+=sg.up?'<span class="pill up">Prueba la goma '+GOMA_N[sg.band].toLowerCase()+'</span>':'<span class="pill">Goma '+GOMA_N[sg.band].toLowerCase()+'</span>'}
  if(sg.last)h+='<span class="last">'+lastText(ex,sg.last)+'</span>';
  return h?'<div class="sugg">'+h+'</div>':"";
}
function workEx(d){
  var ses=sessionFor(d);if(!ses)return[];var list=sesDef(ses).ex.slice();
  // ejercicios hechos ese día que ya no están en el plan: se siguen mostrando
  Object.keys(S.sets).forEach(function(k){var p=k.split("|");if(p[0]!==d||!S.sets[k].done)return;var e=p[1];if(e==="cardio"||/^bici_/.test(e)||/__cal$/.test(e))return;if(list.indexOf(e)<0&&EX[e])list.push(e)});
  return list;
}
function progressOf(d){
  var list=workEx(d),n=setsFor(d),total=list.length*n,done=0;
  list.forEach(function(ex){for(var i=0;i<n;i++)if(getSet(d,ex,i).done)done++});
  return{done:done,total:total};
}
function exDone(d,ex){var n=setsFor(d);for(var i=0;i<n;i++)if(!getSet(d,ex,i).done)return false;return true}
function isTrained(d){if(!S.ses[d]||S.ses[d].plantilla==="CARDIO")return false;var p=progressOf(d);return p.total>0&&(p.done>=p.total/2||!!S.ses[d].terminada)}
function cardioDone(d){return !!getSet(d,"cardio",0).done}

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

function render(){render0();paintRestAsk()}
function render0(){
  applyPlan();
  var nav=document.querySelector("nav.tabs");
  if(!S.uid){nav.hidden=true;stopTimer();view.innerHTML=renderLogin();return}
  if(!S.perfil&&!S.pulled){nav.hidden=true;view.innerHTML='<p class="empty">Cargando tus datos…</p>';return}
  if(!S.perfil||S.editPerfil){nav.hidden=!S.perfil;view.innerHTML=renderPerfil();return}
  if(S.editPlan&&S.draft){nav.hidden=true;stopTimer();view.innerHTML=renderPlanEditor();return}
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

/* ---------- Vídeo de YouTube por ejercicio ---------- */
function ytId(v){v=String(v||"").trim();if(!v)return "";var m=v.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/|\/live\/)([A-Za-z0-9_-]{11})/);if(m)return m[1];return /^[A-Za-z0-9_-]{11}$/.test(v)?v:""}
function howHtml(ex){
  var E=EX[ex]||{},id=ytId(E.yt),h='<details class="how" data-ex="'+esc(ex)+'"><summary>Cómo se hace'+(id?' · vídeo':'')+'</summary><p>'+esc(E.how||"")+'</p>';
  if(id)h+='<div class="yt" data-yt="'+id+'"><button type="button" class="yt-play" data-act="yt" data-yt="'+id+'"><img alt="" loading="lazy" src="https://i.ytimg.com/vi/'+id+'/mqdefault.jpg"><span>▶ Ver vídeo</span></button></div>';
  return h+'</details>';
}

/* ---------- Pasos de la sesión (calentamientos incluidos) ---------- */
function stepsFor(d){
  var ses=sessionFor(d);if(!ses)return[];
  var SS=sesDef(ses),n=setsFor(d),out=[];
  if(SS.cal)out.push({t:"bike",ex:"bici_calentamiento",i:0,rest:0,n:"Calentamiento",tipo:SS.cal.tipo,min:SS.cal.min});
  workEx(d).forEach(function(ex){
    var E=EX[ex];
    if(E.warm&&E.k==="kg")out.push({t:"warm",ex:ex+"__cal",base:ex,i:0,rest:60,n:E.n});
    for(var i=0;i<n;i++)out.push({t:"set",ex:ex,base:ex,i:i,rest:E.rest,n:E.n,of:n});
  });
  if(SS.fin)out.push({t:"bike",ex:"bici_vuelta_calma",i:0,rest:0,n:"Vuelta a la calma",tipo:SS.fin.tipo,min:SS.fin.min});
  return out;
}
function skipKey(d,s){return setKey(d,s.ex,s.i)}
function resolved(d,s){return !!(getSet(d,s.ex,s.i).done||S.skip[skipKey(d,s)])}
function curStep(d){var st=stepsFor(d);for(var k=0;k<st.length;k++)if(!resolved(d,st[k]))return k;return -1}
function stepIndex(d,ex,i){var st=stepsFor(d);for(var k=0;k<st.length;k++)if(st[k].ex===ex&&st[k].i===i)return k;return -1}
function nextOpen(d,from){var st=stepsFor(d);for(var k=from+1;k<st.length;k++)if(!resolved(d,st[k]))return st[k];for(k=0;k<from;k++)if(!resolved(d,st[k]))return st[k];return null}
function tipoN(t){return (TIPOS[t]||"Bici").toLowerCase()}
function stepLabel(s){return s.t==="bike"?s.n+" ("+tipoN(s.tipo)+")":(s.t==="warm"?s.n+" · calentamiento":s.n+" · serie "+(s.i+1)+" de "+s.of)}
function stepsProgress(d){var st=stepsFor(d),c=0;st.forEach(function(s){if(resolved(d,s))c++});return{done:c,total:st.length}}
function warmKg(d,base){var sg=suggestion(base,d);if(sg.val==null||sg.val===0)return null;return Math.max(2,Math.round(sg.val/2))}
function autoFinish(d){var p=stepsProgress(d),s=S.ses[d];if(s&&p.total&&p.done>=p.total&&!s.terminada){s.terminada=Date.now();touch(s);enq("ses|"+d)}}

/* Campos de una fila */
function fieldIn(s,f,val,ph,unit,mode,big){return '<label class="fld"><input inputmode="'+mode+'" id="'+f+'-'+s.ex+'-'+s.i+(big?"-g":"")+'" data-f="'+f+'" data-ex="'+s.ex+'" data-i="'+s.i+'" value="'+(val==null?"":fmt(val))+'" placeholder="'+esc(ph)+'" aria-label="'+unit+'"><span>'+unit+'</span></label>'}
function fieldSel(s,val,opts,big,label){var h='<label class="fld"><select id="nota-'+s.ex+'-'+s.i+(big?"-g":"")+'" data-f="nota" data-ex="'+s.ex+'" data-i="'+s.i+'" aria-label="'+label+'">';Object.keys(opts).forEach(function(k){h+='<option value="'+k+'"'+(k===val?" selected":"")+'>'+opts[k]+'</option>'});return h+'</select></label>'}
function stepFields(d,s,big){
  var r=getSet(d,s.ex,s.i);
  if(s.t==="bike"||s.t==="cardio")return{html:fieldSel(s,r.nota||s.tipo,TIPOS,big,"Actividad")+fieldIn(s,"reps",r.reps,String(s.min),"min","decimal",big),two:true};
  var E=EX[s.base];
  if(s.t==="warm")return{html:fieldIn(s,"kg",r.kg!=null?r.kg:warmKg(d,s.base),"kg","kg","decimal",big)+fieldIn(s,"reps",r.reps,"10","reps","numeric",big),two:true};
  var sg=suggestion(s.base,d),prev=sg.last&&sg.last.sets[s.i];
  var repPh=prev&&prev.reps!=null&&!sg.up?prev.reps:E.r[0],unit=E.k==="time"?"s":(E.unit||"reps");
  if(E.k==="kg")return{html:fieldIn(s,"kg",r.kg!=null?r.kg:sg.val,"kg","kg","decimal",big)+fieldIn(s,"reps",r.reps,String(repPh),unit,"numeric",big),two:true};
  if(E.k==="band"){var go={};GOMAS.forEach(function(g){go[g]="Goma "+GOMA_N[g].toLowerCase()});return{html:fieldSel(s,r.nota||sg.band,go,big,"Goma")+fieldIn(s,"reps",r.reps,String(repPh),unit,"numeric",big),two:true}}
  return{html:fieldIn(s,"reps",r.reps,String(repPh),unit,"numeric",big),two:false};
}
function listRow(d,s,label){
  var f=stepFields(d,s,false),r=getSet(d,s.ex,s.i),sk=S.skip[skipKey(d,s)];
  return '<div class="set'+(f.two?"":" nokg")+(s.t!=="set"?" warmrow":"")+(r.done?" done":"")+(sk&&!r.done?" skipped":"")+'"><div class="si">'+label+'</div>'+f.html+
    '<button class="ck" type="button" data-act="done" data-ex="'+s.ex+'" data-i="'+s.i+'" aria-pressed="'+(!!r.done)+'" aria-label="'+esc(stepLabel(s))+' hecho">'+CHECK+'</button></div>';
}
function bikeCard(d,s){
  var r=getSet(d,s.ex,s.i),t=r.nota||s.tipo;
  return '<section class="card bike'+(r.done?" ex-done":"")+'"><div class="ex-head"><div class="ex-n">·</div><div class="ex-t"><h3>'+s.n+'</h3><div class="ex-meta">Recomendado: '+s.min+' min de '+tipoN(s.tipo)+' suave. Si haces otra cosa, cámbiala.</div></div>'+(r.done?'<span class="okpill">'+CHECK+'Hecho</span>':'')+'</div><div class="sets">'+listRow(d,s,s.ex==="bici_calentamiento"?"Ini.":"Fin")+'</div></section>';
}
function cardioCard(d){
  var cp=cardioPlan(d),r=getSet(d,"cardio",0),s={t:"cardio",ex:"cardio",i:0,tipo:cp.tipo,min:cp.min};
  var h='<section class="card'+(r.done?" ex-done":"")+'"><div class="ex-head"><div class="ex-t"><h3>Cardio</h3><div class="ex-meta">Recomendado: '+cp.min+' min de '+tipoN(cp.tipo)+' a ritmo moderado (puedes hablar, pero te cuesta un poco).</div></div>'+(r.done?'<span class="okpill">'+CHECK+'Hecho</span>':'')+'</div>';
  h+='<div class="sets">'+listRow(d,s,"Hoy")+'</div><p class="ex-meta" style="margin:0">Elige lo que has hecho de verdad y los minutos, y márcalo.</p></section>';
  if(r.done)h+='<div class="status ok"><span class="dot"></span><div><b>Cardio hecho: '+fmt(r.reps)+' min de '+tipoN(r.nota||cp.tipo)+'</b><p>Queda guardado en tu registro.</p></div></div>';
  return h;
}
function planNotes(){return PLAN&&PLAN.notas?'<details class="how pnotes"><summary>Pautas de tu plan</summary><p>'+esc(PLAN.notas)+'</p></details>':""}

/* ---------- Pantalla Hoy ---------- */
function renderHoy(){
  var d=S.date,dow=parse(d).getDay(),wk=weekOf(d),kind=dayKind(d),ses=sessionFor(d),isToday=d===today(),row=S.ses[d];
  if(ses&&S.guided===d)return renderGuide();
  var title=kind==="ses"?sesDef(ses).n:(kind==="cardio"?"Cardio":"Descanso");
  var h='<div class="daynav"><button type="button" data-act="prev" aria-label="Día anterior">‹</button><div class="dlabel"><div class="eyebrow">'+(isToday?"Hoy · ":"")+DOW[dow]+" "+nice(d)+(wk?" · Semana "+wk:"")+'</div><h2 class="sess">'+esc(title)+'</h2></div><button type="button" data-act="next" aria-label="Día siguiente"'+(isToday?" disabled":"")+'>›</button></div>';
  h+='<div class="chips" role="group" aria-label="Elegir entrenamiento">';
  Object.keys(SESS).forEach(function(k){h+='<button class="chip" type="button" data-ses="'+k+'" aria-pressed="'+(ses===k)+'">'+esc(SESS[k].n)+'</button>'});
  h+='<button class="chip" type="button" data-ses="CARDIO" aria-pressed="'+(kind==="cardio")+'">Cardio</button><button class="chip" type="button" data-ses="REST" aria-pressed="'+(kind==="rest")+'">Descanso</button></div>';
  if(S.msg&&/Borra primero/.test(S.msg))h+='<div class="note">'+esc(S.msg)+'</div>';
  if(kind==="cardio")return h+cardioCard(d);
  if(kind==="rest")return h+'<div class="card rest-day"><h3>Día de descanso</h3><p class="ex-meta">Camina tus pasos y descansa. Si ayer quedó una sesión pendiente, no la recuperes hoy.</p><div class="btnrow"><button class="btn ghost" type="button" data-ses="CARDIO">He hecho cardio: apuntarlo</button></div></div>';
  var steps=stepsFor(d),sp=stepsProgress(d),k=curStep(d),SS=sesDef(ses),n=setsFor(d),p=progressOf(d);
  h+='<div class="bar" aria-label="Progreso de la sesión"><b style="width:'+(sp.total?Math.round(sp.done/sp.total*100):0)+'%"></b></div>';
  if(k>=0)h+='<button class="btn big start" type="button" data-act="guide-on">'+(sp.done?'Continuar entrenamiento · paso '+(k+1)+' de '+sp.total:'Comenzar entrenamiento')+'</button>';
  if(wk<=2)h+='<div class="note"><strong>Semanas 1–2:</strong> '+n+' series de trabajo por ejercicio.</div>';
  h+=planNotes();
  if(SS.cal)h+=bikeCard(d,steps[0]);
  workEx(d).forEach(function(ex,idx){
    var E=EX[ex],sg=suggestion(ex,d),done=exDone(d,ex),unit=E.k==="time"?" s":"";
    h+='<section class="card'+(done?" ex-done":"")+'"><div class="ex-head"><div class="ex-n">'+(idx+1)+'</div><div class="ex-t"><h3>'+esc(E.n)+'</h3><div class="ex-meta">'+n+' × '+E.r[0]+'–'+E.r[1]+unit+(E.unit&&E.k!=="time"?" "+esc(E.unit):"")+' · descanso '+mmss(E.rest)+(E.side?' · '+esc(E.side):'')+'</div></div>'+(done?'<span class="okpill">'+CHECK+'Hecho</span>':'')+'</div>';
    h+=suggPills(ex,sg)+'<div class="sets">';
    if(E.warm&&E.k==="kg")h+=listRow(d,{t:"warm",ex:ex+"__cal",base:ex,i:0,rest:60,n:E.n},"Cal.");
    for(var i=0;i<n;i++)h+=listRow(d,{t:"set",ex:ex,base:ex,i:i,rest:E.rest,n:E.n,of:n},"S"+(i+1));
    h+='</div>'+(E.warm&&E.k==="kg"?'<p class="ex-meta warmnote">Cal. = serie de calentamiento: 10 reps con la mitad de peso.</p>':'')+howHtml(ex)+'</section>';
  });
  if(SS.fin)h+=bikeCard(d,steps[steps.length-1]);
  if(row&&row.terminada)h+='<div class="status ok"><span class="dot"></span><div><b>Sesión terminada a las '+hhmm(row.terminada)+'</b><p>'+p.done+' de '+p.total+' series hechas. Queda guardada en tu registro.</p></div></div>';
  else if(sp.done>0)h+='<div class="btnrow"><button class="btn" type="button" data-act="finish">Terminar sesión</button></div>';
  h+='<p class="ex-meta">Cada paso que marcas se guarda al momento. Al marcar uno, la app te ofrece empezar el descanso o saltarlo.</p>';
  return h;
}

/* ---------- Modo guiado ---------- */
function renderGuide(){
  var d=S.date,ses=sessionFor(d),SS=sesDef(ses),steps=stepsFor(d),k=curStep(d),sp=stepsProgress(d),row=S.ses[d];
  var h='<div class="g-top"><div class="dlabel"><div class="eyebrow">'+esc(SS.n)+' · '+(k<0?'completado':'paso '+(k+1)+' de '+steps.length)+'</div></div><button class="btn ghost sm" type="button" data-act="guide-off">Ver lista</button></div>';
  h+='<div class="bar"><b style="width:'+(sp.total?Math.round(sp.done/sp.total*100):0)+'%"></b></div>';
  if(S.restAsk)h+='<section class="card restcard"><div class="rc-ok">'+CHECK+esc(S.restAsk.done)+'</div><div class="rc-t">Descanso recomendado <b>'+mmss(S.restAsk.sec)+'</b></div><div class="btnrow"><button class="btn big" type="button" data-act="rest-start">Empezar descanso</button><button class="btn ghost big" type="button" data-act="rest-skip">Saltar descanso</button></div><p class="ex-meta" style="margin:0">Si ya lo has hecho y solo lo estás apuntando, salta el descanso.</p></section>';
  if(k<0){
    var p=progressOf(d);
    return h+'<section class="card donecard"><div class="dc-ic">'+CHECK+'</div><h3>¡Entrenamiento completado!</h3><p class="ex-meta" style="margin:0">'+p.done+' de '+p.total+' series de trabajo'+(row&&row.terminada?' · terminado a las '+hhmm(row.terminada):'')+'. Todo queda guardado en tu registro.</p><div class="btnrow"><button class="btn" type="button" data-act="guide-off">Ver resumen</button></div></section>';
  }
  var s=steps[k],f=stepFields(d,s,true),title,sub,extra="";
  if(s.t==="bike"){title=s.n;sub="Recomendado: "+s.min+" min de "+tipoN(s.tipo)+" suave. Si haces otra cosa, cámbiala."}
  else{
    var E=EX[s.base];title=E.n;
    if(s.t==="warm")sub="Serie de calentamiento · 10 reps con la mitad de peso";
    else{sub="Serie "+(s.i+1)+" de "+s.of+" · "+E.r[0]+"–"+E.r[1]+(E.k==="time"?" s":" "+(E.unit||"reps"))+(E.side?" · "+E.side:"");extra+=suggPills(s.base,suggestion(s.base,d))}
    extra+=howHtml(s.base);
  }
  h+=(S.restAsk?'<div class="eyebrow">Siguiente</div>':'')+'<section class="card gstep"><div class="g-kind">'+(s.t==="set"?"Ejercicio":"Calentamiento")+'</div><h3 class="g-title">'+esc(title)+'</h3><div class="ex-meta">'+esc(sub)+'</div>'+extra+
    '<div class="set big'+(f.two?"":" nokg")+'">'+f.html+'</div>'+
    '<div class="btnrow"><button class="btn big" type="button" data-act="gdone" data-ex="'+s.ex+'" data-i="'+s.i+'">'+CHECK+' Hecho</button><button class="btn ghost big" type="button" data-act="gskip" data-ex="'+s.ex+'" data-i="'+s.i+'">Saltar paso</button></div></section>';
  var up=[];for(var j=k+1;j<steps.length&&up.length<3;j++)if(!resolved(d,steps[j]))up.push(steps[j]);
  if(up.length)h+='<div class="upnext"><div class="eyebrow">Después</div>'+up.map(function(x){return '<div>'+esc(stepLabel(x))+'</div>'}).join("")+'</div>';
  return h;
}
function markStep(d,ex,i,box){
  var st=getSet(d,ex,i);
  if(st.done){updSet(d,ex,i,{done:false,at:null});if(ex==="cardio"&&S.ses[d]){S.ses[d].terminada=null;touch(S.ses[d]);enq("ses|"+d)}S.restAsk=null;persist(true);render();return}
  var kgIn=box.querySelector('[data-f="kg"]'),rpIn=box.querySelector('[data-f="reps"]'),ntIn=box.querySelector('[data-f="nota"]');
  var kv=kgIn?num(kgIn.value):null,rv=rpIn?num(rpIn.value):null;if(rpIn&&rv==null)rv=num(rpIn.placeholder);
  updSet(d,ex,i,{kg:kgIn?(kv!=null?kv:0):null,reps:rv,nota:ntIn?ntIn.value:null,done:true,at:Date.now()});
  delete S.skip[setKey(d,ex,i)];lsSet("skip",S.skip);
  keepAwake();
  if(ex==="cardio"){var cs=ensureSes(d);cs.terminada=Date.now();touch(cs);enq("ses|"+d)}else autoFinish(d);
  persist(true);
  var k=stepIndex(d,ex,i),steps=stepsFor(d),s=steps[k],nx=k>=0?nextOpen(d,k):null;
  stopTimer();
  S.restAsk=(s&&s.rest>0&&nx)?{sec:s.rest,next:"Siguiente: "+stepLabel(nx),done:(s.t==="warm"?"Calentamiento hecho":"Serie hecha")}:null;
  render();
}
function skipStep(d,ex,i){S.skip[setKey(d,ex,i)]=true;lsSet("skip",S.skip);S.restAsk=null;stopTimer();render();window.scrollTo(0,0)}
var ra=document.getElementById("restask");
function paintRestAsk(){
  if(S.restAsk&&S.uid&&S.tab==="hoy"&&S.guided!==S.date&&!S.editPlan){
    document.getElementById("ra-t").textContent="Descanso "+mmss(S.restAsk.sec);
    document.getElementById("ra-n").textContent=S.restAsk.next;ra.hidden=false;
  }else ra.hidden=true;
}
function restStart(){var r=S.restAsk;if(!r)return;S.restAsk=null;unlockAudio();startTimer(r.sec,r.next);render()}
function restSkip(){S.restAsk=null;stopTimer();render()}
ra.addEventListener("click",function(ev){var b=ev.target.closest("button");if(!b)return;if(b.dataset.r==="start")restStart();else restSkip()});

/* =================== EDITOR DEL PLAN =================== */
var DOW_ORDER=["1","2","3","4","5","6","0"];
function openPlanEditor(){S.draft=JSON.parse(JSON.stringify(PLAN));S.editPlan=true;S.peOpen={};S.peConfirm=null;S.formErr="";S.restAsk=null;render();window.scrollTo(0,0)}
function optList(obj,val){return Object.keys(obj).map(function(k){return '<option value="'+k+'"'+(k===val?" selected":"")+'>'+esc(obj[k])+'</option>'}).join("")}
function pIn(path,val,type,attrs){return '<input data-pp="'+path+'" data-pt="'+type+'" value="'+esc(val==null?"":(type==="num"?fmt(val):val))+'"'+(type==="num"?' inputmode="decimal"':'')+(attrs||"")+'>'}
function renderPlanEditor(){
  var D=S.draft,h='<div class="g-top"><div class="dlabel"><div class="eyebrow">Configuración</div><h2 class="sess">Mi plan</h2></div></div>';
  h+='<p class="ex-meta" style="margin:0">Los cambios se aplican a partir de ahora. Lo que ya tienes registrado no se pierde.</p>';
  // semana
  var sesOpts={};Object.keys(D.sesiones).forEach(function(k){sesOpts["ses:"+k]=D.sesiones[k].n});sesOpts["cardio"]="Cardio";sesOpts["rest"]="Descanso";
  h+='<h3 class="sec">Semana</h3><div class="card pe">';
  DOW_ORDER.forEach(function(dw){
    var w=D.semana[dw]||{t:"rest"},v=w.t==="ses"?"ses:"+w.k:w.t;
    h+='<div class="pe-day"><b>'+DOW[+dw]+'</b><label class="fld"><select data-week="'+dw+'">'+optList(sesOpts,v)+'</select></label>';
    if(w.t==="cardio")h+='<div class="pe-two"><label class="fld"><select data-pp="semana.'+dw+'.tipo" data-pt="text">'+optList(TIPOS,w.tipo)+'</select></label><label class="fld">'+pIn("semana."+dw+".min",w.min,"num")+'<span>min</span></label></div>';
    h+='</div>';
  });
  h+='</div>';
  // series y pautas
  h+='<h3 class="sec">Series</h3><div class="card pe"><div class="pe-two"><label class="lbl">Series por ejercicio<span class="fld">'+pIn("series",D.series,"num")+'</span></label><label class="lbl">Semanas 1 y 2<span class="fld">'+pIn("seriesInicio",D.seriesInicio,"num")+'</span></label></div>'+
    '<label class="lbl">Pautas que salen en cada sesión<textarea data-pp="notas" data-pt="text" rows="4">'+esc(D.notas||"")+'</textarea></label></div>';
  // sesiones
  Object.keys(D.sesiones).forEach(function(k){
    var s=D.sesiones[k];
    h+='<h3 class="sec">'+esc(s.n)+'</h3><div class="card pe">';
    h+='<div class="pe-two"><label class="lbl">Nombre<span class="fld">'+pIn("sesiones."+k+".n",s.n,"text",' class="txt"')+'</span></label><label class="lbl">Abreviatura<span class="fld">'+pIn("sesiones."+k+".ab",s.ab||abOf(s.n),"text",' class="txt" maxlength="3"')+'</span></label></div>';
    ["cal","fin"].forEach(function(part){
      var c=s[part],lab=part==="cal"?"Calentamiento":"Vuelta a la calma";
      h+='<div class="pe-row"><b>'+lab+'</b>'+(c?'<div class="pe-two"><label class="fld"><select data-pp="sesiones.'+k+'.'+part+'.tipo" data-pt="text">'+optList(TIPOS,c.tipo)+'</select></label><label class="fld">'+pIn("sesiones."+k+"."+part+".min",c.min,"num")+'<span>min</span></label></div><button class="lnk" type="button" data-pa="part-off|'+k+'|'+part+'">Quitar</button>':'<button class="lnk" type="button" data-pa="part-on|'+k+'|'+part+'">Añadir</button>')+'</div>';
    });
    h+='<div class="pe-exs">';
    s.ex.forEach(function(id,idx){
      var E=D.ejercicios[id];if(!E)return;var open=S.peOpen[k+"|"+id];
      var sum=E.r[0]+"–"+E.r[1]+(E.k==="time"?" s":" "+(E.unit||"reps"))+(E.k==="kg"?" · "+fmt(E.kg||0)+" kg":"")+(E.k==="band"?" · goma":"")+" · "+mmss(E.rest||0)+(ytId(E.yt)?" · vídeo":"");
      h+='<div class="pe-ex'+(open?" open":"")+'"><div class="pe-exh"><button class="pe-name" type="button" data-pa="open|'+k+'|'+id+'"><b>'+(idx+1)+'. '+esc(E.n)+'</b><small>'+esc(sum)+'</small></button>'+
        '<button class="ic" type="button" data-pa="up|'+k+'|'+idx+'" aria-label="Subir">↑</button><button class="ic" type="button" data-pa="down|'+k+'|'+idx+'" aria-label="Bajar">↓</button><button class="ic del" type="button" data-pa="del|'+k+'|'+idx+'" aria-label="Quitar">✕</button></div>';
      if(open){
        var P_="ejercicios."+id;
        h+='<div class="pe-exb"><label class="lbl">Nombre<span class="fld">'+pIn(P_+".n",E.n,"text",' class="txt"')+'</span></label>'+
          '<div class="pe-two"><label class="lbl">Reps mín.<span class="fld">'+pIn(P_+".r.0",E.r[0],"num")+'</span></label><label class="lbl">Reps máx.<span class="fld">'+pIn(P_+".r.1",E.r[1],"num")+'</span></label></div>'+
          '<div class="pe-two">'+(E.k==="kg"?'<label class="lbl">Peso de inicio<span class="fld">'+pIn(P_+".kg",E.kg||0,"num")+'<span>kg</span></span></label>':'')+'<label class="lbl">Descanso<span class="fld">'+pIn(P_+".rest",E.rest||0,"num")+'<span>s</span></span></label></div>'+
          (E.k==="kg"?'<div class="pe-two"><label class="lbl">Subir de<span class="fld">'+pIn(P_+".st",E.st||1,"num")+'<span>kg</span></span></label><label class="chk"><input type="checkbox" data-pp="'+P_+'.warm" data-pt="bool"'+(E.warm?" checked":"")+'><span>Serie de calentamiento</span></label></div>':'')+
          '<label class="lbl">Vídeo de YouTube (enlace o ID)<span class="fld">'+pIn(P_+".yt",E.yt||"","text",' class="txt" placeholder="https://youtu.be/…" autocapitalize="off" spellcheck="false"')+'</span></label>'+
          '<label class="lbl">Cómo se hace<textarea data-pp="'+P_+'.how" data-pt="text" rows="3">'+esc(E.how||"")+'</textarea></label>'+
          '<p class="ex-meta" style="margin:0">Estos datos cambian el ejercicio en todas las sesiones donde aparece.</p></div>';
      }
      h+='</div>';
    });
    h+='</div>';
    // añadir
    var cat={};Object.keys(CAT).forEach(function(id){if(s.ex.indexOf(id)<0)cat[id]=CAT[id].n+" ("+KINDS[CAT[id].k].toLowerCase()+")"});
    Object.keys(D.ejercicios).forEach(function(id){if(s.ex.indexOf(id)<0&&!CAT[id])cat[id]=D.ejercicios[id].n+" (propio)"});
    var sorted={};Object.keys(cat).sort(function(a,b){return cat[a].localeCompare(cat[b],"es")}).forEach(function(id){sorted[id]=cat[id]});
    h+='<div class="pe-add"><label class="fld"><select id="add-'+k+'">'+optList(sorted,"")+'</select></label><button class="btn ghost" type="button" data-pa="add|'+k+'">Añadir</button></div>';
    h+='<details class="more"><summary>Crear un ejercicio nuevo</summary><div class="pe-new"><label class="fld"><input class="txt" id="new-n-'+k+'" placeholder="Nombre del ejercicio"></label><label class="fld"><select id="new-k-'+k+'">'+optList(KINDS,"kg")+'</select></label><button class="btn ghost" type="button" data-pa="new|'+k+'">Crear y añadir</button></div></details>';
    h+='</div>';
  });
  // restablecer
  var cf=S.peConfirm;
  h+='<h3 class="sec">Restablecer</h3><div class="card pe"><p class="ex-meta" style="margin:0">Vuelve a un plan recomendado. Se pierden los cambios que hayas hecho en el plan, pero no tus registros.</p><div class="btnrow"><button class="btn ghost'+(cf==="hombre"?" warn":"")+'" type="button" data-pa="reset|hombre">'+(cf==="hombre"?"¿Seguro? Toca otra vez":"Plan fuerza (hombre)")+'</button><button class="btn ghost'+(cf==="mujer"?" warn":"")+'" type="button" data-pa="reset|mujer">'+(cf==="mujer"?"¿Seguro? Toca otra vez":"Plan tonificación y core (mujer)")+'</button></div></div>';
  h+=(S.formErr?'<p class="err">'+esc(S.formErr)+'</p>':'')+'<div class="pe-save"><button class="btn big" type="button" data-pa="save">Guardar plan</button><button class="btn ghost big" type="button" data-pa="cancel">Cancelar</button></div>';
  return h;
}
function setPath(obj,path,val){var p=path.split("."),o=obj;for(var i=0;i<p.length-1;i++){o=o[p[i]];if(o==null)return}o[p[p.length-1]]=val}
function peInput(el){
  var path=el.dataset.pp,t=el.dataset.pt,v;
  if(t==="bool")v=el.checked;else if(t==="num"){v=num(el.value);if(v==null)return}else v=el.value;
  if(/\.yt$/.test(path))v=ytId(v)||"";
  setPath(S.draft,path,v);
}
function peAction(a){
  var p=a.split("|"),D=S.draft,act=p[0],k=p[1],s=D.sesiones[k];
  if(act==="open"){S.peOpen[k+"|"+p[2]]=!S.peOpen[k+"|"+p[2]];render();return}
  if(act==="up"||act==="down"){var i=+p[2],j=act==="up"?i-1:i+1;if(j<0||j>=s.ex.length)return;var t=s.ex[i];s.ex[i]=s.ex[j];s.ex[j]=t;render();return}
  if(act==="del"){s.ex.splice(+p[2],1);render();return}
  if(act==="part-off"){s[p[2]]=null;render();return}
  if(act==="part-on"){s[p[2]]={tipo:"bici",min:10};render();return}
  if(act==="add"){var id=document.getElementById("add-"+k).value;if(!id)return;if(!D.ejercicios[id])D.ejercicios[id]=exCopy(id);s.ex.push(id);render();return}
  if(act==="new"){
    var nm=document.getElementById("new-n-"+k).value.trim(),kd=document.getElementById("new-k-"+k).value;
    if(!nm){S.formErr="Escribe el nombre del ejercicio nuevo.";render();return}
    var nid="c_"+Date.now().toString(36);
    D.ejercicios[nid]={n:nm,k:kd,r:kd==="time"?[20,40]:[10,12],kg:kd==="kg"?2:undefined,st:kd==="kg"?1:undefined,rest:60,how:"",yt:""};
    s.ex.push(nid);S.peOpen[k+"|"+nid]=true;S.formErr="";render();return;
  }
  if(act==="reset"){if(S.peConfirm===k){S.draft=defaultPlan(k);S.peConfirm=null;S.peOpen={}}else S.peConfirm=k;render();return}
  if(act==="cancel"){S.editPlan=false;S.draft=null;S.formErr="";render();window.scrollTo(0,0);return}
  if(act==="save"){
    var err="";
    Object.keys(D.sesiones).forEach(function(sk){var x=D.sesiones[sk];if(!String(x.n||"").trim())err=err||"Cada sesión necesita un nombre.";if(!x.ex.length)err=err||"La sesión «"+x.n+"» no tiene ejercicios."});
    Object.keys(D.ejercicios).forEach(function(id){var E=D.ejercicios[id];if(!E.r||E.r[0]>E.r[1])err=err||"En «"+E.n+"» las reps mínimas superan a las máximas."});
    if(!(D.series>=1&&D.series<=10)||!(D.seriesInicio>=1&&D.seriesInicio<=10))err=err||"Las series van de 1 a 10.";
    if(err){S.formErr=err;render();return}
    D.series=Math.round(D.series);D.seriesInicio=Math.round(D.seriesInicio);
    S.perfil.plan=D;touch(S.perfil);enq("perfil");S.editPlan=false;S.draft=null;S.formErr="";S.msg="Plan guardado.";persist(true);render();window.scrollTo(0,0);
  }
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
  var nSes=Object.keys(WEEK).filter(function(k){return WEEK[k]&&WEEK[k].t==="ses"&&SESS[WEEK[k].k]}).length;
  for(i=0;i<7;i++){var d=addDays(mon,i),dn=parse(d).getDay(),kd=dayKind(d),tr=kd==="ses"&&isTrained(d),cd=kd==="cardio"&&cardioDone(d);if(tr)count++;
    var lab=kd==="ses"?sesDef(sessionFor(d)).ab:(kd==="cardio"?"C":"–");
    h+='<div class="wd'+(tr?" done":"")+(cd?" cdone":"")+(d===t?" today":"")+'">'+DOW_S[dn]+'<b>'+esc(lab)+'</b></div>'}
  h+='</div><div class="note"><strong>'+count+' de '+nSes+'</strong> sesiones de fuerza esta semana.</div>';
  // registro de sesiones
  var sd=Object.keys(S.ses).sort().reverse();
  h+='<h3 class="sec">Registro de sesiones</h3>'+(S.msg&&/borrado/.test(S.msg)?'<div class="note">'+esc(S.msg)+'</div>':'')+'<div class="card" style="gap:0;padding:2px 14px">';
  if(!sd.length)h+='<p class="empty" style="padding:10px 0">Cuando marques tu primera serie, la sesión aparecerá aquí.</p>';
  sd.slice(0,40).forEach(function(d){
    var s=S.ses[d],p=progressOf(d),SS=sesDef(s.plantilla),tops=[],isC=s.plantilla==="CARDIO",cr=getSet(d,"cardio",0);
    workEx(d).forEach(function(ex){if(!EX[ex]||EX[ex].k!=="kg")return;var best=null;for(var j=0;j<10;j++){var r=S.sets[setKey(d,ex,j)];if(r&&r.done&&r.kg!=null)best=Math.max(best||0,r.kg)}if(best!=null)tops.push(EX[ex].n.split(" (")[0]+" "+fmt(best))});
    var cf=S.confirmDelSes===d;
    h+='<div class="logrow"><button type="button" class="lr-main" data-act="goto" data-d="'+d+'"><span class="lr-st '+(s.terminada?"ok":"open")+'">'+(s.terminada?CHECK:"")+'</span><span class="lr-txt"><b>'+DOW[parse(d).getDay()]+' '+nice(d)+' · '+esc(SS.n)+'</b><small>'+(isC?(cr.done?fmt(cr.reps)+' min de '+tipoN(cr.nota):'sin apuntar'):p.done+'/'+p.total+' series · '+(s.terminada?'terminada '+hhmm(s.terminada):'sin terminar'))+'</small>'+(tops.length?'<small class="lr-tops">'+esc(tops.join(" · "))+'</small>':'')+'</span></button><button type="button" class="lr-del'+(cf?' confirm':'')+'" data-act="delses" data-d="'+d+'" aria-label="Borrar entrenamiento del '+nice(d)+'">'+(cf?'¿Seguro? Toca para borrar':'Borrar')+'</button></div>';
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
  // mi plan
  h+='<h3 class="sec">Mi plan</h3><div class="card"><div class="plan-week">'+DOW_ORDER.map(function(dw){var w=WEEK[dw]||{t:"rest"};return '<div><b>'+DOW_S[+dw]+'</b><span>'+esc(w.t==="ses"&&SESS[w.k]?SESS[w.k].n:(w.t==="cardio"?TIPOS[w.tipo]+" "+w.min+" min":"Descanso"))+'</span></div>'}).join("")+'</div>'+(S.msg==="Plan guardado."?'<div class="note">Plan guardado.</div>':'')+'<div class="btnrow"><button class="btn" type="button" data-act="edit-plan">Editar mi plan</button></div></div>';
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

/* =================== COPIA DE SEGURIDAD =================== */
async function exportBackup(){
  var data={app:"muscules",version:3,exportedAt:new Date().toISOString(),perfil:S.perfil,ses:S.ses,sets:S.sets,meds:S.meds};
  var name="muscules-"+(P()?P().nombre.toLowerCase().replace(/[^a-z0-9]+/g,"-"):"copia")+"-"+today()+".json";
  var blob=new Blob([JSON.stringify(data)],{type:"application/json"}),file=null;
  try{file=new File([blob],name,{type:"application/json"})}catch(e){}
  if(file&&navigator.canShare&&navigator.share){try{if(navigator.canShare({files:[file]})){await navigator.share({files:[file],title:"Copia Muscules Project"});markBackup();return}}catch(e){if(e&&e.name==="AbortError")return}}
  var a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},2000);markBackup();
}
function markBackup(){try{localStorage.setItem(lsKey("backup"),String(Date.now()))}catch(e){}S.msg="Copia exportada.";render()}
function validEx(e){return !!(EX[e]||e==="cardio"||e==="bici_calentamiento"||e==="bici_vuelta_calma"||(/__cal$/.test(e)&&EX[e.replace(/__cal$/,"")]))}
var DAY_RE=/^\d{4}-\d{2}-\d{2}$/;
function importBackup(f){
  var r=new FileReader();
  r.onload=function(){
    var d=null;try{d=JSON.parse(r.result)}catch(e){}
    if(!d||d.app!=="muscules"||!(d.version>=2)||typeof d.ses!=="object"||typeof d.sets!=="object"||typeof d.meds!=="object"){S.msg="Ese archivo no es una copia válida de Muscules Project.";render();return}
    var c=0;
    function mergeIn(local,remote,qp,valid){Object.keys(remote||{}).forEach(function(k){var b=remote[k],a=local[k];if(!valid(k,b))return;if(!a||(b.t||0)>(a.t||0)){b.sy=false;local[k]=b;enq(qp+k);c++}})}
    mergeIn(S.ses,d.ses,"ses|",function(k,b){return DAY_RE.test(k)&&b&&SESS[b.plantilla]});
    mergeIn(S.meds,d.meds,"med|",function(k,b){return DAY_RE.test(k)&&b&&typeof b==="object"});
    mergeIn(S.sets,d.sets,"set|",function(k,b){var p=k.split("|");return p.length===3&&DAY_RE.test(p[0])&&validEx(p[1])&&b&&typeof b==="object"});
    Object.keys(S.sets).forEach(function(k){var dd=k.split("|")[0];if(!S.ses[dd]){S.ses[dd]=touch({plantilla:DEFAULT_BY_DOW[parse(dd).getDay()]||"TA",iniciada:Date.now(),terminada:null});enq("ses|"+dd)}});
    persist(true);S.msg="Copia importada: "+c+" registros recuperados.";render();
  };
  r.onerror=function(){S.msg="No se pudo leer el archivo.";render()};
  r.readAsText(f);
}

/* =================== EVENTOS =================== */
document.querySelector(".tabs").addEventListener("click",function(ev){var b=ev.target.closest(".tab");if(!b)return;if(S.editPlan){S.editPlan=false;S.draft=null}S.tab=b.dataset.tab;S.confirmDel=null;S.confirmDelSes=null;S.msg="";S.formErr="";try{localStorage.setItem("muscules_tab",S.tab)}catch(e){}render();window.scrollTo(0,0)});
document.getElementById("sync").addEventListener("click",function(){if(!S.perfil)return;S.tab="prog";S.msg="";render();window.scrollTo(0,document.body.scrollHeight)});

view.addEventListener("click",function(ev){
  var b=ev.target.closest("button");if(!b)return;var act=b.dataset.act;
  if(b.dataset.pa){peAction(b.dataset.pa);return}
  if(b.dataset.ses){
    var k=b.dataset.ses,s=S.ses[S.date];S.msg="";S.restAsk=null;
    if(s){
      if((k==="CARDIO"||k==="REST")&&hasStrengthDone(S.date)){S.msg="Este día ya tiene series hechas. Borra primero el entrenamiento en Progreso si quieres cambiarlo.";render();return}
      if(k==="REST"){if(!cardioDone(S.date)){delSession(S.date)}else{S.msg="Borra primero el entrenamiento en Progreso si quieres cambiarlo.";render();return}S.override[S.date]="REST";lsSet("override",S.override)}
      else{if(s.plantilla==="CARDIO"&&cardioDone(S.date)&&k!=="CARDIO"){S.msg="Este día ya tiene cardio apuntado. Borra primero el entrenamiento en Progreso si quieres cambiarlo.";render();return}s.plantilla=k;touch(s);enq("ses|"+S.date);persist(true)}
    }
    else{S.override[S.date]=k;lsSet("override",S.override)}
    render();return;
  }
  if(act==="yt"){var box=b.closest(".yt");box.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+b.dataset.yt+'?autoplay=1&playsinline=1&rel=0" title="Vídeo del ejercicio" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';return}
  if(act==="edit-plan"){S.msg="";openPlanEditor();return}
  if(act==="prev"){S.restAsk=null;S.date=addDays(S.date,-1);stopTimer();render();return}
  if(act==="next"){S.restAsk=null;if(S.date<today())S.date=addDays(S.date,1);stopTimer();render();return}
  if(act==="done"){unlockAudio();markStep(S.date,b.dataset.ex,+b.dataset.i,b.closest(".set"));return}
  if(act==="gdone"){unlockAudio();markStep(S.date,b.dataset.ex,+b.dataset.i,b.closest(".gstep"));window.scrollTo(0,0);return}
  if(act==="gskip"){skipStep(S.date,b.dataset.ex,+b.dataset.i);return}
  if(act==="guide-on"){unlockAudio();S.guided=S.date;lsSet("guided",S.date);S.restAsk=null;render();window.scrollTo(0,0);return}
  if(act==="guide-off"){S.guided=null;lsSet("guided",null);render();window.scrollTo(0,0);return}
  if(act==="rest-start"){restStart();return}
  if(act==="rest-skip"){restSkip();window.scrollTo(0,0);return}
  if(act==="delses"){var dd=b.dataset.d;if(S.confirmDelSes===dd){S.confirmDelSes=null;delSession(dd);S.msg="Entrenamiento del "+nice(dd)+" borrado.";}else S.confirmDelSes=dd;render();return}
  if(act==="finish"){S.restAsk=null;var s2=ensureSes(S.date);s2.terminada=Date.now();touch(s2);enq("ses|"+S.date);persist(true);stopTimer();render();return}
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
  var el=ev.target;if(el.dataset&&el.dataset.pp){peInput(el);return}
  if(!el.dataset||!el.dataset.f)return;
  var v=el.dataset.f==="nota"?el.value:num(el.value),patch={};patch[el.dataset.f]=v;updSet(S.date,el.dataset.ex,+el.dataset.i,patch);persist(false);
});
function fillMedForm(d){var m=S.meds[d]||{};FIELDS.forEach(function(F){var e=document.getElementById(F.id);if(e)e.value=m[F.k]!=null?fmt(m[F.k]):""});
  document.querySelectorAll("details.more").forEach(function(x,i){if(FIELDS.some(function(F){return F.g===i+1&&m[F.k]!=null}))x.open=true})}
view.addEventListener("change",function(ev){
  var el=ev.target;
  if(el.dataset&&el.dataset.pp){peInput(el);return}
  if(el.dataset&&el.dataset.week){var dw=el.dataset.week,v=el.value;S.draft.semana[dw]=v.indexOf("ses:")===0?{t:"ses",k:v.slice(4)}:(v==="cardio"?{t:"cardio",tipo:"bici",min:40}:{t:"rest"});render();return}
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
      semanas:Math.round(num(document.getElementById("p-sem").value)||0),pesos_plan:document.getElementById("p-plan").checked,plan:S.perfil?S.perfil.plan||null:null};
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
