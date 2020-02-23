(this["webpackJsonpxstate-sample-kit"]=this["webpackJsonpxstate-sample-kit"]||[]).push([[0],{102:function(e,t,n){},103:function(e,t,n){},122:function(e,t,n){"use strict";n.r(t);var r,a,o,c,u,i,s,l,d=n(0),m=n.n(d),f=n(64),p=n.n(f),b=(n(102),n(11)),h=(n(103),n(29)),O=n.n(h),v=n(43),E=n(36),g=n(12),j=n(30),y=n(8),w=n(9),x=n(78),k=n.n(x),S=n(61),C={flex:"1 1 auto",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"},T=function(e){return d.createElement(d.Fragment,null,d.createElement("div",{className:k.a.content,style:C},e.children),d.createElement(S.a,{progress:e.loading?void 0:0}))},I=function(e){return function(t){return t[e]}},F=function(e,t){return function(n){return n[e][t]}},L=(r="",n(27)),B=L.c({id:L.a,name:L.b,username:L.b,email:L.b},"User"),N=(I("id"),I("username")),U=function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];return e.replace(/%(\d+)/g,(function(e,t){return"undefined"!=typeof n[t]?n[t]:e}))},J=n(79),V=function(e){return d.createElement("div",{id:"welcome"},U(J["Welcome %username"],N(e.user)))},M=n(58),R=function(e){return d.createElement(M.a,{"data-test":"btn-reset",type:"button",theme:"secondary",onClick:e.onClick},e.children)},P=(n(81),L.c({code:L.a,error:L.b})),G=function(e){return function(t){return t.reason===e}},A=function(e){return function(t){return{reason:e,error:t}}},H=A("api"),W=A("decode"),q=(A("error"),G("api")),$=G("decode"),_=(G("error"),function(e){return function(){var t=Object(v.a)(O.a.mark((function t(n){var r,a,o;return O.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,n();case 3:return r=t.sent,t.next=6,r.json();case 6:a=t.sent,console.log(JSON.stringify(a,null,2)),t.next=20;break;case 15:if(3!==o){t.next=19;break}throw Error(".. my hands up in the air sometime!");case 19:4===o&&delete a.username;case 20:return t.abrupt("return",Object(y.pipe)(e.decode(a),j.mapLeft((function(e){return Object(y.pipe)(P.decode(a),j.map(H),j.fold(Object(w.constant)(W(e)),w.identity))}))));case 23:return t.prev=23,t.t0=t.catch(0),t.abrupt("return",j.left({reason:"error",error:t.t0 instanceof Error?t.t0:Error("".concat(t.t0))}));case 27:case"end":return t.stop()}}),t,null,[[0,23]])})));return function(e){return t.apply(this,arguments)}}()}),D=function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];return e?U.apply(void 0,[e].concat(n)):null},Q=function(e){var t=q(e.failure)?D(e.api,e.failure.error.code,e.failure.error.error):$(e.failure)?D(e.decode):D(e.error,e.failure.error);return t?d.createElement("span",{"data-test":"FailureMessage"},t):null},z=n(22),K=function(e){return d.createElement(Q,{failure:e.failure,api:z["The server responded with code %code"],decode:z["The server has responded with an unknown response."],error:z["The following error has occurred"]})},X=(n(109),n(59)),Y=n(82),Z=n(48),ee=function(e){var t=Object(Z.b)(),n=Object(b.a)(t,2),r=n[0];n[1];return d.createElement("form",null,d.createElement(X.a,{use:"headline3"},"[".concat(r(Y.titleOfShow),"]")),d.createElement("br",null),d.createElement("br",null),e.usernameInput,d.createElement("br",null),e.passwordInput,d.createElement("br",null),d.createElement("div",null,e.loginButton,e.resetButton))},te=function(e){return d.createElement(M.a,Object.assign({},e,{type:"button","data-test":"btn-login",raised:!0,disabled:e.disabled,onClick:e.onClick}),z.Login)},ne=n(130),re=n(34),ae=n(51),oe=n(86),ce=d.createElement(X.a,{use:"headline6"},oe.usernameLabel),ue={block:{display:"block"}},ie=function(e){return d.createElement(d.Fragment,null,d.createElement("div",null,ce),d.createElement("div",null,d.createElement(ae.a,{"data-test":"input-username",value:e.value,placeholder:"Username",required:!0,invalid:e.invalid,disabled:e.disabled,onChange:e.onChange,onFocus:e.onFocus,onBlur:e.onBlur,style:ue.block,helpText:{children:e.invalid?d.createElement("span",null,"A username is required!"):"",validationMsg:!0},icon:d.createElement(re.a,{icon:"person",theme:e.focused?"primary":""})})))},se=n(7),le=n(71),de="pristine",me="dirty",fe="touched",pe="touching",be="untouched",he="focused",Oe="blurred",ve="valid",Ee="invalid",ge="CHANGE",je="FOCUS",ye="BLUR",we="RESET",xe={type:"parallel",states:(s={},Object(se.a)(s,de,{initial:de,states:(a={},Object(se.a)(a,de,{on:Object(se.a)({},ge,{target:me,cond:"isHuman"})}),Object(se.a)(a,me,{on:Object(se.a)({},we,de)}),a)}),Object(se.a)(s,fe,{initial:be,states:(o={},Object(se.a)(o,be,{on:Object(se.a)({},je,{target:pe})}),Object(se.a)(o,pe,{on:Object(se.a)({},ye,{target:fe})}),Object(se.a)(o,fe,{on:Object(se.a)({},we,be)}),o)}),Object(se.a)(s,ve,{initial:Ee,states:(u={},Object(se.a)(u,Ee,{"":{target:ve,cond:"isValid"},on:Object(se.a)({},ge,{target:ve,cond:"isValid"})}),Object(se.a)(u,ve,{on:(c={},Object(se.a)(c,ge,{target:Ee,cond:"isNotValid"}),Object(se.a)(c,we,Ee),c)}),u)}),Object(se.a)(s,he,{initial:Oe,states:(i={},Object(se.a)(i,he,{on:Object(se.a)({},ye,Oe)}),Object(se.a)(i,Oe,{on:Object(se.a)({},je,he)}),i)}),s)},ke=function(e){return e.type===ge},Se=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.isValid,n=void 0===t?function(){return!0}:t;return Object(le.b)(xe,{guards:{isHuman:function(e,t){return!!ke(t)&&!t.isRobot},isValid:function(e,t){return!ke(t)||n(t.value)},isNotValid:function(e,t){return!!ke(t)&&!n(t.value)}}})},Ce=n(128),Te={username:"",password:""},Ie=new Ce.a(Te),Fe=new Ce.a(g.none),Le=n(26),Be=Se({isValid:function(e){return!!e&&!!e.trim()}}),Ne=function(e){return e},Ue=Le.map(F("currentTarget","value")),Je=new Ce.a(!1),Ve=function(e){var t=Object(E.useMachine)(Be),n=Object(b.a)(t,2),r=n[0],a=n[1],o=Object(ne.a)(Ie,Te),c=o.username,u=o.password,i=Object(y.pipe)(Ne,Ue,function(e){return Le.chain((function(t){return function(){return Ie.next({username:t,password:e}),t}}))}(u),function(e){return Le.map((function(t){e({type:ge,value:t})}))}(a),Le.chain((function(e){return function(){return Je.next(r.matches("valid.valid"))}})));return d.createElement(ie,Object.assign({},e,{value:c,invalid:r.matches("touched.touched")&&r.matches("valid.invalid"),focused:r.matches("focused.focused"),onChange:i,onFocus:function(){return a({type:je})},onBlur:function(){return a({type:ye})}}))},Me=n(89),Re=d.createElement(X.a,{use:"headline6"},Me.passwordLabel),Pe={display:"block"},Ge=function(e){return d.createElement(d.Fragment,null,d.createElement("div",null,Re),d.createElement("div",null,d.createElement(ae.a,{"data-test":"input-password",value:e.value,placeholder:"Password",type:"password",required:!0,invalid:e.invalid,disabled:e.disabled,onChange:e.onChange,onFocus:e.onFocus,onBlur:e.onBlur,style:Object.assign({},e.style,Pe),helpText:{children:e.invalid?d.createElement("span",null,"A password is required!"):"",validationMsg:!0},icon:d.createElement(re.a,{icon:e.focused?"lock_open":"lock",theme:e.focused?"primary":""})})))},Ae=Se({isValid:function(e){return!!e&&!!e.trim()}}),He=function(e){return e},We=Le.map(F("currentTarget","value")),qe=new Ce.a(!1),$e=function(e){var t=Object(E.useMachine)(Ae),n=Object(b.a)(t,2),r=n[0],a=n[1],o=Object(ne.a)(Ie,Te),c=o.password,u=o.username,i=Object(y.pipe)(He,We,function(e){return Le.chain((function(t){return function(){return Ie.next({password:t,username:e}),t}}))}(u),function(e){return Le.map((function(t){e({type:ge,value:t})}))}(a),Le.chain((function(e){return function(){return qe.next(r.matches("valid.valid"))}})));return d.createElement(Ge,Object.assign({},e,{value:c,invalid:r.matches("touched.touched")&&r.matches("valid.invalid"),focused:r.matches("focused.focused"),onChange:i,onFocus:function(){return a({type:je})},onBlur:function(){return a({type:ye})}}))},_e=function(e){return m.a.createElement(ee,{usernameInput:m.a.createElement(Ve,{disabled:e.isSubmitting}),passwordInput:m.a.createElement($e,{disabled:e.isSubmitting}),loginButton:m.a.createElement(te,{disabled:e.canNotSubmit,onClick:e.onLogin}),resetButton:e.resetButton})},De=function(){var e=Object(v.a)(O.a.mark((function e(t){return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",_(B)((function(){return fetch("https://jsonplaceholder.typicode.com/users/1")})));case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),Qe=function(e,t){return Object(d.useEffect)((function(){var n=0,r=e.subscribe((function(e){return t&&console.groupCollapsed("".concat(t," (").concat(++n,")")),console.log(JSON.stringify(e.value,null,2)),console.log(JSON.stringify(e.context,null,2)),console.log(e),t&&console.groupEnd(),function(){r.unsubscribe()}}))}),[e,t])},ze="inProgress",Ke="submitting",Xe="done",Ye="SUBMIT",Ze="RESET",et={initial:ze,on:Object(se.a)({},Ze,{target:ze}),states:(l={},Object(se.a)(l,ze,{on:Object(se.a)({},Ye,{target:Ke})}),Object(se.a)(l,Ke,{invoke:{id:"submitOperation",src:"submitOperation",onDone:Xe,onError:Xe}}),Object(se.a)(l,Xe,{}),l)},tt={submitOperation:function(e,t){return t.type===Ye?t.promiser():Promise.reject("submitService invoked by non-submit event!")}},nt=n(88),rt=n(129),at=Object(rt.a)(Je,qe).pipe(Object(nt.a)((function(e){var t=Object(b.a)(e,2),n=t[0],r=t[1];return n&&r}))),ot=Object(le.b)(et,{services:tt}),ct=function(){var e=Object(E.useMachine)(ot),t=Object(b.a)(e,3),n=t[0],r=t[1],a=t[2],o=Object(ne.a)(at,!1),c=Object(ne.a)(Fe,g.none);Qe(a,"login");var u=n.matches("inProgress"),i=!u,s=n.matches("submitting"),l=i||!o,d=Object(y.pipe)(c,g.fold(Object(w.constant)(!1),(function(e){return Object(y.pipe)(e,j.fold(Object(w.constant)(!1),Object(w.constant)(!0)))}))),f=u?z.Reset:s?z.Cancel:d?z.Logout:z["Try again"],p=m.a.createElement(R,{onClick:function(){r({type:Ze}),Ie.next({username:"",password:""}),Fe.next(g.none)}},f),h=m.a.createElement(_e,{isSubmitting:s,canNotSubmit:l,onLogin:function(){r({type:Ye,promiser:function(){var e=Object(v.a)(O.a.mark((function e(){var t;return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,De(Ie.getValue());case 2:return t=e.sent,Fe.next(g.some(t)),Ie.next({username:"",password:""}),e.abrupt("return",t);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()})},resetButton:p}),x=Object(y.pipe)(c,g.fold(Object(w.constant)(h),(function(e){return Object(y.pipe)(e,j.fold((function(e){return m.a.createElement(m.a.Fragment,null,m.a.createElement(K,{failure:e}),p)}),(function(e){return m.a.createElement(m.a.Fragment,null,m.a.createElement(V,{user:e}),p)})))})));return m.a.createElement(T,{loading:s},x)},ut=n(68),it=n(92),st=n(69),lt=function(e){d.useEffect((function(){return st.a.push(e),function(){}}),[e])},dt=n(3),mt={setUserId:Object(dt.b)({userId:function(e,t){return t.userId}}),clearUserId:Object(dt.b)({userId:function(e,t){}})},ft=Object(le.b)({id:"routes",initial:"home",context:{},on:{GOTO:[{target:"home",cond:"home"},{target:"users.user",cond:"users.user"},{target:"users",cond:"users"},{target:"notFound"}]},states:{home:{},users:{initial:"home",states:{home:{},user:{entry:"setUserId",exit:"clearUserId"}}},notFound:{}}},{guards:{home:function(e,t){return"home"===t.route},"users.user":function(e,t){return"users"===t.route&&/^\d+$/.test("".concat(t.userId||""))},users:function(e,t){return"users"===t.route}},actions:mt}),pt=Object(d.createContext)(g.none),bt=pt.Provider,ht=pt.Consumer,Ot=function(e){return d.createElement(ht,null,function(e){return function(t){var n=Object(y.pipe)(t,g.map((function(t){return t.bind(null,Object(ut.a)({type:"GOTO",route:e.to},e.params),void 0)})),g.fold(Object(w.constant)(void 0),w.identity));return d.createElement("a",{href:"#",onClick:n},e.children)}}(e))},vt=function(e){return d.createElement(ht,null,function(e){return function(t){return d.useEffect((function(){Object(y.pipe)(t,g.map((function(t){return function(){t({type:"GOTO",route:e.to})}})),g.fold(Object(w.constant)((function(){})),w.identity))()}),[e.to]),null}}(e))},Et=function(){lt("/users");var e=d.useState([]),t=Object(b.a)(e,2),n=t[0],r=t[1],a=!1;d.useEffect((function(){return fetch("https://jsonplaceholder.typicode.com/users").then((function(e){return e.json()})).then((function(e){return!a&&r(e)})),function(){a=!0}}),[]);var o=n.map((function(e){return d.createElement("li",{key:e.id},d.createElement(Ot,{to:"users",params:{userId:e.id}},e.username))}));return d.createElement("ul",null,o)},gt=function(e){lt("/users/"+e.id);var t=d.useState(void 0),n=Object(b.a)(t,2),r=n[0],a=n[1],o=!1;return d.useEffect((function(){try{fetch("https://jsonplaceholder.typicode.com/users/"+e.id).then((function(e){return e.json()})).then((function(e){o||(e.id?a(e):a(null))}))}catch(t){a(null)}return function(){o=!0}}),[e.id]),null===r?d.createElement(vt,{to:"notFound"}):r?d.createElement("div",null,d.createElement("h1",null,r.username),d.createElement("label",null,d.createElement("strong",null,"Id")),d.createElement("br",null),r.id,d.createElement("hr",null),d.createElement("label",null,d.createElement("strong",null,"Email")),d.createElement("br",null),r.email):"Loading..."},jt=function(){return lt("/"),d.createElement(d.Fragment,null,d.createElement("h1",null,"Hello CodeSandbox"),d.createElement("h2",null,"Start editing to see some magic happen!"),d.createElement(Ot,{to:"users"},"Show users"))},yt=function(){return lt("404"),d.createElement("div",null,"404")},wt=function(e){var t=e.state;return t.matches("home")?d.createElement(jt,null):t.matches("users.user")?t.context.userId?d.createElement(gt,{id:t.context.userId}):d.createElement(vt,{to:"users"}):t.matches("users")?d.createElement(Et,null):t.matches("notFound")?d.createElement(yt,null):d.createElement(vt,{to:"notFound"})},xt=[Object(it.a)(/users\/([0-9]+)/,{userId:1}),/users/],kt=function(){var e=Object(E.useMachine)(ft),t=Object(b.a)(e,3),n=t[0],r=t[1],a=t[2],o=d.useState(!1),c=Object(b.a)(o,2),u=c[0],i=c[1];Qe(a,"router");var s=g.some(r);return d.useEffect((function(){var e=function(e){var t=e.replace(/^\/|\/$/,"");return xt.reduce((function(e,n){if(e.match)return e;if(n instanceof RegExp&&n.test(t)){var r=n.exec(t);if(r){var a=r.groups||{},o=Object.keys(a).reduce((function(e,t){var n=a[t];return e.replace("/".concat(n),"")}),r.input).replace(/\//g,".").replace(/^\.|\.$/,"");return{match:!0,event:Object(ut.a)({type:"GOTO",route:o},a)}}}return e}),{match:!1,event:{type:"GOTO",route:"home"}}).event}(st.a.location.pathname);r(e),i(!0)}),[]),u?d.createElement(bt,{value:s},d.createElement("div",{style:{padding:20}},d.createElement(wt,{state:n}),d.createElement("hr",null),d.createElement(Ot,{to:"home"},"Home"),d.createElement("hr",null),d.createElement(Ot,{to:"free-money"},"Free Money"),d.createElement("hr",null),d.createElement(Ot,{to:"users",params:{userId:1/0}},"User with ",d.createElement("i",null,"Infinite")," id"))):null},St=function(){var e=Object(Z.b)(),t=Object(b.a)(e,2)[1];return m.a.useEffect((function(){t.changeLanguage("nl"),setTimeout((function(){t.changeLanguage("en")}),2500)}),[t]),null},Ct=function(){return m.a.createElement(d.Suspense,{fallback:"..."},m.a.createElement(ct,null),m.a.createElement(St,null),m.a.createElement(kt,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var Tt=n(73),It=n(90),Ft=n(91);Tt.a.use(It.a).use(Ft.a).use(Z.a).init({fallbackLng:"en",debug:!0,backend:{loadPath:"".concat("/xstate-sample-kit","/locales/{{lng}}/{{ns}}.json")},interpolation:{escapeValue:!1}});Tt.a;p.a.render(m.a.createElement(Ct,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},22:function(e){e.exports=JSON.parse('{"Login":"Login","Reset":"Reset","Logout":"Logout","Cancel":"Cancel","Try again":"Try again","The server responded with code %code":"The server responded with %0: %1","The server has responded with an unknown response.":"The server has responded with an unknown response.","The following error has occurred":"The following error has occurred: %0"}')},78:function(e,t,n){e.exports={content:"Content_content__1kQCU"}},79:function(e){e.exports=JSON.parse('{"Welcome %username":"Welcome %0"}')},82:function(e){e.exports=JSON.parse('{"titleOfShow":"title of show"}')},86:function(e){e.exports=JSON.parse('{"usernameLabel":"Username"}')},89:function(e){e.exports=JSON.parse('{"passwordLabel":"Password"}')},97:function(e,t,n){e.exports=n(122)}},[[97,1,2]]]);
//# sourceMappingURL=main.269818f3.chunk.js.map