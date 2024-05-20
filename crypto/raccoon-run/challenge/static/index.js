var u=class{url;ws=null;queue=[];onMessage;constructor(t,n){this.url=t,this.onMessage=n,this.connect()}connect(){if(this.ws)return;let t=new WebSocket(this.url);t.addEventListener("open",()=>{console.log("WebSocket connection established.");for(let n of this.queue)t.send(JSON.stringify(n));this.queue=[]}),t.addEventListener("message",n=>{console.log("Message from server:",n.data),this.onMessage(JSON.parse(n.data))}),t.addEventListener("close",()=>{console.log("WebSocket connection closed."),this.ws=null,setTimeout(()=>this.connect(),1e3)}),t.addEventListener("error",n=>{console.error("WebSocket encountered an error:",n),this.ws=null}),this.ws=t}send(t){this.ws?(console.log("Sending:",t),this.ws.send(JSON.stringify(t))):this.queue.push(t)}};function T(e){return new Promise((t,n)=>{let s=new Image;s.src=e,s.addEventListener("load",()=>t(s)),s.addEventListener("error",a=>n(a.error))})}var l=document.getElementById("modal"),v=document.getElementById("modal-content"),i=document.getElementById("canvas"),_=document.getElementById("responses"),d=document.getElementById("bet"),S=document.getElementById("buy-flag"),R=document.getElementById("balance"),N=document.getElementById("time");if(!(l instanceof HTMLDialogElement)||!v||!(i instanceof HTMLCanvasElement)||!_||!(d instanceof HTMLFormElement)||!(S instanceof HTMLButtonElement)||!R||!N)throw new TypeError("bad types");var o=i.getContext("2d");if(!o)throw new TypeError("no context");var y=null;new ResizeObserver(([{devicePixelContentBoxSize:e}])=>{let[{inlineSize:t,blockSize:n}]=e;i.width=t,i.height=n,y&&A(y)}).observe(i);var k=[];l.addEventListener("click",function(e){e.target===this&&this.close()});var M=-1;l.addEventListener("close",()=>{clearTimeout(M),M=setTimeout(()=>{let e=k.shift();e&&(v.textContent=e,l.showModal())},250)});var f=e=>{l.open?k.push(e):(v.textContent=e,l.showModal())},L=await Promise.all(Array.from({length:8},(e,t)=>T(`./raccoons/raccoon${t}.png`))),D=window.location.host,F=window.location.protocol==="https:"?"wss:":"ws:",E=0,O=-1,B=()=>{let e=Date.now();N.textContent=(Math.max(E-e,0)/1e3).toFixed(3),e<E&&(O=window.requestAnimationFrame(B))},H=new u(`${F}//${D}/ws`,e=>{switch(e.type){case"race_information":{A(e),y=e;break}case"response":{let t=Object.assign(document.createElement("div"),{className:"response",textContent:e.value}),n=Object.assign(document.createElement("button"),{className:"dismiss",textContent:"Dismiss"});n.addEventListener("click",()=>{t.classList.add("dismissed"),setTimeout(()=>t.remove(),500)}),t.append(n),_.append(t);break}case"flag":{f(e.value);break}case"result":{f(`The winners are:

${e.value.map((t,n)=>`${n+1}. Raccoon ${t+1}`).join(`
`)}`);break}case"bet_status":{f(e.value);break}case"betting-starts":{window.cancelAnimationFrame(O),E=e.until*1e3,B();break}}});d.addEventListener("submit",()=>{let e=new FormData(d),t=e.get("order"),n=e.get("amount");typeof t=="string"&&typeof n=="string"&&H.send({type:"bet",order:t.split("").map(s=>+s-1),amount:+n})});S.addEventListener("click",()=>{H.send({type:"buy_flag"})});var r=50,h=80,b=10,c=100,C=3,w=80,A=e=>{o.save();let t=i.width/window.devicePixelRatio,n=i.height/window.devicePixelRatio;o.font="16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",o.textBaseline="middle",o.fillStyle="#111827",o.fillRect(0,0,i.width,i.height),o.scale(window.devicePixelRatio,window.devicePixelRatio),o.fillStyle="white";let s=e.raccoons.length*(r+b)-b;o.fillRect(c,w,C,s),o.fillRect(t-c,w,C,s);for(let[a,I]of e.raccoons.entries()){let m=w+a*(r+b);o.fillStyle="rgba(255, 255, 255, 0.1)",o.fillRect(0,m,t,r),I===0&&(o.fillStyle="rgba(255, 255, 255, 0.5)",o.fillText(`Raccoon ${a+1}`,c+20,m+r/2));let g=e.finishers.indexOf(a);g!==-1&&(o.fillStyle="rgba(255, 255, 255, 0.5)",o.fillText(`${g+1}${["st","nd","rd"][g]??"th"} Place`,t-c+20,m+r/2));let p=L[a%L.length],x=h/p.height*p.width;o.drawImage(p,I/1e3*(t-c*2)+c-x,m+r-h,x,h)}o.restore(),R.textContent=String(e.account),e.can_bet==="true"?d.classList.remove("cant-bet"):d.classList.add("cant-bet"),S.disabled=e.account<1e3};
