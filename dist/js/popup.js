(()=>{"use strict";(()=>{const e=document.getElementById("filterButton"),t=document.getElementById("optionsButton");document.addEventListener("DOMContentLoaded",(()=>{e.addEventListener("click",(async()=>{try{await(async()=>{await chrome.runtime.sendMessage(JSON.stringify({key:"refreshFilters"}))})()}catch(e){console.log(e)}}))})),document.addEventListener("DOMContentLoaded",(()=>{t.addEventListener("click",(()=>{chrome.runtime.openOptionsPage()}))}))})()})();