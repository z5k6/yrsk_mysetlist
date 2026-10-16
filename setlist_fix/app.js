const INITIAL_SONGS = ["カトレア", "言って。", "あの夏に咲け", "靴の花火", "雲と幽霊", "負け犬にアンコールはいらない", "爆弾魔", "ヒッチコック", "準透明少年", "ただ君に晴れ", "冬眠", "藍二乗", "パレード", "八月、某、月明かり", "詩書きとコーヒー", "踊ろうぜ", "六月は雨上がりの街を書く", "五月は花緑青の窓辺から", "夜紛い", "エルマ", "だから僕は音楽を辞めた", "心に穴が空いた", "雨とカプチーノ", "憂一乗", "夕凪、某、花惑い", "神様のダンス", "雨晴るる", "歩く", "声", "エイミー", "ノーチラス", "夜行", "春ひさぎ", "思想犯", "盗作", "昼鳶", "レプリカント", "花人局", "逃亡", "風を食む", "春泥棒", "嘘月", "又三郎", "老人と海", "月に吠える", "ブレーメン", "左右盲", "チノカテ", "テレパス", "アルジャーノン", "451", "夏の肖像", "都落ち", "雪国", "パドドゥ", "さよならモルテン", "いさな", "第一夜", "斜陽", "月光浴", "晴る", "ルパード", "忘れてください", "アポリア", "太陽", "へび", "火星人", "修羅", "プレイシック", "茜", "雲になる", "花も騒めく", "魔性", "ポスト春", "火葬", "うめき", "啄木鳥", "千鳥", "櫂", "あぶく", "melt", "Make-up Shadow", "時をめくる指", "平行線", "少年時代", "宇宙の季節", "最後の心臓", "サンサーラ", "B∀LK", "先日はロマンス", "Travelers", "ナイトルーティーン", "若者のすべて", "憂、燦々", "ソウルズ", "DARMA GRAND PRIX", "紙ひこうき", "灯星", "スターライト", "猫日"];
const $ = id => document.getElementById(id);
let songs = INITIAL_SONGS.map((name, i) => ({id:`base-${i}`, name, selected:false}));
let customId = 0;
// 選択した順番を独立して保持し、後から選んだ曲は必ず末尾に追加する。
let selectedOrder = [];
const colorChoices = {light:"#ffffff",dark:"#14263b",cream:"#fff1d5",pink:"#ffe1ec"};
const outlineChoices = {navy:"#294b68",white:"#ffffff",black:"#202020"};
const backgroundFiles = {ame:"ame.png",orange:"oreng.png",fumi:"fumi.png",umi:"umi.png",sakura:"sakura.png"};
const backgroundImages = {};
let activePosterText = null;
Object.entries(backgroundFiles).forEach(([key,src])=>{const img=new Image();img.src=src;img.onload=drawPoster;backgroundImages[key]=img;});
function selectedBackground(){return document.querySelector('input[name="posterBackground"]:checked')?.value||"ame";}
const songList = $("songList");
const selectedList = $("selectedList");
function selectedSongs(){return selectedOrder.map(id=>songs.find(s=>s.id===id)).filter(Boolean)}
function updateCount(){$("countBadge").textContent=`${selectedSongs().length}曲選択中`}
function renderSongs(){
 const q=$("search").value.trim().toLocaleLowerCase();
 songList.innerHTML="";
 songs.forEach((s,i)=>{
   if(q && !s.name.toLocaleLowerCase().includes(q)) return;
   const row=document.createElement("label");row.className="song-item";
   const cb=document.createElement("input");cb.type="checkbox";cb.checked=s.selected;cb.setAttribute("aria-label",s.name);
   cb.addEventListener("change",()=>{if(cb.checked && selectedSongs().length>=20){cb.checked=false;alert("選択できる曲は最大20曲です。");return;}s.selected=cb.checked;if(cb.checked){if(!selectedOrder.includes(s.id))selectedOrder.push(s.id)}else{selectedOrder=selectedOrder.filter(id=>id!==s.id)}updateCount();renderSelected();drawPoster()});
   const num=document.createElement("span");num.className="num";num.textContent=String(i+1).padStart(2,"0");
   const name=document.createElement("span");name.className="name";name.textContent=s.name;
   row.append(cb,num,name);songList.append(row);
 });
 if(!songList.children.length){const empty=document.createElement("div");empty.className="empty";empty.textContent="一致する曲がありません";songList.append(empty)}
}
function renderSelected(){
 selectedList.innerHTML="";
 const selected=selectedSongs();
 if(!selected.length){const e=document.createElement("div");e.className="empty";e.textContent="曲を選ぶと、ここに順番が表示されます。";selectedList.append(e);return}
 selected.forEach((s,i)=>{
  const row=document.createElement("div");row.className="selected-item";
  const label=document.createElement("span");label.className="selected-name";label.textContent=`${String(i+1).padStart(2,"0")}  ${s.name}`;
  const up=document.createElement("button");up.className="move";up.textContent="↑";up.title="上へ";up.disabled=i===0;
  up.addEventListener("click",()=>moveSong(s,-1));
  const down=document.createElement("button");down.className="move";down.textContent="↓";down.title="下へ";down.disabled=i===selected.length-1;
  down.addEventListener("click",()=>moveSong(s,1));
  const del=document.createElement("button");del.className="remove";del.textContent="外す";del.addEventListener("click",()=>{s.selected=false;selectedOrder=selectedOrder.filter(id=>id!==s.id);updateCount();renderSongs();renderSelected();drawPoster()});
  row.append(label,up,down,del);selectedList.append(row);
 });
}
function moveSong(song,delta){
 const arr=selectedSongs(),i=arr.findIndex(s=>s.id===song.id),j=i+delta;
 if(j<0||j>=arr.length)return;
 // 選択順だけを入れ替え、曲一覧の元の並びは変更しない。
 [selectedOrder[i],selectedOrder[j]]=[selectedOrder[j],selectedOrder[i]];
 renderSongs();renderSelected();drawPoster();
}
function addCustom(){
 const name=$("customSong").value.trim();if(!name)return;if(selectedSongs().length>=20){alert("選択できる曲は最大20曲です。");return;}
 const id=`custom-${++customId}`;songs.push({id,name,selected:true});selectedOrder.push(id);
 $("customSong").value="";$("search").value="";renderSongs();updateCount();renderSelected();drawPoster();
}
$("search").addEventListener("input",renderSongs);
$("clearAll").addEventListener("click",()=>{songs.forEach(s=>s.selected=false);selectedOrder=[];updateCount();renderSongs();renderSelected();drawPoster()});
$("addSong").addEventListener("click",addCustom);
$("customSong").addEventListener("keydown",e=>{if(e.key==="Enter")addCustom()});
["posterTitle","posterDate","subtitle","textColor","fontFamily","outlineEnabled","outlineColor","outlineWidth"].forEach(id=>$(id).addEventListener("input",()=>{if(id==="outlineWidth")$("outlineWidthValue").textContent=$("outlineWidth").value+"px";drawPoster()}));
document.querySelectorAll('input[name="posterBackground"]').forEach(r=>r.addEventListener("change",()=>{document.querySelectorAll(".background-option").forEach(el=>el.classList.toggle("selected",el.contains(r)));drawPoster()}));
$("refresh").addEventListener("click",drawPoster);
function roundedRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
function drawPoster(){
 const c=$("poster"),ctx=c.getContext("2d"),W=540,H=960;
  // 1080×1920の高解像度キャンバスを論理座標540×960で描画。
  ctx.setTransform(2,0,0,2,0,0);
 const bg=backgroundImages[selectedBackground()];
 ctx.clearRect(0,0,W,H);
 if(bg&&bg.complete&&bg.naturalWidth){const scale=Math.max(W/bg.naturalWidth,H/bg.naturalHeight),dw=bg.naturalWidth*scale,dh=bg.naturalHeight*scale;ctx.drawImage(bg,(W-dw)/2,(H-dh)/2,dw,dh)}else{ctx.fillStyle="#dce8ed";ctx.fillRect(0,0,W,H)}
 const ink=colorChoices[$("textColor").value]||"#14263b";
 const outlineOn=$("outlineEnabled").value==="on";
 const familyChoices={sans:"Arial, \"Noto Sans JP\", sans-serif",serif:"Georgia, \"Noto Serif JP\", serif",rounded:"\"Arial Rounded MT Bold\", \"Noto Sans JP\", sans-serif"};
 const fontFamily=familyChoices[$("fontFamily").value]||familyChoices.sans;
 const fontWeight="bold";
 const outlineInk=outlineChoices[$("outlineColor").value]||"#294b68";
 const outlineWidth=Number($("outlineWidth").value)||1;
 ctx.fillStyle=ink;ctx.textAlign="left";ctx.textBaseline="alphabetic";
 ctx.lineJoin="round";
 activePosterText=(text,x,y)=>{if(outlineOn){ctx.save();ctx.strokeStyle=outlineInk;ctx.lineWidth=outlineWidth*2;ctx.lineJoin="round";ctx.miterLimit=2;ctx.strokeText(String(text),x,y);ctx.restore()}ctx.fillText(String(text),x,y)};
 const margin=48;let y=78;
 ctx.globalAlpha=.72;ctx.font=`${fontWeight} 13px ${fontFamily}`;ctx.letterSpacing="3px";posterText("YORUSHIKA  /  SETLIST",margin,y);ctx.globalAlpha=1;y+=48;
 const title=($("posterTitle").value||"SETLIST").trim();
 ctx.font=`${fontWeight} 36px ${fontFamily}`;drawFitted(ctx,title,margin,y,W-margin*2,42);y+=34;
 const subtitle=$("subtitle").value.trim();
 if(subtitle){ctx.font=`normal 15px ${fontFamily}`;ctx.globalAlpha=.86;drawFitted(ctx,subtitle,margin,y,W-margin*2,20);ctx.globalAlpha=1;y+=25}
 const date=$("posterDate").value.trim();if(date){ctx.globalAlpha=.82;ctx.font=`normal 14px ${fontFamily}`;posterText(date,margin,y);ctx.globalAlpha=1;y+=25}
 y+=18;ctx.strokeStyle=ink;ctx.globalAlpha=.4;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(margin,y);ctx.lineTo(W-margin,y);ctx.stroke();ctx.globalAlpha=1;y+=28;
 const chosen=selectedSongs();
 const bottom=H-48;const available=Math.max(80,bottom-y);
 // 曲数が少ない場合も間隔を広げすぎず、多い場合だけ自然に詰める。
 const lineHeight=chosen.length<=1?30:Math.max(23,Math.min(31,available/chosen.length));
 const fontSize=Math.max(10,Math.min(17,lineHeight*.57, chosen.length>15?14:17));
 if(!chosen.length){
   ctx.globalAlpha=.72;ctx.font=`normal 15px ${fontFamily}`;posterText("選んだ曲がここに表示されます",margin,y+18);ctx.globalAlpha=1;
 }else{
   const actualLineHeight=Math.min(lineHeight,available/chosen.length);
   const actualFontSize=Math.min(fontSize,Math.max(9,actualLineHeight*.59));
   chosen.forEach((s,i)=>{
     const baseline=y+i*actualLineHeight+actualLineHeight*.72;
     ctx.globalAlpha=.68;ctx.font=`normal ${Math.max(9,actualFontSize-2)}px ${fontFamily}`;posterText(String(i+1).padStart(2,"0"),margin,baseline);
     ctx.globalAlpha=1;ctx.font=`${fontWeight} ${actualFontSize}px ${fontFamily}`;
     drawFitted(ctx,s.name,margin+38,baseline,W-margin*2-38,actualLineHeight);
   });
 }

}
function posterText(text,x,y){if(activePosterText)activePosterText(text,x,y)}
function drawFitted(ctx,text,x,y,maxWidth,lineHeight){
 let t=String(text);let size=parseFloat(ctx.font)||14;ctx.textBaseline="alphabetic";
 while(ctx.measureText(t).width>maxWidth&&size>8){size-=1;ctx.font=ctx.font.replace(/\d+(?:\.\d+)?px/,`${size}px`)}
 if(typeof posterText==="function")posterText(t,x,y);else ctx.fillText(t,x,y);
}
$("download").addEventListener("click",()=>{
 const canvas=$("poster");
 try {
   drawPoster();
   const saveBlob=(blob)=>{
     if(!blob) {
       const dataUrl=canvas.toDataURL("image/png");
       const win=window.open();
       if(win){win.document.write('<img alt="Setlist PNG" style="max-width:100%;height:auto" src="'+dataUrl+'">');}
       else {location.href=dataUrl;}
       return;
     }
     const url=URL.createObjectURL(blob);
     const a=document.createElement("a");
     a.href=url;
     a.download="yorushika-setlist.png";
     a.target="_blank";
     document.body.appendChild(a);
     a.click();
     a.remove();
     setTimeout(()=>URL.revokeObjectURL(url),60000);
   };
   if(typeof canvas.toBlob==="function") canvas.toBlob(saveBlob,"image/png");
   else saveBlob(null);
 } catch(err) {
   console.error("PNG export failed:",err);
   alert("PNG画像の作成に失敗しました。ページをブラウザで開き直して、もう一度お試しください。");
 }
});
renderSongs();updateCount();renderSelected();drawPoster();