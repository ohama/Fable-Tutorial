/*!
  Highlight.js v11.11.1 (git: 5697ae5187)
  (c) 2006-2026 Josh Goebel <hello@joshgoebel.com> and other contributors
  License: BSD-3-Clause
 */
var hljs=function(){"use strict";function e(t){
return t instanceof Map?t.clear=t.delete=t.set=()=>{
throw Error("map is read-only")}:t instanceof Set&&(t.add=t.clear=t.delete=()=>{
throw Error("set is read-only")
}),Object.freeze(t),Object.getOwnPropertyNames(t).forEach((n=>{
const i=t[n],s=typeof i;"object"!==s&&"function"!==s||Object.isFrozen(i)||e(i)
})),t}class t{constructor(e){
void 0===e.data&&(e.data={}),this.data=e.data,this.isMatchIgnored=!1}
ignoreMatch(){this.isMatchIgnored=!0}}function n(e){
return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")
}function i(e,...t){const n=Object.create(null);for(const t in e)n[t]=e[t]
;return t.forEach((e=>{for(const t in e)n[t]=e[t]})),n}const s=e=>!!e.scope
;class r{constructor(e,t){
this.buffer="",this.classPrefix=t.classPrefix,e.walk(this)}addText(e){
this.buffer+=n(e)}openNode(e){if(!s(e))return;const t=((e,{prefix:t})=>{
if(e.startsWith("language:"))return e.replace("language:","language-")
;if(e.includes(".")){const n=e.split(".")
;return[`${t}${n.shift()}`,...n.map(((e,t)=>`${e}${"_".repeat(t+1)}`))].join(" ")
}return`${t}${e}`})(e.scope,{prefix:this.classPrefix});this.span(t)}
closeNode(e){s(e)&&(this.buffer+="</span>")}value(){return this.buffer}span(e){
this.buffer+=`<span class="${e}">`}}const o=(e={})=>{const t={children:[]}
;return Object.assign(t,e),t};class a{constructor(){
this.rootNode=o(),this.stack=[this.rootNode]}get top(){
return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(e){
this.top.children.push(e)}openNode(e){const t=o({scope:e})
;this.add(t),this.stack.push(t)}closeNode(){
if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){
for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}
walk(e){return this.constructor._walk(e,this.rootNode)}static _walk(e,t){
return"string"==typeof t?e.addText(t):t.children&&(e.openNode(t),
t.children.forEach((t=>this._walk(e,t))),e.closeNode(t)),e}static _collapse(e){
"string"!=typeof e&&e.children&&(e.children.every((e=>"string"==typeof e))?e.children=[e.children.join("")]:e.children.forEach((e=>{
a._collapse(e)})))}}class c extends a{constructor(e){super(),this.options=e}
addText(e){""!==e&&this.add(e)}startScope(e){this.openNode(e)}endScope(){
this.closeNode()}__addSublanguage(e,t){const n=e.root
;t&&(n.scope="language:"+t),this.add(n)}toHTML(){
return new r(this,this.options).value()}finalize(){
return this.closeAllNodes(),!0}}function l(e){
return RegExp(e.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&"),"m")}function g(e){
return e?"string"==typeof e?e:e.source:null}function u(e){return p("(?=",e,")")}
function d(e){return p("(?:",e,")*")}function h(e){return p("(?:",e,")?")}
function p(...e){return e.map((e=>g(e))).join("")}function f(...e){const t=(e=>{
const t=e[e.length-1]
;return"object"==typeof t&&t.constructor===Object?(e.splice(e.length-1,1),t):{}
})(e);return"("+(t.capture?"":"?:")+e.map((e=>g(e))).join("|")+")"}
function b(e){return RegExp(e.toString()+"|").exec("").length-1}
const m=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./
;function E(e,{joinWith:t}){let n=0;return e.map((e=>{n+=1;const t=n
;let i=g(e),s="";for(;i.length>0;){const e=m.exec(i);if(!e){s+=i;break}
s+=i.substring(0,e.index),
i=i.substring(e.index+e[0].length),"\\"===e[0][0]&&e[1]?s+="\\"+(Number(e[1])+t):(s+=e[0],
"("===e[0]&&n++)}return s})).map((e=>`(${e})`)).join(t)}
const _="[a-zA-Z]\\w*",y="[a-zA-Z_]\\w*",x="\\b\\d+(\\.\\d+)?",w="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",v="\\b(0b[01]+)",S={
begin:"\\\\[\\s\\S]",relevance:0},O={scope:"string",begin:"'",end:"'",
illegal:"\\n",contains:[S]},k={scope:"string",begin:'"',end:'"',illegal:"\\n",
contains:[S]},N=(e,t,n={})=>{const s=i({scope:"comment",begin:e,end:t,
contains:[]},n);s.contains.push({scope:"doctag",
begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0})
;const r=f("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/)
;return s.contains.push({begin:p(/[ ]+/,"(",r,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),s
},A=N("//","$"),M=N("/\\*","\\*/"),R=N("#","$");var j=Object.freeze({
__proto__:null,APOS_STRING_MODE:O,BACKSLASH_ESCAPE:S,BINARY_NUMBER_MODE:{
scope:"number",begin:v,relevance:0},BINARY_NUMBER_RE:v,COMMENT:N,
C_BLOCK_COMMENT_MODE:M,C_LINE_COMMENT_MODE:A,C_NUMBER_MODE:{scope:"number",
begin:w,relevance:0},C_NUMBER_RE:w,END_SAME_AS_BEGIN:e=>Object.assign(e,{
"on:begin":(e,t)=>{t.data._beginMatch=e[1]},"on:end":(e,t)=>{
t.data._beginMatch!==e[1]&&t.ignoreMatch()}}),HASH_COMMENT_MODE:R,IDENT_RE:_,
MATCH_NOTHING_RE:/\b\B/,METHOD_GUARD:{begin:"\\.\\s*"+y,relevance:0},
NUMBER_MODE:{scope:"number",begin:x,relevance:0},NUMBER_RE:x,
PHRASAL_WORDS_MODE:{
begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
},QUOTE_STRING_MODE:k,REGEXP_MODE:{scope:"regexp",begin:/\/(?=[^/\n]*\/)/,
end:/\/[gimuy]*/,contains:[S,{begin:/\[/,end:/\]/,relevance:0,contains:[S]}]},
RE_STARTERS_RE:"!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",
SHEBANG:(e={})=>{const t=/^#![ ]*\//
;return e.binary&&(e.begin=p(t,/.*\b/,e.binary,/\b.*/)),i({scope:"meta",begin:t,
end:/$/,relevance:0,"on:begin":(e,t)=>{0!==e.index&&t.ignoreMatch()}},e)},
TITLE_MODE:{scope:"title",begin:_,relevance:0},UNDERSCORE_IDENT_RE:y,
UNDERSCORE_TITLE_MODE:{scope:"title",begin:y,relevance:0}});function I(e,t){
"."===e.input[e.index-1]&&t.ignoreMatch()}function T(e,t){
void 0!==e.className&&(e.scope=e.className,delete e.className)}function L(e,t){
t&&e.beginKeywords&&(e.begin="\\b("+e.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",
e.__beforeBegin=I,e.keywords=e.keywords||e.beginKeywords,delete e.beginKeywords,
void 0===e.relevance&&(e.relevance=0))}function B(e,t){
Array.isArray(e.illegal)&&(e.illegal=f(...e.illegal))}function C(e,t){
if(e.match){
if(e.begin||e.end)throw Error("begin & end are not supported with match")
;e.begin=e.match,delete e.match}}function D(e,t){
void 0===e.relevance&&(e.relevance=1)}const P=(e,t)=>{if(!e.beforeMatch)return
;if(e.starts)throw Error("beforeMatch cannot be used with starts")
;const n=Object.assign({},e);Object.keys(e).forEach((t=>{delete e[t]
})),e.keywords=n.keywords,e.begin=p(n.beforeMatch,u(n.begin)),e.starts={
relevance:0,contains:[Object.assign(n,{endsParent:!0})]
},e.relevance=0,delete n.beforeMatch
},H=["of","and","for","in","not","or","if","then","parent","list","value"]
;function $(e,t,n="keyword"){const i=Object.create(null)
;return"string"==typeof e?s(n,e.split(" ")):Array.isArray(e)?s(n,e):Object.keys(e).forEach((n=>{
Object.assign(i,$(e[n],t,n))})),i;function s(e,n){
t&&(n=n.map((e=>e.toLowerCase()))),n.forEach((t=>{const n=t.split("|")
;i[n[0]]=[e,U(n[0],n[1])]}))}}function U(e,t){
return t?Number(t):(e=>H.includes(e.toLowerCase()))(e)?0:1}const z={},F=e=>{
console.error(e)},K=(e,...t)=>{console.log("WARN: "+e,...t)},W=(e,t)=>{
z[`${e}/${t}`]||(console.log(`Deprecated as of ${e}. ${t}`),z[`${e}/${t}`]=!0)
},X=Error();function G(e,t,{key:n}){let i=0;const s=e[n],r={},o={}
;for(let e=1;e<=t.length;e++)o[e+i]=s[e],r[e+i]=!0,i+=b(t[e-1])
;e[n]=o,e[n]._emit=r,e[n]._multi=!0}function Z(e){(e=>{
e.scope&&"object"==typeof e.scope&&null!==e.scope&&(e.beginScope=e.scope,
delete e.scope)})(e),"string"==typeof e.beginScope&&(e.beginScope={
_wrap:e.beginScope}),"string"==typeof e.endScope&&(e.endScope={_wrap:e.endScope
}),(e=>{if(Array.isArray(e.begin)){
if(e.skip||e.excludeBegin||e.returnBegin)throw F("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),
X
;if("object"!=typeof e.beginScope||null===e.beginScope)throw F("beginScope must be object"),
X;G(e,e.begin,{key:"beginScope"}),e.begin=E(e.begin,{joinWith:""})}})(e),(e=>{
if(Array.isArray(e.end)){
if(e.skip||e.excludeEnd||e.returnEnd)throw F("skip, excludeEnd, returnEnd not compatible with endScope: {}"),
X
;if("object"!=typeof e.endScope||null===e.endScope)throw F("endScope must be object"),
X;G(e,e.end,{key:"endScope"}),e.end=E(e.end,{joinWith:""})}})(e)}function q(e){
function t(t,n){
return RegExp(g(t),"m"+(e.case_insensitive?"i":"")+(e.unicodeRegex?"u":"")+(n?"g":""))
}class n{constructor(){
this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}
addRule(e,t){
t.position=this.position++,this.matchIndexes[this.matchAt]=t,this.regexes.push([t,e]),
this.matchAt+=b(e)+1}compile(){0===this.regexes.length&&(this.exec=()=>null)
;const e=this.regexes.map((e=>e[1]));this.matcherRe=t(E(e,{joinWith:"|"
}),!0),this.lastIndex=0}exec(e){this.matcherRe.lastIndex=this.lastIndex
;const t=this.matcherRe.exec(e);if(!t)return null
;const n=t.findIndex(((e,t)=>t>0&&void 0!==e)),i=this.matchIndexes[n]
;return t.splice(0,n),Object.assign(t,i)}}class s{constructor(){
this.rules=[],this.multiRegexes=[],
this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(e){
if(this.multiRegexes[e])return this.multiRegexes[e];const t=new n
;return this.rules.slice(e).forEach((([e,n])=>t.addRule(e,n))),
t.compile(),this.multiRegexes[e]=t,t}resumingScanAtSamePosition(){
return 0!==this.regexIndex}considerAll(){this.regexIndex=0}addRule(e,t){
this.rules.push([e,t]),"begin"===t.type&&this.count++}exec(e){
const t=this.getMatcher(this.regexIndex);t.lastIndex=this.lastIndex
;let n=t.exec(e)
;if(this.resumingScanAtSamePosition())if(n&&n.index===this.lastIndex);else{
const t=this.getMatcher(0);t.lastIndex=this.lastIndex+1,n=t.exec(e)}
return n&&(this.regexIndex+=n.position+1,
this.regexIndex===this.count&&this.considerAll()),n}}
if(e.compilerExtensions||(e.compilerExtensions=[]),
e.contains&&e.contains.includes("self"))throw Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.")
;return e.classNameAliases=i(e.classNameAliases||{}),function n(r,o){const a=r
;if(r.isCompiled)return a
;[T,C,Z,P].forEach((e=>e(r,o))),e.compilerExtensions.forEach((e=>e(r,o))),
r.__beforeBegin=null,[L,B,D].forEach((e=>e(r,o))),r.isCompiled=!0;let c=null
;return"object"==typeof r.keywords&&r.keywords.$pattern&&(r.keywords=Object.assign({},r.keywords),
c=r.keywords.$pattern,
delete r.keywords.$pattern),c=c||/\w+/,r.keywords&&(r.keywords=$(r.keywords,e.case_insensitive)),
a.keywordPatternRe=t(c,!0),
o&&(r.begin||(r.begin=/\B|\b/),a.beginRe=t(a.begin),r.end||r.endsWithParent||(r.end=/\B|\b/),
r.end&&(a.endRe=t(a.end)),
a.terminatorEnd=g(a.end)||"",r.endsWithParent&&o.terminatorEnd&&(a.terminatorEnd+=(r.end?"|":"")+o.terminatorEnd)),
r.illegal&&(a.illegalRe=t(r.illegal)),
r.contains||(r.contains=[]),r.contains=[].concat(...r.contains.map((e=>(e=>(e.variants&&!e.cachedVariants&&(e.cachedVariants=e.variants.map((t=>i(e,{
variants:null},t)))),e.cachedVariants?e.cachedVariants:V(e)?i(e,{
starts:e.starts?i(e.starts):null
}):Object.isFrozen(e)?i(e):e))("self"===e?r:e)))),r.contains.forEach((e=>{n(e,a)
})),r.starts&&n(r.starts,o),a.matcher=(e=>{const t=new s
;return e.contains.forEach((e=>t.addRule(e.begin,{rule:e,type:"begin"
}))),e.terminatorEnd&&t.addRule(e.terminatorEnd,{type:"end"
}),e.illegal&&t.addRule(e.illegal,{type:"illegal"}),t})(a),a}(e)}function V(e){
return!!e&&(e.endsWithParent||V(e.starts))}class Y extends Error{
constructor(e,t){super(e),this.name="HTMLInjectionError",this.html=t}}
const J=n,Q=i,ee=Symbol("nomatch"),te=n=>{
const i=Object.create(null),s=Object.create(null),r=[];let o=!0
;const a="Could not find the language '{}', did you forget to load/include a language module?",l={
disableAutodetect:!0,name:"Plain text",contains:[]};let g={
ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,
languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",
cssSelector:"pre code",languages:null,__emitter:c};function b(e){
return g.noHighlightRe.test(e)}function m(e,t,n){let i="",s=""
;"object"==typeof t?(i=e,
n=t.ignoreIllegals,s=t.language):(W("10.7.0","highlight(lang, code, ...args) has been deprecated."),
W("10.7.0","Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277"),
s=e,i=t),void 0===n&&(n=!0);const r={code:i,language:s};k("before:highlight",r)
;const o=r.result?r.result:E(r.language,r.code,n)
;return o.code=r.code,k("after:highlight",o),o}function E(e,n,s,r){
const c=Object.create(null);function l(){if(!k.keywords)return void A.addText(M)
;let e=0;k.keywordPatternRe.lastIndex=0;let t=k.keywordPatternRe.exec(M),n=""
;for(;t;){n+=M.substring(e,t.index)
;const s=w.case_insensitive?t[0].toLowerCase():t[0],r=(i=s,k.keywords[i]);if(r){
const[e,i]=r
;if(A.addText(n),n="",c[s]=(c[s]||0)+1,c[s]<=7&&(R+=i),e.startsWith("_"))n+=t[0];else{
const n=w.classNameAliases[e]||e;d(t[0],n)}}else n+=t[0]
;e=k.keywordPatternRe.lastIndex,t=k.keywordPatternRe.exec(M)}var i
;n+=M.substring(e),A.addText(n)}function u(){null!=k.subLanguage?(()=>{
if(""===M)return;let e=null;if("string"==typeof k.subLanguage){
if(!i[k.subLanguage])return void A.addText(M)
;e=E(k.subLanguage,M,!0,N[k.subLanguage]),N[k.subLanguage]=e._top
}else e=_(M,k.subLanguage.length?k.subLanguage:null)
;k.relevance>0&&(R+=e.relevance),A.__addSublanguage(e._emitter,e.language)
})():l(),M=""}function d(e,t){
""!==e&&(A.startScope(t),A.addText(e),A.endScope())}function h(e,t){let n=1
;const i=t.length-1;for(;n<=i;){if(!e._emit[n]){n++;continue}
const i=w.classNameAliases[e[n]]||e[n],s=t[n];i?d(s,i):(M=s,l(),M=""),n++}}
function p(e,t){
return e.scope&&"string"==typeof e.scope&&A.openNode(w.classNameAliases[e.scope]||e.scope),
e.beginScope&&(e.beginScope._wrap?(d(M,w.classNameAliases[e.beginScope._wrap]||e.beginScope._wrap),
M=""):e.beginScope._multi&&(h(e.beginScope,t),M="")),k=Object.create(e,{parent:{
value:k}}),k}function f(e,n,i){let s=((e,t)=>{const n=e&&e.exec(t)
;return n&&0===n.index})(e.endRe,i);if(s){if(e["on:end"]){const i=new t(e)
;e["on:end"](n,i),i.isMatchIgnored&&(s=!1)}if(s){
for(;e.endsParent&&e.parent;)e=e.parent;return e}}
if(e.endsWithParent)return f(e.parent,n,i)}function b(e){
return 0===k.matcher.regexIndex?(M+=e[0],1):(T=!0,0)}function m(e){
const t=e[0],i=n.substring(e.index),s=f(k,e,i);if(!s)return ee;const r=k
;k.endScope&&k.endScope._wrap?(u(),
d(t,k.endScope._wrap)):k.endScope&&k.endScope._multi?(u(),
h(k.endScope,e)):r.skip?M+=t:(r.returnEnd||r.excludeEnd||(M+=t),
u(),r.excludeEnd&&(M=t));do{
k.scope&&A.closeNode(),k.skip||k.subLanguage||(R+=k.relevance),k=k.parent
}while(k!==s.parent);return s.starts&&p(s.starts,e),r.returnEnd?0:t.length}
let y={};function x(i,r){const a=r&&r[0];if(M+=i,null==a)return u(),0
;if("begin"===y.type&&"end"===r.type&&y.index===r.index&&""===a){
if(M+=n.slice(r.index,r.index+1),!o){const t=Error(`0 width match regex (${e})`)
;throw t.languageName=e,t.badRule=y.rule,t}return 1}
if(y=r,"begin"===r.type)return(e=>{
const n=e[0],i=e.rule,s=new t(i),r=[i.__beforeBegin,i["on:begin"]]
;for(const t of r)if(t&&(t(e,s),s.isMatchIgnored))return b(n)
;return i.skip?M+=n:(i.excludeBegin&&(M+=n),
u(),i.returnBegin||i.excludeBegin||(M=n)),p(i,e),i.returnBegin?0:n.length})(r)
;if("illegal"===r.type&&!s){
const e=Error('Illegal lexeme "'+a+'" for mode "'+(k.scope||"<unnamed>")+'"')
;throw e.mode=k,e}if("end"===r.type){const e=m(r);if(e!==ee)return e}
if("illegal"===r.type&&""===a)return r.index===n.length||(M+="\n"),1
;if(I>1e5&&I>3*r.index)throw Error("potential infinite loop, way more iterations than matches")
;return M+=a,a.length}const w=v(e)
;if(!w)throw F(a.replace("{}",e)),Error('Unknown language: "'+e+'"')
;const S=q(w);let O="",k=r||S;const N={},A=new g.__emitter(g);(()=>{const e=[]
;for(let t=k;t!==w;t=t.parent)t.scope&&e.unshift(t.scope)
;e.forEach((e=>A.openNode(e)))})();let M="",R=0,j=0,I=0,T=!1;try{
if(w.__emitTokens)w.__emitTokens(n,A);else{for(k.matcher.considerAll();;){
I++,T?T=!1:k.matcher.considerAll(),k.matcher.lastIndex=j
;const e=k.matcher.exec(n);if(!e)break;const t=x(n.substring(j,e.index),e)
;j=e.index+t}x(n.substring(j))}return A.finalize(),O=A.toHTML(),{language:e,
value:O,relevance:R,illegal:!1,_emitter:A,_top:k}}catch(t){
if(t.message&&t.message.includes("Illegal"))return{language:e,value:J(n),
illegal:!0,relevance:0,_illegalBy:{message:t.message,index:j,
context:n.slice(j-100,j+100),mode:t.mode,resultSoFar:O},_emitter:A};if(o)return{
language:e,value:J(n),illegal:!1,relevance:0,errorRaised:t,_emitter:A,_top:k}
;throw t}}function _(e,t){t=t||g.languages||Object.keys(i);const n=(e=>{
const t={value:J(e),illegal:!1,relevance:0,_top:l,_emitter:new g.__emitter(g)}
;return t._emitter.addText(e),t})(e),s=t.filter(v).filter(O).map((t=>E(t,e,!1)))
;s.unshift(n);const r=s.sort(((e,t)=>{
if(e.relevance!==t.relevance)return t.relevance-e.relevance
;if(e.language&&t.language){if(v(e.language).supersetOf===t.language)return 1
;if(v(t.language).supersetOf===e.language)return-1}return 0})),[o,a]=r,c=o
;return c.secondBest=a,c}function y(e){let t=null;const n=(e=>{
let t=e.className+" ";t+=e.parentNode?e.parentNode.className:""
;const n=g.languageDetectRe.exec(t);if(n){const t=v(n[1])
;return t||(K(a.replace("{}",n[1])),
K("Falling back to no-highlight mode for this block.",e)),t?n[1]:"no-highlight"}
return t.split(/\s+/).find((e=>b(e)||v(e)))})(e);if(b(n))return
;if(k("before:highlightElement",{el:e,language:n
}),e.dataset.highlighted)return void console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",e)
;if(e.children.length>0&&(g.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),
console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),
console.warn("The element with unescaped HTML:"),
console.warn(e)),g.throwUnescapedHTML))throw new Y("One of your code blocks includes unescaped HTML.",e.innerHTML)
;t=e;const i=t.textContent,r=n?m(i,{language:n,ignoreIllegals:!0}):_(i)
;e.innerHTML=r.value,e.dataset.highlighted="yes",((e,t,n)=>{const i=t&&s[t]||n
;e.classList.add("hljs"),e.classList.add("language-"+i)
})(e,n,r.language),e.result={language:r.language,re:r.relevance,
relevance:r.relevance},r.secondBest&&(e.secondBest={
language:r.secondBest.language,relevance:r.secondBest.relevance
}),k("after:highlightElement",{el:e,result:r,text:i})}let x=!1;function w(){
if("loading"===document.readyState)return x||window.addEventListener("DOMContentLoaded",(()=>{
w()}),!1),void(x=!0);document.querySelectorAll(g.cssSelector).forEach(y)}
function v(e){return e=(e||"").toLowerCase(),i[e]||i[s[e]]}
function S(e,{languageName:t}){"string"==typeof e&&(e=[e]),e.forEach((e=>{
s[e.toLowerCase()]=t}))}function O(e){const t=v(e)
;return t&&!t.disableAutodetect}function k(e,t){const n=e;r.forEach((e=>{
e[n]&&e[n](t)}))}Object.assign(n,{highlight:m,highlightAuto:_,highlightAll:w,
highlightElement:y,
highlightBlock:e=>(W("10.7.0","highlightBlock will be removed entirely in v12.0"),
W("10.7.0","Please use highlightElement now."),y(e)),configure:e=>{g=Q(g,e)},
initHighlighting:()=>{
w(),W("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")},
initHighlightingOnLoad:()=>{
w(),W("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")
},registerLanguage:(e,t)=>{let s=null;try{s=t(n)}catch(t){
if(F("Language definition for '{}' could not be registered.".replace("{}",e)),
!o)throw t;F(t),s=l}
s.name||(s.name=e),i[e]=s,s.rawDefinition=t.bind(null,n),s.aliases&&S(s.aliases,{
languageName:e})},unregisterLanguage:e=>{delete i[e]
;for(const t of Object.keys(s))s[t]===e&&delete s[t]},
listLanguages:()=>Object.keys(i),getLanguage:v,registerAliases:S,
autoDetection:O,inherit:Q,addPlugin:e=>{(e=>{
e["before:highlightBlock"]&&!e["before:highlightElement"]&&(e["before:highlightElement"]=t=>{
e["before:highlightBlock"](Object.assign({block:t.el},t))
}),e["after:highlightBlock"]&&!e["after:highlightElement"]&&(e["after:highlightElement"]=t=>{
e["after:highlightBlock"](Object.assign({block:t.el},t))})})(e),r.push(e)},
removePlugin:e=>{const t=r.indexOf(e);-1!==t&&r.splice(t,1)}}),n.debugMode=()=>{
o=!1},n.safeMode=()=>{o=!0},n.versionString="11.11.1",n.regex={concat:p,
lookahead:u,either:f,optional:h,anyNumberOfTimes:d}
;for(const t in j)"object"==typeof j[t]&&e(j[t]);return Object.assign(n,j),n
},ne=te({});ne.newInstance=()=>te({});var ie=Object.freeze({__proto__:null,
grmr_fsharp:e=>{const t={scope:"keyword",
match:/\b(yield|return|let|do|match|use)!/
},n=["bool","byte","sbyte","int8","int16","int32","uint8","uint16","uint32","int","uint","int64","uint64","nativeint","unativeint","decimal","float","double","float32","single","char","string","unit","bigint","option","voption","list","array","seq","byref","exn","inref","nativeptr","obj","outref","voidptr","Result"],i={
keyword:["abstract","and","as","assert","base","begin","class","default","delegate","do","done","downcast","downto","elif","else","end","exception","extern","finally","fixed","for","fun","function","global","if","in","inherit","inline","interface","internal","lazy","let","match","member","module","mutable","namespace","new","of","open","or","override","private","public","rec","return","static","struct","then","to","try","type","upcast","use","val","void","when","while","with","yield"],
literal:["true","false","null","Some","None","Ok","Error","infinity","infinityf","nan","nanf"],
built_in:["not","ref","raise","reraise","dict","readOnlyDict","set","get","enum","sizeof","typeof","typedefof","nameof","nullArg","invalidArg","invalidOp","id","fst","snd","ignore","lock","using","box","unbox","tryUnbox","printf","printfn","sprintf","eprintf","eprintfn","fprintf","fprintfn","failwith","failwithf"],
"variable.constant":["__LINE__","__SOURCE_DIRECTORY__","__SOURCE_FILE__"]},s={
variants:[e.COMMENT(/\(\*(?!\))/,/\*\)/,{contains:["self"]
}),e.C_LINE_COMMENT_MODE]},r={scope:"variable",begin:/``/,end:/``/
},o=/\B('|\^)/,a={scope:"symbol",variants:[{match:p(o,/``.*?``/)},{
match:p(o,e.UNDERSCORE_IDENT_RE)}],relevance:0},c=({includeEqual:e})=>{let t
;t=e?"!%&*+-/<=>@^|~?":"!%&*+-/<>@^|~?"
;const n=p("[",...Array.from(t).map(l),"]"),i=f(n,/\./),s=p(i,u(i)),r=f(p(s,i,"*"),p(n,"+"))
;return{scope:"operator",match:f(r,/:\?>/,/:\?/,/:>/,/:=/,/::?/,/\$/),
relevance:0}},g=c({includeEqual:!0}),d=c({includeEqual:!1}),h=(t,o)=>({
begin:p(t,u(p(/\s*/,f(/\w/,/'/,/\^/,/#/,/``/,/\(/,/{\|/)))),beginScope:o,
end:u(f(/\n/,/=/)),relevance:0,keywords:e.inherit(i,{type:n}),
contains:[s,a,e.inherit(r,{scope:null}),d]
}),b=h(/:/,"operator"),m=h(/\bof\b/,"keyword"),E={
begin:[/(^|\s+)/,/type/,/\s+/,/[a-zA-Z_](\w|')*/],beginScope:{2:"keyword",
4:"title.class"},end:u(/\(|=|$/),keywords:i,contains:[s,e.inherit(r,{scope:null
}),a,{scope:"operator",match:/<|>/},b]},_={scope:"computation-expression",
match:/\b[_a-z]\w*(?=\s*\{)/},y={
begin:[/^\s*/,p(/#/,f("if","else","endif","line","nowarn","light","r","i","I","load","time","help","quit")),/\b/],
beginScope:{2:"meta"},end:u(/\s|$/)},x={
variants:[e.BINARY_NUMBER_MODE,e.C_NUMBER_MODE]},w={scope:"string",begin:/"/,
end:/"/,contains:[e.BACKSLASH_ESCAPE]},v={scope:"string",begin:/@"/,end:/"/,
contains:[{match:/""/},e.BACKSLASH_ESCAPE]},S={scope:"string",begin:/"""/,
end:/"""/,relevance:2},O={scope:"subst",begin:/\{/,end:/\}/,keywords:i},k={
scope:"string",begin:/\$"/,end:/"/,contains:[{match:/\{\{/},{match:/\}\}/
},e.BACKSLASH_ESCAPE,O]},N={scope:"string",begin:/(\$@|@\$)"/,end:/"/,
contains:[{match:/\{\{/},{match:/\}\}/},{match:/""/},e.BACKSLASH_ESCAPE,O]},A={
scope:"string",begin:/\$"""/,end:/"""/,contains:[{match:/\{\{/},{match:/\}\}/
},O],relevance:2},M={scope:"string",
match:p(/'/,f(/[^\\']/,/\\(?:.|\d{3}|x[a-fA-F\d]{2}|u[a-fA-F\d]{4}|U[a-fA-F\d]{8})/),/'/)
};return O.contains=[N,k,v,w,M,t,s,r,b,_,y,x,a,g],{name:"F#",
aliases:["fs","f#"],keywords:i,illegal:/\/\*/,classNameAliases:{
"computation-expression":"keyword"},contains:[t,{variants:[A,N,k,S,v,w,M]
},s,r,E,{scope:"meta",begin:/\[</,end:/>\]/,relevance:2,contains:[r,S,v,w,M,x]
},m,b,_,y,x,a,g]}}});const se=ne;for(const e of Object.keys(ie)){
const t=e.replace("grmr_","").replace("_","-");se.registerLanguage(t,ie[e])}
return se}()
;"object"==typeof exports&&"undefined"!=typeof module&&(module.exports=hljs);