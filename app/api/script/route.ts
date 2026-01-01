import { NextResponse } from "next/server";

// The lightweight tracking script
const trackerScript = `(function(){
'use strict';
var s=document.currentScript||document.querySelector('script[data-api-key]');
if(!s)return;
var k=s.getAttribute('data-api-key');
if(!k)return;
var sid=sessionStorage.getItem('la_sid');
if(!sid){sid=Math.random().toString(36).substring(2)+Date.now().toString(36);sessionStorage.setItem('la_sid',sid);}
var u=s.src.replace('/api/script','/api/track');
function t(type,name,data){
var p={apiKey:k,type:type||'pageview',name:name||null,page:location.pathname,referrer:document.referrer||null,sessionId:sid};
if(data&&typeof data==='object')for(var x in data)if(data.hasOwnProperty(x))p[x]=data[x];
var b=JSON.stringify(p);
if(navigator.sendBeacon)navigator.sendBeacon(u,b);
else fetch(u,{method:'POST',body:b,headers:{'Content-Type':'application/json'},keepalive:true}).catch(function(){});
}
if(document.readyState==='complete')t('pageview');
else window.addEventListener('load',function(){t('pageview');});
window.la=window.la||{};window.la.track=t;
var lp=location.pathname,ps=history.pushState;
history.pushState=function(){ps.apply(history,arguments);if(location.pathname!==lp){lp=location.pathname;t('pageview');}};
window.addEventListener('popstate',function(){if(location.pathname!==lp){lp=location.pathname;t('pageview');}});
})();`;

// CORS headers for cross-origin script loading
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "*",
    "Cross-Origin-Resource-Policy": "cross-origin",
    "Content-Type": "application/javascript; charset=utf-8",
    "Cache-Control": "public, max-age=31536000, immutable",
};

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders
    });
}

export async function GET() {
    return new NextResponse(trackerScript, {
        status: 200,
        headers: corsHeaders,
    });
}
