(()=>{"use strict";var e,t,n,a,l={571:(e,t,n)=>{n.a(e,(async(e,t)=>{try{const e=()=>{const e=document.getElementById("addButton"),t=document.getElementById("deleteButton"),a=document.getElementById("updateButton");document.addEventListener("DOMContentLoaded",(()=>{e.addEventListener("click",(async()=>{try{await n()}catch(e){console.log(e)}}))})),document.addEventListener("DOMContentLoaded",(()=>{t.addEventListener("click",(async()=>{try{await u()}catch(e){console.log(e)}}))})),document.addEventListener("DOMContentLoaded",(()=>{a.addEventListener("click",(async()=>{try{await m()}catch(e){console.log(e)}}))}))},n=async()=>{const e=document.getElementById("subredditInput").value;await a(e)},a=async e=>{chrome.storage.local.get(e,(async t=>{if(e in t)console.log("Duplicate subreddit "+e+" was not added");else{const t={};t[e]={filterCategory:"before",filterDateTime:p(new Date),isActive:!1},await chrome.storage.local.set(t),l(e,null,null,null,null)}}))},l=(e,t,n,a,l)=>{let d=document.getElementById("subreddits").getElementsByTagName("tbody")[0].insertRow();d.setAttribute("class","subreddit"),r(d,e),o(d,t),s(d,n),c(d,a),i(d,l)},r=(e,t)=>{const n=d(e),a=document.createElement("input");a.setAttribute("type","text"),a.setAttribute("class","subreddit-name"),a.setAttribute("value",t),a.required=!0,a.value=t,n.appendChild(a)},o=(e,t)=>{const n=d(e),a=["before","after"],l=document.createElement("select");l.setAttribute("class","subreddit-filter-categories");for(let e of a){let t=document.createElement("option");t.innerHTML=e,t.value=e,l.appendChild(t)}l.value=null!==t?t:a[0],n.appendChild(l)},s=(e,t)=>{const n=d(e),a=document.createElement("input");a.setAttribute("type","datetime-local"),a.setAttribute("class","subreddit-datetime-local"),a.required=!0,a.value=null!==t?b(t):(new Date).toLocaleString("sv").slice(0,-3),n.appendChild(a)},c=(e,t)=>{const n=d(e),a=document.createElement("input");a.setAttribute("type","checkbox"),a.setAttribute("class","subreddit-activebox"),a.checked=null!==t&&t,n.appendChild(a)},i=(e,t)=>{const n=d(e),a=document.createElement("input");a.setAttribute("type","checkbox"),a.setAttribute("class","subreddit-selectedbox"),a.checked=null!==t&&t,n.appendChild(a)},d=e=>e.insertCell(),u=async()=>{const e=document.getElementById("subreddits").getElementsByTagName("tbody")[0],t=[];let n=0;for(;n<e.rows.length;){let a=e.rows[n];if(a.children[4].getElementsByTagName("input")[0].checked){let l=a.children[0].getElementsByTagName("input")[0].value;t.push(l),e.deleteRow(n)}else n++}await chrome.storage.local.remove(t)},m=async()=>{const e=document.getElementById("subreddits").getElementsByTagName("tbody")[0],t={};let n=!0;for(let a=0;a<e.rows.length;a++){let l=e.rows[a],r=l.children[0].getElementsByTagName("input")[0].value,o=l.children[2].getElementsByTagName("input")[0].value;if(t[r]||""===r||""===o){n=!1;break}t[r]=!0}n?await g():console.log("Duplicate or invalid field inputted")},g=async()=>{const e=document.getElementById("subreddits").getElementsByTagName("tbody")[0],t=[];for(let n=0;n<e.rows.length;n++){let a=e.rows[n],l=a.children[0].getElementsByTagName("input")[0].getAttribute("value"),r=a.children[0].getElementsByTagName("input")[0].value,o=a.children[1].getElementsByTagName("select")[0].value,s=a.children[2].getElementsByTagName("input")[0].value,c=a.children[3].getElementsByTagName("input")[0].checked;l!==r&&t.push(l);const i={};i[r]={filterCategory:o,filterDateTime:p(s),isActive:c},await chrome.storage.local.set(i),a.children[0].getElementsByTagName("input")[0].setAttribute("value",r)}await chrome.storage.local.remove(t)},y=async()=>{const e=document.getElementById("subreddits").getElementsByTagName("tbody")[0];let t=0;for(;t<e.rows.length;)e.deleteRow(t),t++;chrome.storage.local.get(null,(e=>{for(let t in e){let n=t,a=e[t].filterCategory,r=e[t].filterDateTime,o=e[t].isActive;l(n,a,r,o,null)}}))},p=e=>new Date(e).toISOString().slice(0,-8),b=e=>{const t=(new Date).getTimezoneOffset(),n=new Date(e);return n.setMinutes(n.getMinutes()-t),n.toLocaleString("sv").slice(0,-3)};await y(),e(),t()}catch(e){t(e)}}),1)}},r={};function o(e){var t=r[e];if(void 0!==t)return t.exports;var n=r[e]={exports:{}};return l[e](n,n.exports,o),n.exports}e="function"==typeof Symbol?Symbol("webpack queues"):"__webpack_queues__",t="function"==typeof Symbol?Symbol("webpack exports"):"__webpack_exports__",n="function"==typeof Symbol?Symbol("webpack error"):"__webpack_error__",a=e=>{e&&e.d<1&&(e.d=1,e.forEach((e=>e.r--)),e.forEach((e=>e.r--?e.r++:e())))},o.a=(l,r,o)=>{var s;o&&((s=[]).d=-1);var c,i,d,u=new Set,m=l.exports,g=new Promise(((e,t)=>{d=t,i=e}));g[t]=m,g[e]=e=>(s&&e(s),u.forEach(e),g.catch((e=>{}))),l.exports=g,r((l=>{var r;c=(l=>l.map((l=>{if(null!==l&&"object"==typeof l){if(l[e])return l;if(l.then){var r=[];r.d=0,l.then((e=>{o[t]=e,a(r)}),(e=>{o[n]=e,a(r)}));var o={};return o[e]=e=>e(r),o}}var s={};return s[e]=e=>{},s[t]=l,s})))(l);var o=()=>c.map((e=>{if(e[n])throw e[n];return e[t]})),i=new Promise((t=>{(r=()=>t(o)).r=0;var n=e=>e!==s&&!u.has(e)&&(u.add(e),e&&!e.d&&(r.r++,e.push(r)));c.map((t=>t[e](n)))}));return r.r?i:o()}),(e=>(e?d(g[n]=e):i(m),a(s)))),s&&s.d<0&&(s.d=0)},o(571)})();