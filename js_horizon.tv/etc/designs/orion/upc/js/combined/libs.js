/*!
 * jQuery JavaScript Library v1.7.1
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Mon Nov 21 21:11:03 2011 -0500
 */
(function(window,undefined){var document=window.document,navigator=window.navigator,location=window.location;
var jQuery=(function(){var jQuery=function(selector,context){return new jQuery.fn.init(selector,context,rootjQuery)
},_jQuery=window.jQuery,_$=window.$,rootjQuery,quickExpr=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,rnotwhite=/\S/,trimLeft=/^\s+/,trimRight=/\s+$/,rsingleTag=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,rvalidchars=/^[\],:{}\s]*$/,rvalidescape=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,rvalidtokens=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,rvalidbraces=/(?:^|:|,)(?:\s*\[)+/g,rwebkit=/(webkit)[ \/]([\w.]+)/,ropera=/(opera)(?:.*version)?[ \/]([\w.]+)/,rmsie=/(msie) ([\w.]+)/,rmozilla=/(mozilla)(?:.*? rv:([\w.]+))?/,rdashAlpha=/-([a-z]|[0-9])/ig,rmsPrefix=/^-ms-/,fcamelCase=function(all,letter){return(letter+"").toUpperCase()
},userAgent=navigator.userAgent,browserMatch,readyList,DOMContentLoaded,toString=Object.prototype.toString,hasOwn=Object.prototype.hasOwnProperty,push=Array.prototype.push,slice=Array.prototype.slice,trim=String.prototype.trim,indexOf=Array.prototype.indexOf,class2type={};
jQuery.fn=jQuery.prototype={constructor:jQuery,init:function(selector,context,rootjQuery){var match,elem,ret,doc;
if(!selector){return this
}if(selector.nodeType){this.context=this[0]=selector;
this.length=1;
return this
}if(selector==="body"&&!context&&document.body){this.context=document;
this[0]=document.body;
this.selector=selector;
this.length=1;
return this
}if(typeof selector==="string"){if(selector.charAt(0)==="<"&&selector.charAt(selector.length-1)===">"&&selector.length>=3){match=[null,selector,null]
}else{match=quickExpr.exec(selector)
}if(match&&(match[1]||!context)){if(match[1]){context=context instanceof jQuery?context[0]:context;
doc=(context?context.ownerDocument||context:document);
ret=rsingleTag.exec(selector);
if(ret){if(jQuery.isPlainObject(context)){selector=[document.createElement(ret[1])];
jQuery.fn.attr.call(selector,context,true)
}else{selector=[doc.createElement(ret[1])]
}}else{ret=jQuery.buildFragment([match[1]],[doc]);
selector=(ret.cacheable?jQuery.clone(ret.fragment):ret.fragment).childNodes
}return jQuery.merge(this,selector)
}else{elem=document.getElementById(match[2]);
if(elem&&elem.parentNode){if(elem.id!==match[2]){return rootjQuery.find(selector)
}this.length=1;
this[0]=elem
}this.context=document;
this.selector=selector;
return this
}}else{if(!context||context.jquery){return(context||rootjQuery).find(selector)
}else{return this.constructor(context).find(selector)
}}}else{if(jQuery.isFunction(selector)){return rootjQuery.ready(selector)
}}if(selector.selector!==undefined){this.selector=selector.selector;
this.context=selector.context
}return jQuery.makeArray(selector,this)
},selector:"",jquery:"1.7.1",length:0,size:function(){return this.length
},toArray:function(){return slice.call(this,0)
},get:function(num){return num==null?this.toArray():(num<0?this[this.length+num]:this[num])
},pushStack:function(elems,name,selector){var ret=this.constructor();
if(jQuery.isArray(elems)){push.apply(ret,elems)
}else{jQuery.merge(ret,elems)
}ret.prevObject=this;
ret.context=this.context;
if(name==="find"){ret.selector=this.selector+(this.selector?" ":"")+selector
}else{if(name){ret.selector=this.selector+"."+name+"("+selector+")"
}}return ret
},each:function(callback,args){return jQuery.each(this,callback,args)
},ready:function(fn){jQuery.bindReady();
readyList.add(fn);
return this
},eq:function(i){i=+i;
return i===-1?this.slice(i):this.slice(i,i+1)
},first:function(){return this.eq(0)
},last:function(){return this.eq(-1)
},slice:function(){return this.pushStack(slice.apply(this,arguments),"slice",slice.call(arguments).join(","))
},map:function(callback){return this.pushStack(jQuery.map(this,function(elem,i){return callback.call(elem,i,elem)
}))
},end:function(){return this.prevObject||this.constructor(null)
},push:push,sort:[].sort,splice:[].splice};
jQuery.fn.init.prototype=jQuery.fn;
jQuery.extend=jQuery.fn.extend=function(){var options,name,src,copy,copyIsArray,clone,target=arguments[0]||{},i=1,length=arguments.length,deep=false;
if(typeof target==="boolean"){deep=target;
target=arguments[1]||{};
i=2
}if(typeof target!=="object"&&!jQuery.isFunction(target)){target={}
}if(length===i){target=this;
--i
}for(;
i<length;
i++){if((options=arguments[i])!=null){for(name in options){src=target[name];
copy=options[name];
if(target===copy){continue
}if(deep&&copy&&(jQuery.isPlainObject(copy)||(copyIsArray=jQuery.isArray(copy)))){if(copyIsArray){copyIsArray=false;
clone=src&&jQuery.isArray(src)?src:[]
}else{clone=src&&jQuery.isPlainObject(src)?src:{}
}target[name]=jQuery.extend(deep,clone,copy)
}else{if(copy!==undefined){target[name]=copy
}}}}}return target
};
jQuery.extend({noConflict:function(deep){if(window.$===jQuery){window.$=_$
}if(deep&&window.jQuery===jQuery){window.jQuery=_jQuery
}return jQuery
},isReady:false,readyWait:1,holdReady:function(hold){if(hold){jQuery.readyWait++
}else{jQuery.ready(true)
}},ready:function(wait){if((wait===true&&!--jQuery.readyWait)||(wait!==true&&!jQuery.isReady)){if(!document.body){return setTimeout(jQuery.ready,1)
}jQuery.isReady=true;
if(wait!==true&&--jQuery.readyWait>0){return
}readyList.fireWith(document,[jQuery]);
if(jQuery.fn.trigger){jQuery(document).trigger("ready").off("ready")
}}},bindReady:function(){if(readyList){return
}readyList=jQuery.Callbacks("once memory");
if(document.readyState==="complete"){return setTimeout(jQuery.ready,1)
}if(document.addEventListener){document.addEventListener("DOMContentLoaded",DOMContentLoaded,false);
window.addEventListener("load",jQuery.ready,false)
}else{if(document.attachEvent){document.attachEvent("onreadystatechange",DOMContentLoaded);
window.attachEvent("onload",jQuery.ready);
var toplevel=false;
try{toplevel=window.frameElement==null
}catch(e){}if(document.documentElement.doScroll&&toplevel){doScrollCheck()
}}}},isFunction:function(obj){return jQuery.type(obj)==="function"
},isArray:Array.isArray||function(obj){return jQuery.type(obj)==="array"
},isWindow:function(obj){return obj&&typeof obj==="object"&&"setInterval" in obj
},isNumeric:function(obj){return !isNaN(parseFloat(obj))&&isFinite(obj)
},type:function(obj){return obj==null?String(obj):class2type[toString.call(obj)]||"object"
},isPlainObject:function(obj){if(!obj||jQuery.type(obj)!=="object"||obj.nodeType||jQuery.isWindow(obj)){return false
}try{if(obj.constructor&&!hasOwn.call(obj,"constructor")&&!hasOwn.call(obj.constructor.prototype,"isPrototypeOf")){return false
}}catch(e){return false
}var key;
for(key in obj){}return key===undefined||hasOwn.call(obj,key)
},isEmptyObject:function(obj){for(var name in obj){return false
}return true
},error:function(msg){throw new Error(msg)
},parseJSON:function(data){if(typeof data!=="string"||!data){return null
}data=jQuery.trim(data);
if(window.JSON&&window.JSON.parse){return window.JSON.parse(data)
}if(rvalidchars.test(data.replace(rvalidescape,"@").replace(rvalidtokens,"]").replace(rvalidbraces,""))){return(new Function("return "+data))()
}jQuery.error("Invalid JSON: "+data)
},parseXML:function(data){var xml,tmp;
try{if(window.DOMParser){tmp=new DOMParser();
xml=tmp.parseFromString(data,"text/xml")
}else{xml=new ActiveXObject("Microsoft.XMLDOM");
xml.async="false";
xml.loadXML(data)
}}catch(e){xml=undefined
}if(!xml||!xml.documentElement||xml.getElementsByTagName("parsererror").length){jQuery.error("Invalid XML: "+data)
}return xml
},noop:function(){},globalEval:function(data){if(data&&rnotwhite.test(data)){(window.execScript||function(data){window["eval"].call(window,data)
})(data)
}},camelCase:function(string){return string.replace(rmsPrefix,"ms-").replace(rdashAlpha,fcamelCase)
},nodeName:function(elem,name){return elem.nodeName&&elem.nodeName.toUpperCase()===name.toUpperCase()
},each:function(object,callback,args){var name,i=0,length=object.length,isObj=length===undefined||jQuery.isFunction(object);
if(args){if(isObj){for(name in object){if(callback.apply(object[name],args)===false){break
}}}else{for(;
i<length;
){if(callback.apply(object[i++],args)===false){break
}}}}else{if(isObj){for(name in object){if(callback.call(object[name],name,object[name])===false){break
}}}else{for(;
i<length;
){if(callback.call(object[i],i,object[i++])===false){break
}}}}return object
},trim:trim?function(text){return text==null?"":trim.call(text)
}:function(text){return text==null?"":text.toString().replace(trimLeft,"").replace(trimRight,"")
},makeArray:function(array,results){var ret=results||[];
if(array!=null){var type=jQuery.type(array);
if(array.length==null||type==="string"||type==="function"||type==="regexp"||jQuery.isWindow(array)){push.call(ret,array)
}else{jQuery.merge(ret,array)
}}return ret
},inArray:function(elem,array,i){var len;
if(array){if(indexOf){return indexOf.call(array,elem,i)
}len=array.length;
i=i?i<0?Math.max(0,len+i):i:0;
for(;
i<len;
i++){if(i in array&&array[i]===elem){return i
}}}return -1
},merge:function(first,second){var i=first.length,j=0;
if(typeof second.length==="number"){for(var l=second.length;
j<l;
j++){first[i++]=second[j]
}}else{while(second[j]!==undefined){first[i++]=second[j++]
}}first.length=i;
return first
},grep:function(elems,callback,inv){var ret=[],retVal;
inv=!!inv;
for(var i=0,length=elems.length;
i<length;
i++){retVal=!!callback(elems[i],i);
if(inv!==retVal){ret.push(elems[i])
}}return ret
},map:function(elems,callback,arg){var value,key,ret=[],i=0,length=elems.length,isArray=elems instanceof jQuery||length!==undefined&&typeof length==="number"&&((length>0&&elems[0]&&elems[length-1])||length===0||jQuery.isArray(elems));
if(isArray){for(;
i<length;
i++){value=callback(elems[i],i,arg);
if(value!=null){ret[ret.length]=value
}}}else{for(key in elems){value=callback(elems[key],key,arg);
if(value!=null){ret[ret.length]=value
}}}return ret.concat.apply([],ret)
},guid:1,proxy:function(fn,context){if(typeof context==="string"){var tmp=fn[context];
context=fn;
fn=tmp
}if(!jQuery.isFunction(fn)){return undefined
}var args=slice.call(arguments,2),proxy=function(){return fn.apply(context,args.concat(slice.call(arguments)))
};
proxy.guid=fn.guid=fn.guid||proxy.guid||jQuery.guid++;
return proxy
},access:function(elems,key,value,exec,fn,pass){var length=elems.length;
if(typeof key==="object"){for(var k in key){jQuery.access(elems,k,key[k],exec,fn,value)
}return elems
}if(value!==undefined){exec=!pass&&exec&&jQuery.isFunction(value);
for(var i=0;
i<length;
i++){fn(elems[i],key,exec?value.call(elems[i],i,fn(elems[i],key)):value,pass)
}return elems
}return length?fn(elems[0],key):undefined
},now:function(){return(new Date()).getTime()
},uaMatch:function(ua){ua=ua.toLowerCase();
var match=rwebkit.exec(ua)||ropera.exec(ua)||rmsie.exec(ua)||ua.indexOf("compatible")<0&&rmozilla.exec(ua)||[];
return{browser:match[1]||"",version:match[2]||"0"}
},sub:function(){function jQuerySub(selector,context){return new jQuerySub.fn.init(selector,context)
}jQuery.extend(true,jQuerySub,this);
jQuerySub.superclass=this;
jQuerySub.fn=jQuerySub.prototype=this();
jQuerySub.fn.constructor=jQuerySub;
jQuerySub.sub=this.sub;
jQuerySub.fn.init=function init(selector,context){if(context&&context instanceof jQuery&&!(context instanceof jQuerySub)){context=jQuerySub(context)
}return jQuery.fn.init.call(this,selector,context,rootjQuerySub)
};
jQuerySub.fn.init.prototype=jQuerySub.fn;
var rootjQuerySub=jQuerySub(document);
return jQuerySub
},browser:{}});
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(i,name){class2type["[object "+name+"]"]=name.toLowerCase()
});
browserMatch=jQuery.uaMatch(userAgent);
if(browserMatch.browser){jQuery.browser[browserMatch.browser]=true;
jQuery.browser.version=browserMatch.version
}if(jQuery.browser.webkit){jQuery.browser.safari=true
}if(rnotwhite.test("\xA0")){trimLeft=/^[\s\xA0]+/;
trimRight=/[\s\xA0]+$/
}rootjQuery=jQuery(document);
if(document.addEventListener){DOMContentLoaded=function(){document.removeEventListener("DOMContentLoaded",DOMContentLoaded,false);
jQuery.ready()
}
}else{if(document.attachEvent){DOMContentLoaded=function(){if(document.readyState==="complete"){document.detachEvent("onreadystatechange",DOMContentLoaded);
jQuery.ready()
}}
}}function doScrollCheck(){if(jQuery.isReady){return
}try{document.documentElement.doScroll("left")
}catch(e){setTimeout(doScrollCheck,1);
return
}jQuery.ready()
}return jQuery
})();
var flagsCache={};
function createFlags(flags){var object=flagsCache[flags]={},i,length;
flags=flags.split(/\s+/);
for(i=0,length=flags.length;
i<length;
i++){object[flags[i]]=true
}return object
}jQuery.Callbacks=function(flags){flags=flags?(flagsCache[flags]||createFlags(flags)):{};
var list=[],stack=[],memory,firing,firingStart,firingLength,firingIndex,add=function(args){var i,length,elem,type,actual;
for(i=0,length=args.length;
i<length;
i++){elem=args[i];
type=jQuery.type(elem);
if(type==="array"){add(elem)
}else{if(type==="function"){if(!flags.unique||!self.has(elem)){list.push(elem)
}}}}},fire=function(context,args){args=args||[];
memory=!flags.memory||[context,args];
firing=true;
firingIndex=firingStart||0;
firingStart=0;
firingLength=list.length;
for(;
list&&firingIndex<firingLength;
firingIndex++){if(list[firingIndex].apply(context,args)===false&&flags.stopOnFalse){memory=true;
break
}}firing=false;
if(list){if(!flags.once){if(stack&&stack.length){memory=stack.shift();
self.fireWith(memory[0],memory[1])
}}else{if(memory===true){self.disable()
}else{list=[]
}}}},self={add:function(){if(list){var length=list.length;
add(arguments);
if(firing){firingLength=list.length
}else{if(memory&&memory!==true){firingStart=length;
fire(memory[0],memory[1])
}}}return this
},remove:function(){if(list){var args=arguments,argIndex=0,argLength=args.length;
for(;
argIndex<argLength;
argIndex++){for(var i=0;
i<list.length;
i++){if(args[argIndex]===list[i]){if(firing){if(i<=firingLength){firingLength--;
if(i<=firingIndex){firingIndex--
}}}list.splice(i--,1);
if(flags.unique){break
}}}}}return this
},has:function(fn){if(list){var i=0,length=list.length;
for(;
i<length;
i++){if(fn===list[i]){return true
}}}return false
},empty:function(){list=[];
return this
},disable:function(){list=stack=memory=undefined;
return this
},disabled:function(){return !list
},lock:function(){stack=undefined;
if(!memory||memory===true){self.disable()
}return this
},locked:function(){return !stack
},fireWith:function(context,args){if(stack){if(firing){if(!flags.once){stack.push([context,args])
}}else{if(!(flags.once&&memory)){fire(context,args)
}}}return this
},fire:function(){self.fireWith(this,arguments);
return this
},fired:function(){return !!memory
}};
return self
};
var sliceDeferred=[].slice;
jQuery.extend({Deferred:function(func){var doneList=jQuery.Callbacks("once memory"),failList=jQuery.Callbacks("once memory"),progressList=jQuery.Callbacks("memory"),state="pending",lists={resolve:doneList,reject:failList,notify:progressList},promise={done:doneList.add,fail:failList.add,progress:progressList.add,state:function(){return state
},isResolved:doneList.fired,isRejected:failList.fired,then:function(doneCallbacks,failCallbacks,progressCallbacks){deferred.done(doneCallbacks).fail(failCallbacks).progress(progressCallbacks);
return this
},always:function(){deferred.done.apply(deferred,arguments).fail.apply(deferred,arguments);
return this
},pipe:function(fnDone,fnFail,fnProgress){return jQuery.Deferred(function(newDefer){jQuery.each({done:[fnDone,"resolve"],fail:[fnFail,"reject"],progress:[fnProgress,"notify"]},function(handler,data){var fn=data[0],action=data[1],returned;
if(jQuery.isFunction(fn)){deferred[handler](function(){returned=fn.apply(this,arguments);
if(returned&&jQuery.isFunction(returned.promise)){returned.promise().then(newDefer.resolve,newDefer.reject,newDefer.notify)
}else{newDefer[action+"With"](this===deferred?newDefer:this,[returned])
}})
}else{deferred[handler](newDefer[action])
}})
}).promise()
},promise:function(obj){if(obj==null){obj=promise
}else{for(var key in promise){obj[key]=promise[key]
}}return obj
}},deferred=promise.promise({}),key;
for(key in lists){deferred[key]=lists[key].fire;
deferred[key+"With"]=lists[key].fireWith
}deferred.done(function(){state="resolved"
},failList.disable,progressList.lock).fail(function(){state="rejected"
},doneList.disable,progressList.lock);
if(func){func.call(deferred,deferred)
}return deferred
},when:function(firstParam){var args=sliceDeferred.call(arguments,0),i=0,length=args.length,pValues=new Array(length),count=length,pCount=length,deferred=length<=1&&firstParam&&jQuery.isFunction(firstParam.promise)?firstParam:jQuery.Deferred(),promise=deferred.promise();
function resolveFunc(i){return function(value){args[i]=arguments.length>1?sliceDeferred.call(arguments,0):value;
if(!(--count)){deferred.resolveWith(deferred,args)
}}
}function progressFunc(i){return function(value){pValues[i]=arguments.length>1?sliceDeferred.call(arguments,0):value;
deferred.notifyWith(promise,pValues)
}
}if(length>1){for(;
i<length;
i++){if(args[i]&&args[i].promise&&jQuery.isFunction(args[i].promise)){args[i].promise().then(resolveFunc(i),deferred.reject,progressFunc(i))
}else{--count
}}if(!count){deferred.resolveWith(deferred,args)
}}else{if(deferred!==firstParam){deferred.resolveWith(deferred,length?[firstParam]:[])
}}return promise
}});
jQuery.support=(function(){var support,all,a,select,opt,input,marginDiv,fragment,tds,events,eventName,i,isSupported,div=document.createElement("div"),documentElement=document.documentElement;
div.setAttribute("className","t");
div.innerHTML="   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";
all=div.getElementsByTagName("*");
a=div.getElementsByTagName("a")[0];
if(!all||!all.length||!a){return{}
}select=document.createElement("select");
opt=select.appendChild(document.createElement("option"));
input=div.getElementsByTagName("input")[0];
support={leadingWhitespace:(div.firstChild.nodeType===3),tbody:!div.getElementsByTagName("tbody").length,htmlSerialize:!!div.getElementsByTagName("link").length,style:/top/.test(a.getAttribute("style")),hrefNormalized:(a.getAttribute("href")==="/a"),opacity:/^0.55/.test(a.style.opacity),cssFloat:!!a.style.cssFloat,checkOn:(input.value==="on"),optSelected:opt.selected,getSetAttribute:div.className!=="t",enctype:!!document.createElement("form").enctype,html5Clone:document.createElement("nav").cloneNode(true).outerHTML!=="<:nav></:nav>",submitBubbles:true,changeBubbles:true,focusinBubbles:false,deleteExpando:true,noCloneEvent:true,inlineBlockNeedsLayout:false,shrinkWrapBlocks:false,reliableMarginRight:true};
input.checked=true;
support.noCloneChecked=input.cloneNode(true).checked;
select.disabled=true;
support.optDisabled=!opt.disabled;
try{delete div.test
}catch(e){support.deleteExpando=false
}if(!div.addEventListener&&div.attachEvent&&div.fireEvent){div.attachEvent("onclick",function(){support.noCloneEvent=false
});
div.cloneNode(true).fireEvent("onclick")
}input=document.createElement("input");
input.value="t";
input.setAttribute("type","radio");
support.radioValue=input.value==="t";
input.setAttribute("checked","checked");
div.appendChild(input);
fragment=document.createDocumentFragment();
fragment.appendChild(div.lastChild);
support.checkClone=fragment.cloneNode(true).cloneNode(true).lastChild.checked;
support.appendChecked=input.checked;
fragment.removeChild(input);
fragment.appendChild(div);
div.innerHTML="";
if(window.getComputedStyle){marginDiv=document.createElement("div");
marginDiv.style.width="0";
marginDiv.style.marginRight="0";
div.style.width="2px";
div.appendChild(marginDiv);
support.reliableMarginRight=(parseInt((window.getComputedStyle(marginDiv,null)||{marginRight:0}).marginRight,10)||0)===0
}if(div.attachEvent){for(i in {submit:1,change:1,focusin:1}){eventName="on"+i;
isSupported=(eventName in div);
if(!isSupported){div.setAttribute(eventName,"return;");
isSupported=(typeof div[eventName]==="function")
}support[i+"Bubbles"]=isSupported
}}fragment.removeChild(div);
fragment=select=opt=marginDiv=div=input=null;
jQuery(function(){var container,outer,inner,table,td,offsetSupport,conMarginTop,ptlm,vb,style,html,body=document.getElementsByTagName("body")[0];
if(!body){return
}conMarginTop=1;
ptlm="position:absolute;top:0;left:0;width:1px;height:1px;margin:0;";
vb="visibility:hidden;border:0;";
style="style='"+ptlm+"border:5px solid #000;padding:0;'";
html="<div "+style+"><div></div></div><table "+style+" cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";
container=document.createElement("div");
container.style.cssText=vb+"width:0;height:0;position:static;top:0;margin-top:"+conMarginTop+"px";
body.insertBefore(container,body.firstChild);
div=document.createElement("div");
container.appendChild(div);
div.innerHTML="<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
tds=div.getElementsByTagName("td");
isSupported=(tds[0].offsetHeight===0);
tds[0].style.display="";
tds[1].style.display="none";
support.reliableHiddenOffsets=isSupported&&(tds[0].offsetHeight===0);
div.innerHTML="";
div.style.width=div.style.paddingLeft="1px";
jQuery.boxModel=support.boxModel=div.offsetWidth===2;
if(typeof div.style.zoom!=="undefined"){div.style.display="inline";
div.style.zoom=1;
support.inlineBlockNeedsLayout=(div.offsetWidth===2);
div.style.display="";
div.innerHTML="<div style='width:4px;'></div>";
support.shrinkWrapBlocks=(div.offsetWidth!==2)
}div.style.cssText=ptlm+vb;
div.innerHTML=html;
outer=div.firstChild;
inner=outer.firstChild;
td=outer.nextSibling.firstChild.firstChild;
offsetSupport={doesNotAddBorder:(inner.offsetTop!==5),doesAddBorderForTableAndCells:(td.offsetTop===5)};
inner.style.position="fixed";
inner.style.top="20px";
offsetSupport.fixedPosition=(inner.offsetTop===20||inner.offsetTop===15);
inner.style.position=inner.style.top="";
outer.style.overflow="hidden";
outer.style.position="relative";
offsetSupport.subtractsBorderForOverflowNotVisible=(inner.offsetTop===-5);
offsetSupport.doesNotIncludeMarginInBodyOffset=(body.offsetTop!==conMarginTop);
body.removeChild(container);
div=container=null;
jQuery.extend(support,offsetSupport)
});
return support
})();
var rbrace=/^(?:\{.*\}|\[.*\])$/,rmultiDash=/([A-Z])/g;
jQuery.extend({cache:{},uuid:0,expando:"jQuery"+(jQuery.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:true,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:true},hasData:function(elem){elem=elem.nodeType?jQuery.cache[elem[jQuery.expando]]:elem[jQuery.expando];
return !!elem&&!isEmptyDataObject(elem)
},data:function(elem,name,data,pvt){if(!jQuery.acceptData(elem)){return
}var privateCache,thisCache,ret,internalKey=jQuery.expando,getByName=typeof name==="string",isNode=elem.nodeType,cache=isNode?jQuery.cache:elem,id=isNode?elem[internalKey]:elem[internalKey]&&internalKey,isEvents=name==="events";
if((!id||!cache[id]||(!isEvents&&!pvt&&!cache[id].data))&&getByName&&data===undefined){return
}if(!id){if(isNode){elem[internalKey]=id=++jQuery.uuid
}else{id=internalKey
}}if(!cache[id]){cache[id]={};
if(!isNode){cache[id].toJSON=jQuery.noop
}}if(typeof name==="object"||typeof name==="function"){if(pvt){cache[id]=jQuery.extend(cache[id],name)
}else{cache[id].data=jQuery.extend(cache[id].data,name)
}}privateCache=thisCache=cache[id];
if(!pvt){if(!thisCache.data){thisCache.data={}
}thisCache=thisCache.data
}if(data!==undefined){thisCache[jQuery.camelCase(name)]=data
}if(isEvents&&!thisCache[name]){return privateCache.events
}if(getByName){ret=thisCache[name];
if(ret==null){ret=thisCache[jQuery.camelCase(name)]
}}else{ret=thisCache
}return ret
},removeData:function(elem,name,pvt){if(!jQuery.acceptData(elem)){return
}var thisCache,i,l,internalKey=jQuery.expando,isNode=elem.nodeType,cache=isNode?jQuery.cache:elem,id=isNode?elem[internalKey]:internalKey;
if(!cache[id]){return
}if(name){thisCache=pvt?cache[id]:cache[id].data;
if(thisCache){if(!jQuery.isArray(name)){if(name in thisCache){name=[name]
}else{name=jQuery.camelCase(name);
if(name in thisCache){name=[name]
}else{name=name.split(" ")
}}}for(i=0,l=name.length;
i<l;
i++){delete thisCache[name[i]]
}if(!(pvt?isEmptyDataObject:jQuery.isEmptyObject)(thisCache)){return
}}}if(!pvt){delete cache[id].data;
if(!isEmptyDataObject(cache[id])){return
}}if(jQuery.support.deleteExpando||!cache.setInterval){delete cache[id]
}else{cache[id]=null
}if(isNode){if(jQuery.support.deleteExpando){delete elem[internalKey]
}else{if(elem.removeAttribute){elem.removeAttribute(internalKey)
}else{elem[internalKey]=null
}}}},_data:function(elem,name,data){return jQuery.data(elem,name,data,true)
},acceptData:function(elem){if(elem.nodeName){var match=jQuery.noData[elem.nodeName.toLowerCase()];
if(match){return !(match===true||elem.getAttribute("classid")!==match)
}}return true
}});
jQuery.fn.extend({data:function(key,value){var parts,attr,name,data=null;
if(typeof key==="undefined"){if(this.length){data=jQuery.data(this[0]);
if(this[0].nodeType===1&&!jQuery._data(this[0],"parsedAttrs")){attr=this[0].attributes;
for(var i=0,l=attr.length;
i<l;
i++){name=attr[i].name;
if(name.indexOf("data-")===0){name=jQuery.camelCase(name.substring(5));
dataAttr(this[0],name,data[name])
}}jQuery._data(this[0],"parsedAttrs",true)
}}return data
}else{if(typeof key==="object"){return this.each(function(){jQuery.data(this,key)
})
}}parts=key.split(".");
parts[1]=parts[1]?"."+parts[1]:"";
if(value===undefined){data=this.triggerHandler("getData"+parts[1]+"!",[parts[0]]);
if(data===undefined&&this.length){data=jQuery.data(this[0],key);
data=dataAttr(this[0],key,data)
}return data===undefined&&parts[1]?this.data(parts[0]):data
}else{return this.each(function(){var self=jQuery(this),args=[parts[0],value];
self.triggerHandler("setData"+parts[1]+"!",args);
jQuery.data(this,key,value);
self.triggerHandler("changeData"+parts[1]+"!",args)
})
}},removeData:function(key){return this.each(function(){jQuery.removeData(this,key)
})
}});
function dataAttr(elem,key,data){if(data===undefined&&elem.nodeType===1){var name="data-"+key.replace(rmultiDash,"-$1").toLowerCase();
data=elem.getAttribute(name);
if(typeof data==="string"){try{data=data==="true"?true:data==="false"?false:data==="null"?null:jQuery.isNumeric(data)?parseFloat(data):rbrace.test(data)?jQuery.parseJSON(data):data
}catch(e){}jQuery.data(elem,key,data)
}else{data=undefined
}}return data
}function isEmptyDataObject(obj){for(var name in obj){if(name==="data"&&jQuery.isEmptyObject(obj[name])){continue
}if(name!=="toJSON"){return false
}}return true
}function handleQueueMarkDefer(elem,type,src){var deferDataKey=type+"defer",queueDataKey=type+"queue",markDataKey=type+"mark",defer=jQuery._data(elem,deferDataKey);
if(defer&&(src==="queue"||!jQuery._data(elem,queueDataKey))&&(src==="mark"||!jQuery._data(elem,markDataKey))){setTimeout(function(){if(!jQuery._data(elem,queueDataKey)&&!jQuery._data(elem,markDataKey)){jQuery.removeData(elem,deferDataKey,true);
defer.fire()
}},0)
}}jQuery.extend({_mark:function(elem,type){if(elem){type=(type||"fx")+"mark";
jQuery._data(elem,type,(jQuery._data(elem,type)||0)+1)
}},_unmark:function(force,elem,type){if(force!==true){type=elem;
elem=force;
force=false
}if(elem){type=type||"fx";
var key=type+"mark",count=force?0:((jQuery._data(elem,key)||1)-1);
if(count){jQuery._data(elem,key,count)
}else{jQuery.removeData(elem,key,true);
handleQueueMarkDefer(elem,type,"mark")
}}},queue:function(elem,type,data){var q;
if(elem){type=(type||"fx")+"queue";
q=jQuery._data(elem,type);
if(data){if(!q||jQuery.isArray(data)){q=jQuery._data(elem,type,jQuery.makeArray(data))
}else{q.push(data)
}}return q||[]
}},dequeue:function(elem,type){type=type||"fx";
var queue=jQuery.queue(elem,type),fn=queue.shift(),hooks={};
if(fn==="inprogress"){fn=queue.shift()
}if(fn){if(type==="fx"){queue.unshift("inprogress")
}jQuery._data(elem,type+".run",hooks);
fn.call(elem,function(){jQuery.dequeue(elem,type)
},hooks)
}if(!queue.length){jQuery.removeData(elem,type+"queue "+type+".run",true);
handleQueueMarkDefer(elem,type,"queue")
}}});
jQuery.fn.extend({queue:function(type,data){if(typeof type!=="string"){data=type;
type="fx"
}if(data===undefined){return jQuery.queue(this[0],type)
}return this.each(function(){var queue=jQuery.queue(this,type,data);
if(type==="fx"&&queue[0]!=="inprogress"){jQuery.dequeue(this,type)
}})
},dequeue:function(type){return this.each(function(){jQuery.dequeue(this,type)
})
},delay:function(time,type){time=jQuery.fx?jQuery.fx.speeds[time]||time:time;
type=type||"fx";
return this.queue(type,function(next,hooks){var timeout=setTimeout(next,time);
hooks.stop=function(){clearTimeout(timeout)
}
})
},clearQueue:function(type){return this.queue(type||"fx",[])
},promise:function(type,object){if(typeof type!=="string"){object=type;
type=undefined
}type=type||"fx";
var defer=jQuery.Deferred(),elements=this,i=elements.length,count=1,deferDataKey=type+"defer",queueDataKey=type+"queue",markDataKey=type+"mark",tmp;
function resolve(){if(!(--count)){defer.resolveWith(elements,[elements])
}}while(i--){if((tmp=jQuery.data(elements[i],deferDataKey,undefined,true)||(jQuery.data(elements[i],queueDataKey,undefined,true)||jQuery.data(elements[i],markDataKey,undefined,true))&&jQuery.data(elements[i],deferDataKey,jQuery.Callbacks("once memory"),true))){count++;
tmp.add(resolve)
}}resolve();
return defer.promise()
}});
var rclass=/[\n\t\r]/g,rspace=/\s+/,rreturn=/\r/g,rtype=/^(?:button|input)$/i,rfocusable=/^(?:button|input|object|select|textarea)$/i,rclickable=/^a(?:rea)?$/i,rboolean=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,getSetAttribute=jQuery.support.getSetAttribute,nodeHook,boolHook,fixSpecified;
jQuery.fn.extend({attr:function(name,value){return jQuery.access(this,name,value,true,jQuery.attr)
},removeAttr:function(name){return this.each(function(){jQuery.removeAttr(this,name)
})
},prop:function(name,value){return jQuery.access(this,name,value,true,jQuery.prop)
},removeProp:function(name){name=jQuery.propFix[name]||name;
return this.each(function(){try{this[name]=undefined;
delete this[name]
}catch(e){}})
},addClass:function(value){var classNames,i,l,elem,setClass,c,cl;
if(jQuery.isFunction(value)){return this.each(function(j){jQuery(this).addClass(value.call(this,j,this.className))
})
}if(value&&typeof value==="string"){classNames=value.split(rspace);
for(i=0,l=this.length;
i<l;
i++){elem=this[i];
if(elem.nodeType===1){if(!elem.className&&classNames.length===1){elem.className=value
}else{setClass=" "+elem.className+" ";
for(c=0,cl=classNames.length;
c<cl;
c++){if(!~setClass.indexOf(" "+classNames[c]+" ")){setClass+=classNames[c]+" "
}}elem.className=jQuery.trim(setClass)
}}}}return this
},removeClass:function(value){var classNames,i,l,elem,className,c,cl;
if(jQuery.isFunction(value)){return this.each(function(j){jQuery(this).removeClass(value.call(this,j,this.className))
})
}if((value&&typeof value==="string")||value===undefined){classNames=(value||"").split(rspace);
for(i=0,l=this.length;
i<l;
i++){elem=this[i];
if(elem.nodeType===1&&elem.className){if(value){className=(" "+elem.className+" ").replace(rclass," ");
for(c=0,cl=classNames.length;
c<cl;
c++){className=className.replace(" "+classNames[c]+" "," ")
}elem.className=jQuery.trim(className)
}else{elem.className=""
}}}}return this
},toggleClass:function(value,stateVal){var type=typeof value,isBool=typeof stateVal==="boolean";
if(jQuery.isFunction(value)){return this.each(function(i){jQuery(this).toggleClass(value.call(this,i,this.className,stateVal),stateVal)
})
}return this.each(function(){if(type==="string"){var className,i=0,self=jQuery(this),state=stateVal,classNames=value.split(rspace);
while((className=classNames[i++])){state=isBool?state:!self.hasClass(className);
self[state?"addClass":"removeClass"](className)
}}else{if(type==="undefined"||type==="boolean"){if(this.className){jQuery._data(this,"__className__",this.className)
}this.className=this.className||value===false?"":jQuery._data(this,"__className__")||""
}}})
},hasClass:function(selector){var className=" "+selector+" ",i=0,l=this.length;
for(;
i<l;
i++){if(this[i].nodeType===1&&(" "+this[i].className+" ").replace(rclass," ").indexOf(className)>-1){return true
}}return false
},val:function(value){var hooks,ret,isFunction,elem=this[0];
if(!arguments.length){if(elem){hooks=jQuery.valHooks[elem.nodeName.toLowerCase()]||jQuery.valHooks[elem.type];
if(hooks&&"get" in hooks&&(ret=hooks.get(elem,"value"))!==undefined){return ret
}ret=elem.value;
return typeof ret==="string"?ret.replace(rreturn,""):ret==null?"":ret
}return
}isFunction=jQuery.isFunction(value);
return this.each(function(i){var self=jQuery(this),val;
if(this.nodeType!==1){return
}if(isFunction){val=value.call(this,i,self.val())
}else{val=value
}if(val==null){val=""
}else{if(typeof val==="number"){val+=""
}else{if(jQuery.isArray(val)){val=jQuery.map(val,function(value){return value==null?"":value+""
})
}}}hooks=jQuery.valHooks[this.nodeName.toLowerCase()]||jQuery.valHooks[this.type];
if(!hooks||!("set" in hooks)||hooks.set(this,val,"value")===undefined){this.value=val
}})
}});
jQuery.extend({valHooks:{option:{get:function(elem){var val=elem.attributes.value;
return !val||val.specified?elem.value:elem.text
}},select:{get:function(elem){var value,i,max,option,index=elem.selectedIndex,values=[],options=elem.options,one=elem.type==="select-one";
if(index<0){return null
}i=one?index:0;
max=one?index+1:options.length;
for(;
i<max;
i++){option=options[i];
if(option.selected&&(jQuery.support.optDisabled?!option.disabled:option.getAttribute("disabled")===null)&&(!option.parentNode.disabled||!jQuery.nodeName(option.parentNode,"optgroup"))){value=jQuery(option).val();
if(one){return value
}values.push(value)
}}if(one&&!values.length&&options.length){return jQuery(options[index]).val()
}return values
},set:function(elem,value){var values=jQuery.makeArray(value);
jQuery(elem).find("option").each(function(){this.selected=jQuery.inArray(jQuery(this).val(),values)>=0
});
if(!values.length){elem.selectedIndex=-1
}return values
}}},attrFn:{val:true,css:true,html:true,text:true,data:true,width:true,height:true,offset:true},attr:function(elem,name,value,pass){var ret,hooks,notxml,nType=elem.nodeType;
if(!elem||nType===3||nType===8||nType===2){return
}if(pass&&name in jQuery.attrFn){return jQuery(elem)[name](value)
}if(typeof elem.getAttribute==="undefined"){return jQuery.prop(elem,name,value)
}notxml=nType!==1||!jQuery.isXMLDoc(elem);
if(notxml){name=name.toLowerCase();
hooks=jQuery.attrHooks[name]||(rboolean.test(name)?boolHook:nodeHook)
}if(value!==undefined){if(value===null){jQuery.removeAttr(elem,name);
return
}else{if(hooks&&"set" in hooks&&notxml&&(ret=hooks.set(elem,value,name))!==undefined){return ret
}else{elem.setAttribute(name,""+value);
return value
}}}else{if(hooks&&"get" in hooks&&notxml&&(ret=hooks.get(elem,name))!==null){return ret
}else{ret=elem.getAttribute(name);
return ret===null?undefined:ret
}}},removeAttr:function(elem,value){var propName,attrNames,name,l,i=0;
if(value&&elem.nodeType===1){attrNames=value.toLowerCase().split(rspace);
l=attrNames.length;
for(;
i<l;
i++){name=attrNames[i];
if(name){propName=jQuery.propFix[name]||name;
jQuery.attr(elem,name,"");
elem.removeAttribute(getSetAttribute?name:propName);
if(rboolean.test(name)&&propName in elem){elem[propName]=false
}}}}},attrHooks:{type:{set:function(elem,value){if(rtype.test(elem.nodeName)&&elem.parentNode){jQuery.error("type property can't be changed")
}else{if(!jQuery.support.radioValue&&value==="radio"&&jQuery.nodeName(elem,"input")){var val=elem.value;
elem.setAttribute("type",value);
if(val){elem.value=val
}return value
}}}},value:{get:function(elem,name){if(nodeHook&&jQuery.nodeName(elem,"button")){return nodeHook.get(elem,name)
}return name in elem?elem.value:null
},set:function(elem,value,name){if(nodeHook&&jQuery.nodeName(elem,"button")){return nodeHook.set(elem,value,name)
}elem.value=value
}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(elem,name,value){var ret,hooks,notxml,nType=elem.nodeType;
if(!elem||nType===3||nType===8||nType===2){return
}notxml=nType!==1||!jQuery.isXMLDoc(elem);
if(notxml){name=jQuery.propFix[name]||name;
hooks=jQuery.propHooks[name]
}if(value!==undefined){if(hooks&&"set" in hooks&&(ret=hooks.set(elem,value,name))!==undefined){return ret
}else{return(elem[name]=value)
}}else{if(hooks&&"get" in hooks&&(ret=hooks.get(elem,name))!==null){return ret
}else{return elem[name]
}}},propHooks:{tabIndex:{get:function(elem){var attributeNode=elem.getAttributeNode("tabindex");
return attributeNode&&attributeNode.specified?parseInt(attributeNode.value,10):rfocusable.test(elem.nodeName)||rclickable.test(elem.nodeName)&&elem.href?0:undefined
}}}});
jQuery.attrHooks.tabindex=jQuery.propHooks.tabIndex;
boolHook={get:function(elem,name){var attrNode,property=jQuery.prop(elem,name);
return property===true||typeof property!=="boolean"&&(attrNode=elem.getAttributeNode(name))&&attrNode.nodeValue!==false?name.toLowerCase():undefined
},set:function(elem,value,name){var propName;
if(value===false){jQuery.removeAttr(elem,name)
}else{propName=jQuery.propFix[name]||name;
if(propName in elem){elem[propName]=true
}elem.setAttribute(name,name.toLowerCase())
}return name
}};
if(!getSetAttribute){fixSpecified={name:true,id:true};
nodeHook=jQuery.valHooks.button={get:function(elem,name){var ret;
ret=elem.getAttributeNode(name);
return ret&&(fixSpecified[name]?ret.nodeValue!=="":ret.specified)?ret.nodeValue:undefined
},set:function(elem,value,name){var ret=elem.getAttributeNode(name);
if(!ret){ret=document.createAttribute(name);
elem.setAttributeNode(ret)
}return(ret.nodeValue=value+"")
}};
jQuery.attrHooks.tabindex.set=nodeHook.set;
jQuery.each(["width","height"],function(i,name){jQuery.attrHooks[name]=jQuery.extend(jQuery.attrHooks[name],{set:function(elem,value){if(value===""){elem.setAttribute(name,"auto");
return value
}}})
});
jQuery.attrHooks.contenteditable={get:nodeHook.get,set:function(elem,value,name){if(value===""){value="false"
}nodeHook.set(elem,value,name)
}}
}if(!jQuery.support.hrefNormalized){jQuery.each(["href","src","width","height"],function(i,name){jQuery.attrHooks[name]=jQuery.extend(jQuery.attrHooks[name],{get:function(elem){var ret=elem.getAttribute(name,2);
return ret===null?undefined:ret
}})
})
}if(!jQuery.support.style){jQuery.attrHooks.style={get:function(elem){return elem.style.cssText.toLowerCase()||undefined
},set:function(elem,value){return(elem.style.cssText=""+value)
}}
}if(!jQuery.support.optSelected){jQuery.propHooks.selected=jQuery.extend(jQuery.propHooks.selected,{get:function(elem){var parent=elem.parentNode;
if(parent){parent.selectedIndex;
if(parent.parentNode){parent.parentNode.selectedIndex
}}return null
}})
}if(!jQuery.support.enctype){jQuery.propFix.enctype="encoding"
}if(!jQuery.support.checkOn){jQuery.each(["radio","checkbox"],function(){jQuery.valHooks[this]={get:function(elem){return elem.getAttribute("value")===null?"on":elem.value
}}
})
}jQuery.each(["radio","checkbox"],function(){jQuery.valHooks[this]=jQuery.extend(jQuery.valHooks[this],{set:function(elem,value){if(jQuery.isArray(value)){return(elem.checked=jQuery.inArray(jQuery(elem).val(),value)>=0)
}}})
});
var rformElems=/^(?:textarea|input|select)$/i,rtypenamespace=/^([^\.]*)?(?:\.(.+))?$/,rhoverHack=/\bhover(\.\S+)?\b/,rkeyEvent=/^key/,rmouseEvent=/^(?:mouse|contextmenu)|click/,rfocusMorph=/^(?:focusinfocus|focusoutblur)$/,rquickIs=/^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,quickParse=function(selector){var quick=rquickIs.exec(selector);
if(quick){quick[1]=(quick[1]||"").toLowerCase();
quick[3]=quick[3]&&new RegExp("(?:^|\\s)"+quick[3]+"(?:\\s|$)")
}return quick
},quickIs=function(elem,m){var attrs=elem.attributes||{};
return((!m[1]||elem.nodeName.toLowerCase()===m[1])&&(!m[2]||(attrs.id||{}).value===m[2])&&(!m[3]||m[3].test((attrs["class"]||{}).value)))
},hoverHack=function(events){return jQuery.event.special.hover?events:events.replace(rhoverHack,"mouseenter$1 mouseleave$1")
};
jQuery.event={add:function(elem,types,handler,data,selector){var elemData,eventHandle,events,t,tns,type,namespaces,handleObj,handleObjIn,quick,handlers,special;
if(elem.nodeType===3||elem.nodeType===8||!types||!handler||!(elemData=jQuery._data(elem))){return
}if(handler.handler){handleObjIn=handler;
handler=handleObjIn.handler
}if(!handler.guid){handler.guid=jQuery.guid++
}events=elemData.events;
if(!events){elemData.events=events={}
}eventHandle=elemData.handle;
if(!eventHandle){elemData.handle=eventHandle=function(e){return typeof jQuery!=="undefined"&&(!e||jQuery.event.triggered!==e.type)?jQuery.event.dispatch.apply(eventHandle.elem,arguments):undefined
};
eventHandle.elem=elem
}types=jQuery.trim(hoverHack(types)).split(" ");
for(t=0;
t<types.length;
t++){tns=rtypenamespace.exec(types[t])||[];
type=tns[1];
namespaces=(tns[2]||"").split(".").sort();
special=jQuery.event.special[type]||{};
type=(selector?special.delegateType:special.bindType)||type;
special=jQuery.event.special[type]||{};
handleObj=jQuery.extend({type:type,origType:tns[1],data:data,handler:handler,guid:handler.guid,selector:selector,quick:quickParse(selector),namespace:namespaces.join(".")},handleObjIn);
handlers=events[type];
if(!handlers){handlers=events[type]=[];
handlers.delegateCount=0;
if(!special.setup||special.setup.call(elem,data,namespaces,eventHandle)===false){if(elem.addEventListener){elem.addEventListener(type,eventHandle,false)
}else{if(elem.attachEvent){elem.attachEvent("on"+type,eventHandle)
}}}}if(special.add){special.add.call(elem,handleObj);
if(!handleObj.handler.guid){handleObj.handler.guid=handler.guid
}}if(selector){handlers.splice(handlers.delegateCount++,0,handleObj)
}else{handlers.push(handleObj)
}jQuery.event.global[type]=true
}elem=null
},global:{},remove:function(elem,types,handler,selector,mappedTypes){var elemData=jQuery.hasData(elem)&&jQuery._data(elem),t,tns,type,origType,namespaces,origCount,j,events,special,handle,eventType,handleObj;
if(!elemData||!(events=elemData.events)){return
}types=jQuery.trim(hoverHack(types||"")).split(" ");
for(t=0;
t<types.length;
t++){tns=rtypenamespace.exec(types[t])||[];
type=origType=tns[1];
namespaces=tns[2];
if(!type){for(type in events){jQuery.event.remove(elem,type+types[t],handler,selector,true)
}continue
}special=jQuery.event.special[type]||{};
type=(selector?special.delegateType:special.bindType)||type;
eventType=events[type]||[];
origCount=eventType.length;
namespaces=namespaces?new RegExp("(^|\\.)"+namespaces.split(".").sort().join("\\.(?:.*\\.)?")+"(\\.|$)"):null;
for(j=0;
j<eventType.length;
j++){handleObj=eventType[j];
if((mappedTypes||origType===handleObj.origType)&&(!handler||handler.guid===handleObj.guid)&&(!namespaces||namespaces.test(handleObj.namespace))&&(!selector||selector===handleObj.selector||selector==="**"&&handleObj.selector)){eventType.splice(j--,1);
if(handleObj.selector){eventType.delegateCount--
}if(special.remove){special.remove.call(elem,handleObj)
}}}if(eventType.length===0&&origCount!==eventType.length){if(!special.teardown||special.teardown.call(elem,namespaces)===false){jQuery.removeEvent(elem,type,elemData.handle)
}delete events[type]
}}if(jQuery.isEmptyObject(events)){handle=elemData.handle;
if(handle){handle.elem=null
}jQuery.removeData(elem,["events","handle"],true)
}},customEvent:{getData:true,setData:true,changeData:true},trigger:function(event,data,elem,onlyHandlers){if(elem&&(elem.nodeType===3||elem.nodeType===8)){return
}var type=event.type||event,namespaces=[],cache,exclusive,i,cur,old,ontype,special,handle,eventPath,bubbleType;
if(rfocusMorph.test(type+jQuery.event.triggered)){return
}if(type.indexOf("!")>=0){type=type.slice(0,-1);
exclusive=true
}if(type.indexOf(".")>=0){namespaces=type.split(".");
type=namespaces.shift();
namespaces.sort()
}if((!elem||jQuery.event.customEvent[type])&&!jQuery.event.global[type]){return
}event=typeof event==="object"?event[jQuery.expando]?event:new jQuery.Event(type,event):new jQuery.Event(type);
event.type=type;
event.isTrigger=true;
event.exclusive=exclusive;
event.namespace=namespaces.join(".");
event.namespace_re=event.namespace?new RegExp("(^|\\.)"+namespaces.join("\\.(?:.*\\.)?")+"(\\.|$)"):null;
ontype=type.indexOf(":")<0?"on"+type:"";
if(!elem){cache=jQuery.cache;
for(i in cache){if(cache[i].events&&cache[i].events[type]){jQuery.event.trigger(event,data,cache[i].handle.elem,true)
}}return
}event.result=undefined;
if(!event.target){event.target=elem
}data=data!=null?jQuery.makeArray(data):[];
data.unshift(event);
special=jQuery.event.special[type]||{};
if(special.trigger&&special.trigger.apply(elem,data)===false){return
}eventPath=[[elem,special.bindType||type]];
if(!onlyHandlers&&!special.noBubble&&!jQuery.isWindow(elem)){bubbleType=special.delegateType||type;
cur=rfocusMorph.test(bubbleType+type)?elem:elem.parentNode;
old=null;
for(;
cur;
cur=cur.parentNode){eventPath.push([cur,bubbleType]);
old=cur
}if(old&&old===elem.ownerDocument){eventPath.push([old.defaultView||old.parentWindow||window,bubbleType])
}}for(i=0;
i<eventPath.length&&!event.isPropagationStopped();
i++){cur=eventPath[i][0];
event.type=eventPath[i][1];
handle=(jQuery._data(cur,"events")||{})[event.type]&&jQuery._data(cur,"handle");
if(handle){handle.apply(cur,data)
}handle=ontype&&cur[ontype];
if(handle&&jQuery.acceptData(cur)&&handle.apply(cur,data)===false){event.preventDefault()
}}event.type=type;
if(!onlyHandlers&&!event.isDefaultPrevented()){if((!special._default||special._default.apply(elem.ownerDocument,data)===false)&&!(type==="click"&&jQuery.nodeName(elem,"a"))&&jQuery.acceptData(elem)){if(ontype&&elem[type]&&((type!=="focus"&&type!=="blur")||event.target.offsetWidth!==0)&&!jQuery.isWindow(elem)){old=elem[ontype];
if(old){elem[ontype]=null
}jQuery.event.triggered=type;
elem[type]();
jQuery.event.triggered=undefined;
if(old){elem[ontype]=old
}}}}return event.result
},dispatch:function(event){event=jQuery.event.fix(event||window.event);
var handlers=((jQuery._data(this,"events")||{})[event.type]||[]),delegateCount=handlers.delegateCount,args=[].slice.call(arguments,0),run_all=!event.exclusive&&!event.namespace,handlerQueue=[],i,j,cur,jqcur,ret,selMatch,matched,matches,handleObj,sel,related;
args[0]=event;
event.delegateTarget=this;
if(delegateCount&&!event.target.disabled&&!(event.button&&event.type==="click")){jqcur=jQuery(this);
jqcur.context=this.ownerDocument||this;
for(cur=event.target;
cur!=this;
cur=cur.parentNode||this){selMatch={};
matches=[];
jqcur[0]=cur;
for(i=0;
i<delegateCount;
i++){handleObj=handlers[i];
sel=handleObj.selector;
if(selMatch[sel]===undefined){selMatch[sel]=(handleObj.quick?quickIs(cur,handleObj.quick):jqcur.is(sel))
}if(selMatch[sel]){matches.push(handleObj)
}}if(matches.length){handlerQueue.push({elem:cur,matches:matches})
}}}if(handlers.length>delegateCount){handlerQueue.push({elem:this,matches:handlers.slice(delegateCount)})
}for(i=0;
i<handlerQueue.length&&!event.isPropagationStopped();
i++){matched=handlerQueue[i];
event.currentTarget=matched.elem;
for(j=0;
j<matched.matches.length&&!event.isImmediatePropagationStopped();
j++){handleObj=matched.matches[j];
if(run_all||(!event.namespace&&!handleObj.namespace)||event.namespace_re&&event.namespace_re.test(handleObj.namespace)){event.data=handleObj.data;
event.handleObj=handleObj;
ret=((jQuery.event.special[handleObj.origType]||{}).handle||handleObj.handler).apply(matched.elem,args);
if(ret!==undefined){event.result=ret;
if(ret===false){event.preventDefault();
event.stopPropagation()
}}}}}return event.result
},props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(event,original){if(event.which==null){event.which=original.charCode!=null?original.charCode:original.keyCode
}return event
}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(event,original){var eventDoc,doc,body,button=original.button,fromElement=original.fromElement;
if(event.pageX==null&&original.clientX!=null){eventDoc=event.target.ownerDocument||document;
doc=eventDoc.documentElement;
body=eventDoc.body;
event.pageX=original.clientX+(doc&&doc.scrollLeft||body&&body.scrollLeft||0)-(doc&&doc.clientLeft||body&&body.clientLeft||0);
event.pageY=original.clientY+(doc&&doc.scrollTop||body&&body.scrollTop||0)-(doc&&doc.clientTop||body&&body.clientTop||0)
}if(!event.relatedTarget&&fromElement){event.relatedTarget=fromElement===event.target?original.toElement:fromElement
}if(!event.which&&button!==undefined){event.which=(button&1?1:(button&2?3:(button&4?2:0)))
}return event
}},fix:function(event){if(event[jQuery.expando]){return event
}var i,prop,originalEvent=event,fixHook=jQuery.event.fixHooks[event.type]||{},copy=fixHook.props?this.props.concat(fixHook.props):this.props;
event=jQuery.Event(originalEvent);
for(i=copy.length;
i;
){prop=copy[--i];
event[prop]=originalEvent[prop]
}if(!event.target){event.target=originalEvent.srcElement||document
}if(event.target.nodeType===3){event.target=event.target.parentNode
}if(event.metaKey===undefined){event.metaKey=event.ctrlKey
}return fixHook.filter?fixHook.filter(event,originalEvent):event
},special:{ready:{setup:jQuery.bindReady},load:{noBubble:true},focus:{delegateType:"focusin"},blur:{delegateType:"focusout"},beforeunload:{setup:function(data,namespaces,eventHandle){if(jQuery.isWindow(this)){this.onbeforeunload=eventHandle
}},teardown:function(namespaces,eventHandle){if(this.onbeforeunload===eventHandle){this.onbeforeunload=null
}}}},simulate:function(type,elem,event,bubble){var e=jQuery.extend(new jQuery.Event(),event,{type:type,isSimulated:true,originalEvent:{}});
if(bubble){jQuery.event.trigger(e,null,elem)
}else{jQuery.event.dispatch.call(elem,e)
}if(e.isDefaultPrevented()){event.preventDefault()
}}};
jQuery.event.handle=jQuery.event.dispatch;
jQuery.removeEvent=document.removeEventListener?function(elem,type,handle){if(elem.removeEventListener){elem.removeEventListener(type,handle,false)
}}:function(elem,type,handle){if(elem.detachEvent){elem.detachEvent("on"+type,handle)
}};
jQuery.Event=function(src,props){if(!(this instanceof jQuery.Event)){return new jQuery.Event(src,props)
}if(src&&src.type){this.originalEvent=src;
this.type=src.type;
this.isDefaultPrevented=(src.defaultPrevented||src.returnValue===false||src.getPreventDefault&&src.getPreventDefault())?returnTrue:returnFalse
}else{this.type=src
}if(props){jQuery.extend(this,props)
}this.timeStamp=src&&src.timeStamp||jQuery.now();
this[jQuery.expando]=true
};
function returnFalse(){return false
}function returnTrue(){return true
}jQuery.Event.prototype={preventDefault:function(){this.isDefaultPrevented=returnTrue;
var e=this.originalEvent;
if(!e){return
}if(e.preventDefault){e.preventDefault()
}else{e.returnValue=false
}},stopPropagation:function(){this.isPropagationStopped=returnTrue;
var e=this.originalEvent;
if(!e){return
}if(e.stopPropagation){e.stopPropagation()
}e.cancelBubble=true
},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=returnTrue;
this.stopPropagation()
},isDefaultPrevented:returnFalse,isPropagationStopped:returnFalse,isImmediatePropagationStopped:returnFalse};
jQuery.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(orig,fix){jQuery.event.special[orig]={delegateType:fix,bindType:fix,handle:function(event){var target=this,related=event.relatedTarget,handleObj=event.handleObj,selector=handleObj.selector,ret;
if(!related||(related!==target&&!jQuery.contains(target,related))){event.type=handleObj.origType;
ret=handleObj.handler.apply(this,arguments);
event.type=fix
}return ret
}}
});
if(!jQuery.support.submitBubbles){jQuery.event.special.submit={setup:function(){if(jQuery.nodeName(this,"form")){return false
}jQuery.event.add(this,"click._submit keypress._submit",function(e){var elem=e.target,form=jQuery.nodeName(elem,"input")||jQuery.nodeName(elem,"button")?elem.form:undefined;
if(form&&!form._submit_attached){jQuery.event.add(form,"submit._submit",function(event){if(this.parentNode&&!event.isTrigger){jQuery.event.simulate("submit",this.parentNode,event,true)
}});
form._submit_attached=true
}})
},teardown:function(){if(jQuery.nodeName(this,"form")){return false
}jQuery.event.remove(this,"._submit")
}}
}if(!jQuery.support.changeBubbles){jQuery.event.special.change={setup:function(){if(rformElems.test(this.nodeName)){if(this.type==="checkbox"||this.type==="radio"){jQuery.event.add(this,"propertychange._change",function(event){if(event.originalEvent.propertyName==="checked"){this._just_changed=true
}});
jQuery.event.add(this,"click._change",function(event){if(this._just_changed&&!event.isTrigger){this._just_changed=false;
jQuery.event.simulate("change",this,event,true)
}})
}return false
}jQuery.event.add(this,"beforeactivate._change",function(e){var elem=e.target;
if(rformElems.test(elem.nodeName)&&!elem._change_attached){jQuery.event.add(elem,"change._change",function(event){if(this.parentNode&&!event.isSimulated&&!event.isTrigger){jQuery.event.simulate("change",this.parentNode,event,true)
}});
elem._change_attached=true
}})
},handle:function(event){var elem=event.target;
if(this!==elem||event.isSimulated||event.isTrigger||(elem.type!=="radio"&&elem.type!=="checkbox")){return event.handleObj.handler.apply(this,arguments)
}},teardown:function(){jQuery.event.remove(this,"._change");
return rformElems.test(this.nodeName)
}}
}if(!jQuery.support.focusinBubbles){jQuery.each({focus:"focusin",blur:"focusout"},function(orig,fix){var attaches=0,handler=function(event){jQuery.event.simulate(fix,event.target,jQuery.event.fix(event),true)
};
jQuery.event.special[fix]={setup:function(){if(attaches++===0){document.addEventListener(orig,handler,true)
}},teardown:function(){if(--attaches===0){document.removeEventListener(orig,handler,true)
}}}
})
}jQuery.fn.extend({on:function(types,selector,data,fn,one){var origFn,type;
if(typeof types==="object"){if(typeof selector!=="string"){data=selector;
selector=undefined
}for(type in types){this.on(type,selector,data,types[type],one)
}return this
}if(data==null&&fn==null){fn=selector;
data=selector=undefined
}else{if(fn==null){if(typeof selector==="string"){fn=data;
data=undefined
}else{fn=data;
data=selector;
selector=undefined
}}}if(fn===false){fn=returnFalse
}else{if(!fn){return this
}}if(one===1){origFn=fn;
fn=function(event){jQuery().off(event);
return origFn.apply(this,arguments)
};
fn.guid=origFn.guid||(origFn.guid=jQuery.guid++)
}return this.each(function(){jQuery.event.add(this,types,fn,data,selector)
})
},one:function(types,selector,data,fn){return this.on.call(this,types,selector,data,fn,1)
},off:function(types,selector,fn){if(types&&types.preventDefault&&types.handleObj){var handleObj=types.handleObj;
jQuery(types.delegateTarget).off(handleObj.namespace?handleObj.type+"."+handleObj.namespace:handleObj.type,handleObj.selector,handleObj.handler);
return this
}if(typeof types==="object"){for(var type in types){this.off(type,selector,types[type])
}return this
}if(selector===false||typeof selector==="function"){fn=selector;
selector=undefined
}if(fn===false){fn=returnFalse
}return this.each(function(){jQuery.event.remove(this,types,fn,selector)
})
},bind:function(types,data,fn){return this.on(types,null,data,fn)
},unbind:function(types,fn){return this.off(types,null,fn)
},live:function(types,data,fn){jQuery(this.context).on(types,this.selector,data,fn);
return this
},die:function(types,fn){jQuery(this.context).off(types,this.selector||"**",fn);
return this
},delegate:function(selector,types,data,fn){return this.on(types,selector,data,fn)
},undelegate:function(selector,types,fn){return arguments.length==1?this.off(selector,"**"):this.off(types,selector,fn)
},trigger:function(type,data){return this.each(function(){jQuery.event.trigger(type,data,this)
})
},triggerHandler:function(type,data){if(this[0]){return jQuery.event.trigger(type,data,this[0],true)
}},toggle:function(fn){var args=arguments,guid=fn.guid||jQuery.guid++,i=0,toggler=function(event){var lastToggle=(jQuery._data(this,"lastToggle"+fn.guid)||0)%i;
jQuery._data(this,"lastToggle"+fn.guid,lastToggle+1);
event.preventDefault();
return args[lastToggle].apply(this,arguments)||false
};
toggler.guid=guid;
while(i<args.length){args[i++].guid=guid
}return this.click(toggler)
},hover:function(fnOver,fnOut){return this.mouseenter(fnOver).mouseleave(fnOut||fnOver)
}});
jQuery.each(("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu").split(" "),function(i,name){jQuery.fn[name]=function(data,fn){if(fn==null){fn=data;
data=null
}return arguments.length>0?this.on(name,null,data,fn):this.trigger(name)
};
if(jQuery.attrFn){jQuery.attrFn[name]=true
}if(rkeyEvent.test(name)){jQuery.event.fixHooks[name]=jQuery.event.keyHooks
}if(rmouseEvent.test(name)){jQuery.event.fixHooks[name]=jQuery.event.mouseHooks
}});
/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){var chunker=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,expando="sizcache"+(Math.random()+"").replace(".",""),done=0,toString=Object.prototype.toString,hasDuplicate=false,baseHasDuplicate=true,rBackslash=/\\/g,rReturn=/\r\n/g,rNonWord=/\W/;
[0,0].sort(function(){baseHasDuplicate=false;
return 0
});
var Sizzle=function(selector,context,results,seed){results=results||[];
context=context||document;
var origContext=context;
if(context.nodeType!==1&&context.nodeType!==9){return[]
}if(!selector||typeof selector!=="string"){return results
}var m,set,checkSet,extra,ret,cur,pop,i,prune=true,contextXML=Sizzle.isXML(context),parts=[],soFar=selector;
do{chunker.exec("");
m=chunker.exec(soFar);
if(m){soFar=m[3];
parts.push(m[1]);
if(m[2]){extra=m[3];
break
}}}while(m);
if(parts.length>1&&origPOS.exec(selector)){if(parts.length===2&&Expr.relative[parts[0]]){set=posProcess(parts[0]+parts[1],context,seed)
}else{set=Expr.relative[parts[0]]?[context]:Sizzle(parts.shift(),context);
while(parts.length){selector=parts.shift();
if(Expr.relative[selector]){selector+=parts.shift()
}set=posProcess(selector,set,seed)
}}}else{if(!seed&&parts.length>1&&context.nodeType===9&&!contextXML&&Expr.match.ID.test(parts[0])&&!Expr.match.ID.test(parts[parts.length-1])){ret=Sizzle.find(parts.shift(),context,contextXML);
context=ret.expr?Sizzle.filter(ret.expr,ret.set)[0]:ret.set[0]
}if(context){ret=seed?{expr:parts.pop(),set:makeArray(seed)}:Sizzle.find(parts.pop(),parts.length===1&&(parts[0]==="~"||parts[0]==="+")&&context.parentNode?context.parentNode:context,contextXML);
set=ret.expr?Sizzle.filter(ret.expr,ret.set):ret.set;
if(parts.length>0){checkSet=makeArray(set)
}else{prune=false
}while(parts.length){cur=parts.pop();
pop=cur;
if(!Expr.relative[cur]){cur=""
}else{pop=parts.pop()
}if(pop==null){pop=context
}Expr.relative[cur](checkSet,pop,contextXML)
}}else{checkSet=parts=[]
}}if(!checkSet){checkSet=set
}if(!checkSet){Sizzle.error(cur||selector)
}if(toString.call(checkSet)==="[object Array]"){if(!prune){results.push.apply(results,checkSet)
}else{if(context&&context.nodeType===1){for(i=0;
checkSet[i]!=null;
i++){if(checkSet[i]&&(checkSet[i]===true||checkSet[i].nodeType===1&&Sizzle.contains(context,checkSet[i]))){results.push(set[i])
}}}else{for(i=0;
checkSet[i]!=null;
i++){if(checkSet[i]&&checkSet[i].nodeType===1){results.push(set[i])
}}}}}else{makeArray(checkSet,results)
}if(extra){Sizzle(extra,origContext,results,seed);
Sizzle.uniqueSort(results)
}return results
};
Sizzle.uniqueSort=function(results){if(sortOrder){hasDuplicate=baseHasDuplicate;
results.sort(sortOrder);
if(hasDuplicate){for(var i=1;
i<results.length;
i++){if(results[i]===results[i-1]){results.splice(i--,1)
}}}}return results
};
Sizzle.matches=function(expr,set){return Sizzle(expr,null,null,set)
};
Sizzle.matchesSelector=function(node,expr){return Sizzle(expr,null,null,[node]).length>0
};
Sizzle.find=function(expr,context,isXML){var set,i,len,match,type,left;
if(!expr){return[]
}for(i=0,len=Expr.order.length;
i<len;
i++){type=Expr.order[i];
if((match=Expr.leftMatch[type].exec(expr))){left=match[1];
match.splice(1,1);
if(left.substr(left.length-1)!=="\\"){match[1]=(match[1]||"").replace(rBackslash,"");
set=Expr.find[type](match,context,isXML);
if(set!=null){expr=expr.replace(Expr.match[type],"");
break
}}}}if(!set){set=typeof context.getElementsByTagName!=="undefined"?context.getElementsByTagName("*"):[]
}return{set:set,expr:expr}
};
Sizzle.filter=function(expr,set,inplace,not){var match,anyFound,type,found,item,filter,left,i,pass,old=expr,result=[],curLoop=set,isXMLFilter=set&&set[0]&&Sizzle.isXML(set[0]);
while(expr&&set.length){for(type in Expr.filter){if((match=Expr.leftMatch[type].exec(expr))!=null&&match[2]){filter=Expr.filter[type];
left=match[1];
anyFound=false;
match.splice(1,1);
if(left.substr(left.length-1)==="\\"){continue
}if(curLoop===result){result=[]
}if(Expr.preFilter[type]){match=Expr.preFilter[type](match,curLoop,inplace,result,not,isXMLFilter);
if(!match){anyFound=found=true
}else{if(match===true){continue
}}}if(match){for(i=0;
(item=curLoop[i])!=null;
i++){if(item){found=filter(item,match,i,curLoop);
pass=not^found;
if(inplace&&found!=null){if(pass){anyFound=true
}else{curLoop[i]=false
}}else{if(pass){result.push(item);
anyFound=true
}}}}}if(found!==undefined){if(!inplace){curLoop=result
}expr=expr.replace(Expr.match[type],"");
if(!anyFound){return[]
}break
}}}if(expr===old){if(anyFound==null){Sizzle.error(expr)
}else{break
}}old=expr
}return curLoop
};
Sizzle.error=function(msg){throw new Error("Syntax error, unrecognized expression: "+msg)
};
var getText=Sizzle.getText=function(elem){var i,node,nodeType=elem.nodeType,ret="";
if(nodeType){if(nodeType===1||nodeType===9){if(typeof elem.textContent==="string"){return elem.textContent
}else{if(typeof elem.innerText==="string"){return elem.innerText.replace(rReturn,"")
}else{for(elem=elem.firstChild;
elem;
elem=elem.nextSibling){ret+=getText(elem)
}}}}else{if(nodeType===3||nodeType===4){return elem.nodeValue
}}}else{for(i=0;
(node=elem[i]);
i++){if(node.nodeType!==8){ret+=getText(node)
}}}return ret
};
var Expr=Sizzle.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(elem){return elem.getAttribute("href")
},type:function(elem){return elem.getAttribute("type")
}},relative:{"+":function(checkSet,part){var isPartStr=typeof part==="string",isTag=isPartStr&&!rNonWord.test(part),isPartStrNotTag=isPartStr&&!isTag;
if(isTag){part=part.toLowerCase()
}for(var i=0,l=checkSet.length,elem;
i<l;
i++){if((elem=checkSet[i])){while((elem=elem.previousSibling)&&elem.nodeType!==1){}checkSet[i]=isPartStrNotTag||elem&&elem.nodeName.toLowerCase()===part?elem||false:elem===part
}}if(isPartStrNotTag){Sizzle.filter(part,checkSet,true)
}},">":function(checkSet,part){var elem,isPartStr=typeof part==="string",i=0,l=checkSet.length;
if(isPartStr&&!rNonWord.test(part)){part=part.toLowerCase();
for(;
i<l;
i++){elem=checkSet[i];
if(elem){var parent=elem.parentNode;
checkSet[i]=parent.nodeName.toLowerCase()===part?parent:false
}}}else{for(;
i<l;
i++){elem=checkSet[i];
if(elem){checkSet[i]=isPartStr?elem.parentNode:elem.parentNode===part
}}if(isPartStr){Sizzle.filter(part,checkSet,true)
}}},"":function(checkSet,part,isXML){var nodeCheck,doneName=done++,checkFn=dirCheck;
if(typeof part==="string"&&!rNonWord.test(part)){part=part.toLowerCase();
nodeCheck=part;
checkFn=dirNodeCheck
}checkFn("parentNode",part,doneName,checkSet,nodeCheck,isXML)
},"~":function(checkSet,part,isXML){var nodeCheck,doneName=done++,checkFn=dirCheck;
if(typeof part==="string"&&!rNonWord.test(part)){part=part.toLowerCase();
nodeCheck=part;
checkFn=dirNodeCheck
}checkFn("previousSibling",part,doneName,checkSet,nodeCheck,isXML)
}},find:{ID:function(match,context,isXML){if(typeof context.getElementById!=="undefined"&&!isXML){var m=context.getElementById(match[1]);
return m&&m.parentNode?[m]:[]
}},NAME:function(match,context){if(typeof context.getElementsByName!=="undefined"){var ret=[],results=context.getElementsByName(match[1]);
for(var i=0,l=results.length;
i<l;
i++){if(results[i].getAttribute("name")===match[1]){ret.push(results[i])
}}return ret.length===0?null:ret
}},TAG:function(match,context){if(typeof context.getElementsByTagName!=="undefined"){return context.getElementsByTagName(match[1])
}}},preFilter:{CLASS:function(match,curLoop,inplace,result,not,isXML){match=" "+match[1].replace(rBackslash,"")+" ";
if(isXML){return match
}for(var i=0,elem;
(elem=curLoop[i])!=null;
i++){if(elem){if(not^(elem.className&&(" "+elem.className+" ").replace(/[\t\n\r]/g," ").indexOf(match)>=0)){if(!inplace){result.push(elem)
}}else{if(inplace){curLoop[i]=false
}}}}return false
},ID:function(match){return match[1].replace(rBackslash,"")
},TAG:function(match,curLoop){return match[1].replace(rBackslash,"").toLowerCase()
},CHILD:function(match){if(match[1]==="nth"){if(!match[2]){Sizzle.error(match[0])
}match[2]=match[2].replace(/^\+|\s*/g,"");
var test=/(-?)(\d*)(?:n([+\-]?\d*))?/.exec(match[2]==="even"&&"2n"||match[2]==="odd"&&"2n+1"||!/\D/.test(match[2])&&"0n+"+match[2]||match[2]);
match[2]=(test[1]+(test[2]||1))-0;
match[3]=test[3]-0
}else{if(match[2]){Sizzle.error(match[0])
}}match[0]=done++;
return match
},ATTR:function(match,curLoop,inplace,result,not,isXML){var name=match[1]=match[1].replace(rBackslash,"");
if(!isXML&&Expr.attrMap[name]){match[1]=Expr.attrMap[name]
}match[4]=(match[4]||match[5]||"").replace(rBackslash,"");
if(match[2]==="~="){match[4]=" "+match[4]+" "
}return match
},PSEUDO:function(match,curLoop,inplace,result,not){if(match[1]==="not"){if((chunker.exec(match[3])||"").length>1||/^\w/.test(match[3])){match[3]=Sizzle(match[3],null,null,curLoop)
}else{var ret=Sizzle.filter(match[3],curLoop,inplace,true^not);
if(!inplace){result.push.apply(result,ret)
}return false
}}else{if(Expr.match.POS.test(match[0])||Expr.match.CHILD.test(match[0])){return true
}}return match
},POS:function(match){match.unshift(true);
return match
}},filters:{enabled:function(elem){return elem.disabled===false&&elem.type!=="hidden"
},disabled:function(elem){return elem.disabled===true
},checked:function(elem){return elem.checked===true
},selected:function(elem){if(elem.parentNode){elem.parentNode.selectedIndex
}return elem.selected===true
},parent:function(elem){return !!elem.firstChild
},empty:function(elem){return !elem.firstChild
},has:function(elem,i,match){return !!Sizzle(match[3],elem).length
},header:function(elem){return(/h\d/i).test(elem.nodeName)
},text:function(elem){var attr=elem.getAttribute("type"),type=elem.type;
return elem.nodeName.toLowerCase()==="input"&&"text"===type&&(attr===type||attr===null)
},radio:function(elem){return elem.nodeName.toLowerCase()==="input"&&"radio"===elem.type
},checkbox:function(elem){return elem.nodeName.toLowerCase()==="input"&&"checkbox"===elem.type
},file:function(elem){return elem.nodeName.toLowerCase()==="input"&&"file"===elem.type
},password:function(elem){return elem.nodeName.toLowerCase()==="input"&&"password"===elem.type
},submit:function(elem){var name=elem.nodeName.toLowerCase();
return(name==="input"||name==="button")&&"submit"===elem.type
},image:function(elem){return elem.nodeName.toLowerCase()==="input"&&"image"===elem.type
},reset:function(elem){var name=elem.nodeName.toLowerCase();
return(name==="input"||name==="button")&&"reset"===elem.type
},button:function(elem){var name=elem.nodeName.toLowerCase();
return name==="input"&&"button"===elem.type||name==="button"
},input:function(elem){return(/input|select|textarea|button/i).test(elem.nodeName)
},focus:function(elem){return elem===elem.ownerDocument.activeElement
}},setFilters:{first:function(elem,i){return i===0
},last:function(elem,i,match,array){return i===array.length-1
},even:function(elem,i){return i%2===0
},odd:function(elem,i){return i%2===1
},lt:function(elem,i,match){return i<match[3]-0
},gt:function(elem,i,match){return i>match[3]-0
},nth:function(elem,i,match){return match[3]-0===i
},eq:function(elem,i,match){return match[3]-0===i
}},filter:{PSEUDO:function(elem,match,i,array){var name=match[1],filter=Expr.filters[name];
if(filter){return filter(elem,i,match,array)
}else{if(name==="contains"){return(elem.textContent||elem.innerText||getText([elem])||"").indexOf(match[3])>=0
}else{if(name==="not"){var not=match[3];
for(var j=0,l=not.length;
j<l;
j++){if(not[j]===elem){return false
}}return true
}else{Sizzle.error(name)
}}}},CHILD:function(elem,match){var first,last,doneName,parent,cache,count,diff,type=match[1],node=elem;
switch(type){case"only":case"first":while((node=node.previousSibling)){if(node.nodeType===1){return false
}}if(type==="first"){return true
}node=elem;
case"last":while((node=node.nextSibling)){if(node.nodeType===1){return false
}}return true;
case"nth":first=match[2];
last=match[3];
if(first===1&&last===0){return true
}doneName=match[0];
parent=elem.parentNode;
if(parent&&(parent[expando]!==doneName||!elem.nodeIndex)){count=0;
for(node=parent.firstChild;
node;
node=node.nextSibling){if(node.nodeType===1){node.nodeIndex=++count
}}parent[expando]=doneName
}diff=elem.nodeIndex-last;
if(first===0){return diff===0
}else{return(diff%first===0&&diff/first>=0)
}}},ID:function(elem,match){return elem.nodeType===1&&elem.getAttribute("id")===match
},TAG:function(elem,match){return(match==="*"&&elem.nodeType===1)||!!elem.nodeName&&elem.nodeName.toLowerCase()===match
},CLASS:function(elem,match){return(" "+(elem.className||elem.getAttribute("class"))+" ").indexOf(match)>-1
},ATTR:function(elem,match){var name=match[1],result=Sizzle.attr?Sizzle.attr(elem,name):Expr.attrHandle[name]?Expr.attrHandle[name](elem):elem[name]!=null?elem[name]:elem.getAttribute(name),value=result+"",type=match[2],check=match[4];
return result==null?type==="!=":!type&&Sizzle.attr?result!=null:type==="="?value===check:type==="*="?value.indexOf(check)>=0:type==="~="?(" "+value+" ").indexOf(check)>=0:!check?value&&result!==false:type==="!="?value!==check:type==="^="?value.indexOf(check)===0:type==="$="?value.substr(value.length-check.length)===check:type==="|="?value===check||value.substr(0,check.length+1)===check+"-":false
},POS:function(elem,match,i,array){var name=match[2],filter=Expr.setFilters[name];
if(filter){return filter(elem,i,match,array)
}}}};
var origPOS=Expr.match.POS,fescape=function(all,num){return"\\"+(num-0+1)
};
for(var type in Expr.match){Expr.match[type]=new RegExp(Expr.match[type].source+(/(?![^\[]*\])(?![^\(]*\))/.source));
Expr.leftMatch[type]=new RegExp(/(^(?:.|\r|\n)*?)/.source+Expr.match[type].source.replace(/\\(\d+)/g,fescape))
}var makeArray=function(array,results){array=Array.prototype.slice.call(array,0);
if(results){results.push.apply(results,array);
return results
}return array
};
try{Array.prototype.slice.call(document.documentElement.childNodes,0)[0].nodeType
}catch(e){makeArray=function(array,results){var i=0,ret=results||[];
if(toString.call(array)==="[object Array]"){Array.prototype.push.apply(ret,array)
}else{if(typeof array.length==="number"){for(var l=array.length;
i<l;
i++){ret.push(array[i])
}}else{for(;
array[i];
i++){ret.push(array[i])
}}}return ret
}
}var sortOrder,siblingCheck;
if(document.documentElement.compareDocumentPosition){sortOrder=function(a,b){if(a===b){hasDuplicate=true;
return 0
}if(!a.compareDocumentPosition||!b.compareDocumentPosition){return a.compareDocumentPosition?-1:1
}return a.compareDocumentPosition(b)&4?-1:1
}
}else{sortOrder=function(a,b){if(a===b){hasDuplicate=true;
return 0
}else{if(a.sourceIndex&&b.sourceIndex){return a.sourceIndex-b.sourceIndex
}}var al,bl,ap=[],bp=[],aup=a.parentNode,bup=b.parentNode,cur=aup;
if(aup===bup){return siblingCheck(a,b)
}else{if(!aup){return -1
}else{if(!bup){return 1
}}}while(cur){ap.unshift(cur);
cur=cur.parentNode
}cur=bup;
while(cur){bp.unshift(cur);
cur=cur.parentNode
}al=ap.length;
bl=bp.length;
for(var i=0;
i<al&&i<bl;
i++){if(ap[i]!==bp[i]){return siblingCheck(ap[i],bp[i])
}}return i===al?siblingCheck(a,bp[i],-1):siblingCheck(ap[i],b,1)
};
siblingCheck=function(a,b,ret){if(a===b){return ret
}var cur=a.nextSibling;
while(cur){if(cur===b){return -1
}cur=cur.nextSibling
}return 1
}
}(function(){var form=document.createElement("div"),id="script"+(new Date()).getTime(),root=document.documentElement;
form.innerHTML="<a name='"+id+"'/>";
root.insertBefore(form,root.firstChild);
if(document.getElementById(id)){Expr.find.ID=function(match,context,isXML){if(typeof context.getElementById!=="undefined"&&!isXML){var m=context.getElementById(match[1]);
return m?m.id===match[1]||typeof m.getAttributeNode!=="undefined"&&m.getAttributeNode("id").nodeValue===match[1]?[m]:undefined:[]
}};
Expr.filter.ID=function(elem,match){var node=typeof elem.getAttributeNode!=="undefined"&&elem.getAttributeNode("id");
return elem.nodeType===1&&node&&node.nodeValue===match
}
}root.removeChild(form);
root=form=null
})();
(function(){var div=document.createElement("div");
div.appendChild(document.createComment(""));
if(div.getElementsByTagName("*").length>0){Expr.find.TAG=function(match,context){var results=context.getElementsByTagName(match[1]);
if(match[1]==="*"){var tmp=[];
for(var i=0;
results[i];
i++){if(results[i].nodeType===1){tmp.push(results[i])
}}results=tmp
}return results
}
}div.innerHTML="<a href='#'></a>";
if(div.firstChild&&typeof div.firstChild.getAttribute!=="undefined"&&div.firstChild.getAttribute("href")!=="#"){Expr.attrHandle.href=function(elem){return elem.getAttribute("href",2)
}
}div=null
})();
if(document.querySelectorAll){(function(){var oldSizzle=Sizzle,div=document.createElement("div"),id="__sizzle__";
div.innerHTML="<p class='TEST'></p>";
if(div.querySelectorAll&&div.querySelectorAll(".TEST").length===0){return
}Sizzle=function(query,context,extra,seed){context=context||document;
if(!seed&&!Sizzle.isXML(context)){var match=/^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(query);
if(match&&(context.nodeType===1||context.nodeType===9)){if(match[1]){return makeArray(context.getElementsByTagName(query),extra)
}else{if(match[2]&&Expr.find.CLASS&&context.getElementsByClassName){return makeArray(context.getElementsByClassName(match[2]),extra)
}}}if(context.nodeType===9){if(query==="body"&&context.body){return makeArray([context.body],extra)
}else{if(match&&match[3]){var elem=context.getElementById(match[3]);
if(elem&&elem.parentNode){if(elem.id===match[3]){return makeArray([elem],extra)
}}else{return makeArray([],extra)
}}}try{return makeArray(context.querySelectorAll(query),extra)
}catch(qsaError){}}else{if(context.nodeType===1&&context.nodeName.toLowerCase()!=="object"){var oldContext=context,old=context.getAttribute("id"),nid=old||id,hasParent=context.parentNode,relativeHierarchySelector=/^\s*[+~]/.test(query);
if(!old){context.setAttribute("id",nid)
}else{nid=nid.replace(/'/g,"\\$&")
}if(relativeHierarchySelector&&hasParent){context=context.parentNode
}try{if(!relativeHierarchySelector||hasParent){return makeArray(context.querySelectorAll("[id='"+nid+"'] "+query),extra)
}}catch(pseudoError){}finally{if(!old){oldContext.removeAttribute("id")
}}}}}return oldSizzle(query,context,extra,seed)
};
for(var prop in oldSizzle){Sizzle[prop]=oldSizzle[prop]
}div=null
})()
}(function(){var html=document.documentElement,matches=html.matchesSelector||html.mozMatchesSelector||html.webkitMatchesSelector||html.msMatchesSelector;
if(matches){var disconnectedMatch=!matches.call(document.createElement("div"),"div"),pseudoWorks=false;
try{matches.call(document.documentElement,"[test!='']:sizzle")
}catch(pseudoError){pseudoWorks=true
}Sizzle.matchesSelector=function(node,expr){expr=expr.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");
if(!Sizzle.isXML(node)){try{if(pseudoWorks||!Expr.match.PSEUDO.test(expr)&&!/!=/.test(expr)){var ret=matches.call(node,expr);
if(ret||!disconnectedMatch||node.document&&node.document.nodeType!==11){return ret
}}}catch(e){}}return Sizzle(expr,null,null,[node]).length>0
}
}})();
(function(){var div=document.createElement("div");
div.innerHTML="<div class='test e'></div><div class='test'></div>";
if(!div.getElementsByClassName||div.getElementsByClassName("e").length===0){return
}div.lastChild.className="e";
if(div.getElementsByClassName("e").length===1){return
}Expr.order.splice(1,0,"CLASS");
Expr.find.CLASS=function(match,context,isXML){if(typeof context.getElementsByClassName!=="undefined"&&!isXML){return context.getElementsByClassName(match[1])
}};
div=null
})();
function dirNodeCheck(dir,cur,doneName,checkSet,nodeCheck,isXML){for(var i=0,l=checkSet.length;
i<l;
i++){var elem=checkSet[i];
if(elem){var match=false;
elem=elem[dir];
while(elem){if(elem[expando]===doneName){match=checkSet[elem.sizset];
break
}if(elem.nodeType===1&&!isXML){elem[expando]=doneName;
elem.sizset=i
}if(elem.nodeName.toLowerCase()===cur){match=elem;
break
}elem=elem[dir]
}checkSet[i]=match
}}}function dirCheck(dir,cur,doneName,checkSet,nodeCheck,isXML){for(var i=0,l=checkSet.length;
i<l;
i++){var elem=checkSet[i];
if(elem){var match=false;
elem=elem[dir];
while(elem){if(elem[expando]===doneName){match=checkSet[elem.sizset];
break
}if(elem.nodeType===1){if(!isXML){elem[expando]=doneName;
elem.sizset=i
}if(typeof cur!=="string"){if(elem===cur){match=true;
break
}}else{if(Sizzle.filter(cur,[elem]).length>0){match=elem;
break
}}}elem=elem[dir]
}checkSet[i]=match
}}}if(document.documentElement.contains){Sizzle.contains=function(a,b){return a!==b&&(a.contains?a.contains(b):true)
}
}else{if(document.documentElement.compareDocumentPosition){Sizzle.contains=function(a,b){return !!(a.compareDocumentPosition(b)&16)
}
}else{Sizzle.contains=function(){return false
}
}}Sizzle.isXML=function(elem){var documentElement=(elem?elem.ownerDocument||elem:0).documentElement;
return documentElement?documentElement.nodeName!=="HTML":false
};
var posProcess=function(selector,context,seed){var match,tmpSet=[],later="",root=context.nodeType?[context]:context;
while((match=Expr.match.PSEUDO.exec(selector))){later+=match[0];
selector=selector.replace(Expr.match.PSEUDO,"")
}selector=Expr.relative[selector]?selector+"*":selector;
for(var i=0,l=root.length;
i<l;
i++){Sizzle(selector,root[i],tmpSet,seed)
}return Sizzle.filter(later,tmpSet)
};
Sizzle.attr=jQuery.attr;
Sizzle.selectors.attrMap={};
jQuery.find=Sizzle;
jQuery.expr=Sizzle.selectors;
jQuery.expr[":"]=jQuery.expr.filters;
jQuery.unique=Sizzle.uniqueSort;
jQuery.text=Sizzle.getText;
jQuery.isXMLDoc=Sizzle.isXML;
jQuery.contains=Sizzle.contains
})();
var runtil=/Until$/,rparentsprev=/^(?:parents|prevUntil|prevAll)/,rmultiselector=/,/,isSimple=/^.[^:#\[\.,]*$/,slice=Array.prototype.slice,POS=jQuery.expr.match.POS,guaranteedUnique={children:true,contents:true,next:true,prev:true};
jQuery.fn.extend({find:function(selector){var self=this,i,l;
if(typeof selector!=="string"){return jQuery(selector).filter(function(){for(i=0,l=self.length;
i<l;
i++){if(jQuery.contains(self[i],this)){return true
}}})
}var ret=this.pushStack("","find",selector),length,n,r;
for(i=0,l=this.length;
i<l;
i++){length=ret.length;
jQuery.find(selector,this[i],ret);
if(i>0){for(n=length;
n<ret.length;
n++){for(r=0;
r<length;
r++){if(ret[r]===ret[n]){ret.splice(n--,1);
break
}}}}}return ret
},has:function(target){var targets=jQuery(target);
return this.filter(function(){for(var i=0,l=targets.length;
i<l;
i++){if(jQuery.contains(this,targets[i])){return true
}}})
},not:function(selector){return this.pushStack(winnow(this,selector,false),"not",selector)
},filter:function(selector){return this.pushStack(winnow(this,selector,true),"filter",selector)
},is:function(selector){return !!selector&&(typeof selector==="string"?POS.test(selector)?jQuery(selector,this.context).index(this[0])>=0:jQuery.filter(selector,this).length>0:this.filter(selector).length>0)
},closest:function(selectors,context){var ret=[],i,l,cur=this[0];
if(jQuery.isArray(selectors)){var level=1;
while(cur&&cur.ownerDocument&&cur!==context){for(i=0;
i<selectors.length;
i++){if(jQuery(cur).is(selectors[i])){ret.push({selector:selectors[i],elem:cur,level:level})
}}cur=cur.parentNode;
level++
}return ret
}var pos=POS.test(selectors)||typeof selectors!=="string"?jQuery(selectors,context||this.context):0;
for(i=0,l=this.length;
i<l;
i++){cur=this[i];
while(cur){if(pos?pos.index(cur)>-1:jQuery.find.matchesSelector(cur,selectors)){ret.push(cur);
break
}else{cur=cur.parentNode;
if(!cur||!cur.ownerDocument||cur===context||cur.nodeType===11){break
}}}}ret=ret.length>1?jQuery.unique(ret):ret;
return this.pushStack(ret,"closest",selectors)
},index:function(elem){if(!elem){return(this[0]&&this[0].parentNode)?this.prevAll().length:-1
}if(typeof elem==="string"){return jQuery.inArray(this[0],jQuery(elem))
}return jQuery.inArray(elem.jquery?elem[0]:elem,this)
},add:function(selector,context){var set=typeof selector==="string"?jQuery(selector,context):jQuery.makeArray(selector&&selector.nodeType?[selector]:selector),all=jQuery.merge(this.get(),set);
return this.pushStack(isDisconnected(set[0])||isDisconnected(all[0])?all:jQuery.unique(all))
},andSelf:function(){return this.add(this.prevObject)
}});
function isDisconnected(node){return !node||!node.parentNode||node.parentNode.nodeType===11
}jQuery.each({parent:function(elem){var parent=elem.parentNode;
return parent&&parent.nodeType!==11?parent:null
},parents:function(elem){return jQuery.dir(elem,"parentNode")
},parentsUntil:function(elem,i,until){return jQuery.dir(elem,"parentNode",until)
},next:function(elem){return jQuery.nth(elem,2,"nextSibling")
},prev:function(elem){return jQuery.nth(elem,2,"previousSibling")
},nextAll:function(elem){return jQuery.dir(elem,"nextSibling")
},prevAll:function(elem){return jQuery.dir(elem,"previousSibling")
},nextUntil:function(elem,i,until){return jQuery.dir(elem,"nextSibling",until)
},prevUntil:function(elem,i,until){return jQuery.dir(elem,"previousSibling",until)
},siblings:function(elem){return jQuery.sibling(elem.parentNode.firstChild,elem)
},children:function(elem){return jQuery.sibling(elem.firstChild)
},contents:function(elem){return jQuery.nodeName(elem,"iframe")?elem.contentDocument||elem.contentWindow.document:jQuery.makeArray(elem.childNodes)
}},function(name,fn){jQuery.fn[name]=function(until,selector){var ret=jQuery.map(this,fn,until);
if(!runtil.test(name)){selector=until
}if(selector&&typeof selector==="string"){ret=jQuery.filter(selector,ret)
}ret=this.length>1&&!guaranteedUnique[name]?jQuery.unique(ret):ret;
if((this.length>1||rmultiselector.test(selector))&&rparentsprev.test(name)){ret=ret.reverse()
}return this.pushStack(ret,name,slice.call(arguments).join(","))
}
});
jQuery.extend({filter:function(expr,elems,not){if(not){expr=":not("+expr+")"
}return elems.length===1?jQuery.find.matchesSelector(elems[0],expr)?[elems[0]]:[]:jQuery.find.matches(expr,elems)
},dir:function(elem,dir,until){var matched=[],cur=elem[dir];
while(cur&&cur.nodeType!==9&&(until===undefined||cur.nodeType!==1||!jQuery(cur).is(until))){if(cur.nodeType===1){matched.push(cur)
}cur=cur[dir]
}return matched
},nth:function(cur,result,dir,elem){result=result||1;
var num=0;
for(;
cur;
cur=cur[dir]){if(cur.nodeType===1&&++num===result){break
}}return cur
},sibling:function(n,elem){var r=[];
for(;
n;
n=n.nextSibling){if(n.nodeType===1&&n!==elem){r.push(n)
}}return r
}});
function winnow(elements,qualifier,keep){qualifier=qualifier||0;
if(jQuery.isFunction(qualifier)){return jQuery.grep(elements,function(elem,i){var retVal=!!qualifier.call(elem,i,elem);
return retVal===keep
})
}else{if(qualifier.nodeType){return jQuery.grep(elements,function(elem,i){return(elem===qualifier)===keep
})
}else{if(typeof qualifier==="string"){var filtered=jQuery.grep(elements,function(elem){return elem.nodeType===1
});
if(isSimple.test(qualifier)){return jQuery.filter(qualifier,filtered,!keep)
}else{qualifier=jQuery.filter(qualifier,filtered)
}}}}return jQuery.grep(elements,function(elem,i){return(jQuery.inArray(elem,qualifier)>=0)===keep
})
}function createSafeFragment(document){var list=nodeNames.split("|"),safeFrag=document.createDocumentFragment();
if(safeFrag.createElement){while(list.length){safeFrag.createElement(list.pop())
}}return safeFrag
}var nodeNames="abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",rinlinejQuery=/ jQuery\d+="(?:\d+|null)"/g,rleadingWhitespace=/^\s+/,rxhtmlTag=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,rtagName=/<([\w:]+)/,rtbody=/<tbody/i,rhtml=/<|&#?\w+;/,rnoInnerhtml=/<(?:script|style)/i,rnocache=/<(?:script|object|embed|option|style)/i,rnoshimcache=new RegExp("<(?:"+nodeNames+")","i"),rchecked=/checked\s*(?:[^=]|=\s*.checked.)/i,rscriptType=/\/(java|ecma)script/i,rcleanScript=/^\s*<!(?:\[CDATA\[|\-\-)/,wrapMap={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]},safeFragment=createSafeFragment(document);
wrapMap.optgroup=wrapMap.option;
wrapMap.tbody=wrapMap.tfoot=wrapMap.colgroup=wrapMap.caption=wrapMap.thead;
wrapMap.th=wrapMap.td;
if(!jQuery.support.htmlSerialize){wrapMap._default=[1,"div<div>","</div>"]
}jQuery.fn.extend({text:function(text){if(jQuery.isFunction(text)){return this.each(function(i){var self=jQuery(this);
self.text(text.call(this,i,self.text()))
})
}if(typeof text!=="object"&&text!==undefined){return this.empty().append((this[0]&&this[0].ownerDocument||document).createTextNode(text))
}return jQuery.text(this)
},wrapAll:function(html){if(jQuery.isFunction(html)){return this.each(function(i){jQuery(this).wrapAll(html.call(this,i))
})
}if(this[0]){var wrap=jQuery(html,this[0].ownerDocument).eq(0).clone(true);
if(this[0].parentNode){wrap.insertBefore(this[0])
}wrap.map(function(){var elem=this;
while(elem.firstChild&&elem.firstChild.nodeType===1){elem=elem.firstChild
}return elem
}).append(this)
}return this
},wrapInner:function(html){if(jQuery.isFunction(html)){return this.each(function(i){jQuery(this).wrapInner(html.call(this,i))
})
}return this.each(function(){var self=jQuery(this),contents=self.contents();
if(contents.length){contents.wrapAll(html)
}else{self.append(html)
}})
},wrap:function(html){var isFunction=jQuery.isFunction(html);
return this.each(function(i){jQuery(this).wrapAll(isFunction?html.call(this,i):html)
})
},unwrap:function(){return this.parent().each(function(){if(!jQuery.nodeName(this,"body")){jQuery(this).replaceWith(this.childNodes)
}}).end()
},append:function(){return this.domManip(arguments,true,function(elem){if(this.nodeType===1){this.appendChild(elem)
}})
},prepend:function(){return this.domManip(arguments,true,function(elem){if(this.nodeType===1){this.insertBefore(elem,this.firstChild)
}})
},before:function(){if(this[0]&&this[0].parentNode){return this.domManip(arguments,false,function(elem){this.parentNode.insertBefore(elem,this)
})
}else{if(arguments.length){var set=jQuery.clean(arguments);
set.push.apply(set,this.toArray());
return this.pushStack(set,"before",arguments)
}}},after:function(){if(this[0]&&this[0].parentNode){return this.domManip(arguments,false,function(elem){this.parentNode.insertBefore(elem,this.nextSibling)
})
}else{if(arguments.length){var set=this.pushStack(this,"after",arguments);
set.push.apply(set,jQuery.clean(arguments));
return set
}}},remove:function(selector,keepData){for(var i=0,elem;
(elem=this[i])!=null;
i++){if(!selector||jQuery.filter(selector,[elem]).length){if(!keepData&&elem.nodeType===1){jQuery.cleanData(elem.getElementsByTagName("*"));
jQuery.cleanData([elem])
}if(elem.parentNode){elem.parentNode.removeChild(elem)
}}}return this
},empty:function(){for(var i=0,elem;
(elem=this[i])!=null;
i++){if(elem.nodeType===1){jQuery.cleanData(elem.getElementsByTagName("*"))
}while(elem.firstChild){elem.removeChild(elem.firstChild)
}}return this
},clone:function(dataAndEvents,deepDataAndEvents){dataAndEvents=dataAndEvents==null?false:dataAndEvents;
deepDataAndEvents=deepDataAndEvents==null?dataAndEvents:deepDataAndEvents;
return this.map(function(){return jQuery.clone(this,dataAndEvents,deepDataAndEvents)
})
},html:function(value){if(value===undefined){return this[0]&&this[0].nodeType===1?this[0].innerHTML.replace(rinlinejQuery,""):null
}else{if(typeof value==="string"&&!rnoInnerhtml.test(value)&&(jQuery.support.leadingWhitespace||!rleadingWhitespace.test(value))&&!wrapMap[(rtagName.exec(value)||["",""])[1].toLowerCase()]){value=value.replace(rxhtmlTag,"<$1></$2>");
try{for(var i=0,l=this.length;
i<l;
i++){if(this[i].nodeType===1){jQuery.cleanData(this[i].getElementsByTagName("*"));
this[i].innerHTML=value
}}}catch(e){this.empty().append(value)
}}else{if(jQuery.isFunction(value)){this.each(function(i){var self=jQuery(this);
self.html(value.call(this,i,self.html()))
})
}else{this.empty().append(value)
}}}return this
},replaceWith:function(value){if(this[0]&&this[0].parentNode){if(jQuery.isFunction(value)){return this.each(function(i){var self=jQuery(this),old=self.html();
self.replaceWith(value.call(this,i,old))
})
}if(typeof value!=="string"){value=jQuery(value).detach()
}return this.each(function(){var next=this.nextSibling,parent=this.parentNode;
jQuery(this).remove();
if(next){jQuery(next).before(value)
}else{jQuery(parent).append(value)
}})
}else{return this.length?this.pushStack(jQuery(jQuery.isFunction(value)?value():value),"replaceWith",value):this
}},detach:function(selector){return this.remove(selector,true)
},domManip:function(args,table,callback){var results,first,fragment,parent,value=args[0],scripts=[];
if(!jQuery.support.checkClone&&arguments.length===3&&typeof value==="string"&&rchecked.test(value)){return this.each(function(){jQuery(this).domManip(args,table,callback,true)
})
}if(jQuery.isFunction(value)){return this.each(function(i){var self=jQuery(this);
args[0]=value.call(this,i,table?self.html():undefined);
self.domManip(args,table,callback)
})
}if(this[0]){parent=value&&value.parentNode;
if(jQuery.support.parentNode&&parent&&parent.nodeType===11&&parent.childNodes.length===this.length){results={fragment:parent}
}else{results=jQuery.buildFragment(args,this,scripts)
}fragment=results.fragment;
if(fragment.childNodes.length===1){first=fragment=fragment.firstChild
}else{first=fragment.firstChild
}if(first){table=table&&jQuery.nodeName(first,"tr");
for(var i=0,l=this.length,lastIndex=l-1;
i<l;
i++){callback.call(table?root(this[i],first):this[i],results.cacheable||(l>1&&i<lastIndex)?jQuery.clone(fragment,true,true):fragment)
}}if(scripts.length){jQuery.each(scripts,evalScript)
}}return this
}});
function root(elem,cur){return jQuery.nodeName(elem,"table")?(elem.getElementsByTagName("tbody")[0]||elem.appendChild(elem.ownerDocument.createElement("tbody"))):elem
}function cloneCopyEvent(src,dest){if(dest.nodeType!==1||!jQuery.hasData(src)){return
}var type,i,l,oldData=jQuery._data(src),curData=jQuery._data(dest,oldData),events=oldData.events;
if(events){delete curData.handle;
curData.events={};
for(type in events){for(i=0,l=events[type].length;
i<l;
i++){jQuery.event.add(dest,type+(events[type][i].namespace?".":"")+events[type][i].namespace,events[type][i],events[type][i].data)
}}}if(curData.data){curData.data=jQuery.extend({},curData.data)
}}function cloneFixAttributes(src,dest){var nodeName;
if(dest.nodeType!==1){return
}if(dest.clearAttributes){dest.clearAttributes()
}if(dest.mergeAttributes){dest.mergeAttributes(src)
}nodeName=dest.nodeName.toLowerCase();
if(nodeName==="object"){dest.outerHTML=src.outerHTML
}else{if(nodeName==="input"&&(src.type==="checkbox"||src.type==="radio")){if(src.checked){dest.defaultChecked=dest.checked=src.checked
}if(dest.value!==src.value){dest.value=src.value
}}else{if(nodeName==="option"){dest.selected=src.defaultSelected
}else{if(nodeName==="input"||nodeName==="textarea"){dest.defaultValue=src.defaultValue
}}}}dest.removeAttribute(jQuery.expando)
}jQuery.buildFragment=function(args,nodes,scripts){var fragment,cacheable,cacheresults,doc,first=args[0];
if(nodes&&nodes[0]){doc=nodes[0].ownerDocument||nodes[0]
}if(!doc.createDocumentFragment){doc=document
}if(args.length===1&&typeof first==="string"&&first.length<512&&doc===document&&first.charAt(0)==="<"&&!rnocache.test(first)&&(jQuery.support.checkClone||!rchecked.test(first))&&(jQuery.support.html5Clone||!rnoshimcache.test(first))){cacheable=true;
cacheresults=jQuery.fragments[first];
if(cacheresults&&cacheresults!==1){fragment=cacheresults
}}if(!fragment){fragment=doc.createDocumentFragment();
jQuery.clean(args,doc,fragment,scripts)
}if(cacheable){jQuery.fragments[first]=cacheresults?fragment:1
}return{fragment:fragment,cacheable:cacheable}
};
jQuery.fragments={};
jQuery.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(name,original){jQuery.fn[name]=function(selector){var ret=[],insert=jQuery(selector),parent=this.length===1&&this[0].parentNode;
if(parent&&parent.nodeType===11&&parent.childNodes.length===1&&insert.length===1){insert[original](this[0]);
return this
}else{for(var i=0,l=insert.length;
i<l;
i++){var elems=(i>0?this.clone(true):this).get();
jQuery(insert[i])[original](elems);
ret=ret.concat(elems)
}return this.pushStack(ret,name,insert.selector)
}}
});
function getAll(elem){if(typeof elem.getElementsByTagName!=="undefined"){return elem.getElementsByTagName("*")
}else{if(typeof elem.querySelectorAll!=="undefined"){return elem.querySelectorAll("*")
}else{return[]
}}}function fixDefaultChecked(elem){if(elem.type==="checkbox"||elem.type==="radio"){elem.defaultChecked=elem.checked
}}function findInputs(elem){var nodeName=(elem.nodeName||"").toLowerCase();
if(nodeName==="input"){fixDefaultChecked(elem)
}else{if(nodeName!=="script"&&typeof elem.getElementsByTagName!=="undefined"){jQuery.grep(elem.getElementsByTagName("input"),fixDefaultChecked)
}}}function shimCloneNode(elem){var div=document.createElement("div");
safeFragment.appendChild(div);
div.innerHTML=elem.outerHTML;
return div.firstChild
}jQuery.extend({clone:function(elem,dataAndEvents,deepDataAndEvents){var srcElements,destElements,i,clone=jQuery.support.html5Clone||!rnoshimcache.test("<"+elem.nodeName)?elem.cloneNode(true):shimCloneNode(elem);
if((!jQuery.support.noCloneEvent||!jQuery.support.noCloneChecked)&&(elem.nodeType===1||elem.nodeType===11)&&!jQuery.isXMLDoc(elem)){cloneFixAttributes(elem,clone);
srcElements=getAll(elem);
destElements=getAll(clone);
for(i=0;
srcElements[i];
++i){if(destElements[i]){cloneFixAttributes(srcElements[i],destElements[i])
}}}if(dataAndEvents){cloneCopyEvent(elem,clone);
if(deepDataAndEvents){srcElements=getAll(elem);
destElements=getAll(clone);
for(i=0;
srcElements[i];
++i){cloneCopyEvent(srcElements[i],destElements[i])
}}}srcElements=destElements=null;
return clone
},clean:function(elems,context,fragment,scripts){var checkScriptType;
context=context||document;
if(typeof context.createElement==="undefined"){context=context.ownerDocument||context[0]&&context[0].ownerDocument||document
}var ret=[],j;
for(var i=0,elem;
(elem=elems[i])!=null;
i++){if(typeof elem==="number"){elem+=""
}if(!elem){continue
}if(typeof elem==="string"){if(!rhtml.test(elem)){elem=context.createTextNode(elem)
}else{elem=elem.replace(rxhtmlTag,"<$1></$2>");
var tag=(rtagName.exec(elem)||["",""])[1].toLowerCase(),wrap=wrapMap[tag]||wrapMap._default,depth=wrap[0],div=context.createElement("div");
if(context===document){safeFragment.appendChild(div)
}else{createSafeFragment(context).appendChild(div)
}div.innerHTML=wrap[1]+elem+wrap[2];
while(depth--){div=div.lastChild
}if(!jQuery.support.tbody){var hasBody=rtbody.test(elem),tbody=tag==="table"&&!hasBody?div.firstChild&&div.firstChild.childNodes:wrap[1]==="<table>"&&!hasBody?div.childNodes:[];
for(j=tbody.length-1;
j>=0;
--j){if(jQuery.nodeName(tbody[j],"tbody")&&!tbody[j].childNodes.length){tbody[j].parentNode.removeChild(tbody[j])
}}}if(!jQuery.support.leadingWhitespace&&rleadingWhitespace.test(elem)){div.insertBefore(context.createTextNode(rleadingWhitespace.exec(elem)[0]),div.firstChild)
}elem=div.childNodes
}}var len;
if(!jQuery.support.appendChecked){if(elem[0]&&typeof(len=elem.length)==="number"){for(j=0;
j<len;
j++){findInputs(elem[j])
}}else{findInputs(elem)
}}if(elem.nodeType){ret.push(elem)
}else{ret=jQuery.merge(ret,elem)
}}if(fragment){checkScriptType=function(elem){return !elem.type||rscriptType.test(elem.type)
};
for(i=0;
ret[i];
i++){if(scripts&&jQuery.nodeName(ret[i],"script")&&(!ret[i].type||ret[i].type.toLowerCase()==="text/javascript")){scripts.push(ret[i].parentNode?ret[i].parentNode.removeChild(ret[i]):ret[i])
}else{if(ret[i].nodeType===1){var jsTags=jQuery.grep(ret[i].getElementsByTagName("script"),checkScriptType);
ret.splice.apply(ret,[i+1,0].concat(jsTags))
}fragment.appendChild(ret[i])
}}}return ret
},cleanData:function(elems){var data,id,cache=jQuery.cache,special=jQuery.event.special,deleteExpando=jQuery.support.deleteExpando;
for(var i=0,elem;
(elem=elems[i])!=null;
i++){if(elem.nodeName&&jQuery.noData[elem.nodeName.toLowerCase()]){continue
}id=elem[jQuery.expando];
if(id){data=cache[id];
if(data&&data.events){for(var type in data.events){if(special[type]){jQuery.event.remove(elem,type)
}else{jQuery.removeEvent(elem,type,data.handle)
}}if(data.handle){data.handle.elem=null
}}if(deleteExpando){delete elem[jQuery.expando]
}else{if(elem.removeAttribute){elem.removeAttribute(jQuery.expando)
}}delete cache[id]
}}}});
function evalScript(i,elem){if(elem.src){jQuery.ajax({url:elem.src,async:false,dataType:"script"})
}else{jQuery.globalEval((elem.text||elem.textContent||elem.innerHTML||"").replace(rcleanScript,"/*$0*/"))
}if(elem.parentNode){elem.parentNode.removeChild(elem)
}}var ralpha=/alpha\([^)]*\)/i,ropacity=/opacity=([^)]*)/,rupper=/([A-Z]|^ms)/g,rnumpx=/^-?\d+(?:px)?$/i,rnum=/^-?\d/,rrelNum=/^([\-+])=([\-+.\de]+)/,cssShow={position:"absolute",visibility:"hidden",display:"block"},cssWidth=["Left","Right"],cssHeight=["Top","Bottom"],curCSS,getComputedStyle,currentStyle;
jQuery.fn.css=function(name,value){if(arguments.length===2&&value===undefined){return this
}return jQuery.access(this,name,value,true,function(elem,name,value){return value!==undefined?jQuery.style(elem,name,value):jQuery.css(elem,name)
})
};
jQuery.extend({cssHooks:{opacity:{get:function(elem,computed){if(computed){var ret=curCSS(elem,"opacity","opacity");
return ret===""?"1":ret
}else{return elem.style.opacity
}}}},cssNumber:{fillOpacity:true,fontWeight:true,lineHeight:true,opacity:true,orphans:true,widows:true,zIndex:true,zoom:true},cssProps:{"float":jQuery.support.cssFloat?"cssFloat":"styleFloat"},style:function(elem,name,value,extra){if(!elem||elem.nodeType===3||elem.nodeType===8||!elem.style){return
}var ret,type,origName=jQuery.camelCase(name),style=elem.style,hooks=jQuery.cssHooks[origName];
name=jQuery.cssProps[origName]||origName;
if(value!==undefined){type=typeof value;
if(type==="string"&&(ret=rrelNum.exec(value))){value=(+(ret[1]+1)*+ret[2])+parseFloat(jQuery.css(elem,name));
type="number"
}if(value==null||type==="number"&&isNaN(value)){return
}if(type==="number"&&!jQuery.cssNumber[origName]){value+="px"
}if(!hooks||!("set" in hooks)||(value=hooks.set(elem,value))!==undefined){try{style[name]=value
}catch(e){}}}else{if(hooks&&"get" in hooks&&(ret=hooks.get(elem,false,extra))!==undefined){return ret
}return style[name]
}},css:function(elem,name,extra){var ret,hooks;
name=jQuery.camelCase(name);
hooks=jQuery.cssHooks[name];
name=jQuery.cssProps[name]||name;
if(name==="cssFloat"){name="float"
}if(hooks&&"get" in hooks&&(ret=hooks.get(elem,true,extra))!==undefined){return ret
}else{if(curCSS){return curCSS(elem,name)
}}},swap:function(elem,options,callback){var old={};
for(var name in options){old[name]=elem.style[name];
elem.style[name]=options[name]
}callback.call(elem);
for(name in options){elem.style[name]=old[name]
}}});
jQuery.curCSS=jQuery.css;
jQuery.each(["height","width"],function(i,name){jQuery.cssHooks[name]={get:function(elem,computed,extra){var val;
if(computed){if(elem.offsetWidth!==0){return getWH(elem,name,extra)
}else{jQuery.swap(elem,cssShow,function(){val=getWH(elem,name,extra)
})
}return val
}},set:function(elem,value){if(rnumpx.test(value)){value=parseFloat(value);
if(value>=0){return value+"px"
}}else{return value
}}}
});
if(!jQuery.support.opacity){jQuery.cssHooks.opacity={get:function(elem,computed){return ropacity.test((computed&&elem.currentStyle?elem.currentStyle.filter:elem.style.filter)||"")?(parseFloat(RegExp.$1)/100)+"":computed?"1":""
},set:function(elem,value){var style=elem.style,currentStyle=elem.currentStyle,opacity=jQuery.isNumeric(value)?"alpha(opacity="+value*100+")":"",filter=currentStyle&&currentStyle.filter||style.filter||"";
style.zoom=1;
if(value>=1&&jQuery.trim(filter.replace(ralpha,""))===""){style.removeAttribute("filter");
if(currentStyle&&!currentStyle.filter){return
}}style.filter=ralpha.test(filter)?filter.replace(ralpha,opacity):filter+" "+opacity
}}
}jQuery(function(){if(!jQuery.support.reliableMarginRight){jQuery.cssHooks.marginRight={get:function(elem,computed){var ret;
jQuery.swap(elem,{display:"inline-block"},function(){if(computed){ret=curCSS(elem,"margin-right","marginRight")
}else{ret=elem.style.marginRight
}});
return ret
}}
}});
if(document.defaultView&&document.defaultView.getComputedStyle){getComputedStyle=function(elem,name){var ret,defaultView,computedStyle;
name=name.replace(rupper,"-$1").toLowerCase();
if((defaultView=elem.ownerDocument.defaultView)&&(computedStyle=defaultView.getComputedStyle(elem,null))){ret=computedStyle.getPropertyValue(name);
if(ret===""&&!jQuery.contains(elem.ownerDocument.documentElement,elem)){ret=jQuery.style(elem,name)
}}return ret
}
}if(document.documentElement.currentStyle){currentStyle=function(elem,name){var left,rsLeft,uncomputed,ret=elem.currentStyle&&elem.currentStyle[name],style=elem.style;
if(ret===null&&style&&(uncomputed=style[name])){ret=uncomputed
}if(!rnumpx.test(ret)&&rnum.test(ret)){left=style.left;
rsLeft=elem.runtimeStyle&&elem.runtimeStyle.left;
if(rsLeft){elem.runtimeStyle.left=elem.currentStyle.left
}style.left=name==="fontSize"?"1em":(ret||0);
ret=style.pixelLeft+"px";
style.left=left;
if(rsLeft){elem.runtimeStyle.left=rsLeft
}}return ret===""?"auto":ret
}
}curCSS=getComputedStyle||currentStyle;
function getWH(elem,name,extra){var val=name==="width"?elem.offsetWidth:elem.offsetHeight,which=name==="width"?cssWidth:cssHeight,i=0,len=which.length;
if(val>0){if(extra!=="border"){for(;
i<len;
i++){if(!extra){val-=parseFloat(jQuery.css(elem,"padding"+which[i]))||0
}if(extra==="margin"){val+=parseFloat(jQuery.css(elem,extra+which[i]))||0
}else{val-=parseFloat(jQuery.css(elem,"border"+which[i]+"Width"))||0
}}}return val+"px"
}val=curCSS(elem,name,name);
if(val<0||val==null){val=elem.style[name]||0
}val=parseFloat(val)||0;
if(extra){for(;
i<len;
i++){val+=parseFloat(jQuery.css(elem,"padding"+which[i]))||0;
if(extra!=="padding"){val+=parseFloat(jQuery.css(elem,"border"+which[i]+"Width"))||0
}if(extra==="margin"){val+=parseFloat(jQuery.css(elem,extra+which[i]))||0
}}}return val+"px"
}if(jQuery.expr&&jQuery.expr.filters){jQuery.expr.filters.hidden=function(elem){var width=elem.offsetWidth,height=elem.offsetHeight;
return(width===0&&height===0)||(!jQuery.support.reliableHiddenOffsets&&((elem.style&&elem.style.display)||jQuery.css(elem,"display"))==="none")
};
jQuery.expr.filters.visible=function(elem){return !jQuery.expr.filters.hidden(elem)
}
}var r20=/%20/g,rbracket=/\[\]$/,rCRLF=/\r?\n/g,rhash=/#.*$/,rheaders=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,rinput=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,rlocalProtocol=/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,rnoContent=/^(?:GET|HEAD)$/,rprotocol=/^\/\//,rquery=/\?/,rscript=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,rselectTextarea=/^(?:select|textarea)/i,rspacesAjax=/\s+/,rts=/([?&])_=[^&]*/,rurl=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,_load=jQuery.fn.load,prefilters={},transports={},ajaxLocation,ajaxLocParts,allTypes=["*/"]+["*"];
try{ajaxLocation=location.href
}catch(e){ajaxLocation=document.createElement("a");
ajaxLocation.href="";
ajaxLocation=ajaxLocation.href
}ajaxLocParts=rurl.exec(ajaxLocation.toLowerCase())||[];
function addToPrefiltersOrTransports(structure){return function(dataTypeExpression,func){if(typeof dataTypeExpression!=="string"){func=dataTypeExpression;
dataTypeExpression="*"
}if(jQuery.isFunction(func)){var dataTypes=dataTypeExpression.toLowerCase().split(rspacesAjax),i=0,length=dataTypes.length,dataType,list,placeBefore;
for(;
i<length;
i++){dataType=dataTypes[i];
placeBefore=/^\+/.test(dataType);
if(placeBefore){dataType=dataType.substr(1)||"*"
}list=structure[dataType]=structure[dataType]||[];
list[placeBefore?"unshift":"push"](func)
}}}
}function inspectPrefiltersOrTransports(structure,options,originalOptions,jqXHR,dataType,inspected){dataType=dataType||options.dataTypes[0];
inspected=inspected||{};
inspected[dataType]=true;
var list=structure[dataType],i=0,length=list?list.length:0,executeOnly=(structure===prefilters),selection;
for(;
i<length&&(executeOnly||!selection);
i++){selection=list[i](options,originalOptions,jqXHR);
if(typeof selection==="string"){if(!executeOnly||inspected[selection]){selection=undefined
}else{options.dataTypes.unshift(selection);
selection=inspectPrefiltersOrTransports(structure,options,originalOptions,jqXHR,selection,inspected)
}}}if((executeOnly||!selection)&&!inspected["*"]){selection=inspectPrefiltersOrTransports(structure,options,originalOptions,jqXHR,"*",inspected)
}return selection
}function ajaxExtend(target,src){var key,deep,flatOptions=jQuery.ajaxSettings.flatOptions||{};
for(key in src){if(src[key]!==undefined){(flatOptions[key]?target:(deep||(deep={})))[key]=src[key]
}}if(deep){jQuery.extend(true,target,deep)
}}jQuery.fn.extend({load:function(url,params,callback){if(typeof url!=="string"&&_load){return _load.apply(this,arguments)
}else{if(!this.length){return this
}}var off=url.indexOf(" ");
if(off>=0){var selector=url.slice(off,url.length);
url=url.slice(0,off)
}var type="GET";
if(params){if(jQuery.isFunction(params)){callback=params;
params=undefined
}else{if(typeof params==="object"){params=jQuery.param(params,jQuery.ajaxSettings.traditional);
type="POST"
}}}var self=this;
jQuery.ajax({url:url,type:type,dataType:"html",data:params,complete:function(jqXHR,status,responseText){responseText=jqXHR.responseText;
if(jqXHR.isResolved()){jqXHR.done(function(r){responseText=r
});
self.html(selector?jQuery("<div>").append(responseText.replace(rscript,"")).find(selector):responseText)
}if(callback){self.each(callback,[responseText,status,jqXHR])
}}});
return this
},serialize:function(){return jQuery.param(this.serializeArray())
},serializeArray:function(){return this.map(function(){return this.elements?jQuery.makeArray(this.elements):this
}).filter(function(){return this.name&&!this.disabled&&(this.checked||rselectTextarea.test(this.nodeName)||rinput.test(this.type))
}).map(function(i,elem){var val=jQuery(this).val();
return val==null?null:jQuery.isArray(val)?jQuery.map(val,function(val,i){return{name:elem.name,value:val.replace(rCRLF,"\r\n")}
}):{name:elem.name,value:val.replace(rCRLF,"\r\n")}
}).get()
}});
jQuery.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(i,o){jQuery.fn[o]=function(f){return this.on(o,f)
}
});
jQuery.each(["get","post"],function(i,method){jQuery[method]=function(url,data,callback,type){if(jQuery.isFunction(data)){type=type||callback;
callback=data;
data=undefined
}return jQuery.ajax({type:method,url:url,data:data,success:callback,dataType:type})
}
});
jQuery.extend({getScript:function(url,callback){return jQuery.get(url,undefined,callback,"script")
},getJSON:function(url,data,callback){return jQuery.get(url,data,callback,"json")
},ajaxSetup:function(target,settings){if(settings){ajaxExtend(target,jQuery.ajaxSettings)
}else{settings=target;
target=jQuery.ajaxSettings
}ajaxExtend(target,settings);
return target
},ajaxSettings:{url:ajaxLocation,isLocal:rlocalProtocol.test(ajaxLocParts[1]),global:true,type:"GET",contentType:"application/x-www-form-urlencoded",processData:true,async:true,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":allTypes},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":window.String,"text html":true,"text json":jQuery.parseJSON,"text xml":jQuery.parseXML},flatOptions:{context:true,url:true}},ajaxPrefilter:addToPrefiltersOrTransports(prefilters),ajaxTransport:addToPrefiltersOrTransports(transports),ajax:function(url,options){if(typeof url==="object"){options=url;
url=undefined
}options=options||{};
var s=jQuery.ajaxSetup({},options),callbackContext=s.context||s,globalEventContext=callbackContext!==s&&(callbackContext.nodeType||callbackContext instanceof jQuery)?jQuery(callbackContext):jQuery.event,deferred=jQuery.Deferred(),completeDeferred=jQuery.Callbacks("once memory"),statusCode=s.statusCode||{},ifModifiedKey,requestHeaders={},requestHeadersNames={},responseHeadersString,responseHeaders,transport,timeoutTimer,parts,state=0,fireGlobals,i,jqXHR={readyState:0,setRequestHeader:function(name,value){if(!state){var lname=name.toLowerCase();
name=requestHeadersNames[lname]=requestHeadersNames[lname]||name;
requestHeaders[name]=value
}return this
},getAllResponseHeaders:function(){return state===2?responseHeadersString:null
},getResponseHeader:function(key){var match;
if(state===2){if(!responseHeaders){responseHeaders={};
while((match=rheaders.exec(responseHeadersString))){responseHeaders[match[1].toLowerCase()]=match[2]
}}match=responseHeaders[key.toLowerCase()]
}return match===undefined?null:match
},overrideMimeType:function(type){if(!state){s.mimeType=type
}return this
},abort:function(statusText){statusText=statusText||"abort";
if(transport){transport.abort(statusText)
}done(0,statusText);
return this
}};
function done(status,nativeStatusText,responses,headers){if(state===2){return
}state=2;
if(timeoutTimer){clearTimeout(timeoutTimer)
}transport=undefined;
responseHeadersString=headers||"";
jqXHR.readyState=status>0?4:0;
var isSuccess,success,error,statusText=nativeStatusText,response=responses?ajaxHandleResponses(s,jqXHR,responses):undefined,lastModified,etag;
if(status>=200&&status<300||status===304){if(s.ifModified){if((lastModified=jqXHR.getResponseHeader("Last-Modified"))){jQuery.lastModified[ifModifiedKey]=lastModified
}if((etag=jqXHR.getResponseHeader("Etag"))){jQuery.etag[ifModifiedKey]=etag
}}if(status===304){statusText="notmodified";
isSuccess=true
}else{try{success=ajaxConvert(s,response);
statusText="success";
isSuccess=true
}catch(e){statusText="parsererror";
error=e
}}}else{error=statusText;
if(!statusText||status){statusText="error";
if(status<0){status=0
}}}jqXHR.status=status;
jqXHR.statusText=""+(nativeStatusText||statusText);
if(isSuccess){deferred.resolveWith(callbackContext,[success,statusText,jqXHR])
}else{deferred.rejectWith(callbackContext,[jqXHR,statusText,error])
}jqXHR.statusCode(statusCode);
statusCode=undefined;
if(fireGlobals){globalEventContext.trigger("ajax"+(isSuccess?"Success":"Error"),[jqXHR,s,isSuccess?success:error])
}completeDeferred.fireWith(callbackContext,[jqXHR,statusText]);
if(fireGlobals){globalEventContext.trigger("ajaxComplete",[jqXHR,s]);
if(!(--jQuery.active)){jQuery.event.trigger("ajaxStop")
}}}deferred.promise(jqXHR);
jqXHR.success=jqXHR.done;
jqXHR.error=jqXHR.fail;
jqXHR.complete=completeDeferred.add;
jqXHR.statusCode=function(map){if(map){var tmp;
if(state<2){for(tmp in map){statusCode[tmp]=[statusCode[tmp],map[tmp]]
}}else{tmp=map[jqXHR.status];
jqXHR.then(tmp,tmp)
}}return this
};
s.url=((url||s.url)+"").replace(rhash,"").replace(rprotocol,ajaxLocParts[1]+"//");
s.dataTypes=jQuery.trim(s.dataType||"*").toLowerCase().split(rspacesAjax);
if(s.crossDomain==null){parts=rurl.exec(s.url.toLowerCase());
s.crossDomain=!!(parts&&(parts[1]!=ajaxLocParts[1]||parts[2]!=ajaxLocParts[2]||(parts[3]||(parts[1]==="http:"?80:443))!=(ajaxLocParts[3]||(ajaxLocParts[1]==="http:"?80:443))))
}if(s.data&&s.processData&&typeof s.data!=="string"){s.data=jQuery.param(s.data,s.traditional)
}inspectPrefiltersOrTransports(prefilters,s,options,jqXHR);
if(state===2){return false
}fireGlobals=s.global;
s.type=s.type.toUpperCase();
s.hasContent=!rnoContent.test(s.type);
if(fireGlobals&&jQuery.active++===0){jQuery.event.trigger("ajaxStart")
}if(!s.hasContent){if(s.data){s.url+=(rquery.test(s.url)?"&":"?")+s.data;
delete s.data
}ifModifiedKey=s.url;
if(s.cache===false){var ts=jQuery.now(),ret=s.url.replace(rts,"$1_="+ts);
s.url=ret+((ret===s.url)?(rquery.test(s.url)?"&":"?")+"_="+ts:"")
}}if(s.data&&s.hasContent&&s.contentType!==false||options.contentType){jqXHR.setRequestHeader("Content-Type",s.contentType)
}if(s.ifModified){ifModifiedKey=ifModifiedKey||s.url;
if(jQuery.lastModified[ifModifiedKey]){jqXHR.setRequestHeader("If-Modified-Since",jQuery.lastModified[ifModifiedKey])
}if(jQuery.etag[ifModifiedKey]){jqXHR.setRequestHeader("If-None-Match",jQuery.etag[ifModifiedKey])
}}jqXHR.setRequestHeader("Accept",s.dataTypes[0]&&s.accepts[s.dataTypes[0]]?s.accepts[s.dataTypes[0]]+(s.dataTypes[0]!=="*"?", "+allTypes+"; q=0.01":""):s.accepts["*"]);
for(i in s.headers){jqXHR.setRequestHeader(i,s.headers[i])
}if(s.beforeSend&&(s.beforeSend.call(callbackContext,jqXHR,s)===false||state===2)){jqXHR.abort();
return false
}for(i in {success:1,error:1,complete:1}){jqXHR[i](s[i])
}transport=inspectPrefiltersOrTransports(transports,s,options,jqXHR);
if(!transport){done(-1,"No Transport")
}else{jqXHR.readyState=1;
if(fireGlobals){globalEventContext.trigger("ajaxSend",[jqXHR,s])
}if(s.async&&s.timeout>0){timeoutTimer=setTimeout(function(){jqXHR.abort("timeout")
},s.timeout)
}try{state=1;
transport.send(requestHeaders,done)
}catch(e){if(state<2){done(-1,e)
}else{throw e
}}}return jqXHR
},param:function(a,traditional){var s=[],add=function(key,value){value=jQuery.isFunction(value)?value():value;
s[s.length]=encodeURIComponent(key)+"="+encodeURIComponent(value)
};
if(traditional===undefined){traditional=jQuery.ajaxSettings.traditional
}if(jQuery.isArray(a)||(a.jquery&&!jQuery.isPlainObject(a))){jQuery.each(a,function(){add(this.name,this.value)
})
}else{for(var prefix in a){buildParams(prefix,a[prefix],traditional,add)
}}return s.join("&").replace(r20,"+")
}});
function buildParams(prefix,obj,traditional,add){if(jQuery.isArray(obj)){jQuery.each(obj,function(i,v){if(traditional||rbracket.test(prefix)){add(prefix,v)
}else{buildParams(prefix+"["+(typeof v==="object"||jQuery.isArray(v)?i:"")+"]",v,traditional,add)
}})
}else{if(!traditional&&obj!=null&&typeof obj==="object"){for(var name in obj){buildParams(prefix+"["+name+"]",obj[name],traditional,add)
}}else{add(prefix,obj)
}}}jQuery.extend({active:0,lastModified:{},etag:{}});
function ajaxHandleResponses(s,jqXHR,responses){var contents=s.contents,dataTypes=s.dataTypes,responseFields=s.responseFields,ct,type,finalDataType,firstDataType;
for(type in responseFields){if(type in responses){jqXHR[responseFields[type]]=responses[type]
}}while(dataTypes[0]==="*"){dataTypes.shift();
if(ct===undefined){ct=s.mimeType||jqXHR.getResponseHeader("content-type")
}}if(ct){for(type in contents){if(contents[type]&&contents[type].test(ct)){dataTypes.unshift(type);
break
}}}if(dataTypes[0] in responses){finalDataType=dataTypes[0]
}else{for(type in responses){if(!dataTypes[0]||s.converters[type+" "+dataTypes[0]]){finalDataType=type;
break
}if(!firstDataType){firstDataType=type
}}finalDataType=finalDataType||firstDataType
}if(finalDataType){if(finalDataType!==dataTypes[0]){dataTypes.unshift(finalDataType)
}return responses[finalDataType]
}}function ajaxConvert(s,response){if(s.dataFilter){response=s.dataFilter(response,s.dataType)
}var dataTypes=s.dataTypes,converters={},i,key,length=dataTypes.length,tmp,current=dataTypes[0],prev,conversion,conv,conv1,conv2;
for(i=1;
i<length;
i++){if(i===1){for(key in s.converters){if(typeof key==="string"){converters[key.toLowerCase()]=s.converters[key]
}}}prev=current;
current=dataTypes[i];
if(current==="*"){current=prev
}else{if(prev!=="*"&&prev!==current){conversion=prev+" "+current;
conv=converters[conversion]||converters["* "+current];
if(!conv){conv2=undefined;
for(conv1 in converters){tmp=conv1.split(" ");
if(tmp[0]===prev||tmp[0]==="*"){conv2=converters[tmp[1]+" "+current];
if(conv2){conv1=converters[conv1];
if(conv1===true){conv=conv2
}else{if(conv2===true){conv=conv1
}}break
}}}}if(!(conv||conv2)){jQuery.error("No conversion from "+conversion.replace(" "," to "))
}if(conv!==true){response=conv?conv(response):conv2(conv1(response))
}}}}return response
}var jsc=jQuery.now(),jsre=/(\=)\?(&|$)|\?\?/i;
jQuery.ajaxSetup({jsonp:"callback",jsonpCallback:function(){return jQuery.expando+"_"+(jsc++)
}});
jQuery.ajaxPrefilter("json jsonp",function(s,originalSettings,jqXHR){var inspectData=s.contentType==="application/x-www-form-urlencoded"&&(typeof s.data==="string");
if(s.dataTypes[0]==="jsonp"||s.jsonp!==false&&(jsre.test(s.url)||inspectData&&jsre.test(s.data))){var responseContainer,jsonpCallback=s.jsonpCallback=jQuery.isFunction(s.jsonpCallback)?s.jsonpCallback():s.jsonpCallback,previous=window[jsonpCallback],url=s.url,data=s.data,replace="$1"+jsonpCallback+"$2";
if(s.jsonp!==false){url=url.replace(jsre,replace);
if(s.url===url){if(inspectData){data=data.replace(jsre,replace)
}if(s.data===data){url+=(/\?/.test(url)?"&":"?")+s.jsonp+"="+jsonpCallback
}}}s.url=url;
s.data=data;
window[jsonpCallback]=function(response){responseContainer=[response]
};
jqXHR.always(function(){window[jsonpCallback]=previous;
if(responseContainer&&jQuery.isFunction(previous)){window[jsonpCallback](responseContainer[0])
}});
s.converters["script json"]=function(){if(!responseContainer){jQuery.error(jsonpCallback+" was not called")
}return responseContainer[0]
};
s.dataTypes[0]="json";
return"script"
}});
jQuery.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(text){jQuery.globalEval(text);
return text
}}});
jQuery.ajaxPrefilter("script",function(s){if(s.cache===undefined){s.cache=false
}if(s.crossDomain){s.type="GET";
s.global=false
}});
jQuery.ajaxTransport("script",function(s){if(s.crossDomain){var script,head=document.head||document.getElementsByTagName("head")[0]||document.documentElement;
return{send:function(_,callback){script=document.createElement("script");
script.async="async";
if(s.scriptCharset){script.charset=s.scriptCharset
}script.src=s.url;
script.onload=script.onreadystatechange=function(_,isAbort){if(isAbort||!script.readyState||/loaded|complete/.test(script.readyState)){script.onload=script.onreadystatechange=null;
if(head&&script.parentNode){head.removeChild(script)
}script=undefined;
if(!isAbort){callback(200,"success")
}}};
head.insertBefore(script,head.firstChild)
},abort:function(){if(script){script.onload(0,1)
}}}
}});
var xhrOnUnloadAbort=window.ActiveXObject?function(){for(var key in xhrCallbacks){xhrCallbacks[key](0,1)
}}:false,xhrId=0,xhrCallbacks;
function createStandardXHR(){try{return new window.XMLHttpRequest()
}catch(e){}}function createActiveXHR(){try{return new window.ActiveXObject("Microsoft.XMLHTTP")
}catch(e){}}jQuery.ajaxSettings.xhr=window.ActiveXObject?function(){return !this.isLocal&&createStandardXHR()||createActiveXHR()
}:createStandardXHR;
(function(xhr){jQuery.extend(jQuery.support,{ajax:!!xhr,cors:!!xhr&&("withCredentials" in xhr)})
})(jQuery.ajaxSettings.xhr());
if(jQuery.support.ajax){jQuery.ajaxTransport(function(s){if(!s.crossDomain||jQuery.support.cors){var callback;
return{send:function(headers,complete){var xhr=s.xhr(),handle,i;
if(s.username){xhr.open(s.type,s.url,s.async,s.username,s.password)
}else{xhr.open(s.type,s.url,s.async)
}if(s.xhrFields){for(i in s.xhrFields){xhr[i]=s.xhrFields[i]
}}if(s.mimeType&&xhr.overrideMimeType){xhr.overrideMimeType(s.mimeType)
}if(!s.crossDomain&&!headers["X-Requested-With"]){headers["X-Requested-With"]="XMLHttpRequest"
}try{for(i in headers){xhr.setRequestHeader(i,headers[i])
}}catch(_){}xhr.send((s.hasContent&&s.data)||null);
callback=function(_,isAbort){var status,statusText,responseHeaders,responses,xml;
try{if(callback&&(isAbort||xhr.readyState===4)){callback=undefined;
if(handle){xhr.onreadystatechange=jQuery.noop;
if(xhrOnUnloadAbort){delete xhrCallbacks[handle]
}}if(isAbort){if(xhr.readyState!==4){xhr.abort()
}}else{status=xhr.status;
responseHeaders=xhr.getAllResponseHeaders();
responses={};
xml=xhr.responseXML;
if(xml&&xml.documentElement){responses.xml=xml
}responses.text=xhr.responseText;
try{statusText=xhr.statusText
}catch(e){statusText=""
}if(!status&&s.isLocal&&!s.crossDomain){status=responses.text?200:404
}else{if(status===1223){status=204
}}}}}catch(firefoxAccessException){if(!isAbort){complete(-1,firefoxAccessException)
}}if(responses){complete(status,statusText,responses,responseHeaders)
}};
if(!s.async||xhr.readyState===4){callback()
}else{handle=++xhrId;
if(xhrOnUnloadAbort){if(!xhrCallbacks){xhrCallbacks={};
jQuery(window).unload(xhrOnUnloadAbort)
}xhrCallbacks[handle]=callback
}xhr.onreadystatechange=callback
}},abort:function(){if(callback){callback(0,1)
}}}
}})
}var elemdisplay={},iframe,iframeDoc,rfxtypes=/^(?:toggle|show|hide)$/,rfxnum=/^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,timerId,fxAttrs=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]],fxNow;
jQuery.fn.extend({show:function(speed,easing,callback){var elem,display;
if(speed||speed===0){return this.animate(genFx("show",3),speed,easing,callback)
}else{for(var i=0,j=this.length;
i<j;
i++){elem=this[i];
if(elem.style){display=elem.style.display;
if(!jQuery._data(elem,"olddisplay")&&display==="none"){display=elem.style.display=""
}if(display===""&&jQuery.css(elem,"display")==="none"){jQuery._data(elem,"olddisplay",defaultDisplay(elem.nodeName))
}}}for(i=0;
i<j;
i++){elem=this[i];
if(elem.style){display=elem.style.display;
if(display===""||display==="none"){elem.style.display=jQuery._data(elem,"olddisplay")||""
}}}return this
}},hide:function(speed,easing,callback){if(speed||speed===0){return this.animate(genFx("hide",3),speed,easing,callback)
}else{var elem,display,i=0,j=this.length;
for(;
i<j;
i++){elem=this[i];
if(elem.style){display=jQuery.css(elem,"display");
if(display!=="none"&&!jQuery._data(elem,"olddisplay")){jQuery._data(elem,"olddisplay",display)
}}}for(i=0;
i<j;
i++){if(this[i].style){this[i].style.display="none"
}}return this
}},_toggle:jQuery.fn.toggle,toggle:function(fn,fn2,callback){var bool=typeof fn==="boolean";
if(jQuery.isFunction(fn)&&jQuery.isFunction(fn2)){this._toggle.apply(this,arguments)
}else{if(fn==null||bool){this.each(function(){var state=bool?fn:jQuery(this).is(":hidden");
jQuery(this)[state?"show":"hide"]()
})
}else{this.animate(genFx("toggle",3),fn,fn2,callback)
}}return this
},fadeTo:function(speed,to,easing,callback){return this.filter(":hidden").css("opacity",0).show().end().animate({opacity:to},speed,easing,callback)
},animate:function(prop,speed,easing,callback){var optall=jQuery.speed(speed,easing,callback);
if(jQuery.isEmptyObject(prop)){return this.each(optall.complete,[false])
}prop=jQuery.extend({},prop);
function doAnimation(){if(optall.queue===false){jQuery._mark(this)
}var opt=jQuery.extend({},optall),isElement=this.nodeType===1,hidden=isElement&&jQuery(this).is(":hidden"),name,val,p,e,parts,start,end,unit,method;
opt.animatedProperties={};
for(p in prop){name=jQuery.camelCase(p);
if(p!==name){prop[name]=prop[p];
delete prop[p]
}val=prop[name];
if(jQuery.isArray(val)){opt.animatedProperties[name]=val[1];
val=prop[name]=val[0]
}else{opt.animatedProperties[name]=opt.specialEasing&&opt.specialEasing[name]||opt.easing||"swing"
}if(val==="hide"&&hidden||val==="show"&&!hidden){return opt.complete.call(this)
}if(isElement&&(name==="height"||name==="width")){opt.overflow=[this.style.overflow,this.style.overflowX,this.style.overflowY];
if(jQuery.css(this,"display")==="inline"&&jQuery.css(this,"float")==="none"){if(!jQuery.support.inlineBlockNeedsLayout||defaultDisplay(this.nodeName)==="inline"){this.style.display="inline-block"
}else{this.style.zoom=1
}}}}if(opt.overflow!=null){this.style.overflow="hidden"
}for(p in prop){e=new jQuery.fx(this,opt,p);
val=prop[p];
if(rfxtypes.test(val)){method=jQuery._data(this,"toggle"+p)||(val==="toggle"?hidden?"show":"hide":0);
if(method){jQuery._data(this,"toggle"+p,method==="show"?"hide":"show");
e[method]()
}else{e[val]()
}}else{parts=rfxnum.exec(val);
start=e.cur();
if(parts){end=parseFloat(parts[2]);
unit=parts[3]||(jQuery.cssNumber[p]?"":"px");
if(unit!=="px"){jQuery.style(this,p,(end||1)+unit);
start=((end||1)/e.cur())*start;
jQuery.style(this,p,start+unit)
}if(parts[1]){end=((parts[1]==="-="?-1:1)*end)+start
}e.custom(start,end,unit)
}else{e.custom(start,val,"")
}}}return true
}return optall.queue===false?this.each(doAnimation):this.queue(optall.queue,doAnimation)
},stop:function(type,clearQueue,gotoEnd){if(typeof type!=="string"){gotoEnd=clearQueue;
clearQueue=type;
type=undefined
}if(clearQueue&&type!==false){this.queue(type||"fx",[])
}return this.each(function(){var index,hadTimers=false,timers=jQuery.timers,data=jQuery._data(this);
if(!gotoEnd){jQuery._unmark(true,this)
}function stopQueue(elem,data,index){var hooks=data[index];
jQuery.removeData(elem,index,true);
hooks.stop(gotoEnd)
}if(type==null){for(index in data){if(data[index]&&data[index].stop&&index.indexOf(".run")===index.length-4){stopQueue(this,data,index)
}}}else{if(data[index=type+".run"]&&data[index].stop){stopQueue(this,data,index)
}}for(index=timers.length;
index--;
){if(timers[index].elem===this&&(type==null||timers[index].queue===type)){if(gotoEnd){timers[index](true)
}else{timers[index].saveState()
}hadTimers=true;
timers.splice(index,1)
}}if(!(gotoEnd&&hadTimers)){jQuery.dequeue(this,type)
}})
}});
function createFxNow(){setTimeout(clearFxNow,0);
return(fxNow=jQuery.now())
}function clearFxNow(){fxNow=undefined
}function genFx(type,num){var obj={};
jQuery.each(fxAttrs.concat.apply([],fxAttrs.slice(0,num)),function(){obj[this]=type
});
return obj
}jQuery.each({slideDown:genFx("show",1),slideUp:genFx("hide",1),slideToggle:genFx("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(name,props){jQuery.fn[name]=function(speed,easing,callback){return this.animate(props,speed,easing,callback)
}
});
jQuery.extend({speed:function(speed,easing,fn){var opt=speed&&typeof speed==="object"?jQuery.extend({},speed):{complete:fn||!fn&&easing||jQuery.isFunction(speed)&&speed,duration:speed,easing:fn&&easing||easing&&!jQuery.isFunction(easing)&&easing};
opt.duration=jQuery.fx.off?0:typeof opt.duration==="number"?opt.duration:opt.duration in jQuery.fx.speeds?jQuery.fx.speeds[opt.duration]:jQuery.fx.speeds._default;
if(opt.queue==null||opt.queue===true){opt.queue="fx"
}opt.old=opt.complete;
opt.complete=function(noUnmark){if(jQuery.isFunction(opt.old)){opt.old.call(this)
}if(opt.queue){jQuery.dequeue(this,opt.queue)
}else{if(noUnmark!==false){jQuery._unmark(this)
}}};
return opt
},easing:{linear:function(p,n,firstNum,diff){return firstNum+diff*p
},swing:function(p,n,firstNum,diff){return((-Math.cos(p*Math.PI)/2)+0.5)*diff+firstNum
}},timers:[],fx:function(elem,options,prop){this.options=options;
this.elem=elem;
this.prop=prop;
options.orig=options.orig||{}
}});
jQuery.fx.prototype={update:function(){if(this.options.step){this.options.step.call(this.elem,this.now,this)
}(jQuery.fx.step[this.prop]||jQuery.fx.step._default)(this)
},cur:function(){if(this.elem[this.prop]!=null&&(!this.elem.style||this.elem.style[this.prop]==null)){return this.elem[this.prop]
}var parsed,r=jQuery.css(this.elem,this.prop);
return isNaN(parsed=parseFloat(r))?!r||r==="auto"?0:r:parsed
},custom:function(from,to,unit){var self=this,fx=jQuery.fx;
this.startTime=fxNow||createFxNow();
this.end=to;
this.now=this.start=from;
this.pos=this.state=0;
this.unit=unit||this.unit||(jQuery.cssNumber[this.prop]?"":"px");
function t(gotoEnd){return self.step(gotoEnd)
}t.queue=this.options.queue;
t.elem=this.elem;
t.saveState=function(){if(self.options.hide&&jQuery._data(self.elem,"fxshow"+self.prop)===undefined){jQuery._data(self.elem,"fxshow"+self.prop,self.start)
}};
if(t()&&jQuery.timers.push(t)&&!timerId){timerId=setInterval(fx.tick,fx.interval)
}},show:function(){var dataShow=jQuery._data(this.elem,"fxshow"+this.prop);
this.options.orig[this.prop]=dataShow||jQuery.style(this.elem,this.prop);
this.options.show=true;
if(dataShow!==undefined){this.custom(this.cur(),dataShow)
}else{this.custom(this.prop==="width"||this.prop==="height"?1:0,this.cur())
}jQuery(this.elem).show()
},hide:function(){this.options.orig[this.prop]=jQuery._data(this.elem,"fxshow"+this.prop)||jQuery.style(this.elem,this.prop);
this.options.hide=true;
this.custom(this.cur(),0)
},step:function(gotoEnd){var p,n,complete,t=fxNow||createFxNow(),done=true,elem=this.elem,options=this.options;
if(gotoEnd||t>=options.duration+this.startTime){this.now=this.end;
this.pos=this.state=1;
this.update();
options.animatedProperties[this.prop]=true;
for(p in options.animatedProperties){if(options.animatedProperties[p]!==true){done=false
}}if(done){if(options.overflow!=null&&!jQuery.support.shrinkWrapBlocks){jQuery.each(["","X","Y"],function(index,value){elem.style["overflow"+value]=options.overflow[index]
})
}if(options.hide){jQuery(elem).hide()
}if(options.hide||options.show){for(p in options.animatedProperties){jQuery.style(elem,p,options.orig[p]);
jQuery.removeData(elem,"fxshow"+p,true);
jQuery.removeData(elem,"toggle"+p,true)
}}complete=options.complete;
if(complete){options.complete=false;
complete.call(elem)
}}return false
}else{if(options.duration==Infinity){this.now=t
}else{n=t-this.startTime;
this.state=n/options.duration;
this.pos=jQuery.easing[options.animatedProperties[this.prop]](this.state,n,0,1,options.duration);
this.now=this.start+((this.end-this.start)*this.pos)
}this.update()
}return true
}};
jQuery.extend(jQuery.fx,{tick:function(){var timer,timers=jQuery.timers,i=0;
for(;
i<timers.length;
i++){timer=timers[i];
if(!timer()&&timers[i]===timer){timers.splice(i--,1)
}}if(!timers.length){jQuery.fx.stop()
}},interval:13,stop:function(){clearInterval(timerId);
timerId=null
},speeds:{slow:600,fast:200,_default:400},step:{opacity:function(fx){jQuery.style(fx.elem,"opacity",fx.now)
},_default:function(fx){if(fx.elem.style&&fx.elem.style[fx.prop]!=null){fx.elem.style[fx.prop]=fx.now+fx.unit
}else{fx.elem[fx.prop]=fx.now
}}}});
jQuery.each(["width","height"],function(i,prop){jQuery.fx.step[prop]=function(fx){jQuery.style(fx.elem,prop,Math.max(0,fx.now)+fx.unit)
}
});
if(jQuery.expr&&jQuery.expr.filters){jQuery.expr.filters.animated=function(elem){return jQuery.grep(jQuery.timers,function(fn){return elem===fn.elem
}).length
}
}function defaultDisplay(nodeName){if(!elemdisplay[nodeName]){var body=document.body,elem=jQuery("<"+nodeName+">").appendTo(body),display=elem.css("display");
elem.remove();
if(display==="none"||display===""){if(!iframe){iframe=document.createElement("iframe");
iframe.frameBorder=iframe.width=iframe.height=0
}body.appendChild(iframe);
if(!iframeDoc||!iframe.createElement){iframeDoc=(iframe.contentWindow||iframe.contentDocument).document;
iframeDoc.write((document.compatMode==="CSS1Compat"?"<!doctype html>":"")+"<html><body>");
iframeDoc.close()
}elem=iframeDoc.createElement(nodeName);
iframeDoc.body.appendChild(elem);
display=jQuery.css(elem,"display");
body.removeChild(iframe)
}elemdisplay[nodeName]=display
}return elemdisplay[nodeName]
}var rtable=/^t(?:able|d|h)$/i,rroot=/^(?:body|html)$/i;
if("getBoundingClientRect" in document.documentElement){jQuery.fn.offset=function(options){var elem=this[0],box;
if(options){return this.each(function(i){jQuery.offset.setOffset(this,options,i)
})
}if(!elem||!elem.ownerDocument){return null
}if(elem===elem.ownerDocument.body){return jQuery.offset.bodyOffset(elem)
}try{box=elem.getBoundingClientRect()
}catch(e){}var doc=elem.ownerDocument,docElem=doc.documentElement;
if(!box||!jQuery.contains(docElem,elem)){return box?{top:box.top,left:box.left}:{top:0,left:0}
}var body=doc.body,win=getWindow(doc),clientTop=docElem.clientTop||body.clientTop||0,clientLeft=docElem.clientLeft||body.clientLeft||0,scrollTop=win.pageYOffset||jQuery.support.boxModel&&docElem.scrollTop||body.scrollTop,scrollLeft=win.pageXOffset||jQuery.support.boxModel&&docElem.scrollLeft||body.scrollLeft,top=box.top+scrollTop-clientTop,left=box.left+scrollLeft-clientLeft;
return{top:top,left:left}
}
}else{jQuery.fn.offset=function(options){var elem=this[0];
if(options){return this.each(function(i){jQuery.offset.setOffset(this,options,i)
})
}if(!elem||!elem.ownerDocument){return null
}if(elem===elem.ownerDocument.body){return jQuery.offset.bodyOffset(elem)
}var computedStyle,offsetParent=elem.offsetParent,prevOffsetParent=elem,doc=elem.ownerDocument,docElem=doc.documentElement,body=doc.body,defaultView=doc.defaultView,prevComputedStyle=defaultView?defaultView.getComputedStyle(elem,null):elem.currentStyle,top=elem.offsetTop,left=elem.offsetLeft;
while((elem=elem.parentNode)&&elem!==body&&elem!==docElem){if(jQuery.support.fixedPosition&&prevComputedStyle.position==="fixed"){break
}computedStyle=defaultView?defaultView.getComputedStyle(elem,null):elem.currentStyle;
top-=elem.scrollTop;
left-=elem.scrollLeft;
if(elem===offsetParent){top+=elem.offsetTop;
left+=elem.offsetLeft;
if(jQuery.support.doesNotAddBorder&&!(jQuery.support.doesAddBorderForTableAndCells&&rtable.test(elem.nodeName))){top+=parseFloat(computedStyle.borderTopWidth)||0;
left+=parseFloat(computedStyle.borderLeftWidth)||0
}prevOffsetParent=offsetParent;
offsetParent=elem.offsetParent
}if(jQuery.support.subtractsBorderForOverflowNotVisible&&computedStyle.overflow!=="visible"){top+=parseFloat(computedStyle.borderTopWidth)||0;
left+=parseFloat(computedStyle.borderLeftWidth)||0
}prevComputedStyle=computedStyle
}if(prevComputedStyle.position==="relative"||prevComputedStyle.position==="static"){top+=body.offsetTop;
left+=body.offsetLeft
}if(jQuery.support.fixedPosition&&prevComputedStyle.position==="fixed"){top+=Math.max(docElem.scrollTop,body.scrollTop);
left+=Math.max(docElem.scrollLeft,body.scrollLeft)
}return{top:top,left:left}
}
}jQuery.offset={bodyOffset:function(body){var top=body.offsetTop,left=body.offsetLeft;
if(jQuery.support.doesNotIncludeMarginInBodyOffset){top+=parseFloat(jQuery.css(body,"marginTop"))||0;
left+=parseFloat(jQuery.css(body,"marginLeft"))||0
}return{top:top,left:left}
},setOffset:function(elem,options,i){var position=jQuery.css(elem,"position");
if(position==="static"){elem.style.position="relative"
}var curElem=jQuery(elem),curOffset=curElem.offset(),curCSSTop=jQuery.css(elem,"top"),curCSSLeft=jQuery.css(elem,"left"),calculatePosition=(position==="absolute"||position==="fixed")&&jQuery.inArray("auto",[curCSSTop,curCSSLeft])>-1,props={},curPosition={},curTop,curLeft;
if(calculatePosition){curPosition=curElem.position();
curTop=curPosition.top;
curLeft=curPosition.left
}else{curTop=parseFloat(curCSSTop)||0;
curLeft=parseFloat(curCSSLeft)||0
}if(jQuery.isFunction(options)){options=options.call(elem,i,curOffset)
}if(options.top!=null){props.top=(options.top-curOffset.top)+curTop
}if(options.left!=null){props.left=(options.left-curOffset.left)+curLeft
}if("using" in options){options.using.call(elem,props)
}else{curElem.css(props)
}}};
jQuery.fn.extend({position:function(){if(!this[0]){return null
}var elem=this[0],offsetParent=this.offsetParent(),offset=this.offset(),parentOffset=rroot.test(offsetParent[0].nodeName)?{top:0,left:0}:offsetParent.offset();
offset.top-=parseFloat(jQuery.css(elem,"marginTop"))||0;
offset.left-=parseFloat(jQuery.css(elem,"marginLeft"))||0;
parentOffset.top+=parseFloat(jQuery.css(offsetParent[0],"borderTopWidth"))||0;
parentOffset.left+=parseFloat(jQuery.css(offsetParent[0],"borderLeftWidth"))||0;
return{top:offset.top-parentOffset.top,left:offset.left-parentOffset.left}
},offsetParent:function(){return this.map(function(){var offsetParent=this.offsetParent||document.body;
while(offsetParent&&(!rroot.test(offsetParent.nodeName)&&jQuery.css(offsetParent,"position")==="static")){offsetParent=offsetParent.offsetParent
}return offsetParent
})
}});
jQuery.each(["Left","Top"],function(i,name){var method="scroll"+name;
jQuery.fn[method]=function(val){var elem,win;
if(val===undefined){elem=this[0];
if(!elem){return null
}win=getWindow(elem);
return win?("pageXOffset" in win)?win[i?"pageYOffset":"pageXOffset"]:jQuery.support.boxModel&&win.document.documentElement[method]||win.document.body[method]:elem[method]
}return this.each(function(){win=getWindow(this);
if(win){win.scrollTo(!i?val:jQuery(win).scrollLeft(),i?val:jQuery(win).scrollTop())
}else{this[method]=val
}})
}
});
function getWindow(elem){return jQuery.isWindow(elem)?elem:elem.nodeType===9?elem.defaultView||elem.parentWindow:false
}jQuery.each(["Height","Width"],function(i,name){var type=name.toLowerCase();
jQuery.fn["inner"+name]=function(){var elem=this[0];
return elem?elem.style?parseFloat(jQuery.css(elem,type,"padding")):this[type]():null
};
jQuery.fn["outer"+name]=function(margin){var elem=this[0];
return elem?elem.style?parseFloat(jQuery.css(elem,type,margin?"margin":"border")):this[type]():null
};
jQuery.fn[type]=function(size){var elem=this[0];
if(!elem){return size==null?null:this
}if(jQuery.isFunction(size)){return this.each(function(i){var self=jQuery(this);
self[type](size.call(this,i,self[type]()))
})
}if(jQuery.isWindow(elem)){var docElemProp=elem.document.documentElement["client"+name],body=elem.document.body;
return elem.document.compatMode==="CSS1Compat"&&docElemProp||body&&body["client"+name]||docElemProp
}else{if(elem.nodeType===9){return Math.max(elem.documentElement["client"+name],elem.body["scroll"+name],elem.documentElement["scroll"+name],elem.body["offset"+name],elem.documentElement["offset"+name])
}else{if(size===undefined){var orig=jQuery.css(elem,type),ret=parseFloat(orig);
return jQuery.isNumeric(ret)?ret:orig
}else{return this.css(type,typeof size==="string"?size:size+"px")
}}}}
});
window.jQuery=window.$=jQuery;
if(typeof define==="function"&&define.amd&&define.amd.jQuery){define("jquery",[],function(){return jQuery
})
}})(window);
/*!
 * jQuery UI 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI
 */
(function($,undefined){$.ui=$.ui||{};
if($.ui.version){return
}$.extend($.ui,{version:"1.8.16",keyCode:{ALT:18,BACKSPACE:8,CAPS_LOCK:20,COMMA:188,COMMAND:91,COMMAND_LEFT:91,COMMAND_RIGHT:93,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,MENU:93,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38,WINDOWS:91}});
$.fn.extend({propAttr:$.fn.prop||$.fn.attr,_focus:$.fn.focus,focus:function(delay,fn){return typeof delay==="number"?this.each(function(){var elem=this;
setTimeout(function(){$(elem).focus();
if(fn){fn.call(elem)
}},delay)
}):this._focus.apply(this,arguments)
},scrollParent:function(){var scrollParent;
if(($.browser.msie&&(/(static|relative)/).test(this.css("position")))||(/absolute/).test(this.css("position"))){scrollParent=this.parents().filter(function(){return(/(relative|absolute|fixed)/).test($.curCSS(this,"position",1))&&(/(auto|scroll)/).test($.curCSS(this,"overflow",1)+$.curCSS(this,"overflow-y",1)+$.curCSS(this,"overflow-x",1))
}).eq(0)
}else{scrollParent=this.parents().filter(function(){return(/(auto|scroll)/).test($.curCSS(this,"overflow",1)+$.curCSS(this,"overflow-y",1)+$.curCSS(this,"overflow-x",1))
}).eq(0)
}return(/fixed/).test(this.css("position"))||!scrollParent.length?$(document):scrollParent
},zIndex:function(zIndex){if(zIndex!==undefined){return this.css("zIndex",zIndex)
}if(this.length){var elem=$(this[0]),position,value;
while(elem.length&&elem[0]!==document){position=elem.css("position");
if(position==="absolute"||position==="relative"||position==="fixed"){value=parseInt(elem.css("zIndex"),10);
if(!isNaN(value)&&value!==0){return value
}}elem=elem.parent()
}}return 0
},disableSelection:function(){return this.bind(($.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(event){event.preventDefault()
})
},enableSelection:function(){return this.unbind(".ui-disableSelection")
}});
$.each(["Width","Height"],function(i,name){var side=name==="Width"?["Left","Right"]:["Top","Bottom"],type=name.toLowerCase(),orig={innerWidth:$.fn.innerWidth,innerHeight:$.fn.innerHeight,outerWidth:$.fn.outerWidth,outerHeight:$.fn.outerHeight};
function reduce(elem,size,border,margin){$.each(side,function(){size-=parseFloat($.curCSS(elem,"padding"+this,true))||0;
if(border){size-=parseFloat($.curCSS(elem,"border"+this+"Width",true))||0
}if(margin){size-=parseFloat($.curCSS(elem,"margin"+this,true))||0
}});
return size
}$.fn["inner"+name]=function(size){if(size===undefined){return orig["inner"+name].call(this)
}return this.each(function(){$(this).css(type,reduce(this,size)+"px")
})
};
$.fn["outer"+name]=function(size,margin){if(typeof size!=="number"){return orig["outer"+name].call(this,size)
}return this.each(function(){$(this).css(type,reduce(this,size,true,margin)+"px")
})
}
});
function focusable(element,isTabIndexNotNaN){var nodeName=element.nodeName.toLowerCase();
if("area"===nodeName){var map=element.parentNode,mapName=map.name,img;
if(!element.href||!mapName||map.nodeName.toLowerCase()!=="map"){return false
}img=$("img[usemap=#"+mapName+"]")[0];
return !!img&&visible(img)
}return(/input|select|textarea|button|object/.test(nodeName)?!element.disabled:"a"==nodeName?element.href||isTabIndexNotNaN:isTabIndexNotNaN)&&visible(element)
}function visible(element){return !$(element).parents().andSelf().filter(function(){return $.curCSS(this,"visibility")==="hidden"||$.expr.filters.hidden(this)
}).length
}$.extend($.expr[":"],{data:function(elem,i,match){return !!$.data(elem,match[3])
},focusable:function(element){return focusable(element,!isNaN($.attr(element,"tabindex")))
},tabbable:function(element){var tabIndex=$.attr(element,"tabindex"),isTabIndexNaN=isNaN(tabIndex);
return(isTabIndexNaN||tabIndex>=0)&&focusable(element,!isTabIndexNaN)
}});
$(function(){var body=document.body,div=body.appendChild(div=document.createElement("div"));
$.extend(div.style,{minHeight:"100px",height:"auto",padding:0,borderWidth:0});
$.support.minHeight=div.offsetHeight===100;
$.support.selectstart="onselectstart" in div;
body.removeChild(div).style.display="none"
});
$.extend($.ui,{plugin:{add:function(module,option,set){var proto=$.ui[module].prototype;
for(var i in set){proto.plugins[i]=proto.plugins[i]||[];
proto.plugins[i].push([option,set[i]])
}},call:function(instance,name,args){var set=instance.plugins[name];
if(!set||!instance.element[0].parentNode){return
}for(var i=0;
i<set.length;
i++){if(instance.options[set[i][0]]){set[i][1].apply(instance.element,args)
}}}},contains:function(a,b){return document.compareDocumentPosition?a.compareDocumentPosition(b)&16:a!==b&&a.contains(b)
},hasScroll:function(el,a){if($(el).css("overflow")==="hidden"){return false
}var scroll=(a&&a==="left")?"scrollLeft":"scrollTop",has=false;
if(el[scroll]>0){return true
}el[scroll]=1;
has=(el[scroll]>0);
el[scroll]=0;
return has
},isOverAxis:function(x,reference,size){return(x>reference)&&(x<(reference+size))
},isOver:function(y,x,top,left,height,width){return $.ui.isOverAxis(y,top,height)&&$.ui.isOverAxis(x,left,width)
}})
})(jQuery);
/*!
 * jQuery UI Widget 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */
(function($,undefined){if($.cleanData){var _cleanData=$.cleanData;
$.cleanData=function(elems){for(var i=0,elem;
(elem=elems[i])!=null;
i++){try{$(elem).triggerHandler("remove")
}catch(e){}}_cleanData(elems)
}
}else{var _remove=$.fn.remove;
$.fn.remove=function(selector,keepData){return this.each(function(){if(!keepData){if(!selector||$.filter(selector,[this]).length){$("*",this).add([this]).each(function(){try{$(this).triggerHandler("remove")
}catch(e){}})
}}return _remove.call($(this),selector,keepData)
})
}
}$.widget=function(name,base,prototype){var namespace=name.split(".")[0],fullName;
name=name.split(".")[1];
fullName=namespace+"-"+name;
if(!prototype){prototype=base;
base=$.Widget
}$.expr[":"][fullName]=function(elem){return !!$.data(elem,name)
};
$[namespace]=$[namespace]||{};
$[namespace][name]=function(options,element){if(arguments.length){this._createWidget(options,element)
}};
var basePrototype=new base();
basePrototype.options=$.extend(true,{},basePrototype.options);
$[namespace][name].prototype=$.extend(true,basePrototype,{namespace:namespace,widgetName:name,widgetEventPrefix:$[namespace][name].prototype.widgetEventPrefix||name,widgetBaseClass:fullName},prototype);
$.widget.bridge(name,$[namespace][name])
};
$.widget.bridge=function(name,object){$.fn[name]=function(options){var isMethodCall=typeof options==="string",args=Array.prototype.slice.call(arguments,1),returnValue=this;
options=!isMethodCall&&args.length?$.extend.apply(null,[true,options].concat(args)):options;
if(isMethodCall&&options.charAt(0)==="_"){return returnValue
}if(isMethodCall){this.each(function(){var instance=$.data(this,name),methodValue=instance&&$.isFunction(instance[options])?instance[options].apply(instance,args):instance;
if(methodValue!==instance&&methodValue!==undefined){returnValue=methodValue;
return false
}})
}else{this.each(function(){var instance=$.data(this,name);
if(instance){instance.option(options||{})._init()
}else{$.data(this,name,new object(options,this))
}})
}return returnValue
}
};
$.Widget=function(options,element){if(arguments.length){this._createWidget(options,element)
}};
$.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",options:{disabled:false},_createWidget:function(options,element){$.data(element,this.widgetName,this);
this.element=$(element);
this.options=$.extend(true,{},this.options,this._getCreateOptions(),options);
var self=this;
this.element.bind("remove."+this.widgetName,function(){self.destroy()
});
this._create();
this._trigger("create");
this._init()
},_getCreateOptions:function(){return $.metadata&&$.metadata.get(this.element[0])[this.widgetName]
},_create:function(){},_init:function(){},destroy:function(){this.element.unbind("."+this.widgetName).removeData(this.widgetName);
this.widget().unbind("."+this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass+"-disabled ui-state-disabled")
},widget:function(){return this.element
},option:function(key,value){var options=key;
if(arguments.length===0){return $.extend({},this.options)
}if(typeof key==="string"){if(value===undefined){return this.options[key]
}options={};
options[key]=value
}this._setOptions(options);
return this
},_setOptions:function(options){var self=this;
$.each(options,function(key,value){self._setOption(key,value)
});
return this
},_setOption:function(key,value){this.options[key]=value;
if(key==="disabled"){this.widget()[value?"addClass":"removeClass"](this.widgetBaseClass+"-disabled ui-state-disabled").attr("aria-disabled",value)
}return this
},enable:function(){return this._setOption("disabled",false)
},disable:function(){return this._setOption("disabled",true)
},_trigger:function(type,event,data){var callback=this.options[type];
event=$.Event(event);
event.type=(type===this.widgetEventPrefix?type:this.widgetEventPrefix+type).toLowerCase();
data=data||{};
if(event.originalEvent){for(var i=$.event.props.length,prop;
i;
){prop=$.event.props[--i];
event[prop]=event.originalEvent[prop]
}}this.element.trigger(event,data);
return !($.isFunction(callback)&&callback.call(this.element[0],event,data)===false||event.isDefaultPrevented())
}}
})(jQuery);
/*!
 * jQuery UI Mouse 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Mouse
 *
 * Depends:
 *	jquery.ui.widget.js
 */
(function($,undefined){var mouseHandled=false;
$(document).mouseup(function(e){mouseHandled=false
});
$.widget("ui.mouse",{options:{cancel:":input,option",distance:1,delay:0},_mouseInit:function(){var self=this;
this.element.bind("mousedown."+this.widgetName,function(event){return self._mouseDown(event)
}).bind("click."+this.widgetName,function(event){if(true===$.data(event.target,self.widgetName+".preventClickEvent")){$.removeData(event.target,self.widgetName+".preventClickEvent");
event.stopImmediatePropagation();
return false
}});
this.started=false
},_mouseDestroy:function(){this.element.unbind("."+this.widgetName)
},_mouseDown:function(event){if(mouseHandled){return
}(this._mouseStarted&&this._mouseUp(event));
this._mouseDownEvent=event;
var self=this,btnIsLeft=(event.which==1),elIsCancel=(typeof this.options.cancel=="string"&&event.target.nodeName?$(event.target).closest(this.options.cancel).length:false);
if(!btnIsLeft||elIsCancel||!this._mouseCapture(event)){return true
}this.mouseDelayMet=!this.options.delay;
if(!this.mouseDelayMet){this._mouseDelayTimer=setTimeout(function(){self.mouseDelayMet=true
},this.options.delay)
}if(this._mouseDistanceMet(event)&&this._mouseDelayMet(event)){this._mouseStarted=(this._mouseStart(event)!==false);
if(!this._mouseStarted){event.preventDefault();
return true
}}if(true===$.data(event.target,this.widgetName+".preventClickEvent")){$.removeData(event.target,this.widgetName+".preventClickEvent")
}this._mouseMoveDelegate=function(event){return self._mouseMove(event)
};
this._mouseUpDelegate=function(event){return self._mouseUp(event)
};
$(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate);
event.preventDefault();
mouseHandled=true;
return true
},_mouseMove:function(event){if($.browser.msie&&!(document.documentMode>=9)&&!event.button){return this._mouseUp(event)
}if(this._mouseStarted){this._mouseDrag(event);
return event.preventDefault()
}if(this._mouseDistanceMet(event)&&this._mouseDelayMet(event)){this._mouseStarted=(this._mouseStart(this._mouseDownEvent,event)!==false);
(this._mouseStarted?this._mouseDrag(event):this._mouseUp(event))
}return !this._mouseStarted
},_mouseUp:function(event){$(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate);
if(this._mouseStarted){this._mouseStarted=false;
if(event.target==this._mouseDownEvent.target){$.data(event.target,this.widgetName+".preventClickEvent",true)
}this._mouseStop(event)
}return false
},_mouseDistanceMet:function(event){return(Math.max(Math.abs(this._mouseDownEvent.pageX-event.pageX),Math.abs(this._mouseDownEvent.pageY-event.pageY))>=this.options.distance)
},_mouseDelayMet:function(event){return this.mouseDelayMet
},_mouseStart:function(event){},_mouseDrag:function(event){},_mouseStop:function(event){},_mouseCapture:function(event){return true
}})
})(jQuery);
(function($,undefined){$.ui=$.ui||{};
var horizontalPositions=/left|center|right/,verticalPositions=/top|center|bottom/,center="center",_position=$.fn.position,_offset=$.fn.offset;
$.fn.position=function(options){if(!options||!options.of){return _position.apply(this,arguments)
}options=$.extend({},options);
var target=$(options.of),targetElem=target[0],collision=(options.collision||"flip").split(" "),offset=options.offset?options.offset.split(" "):[0,0],targetWidth,targetHeight,basePosition;
if(targetElem.nodeType===9){targetWidth=target.width();
targetHeight=target.height();
basePosition={top:0,left:0}
}else{if(targetElem.setTimeout){targetWidth=target.width();
targetHeight=target.height();
basePosition={top:target.scrollTop(),left:target.scrollLeft()}
}else{if(targetElem.preventDefault){options.at="left top";
targetWidth=targetHeight=0;
basePosition={top:options.of.pageY,left:options.of.pageX}
}else{targetWidth=target.outerWidth();
targetHeight=target.outerHeight();
basePosition=target.offset()
}}}$.each(["my","at"],function(){var pos=(options[this]||"").split(" ");
if(pos.length===1){pos=horizontalPositions.test(pos[0])?pos.concat([center]):verticalPositions.test(pos[0])?[center].concat(pos):[center,center]
}pos[0]=horizontalPositions.test(pos[0])?pos[0]:center;
pos[1]=verticalPositions.test(pos[1])?pos[1]:center;
options[this]=pos
});
if(collision.length===1){collision[1]=collision[0]
}offset[0]=parseInt(offset[0],10)||0;
if(offset.length===1){offset[1]=offset[0]
}offset[1]=parseInt(offset[1],10)||0;
if(options.at[0]==="right"){basePosition.left+=targetWidth
}else{if(options.at[0]===center){basePosition.left+=targetWidth/2
}}if(options.at[1]==="bottom"){basePosition.top+=targetHeight
}else{if(options.at[1]===center){basePosition.top+=targetHeight/2
}}basePosition.left+=offset[0];
basePosition.top+=offset[1];
return this.each(function(){var elem=$(this),elemWidth=elem.outerWidth(),elemHeight=elem.outerHeight(),marginLeft=parseInt($.curCSS(this,"marginLeft",true))||0,marginTop=parseInt($.curCSS(this,"marginTop",true))||0,collisionWidth=elemWidth+marginLeft+(parseInt($.curCSS(this,"marginRight",true))||0),collisionHeight=elemHeight+marginTop+(parseInt($.curCSS(this,"marginBottom",true))||0),position=$.extend({},basePosition),collisionPosition;
if(options.my[0]==="right"){position.left-=elemWidth
}else{if(options.my[0]===center){position.left-=elemWidth/2
}}if(options.my[1]==="bottom"){position.top-=elemHeight
}else{if(options.my[1]===center){position.top-=elemHeight/2
}}position.left=Math.round(position.left);
position.top=Math.round(position.top);
collisionPosition={left:position.left-marginLeft,top:position.top-marginTop};
$.each(["left","top"],function(i,dir){if($.ui.position[collision[i]]){$.ui.position[collision[i]][dir](position,{targetWidth:targetWidth,targetHeight:targetHeight,elemWidth:elemWidth,elemHeight:elemHeight,collisionPosition:collisionPosition,collisionWidth:collisionWidth,collisionHeight:collisionHeight,offset:offset,my:options.my,at:options.at})
}});
if($.fn.bgiframe){elem.bgiframe()
}elem.offset($.extend(position,{using:options.using}))
})
};
$.ui.position={fit:{left:function(position,data){var win=$(window),over=data.collisionPosition.left+data.collisionWidth-win.width()-win.scrollLeft();
position.left=over>0?position.left-over:Math.max(position.left-data.collisionPosition.left,position.left)
},top:function(position,data){var win=$(window),over=data.collisionPosition.top+data.collisionHeight-win.height()-win.scrollTop();
position.top=over>0?position.top-over:Math.max(position.top-data.collisionPosition.top,position.top)
}},flip:{left:function(position,data){if(data.at[0]===center){return
}var win=$(window),over=data.collisionPosition.left+data.collisionWidth-win.width()-win.scrollLeft(),myOffset=data.my[0]==="left"?-data.elemWidth:data.my[0]==="right"?data.elemWidth:0,atOffset=data.at[0]==="left"?data.targetWidth:-data.targetWidth,offset=-2*data.offset[0];
position.left+=data.collisionPosition.left<0?myOffset+atOffset+offset:over>0?myOffset+atOffset+offset:0
},top:function(position,data){if(data.at[1]===center){return
}var win=$(window),over=data.collisionPosition.top+data.collisionHeight-win.height()-win.scrollTop(),myOffset=data.my[1]==="top"?-data.elemHeight:data.my[1]==="bottom"?data.elemHeight:0,atOffset=data.at[1]==="top"?data.targetHeight:-data.targetHeight,offset=-2*data.offset[1];
position.top+=data.collisionPosition.top<0?myOffset+atOffset+offset:over>0?myOffset+atOffset+offset:0
}}};
if(!$.offset.setOffset){$.offset.setOffset=function(elem,options){if(/static/.test($.curCSS(elem,"position"))){elem.style.position="relative"
}var curElem=$(elem),curOffset=curElem.offset(),curTop=parseInt($.curCSS(elem,"top",true),10)||0,curLeft=parseInt($.curCSS(elem,"left",true),10)||0,props={top:(options.top-curOffset.top)+curTop,left:(options.left-curOffset.left)+curLeft};
if("using" in options){options.using.call(elem,props)
}else{curElem.css(props)
}};
$.fn.offset=function(options){var elem=this[0];
if(!elem||!elem.ownerDocument){return null
}if(options){return this.each(function(){$.offset.setOffset(this,options)
})
}return _offset.call(this)
}
}}(jQuery));
(function($,undefined){$.widget("ui.draggable",$.ui.mouse,{widgetEventPrefix:"drag",options:{addClasses:true,appendTo:"parent",axis:false,connectToSortable:false,containment:false,cursor:"auto",cursorAt:false,grid:false,handle:false,helper:"original",iframeFix:false,opacity:false,refreshPositions:false,revert:false,revertDuration:500,scope:"default",scroll:true,scrollSensitivity:20,scrollSpeed:20,snap:false,snapMode:"both",snapTolerance:20,stack:false,zIndex:false},_create:function(){if(this.options.helper=="original"&&!(/^(?:r|a|f)/).test(this.element.css("position"))){this.element[0].style.position="relative"
}(this.options.addClasses&&this.element.addClass("ui-draggable"));
(this.options.disabled&&this.element.addClass("ui-draggable-disabled"));
this._mouseInit()
},destroy:function(){if(!this.element.data("draggable")){return
}this.element.removeData("draggable").unbind(".draggable").removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled");
this._mouseDestroy();
return this
},_mouseCapture:function(event){var o=this.options;
if(this.helper||o.disabled||$(event.target).is(".ui-resizable-handle")){return false
}this.handle=this._getHandle(event);
if(!this.handle){return false
}if(o.iframeFix){$(o.iframeFix===true?"iframe":o.iframeFix).each(function(){$('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({width:this.offsetWidth+"px",height:this.offsetHeight+"px",position:"absolute",opacity:"0.001",zIndex:1000}).css($(this).offset()).appendTo("body")
})
}return true
},_mouseStart:function(event){var o=this.options;
this.helper=this._createHelper(event);
this._cacheHelperProportions();
if($.ui.ddmanager){$.ui.ddmanager.current=this
}this._cacheMargins();
this.cssPosition=this.helper.css("position");
this.scrollParent=this.helper.scrollParent();
this.offset=this.positionAbs=this.element.offset();
this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left};
$.extend(this.offset,{click:{left:event.pageX-this.offset.left,top:event.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()});
this.originalPosition=this.position=this._generatePosition(event);
this.originalPageX=event.pageX;
this.originalPageY=event.pageY;
(o.cursorAt&&this._adjustOffsetFromHelper(o.cursorAt));
if(o.containment){this._setContainment()
}if(this._trigger("start",event)===false){this._clear();
return false
}this._cacheHelperProportions();
if($.ui.ddmanager&&!o.dropBehaviour){$.ui.ddmanager.prepareOffsets(this,event)
}this.helper.addClass("ui-draggable-dragging");
this._mouseDrag(event,true);
if($.ui.ddmanager){$.ui.ddmanager.dragStart(this,event)
}return true
},_mouseDrag:function(event,noPropagation){this.position=this._generatePosition(event);
this.positionAbs=this._convertPositionTo("absolute");
if(!noPropagation){var ui=this._uiHash();
if(this._trigger("drag",event,ui)===false){this._mouseUp({});
return false
}this.position=ui.position
}if(!this.options.axis||this.options.axis!="y"){this.helper[0].style.left=this.position.left+"px"
}if(!this.options.axis||this.options.axis!="x"){this.helper[0].style.top=this.position.top+"px"
}if($.ui.ddmanager){$.ui.ddmanager.drag(this,event)
}return false
},_mouseStop:function(event){var dropped=false;
if($.ui.ddmanager&&!this.options.dropBehaviour){dropped=$.ui.ddmanager.drop(this,event)
}if(this.dropped){dropped=this.dropped;
this.dropped=false
}if((!this.element[0]||!this.element[0].parentNode)&&this.options.helper=="original"){return false
}if((this.options.revert=="invalid"&&!dropped)||(this.options.revert=="valid"&&dropped)||this.options.revert===true||($.isFunction(this.options.revert)&&this.options.revert.call(this.element,dropped))){var self=this;
$(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){if(self._trigger("stop",event)!==false){self._clear()
}})
}else{if(this._trigger("stop",event)!==false){this._clear()
}}return false
},_mouseUp:function(event){if(this.options.iframeFix===true){$("div.ui-draggable-iframeFix").each(function(){this.parentNode.removeChild(this)
})
}if($.ui.ddmanager){$.ui.ddmanager.dragStop(this,event)
}return $.ui.mouse.prototype._mouseUp.call(this,event)
},cancel:function(){if(this.helper.is(".ui-draggable-dragging")){this._mouseUp({})
}else{this._clear()
}return this
},_getHandle:function(event){var handle=!this.options.handle||!$(this.options.handle,this.element).length?true:false;
$(this.options.handle,this.element).find("*").andSelf().each(function(){if(this==event.target){handle=true
}});
return handle
},_createHelper:function(event){var o=this.options;
var helper=$.isFunction(o.helper)?$(o.helper.apply(this.element[0],[event])):(o.helper=="clone"?this.element.clone().removeAttr("id"):this.element);
if(!helper.parents("body").length){helper.appendTo((o.appendTo=="parent"?this.element[0].parentNode:o.appendTo))
}if(helper[0]!=this.element[0]&&!(/(fixed|absolute)/).test(helper.css("position"))){helper.css("position","absolute")
}return helper
},_adjustOffsetFromHelper:function(obj){if(typeof obj=="string"){obj=obj.split(" ")
}if($.isArray(obj)){obj={left:+obj[0],top:+obj[1]||0}
}if("left" in obj){this.offset.click.left=obj.left+this.margins.left
}if("right" in obj){this.offset.click.left=this.helperProportions.width-obj.right+this.margins.left
}if("top" in obj){this.offset.click.top=obj.top+this.margins.top
}if("bottom" in obj){this.offset.click.top=this.helperProportions.height-obj.bottom+this.margins.top
}},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();
var po=this.offsetParent.offset();
if(this.cssPosition=="absolute"&&this.scrollParent[0]!=document&&$.ui.contains(this.scrollParent[0],this.offsetParent[0])){po.left+=this.scrollParent.scrollLeft();
po.top+=this.scrollParent.scrollTop()
}if((this.offsetParent[0]==document.body)||(this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&$.browser.msie)){po={top:0,left:0}
}return{top:po.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:po.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}
},_getRelativeOffset:function(){if(this.cssPosition=="relative"){var p=this.element.position();
return{top:p.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:p.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}
}else{return{top:0,left:0}
}},_cacheMargins:function(){this.margins={left:(parseInt(this.element.css("marginLeft"),10)||0),top:(parseInt(this.element.css("marginTop"),10)||0),right:(parseInt(this.element.css("marginRight"),10)||0),bottom:(parseInt(this.element.css("marginBottom"),10)||0)}
},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}
},_setContainment:function(){var o=this.options;
if(o.containment=="parent"){o.containment=this.helper[0].parentNode
}if(o.containment=="document"||o.containment=="window"){this.containment=[o.containment=="document"?0:$(window).scrollLeft()-this.offset.relative.left-this.offset.parent.left,o.containment=="document"?0:$(window).scrollTop()-this.offset.relative.top-this.offset.parent.top,(o.containment=="document"?0:$(window).scrollLeft())+$(o.containment=="document"?document:window).width()-this.helperProportions.width-this.margins.left,(o.containment=="document"?0:$(window).scrollTop())+($(o.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top]
}if(!(/^(document|window|parent)$/).test(o.containment)&&o.containment.constructor!=Array){var c=$(o.containment);
var ce=c[0];
if(!ce){return
}var co=c.offset();
var over=($(ce).css("overflow")!="hidden");
this.containment=[(parseInt($(ce).css("borderLeftWidth"),10)||0)+(parseInt($(ce).css("paddingLeft"),10)||0),(parseInt($(ce).css("borderTopWidth"),10)||0)+(parseInt($(ce).css("paddingTop"),10)||0),(over?Math.max(ce.scrollWidth,ce.offsetWidth):ce.offsetWidth)-(parseInt($(ce).css("borderLeftWidth"),10)||0)-(parseInt($(ce).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left-this.margins.right,(over?Math.max(ce.scrollHeight,ce.offsetHeight):ce.offsetHeight)-(parseInt($(ce).css("borderTopWidth"),10)||0)-(parseInt($(ce).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top-this.margins.bottom];
this.relative_container=c
}else{if(o.containment.constructor==Array){this.containment=o.containment
}}},_convertPositionTo:function(d,pos){if(!pos){pos=this.position
}var mod=d=="absolute"?1:-1;
var o=this.options,scroll=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&$.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,scrollIsRootNode=(/(html|body)/i).test(scroll[0].tagName);
return{top:(pos.top+this.offset.relative.top*mod+this.offset.parent.top*mod-($.browser.safari&&$.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():(scrollIsRootNode?0:scroll.scrollTop()))*mod)),left:(pos.left+this.offset.relative.left*mod+this.offset.parent.left*mod-($.browser.safari&&$.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():scrollIsRootNode?0:scroll.scrollLeft())*mod))}
},_generatePosition:function(event){var o=this.options,scroll=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&$.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,scrollIsRootNode=(/(html|body)/i).test(scroll[0].tagName);
var pageX=event.pageX;
var pageY=event.pageY;
if(this.originalPosition){var containment;
if(this.containment){if(this.relative_container){var co=this.relative_container.offset();
containment=[this.containment[0]+co.left,this.containment[1]+co.top,this.containment[2]+co.left,this.containment[3]+co.top]
}else{containment=this.containment
}if(event.pageX-this.offset.click.left<containment[0]){pageX=containment[0]+this.offset.click.left
}if(event.pageY-this.offset.click.top<containment[1]){pageY=containment[1]+this.offset.click.top
}if(event.pageX-this.offset.click.left>containment[2]){pageX=containment[2]+this.offset.click.left
}if(event.pageY-this.offset.click.top>containment[3]){pageY=containment[3]+this.offset.click.top
}}if(o.grid){var top=o.grid[1]?this.originalPageY+Math.round((pageY-this.originalPageY)/o.grid[1])*o.grid[1]:this.originalPageY;
pageY=containment?(!(top-this.offset.click.top<containment[1]||top-this.offset.click.top>containment[3])?top:(!(top-this.offset.click.top<containment[1])?top-o.grid[1]:top+o.grid[1])):top;
var left=o.grid[0]?this.originalPageX+Math.round((pageX-this.originalPageX)/o.grid[0])*o.grid[0]:this.originalPageX;
pageX=containment?(!(left-this.offset.click.left<containment[0]||left-this.offset.click.left>containment[2])?left:(!(left-this.offset.click.left<containment[0])?left-o.grid[0]:left+o.grid[0])):left
}}return{top:(pageY-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+($.browser.safari&&$.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():(scrollIsRootNode?0:scroll.scrollTop())))),left:(pageX-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+($.browser.safari&&$.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():scrollIsRootNode?0:scroll.scrollLeft())))}
},_clear:function(){this.helper.removeClass("ui-draggable-dragging");
if(this.helper[0]!=this.element[0]&&!this.cancelHelperRemoval){this.helper.remove()
}this.helper=null;
this.cancelHelperRemoval=false
},_trigger:function(type,event,ui){ui=ui||this._uiHash();
$.ui.plugin.call(this,type,[event,ui]);
if(type=="drag"){this.positionAbs=this._convertPositionTo("absolute")
}return $.Widget.prototype._trigger.call(this,type,event,ui)
},plugins:{},_uiHash:function(event){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs}
}});
$.extend($.ui.draggable,{version:"1.8.16"});
$.ui.plugin.add("draggable","connectToSortable",{start:function(event,ui){var inst=$(this).data("draggable"),o=inst.options,uiSortable=$.extend({},ui,{item:inst.element});
inst.sortables=[];
$(o.connectToSortable).each(function(){var sortable=$.data(this,"sortable");
if(sortable&&!sortable.options.disabled){inst.sortables.push({instance:sortable,shouldRevert:sortable.options.revert});
sortable.refreshPositions();
sortable._trigger("activate",event,uiSortable)
}})
},stop:function(event,ui){var inst=$(this).data("draggable"),uiSortable=$.extend({},ui,{item:inst.element});
$.each(inst.sortables,function(){if(this.instance.isOver){this.instance.isOver=0;
inst.cancelHelperRemoval=true;
this.instance.cancelHelperRemoval=false;
if(this.shouldRevert){this.instance.options.revert=true
}this.instance._mouseStop(event);
this.instance.options.helper=this.instance.options._helper;
if(inst.options.helper=="original"){this.instance.currentItem.css({top:"auto",left:"auto"})
}}else{this.instance.cancelHelperRemoval=false;
this.instance._trigger("deactivate",event,uiSortable)
}})
},drag:function(event,ui){var inst=$(this).data("draggable"),self=this;
var checkPos=function(o){var dyClick=this.offset.click.top,dxClick=this.offset.click.left;
var helperTop=this.positionAbs.top,helperLeft=this.positionAbs.left;
var itemHeight=o.height,itemWidth=o.width;
var itemTop=o.top,itemLeft=o.left;
return $.ui.isOver(helperTop+dyClick,helperLeft+dxClick,itemTop,itemLeft,itemHeight,itemWidth)
};
$.each(inst.sortables,function(i){this.instance.positionAbs=inst.positionAbs;
this.instance.helperProportions=inst.helperProportions;
this.instance.offset.click=inst.offset.click;
if(this.instance._intersectsWith(this.instance.containerCache)){if(!this.instance.isOver){this.instance.isOver=1;
this.instance.currentItem=$(self).clone().removeAttr("id").appendTo(this.instance.element).data("sortable-item",true);
this.instance.options._helper=this.instance.options.helper;
this.instance.options.helper=function(){return ui.helper[0]
};
event.target=this.instance.currentItem[0];
this.instance._mouseCapture(event,true);
this.instance._mouseStart(event,true,true);
this.instance.offset.click.top=inst.offset.click.top;
this.instance.offset.click.left=inst.offset.click.left;
this.instance.offset.parent.left-=inst.offset.parent.left-this.instance.offset.parent.left;
this.instance.offset.parent.top-=inst.offset.parent.top-this.instance.offset.parent.top;
inst._trigger("toSortable",event);
inst.dropped=this.instance.element;
inst.currentItem=inst.element;
this.instance.fromOutside=inst
}if(this.instance.currentItem){this.instance._mouseDrag(event)
}}else{if(this.instance.isOver){this.instance.isOver=0;
this.instance.cancelHelperRemoval=true;
this.instance.options.revert=false;
this.instance._trigger("out",event,this.instance._uiHash(this.instance));
this.instance._mouseStop(event,true);
this.instance.options.helper=this.instance.options._helper;
this.instance.currentItem.remove();
if(this.instance.placeholder){this.instance.placeholder.remove()
}inst._trigger("fromSortable",event);
inst.dropped=false
}}})
}});
$.ui.plugin.add("draggable","cursor",{start:function(event,ui){var t=$("body"),o=$(this).data("draggable").options;
if(t.css("cursor")){o._cursor=t.css("cursor")
}t.css("cursor",o.cursor)
},stop:function(event,ui){var o=$(this).data("draggable").options;
if(o._cursor){$("body").css("cursor",o._cursor)
}}});
$.ui.plugin.add("draggable","opacity",{start:function(event,ui){var t=$(ui.helper),o=$(this).data("draggable").options;
if(t.css("opacity")){o._opacity=t.css("opacity")
}t.css("opacity",o.opacity)
},stop:function(event,ui){var o=$(this).data("draggable").options;
if(o._opacity){$(ui.helper).css("opacity",o._opacity)
}}});
$.ui.plugin.add("draggable","scroll",{start:function(event,ui){var i=$(this).data("draggable");
if(i.scrollParent[0]!=document&&i.scrollParent[0].tagName!="HTML"){i.overflowOffset=i.scrollParent.offset()
}},drag:function(event,ui){var i=$(this).data("draggable"),o=i.options,scrolled=false;
if(i.scrollParent[0]!=document&&i.scrollParent[0].tagName!="HTML"){if(!o.axis||o.axis!="x"){if((i.overflowOffset.top+i.scrollParent[0].offsetHeight)-event.pageY<o.scrollSensitivity){i.scrollParent[0].scrollTop=scrolled=i.scrollParent[0].scrollTop+o.scrollSpeed
}else{if(event.pageY-i.overflowOffset.top<o.scrollSensitivity){i.scrollParent[0].scrollTop=scrolled=i.scrollParent[0].scrollTop-o.scrollSpeed
}}}if(!o.axis||o.axis!="y"){if((i.overflowOffset.left+i.scrollParent[0].offsetWidth)-event.pageX<o.scrollSensitivity){i.scrollParent[0].scrollLeft=scrolled=i.scrollParent[0].scrollLeft+o.scrollSpeed
}else{if(event.pageX-i.overflowOffset.left<o.scrollSensitivity){i.scrollParent[0].scrollLeft=scrolled=i.scrollParent[0].scrollLeft-o.scrollSpeed
}}}}else{if(!o.axis||o.axis!="x"){if(event.pageY-$(document).scrollTop()<o.scrollSensitivity){scrolled=$(document).scrollTop($(document).scrollTop()-o.scrollSpeed)
}else{if($(window).height()-(event.pageY-$(document).scrollTop())<o.scrollSensitivity){scrolled=$(document).scrollTop($(document).scrollTop()+o.scrollSpeed)
}}}if(!o.axis||o.axis!="y"){if(event.pageX-$(document).scrollLeft()<o.scrollSensitivity){scrolled=$(document).scrollLeft($(document).scrollLeft()-o.scrollSpeed)
}else{if($(window).width()-(event.pageX-$(document).scrollLeft())<o.scrollSensitivity){scrolled=$(document).scrollLeft($(document).scrollLeft()+o.scrollSpeed)
}}}}if(scrolled!==false&&$.ui.ddmanager&&!o.dropBehaviour){$.ui.ddmanager.prepareOffsets(i,event)
}}});
$.ui.plugin.add("draggable","snap",{start:function(event,ui){var i=$(this).data("draggable"),o=i.options;
i.snapElements=[];
$(o.snap.constructor!=String?(o.snap.items||":data(draggable)"):o.snap).each(function(){var $t=$(this);
var $o=$t.offset();
if(this!=i.element[0]){i.snapElements.push({item:this,width:$t.outerWidth(),height:$t.outerHeight(),top:$o.top,left:$o.left})
}})
},drag:function(event,ui){var inst=$(this).data("draggable"),o=inst.options;
var d=o.snapTolerance;
var x1=ui.offset.left,x2=x1+inst.helperProportions.width,y1=ui.offset.top,y2=y1+inst.helperProportions.height;
for(var i=inst.snapElements.length-1;
i>=0;
i--){var l=inst.snapElements[i].left,r=l+inst.snapElements[i].width,t=inst.snapElements[i].top,b=t+inst.snapElements[i].height;
if(!((l-d<x1&&x1<r+d&&t-d<y1&&y1<b+d)||(l-d<x1&&x1<r+d&&t-d<y2&&y2<b+d)||(l-d<x2&&x2<r+d&&t-d<y1&&y1<b+d)||(l-d<x2&&x2<r+d&&t-d<y2&&y2<b+d))){if(inst.snapElements[i].snapping){(inst.options.snap.release&&inst.options.snap.release.call(inst.element,event,$.extend(inst._uiHash(),{snapItem:inst.snapElements[i].item})))
}inst.snapElements[i].snapping=false;
continue
}if(o.snapMode!="inner"){var ts=Math.abs(t-y2)<=d;
var bs=Math.abs(b-y1)<=d;
var ls=Math.abs(l-x2)<=d;
var rs=Math.abs(r-x1)<=d;
if(ts){ui.position.top=inst._convertPositionTo("relative",{top:t-inst.helperProportions.height,left:0}).top-inst.margins.top
}if(bs){ui.position.top=inst._convertPositionTo("relative",{top:b,left:0}).top-inst.margins.top
}if(ls){ui.position.left=inst._convertPositionTo("relative",{top:0,left:l-inst.helperProportions.width}).left-inst.margins.left
}if(rs){ui.position.left=inst._convertPositionTo("relative",{top:0,left:r}).left-inst.margins.left
}}var first=(ts||bs||ls||rs);
if(o.snapMode!="outer"){var ts=Math.abs(t-y1)<=d;
var bs=Math.abs(b-y2)<=d;
var ls=Math.abs(l-x1)<=d;
var rs=Math.abs(r-x2)<=d;
if(ts){ui.position.top=inst._convertPositionTo("relative",{top:t,left:0}).top-inst.margins.top
}if(bs){ui.position.top=inst._convertPositionTo("relative",{top:b-inst.helperProportions.height,left:0}).top-inst.margins.top
}if(ls){ui.position.left=inst._convertPositionTo("relative",{top:0,left:l}).left-inst.margins.left
}if(rs){ui.position.left=inst._convertPositionTo("relative",{top:0,left:r-inst.helperProportions.width}).left-inst.margins.left
}}if(!inst.snapElements[i].snapping&&(ts||bs||ls||rs||first)){(inst.options.snap.snap&&inst.options.snap.snap.call(inst.element,event,$.extend(inst._uiHash(),{snapItem:inst.snapElements[i].item})))
}inst.snapElements[i].snapping=(ts||bs||ls||rs||first)
}}});
$.ui.plugin.add("draggable","stack",{start:function(event,ui){var o=$(this).data("draggable").options;
var group=$.makeArray($(o.stack)).sort(function(a,b){return(parseInt($(a).css("zIndex"),10)||0)-(parseInt($(b).css("zIndex"),10)||0)
});
if(!group.length){return
}var min=parseInt(group[0].style.zIndex)||0;
$(group).each(function(i){this.style.zIndex=min+i
});
this[0].style.zIndex=min+group.length
}});
$.ui.plugin.add("draggable","zIndex",{start:function(event,ui){var t=$(ui.helper),o=$(this).data("draggable").options;
if(t.css("zIndex")){o._zIndex=t.css("zIndex")
}t.css("zIndex",o.zIndex)
},stop:function(event,ui){var o=$(this).data("draggable").options;
if(o._zIndex){$(ui.helper).css("zIndex",o._zIndex)
}}})
})(jQuery);
(function($,undefined){$.widget("ui.droppable",{widgetEventPrefix:"drop",options:{accept:"*",activeClass:false,addClasses:true,greedy:false,hoverClass:false,scope:"default",tolerance:"intersect"},_create:function(){var o=this.options,accept=o.accept;
this.isover=0;
this.isout=1;
this.accept=$.isFunction(accept)?accept:function(d){return d.is(accept)
};
this.proportions={width:this.element[0].offsetWidth,height:this.element[0].offsetHeight};
$.ui.ddmanager.droppables[o.scope]=$.ui.ddmanager.droppables[o.scope]||[];
$.ui.ddmanager.droppables[o.scope].push(this);
(o.addClasses&&this.element.addClass("ui-droppable"))
},destroy:function(){var drop=$.ui.ddmanager.droppables[this.options.scope];
for(var i=0;
i<drop.length;
i++){if(drop[i]==this){drop.splice(i,1)
}}this.element.removeClass("ui-droppable ui-droppable-disabled").removeData("droppable").unbind(".droppable");
return this
},_setOption:function(key,value){if(key=="accept"){this.accept=$.isFunction(value)?value:function(d){return d.is(value)
}
}$.Widget.prototype._setOption.apply(this,arguments)
},_activate:function(event){var draggable=$.ui.ddmanager.current;
if(this.options.activeClass){this.element.addClass(this.options.activeClass)
}(draggable&&this._trigger("activate",event,this.ui(draggable)))
},_deactivate:function(event){var draggable=$.ui.ddmanager.current;
if(this.options.activeClass){this.element.removeClass(this.options.activeClass)
}(draggable&&this._trigger("deactivate",event,this.ui(draggable)))
},_over:function(event){var draggable=$.ui.ddmanager.current;
if(!draggable||(draggable.currentItem||draggable.element)[0]==this.element[0]){return
}if(this.accept.call(this.element[0],(draggable.currentItem||draggable.element))){if(this.options.hoverClass){this.element.addClass(this.options.hoverClass)
}this._trigger("over",event,this.ui(draggable))
}},_out:function(event){var draggable=$.ui.ddmanager.current;
if(!draggable||(draggable.currentItem||draggable.element)[0]==this.element[0]){return
}if(this.accept.call(this.element[0],(draggable.currentItem||draggable.element))){if(this.options.hoverClass){this.element.removeClass(this.options.hoverClass)
}this._trigger("out",event,this.ui(draggable))
}},_drop:function(event,custom){var draggable=custom||$.ui.ddmanager.current;
if(!draggable||(draggable.currentItem||draggable.element)[0]==this.element[0]){return false
}var childrenIntersection=false;
this.element.find(":data(droppable)").not(".ui-draggable-dragging").each(function(){var inst=$.data(this,"droppable");
if(inst.options.greedy&&!inst.options.disabled&&inst.options.scope==draggable.options.scope&&inst.accept.call(inst.element[0],(draggable.currentItem||draggable.element))&&$.ui.intersect(draggable,$.extend(inst,{offset:inst.element.offset()}),inst.options.tolerance)){childrenIntersection=true;
return false
}});
if(childrenIntersection){return false
}if(this.accept.call(this.element[0],(draggable.currentItem||draggable.element))){if(this.options.activeClass){this.element.removeClass(this.options.activeClass)
}if(this.options.hoverClass){this.element.removeClass(this.options.hoverClass)
}this._trigger("drop",event,this.ui(draggable));
return this.element
}return false
},ui:function(c){return{draggable:(c.currentItem||c.element),helper:c.helper,position:c.position,offset:c.positionAbs}
}});
$.extend($.ui.droppable,{version:"1.8.16"});
$.ui.intersect=function(draggable,droppable,toleranceMode){if(!droppable.offset){return false
}var x1=(draggable.positionAbs||draggable.position.absolute).left,x2=x1+draggable.helperProportions.width,y1=(draggable.positionAbs||draggable.position.absolute).top,y2=y1+draggable.helperProportions.height;
var l=droppable.offset.left,r=l+droppable.proportions.width,t=droppable.offset.top,b=t+droppable.proportions.height;
switch(toleranceMode){case"fit":return(l<=x1&&x2<=r&&t<=y1&&y2<=b);
break;
case"intersect":return(l<x1+(draggable.helperProportions.width/2)&&x2-(draggable.helperProportions.width/2)<r&&t<y1+(draggable.helperProportions.height/2)&&y2-(draggable.helperProportions.height/2)<b);
break;
case"pointer":var draggableLeft=((draggable.positionAbs||draggable.position.absolute).left+(draggable.clickOffset||draggable.offset.click).left),draggableTop=((draggable.positionAbs||draggable.position.absolute).top+(draggable.clickOffset||draggable.offset.click).top),isOver=$.ui.isOver(draggableTop,draggableLeft,t,l,droppable.proportions.height,droppable.proportions.width);
return isOver;
break;
case"touch":return((y1>=t&&y1<=b)||(y2>=t&&y2<=b)||(y1<t&&y2>b))&&((x1>=l&&x1<=r)||(x2>=l&&x2<=r)||(x1<l&&x2>r));
break;
default:return false;
break
}};
$.ui.ddmanager={current:null,droppables:{"default":[]},prepareOffsets:function(t,event){var m=$.ui.ddmanager.droppables[t.options.scope]||[];
var type=event?event.type:null;
var list=(t.currentItem||t.element).find(":data(droppable)").andSelf();
droppablesLoop:for(var i=0;
i<m.length;
i++){if(m[i].options.disabled||(t&&!m[i].accept.call(m[i].element[0],(t.currentItem||t.element)))){continue
}for(var j=0;
j<list.length;
j++){if(list[j]==m[i].element[0]){m[i].proportions.height=0;
continue droppablesLoop
}}m[i].visible=m[i].element.css("display")!="none";
if(!m[i].visible){continue
}if(type=="mousedown"){m[i]._activate.call(m[i],event)
}m[i].offset=m[i].element.offset();
m[i].proportions={width:m[i].element[0].offsetWidth,height:m[i].element[0].offsetHeight}
}},drop:function(draggable,event){var dropped=false;
$.each($.ui.ddmanager.droppables[draggable.options.scope]||[],function(){if(!this.options){return
}if(!this.options.disabled&&this.visible&&$.ui.intersect(draggable,this,this.options.tolerance)){dropped=dropped||this._drop.call(this,event)
}if(!this.options.disabled&&this.visible&&this.accept.call(this.element[0],(draggable.currentItem||draggable.element))){this.isout=1;
this.isover=0;
this._deactivate.call(this,event)
}});
return dropped
},dragStart:function(draggable,event){draggable.element.parents(":not(body,html)").bind("scroll.droppable",function(){if(!draggable.options.refreshPositions){$.ui.ddmanager.prepareOffsets(draggable,event)
}})
},drag:function(draggable,event){if(draggable.options.refreshPositions){$.ui.ddmanager.prepareOffsets(draggable,event)
}$.each($.ui.ddmanager.droppables[draggable.options.scope]||[],function(){if(this.options.disabled||this.greedyChild||!this.visible){return
}var intersects=$.ui.intersect(draggable,this,this.options.tolerance);
var c=!intersects&&this.isover==1?"isout":(intersects&&this.isover==0?"isover":null);
if(!c){return
}var parentInstance;
if(this.options.greedy){var parent=this.element.parents(":data(droppable):eq(0)");
if(parent.length){parentInstance=$.data(parent[0],"droppable");
parentInstance.greedyChild=(c=="isover"?1:0)
}}if(parentInstance&&c=="isover"){parentInstance.isover=0;
parentInstance.isout=1;
parentInstance._out.call(parentInstance,event)
}this[c]=1;
this[c=="isout"?"isover":"isout"]=0;
this[c=="isover"?"_over":"_out"].call(this,event);
if(parentInstance&&c=="isout"){parentInstance.isout=0;
parentInstance.isover=1;
parentInstance._over.call(parentInstance,event)
}})
},dragStop:function(draggable,event){draggable.element.parents(":not(body,html)").unbind("scroll.droppable");
if(!draggable.options.refreshPositions){$.ui.ddmanager.prepareOffsets(draggable,event)
}}}
})(jQuery);
(function($,undefined){$.widget("ui.sortable",$.ui.mouse,{widgetEventPrefix:"sort",options:{appendTo:"parent",axis:false,connectWith:false,containment:false,cursor:"auto",cursorAt:false,dropOnEmpty:true,forcePlaceholderSize:false,forceHelperSize:false,grid:false,handle:false,helper:"original",items:"> *",opacity:false,placeholder:false,revert:false,scroll:true,scrollSensitivity:20,scrollSpeed:20,scope:"default",tolerance:"intersect",zIndex:1000},_create:function(){var o=this.options;
this.containerCache={};
this.element.addClass("ui-sortable");
this.refresh();
this.floating=this.items.length?o.axis==="x"||(/left|right/).test(this.items[0].item.css("float"))||(/inline|table-cell/).test(this.items[0].item.css("display")):false;
this.offset=this.element.offset();
this._mouseInit()
},destroy:function(){this.element.removeClass("ui-sortable ui-sortable-disabled").removeData("sortable").unbind(".sortable");
this._mouseDestroy();
for(var i=this.items.length-1;
i>=0;
i--){this.items[i].item.removeData("sortable-item")
}return this
},_setOption:function(key,value){if(key==="disabled"){this.options[key]=value;
this.widget()[value?"addClass":"removeClass"]("ui-sortable-disabled")
}else{$.Widget.prototype._setOption.apply(this,arguments)
}},_mouseCapture:function(event,overrideHandle){if(this.reverting){return false
}if(this.options.disabled||this.options.type=="static"){return false
}this._refreshItems(event);
var currentItem=null,self=this,nodes=$(event.target).parents().each(function(){if($.data(this,"sortable-item")==self){currentItem=$(this);
return false
}});
if($.data(event.target,"sortable-item")==self){currentItem=$(event.target)
}if(!currentItem){return false
}if(this.options.handle&&!overrideHandle){var validHandle=false;
$(this.options.handle,currentItem).find("*").andSelf().each(function(){if(this==event.target){validHandle=true
}});
if(!validHandle){return false
}}this.currentItem=currentItem;
this._removeCurrentsFromItems();
return true
},_mouseStart:function(event,overrideHandle,noActivation){var o=this.options,self=this;
this.currentContainer=this;
this.refreshPositions();
this.helper=this._createHelper(event);
this._cacheHelperProportions();
this._cacheMargins();
this.scrollParent=this.helper.scrollParent();
this.offset=this.currentItem.offset();
this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left};
this.helper.css("position","absolute");
this.cssPosition=this.helper.css("position");
$.extend(this.offset,{click:{left:event.pageX-this.offset.left,top:event.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()});
this.originalPosition=this._generatePosition(event);
this.originalPageX=event.pageX;
this.originalPageY=event.pageY;
(o.cursorAt&&this._adjustOffsetFromHelper(o.cursorAt));
this.domPosition={prev:this.currentItem.prev()[0],parent:this.currentItem.parent()[0]};
if(this.helper[0]!=this.currentItem[0]){this.currentItem.hide()
}this._createPlaceholder();
if(o.containment){this._setContainment()
}if(o.cursor){if($("body").css("cursor")){this._storedCursor=$("body").css("cursor")
}$("body").css("cursor",o.cursor)
}if(o.opacity){if(this.helper.css("opacity")){this._storedOpacity=this.helper.css("opacity")
}this.helper.css("opacity",o.opacity)
}if(o.zIndex){if(this.helper.css("zIndex")){this._storedZIndex=this.helper.css("zIndex")
}this.helper.css("zIndex",o.zIndex)
}if(this.scrollParent[0]!=document&&this.scrollParent[0].tagName!="HTML"){this.overflowOffset=this.scrollParent.offset()
}this._trigger("start",event,this._uiHash());
if(!this._preserveHelperProportions){this._cacheHelperProportions()
}if(!noActivation){for(var i=this.containers.length-1;
i>=0;
i--){this.containers[i]._trigger("activate",event,self._uiHash(this))
}}if($.ui.ddmanager){$.ui.ddmanager.current=this
}if($.ui.ddmanager&&!o.dropBehaviour){$.ui.ddmanager.prepareOffsets(this,event)
}this.dragging=true;
this.helper.addClass("ui-sortable-helper");
this._mouseDrag(event);
return true
},_mouseDrag:function(event){this.position=this._generatePosition(event);
this.positionAbs=this._convertPositionTo("absolute");
if(!this.lastPositionAbs){this.lastPositionAbs=this.positionAbs
}if(this.options.scroll){var o=this.options,scrolled=false;
if(this.scrollParent[0]!=document&&this.scrollParent[0].tagName!="HTML"){if((this.overflowOffset.top+this.scrollParent[0].offsetHeight)-event.pageY<o.scrollSensitivity){this.scrollParent[0].scrollTop=scrolled=this.scrollParent[0].scrollTop+o.scrollSpeed
}else{if(event.pageY-this.overflowOffset.top<o.scrollSensitivity){this.scrollParent[0].scrollTop=scrolled=this.scrollParent[0].scrollTop-o.scrollSpeed
}}if((this.overflowOffset.left+this.scrollParent[0].offsetWidth)-event.pageX<o.scrollSensitivity){this.scrollParent[0].scrollLeft=scrolled=this.scrollParent[0].scrollLeft+o.scrollSpeed
}else{if(event.pageX-this.overflowOffset.left<o.scrollSensitivity){this.scrollParent[0].scrollLeft=scrolled=this.scrollParent[0].scrollLeft-o.scrollSpeed
}}}else{if(event.pageY-$(document).scrollTop()<o.scrollSensitivity){scrolled=$(document).scrollTop($(document).scrollTop()-o.scrollSpeed)
}else{if($(window).height()-(event.pageY-$(document).scrollTop())<o.scrollSensitivity){scrolled=$(document).scrollTop($(document).scrollTop()+o.scrollSpeed)
}}if(event.pageX-$(document).scrollLeft()<o.scrollSensitivity){scrolled=$(document).scrollLeft($(document).scrollLeft()-o.scrollSpeed)
}else{if($(window).width()-(event.pageX-$(document).scrollLeft())<o.scrollSensitivity){scrolled=$(document).scrollLeft($(document).scrollLeft()+o.scrollSpeed)
}}}if(scrolled!==false&&$.ui.ddmanager&&!o.dropBehaviour){$.ui.ddmanager.prepareOffsets(this,event)
}}this.positionAbs=this._convertPositionTo("absolute");
if(!this.options.axis||this.options.axis!="y"){this.helper[0].style.left=this.position.left+"px"
}if(!this.options.axis||this.options.axis!="x"){this.helper[0].style.top=this.position.top+"px"
}for(var i=this.items.length-1;
i>=0;
i--){var item=this.items[i],itemElement=item.item[0],intersection=this._intersectsWithPointer(item);
if(!intersection){continue
}if(itemElement!=this.currentItem[0]&&this.placeholder[intersection==1?"next":"prev"]()[0]!=itemElement&&!$.ui.contains(this.placeholder[0],itemElement)&&(this.options.type=="semi-dynamic"?!$.ui.contains(this.element[0],itemElement):true)){this.direction=intersection==1?"down":"up";
if(this.options.tolerance=="pointer"||this._intersectsWithSides(item)){this._rearrange(event,item)
}else{break
}this._trigger("change",event,this._uiHash());
break
}}this._contactContainers(event);
if($.ui.ddmanager){$.ui.ddmanager.drag(this,event)
}this._trigger("sort",event,this._uiHash());
this.lastPositionAbs=this.positionAbs;
return false
},_mouseStop:function(event,noPropagation){if(!event){return
}if($.ui.ddmanager&&!this.options.dropBehaviour){$.ui.ddmanager.drop(this,event)
}if(this.options.revert){var self=this;
var cur=self.placeholder.offset();
self.reverting=true;
$(this.helper).animate({left:cur.left-this.offset.parent.left-self.margins.left+(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollLeft),top:cur.top-this.offset.parent.top-self.margins.top+(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollTop)},parseInt(this.options.revert,10)||500,function(){self._clear(event)
})
}else{this._clear(event,noPropagation)
}return false
},cancel:function(){var self=this;
if(this.dragging){this._mouseUp({target:null});
if(this.options.helper=="original"){this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")
}else{this.currentItem.show()
}for(var i=this.containers.length-1;
i>=0;
i--){this.containers[i]._trigger("deactivate",null,self._uiHash(this));
if(this.containers[i].containerCache.over){this.containers[i]._trigger("out",null,self._uiHash(this));
this.containers[i].containerCache.over=0
}}}if(this.placeholder){if(this.placeholder[0].parentNode){this.placeholder[0].parentNode.removeChild(this.placeholder[0])
}if(this.options.helper!="original"&&this.helper&&this.helper[0].parentNode){this.helper.remove()
}$.extend(this,{helper:null,dragging:false,reverting:false,_noFinalSort:null});
if(this.domPosition.prev){$(this.domPosition.prev).after(this.currentItem)
}else{$(this.domPosition.parent).prepend(this.currentItem)
}}return this
},serialize:function(o){var items=this._getItemsAsjQuery(o&&o.connected);
var str=[];
o=o||{};
$(items).each(function(){var res=($(o.item||this).attr(o.attribute||"id")||"").match(o.expression||(/(.+)[-=_](.+)/));
if(res){str.push((o.key||res[1]+"[]")+"="+(o.key&&o.expression?res[1]:res[2]))
}});
if(!str.length&&o.key){str.push(o.key+"=")
}return str.join("&")
},toArray:function(o){var items=this._getItemsAsjQuery(o&&o.connected);
var ret=[];
o=o||{};
items.each(function(){ret.push($(o.item||this).attr(o.attribute||"id")||"")
});
return ret
},_intersectsWith:function(item){var x1=this.positionAbs.left,x2=x1+this.helperProportions.width,y1=this.positionAbs.top,y2=y1+this.helperProportions.height;
var l=item.left,r=l+item.width,t=item.top,b=t+item.height;
var dyClick=this.offset.click.top,dxClick=this.offset.click.left;
var isOverElement=(y1+dyClick)>t&&(y1+dyClick)<b&&(x1+dxClick)>l&&(x1+dxClick)<r;
if(this.options.tolerance=="pointer"||this.options.forcePointerForContainers||(this.options.tolerance!="pointer"&&this.helperProportions[this.floating?"width":"height"]>item[this.floating?"width":"height"])){return isOverElement
}else{return(l<x1+(this.helperProportions.width/2)&&x2-(this.helperProportions.width/2)<r&&t<y1+(this.helperProportions.height/2)&&y2-(this.helperProportions.height/2)<b)
}},_intersectsWithPointer:function(item){var isOverElementHeight=$.ui.isOverAxis(this.positionAbs.top+this.offset.click.top,item.top,item.height),isOverElementWidth=$.ui.isOverAxis(this.positionAbs.left+this.offset.click.left,item.left,item.width),isOverElement=isOverElementHeight&&isOverElementWidth,verticalDirection=this._getDragVerticalDirection(),horizontalDirection=this._getDragHorizontalDirection();
if(!isOverElement){return false
}return this.floating?(((horizontalDirection&&horizontalDirection=="right")||verticalDirection=="down")?2:1):(verticalDirection&&(verticalDirection=="down"?2:1))
},_intersectsWithSides:function(item){var isOverBottomHalf=$.ui.isOverAxis(this.positionAbs.top+this.offset.click.top,item.top+(item.height/2),item.height),isOverRightHalf=$.ui.isOverAxis(this.positionAbs.left+this.offset.click.left,item.left+(item.width/2),item.width),verticalDirection=this._getDragVerticalDirection(),horizontalDirection=this._getDragHorizontalDirection();
if(this.floating&&horizontalDirection){return((horizontalDirection=="right"&&isOverRightHalf)||(horizontalDirection=="left"&&!isOverRightHalf))
}else{return verticalDirection&&((verticalDirection=="down"&&isOverBottomHalf)||(verticalDirection=="up"&&!isOverBottomHalf))
}},_getDragVerticalDirection:function(){var delta=this.positionAbs.top-this.lastPositionAbs.top;
return delta!=0&&(delta>0?"down":"up")
},_getDragHorizontalDirection:function(){var delta=this.positionAbs.left-this.lastPositionAbs.left;
return delta!=0&&(delta>0?"right":"left")
},refresh:function(event){this._refreshItems(event);
this.refreshPositions();
return this
},_connectWith:function(){var options=this.options;
return options.connectWith.constructor==String?[options.connectWith]:options.connectWith
},_getItemsAsjQuery:function(connected){var self=this;
var items=[];
var queries=[];
var connectWith=this._connectWith();
if(connectWith&&connected){for(var i=connectWith.length-1;
i>=0;
i--){var cur=$(connectWith[i]);
for(var j=cur.length-1;
j>=0;
j--){var inst=$.data(cur[j],"sortable");
if(inst&&inst!=this&&!inst.options.disabled){queries.push([$.isFunction(inst.options.items)?inst.options.items.call(inst.element):$(inst.options.items,inst.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),inst])
}}}}queries.push([$.isFunction(this.options.items)?this.options.items.call(this.element,null,{options:this.options,item:this.currentItem}):$(this.options.items,this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),this]);
for(var i=queries.length-1;
i>=0;
i--){queries[i][0].each(function(){items.push(this)
})
}return $(items)
},_removeCurrentsFromItems:function(){var list=this.currentItem.find(":data(sortable-item)");
for(var i=0;
i<this.items.length;
i++){for(var j=0;
j<list.length;
j++){if(list[j]==this.items[i].item[0]){this.items.splice(i,1)
}}}},_refreshItems:function(event){this.items=[];
this.containers=[this];
var items=this.items;
var self=this;
var queries=[[$.isFunction(this.options.items)?this.options.items.call(this.element[0],event,{item:this.currentItem}):$(this.options.items,this.element),this]];
var connectWith=this._connectWith();
if(connectWith){for(var i=connectWith.length-1;
i>=0;
i--){var cur=$(connectWith[i]);
for(var j=cur.length-1;
j>=0;
j--){var inst=$.data(cur[j],"sortable");
if(inst&&inst!=this&&!inst.options.disabled){queries.push([$.isFunction(inst.options.items)?inst.options.items.call(inst.element[0],event,{item:this.currentItem}):$(inst.options.items,inst.element),inst]);
this.containers.push(inst)
}}}}for(var i=queries.length-1;
i>=0;
i--){var targetData=queries[i][1];
var _queries=queries[i][0];
for(var j=0,queriesLength=_queries.length;
j<queriesLength;
j++){var item=$(_queries[j]);
item.data("sortable-item",targetData);
items.push({item:item,instance:targetData,width:0,height:0,left:0,top:0})
}}},refreshPositions:function(fast){if(this.offsetParent&&this.helper){this.offset.parent=this._getParentOffset()
}for(var i=this.items.length-1;
i>=0;
i--){var item=this.items[i];
if(item.instance!=this.currentContainer&&this.currentContainer&&item.item[0]!=this.currentItem[0]){continue
}var t=this.options.toleranceElement?$(this.options.toleranceElement,item.item):item.item;
if(!fast){item.width=t.outerWidth();
item.height=t.outerHeight()
}var p=t.offset();
item.left=p.left;
item.top=p.top
}if(this.options.custom&&this.options.custom.refreshContainers){this.options.custom.refreshContainers.call(this)
}else{for(var i=this.containers.length-1;
i>=0;
i--){var p=this.containers[i].element.offset();
this.containers[i].containerCache.left=p.left;
this.containers[i].containerCache.top=p.top;
this.containers[i].containerCache.width=this.containers[i].element.outerWidth();
this.containers[i].containerCache.height=this.containers[i].element.outerHeight()
}}return this
},_createPlaceholder:function(that){var self=that||this,o=self.options;
if(!o.placeholder||o.placeholder.constructor==String){var className=o.placeholder;
o.placeholder={element:function(){var el=$(document.createElement(self.currentItem[0].nodeName)).addClass(className||self.currentItem[0].className+" ui-sortable-placeholder").removeClass("ui-sortable-helper")[0];
if(!className){el.style.visibility="hidden"
}return el
},update:function(container,p){if(className&&!o.forcePlaceholderSize){return
}if(!p.height()){p.height(self.currentItem.innerHeight()-parseInt(self.currentItem.css("paddingTop")||0,10)-parseInt(self.currentItem.css("paddingBottom")||0,10))
}if(!p.width()){p.width(self.currentItem.innerWidth()-parseInt(self.currentItem.css("paddingLeft")||0,10)-parseInt(self.currentItem.css("paddingRight")||0,10))
}}}
}self.placeholder=$(o.placeholder.element.call(self.element,self.currentItem));
self.currentItem.after(self.placeholder);
o.placeholder.update(self,self.placeholder)
},_contactContainers:function(event){var innermostContainer=null,innermostIndex=null;
for(var i=this.containers.length-1;
i>=0;
i--){if($.ui.contains(this.currentItem[0],this.containers[i].element[0])){continue
}if(this._intersectsWith(this.containers[i].containerCache)){if(innermostContainer&&$.ui.contains(this.containers[i].element[0],innermostContainer.element[0])){continue
}innermostContainer=this.containers[i];
innermostIndex=i
}else{if(this.containers[i].containerCache.over){this.containers[i]._trigger("out",event,this._uiHash(this));
this.containers[i].containerCache.over=0
}}}if(!innermostContainer){return
}if(this.containers.length===1){this.containers[innermostIndex]._trigger("over",event,this._uiHash(this));
this.containers[innermostIndex].containerCache.over=1
}else{if(this.currentContainer!=this.containers[innermostIndex]){var dist=10000;
var itemWithLeastDistance=null;
var base=this.positionAbs[this.containers[innermostIndex].floating?"left":"top"];
for(var j=this.items.length-1;
j>=0;
j--){if(!$.ui.contains(this.containers[innermostIndex].element[0],this.items[j].item[0])){continue
}var cur=this.items[j][this.containers[innermostIndex].floating?"left":"top"];
if(Math.abs(cur-base)<dist){dist=Math.abs(cur-base);
itemWithLeastDistance=this.items[j]
}}if(!itemWithLeastDistance&&!this.options.dropOnEmpty){return
}this.currentContainer=this.containers[innermostIndex];
itemWithLeastDistance?this._rearrange(event,itemWithLeastDistance,null,true):this._rearrange(event,null,this.containers[innermostIndex].element,true);
this._trigger("change",event,this._uiHash());
this.containers[innermostIndex]._trigger("change",event,this._uiHash(this));
this.options.placeholder.update(this.currentContainer,this.placeholder);
this.containers[innermostIndex]._trigger("over",event,this._uiHash(this));
this.containers[innermostIndex].containerCache.over=1
}}},_createHelper:function(event){var o=this.options;
var helper=$.isFunction(o.helper)?$(o.helper.apply(this.element[0],[event,this.currentItem])):(o.helper=="clone"?this.currentItem.clone():this.currentItem);
if(!helper.parents("body").length){$(o.appendTo!="parent"?o.appendTo:this.currentItem[0].parentNode)[0].appendChild(helper[0])
}if(helper[0]==this.currentItem[0]){this._storedCSS={width:this.currentItem[0].style.width,height:this.currentItem[0].style.height,position:this.currentItem.css("position"),top:this.currentItem.css("top"),left:this.currentItem.css("left")}
}if(helper[0].style.width==""||o.forceHelperSize){helper.width(this.currentItem.width())
}if(helper[0].style.height==""||o.forceHelperSize){helper.height(this.currentItem.height())
}return helper
},_adjustOffsetFromHelper:function(obj){if(typeof obj=="string"){obj=obj.split(" ")
}if($.isArray(obj)){obj={left:+obj[0],top:+obj[1]||0}
}if("left" in obj){this.offset.click.left=obj.left+this.margins.left
}if("right" in obj){this.offset.click.left=this.helperProportions.width-obj.right+this.margins.left
}if("top" in obj){this.offset.click.top=obj.top+this.margins.top
}if("bottom" in obj){this.offset.click.top=this.helperProportions.height-obj.bottom+this.margins.top
}},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();
var po=this.offsetParent.offset();
if(this.cssPosition=="absolute"&&this.scrollParent[0]!=document&&$.ui.contains(this.scrollParent[0],this.offsetParent[0])){po.left+=this.scrollParent.scrollLeft();
po.top+=this.scrollParent.scrollTop()
}if((this.offsetParent[0]==document.body)||(this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&$.browser.msie)){po={top:0,left:0}
}return{top:po.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:po.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}
},_getRelativeOffset:function(){if(this.cssPosition=="relative"){var p=this.currentItem.position();
return{top:p.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:p.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}
}else{return{top:0,left:0}
}},_cacheMargins:function(){this.margins={left:(parseInt(this.currentItem.css("marginLeft"),10)||0),top:(parseInt(this.currentItem.css("marginTop"),10)||0)}
},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}
},_setContainment:function(){var o=this.options;
if(o.containment=="parent"){o.containment=this.helper[0].parentNode
}if(o.containment=="document"||o.containment=="window"){this.containment=[0-this.offset.relative.left-this.offset.parent.left,0-this.offset.relative.top-this.offset.parent.top,$(o.containment=="document"?document:window).width()-this.helperProportions.width-this.margins.left,($(o.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top]
}if(!(/^(document|window|parent)$/).test(o.containment)){var ce=$(o.containment)[0];
var co=$(o.containment).offset();
var over=($(ce).css("overflow")!="hidden");
this.containment=[co.left+(parseInt($(ce).css("borderLeftWidth"),10)||0)+(parseInt($(ce).css("paddingLeft"),10)||0)-this.margins.left,co.top+(parseInt($(ce).css("borderTopWidth"),10)||0)+(parseInt($(ce).css("paddingTop"),10)||0)-this.margins.top,co.left+(over?Math.max(ce.scrollWidth,ce.offsetWidth):ce.offsetWidth)-(parseInt($(ce).css("borderLeftWidth"),10)||0)-(parseInt($(ce).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,co.top+(over?Math.max(ce.scrollHeight,ce.offsetHeight):ce.offsetHeight)-(parseInt($(ce).css("borderTopWidth"),10)||0)-(parseInt($(ce).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top]
}},_convertPositionTo:function(d,pos){if(!pos){pos=this.position
}var mod=d=="absolute"?1:-1;
var o=this.options,scroll=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&$.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,scrollIsRootNode=(/(html|body)/i).test(scroll[0].tagName);
return{top:(pos.top+this.offset.relative.top*mod+this.offset.parent.top*mod-($.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():(scrollIsRootNode?0:scroll.scrollTop()))*mod)),left:(pos.left+this.offset.relative.left*mod+this.offset.parent.left*mod-($.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():scrollIsRootNode?0:scroll.scrollLeft())*mod))}
},_generatePosition:function(event){var o=this.options,scroll=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&$.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,scrollIsRootNode=(/(html|body)/i).test(scroll[0].tagName);
if(this.cssPosition=="relative"&&!(this.scrollParent[0]!=document&&this.scrollParent[0]!=this.offsetParent[0])){this.offset.relative=this._getRelativeOffset()
}var pageX=event.pageX;
var pageY=event.pageY;
if(this.originalPosition){if(this.containment){if(event.pageX-this.offset.click.left<this.containment[0]){pageX=this.containment[0]+this.offset.click.left
}if(event.pageY-this.offset.click.top<this.containment[1]){pageY=this.containment[1]+this.offset.click.top
}if(event.pageX-this.offset.click.left>this.containment[2]){pageX=this.containment[2]+this.offset.click.left
}if(event.pageY-this.offset.click.top>this.containment[3]){pageY=this.containment[3]+this.offset.click.top
}}if(o.grid){var top=this.originalPageY+Math.round((pageY-this.originalPageY)/o.grid[1])*o.grid[1];
pageY=this.containment?(!(top-this.offset.click.top<this.containment[1]||top-this.offset.click.top>this.containment[3])?top:(!(top-this.offset.click.top<this.containment[1])?top-o.grid[1]:top+o.grid[1])):top;
var left=this.originalPageX+Math.round((pageX-this.originalPageX)/o.grid[0])*o.grid[0];
pageX=this.containment?(!(left-this.offset.click.left<this.containment[0]||left-this.offset.click.left>this.containment[2])?left:(!(left-this.offset.click.left<this.containment[0])?left-o.grid[0]:left+o.grid[0])):left
}}return{top:(pageY-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+($.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():(scrollIsRootNode?0:scroll.scrollTop())))),left:(pageX-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+($.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():scrollIsRootNode?0:scroll.scrollLeft())))}
},_rearrange:function(event,i,a,hardRefresh){a?a[0].appendChild(this.placeholder[0]):i.item[0].parentNode.insertBefore(this.placeholder[0],(this.direction=="down"?i.item[0]:i.item[0].nextSibling));
this.counter=this.counter?++this.counter:1;
var self=this,counter=this.counter;
window.setTimeout(function(){if(counter==self.counter){self.refreshPositions(!hardRefresh)
}},0)
},_clear:function(event,noPropagation){this.reverting=false;
var delayedTriggers=[],self=this;
if(!this._noFinalSort&&this.currentItem.parent().length){this.placeholder.before(this.currentItem)
}this._noFinalSort=null;
if(this.helper[0]==this.currentItem[0]){for(var i in this._storedCSS){if(this._storedCSS[i]=="auto"||this._storedCSS[i]=="static"){this._storedCSS[i]=""
}}this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")
}else{this.currentItem.show()
}if(this.fromOutside&&!noPropagation){delayedTriggers.push(function(event){this._trigger("receive",event,this._uiHash(this.fromOutside))
})
}if((this.fromOutside||this.domPosition.prev!=this.currentItem.prev().not(".ui-sortable-helper")[0]||this.domPosition.parent!=this.currentItem.parent()[0])&&!noPropagation){delayedTriggers.push(function(event){this._trigger("update",event,this._uiHash())
})
}if(!$.ui.contains(this.element[0],this.currentItem[0])){if(!noPropagation){delayedTriggers.push(function(event){this._trigger("remove",event,this._uiHash())
})
}for(var i=this.containers.length-1;
i>=0;
i--){if($.ui.contains(this.containers[i].element[0],this.currentItem[0])&&!noPropagation){delayedTriggers.push((function(c){return function(event){c._trigger("receive",event,this._uiHash(this))
}
}).call(this,this.containers[i]));
delayedTriggers.push((function(c){return function(event){c._trigger("update",event,this._uiHash(this))
}
}).call(this,this.containers[i]))
}}}for(var i=this.containers.length-1;
i>=0;
i--){if(!noPropagation){delayedTriggers.push((function(c){return function(event){c._trigger("deactivate",event,this._uiHash(this))
}
}).call(this,this.containers[i]))
}if(this.containers[i].containerCache.over){delayedTriggers.push((function(c){return function(event){c._trigger("out",event,this._uiHash(this))
}
}).call(this,this.containers[i]));
this.containers[i].containerCache.over=0
}}if(this._storedCursor){$("body").css("cursor",this._storedCursor)
}if(this._storedOpacity){this.helper.css("opacity",this._storedOpacity)
}if(this._storedZIndex){this.helper.css("zIndex",this._storedZIndex=="auto"?"":this._storedZIndex)
}this.dragging=false;
if(this.cancelHelperRemoval){if(!noPropagation){this._trigger("beforeStop",event,this._uiHash());
for(var i=0;
i<delayedTriggers.length;
i++){delayedTriggers[i].call(this,event)
}this._trigger("stop",event,this._uiHash())
}return false
}if(!noPropagation){this._trigger("beforeStop",event,this._uiHash())
}this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
if(this.helper[0]!=this.currentItem[0]){this.helper.remove()
}this.helper=null;
if(!noPropagation){for(var i=0;
i<delayedTriggers.length;
i++){delayedTriggers[i].call(this,event)
}this._trigger("stop",event,this._uiHash())
}this.fromOutside=false;
return true
},_trigger:function(){if($.Widget.prototype._trigger.apply(this,arguments)===false){this.cancel()
}},_uiHash:function(inst){var self=inst||this;
return{helper:self.helper,placeholder:self.placeholder||$([]),position:self.position,originalPosition:self.originalPosition,offset:self.positionAbs,item:self.currentItem,sender:inst?inst.element:null}
}});
$.extend($.ui.sortable,{version:"1.8.16"})
})(jQuery);
(function($,undefined){var requestIndex=0;
$.widget("ui.autocomplete",{options:{appendTo:"body",autoFocus:false,delay:300,minLength:1,position:{my:"left top",at:"left bottom",collision:"none"},source:null},pending:0,_create:function(){var self=this,doc=this.element[0].ownerDocument,suppressKeyPress;
this.element.addClass("ui-autocomplete-input").attr("autocomplete","off").attr({role:"textbox","aria-autocomplete":"list","aria-haspopup":"true"}).bind("keydown.autocomplete",function(event){if(self.options.disabled||self.element.propAttr("readOnly")){return
}suppressKeyPress=false;
var keyCode=$.ui.keyCode;
switch(event.keyCode){case keyCode.PAGE_UP:self._move("previousPage",event);
break;
case keyCode.PAGE_DOWN:self._move("nextPage",event);
break;
case keyCode.UP:self._move("previous",event);
event.preventDefault();
break;
case keyCode.DOWN:self._move("next",event);
event.preventDefault();
break;
case keyCode.ENTER:case keyCode.NUMPAD_ENTER:if(self.menu.active){suppressKeyPress=true;
event.preventDefault()
}case keyCode.TAB:if(!self.menu.active){return
}self.menu.select(event);
break;
case keyCode.ESCAPE:self.element.val(self.term);
self.close(event);
break;
default:clearTimeout(self.searching);
self.searching=setTimeout(function(){if(self.term!=self.element.val()){self.selectedItem=null;
self.search(null,event)
}},self.options.delay);
break
}}).bind("keypress.autocomplete",function(event){if(suppressKeyPress){suppressKeyPress=false;
event.preventDefault()
}}).bind("focus.autocomplete",function(){if(self.options.disabled){return
}self.selectedItem=null;
self.previous=self.element.val()
}).bind("blur.autocomplete",function(event){if(self.options.disabled){return
}clearTimeout(self.searching);
self.closing=setTimeout(function(){self.close(event);
self._change(event)
},150)
});
this._initSource();
this.response=function(){return self._response.apply(self,arguments)
};
this.menu=$("<ul></ul>").addClass("ui-autocomplete").appendTo($(this.options.appendTo||"body",doc)[0]).mousedown(function(event){var menuElement=self.menu.element[0];
if(!$(event.target).closest(".ui-menu-item").length){setTimeout(function(){$(document).one("mousedown",function(event){if(event.target!==self.element[0]&&event.target!==menuElement&&!$.ui.contains(menuElement,event.target)){self.close()
}})
},1)
}setTimeout(function(){clearTimeout(self.closing)
},13)
}).menu({focus:function(event,ui){var item=ui.item.data("item.autocomplete");
if(false!==self._trigger("focus",event,{item:item})){if(/^key/.test(event.originalEvent.type)){self.element.val(item.value)
}}},selected:function(event,ui){var item=ui.item.data("item.autocomplete"),previous=self.previous;
if(self.element[0]!==doc.activeElement){self.element.focus();
self.previous=previous;
setTimeout(function(){self.previous=previous;
self.selectedItem=item
},1)
}if(false!==self._trigger("select",event,{item:item})){self.element.val(item.value)
}self.term=self.element.val();
self.close(event);
self.selectedItem=item
},blur:function(event,ui){if(self.menu.element.is(":visible")&&(self.element.val()!==self.term)){self.element.val(self.term)
}}}).zIndex(this.element.zIndex()+1).css({top:0,left:0}).hide().data("menu");
if($.fn.bgiframe){this.menu.element.bgiframe()
}},destroy:function(){this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete").removeAttr("role").removeAttr("aria-autocomplete").removeAttr("aria-haspopup");
this.menu.element.remove();
$.Widget.prototype.destroy.call(this)
},_setOption:function(key,value){$.Widget.prototype._setOption.apply(this,arguments);
if(key==="source"){this._initSource()
}if(key==="appendTo"){this.menu.element.appendTo($(value||"body",this.element[0].ownerDocument)[0])
}if(key==="disabled"&&value&&this.xhr){this.xhr.abort()
}},_initSource:function(){var self=this,array,url;
if($.isArray(this.options.source)){array=this.options.source;
this.source=function(request,response){response($.ui.autocomplete.filter(array,request.term))
}
}else{if(typeof this.options.source==="string"){url=this.options.source;
this.source=function(request,response){if(self.xhr){self.xhr.abort()
}self.xhr=$.ajax({url:url,data:request,dataType:"json",autocompleteRequest:++requestIndex,success:function(data,status){if(this.autocompleteRequest===requestIndex){response(data)
}},error:function(){if(this.autocompleteRequest===requestIndex){response([])
}}})
}
}else{this.source=this.options.source
}}},search:function(value,event){value=value!=null?value:this.element.val();
this.term=this.element.val();
if(value.length<this.options.minLength){return this.close(event)
}clearTimeout(this.closing);
if(this._trigger("search",event)===false){return
}return this._search(value)
},_search:function(value){this.pending++;
this.element.addClass("ui-autocomplete-loading");
this.source({term:value},this.response)
},_response:function(content){if(!this.options.disabled&&content&&content.length){content=this._normalize(content);
this._suggest(content);
this._trigger("open")
}else{this.close()
}this.pending--;
if(!this.pending){this.element.removeClass("ui-autocomplete-loading")
}},close:function(event){clearTimeout(this.closing);
if(this.menu.element.is(":visible")){this.menu.element.hide();
this.menu.deactivate();
this._trigger("close",event)
}},_change:function(event){if(this.previous!==this.element.val()){this._trigger("change",event,{item:this.selectedItem})
}},_normalize:function(items){if(items.length&&items[0].label&&items[0].value){return items
}return $.map(items,function(item){if(typeof item==="string"){return{label:item,value:item}
}return $.extend({label:item.label||item.value,value:item.value||item.label},item)
})
},_suggest:function(items){var ul=this.menu.element.empty().zIndex(this.element.zIndex()+1);
this._renderMenu(ul,items);
this.menu.deactivate();
this.menu.refresh();
ul.show();
this._resizeMenu();
ul.position($.extend({of:this.element},this.options.position));
if(this.options.autoFocus){this.menu.next(new $.Event("mouseover"))
}},_resizeMenu:function(){var ul=this.menu.element;
ul.outerWidth(Math.max(ul.width("").outerWidth(),this.element.outerWidth()))
},_renderMenu:function(ul,items){var self=this;
$.each(items,function(index,item){self._renderItem(ul,item)
})
},_renderItem:function(ul,item){return $("<li></li>").data("item.autocomplete",item).append($("<a></a>").text(item.label)).appendTo(ul)
},_move:function(direction,event){if(!this.menu.element.is(":visible")){this.search(null,event);
return
}if(this.menu.first()&&/^previous/.test(direction)||this.menu.last()&&/^next/.test(direction)){this.element.val(this.term);
this.menu.deactivate();
return
}this.menu[direction](event)
},widget:function(){return this.menu.element
}});
$.extend($.ui.autocomplete,{escapeRegex:function(value){return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&")
},filter:function(array,term){var matcher=new RegExp($.ui.autocomplete.escapeRegex(term),"i");
return $.grep(array,function(value){return matcher.test(value.label||value.value||value)
})
}})
}(jQuery));
(function($){$.widget("ui.menu",{_create:function(){var self=this;
this.element.addClass("ui-menu ui-widget ui-widget-content ui-corner-all").attr({role:"listbox","aria-activedescendant":"ui-active-menuitem"}).click(function(event){if(!$(event.target).closest(".ui-menu-item a").length){return
}event.preventDefault();
self.select(event)
});
this.refresh()
},refresh:function(){var self=this;
var items=this.element.children("li:not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role","menuitem");
items.children("a").addClass("ui-corner-all").attr("tabindex",-1).mouseenter(function(event){self.activate(event,$(this).parent())
}).mouseleave(function(){self.deactivate()
})
},activate:function(event,item){this.deactivate();
if(this.hasScroll()){var offset=item.offset().top-this.element.offset().top,scroll=this.element.scrollTop(),elementHeight=this.element.height();
if(offset<0){this.element.scrollTop(scroll+offset)
}else{if(offset>=elementHeight){this.element.scrollTop(scroll+offset-elementHeight+item.height())
}}}this.active=item.eq(0).children("a").addClass("ui-state-hover").attr("id","ui-active-menuitem").end();
this._trigger("focus",event,{item:item})
},deactivate:function(){if(!this.active){return
}this.active.children("a").removeClass("ui-state-hover").removeAttr("id");
this._trigger("blur");
this.active=null
},next:function(event){this.move("next",".ui-menu-item:first",event)
},previous:function(event){this.move("prev",".ui-menu-item:last",event)
},first:function(){return this.active&&!this.active.prevAll(".ui-menu-item").length
},last:function(){return this.active&&!this.active.nextAll(".ui-menu-item").length
},move:function(direction,edge,event){if(!this.active){this.activate(event,this.element.children(edge));
return
}var next=this.active[direction+"All"](".ui-menu-item").eq(0);
if(next.length){this.activate(event,next)
}else{this.activate(event,this.element.children(edge))
}},nextPage:function(event){if(this.hasScroll()){if(!this.active||this.last()){this.activate(event,this.element.children(".ui-menu-item:first"));
return
}var base=this.active.offset().top,height=this.element.height(),result=this.element.children(".ui-menu-item").filter(function(){var close=$(this).offset().top-base-height+$(this).height();
return close<10&&close>-10
});
if(!result.length){result=this.element.children(".ui-menu-item:last")
}this.activate(event,result)
}else{this.activate(event,this.element.children(".ui-menu-item").filter(!this.active||this.last()?":first":":last"))
}},previousPage:function(event){if(this.hasScroll()){if(!this.active||this.first()){this.activate(event,this.element.children(".ui-menu-item:last"));
return
}var base=this.active.offset().top,height=this.element.height();
result=this.element.children(".ui-menu-item").filter(function(){var close=$(this).offset().top-base+height-$(this).height();
return close<10&&close>-10
});
if(!result.length){result=this.element.children(".ui-menu-item:first")
}this.activate(event,result)
}else{this.activate(event,this.element.children(".ui-menu-item").filter(!this.active||this.first()?":last":":first"))
}},hasScroll:function(){return this.element.height()<this.element[$.fn.prop?"prop":"attr"]("scrollHeight")
},select:function(event){this._trigger("selected",event,{item:this.active})
}})
}(jQuery));
(function($,undefined){var numPages=5;
$.widget("ui.slider",$.ui.mouse,{widgetEventPrefix:"slide",options:{animate:false,distance:0,max:100,min:0,orientation:"horizontal",range:false,step:1,value:0,values:null},_create:function(){var self=this,o=this.options,existingHandles=this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),handle="<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>",handleCount=(o.values&&o.values.length)||1,handles=[];
this._keySliding=false;
this._mouseSliding=false;
this._animateOff=true;
this._handleIndex=null;
this._detectOrientation();
this._mouseInit();
this.element.addClass("ui-slider ui-slider-"+this.orientation+" ui-widget ui-widget-content ui-corner-all"+(o.disabled?" ui-slider-disabled ui-disabled":""));
this.range=$([]);
if(o.range){if(o.range===true){if(!o.values){o.values=[this._valueMin(),this._valueMin()]
}if(o.values.length&&o.values.length!==2){o.values=[o.values[0],o.values[0]]
}}this.range=$("<div></div>").appendTo(this.element).addClass("ui-slider-range ui-widget-header"+((o.range==="min"||o.range==="max")?" ui-slider-range-"+o.range:""))
}for(var i=existingHandles.length;
i<handleCount;
i+=1){handles.push(handle)
}this.handles=existingHandles.add($(handles.join("")).appendTo(self.element));
this.handle=this.handles.eq(0);
this.handles.add(this.range).filter("a").click(function(event){event.preventDefault()
}).hover(function(){if(!o.disabled){$(this).addClass("ui-state-hover")
}},function(){$(this).removeClass("ui-state-hover")
}).focus(function(){if(!o.disabled){$(".ui-slider .ui-state-focus").removeClass("ui-state-focus");
$(this).addClass("ui-state-focus")
}else{$(this).blur()
}}).blur(function(){$(this).removeClass("ui-state-focus")
});
this.handles.each(function(i){$(this).data("index.ui-slider-handle",i)
});
this.handles.keydown(function(event){var ret=true,index=$(this).data("index.ui-slider-handle"),allowed,curVal,newVal,step;
if(self.options.disabled){return
}switch(event.keyCode){case $.ui.keyCode.HOME:case $.ui.keyCode.END:case $.ui.keyCode.PAGE_UP:case $.ui.keyCode.PAGE_DOWN:case $.ui.keyCode.UP:case $.ui.keyCode.RIGHT:case $.ui.keyCode.DOWN:case $.ui.keyCode.LEFT:ret=false;
if(!self._keySliding){self._keySliding=true;
$(this).addClass("ui-state-active");
allowed=self._start(event,index);
if(allowed===false){return
}}break
}step=self.options.step;
if(self.options.values&&self.options.values.length){curVal=newVal=self.values(index)
}else{curVal=newVal=self.value()
}switch(event.keyCode){case $.ui.keyCode.HOME:newVal=self._valueMin();
break;
case $.ui.keyCode.END:newVal=self._valueMax();
break;
case $.ui.keyCode.PAGE_UP:newVal=self._trimAlignValue(curVal+((self._valueMax()-self._valueMin())/numPages));
break;
case $.ui.keyCode.PAGE_DOWN:newVal=self._trimAlignValue(curVal-((self._valueMax()-self._valueMin())/numPages));
break;
case $.ui.keyCode.UP:case $.ui.keyCode.RIGHT:if(curVal===self._valueMax()){return
}newVal=self._trimAlignValue(curVal+step);
break;
case $.ui.keyCode.DOWN:case $.ui.keyCode.LEFT:if(curVal===self._valueMin()){return
}newVal=self._trimAlignValue(curVal-step);
break
}self._slide(event,index,newVal);
return ret
}).keyup(function(event){var index=$(this).data("index.ui-slider-handle");
if(self._keySliding){self._keySliding=false;
self._stop(event,index);
self._change(event,index);
$(this).removeClass("ui-state-active")
}});
this._refreshValue();
this._animateOff=false
},destroy:function(){this.handles.remove();
this.range.remove();
this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-slider-disabled ui-widget ui-widget-content ui-corner-all").removeData("slider").unbind(".slider");
this._mouseDestroy();
return this
},_mouseCapture:function(event){var o=this.options,position,normValue,distance,closestHandle,self,index,allowed,offset,mouseOverHandle;
if(o.disabled){return false
}this.elementSize={width:this.element.outerWidth(),height:this.element.outerHeight()};
this.elementOffset=this.element.offset();
position={x:event.pageX,y:event.pageY};
normValue=this._normValueFromMouse(position);
distance=this._valueMax()-this._valueMin()+1;
self=this;
this.handles.each(function(i){var thisDistance=Math.abs(normValue-self.values(i));
if(distance>thisDistance){distance=thisDistance;
closestHandle=$(this);
index=i
}});
if(o.range===true&&this.values(1)===o.min){index+=1;
closestHandle=$(this.handles[index])
}allowed=this._start(event,index);
if(allowed===false){return false
}this._mouseSliding=true;
self._handleIndex=index;
closestHandle.addClass("ui-state-active").focus();
offset=closestHandle.offset();
mouseOverHandle=!$(event.target).parents().andSelf().is(".ui-slider-handle");
this._clickOffset=mouseOverHandle?{left:0,top:0}:{left:event.pageX-offset.left-(closestHandle.width()/2),top:event.pageY-offset.top-(closestHandle.height()/2)-(parseInt(closestHandle.css("borderTopWidth"),10)||0)-(parseInt(closestHandle.css("borderBottomWidth"),10)||0)+(parseInt(closestHandle.css("marginTop"),10)||0)};
if(!this.handles.hasClass("ui-state-hover")){this._slide(event,index,normValue)
}this._animateOff=true;
return true
},_mouseStart:function(event){return true
},_mouseDrag:function(event){var position={x:event.pageX,y:event.pageY},normValue=this._normValueFromMouse(position);
this._slide(event,this._handleIndex,normValue);
return false
},_mouseStop:function(event){this.handles.removeClass("ui-state-active");
this._mouseSliding=false;
this._stop(event,this._handleIndex);
this._change(event,this._handleIndex);
this._handleIndex=null;
this._clickOffset=null;
this._animateOff=false;
return false
},_detectOrientation:function(){this.orientation=(this.options.orientation==="vertical")?"vertical":"horizontal"
},_normValueFromMouse:function(position){var pixelTotal,pixelMouse,percentMouse,valueTotal,valueMouse;
if(this.orientation==="horizontal"){pixelTotal=this.elementSize.width;
pixelMouse=position.x-this.elementOffset.left-(this._clickOffset?this._clickOffset.left:0)
}else{pixelTotal=this.elementSize.height;
pixelMouse=position.y-this.elementOffset.top-(this._clickOffset?this._clickOffset.top:0)
}percentMouse=(pixelMouse/pixelTotal);
if(percentMouse>1){percentMouse=1
}if(percentMouse<0){percentMouse=0
}if(this.orientation==="vertical"){percentMouse=1-percentMouse
}valueTotal=this._valueMax()-this._valueMin();
valueMouse=this._valueMin()+percentMouse*valueTotal;
return this._trimAlignValue(valueMouse)
},_start:function(event,index){var uiHash={handle:this.handles[index],value:this.value()};
if(this.options.values&&this.options.values.length){uiHash.value=this.values(index);
uiHash.values=this.values()
}return this._trigger("start",event,uiHash)
},_slide:function(event,index,newVal){var otherVal,newValues,allowed;
if(this.options.values&&this.options.values.length){otherVal=this.values(index?0:1);
if((this.options.values.length===2&&this.options.range===true)&&((index===0&&newVal>otherVal)||(index===1&&newVal<otherVal))){newVal=otherVal
}if(newVal!==this.values(index)){newValues=this.values();
newValues[index]=newVal;
allowed=this._trigger("slide",event,{handle:this.handles[index],value:newVal,values:newValues});
otherVal=this.values(index?0:1);
if(allowed!==false){this.values(index,newVal,true)
}}}else{if(newVal!==this.value()){allowed=this._trigger("slide",event,{handle:this.handles[index],value:newVal});
if(allowed!==false){this.value(newVal)
}}}},_stop:function(event,index){var uiHash={handle:this.handles[index],value:this.value()};
if(this.options.values&&this.options.values.length){uiHash.value=this.values(index);
uiHash.values=this.values()
}this._trigger("stop",event,uiHash)
},_change:function(event,index){if(!this._keySliding&&!this._mouseSliding){var uiHash={handle:this.handles[index],value:this.value()};
if(this.options.values&&this.options.values.length){uiHash.value=this.values(index);
uiHash.values=this.values()
}this._trigger("change",event,uiHash)
}},value:function(newValue){if(arguments.length){this.options.value=this._trimAlignValue(newValue);
this._refreshValue();
this._change(null,0);
return
}return this._value()
},values:function(index,newValue){var vals,newValues,i;
if(arguments.length>1){this.options.values[index]=this._trimAlignValue(newValue);
this._refreshValue();
this._change(null,index);
return
}if(arguments.length){if($.isArray(arguments[0])){vals=this.options.values;
newValues=arguments[0];
for(i=0;
i<vals.length;
i+=1){vals[i]=this._trimAlignValue(newValues[i]);
this._change(null,i)
}this._refreshValue()
}else{if(this.options.values&&this.options.values.length){return this._values(index)
}else{return this.value()
}}}else{return this._values()
}},_setOption:function(key,value){var i,valsLength=0;
if($.isArray(this.options.values)){valsLength=this.options.values.length
}$.Widget.prototype._setOption.apply(this,arguments);
switch(key){case"disabled":if(value){this.handles.filter(".ui-state-focus").blur();
this.handles.removeClass("ui-state-hover");
this.handles.propAttr("disabled",true);
this.element.addClass("ui-disabled")
}else{this.handles.propAttr("disabled",false);
this.element.removeClass("ui-disabled")
}break;
case"orientation":this._detectOrientation();
this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-"+this.orientation);
this._refreshValue();
break;
case"value":this._animateOff=true;
this._refreshValue();
this._change(null,0);
this._animateOff=false;
break;
case"values":this._animateOff=true;
this._refreshValue();
for(i=0;
i<valsLength;
i+=1){this._change(null,i)
}this._animateOff=false;
break
}},_value:function(){var val=this.options.value;
val=this._trimAlignValue(val);
return val
},_values:function(index){var val,vals,i;
if(arguments.length){val=this.options.values[index];
val=this._trimAlignValue(val);
return val
}else{vals=this.options.values.slice();
for(i=0;
i<vals.length;
i+=1){vals[i]=this._trimAlignValue(vals[i])
}return vals
}},_trimAlignValue:function(val){if(val<=this._valueMin()){return this._valueMin()
}if(val>=this._valueMax()){return this._valueMax()
}var step=(this.options.step>0)?this.options.step:1,valModStep=(val-this._valueMin())%step,alignValue=val-valModStep;
if(Math.abs(valModStep)*2>=step){alignValue+=(valModStep>0)?step:(-step)
}return parseFloat(alignValue.toFixed(5))
},_valueMin:function(){return this.options.min
},_valueMax:function(){return this.options.max
},_refreshValue:function(){var oRange=this.options.range,o=this.options,self=this,animate=(!this._animateOff)?o.animate:false,valPercent,_set={},lastValPercent,value,valueMin,valueMax;
if(this.options.values&&this.options.values.length){this.handles.each(function(i,j){valPercent=(self.values(i)-self._valueMin())/(self._valueMax()-self._valueMin())*100;
_set[self.orientation==="horizontal"?"left":"bottom"]=valPercent+"%";
$(this).stop(1,1)[animate?"animate":"css"](_set,o.animate);
if(self.options.range===true){if(self.orientation==="horizontal"){if(i===0){self.range.stop(1,1)[animate?"animate":"css"]({left:valPercent+"%"},o.animate)
}if(i===1){self.range[animate?"animate":"css"]({width:(valPercent-lastValPercent)+"%"},{queue:false,duration:o.animate})
}}else{if(i===0){self.range.stop(1,1)[animate?"animate":"css"]({bottom:(valPercent)+"%"},o.animate)
}if(i===1){self.range[animate?"animate":"css"]({height:(valPercent-lastValPercent)+"%"},{queue:false,duration:o.animate})
}}}lastValPercent=valPercent
})
}else{value=this.value();
valueMin=this._valueMin();
valueMax=this._valueMax();
valPercent=(valueMax!==valueMin)?(value-valueMin)/(valueMax-valueMin)*100:0;
_set[self.orientation==="horizontal"?"left":"bottom"]=valPercent+"%";
this.handle.stop(1,1)[animate?"animate":"css"](_set,o.animate);
if(oRange==="min"&&this.orientation==="horizontal"){this.range.stop(1,1)[animate?"animate":"css"]({width:valPercent+"%"},o.animate)
}if(oRange==="max"&&this.orientation==="horizontal"){this.range[animate?"animate":"css"]({width:(100-valPercent)+"%"},{queue:false,duration:o.animate})
}if(oRange==="min"&&this.orientation==="vertical"){this.range.stop(1,1)[animate?"animate":"css"]({height:valPercent+"%"},o.animate)
}if(oRange==="max"&&this.orientation==="vertical"){this.range[animate?"animate":"css"]({height:(100-valPercent)+"%"},{queue:false,duration:o.animate})
}}}});
$.extend($.ui.slider,{version:"1.8.16"})
}(jQuery));
(function($){var inviewObjects={},viewportSize,viewportOffset,d=document,w=window,documentElement=d.documentElement,expando=$.expando;
$.event.special.inview={add:function(data){inviewObjects[data.guid+"-"+this[expando]]={data:data,$element:$(this)}
},remove:function(data){try{delete inviewObjects[data.guid+"-"+this[expando]]
}catch(e){}}};
function getViewportSize(){var mode,domObject,size={height:w.innerHeight,width:w.innerWidth};
if(!size.height){mode=d.compatMode;
if(mode||!$.support.boxModel){domObject=mode==="CSS1Compat"?documentElement:d.body;
size={height:domObject.clientHeight,width:domObject.clientWidth}
}}return size
}function getViewportOffset(){return{top:w.pageYOffset||documentElement.scrollTop||d.body.scrollTop,left:w.pageXOffset||documentElement.scrollLeft||d.body.scrollLeft}
}function checkInView(){var $elements=$(),elementsLength,i=0;
$.each(inviewObjects,function(i,inviewObject){var selector=inviewObject.data.selector,$element=inviewObject.$element;
$elements=$elements.add(selector?$element.find(selector):$element)
});
elementsLength=$elements.length;
if(elementsLength){viewportSize=viewportSize||getViewportSize();
viewportOffset=viewportOffset||getViewportOffset();
for(;
i<elementsLength;
i++){if(!$.contains(documentElement,$elements[i])){continue
}var $element=$($elements[i]),elementSize={height:$element.height(),width:$element.width()},elementOffset=$element.offset(),inView=$element.data("inview"),visiblePartX,visiblePartY,visiblePartsMerged;
if(!viewportOffset||!viewportSize){return
}if(elementOffset.top+elementSize.height>viewportOffset.top&&elementOffset.top<viewportOffset.top+viewportSize.height&&elementOffset.left+elementSize.width>viewportOffset.left&&elementOffset.left<viewportOffset.left+viewportSize.width){visiblePartX=(viewportOffset.left>elementOffset.left?"right":(viewportOffset.left+viewportSize.width)<(elementOffset.left+elementSize.width)?"left":"both");
visiblePartY=(viewportOffset.top>elementOffset.top?"bottom":(viewportOffset.top+viewportSize.height)<(elementOffset.top+elementSize.height)?"top":"both");
visiblePartsMerged=visiblePartX+"-"+visiblePartY;
if(!inView||inView!==visiblePartsMerged){$element.data("inview",visiblePartsMerged).trigger("inview",[true,visiblePartX,visiblePartY])
}}else{if(inView){$element.data("inview",false).trigger("inview",[false])
}}}}}$(w).bind("scroll resize",function(){viewportSize=viewportOffset=null
});
setInterval(checkInView,250)
})(jQuery);
(function($,e,b){var c="hashchange",h=document,f,g=$.event.special,i=h.documentMode,d="on"+c in e&&(i===b||i>7);
function a(j){j=j||location.href;
return"#"+j.replace(/^[^#]*#?(.*)$/,"$1")
}$.fn[c]=function(j){return j?this.bind(c,j):this.trigger(c)
};
$.fn[c].delay=50;
g[c]=$.extend(g[c],{setup:function(){if(d){return false
}$(f.start)
},teardown:function(){if(d){return false
}$(f.stop)
}});
f=(function(){var j={},p,m=a(),k=function(q){return q
},l=k,o=k;
j.start=function(){p||n()
};
j.stop=function(){p&&clearTimeout(p);
p=b
};
function n(){var r=a(),q=o(m);
if(r!==m){l(m=r,q);
$(e).trigger(c)
}else{if(q!==m){location.href=location.href.replace(/#.*/,"")+q
}}p=setTimeout(n,$.fn[c].delay)
}$.browser.msie&&!d&&(function(){var q,r;
j.start=function(){if(!q){r=$.fn[c].src;
r=r&&r+a();
q=$('<iframe tabindex="-1" title="empty"/>').hide().one("load",function(){r||l(a());
n()
}).attr("src",r||"javascript:0").insertAfter("body")[0].contentWindow;
h.onpropertychange=function(){try{if(event.propertyName==="title"){q.document.title=h.title
}}catch(s){}}
}};
j.stop=k;
o=function(){return a(q.location.href)
};
l=function(v,s){var u=q.document,t=$.fn[c].domain;
if(v!==s){u.title=h.title;
u.open();
t&&u.write('<script>document.domain="'+t+'"<\/script>');
u.close();
q.location.hash=v
}}
})();
return j
})()
})(jQuery,this);
(function($) {

	/**
	 * Spoofs placeholders in browsers that don't support them (eg Firefox 3)
	 * 
	 * Copyright 2011 Dan Bentley
	 * Licensed under the Apache License 2.0
	 *
	 * Author: Dan Bentley [github.com/danbentley]
	 */

	// Return if native support is available.
	if ("placeholder" in document.createElement("input")) return;

	$(document).ready(function(){
		$(':input[placeholder]').not(':password').each(function() {
			setupPlaceholder($(this));
		});

		$(':password[placeholder]').each(function() {
			setupPasswords($(this));
		});
	   
		$('form').submit(function(e) {
			clearPlaceholdersBeforeSubmit($(this));
		});
	});

	function setupPlaceholder(input) {

		var placeholderText = input.attr('placeholder');

		setPlaceholderOrFlagChanged(input, placeholderText);
		input.focus(function(e) {
			if (input.data('changed') === true) return;
			if (input.val() === placeholderText) input.val('');
		}).blur(function(e) {
			if (input.val() === '') input.val(placeholderText); 
		}).change(function(e) {
			input.data('changed', input.val() !== '');
		});
	}

	function setPlaceholderOrFlagChanged(input, text) {
		(input.val() === '') ? input.val(text) : input.data('changed', true);
	}

	function setupPasswords(input) {
		var passwordPlaceholder = createPasswordPlaceholder(input);
		input.after(passwordPlaceholder);

		(input.val() === '') ? input.hide() : passwordPlaceholder.hide();

		$(input).blur(function(e) {
			if (input.val() !== '') return;
			input.hide();
			passwordPlaceholder.show();
		});
			
		$(passwordPlaceholder).focus(function(e) {
			input.show().focus();
			passwordPlaceholder.hide();
		});
	}

	function createPasswordPlaceholder(input) {
		return $('<input>').attr({
			placeholder: input.attr('placeholder'),
			value: input.attr('placeholder'),
			id: input.attr('id'),
			readonly: true
		}).addClass(input.attr('class'));
	}

	function clearPlaceholdersBeforeSubmit(form) {
		form.find(':input[placeholder]').each(function() {
			if ($(this).data('changed') === true) return;
			if ($(this).val() === $(this).attr('placeholder')) $(this).val('');
		});
	}
})(jQuery);

/*!

    Copyright (c) 2011 Peter van der Spek

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
    
 */


(function($) {

    /**
     * Hash containing mapping of selectors to settings hashes for target selectors that should be live updated.
     *
     * @type {Object.<string, Object>}
     * @private
     */
    var liveUpdatingTargetSelectors = {};

    /**
     * Interval ID for live updater. Contains interval ID when the live updater interval is active, or is undefined
     * otherwise.
     *
     * @type {number}
     * @private
     */
    var liveUpdaterIntervalId;

    /**
     * Boolean indicating whether the live updater is running.
     *
     * @type {boolean}
     * @private
     */
    var liveUpdaterRunning = false;

    /**
     * Set of default settings.
     *
     * @type {Object.<string, string>}
     * @private
     */
    var defaultSettings = {
                ellipsis: '...',
                setTitle: 'never',
                live: false
            };

    /**
     * Perform ellipsis on selected elements.
     *
     * @param {string} selector the inner selector of elements that ellipsis may work on. Inner elements not referred to by this
     *      selector are left untouched.
     * @param {Object.<string, string>=} options optional options to override default settings.
     * @return {jQuery} the current jQuery object for chaining purposes.
     * @this {jQuery} the current jQuery object.
     */
    $.fn.ellipsis = function(selector, options) {
        var subjectElements, settings;

        subjectElements = $(this);

        // Check for options argument only.
        if (typeof selector !== 'string') {
            options = selector;
            selector = undefined;
        }

        // Create the settings from the given options and the default settings.
        settings = $.extend({}, defaultSettings, options);

        // If selector is not set, work on immediate children (default behaviour).
        settings.selector = selector;

        // Do ellipsis on each subject element.
        subjectElements.each(function() {
            var elem = $(this);

            // Do ellipsis on subject element.
            ellipsisOnElement(elem, settings);
        });

        // If live option is enabled, add subject elements to live updater. Otherwise remove from live updater.
        if (settings.live) {
            addToLiveUpdater(subjectElements.selector, settings);

        } else {
            removeFromLiveUpdater(subjectElements.selector);
        }

        // Return jQuery object for chaining.
        return this;
    };


    /**
     * Perform ellipsis on the given container.
     *
     * @param {jQuery} containerElement jQuery object containing one DOM element to perform ellipsis on.
     * @param {Object.<string, string>} settings the settings for this ellipsis operation.
     * @private
     */
    function ellipsisOnElement(containerElement, settings) {
        var containerData = containerElement.data('jqae');
        if (!containerData) containerData = {};

        // Check if wrapper div was already created and bound to the container element.
        var wrapperElement = containerData.wrapperElement;

        // If not, create wrapper element.
        if (!wrapperElement) {
            wrapperElement = containerElement.wrapInner('<div/>').find('>div');
        }

        // Check if the original wrapper element content was already bound to the wrapper element.
        var wrapperElementData = wrapperElement.data('jqae');
        if (!wrapperElementData) wrapperElementData = {};

        var wrapperOriginalContent = wrapperElementData.originalContent;

        // If so, clone the original content, re-bind the original wrapper content to the clone, and replace the
        // wrapper with the clone.
        if (wrapperOriginalContent) {
            wrapperElement = wrapperElementData.originalContent.clone(true)
                    .data('jqae', {originalContent: wrapperOriginalContent}).replaceAll(wrapperElement);

        } else {
            // Otherwise, clone the current wrapper element and bind it as original content to the wrapper element.

            wrapperElement.data('jqae', {originalContent: wrapperElement.clone(true)});
        }

        // Bind the wrapper element and current container width and height to the container element. Current container
        // width and height are stored to detect changes to the container size.
        containerElement.data('jqae', {
            wrapperElement: wrapperElement,
            containerWidth: containerElement.innerWidth(),
            containerHeight: containerElement.innerHeight()
        });


        // Normally the ellipsis characters are applied to the last non-empty text-node in the selected element. If the
        // selected element becomes empty during ellipsis iteration, the ellipsis characters cannot be applied to that
        // selected element, and must be deferred to the previous selected element. This parameter keeps track of that.
        var deferAppendEllipsis = false;

        // Loop through all selected elements in reverse order.
        var selectedElements = wrapperElement;
        if (settings.selector) selectedElements = $(wrapperElement.find(settings.selector).get().reverse());

        selectedElements.each(function() {
            var selectedElement = $(this),
                    originalText = selectedElement.text(),
                    ellipsisApplied = false;

            // Check if we can safely remove the selected element. This saves a lot of unnecessary iterations.
            if (wrapperElement.innerHeight() - selectedElement.innerHeight() > containerElement.innerHeight()) {
                selectedElement.remove();

            } else {
                // Reverse recursively remove empty elements, until the element that contains a non-empty text-node.
                removeLastEmptyElements(selectedElement);

                // If the selected element has not become empty, start ellipsis iterations on the selected element.
                if (selectedElement.contents().length) {

                    // If a deffered ellipsis is still pending, apply it now to the last text-node.
                    if (deferAppendEllipsis) {
                        getLastTextNode(selectedElement).get(0).nodeValue += settings.ellipsis;
                        deferAppendEllipsis = false;
                    }

                    // Iterate until wrapper element height is less than or equal to the container element height.
                    while (wrapperElement.innerHeight() > containerElement.innerHeight()) {
                        // Apply ellipsis on last text node, by removing one word.
                        ellipsisApplied = ellipsisOnLastTextNode(selectedElement);

                        // If ellipsis was succesfully applied, remove any remaining empty last elements and append the
                        // ellipsis characters.
                        if (ellipsisApplied) {
                            removeLastEmptyElements(selectedElement);

                            // If the selected element is not empty, append the ellipsis characters.
                            if (selectedElement.contents().length) {
                                getLastTextNode(selectedElement).get(0).nodeValue += settings.ellipsis;

                            } else {
                                // If the selected element has become empty, defer the appending of the ellipsis characters
                                // to the previous selected element.
                                deferAppendEllipsis = true;
                                selectedElement.remove();
                                break;
                            }

                        } else {
                            // If ellipsis could not be applied, defer the appending of the ellipsis characters to the
                            // previous selected element.
                            deferAppendEllipsis = true;
                            selectedElement.remove();
                            break;
                        }
                    }

                    // If the "setTitle" property is set to "onEllipsis" and the ellipsis has been applied, or if the
                    // property is set to "always", the add the "title" attribute with the original text. Else remove the
                    // "title" attribute. When the "setTitle" property is set to "never" we do not touch the "title"
                    // attribute.
                    if (((settings.setTitle == 'onEllipsis') && ellipsisApplied) || (settings.setTitle == 'always')) {
                        selectedElement.attr('title', originalText);

                    } else if (settings.setTitle != 'never') {
                        selectedElement.removeAttr('title');
                    }
                }
            }
        });
    }

    /**
     * Performs ellipsis on the last text node of the given element. Ellipsis is done by removing a full word.
     *
     * @param {jQuery} element jQuery object containing a single DOM element.
     * @return {boolean} true when ellipsis has been done, false otherwise.
     * @private
     */
    function ellipsisOnLastTextNode(element) {
        var lastTextNode = getLastTextNode(element);

        // If the last text node is found, do ellipsis on that node.
        if (lastTextNode.length) {
            var text = lastTextNode.get(0).nodeValue;

            // Find last space character, and remove text from there. If no space is found the full remaining text is
            // removed.
            var pos = text.lastIndexOf(' ');
            if (pos > -1) {
                text = $.trim(text.substring(0, pos));
                lastTextNode.get(0).nodeValue = text;

            } else {
                lastTextNode.get(0).nodeValue = '';
            }

            return true;
        }

        return false;
    }

    /**
     * Get last text node of the given element.
     *
     * @param {jQuery} element jQuery object containing a single element.
     * @return {jQuery} jQuery object containing a single text node.
     * @private
     */
    function getLastTextNode(element) {
        if (element.contents().length) {

            // Get last child node.
            var contents = element.contents();
            var lastNode = contents.eq(contents.length - 1);

            // If last node is a text node, return it.
            if (lastNode.filter(textNodeFilter).length) {
                return lastNode;

            } else {
                // Else it is an element node, and we recurse into it.

                return getLastTextNode(lastNode);
            }

        } else {
            // If there is no last child node, we append an empty text node and return that. Normally this should not
            // happen, as we test for emptiness before calling getLastTextNode.

            element.append('');
            var contents = element.contents();
            return contents.eq(contents.length - 1);
        }
    }

    /**
     * Remove last empty elements. This is done recursively until the last element contains a non-empty text node.
     *
     * @param {jQuery} element jQuery object containing a single element.
     * @return {boolean} true when elements have been removed, false otherwise.
     * @private
     */
    function removeLastEmptyElements(element) {
        if (element.contents().length) {

            // Get last child node.
            var contents = element.contents();
            var lastNode = contents.eq(contents.length - 1);

            // If last child node is a text node, check for emptiness.
            if (lastNode.filter(textNodeFilter).length) {
                var text = lastNode.get(0).nodeValue;
                text = $.trim(text);

                if (text == '') {
                    // If empty, remove the text node.
                    lastNode.remove();

                    return true;

                } else {
                    return false;
                }

            } else {
                // If the last child node is an element node, remove the last empty child nodes on that node.
                while (removeLastEmptyElements(lastNode)) {
                }

                // If the last child node contains no more child nodes, remove the last child node.
                if (lastNode.contents().length) {
                    return false;

                } else {
                    lastNode.remove();

                    return true;
                }
            }
        }   

        return false;
    }

    /**
     * Filter for testing on text nodes.
     *
     * @return {boolean} true when this node is a text node, false otherwise.
     * @this {Node}
     * @private
     */
    function textNodeFilter() {
        return this.nodeType === 3;
    }

    /**
     * Add target selector to hash of target selectors. If this is the first target selector added, start the live
     * updater.
     *
     * @param {string} targetSelector the target selector to run the live updater for.
     * @param {Object.<string, string>} settings the settings to apply on this target selector.
     * @private
     */
    function addToLiveUpdater(targetSelector, settings) {
        // Store target selector with its settings.
        liveUpdatingTargetSelectors[targetSelector] = settings;

        // If the live updater has not yet been started, start it now.
        if (!liveUpdaterIntervalId) {
            liveUpdaterIntervalId = window.setInterval(function() {
                doLiveUpdater();
            }, 200);
        }
    }

    /**
     * Remove the target selector from the hash of target selectors. It this is the last remaining target selector
     * being removed, stop the live updater.
     *
     * @param {string} targetSelector the target selector to stop running the live updater for.
     * @private
     */
    function removeFromLiveUpdater(targetSelector) {
        // If the hash contains the target selector, remove it.
        if (liveUpdatingTargetSelectors[targetSelector]) {
            delete liveUpdatingTargetSelectors[targetSelector];

            // If no more target selectors are in the hash, stop the live updater.
            if (!liveUpdatingTargetSelectors.length) {
                if (liveUpdaterIntervalId) {
                    window.clearInterval(liveUpdaterIntervalId);
                    liveUpdaterIntervalId = undefined;
                }
            }
        }
    };

    /**
     * Run the live updater. The live updater is periodically run to check if its monitored target selectors require
     * re-applying of the ellipsis.
     *
     * @private
     */
    function doLiveUpdater() {
        // If the live updater is already running, skip this time. We only want one instance running at a time.
        if (!liveUpdaterRunning) {
            liveUpdaterRunning = true;

            // Loop through target selectors.
            for (var targetSelector in liveUpdatingTargetSelectors) {
                $(targetSelector).each(function() {
                    var containerElement, containerData;

                    containerElement = $(this);
                    containerData = containerElement.data('jqae');

                    // If container element dimensions have changed, or the container element is new, run ellipsis on
                    // that container element.
                    if ((containerData.containerWidth != containerElement.innerWidth()) ||
                            (containerData.containerHeight != containerElement.innerHeight())) {
                        ellipsisOnElement(containerElement, liveUpdatingTargetSelectors[targetSelector]);
                    }
                });
            }

            liveUpdaterRunning = false;
        }
    };

})(jQuery);
(function($){$.fn.loader=function(settings){function updateSize(loader){var height=loader.options.location==="outer"?loader.target.outerHeight():loader.target.innerHeight(),width=loader.options.location==="outer"?loader.target.outerWidth():loader.target.innerWidth();
if(height<loader.options.minheight){height=loader.options.minheight
}if(width<loader.options.minwidth){width=loader.options.minwidth
}loader.$.css({height:height+"px",width:width+"px"})
}function buildLoaderElement(loader){var ldr=$(loader.options.element[loader.options.step]).addClass("loading-wrapper").css({background:"#1e1e1e",filter:"alpha(opacity=80)","z-index":"8990"});
if($("html").hasClass("rgba")){ldr.css("background","rgba(30,30,30,.8)")
}if(loader.options.elementClass){ldr.addClass(loader.options.elementClass)
}return ldr
}function setPosition(itm){var oldposition=itm.css("position");
itm.data("oldposition",oldposition);
if(oldposition==="static"||oldposition===""){itm.css("position","relative")
}}function restorePosition(itm){var oldposition=itm.data("oldposition");
itm.css("position",oldposition)
}var defaults={element:{append:"<div/>",overlay:"<div/>",insert:"<div/>"},target:null,img:{src:"/etc/designs/orion/upc/nl/img/ui/ajax-loader.gif",top:null,left:null},location:"outer",flow:[],height:null,width:null,minheight:16,minwidth:11,onloading:function(loader){var $this=$(loader),$target,oldposition,position={position:"relative",left:0,top:0};
loader.target=$target=loader.options.target?$this.find(loader.options.target):$this;
loader.$=buildLoaderElement(loader);
if(loader.options.step==="append"){setPosition($(loader));
updateSize(loader);
loader.$.css($.extend({},position));
$(loader).append(loader.$.html(loader.$img))
}else{if(loader.options.step==="overlay"){setPosition($(loader));
updateSize(loader);
loader.$.css({position:"absolute",top:parseInt(loader.target.position().top,10)+"px",left:parseInt(loader.target.position().left,10)+"px"});
$(loader).append(loader.$.html(loader.$img))
}else{if(loader.options.step=="insert"){setPosition(loader.target);
loader.$.css({height:loader.options.minheight+"px",width:loader.options.minwidth+"px"});
loader.target.append(loader.$.html(loader.$img))
}}}},onloaded:function(loader){var updateProgress;
loader.$.remove();
loader.target.css("position",loader.target.data("oldposition"));
updateProgress=!!(loader.options.progress<loader.options.flow.length-1);
if(updateProgress){loader.options.progress=loader.options.progress+1;
loader.options.step=loader.options.flow[loader.options.progress]
}},oncancelled:function(loader){loader.$.remove();
loader.target.css("position",loader.target.data("oldposition"))
}};
return this.each(function(){var loader=this;
var $this=$(loader);
var $target,$img,oldposition,$loader;
loader.options={step:null,progress:0};
if(settings){$.extend(true,loader.options,defaults,settings);
loader.options.step=loader.options.flow[loader.options.progress]
}loader.target=$target=loader.options.target?$this.find(loader.options.target):$this;
loader.$img=$img=$("<img/>",{src:loader.options.img.src}).css({position:"absolute",left:loader.options.img.left||"50%",top:loader.options.img.top||"50%"}).load(function(){var $i=$(this),offsetTop=$i.height()/2,offsetLeft=$i.width()/2;
$i.css({"margin-top":-offsetTop+"px","margin-left":-offsetLeft+"px"})
});
loader.$=$loader=buildLoaderElement(loader);
if($this.data("events")&&$this.data("events").loading){return
}$this.bind("loading",function(e){e.stopPropagation();
loader.options.onloading.call(e,loader)
}).bind("loaded",function(e){e.stopPropagation();
loader.options.onloaded.call(e,loader)
}).bind("loadcancelled",function(e){e.stopPropagation();
loader.options.oncancelled.call(e,loader)
})
})
}
})(jQuery);
/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */
var Mustache;
(function(exports){if(typeof module!=="undefined"){module.exports=exports
}else{if(typeof define==="function"){define(exports)
}else{Mustache=exports
}}}(function(){var exports={};
exports.name="mustache.js";
exports.version="0.5.1-dev";
exports.tags=["{{","}}"];
exports.parse=parse;
exports.clearCache=clearCache;
exports.compile=compile;
exports.compilePartial=compilePartial;
exports.render=render;
exports.Scanner=Scanner;
exports.Context=Context;
exports.Renderer=Renderer;
exports.to_html=function(template,view,partials,send){var result=render(template,view,partials);
if(typeof send==="function"){send(result)
}else{return result
}};
var whiteRe=/\s*/;
var spaceRe=/\s+/;
var nonSpaceRe=/\S/;
var eqRe=/\s*=/;
var curlyRe=/\s*\}/;
var tagRe=/#|\^|\/|>|\{|&|=|!/;
function testRe(re,string){return RegExp.prototype.test.call(re,string)
}function isWhitespace(string){return !testRe(nonSpaceRe,string)
}var isArray=Array.isArray||function(obj){return Object.prototype.toString.call(obj)==="[object Array]"
};
var jsCharsRe=/[\x00-\x2F\x3A-\x40\x5B-\x60\x7B-\xFF\u2028\u2029]/gm;
function quote(text){var escaped=text.replace(jsCharsRe,function(c){return"\\u"+("0000"+c.charCodeAt(0).toString(16)).slice(-4)
});
return'"'+escaped+'"'
}function escapeRe(string){return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")
}var entityMap={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;"};
function escapeHtml(string){return String(string).replace(/[&<>"'\/]/g,function(s){return entityMap[s]
})
}exports.isWhitespace=isWhitespace;
exports.isArray=isArray;
exports.quote=quote;
exports.escapeRe=escapeRe;
exports.escapeHtml=escapeHtml;
function Scanner(string){this.string=string;
this.tail=string;
this.pos=0
}Scanner.prototype.eos=function(){return this.tail===""
};
Scanner.prototype.scan=function(re){var match=this.tail.match(re);
if(match&&match.index===0){this.tail=this.tail.substring(match[0].length);
this.pos+=match[0].length;
return match[0]
}return null
};
Scanner.prototype.scanUntil=function(re){var match,pos=this.tail.search(re);
switch(pos){case -1:match=this.tail;
this.pos+=this.tail.length;
this.tail="";
break;
case 0:match=null;
break;
default:match=this.tail.substring(0,pos);
this.tail=this.tail.substring(pos);
this.pos+=pos
}return match
};
function Context(view,parent){this.view=view;
this.parent=parent;
this.clearCache()
}Context.make=function(view){return(view instanceof Context)?view:new Context(view)
};
Context.prototype.clearCache=function(){this._cache={}
};
Context.prototype.push=function(view){return new Context(view,this)
};
Context.prototype.lookup=function(name){var value=this._cache[name];
if(!value){if(name==="."){value=this.view
}else{var context=this;
while(context){if(name.indexOf(".")>0){var names=name.split("."),i=0;
value=context.view;
while(value&&i<names.length){value=value[names[i++]]
}}else{value=context.view[name]
}if(value!=null){break
}context=context.parent
}}this._cache[name]=value
}if(typeof value==="function"){value=value.call(this.view)
}return value
};
function Renderer(){this.clearCache()
}Renderer.prototype.clearCache=function(){this._cache={};
this._partialCache={}
};
Renderer.prototype.compile=function(tokens,tags){if(typeof tokens==="string"){tokens=parse(tokens,tags)
}var fn=compileTokens(tokens),self=this;
return function(view){return fn(Context.make(view),self)
}
};
Renderer.prototype.compilePartial=function(name,tokens,tags){this._partialCache[name]=this.compile(tokens,tags);
return this._partialCache[name]
};
Renderer.prototype.render=function(template,view){var fn=this._cache[template];
if(!fn){fn=this.compile(template);
this._cache[template]=fn
}return fn(view)
};
Renderer.prototype._section=function(name,context,callback){var value=context.lookup(name);
switch(typeof value){case"object":if(isArray(value)){var buffer="";
for(var i=0,len=value.length;
i<len;
++i){buffer+=callback(context.push(value[i]),this)
}return buffer
}return value?callback(context.push(value),this):"";
case"function":var sectionText=callback(context,this),self=this;
var scopedRender=function(template){return self.render(template,context)
};
return value.call(context.view,sectionText,scopedRender)||"";
default:if(value){return callback(context,this)
}}return""
};
Renderer.prototype._inverted=function(name,context,callback){var value=context.lookup(name);
if(value==null||value===false||(isArray(value)&&value.length===0)){return callback(context,this)
}return""
};
Renderer.prototype._partial=function(name,context){var fn=this._partialCache[name];
if(fn){return fn(context,this)
}return""
};
Renderer.prototype._name=function(name,context,escape){var value=context.lookup(name);
if(typeof value==="function"){value=value.call(context.view)
}var string=(value==null)?"":String(value);
if(escape){return escapeHtml(string)
}return string
};
function compileTokens(tokens,returnBody){var body=['""'];
var token,method,escape;
for(var i=0,len=tokens.length;
i<len;
++i){token=tokens[i];
switch(token.type){case"#":case"^":method=(token.type==="#")?"_section":"_inverted";
body.push("r."+method+"("+quote(token.value)+", c, function (c, r) {\n  "+compileTokens(token.tokens,true)+"\n})");
break;
case"{":case"&":case"name":escape=token.type==="name"?"true":"false";
body.push("r._name("+quote(token.value)+", c, "+escape+")");
break;
case">":body.push("r._partial("+quote(token.value)+", c)");
break;
case"text":body.push(quote(token.value));
break
}}body="return "+body.join(" + ")+";";
if(returnBody){return body
}return new Function("c, r",body)
}function escapeTags(tags){if(tags.length===2){return[new RegExp(escapeRe(tags[0])+"\\s*"),new RegExp("\\s*"+escapeRe(tags[1]))]
}throw new Error("Invalid tags: "+tags.join(" "))
}function nestTokens(tokens){var tree=[];
var collector=tree;
var sections=[];
var token,section;
for(var i=0;
i<tokens.length;
++i){token=tokens[i];
switch(token.type){case"#":case"^":token.tokens=[];
sections.push(token);
collector.push(token);
collector=token.tokens;
break;
case"/":if(sections.length===0){throw new Error("Unopened section: "+token.value)
}section=sections.pop();
if(section.value!==token.value){throw new Error("Unclosed section: "+section.value)
}if(sections.length>0){collector=sections[sections.length-1].tokens
}else{collector=tree
}break;
default:collector.push(token)
}}section=sections.pop();
if(section){throw new Error("Unclosed section: "+section.value)
}return tree
}function squashTokens(tokens){var lastToken;
for(var i=0;
i<tokens.length;
++i){var token=tokens[i];
if(lastToken&&lastToken.type==="text"&&token.type==="text"){lastToken.value+=token.value;
tokens.splice(i--,1)
}else{lastToken=token
}}}function parse(template,tags){tags=tags||exports.tags;
var tagRes=escapeTags(tags);
var scanner=new Scanner(template);
var tokens=[],spaces=[],hasTag=false,nonSpace=false;
var stripSpace=function(){if(hasTag&&!nonSpace){while(spaces.length){tokens.splice(spaces.pop(),1)
}}else{spaces=[]
}hasTag=false;
nonSpace=false
};
var type,value,chr;
while(!scanner.eos()){value=scanner.scanUntil(tagRes[0]);
if(value){for(var i=0,len=value.length;
i<len;
++i){chr=value.charAt(i);
if(isWhitespace(chr)){spaces.push(tokens.length)
}else{nonSpace=true
}tokens.push({type:"text",value:chr});
if(chr==="\n"){stripSpace()
}}}if(!scanner.scan(tagRes[0])){break
}hasTag=true;
type=scanner.scan(tagRe)||"name";
scanner.scan(whiteRe);
if(type==="="){value=scanner.scanUntil(eqRe);
scanner.scan(eqRe);
scanner.scanUntil(tagRes[1])
}else{if(type==="{"){var closeRe=new RegExp("\\s*"+escapeRe("}"+tags[1]));
value=scanner.scanUntil(closeRe);
scanner.scan(curlyRe);
scanner.scanUntil(tagRes[1])
}else{value=scanner.scanUntil(tagRes[1])
}}if(!scanner.scan(tagRes[1])){throw new Error("Unclosed tag at "+scanner.pos)
}tokens.push({type:type,value:value});
if(type==="name"||type==="{"||type==="&"){nonSpace=true
}if(type==="="){tags=value.split(spaceRe);
tagRes=escapeTags(tags)
}}squashTokens(tokens);
return nestTokens(tokens)
}var _renderer=new Renderer();
function clearCache(){_renderer.clearCache()
}function compile(tokens,tags){return _renderer.compile(tokens,tags)
}function compilePartial(name,tokens,tags){return _renderer.compilePartial(name,tokens,tags)
}function render(template,view,partials){if(partials){for(var name in partials){compilePartial(name,partials[name])
}}return _renderer.render(template,view)
}return exports
}()));
var JSON;
if(!JSON){JSON={}
}(function(){function f(n){return n<10?"0"+n:n
}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null
};
String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf()
}
}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;
function quote(string){escapable.lastIndex=0;
return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];
return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)
})+'"':'"'+string+'"'
}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];
if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key)
}if(typeof rep==="function"){value=rep.call(holder,key,value)
}switch(typeof value){case"string":return quote(value);
case"number":return isFinite(value)?String(value):"null";
case"boolean":case"null":return String(value);
case"object":if(!value){return"null"
}gap+=indent;
partial=[];
if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;
for(i=0;
i<length;
i+=1){partial[i]=str(i,value)||"null"
}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";
gap=mind;
return v
}if(rep&&typeof rep==="object"){length=rep.length;
for(i=0;
i<length;
i+=1){if(typeof rep[i]==="string"){k=rep[i];
v=str(k,value);
if(v){partial.push(quote(k)+(gap?": ":":")+v)
}}}}else{for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=str(k,value);
if(v){partial.push(quote(k)+(gap?": ":":")+v)
}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";
gap=mind;
return v
}}if(typeof JSON.stringify!=="function"){JSON.stringify=function(value,replacer,space){var i;
gap="";
indent="";
if(typeof space==="number"){for(i=0;
i<space;
i+=1){indent+=" "
}}else{if(typeof space==="string"){indent=space
}}rep=replacer;
if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("JSON.stringify")
}return str("",{"":value})
}
}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){var j;
function walk(holder,key){var k,v,value=holder[key];
if(value&&typeof value==="object"){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);
if(v!==undefined){value[k]=v
}else{delete value[k]
}}}}return reviver.call(holder,key,value)
}text=String(text);
cx.lastIndex=0;
if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)
})
}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");
return typeof reviver==="function"?walk({"":j},""):j
}throw new SyntaxError("JSON.parse")
}
}}());
/*!	SWFObject v2.2 <http://code.google.com/p/swfobject/> 
	is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
var swfobject=function(){var UNDEF="undefined",OBJECT="object",SHOCKWAVE_FLASH="Shockwave Flash",SHOCKWAVE_FLASH_AX="ShockwaveFlash.ShockwaveFlash",FLASH_MIME_TYPE="application/x-shockwave-flash",EXPRESS_INSTALL_ID="SWFObjectExprInst",ON_READY_STATE_CHANGE="onreadystatechange",win=window,doc=document,nav=navigator,plugin=false,domLoadFnArr=[main],regObjArr=[],objIdArr=[],listenersArr=[],storedAltContent,storedAltContentId,storedCallbackFn,storedCallbackObj,isDomLoaded=false,isExpressInstallActive=false,dynamicStylesheet,dynamicStylesheetMedia,autoHideShow=true,ua=function(){var w3cdom=typeof doc.getElementById!=UNDEF&&typeof doc.getElementsByTagName!=UNDEF&&typeof doc.createElement!=UNDEF,u=nav.userAgent.toLowerCase(),p=nav.platform.toLowerCase(),windows=p?/win/.test(p):/win/.test(u),mac=p?/mac/.test(p):/mac/.test(u),webkit=/webkit/.test(u)?parseFloat(u.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,ie=!+"\v1",playerVersion=[0,0,0],d=null;
if(typeof nav.plugins!=UNDEF&&typeof nav.plugins[SHOCKWAVE_FLASH]==OBJECT){d=nav.plugins[SHOCKWAVE_FLASH].description;
if(d&&!(typeof nav.mimeTypes!=UNDEF&&nav.mimeTypes[FLASH_MIME_TYPE]&&!nav.mimeTypes[FLASH_MIME_TYPE].enabledPlugin)){plugin=true;
ie=false;
d=d.replace(/^.*\s+(\S+\s+\S+$)/,"$1");
playerVersion[0]=parseInt(d.replace(/^(.*)\..*$/,"$1"),10);
playerVersion[1]=parseInt(d.replace(/^.*\.(.*)\s.*$/,"$1"),10);
playerVersion[2]=/[a-zA-Z]/.test(d)?parseInt(d.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0
}}else{if(typeof win.ActiveXObject!=UNDEF){try{var a=new ActiveXObject(SHOCKWAVE_FLASH_AX);
if(a){d=a.GetVariable("$version");
if(d){ie=true;
d=d.split(" ")[1].split(",");
playerVersion=[parseInt(d[0],10),parseInt(d[1],10),parseInt(d[2],10)]
}}}catch(e){}}}return{w3:w3cdom,pv:playerVersion,wk:webkit,ie:ie,win:windows,mac:mac}
}(),onDomLoad=function(){if(!ua.w3){return
}if((typeof doc.readyState!=UNDEF&&doc.readyState=="complete")||(typeof doc.readyState==UNDEF&&(doc.getElementsByTagName("body")[0]||doc.body))){callDomLoadFunctions()
}if(!isDomLoaded){if(typeof doc.addEventListener!=UNDEF){doc.addEventListener("DOMContentLoaded",callDomLoadFunctions,false)
}if(ua.ie&&ua.win){doc.attachEvent(ON_READY_STATE_CHANGE,function(){if(doc.readyState=="complete"){doc.detachEvent(ON_READY_STATE_CHANGE,arguments.callee);
callDomLoadFunctions()
}});
if(win==top){(function(){if(isDomLoaded){return
}try{doc.documentElement.doScroll("left")
}catch(e){setTimeout(arguments.callee,0);
return
}callDomLoadFunctions()
})()
}}if(ua.wk){(function(){if(isDomLoaded){return
}if(!/loaded|complete/.test(doc.readyState)){setTimeout(arguments.callee,0);
return
}callDomLoadFunctions()
})()
}addLoadEvent(callDomLoadFunctions)
}}();
function callDomLoadFunctions(){if(isDomLoaded){return
}try{var t=doc.getElementsByTagName("body")[0].appendChild(createElement("span"));
t.parentNode.removeChild(t)
}catch(e){return
}isDomLoaded=true;
var dl=domLoadFnArr.length;
for(var i=0;
i<dl;
i++){domLoadFnArr[i]()
}}function addDomLoadEvent(fn){if(isDomLoaded){fn()
}else{domLoadFnArr[domLoadFnArr.length]=fn
}}function addLoadEvent(fn){if(typeof win.addEventListener!=UNDEF){win.addEventListener("load",fn,false)
}else{if(typeof doc.addEventListener!=UNDEF){doc.addEventListener("load",fn,false)
}else{if(typeof win.attachEvent!=UNDEF){addListener(win,"onload",fn)
}else{if(typeof win.onload=="function"){var fnOld=win.onload;
win.onload=function(){fnOld();
fn()
}
}else{win.onload=fn
}}}}}function main(){if(plugin){testPlayerVersion()
}else{matchVersions()
}}function testPlayerVersion(){var b=doc.getElementsByTagName("body")[0];
var o=createElement(OBJECT);
o.setAttribute("type",FLASH_MIME_TYPE);
var t=b.appendChild(o);
if(t){var counter=0;
(function(){if(typeof t.GetVariable!=UNDEF){var d=t.GetVariable("$version");
if(d){d=d.split(" ")[1].split(",");
ua.pv=[parseInt(d[0],10),parseInt(d[1],10),parseInt(d[2],10)]
}}else{if(counter<10){counter++;
setTimeout(arguments.callee,10);
return
}}b.removeChild(o);
t=null;
matchVersions()
})()
}else{matchVersions()
}}function matchVersions(){var rl=regObjArr.length;
if(rl>0){for(var i=0;
i<rl;
i++){var id=regObjArr[i].id;
var cb=regObjArr[i].callbackFn;
var cbObj={success:false,id:id};
if(ua.pv[0]>0){var obj=getElementById(id);
if(obj){if(hasPlayerVersion(regObjArr[i].swfVersion)&&!(ua.wk&&ua.wk<312)){setVisibility(id,true);
if(cb){cbObj.success=true;
cbObj.ref=getObjectById(id);
cb(cbObj)
}}else{if(regObjArr[i].expressInstall&&canExpressInstall()){var att={};
att.data=regObjArr[i].expressInstall;
att.width=obj.getAttribute("width")||"0";
att.height=obj.getAttribute("height")||"0";
if(obj.getAttribute("class")){att.styleclass=obj.getAttribute("class")
}if(obj.getAttribute("align")){att.align=obj.getAttribute("align")
}var par={};
var p=obj.getElementsByTagName("param");
var pl=p.length;
for(var j=0;
j<pl;
j++){if(p[j].getAttribute("name").toLowerCase()!="movie"){par[p[j].getAttribute("name")]=p[j].getAttribute("value")
}}showExpressInstall(att,par,id,cb)
}else{displayAltContent(obj);
if(cb){cb(cbObj)
}}}}}else{setVisibility(id,true);
if(cb){var o=getObjectById(id);
if(o&&typeof o.SetVariable!=UNDEF){cbObj.success=true;
cbObj.ref=o
}cb(cbObj)
}}}}}function getObjectById(objectIdStr){var r=null;
var o=getElementById(objectIdStr);
if(o&&o.nodeName=="OBJECT"){if(typeof o.SetVariable!=UNDEF){r=o
}else{var n=o.getElementsByTagName(OBJECT)[0];
if(n){r=n
}}}return r
}function canExpressInstall(){return !isExpressInstallActive&&hasPlayerVersion("6.0.65")&&(ua.win||ua.mac)&&!(ua.wk&&ua.wk<312)
}function showExpressInstall(att,par,replaceElemIdStr,callbackFn){isExpressInstallActive=true;
storedCallbackFn=callbackFn||null;
storedCallbackObj={success:false,id:replaceElemIdStr};
var obj=getElementById(replaceElemIdStr);
if(obj){if(obj.nodeName=="OBJECT"){storedAltContent=abstractAltContent(obj);
storedAltContentId=null
}else{storedAltContent=obj;
storedAltContentId=replaceElemIdStr
}att.id=EXPRESS_INSTALL_ID;
if(typeof att.width==UNDEF||(!/%$/.test(att.width)&&parseInt(att.width,10)<310)){att.width="310"
}if(typeof att.height==UNDEF||(!/%$/.test(att.height)&&parseInt(att.height,10)<137)){att.height="137"
}doc.title=doc.title.slice(0,47)+" - Flash Player Installation";
var pt=ua.ie&&ua.win?"ActiveX":"PlugIn",fv="MMredirectURL="+win.location.toString().replace(/&/g,"%26")+"&MMplayerType="+pt+"&MMdoctitle="+doc.title;
if(typeof par.flashvars!=UNDEF){par.flashvars+="&"+fv
}else{par.flashvars=fv
}if(ua.ie&&ua.win&&obj.readyState!=4){var newObj=createElement("div");
replaceElemIdStr+="SWFObjectNew";
newObj.setAttribute("id",replaceElemIdStr);
obj.parentNode.insertBefore(newObj,obj);
obj.style.display="none";
(function(){if(obj.readyState==4){obj.parentNode.removeChild(obj)
}else{setTimeout(arguments.callee,10)
}})()
}createSWF(att,par,replaceElemIdStr)
}}function displayAltContent(obj){if(ua.ie&&ua.win&&obj.readyState!=4){var el=createElement("div");
obj.parentNode.insertBefore(el,obj);
el.parentNode.replaceChild(abstractAltContent(obj),el);
obj.style.display="none";
(function(){if(obj.readyState==4){obj.parentNode.removeChild(obj)
}else{setTimeout(arguments.callee,10)
}})()
}else{obj.parentNode.replaceChild(abstractAltContent(obj),obj)
}}function abstractAltContent(obj){var ac=createElement("div");
if(ua.win&&ua.ie){ac.innerHTML=obj.innerHTML
}else{var nestedObj=obj.getElementsByTagName(OBJECT)[0];
if(nestedObj){var c=nestedObj.childNodes;
if(c){var cl=c.length;
for(var i=0;
i<cl;
i++){if(!(c[i].nodeType==1&&c[i].nodeName=="PARAM")&&!(c[i].nodeType==8)){ac.appendChild(c[i].cloneNode(true))
}}}}}return ac
}function createSWF(attObj,parObj,id){var r,el=getElementById(id);
if(ua.wk&&ua.wk<312){return r
}if(el){if(typeof attObj.id==UNDEF){attObj.id=id
}if(ua.ie&&ua.win){var att="";
for(var i in attObj){if(attObj[i]!=Object.prototype[i]){if(i.toLowerCase()=="data"){parObj.movie=attObj[i]
}else{if(i.toLowerCase()=="styleclass"){att+=' class="'+attObj[i]+'"'
}else{if(i.toLowerCase()!="classid"){att+=" "+i+'="'+attObj[i]+'"'
}}}}}var par="";
for(var j in parObj){if(parObj[j]!=Object.prototype[j]){par+='<param name="'+j+'" value="'+parObj[j]+'" />'
}}el.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+att+">"+par+"</object>";
objIdArr[objIdArr.length]=attObj.id;
r=getElementById(attObj.id)
}else{var o=createElement(OBJECT);
o.setAttribute("type",FLASH_MIME_TYPE);
for(var m in attObj){if(attObj[m]!=Object.prototype[m]){if(m.toLowerCase()=="styleclass"){o.setAttribute("class",attObj[m])
}else{if(m.toLowerCase()!="classid"){o.setAttribute(m,attObj[m])
}}}}for(var n in parObj){if(parObj[n]!=Object.prototype[n]&&n.toLowerCase()!="movie"){createObjParam(o,n,parObj[n])
}}el.parentNode.replaceChild(o,el);
r=o
}}return r
}function createObjParam(el,pName,pValue){var p=createElement("param");
p.setAttribute("name",pName);
p.setAttribute("value",pValue);
el.appendChild(p)
}function removeSWF(id){var obj=getElementById(id);
if(obj&&obj.nodeName=="OBJECT"){if(ua.ie&&ua.win){obj.style.display="none";
(function(){if(obj.readyState==4){removeObjectInIE(id)
}else{setTimeout(arguments.callee,10)
}})()
}else{obj.parentNode.removeChild(obj)
}}}function removeObjectInIE(id){var obj=getElementById(id);
if(obj){for(var i in obj){if(typeof obj[i]=="function"){obj[i]=null
}}obj.parentNode.removeChild(obj)
}}function getElementById(id){var el=null;
try{el=doc.getElementById(id)
}catch(e){}return el
}function createElement(el){return doc.createElement(el)
}function addListener(target,eventType,fn){target.attachEvent(eventType,fn);
listenersArr[listenersArr.length]=[target,eventType,fn]
}function hasPlayerVersion(rv){var pv=ua.pv,v=rv.split(".");
v[0]=parseInt(v[0],10);
v[1]=parseInt(v[1],10)||0;
v[2]=parseInt(v[2],10)||0;
return(pv[0]>v[0]||(pv[0]==v[0]&&pv[1]>v[1])||(pv[0]==v[0]&&pv[1]==v[1]&&pv[2]>=v[2]))?true:false
}function createCSS(sel,decl,media,newStyle){if(ua.ie&&ua.mac){return
}var h=doc.getElementsByTagName("head")[0];
if(!h){return
}var m=(media&&typeof media=="string")?media:"screen";
if(newStyle){dynamicStylesheet=null;
dynamicStylesheetMedia=null
}if(!dynamicStylesheet||dynamicStylesheetMedia!=m){var s=createElement("style");
s.setAttribute("type","text/css");
s.setAttribute("media",m);
dynamicStylesheet=h.appendChild(s);
if(ua.ie&&ua.win&&typeof doc.styleSheets!=UNDEF&&doc.styleSheets.length>0){dynamicStylesheet=doc.styleSheets[doc.styleSheets.length-1]
}dynamicStylesheetMedia=m
}if(ua.ie&&ua.win){if(dynamicStylesheet&&typeof dynamicStylesheet.addRule==OBJECT){dynamicStylesheet.addRule(sel,decl)
}}else{if(dynamicStylesheet&&typeof doc.createTextNode!=UNDEF){dynamicStylesheet.appendChild(doc.createTextNode(sel+" {"+decl+"}"))
}}}function setVisibility(id,isVisible){if(!autoHideShow){return
}var v=isVisible?"visible":"hidden";
if(isDomLoaded&&getElementById(id)){getElementById(id).style.visibility=v
}else{createCSS("#"+id,"visibility:"+v)
}}function urlEncodeIfNecessary(s){var regex=/[\\\"<>\.;]/;
var hasBadChars=regex.exec(s)!=null;
return hasBadChars&&typeof encodeURIComponent!=UNDEF?encodeURIComponent(s):s
}var cleanup=function(){if(ua.ie&&ua.win){window.attachEvent("onunload",function(){var ll=listenersArr.length;
for(var i=0;
i<ll;
i++){listenersArr[i][0].detachEvent(listenersArr[i][1],listenersArr[i][2])
}var il=objIdArr.length;
for(var j=0;
j<il;
j++){removeSWF(objIdArr[j])
}for(var k in ua){ua[k]=null
}ua=null;
for(var l in swfobject){swfobject[l]=null
}swfobject=null
})
}}();
return{registerObject:function(objectIdStr,swfVersionStr,xiSwfUrlStr,callbackFn){if(ua.w3&&objectIdStr&&swfVersionStr){var regObj={};
regObj.id=objectIdStr;
regObj.swfVersion=swfVersionStr;
regObj.expressInstall=xiSwfUrlStr;
regObj.callbackFn=callbackFn;
regObjArr[regObjArr.length]=regObj;
setVisibility(objectIdStr,false)
}else{if(callbackFn){callbackFn({success:false,id:objectIdStr})
}}},getObjectById:function(objectIdStr){if(ua.w3){return getObjectById(objectIdStr)
}},embedSWF:function(swfUrlStr,replaceElemIdStr,widthStr,heightStr,swfVersionStr,xiSwfUrlStr,flashvarsObj,parObj,attObj,callbackFn){var callbackObj={success:false,id:replaceElemIdStr};
if(ua.w3&&!(ua.wk&&ua.wk<312)&&swfUrlStr&&replaceElemIdStr&&widthStr&&heightStr&&swfVersionStr){setVisibility(replaceElemIdStr,false);
addDomLoadEvent(function(){widthStr+="";
heightStr+="";
var att={};
if(attObj&&typeof attObj===OBJECT){for(var i in attObj){att[i]=attObj[i]
}}att.data=swfUrlStr;
att.width=widthStr;
att.height=heightStr;
var par={};
if(parObj&&typeof parObj===OBJECT){for(var j in parObj){par[j]=parObj[j]
}}if(flashvarsObj&&typeof flashvarsObj===OBJECT){for(var k in flashvarsObj){if(typeof par.flashvars!=UNDEF){par.flashvars+="&"+k+"="+flashvarsObj[k]
}else{par.flashvars=k+"="+flashvarsObj[k]
}}}if(hasPlayerVersion(swfVersionStr)){var obj=createSWF(att,par,replaceElemIdStr);
if(att.id==replaceElemIdStr){setVisibility(replaceElemIdStr,true)
}callbackObj.success=true;
callbackObj.ref=obj
}else{if(xiSwfUrlStr&&canExpressInstall()){att.data=xiSwfUrlStr;
showExpressInstall(att,par,replaceElemIdStr,callbackFn);
return
}else{setVisibility(replaceElemIdStr,true)
}}if(callbackFn){callbackFn(callbackObj)
}})
}else{if(callbackFn){callbackFn(callbackObj)
}}},switchOffAutoHideShow:function(){autoHideShow=false
},ua:ua,getFlashPlayerVersion:function(){return{major:ua.pv[0],minor:ua.pv[1],release:ua.pv[2]}
},hasFlashPlayerVersion:hasPlayerVersion,createSWF:function(attObj,parObj,replaceElemIdStr){if(ua.w3){return createSWF(attObj,parObj,replaceElemIdStr)
}else{return undefined
}},showExpressInstall:function(att,par,replaceElemIdStr,callbackFn){if(ua.w3&&canExpressInstall()){showExpressInstall(att,par,replaceElemIdStr,callbackFn)
}},removeSWF:function(objElemIdStr){if(ua.w3){removeSWF(objElemIdStr)
}},createCSS:function(selStr,declStr,mediaStr,newStyleBoolean){if(ua.w3){createCSS(selStr,declStr,mediaStr,newStyleBoolean)
}},addDomLoadEvent:addDomLoadEvent,addLoadEvent:addLoadEvent,getQueryParamValue:function(param){var q=doc.location.search||doc.location.hash;
if(q){if(/\?/.test(q)){q=q.split("?")[1]
}if(param==null){return urlEncodeIfNecessary(q)
}var pairs=q.split("&");
for(var i=0;
i<pairs.length;
i++){if(pairs[i].substring(0,pairs[i].indexOf("="))==param){return urlEncodeIfNecessary(pairs[i].substring((pairs[i].indexOf("=")+1)))
}}}return""
},expressInstallCallback:function(){if(isExpressInstallActive){var obj=getElementById(EXPRESS_INSTALL_ID);
if(obj&&storedAltContent){obj.parentNode.replaceChild(storedAltContent,obj);
if(storedAltContentId){setVisibility(storedAltContentId,true);
if(ua.ie&&ua.win){storedAltContent.style.display="block"
}}if(storedCallbackFn){storedCallbackFn(storedCallbackObj)
}}isExpressInstallActive=false
}}}
}();
	var plugin_version;
	function checkInstall(){
            	if (pluginInstalled()){
                        //setTimeout("setupPlayer(null);", 2000);
       		}
 	}

	function pluginInstalled(){
          	var plugin;
                plugin = document.getElementById('WidevinePlugin');

              	if(plugin){
                	try{
                        	plugin_version = plugin.GetVersion();
                             	return true;
                    	}catch(e){
                            	return false;
                  	}
           	}else{
                    	return false;
             	}

  	}

	function checkFlash(){
		flash_version = widevine.flashVersion();
                if (flash_version != ""){
                        major_ver = 0;

                        if(flash_version.indexOf(",") != -1){
                                major_ver = parseInt(flash_version.split(",")[0]);
                        }else if(flash_version.indexOf(".") != -1){
                                major_ver = parseInt(flash_version.split(".")[0]);
                        }

                        if (major_ver < 10){
                                getFlashText();
                        }else{
                                checkInstall();
                        }
                }else{
                        // display place holder flash movie to player
                        dumby();
                }
	}

	function checkFFInstall(){
		// do nothing
	}

	window.onunload = checkFFInstall;

// Flash Player Version Detection - Rev 1.6
// Detect Client Browser type
// Copyright(c) 2005-2006 Adobe Macromedia Software, LLC. All rights reserved.
var isIE  = (navigator.appVersion.indexOf("MSIE") != -1) ? true : false;
var isWin = (navigator.appVersion.toLowerCase().indexOf("win") != -1) ? true : false;
var isOpera = (navigator.userAgent.indexOf("Opera") != -1) ? true : false;

function ControlVersion()
{
	var version;
	var axo;
	var e;

	// NOTE : new ActiveXObject(strFoo) throws an exception if strFoo isn't in the registry

	try {
		// version will be set for 7.X or greater players
		axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
		version = axo.GetVariable("$version");
	} catch (e) {
	}

	if (!version)
	{
		try {
			// version will be set for 6.X players only
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
			
			// installed player is some revision of 6.0
			// GetVariable("$version") crashes for versions 6.0.22 through 6.0.29,
			// so we have to be careful. 
			
			// default to the first public version
			version = "WIN 6,0,21,0";

			// throws if AllowScripAccess does not exist (introduced in 6.0r47)		
			axo.AllowScriptAccess = "always";

			// safe to call for 6.0r47 or greater
			version = axo.GetVariable("$version");

		} catch (e) {
		}
	}

	if (!version)
	{
		try {
			// version will be set for 4.X or 5.X player
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
			version = axo.GetVariable("$version");
		} catch (e) {
		}
	}

	if (!version)
	{
		try {
			// version will be set for 3.X player
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
			version = "WIN 3,0,18,0";
		} catch (e) {
		}
	}

	if (!version)
	{
		try {
			// version will be set for 2.X player
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
			version = "WIN 2,0,0,11";
		} catch (e) {
			version = -1;
		}
	}
	
	return version;
}

// JavaScript helper required to detect Flash Player PlugIn version information
function GetSwfVer(){
	// NS/Opera version >= 3 check for Flash plugin in plugin array
	var flashVer = -1;
	
	if (navigator.plugins != null && navigator.plugins.length > 0) {
		if (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]) {
			var swVer2 = navigator.plugins["Shockwave Flash 2.0"] ? " 2.0" : "";
			var flashDescription = navigator.plugins["Shockwave Flash" + swVer2].description;
			var descArray = flashDescription.split(" ");
			var tempArrayMajor = descArray[2].split(".");			
			var versionMajor = tempArrayMajor[0];
			var versionMinor = tempArrayMajor[1];
			var versionRevision = descArray[3];
			if (versionRevision == "") {
				versionRevision = descArray[4];
			}
			if (versionRevision[0] == "d") {
				versionRevision = versionRevision.substring(1);
			} else if (versionRevision[0] == "r") {
				versionRevision = versionRevision.substring(1);
				if (versionRevision.indexOf("d") > 0) {
					versionRevision = versionRevision.substring(0, versionRevision.indexOf("d"));
				}
			}
			var flashVer = versionMajor + "." + versionMinor + "." + versionRevision;
		}
	}
	// MSN/WebTV 2.6 supports Flash 4
	else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.6") != -1) flashVer = 4;
	// WebTV 2.5 supports Flash 3
	else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.5") != -1) flashVer = 3;
	// older WebTV supports Flash 2
	else if (navigator.userAgent.toLowerCase().indexOf("webtv") != -1) flashVer = 2;
	else if ( isIE && isWin && !isOpera ) {
		flashVer = ControlVersion();
	}	
	return flashVer;
}

// When called with reqMajorVer, reqMinorVer, reqRevision returns true if that version or greater is available
function DetectFlashVer(reqMajorVer, reqMinorVer, reqRevision)
{
	versionStr = GetSwfVer();
	if (versionStr == -1 ) {
		return false;
	} else if (versionStr != 0) {
		if(isIE && isWin && !isOpera) {
			// Given "WIN 2,0,0,11"
			tempArray         = versionStr.split(" "); 	// ["WIN", "2,0,0,11"]
			tempString        = tempArray[1];			// "2,0,0,11"
			versionArray      = tempString.split(",");	// ['2', '0', '0', '11']
		} else {
			versionArray      = versionStr.split(".");
		}
		var versionMajor      = versionArray[0];
		var versionMinor      = versionArray[1];
		var versionRevision   = versionArray[2];

        	// is the major.revision >= requested major.revision AND the minor version >= requested minor
		if (versionMajor > parseFloat(reqMajorVer)) {
			return true;
		} else if (versionMajor == parseFloat(reqMajorVer)) {
			if (versionMinor > parseFloat(reqMinorVer))
				return true;
			else if (versionMinor == parseFloat(reqMinorVer)) {
				if (versionRevision >= parseFloat(reqRevision))
					return true;
			}
		}
		return false;
	}
}

function AC_AddExtension(src, ext)
{
  if (src.indexOf('?') != -1)
    return src.replace(/\?/, ext+'?'); 
  else
    return src + ext;
}

function AC_Generateobj(objAttrs, params, embedAttrs) 
{ 
    var str = '';
    if (isIE && isWin && !isOpera)
    {
  		str += '<object ';
  		for (var i in objAttrs)
  			str += i + '="' + objAttrs[i] + '" ';
  		for (var i in params)
  			str += '><param name="' + i + '" value="' + params[i] + '" /> ';
  		str += '></object>';
    } else {
  		str += '<embed ';
  		for (var i in embedAttrs)
  			str += i + '="' + embedAttrs[i] + '" ';
  		str += '> </embed>';
    }

    document.write(str);
}

function AC_FL_RunContent(){
  var ret = 
    AC_GetArgs
    (  arguments, ".swf", "movie", "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"
     , "application/x-shockwave-flash"
    );
  AC_Generateobj(ret.objAttrs, ret.params, ret.embedAttrs);
}

function AC_GetArgs(args, ext, srcParamName, classid, mimeType){
  var ret = new Object();
  ret.embedAttrs = new Object();
  ret.params = new Object();
  ret.objAttrs = new Object();
  for (var i=0; i < args.length; i=i+2){
    var currArg = args[i].toLowerCase();    

    switch (currArg){	
      case "classid":
        break;
      case "pluginspage":
        ret.embedAttrs[args[i]] = args[i+1];
        break;
      case "src":
      case "movie":	
        args[i+1] = AC_AddExtension(args[i+1], ext);
        ret.embedAttrs["src"] = args[i+1];
        ret.params[srcParamName] = args[i+1];
        break;
      case "onafterupdate":
      case "onbeforeupdate":
      case "onblur":
      case "oncellchange":
      case "onclick":
      case "ondblClick":
      case "ondrag":
      case "ondragend":
      case "ondragenter":
      case "ondragleave":
      case "ondragover":
      case "ondrop":
      case "onfinish":
      case "onfocus":
      case "onhelp":
      case "onmousedown":
      case "onmouseup":
      case "onmouseover":
      case "onmousemove":
      case "onmouseout":
      case "onkeypress":
      case "onkeydown":
      case "onkeyup":
      case "onload":
      case "onlosecapture":
      case "onpropertychange":
      case "onreadystatechange":
      case "onrowsdelete":
      case "onrowenter":
      case "onrowexit":
      case "onrowsinserted":
      case "onstart":
      case "onscroll":
      case "onbeforeeditfocus":
      case "onactivate":
      case "onbeforedeactivate":
      case "ondeactivate":
      case "type":
      case "codebase":
        ret.objAttrs[args[i]] = args[i+1];
        break;
      case "id":
      case "width":
      case "height":
      case "align":
      case "vspace": 
      case "hspace":
      case "class":
      case "title":
      case "accesskey":
      case "name":
      case "tabindex":
        ret.embedAttrs[args[i]] = ret.objAttrs[args[i]] = args[i+1];
        break;
      default:
        ret.embedAttrs[args[i]] = ret.params[args[i]] = args[i+1];
    }
  }
  ret.objAttrs["classid"] = classid;
  if (mimeType) ret.embedAttrs["type"] = mimeType;
  return ret;
}



var WidevinePlugin;
var widevine = (function() {

	var debug = false;
	var debug_flags = "forceip=www.shibboleth.tv";

	// Version of plugin pointed by the installer
	var version ="5.0.0.000";
	var ie_version ="5,0,0,000";

	// Set the head end server 
	var signon_url = WVConfig.WV_SIGN_ON_URL;
	var log_url = WVConfig.WV_LOG_URL;
	var emm_url = WVConfig.WV_EMM_URL;

	// Set the portal
	var portal = WVConfig.WV_PORTAL;

	function doDetect( type, value  ) {
		//return eval( 'navigator.' + type + '.toLowerCase().indexOf("' + value + '") != -1' );
		return navigator[type].toLowerCase().indexOf(value) !== -1;
	}


	function detectMac()     { return doDetect( "platform", "mac" );}
	function detectWin32()   { return doDetect( "platform", "win32" );}
	function detectIE()      { return doDetect( "userAgent", "msie" ); }
	function detectFirefox() { return doDetect( "userAgent", "firefox" ); }
	function detectSafari()  { return doDetect( "userAgent", "safari" ); }
	function detectChrome()  { return doDetect( "userAgent", "chrome" ); }

	function detectVistaOrWindows7() {
		return doDetect( "userAgent", "windows nt 6" );
	}

	function getCookie(c_name) {
		if (document.cookie.length > 0) {
			var c_start = document.cookie.indexOf(c_name + "=");
			if (c_start!=-1) {
				c_start = c_start + c_name.length + 1;
				c_end = document.cookie.indexOf(";", c_start);
				if (c_end === -1) {
					c_end = document.cookie.length;
				}
				return unescape(document.cookie.substring(c_start,c_end))
			}
		}
		return ""
	}

	function setCookie(c_name,value,expireseconds) {
		var exdate = new Date();
		exdate.setSeconds(exdate.getSeconds() + expireseconds);
		document.cookie = c_name + "=" + escape(value) +
			((expireseconds == null) ? "" : ";expires="+exdate.toGMTString())
	}


	////////////////////////////////////////////////////////////////////////////
	// Start debug output section
	// Used to write debug information to the screen if debug variable is set
	// to true.
	// Only used by test page
	////////////////////////////////////////////////////////////////////////////

	function writeDebugCell( name, bold ) {
		if ( bold ) {
			return "<td><b>" + name + "</b></td>";
		} else {
			return "<td><s>" + name + "</s></td>";
		}
	}

	function writeDebugMimeArray( values ) {
		var value;
		var result = "";
		for ( value in values ) {
			if ( values[value] ) {
				result += "<td><table><tr><td>" +
					values[value].description +
					"</td></tr><tr><td>" +
					values[value].type +
					"</td></tr><tr><td>" +
					values[value].enabledPlugin +
					"</td></tr></table></td>";
			}
		}
		return result;
	}

	function DebugInfo() {
		var result = "";
		result += "<table border=1>";

		result += "<tr><td>Platform</td>";
		result += writeDebugCell( "Macintosh", detectMac() );
		result += writeDebugCell( "Windows", detectWin32() );
		if ( detectWin32() ) {
			result += writeDebugCell( "Vista/Windows7", detectVistaOrWindows7() );
		}
		result += "</tr>";

		result += "<tr><td>Browser</td>";
		result += writeDebugCell( "IE", detectIE() );
		result += writeDebugCell( "Firefox", detectFirefox() );
		result += writeDebugCell( "Safari", detectSafari() );
		result += writeDebugCell( "Chrome", detectChrome() );
		result += "</tr>";

		if ( !detectIE() ) {
			result += "<tr><td>MIME types</td>";
			result += writeDebugMimeArray( navigator.mimeTypes );
			result += "</tr>";
		}

		result += "<tr><td>Installed</td><td>";
		if ( navigator.mimeTypes['application/x-widevinemediaoptimizer'] ) {
			var aWidevinePlugin = document.getElementById('WidevinePlugin');
			if ( aWidevinePlugin ) {
				result += aWidevinePlugin.GetVersion();
			} else {
				result += "MIME type exists but could not load plugin";
			}
		} else {
			result += "MIME Type Not Found";
		}
		result += "</td></tr>";

		result += "</table>";
		return result;
	}

	////////////////////////////////////////////////////////////////////////////
	// End debug output section
	// Used to write debug information to the screen if debug variable is set
	// to true.
	// Only used by test page
	////////////////////////////////////////////////////////////////////////////


	////////////////////////////////////////////
	// AddDiv
	//
	// Adds a div to the html page
	// html: html to place in the div
	////////////////////////////////////////////
	function AddDiv( html ) {
		var div = document.createElement( "div" );
		document.body.appendChild( div );
		div.innerHTML = html;
		return div;
	}

	////////////////////////////////////////////
	// EmbedText
	//
	// Returns embed or object tag for the initializing WidevineMediaOptimizer
	// plugin
	////////////////////////////////////////////
	function EmbedText() {
		if ( detectIE() ) {
			if ( pluginInstalledIE() ) {	 
				return '<object id="WidevinePlugin" classid=CLSID:defa762b-ebc6-4ce2-a48c-32b232aac64d ' +
					'hidden=true style="display:none" height="0" width="0">' +
					'<param name="default_url" value="' + signon_url + '">' +
					'<param name="emm_url" value="' + emm_url + '">' +
					'<param name="log_url" value="' + log_url + '">' +
					'<param name="portal" value="' + portal + '">' +
					'<param name="user_agent" value="' + navigator.userAgent + '">' +
					'</object>';
			}
		} else if ( navigator.mimeTypes['application/x-widevinemediaoptimizer'] ) {
				setCookie("FirefoxDisabledCheck", "");
				return '<embed id="WidevinePlugin" type="application/x-widevinemediaoptimizer"' +
					' default_url="' + signon_url +
					'" emm_url="' + emm_url +
					'" log_url="' + log_url +
					'" portal="' + portal +
					'" height="0" width="0' +
					'" user_agent="' + navigator.userAgent +
					'">';
		} else {
			//return showDownloadPageText();
			return false;
		}
	}

	////////////////////////////////////////////
	// showDownloadPageText
	//
	// Returns button to download page
	////////////////////////////////////////////
	function showDownloadPageText(){
		return "<div style='margin: -1em; position: absolute; z-index: 10; width: 1500px; height: 1200px; color: white; background-color: black'>" +
			"<div align='center'>" +
				"<h2>Widevine Video Optimizer is not installed</h2>" +
					"<input type='button' value='Get Video Optimizer' OnClick='javascript: window.open(\"http://tools.google.com/dlpage/widevine\");'>" +
						"</div>" +
							"</div>"
	}

	////////////////////////////////////////////
	// pluginInstalledIE
	//
	// Returns true is the plugin is installed
	////////////////////////////////////////////
	function pluginInstalledIE(){
		try{
			var o = new ActiveXObject("npwidevinemediaoptimizer.WidevineMediaTransformerPlugin");
			o = null;
			return true;

		}catch(e){
			return false;
		}
	}


	return {
		pluginInstalledIE: function(){
			return pluginInstalledIE();
		}
		, 
		flashVersion:function(){
			return current_ver;
		}
		,

		init:function() {

			try{
				var major_ver = 0;
				var version = GetSwfVer();
				if(version.indexOf(" ") != -1){
					version = version.split(" ")[1];
				}else if (version.indexOf("=") != -1){
					version = version.split(" ")[1];
				}
				current_ver = version;

				if(version.indexOf(",") != -1){
					major_ver = parseInt(version.split(",")[0]);
				}else if(version.indexOf(".") != -1){
					major_ver = parseInt(version.split(".")[0]);
				}
				if (major_ver < 10){
					alert("Please upgrade to Flash 10+ to continue. Current version: " + current_ver);
					return "";
				}
			}catch(e){
				current_ver = "";
				alert("Flash not detected. Please install Flash to continue.");
				return "";
			}



			// try {

				var embedText = EmbedText();

				if (embedText) {

					AddDiv(embedText);

				} else {

					var attempts = 0;

					function showDialog() {
						if (
							window.orion &&
							window.orion.app &&
							window.orion.app.dialogManager
						) {
							var dialog = orion.app.dialogManager.getDialog('widevine');
							dialog.setHtmlContent(
								'<div class="widevine">' +
                                '<h2>Widevine Video Optimizer is not installed</h2>' +
                                '<span class="button">' +
								'<button onclick="window.open(\'http://tools.google.com/dlpage/widevine\');">Get Video Optimizer</button>' +
                                '</span>' +
                                '</div>'
							);
							dialog.centerOn(window);
							dialog.show();
						} else {
							attempts++;
							if (attempts < 100) {
								window.setTimeout(showDialog, 100);
							}
						}
					}

					window.setTimeout(showDialog, 1000);

				}

				if ( debug ) {
					AddDiv( DebugInfo() );
				}

			// }
			// catch(e) {
				// alert("widevine.init exception: " + e.message);
			// }
		}
	};
}());

function WVGetURL( arg ) {
	var aWidevinePlugin = document.getElementById('WidevinePlugin');
	try {
		transformedUrl = aWidevinePlugin.Translate( arg );
	}
	catch (err) {
		return "Error calling Translate: " + err.description;
	}
	return transformedUrl;
}

function WVGetCommURL () {
	var aWidevinePlugin = document.getElementById('WidevinePlugin');
	try {
		return aWidevinePlugin.GetCommandChannelBaseUrl();
	} catch (err) {
		//alert("Error calling GetCommandChannelBaseUrl: " + err.description);
	}
	return "http://localhost:20001/cgi-bin/";
}

	function WVSetPlayScale( arg ) {
		var aWidevinePlugin = document.getElementById('WidevinePlugin');
		try {
			return aWidevinePlugin.SetPlayScale( arg );
		}
		catch (err) {
			alert ("Error calling SetPlayScale: " + err.description);
		}
		return 0;
	}

	function WVGetMediaTime( arg ) {
		var aWidevinePlugin = document.getElementById('WidevinePlugin');
		try {
			return aWidevinePlugin.GetMediaTime( arg );
		} catch (err) {
			alert("Error calling GetMediaTime: " + err.description);
		}
		return 0;
	}

	function WVGetClientId() {
		var aWidevinePlugin = document.getElementById('WidevinePlugin');
		try {
			return aWidevinePlugin.getClientId();
		}
		catch (err) {
			alert ("Error calling GetClientId: " + err.description);
		}
		return 0;
	}


	function WVSetDeviceId(arg) {
		var aWidevinePlugin = document.getElementById('WidevinePlugin');
		try {
			return aWidevinePlugin.setDeviceId(arg);
		}
		catch (err) {
			alert ("Error calling SetDeviceId: " + err.description);
		}
		return 0;
	}

	function WVSetStreamId(arg) {
		var aWidevinePlugin = document.getElementById('WidevinePlugin');
		try {
			return aWidevinePlugin.setStreamId(arg);
		}
		catch (err) {
			alert ("Error calling SetStreamId: " + err.description);
		}
		return 0;
	}

	function WVSetClientIp(arg) {
		var aWidevinePlugin = document.getElementById('WidevinePlugin');
		try {
			return aWidevinePlugin.setClientIp(arg);
		}
		catch (err) {
			alert ("Error calling SetClientIp: " + err.description);
		}
		return 0;
	}

	function WVSetEmmURL(arg) {
		var aWidevinePlugin = document.getElementById('WidevinePlugin');
		try {
			return aWidevinePlugin.setEmmUrl(arg);
		}
		catch (err) {
			alert ("Error calling SetEmmURL: " + err.description);
		}
		return 0;
	}


	function WVSetEmmAckURL(arg) {
		var aWidevinePlugin = document.getElementById('WidevinePlugin');
		try {
			return aWidevinePlugin.setEmmAckUrl(arg);
		}
		catch (err) {
			alert ("Error calling SetEmmAckUrl: " + err.description);
		}
		return 0;
	}

	function WVSetHeartbeatUrl(arg) {
		var aWidevinePlugin = document.getElementById('WidevinePlugin');
		try {
			return aWidevinePlugin.setHeartbeatUrl(arg);
		}
		catch (err) {
			alert ("Error calling SetHeartbeatUrl: " + err.description);
		}
		return 0;
	}


	function WVSetHeartbeatPeriod(arg) {
		var aWidevinePlugin = document.getElementById('WidevinePlugin');
		try {
			return aWidevinePlugin.setHeartbeatPeriod(arg);
		}
		catch (err) {
			alert ("Error calling SetHeartbeatPeriod: " + err.description);
		}
		return 0;
	}



	function WVSetOptData(arg) {
		var aWidevinePlugin = document.getElementById('WidevinePlugin');
		try {
			return aWidevinePlugin.setOptData(arg);
		}
		catch (err) {
			alert ("Error calling SetOptData: " + err.description);
		}
		return 0;
	}

	function WVGetDeviceId() {
		var aWidevinePlugin = document.getElementById('WidevinePlugin');
		try {
			return aWidevinePlugin.getDeviceId();
		}
		catch (err) {
			alert ("Error calling GetDeviceId: " + err.description);
		}
		return 0;
	}

	function WVGetStreamId() {
		var aWidevinePlugin = document.getElementById('WidevinePlugin');
		try {
			return aWidevinePlugin.getStreamId();
		}
		catch (err) {
			alert ("Error calling GetStreamId: " + err.description);
		}
		return 0;
	}

	function WVGetClientIp() {
		var aWidevinePlugin = document.getElementById('WidevinePlugin');
		try {
			return aWidevinePlugin.getClientIp();
		}
		catch (err) {
			alert ("Error calling GetClientIp: " + err.description);
		}
		return 0;
	}


	function WVGetEmmURL() {
		var aWidevinePlugin = document.getElementById('WidevinePlugin');
		try {
			return aWidevinePlugin.getEmmUrl();
		}
		catch (err) {
			alert ("Error calling GetEmmURL: " + err.description);
		}
		return "";
	}


	function WVGetEmmAckURL() {
		var aWidevinePlugin = document.getElementById('WidevinePlugin');
		try {
			return aWidevinePlugin.getEmmAckUrl();
		}
		catch (err) {
			alert ("Error calling GetEmmAckUrl: " + err.description);
		}
		return "";
	}

	function WVGetHeartbeatUrl() {
		var aWidevinePlugin = document.getElementById('WidevinePlugin');
		try {
			return aWidevinePlugin.getHeartbeatUrl();
		}
		catch (err) {
			alert ("Error calling GetHeartbeatUrl: " + err.description);
		}
		return "";
	}



	function WVGetHeartbeatPeriod() {
		var aWidevinePlugin = document.getElementById('WidevinePlugin');
		try {
			return aWidevinePlugin.getHeartbeatPeriod();
		}
		catch (err) {
			alert ("Error calling GetHeartbeatPeriod: " + err.description);
		}
		return "";
	}


	function WVGetOptData() {
		var aWidevinePlugin = document.getElementById('WidevinePlugin');
		try {
			return aWidevinePlugin.getOptData();
		}
		catch (err) {
			alert ("Error calling GetOptData: " + err.description);
		}
		return "";
	}


	function WVAlert( arg ) {
		alert(arg);
		return 0;
	}


	function WVPDLNew(mediaPath, pdlPath) {
		var aWidevinePlugin = document.getElementById('WidevinePlugin');
		try {
			pdl_new =  aWidevinePlugin.PDL_New(mediaPath, pdlPath);
			return pdl_new;
		}
		catch (err) {
			//alert ("Error calling PDL_New: " + err.description);
		}
		return "";
	}

	function WVPDLStart(pdlPath, trackNumber, trickPlay) {
		var aWidevinePlugin = document.getElementById('WidevinePlugin');
		try {
			return aWidevinePlugin.PDL_Start(pdlPath, trackNumber, trickPlay);
		}
		catch (err) {
			//alert ("Error calling PDL_Start: " + err.description);
		}
		return "";
	}

	function WVPDLResume(pdlPath) {
		var aWidevinePlugin = document.getElementById('WidevinePlugin');
		try {
			return aWidevinePlugin.PDL_Resume(pdlPath);
		}
		catch (err) {
			//alert ("Error calling PDL_Resume: " + err.description);
		}
		return "";
	}


	function WVPDLStop(pdlPath) {
		var aWidevinePlugin = document.getElementById('WidevinePlugin');
		try {
			return aWidevinePlugin.PDL_Stop(pdlPath);
		}
		catch (err) {
			//alert ("Error calling PDL_Stop: " + err.description);
		}
		return "";
	}

	function WVPDLCancel(pdlPath) {
		var aWidevinePlugin = document.getElementById('WidevinePlugin');
		try {
			return aWidevinePlugin.PDL_Cancel(pdlPath);
		}
		catch (err) {
			//alert ("Error calling PDL_Stop: " + err.description);
		}
		return "";
	}

	function WVPDLGetProgress(pdlPath) {
		var aWidevinePlugin = document.getElementById('WidevinePlugin');
		try {
			return aWidevinePlugin.PDL_GetProgress(pdlPath);
		}
		catch (err) {
			//alert ("Error calling PDL_GetProgress: " + err.description);
		}
		return "";
	}


	function WVPDLGetTotalSize(pdlPath) {
		var aWidevinePlugin = document.getElementById('WidevinePlugin');
		try {
			return aWidevinePlugin.PDL_GetTotalSize(pdlPath);
		}
		catch (err) {
			//alert ("Error calling PDL_GetTotalSize: " + err.description);
		}
		return "";
	}

	function WVPDLFinalize(pdlPath) {
		var aWidevinePlugin = document.getElementById('WidevinePlugin');
		try {
			return aWidevinePlugin.PDL_Finalize(pdlPath);
		}
		catch (err) {
			//alert ("Error calling PDL_Finalize: " + err.description);
		}
		return "";
	}

	function WVPDLCheckHasTrickPlay(pdlPath) {
		var aWidevinePlugin = document.getElementById('WidevinePlugin');
		try {
			return aWidevinePlugin.PDL_CheckHasTrickPlay(pdlPath);
		}
		catch (err) {
			//alert ("Error calling PDL_CheckHasTrickPlay: " + err.description);
		}
		return "";
	}

	function WVPDLGetTrackBitrate(pdlPath, trackNumber) {
		var aWidevinePlugin = document.getElementById('WidevinePlugin');
		try {
			return aWidevinePlugin.PDL_GetTrackBitrate(pdlPath, trackNumber);
		}
		catch (err) {
			//alert ("Error calling PDL_GetTrackBitrate: " + err.description);
		}
		return "";
	}

	function WVPDLGetTrackCount(pdlPath) {
		var aWidevinePlugin = document.getElementById('WidevinePlugin');
		try {
			return aWidevinePlugin.PDL_GetTrackCount(pdlPath);
		}
		catch (err) {
			//alert ("Error calling PDL_GetTrackCount: " + err.description);
		}
		return "";
	}

	function WVPDLGetDownloadMap(pdlPath) {
		var aWidevinePlugin = document.getElementById('WidevinePlugin');
		try {
			return aWidevinePlugin.PDL_GetDownloadMap(pdlPath);
		}
		catch (err) {
			//alert ("Error calling PDL_GetDownloadMap: " + err.description);
		}
		return "";
	}

	function WVGetLastError() {
		var aWidevinePlugin = document.getElementById('WidevinePlugin');
		try {
			return aWidevinePlugin.GetLastError();
		}
		catch (err) {
			//alert ("Error calling GetLastError: " + err.description);
		}
		return "";
	}

	function WVRegisterAsset(assetPath, requestLicense){
		var aWidevinePlugin = document.getElementById('WidevinePlugin');
		try {
			return aWidevinePlugin.RegisterAsset(assetPath, requestLicense);
		}
		catch (err) {
			//alert ("Error calling RegisterAsset: " + err.description);
		}
		return "";

	}


	function WVQueryAsset(assetPath){
		var aWidevinePlugin = document.getElementById('WidevinePlugin');
		try {
			return aWidevinePlugin.QueryAsset(assetPath);
		}
		catch (err) {
			//alert ("Error calling QueryAsset: " + err.description);
		}
		return "";

	}

	function WVQueryAllAssets(){
		var aWidevinePlugin = document.getElementById('WidevinePlugin');
		try {
			return aWidevinePlugin.QueryAllAssets();
		}
		catch (err) {
			//alert ("Error calling QueryAllAssets: " + err.description);
		}
		return "";

	}



	function WVUnregisterAsset(assetPath){
		var aWidevinePlugin = document.getElementById('WidevinePlugin');
		try {
			return aWidevinePlugin.UnregisterAsset(assetPath);
		}
		catch (err) {
			//alert ("Error calling UnregisterAsset: " + err.description);
		}
		return "";

	}

	function WVUpdateLicense(assetPath){
		var aWidevinePlugin = document.getElementById('WidevinePlugin');
		try {
			return aWidevinePlugin.UpdateLicense(assetPath);
		}
		catch (err) {
			//alert ("Error calling UpdateAssetLicense: " + err.description);
		}
		return "";

	}

	function WVGetQueryLicenseValue(assetPath, key){
		var licenseInfo = eval('(' + WVQueryAsset(assetPath) + ')');
		licenseInfo = eval("licenseInfo." + key);
		return licenseInfo;
	}


	function WVCancelAllDownloads(){
		var aWidevinePlugin = document.getElementById('WidevinePlugin');
		try {
			if (aWidevinePlugin){
				var downloading_list = eval(aWidevinePlugin.PDL_QueryDownloadNames());
				for(var i = 0; i < downloading_list.length; i++){
					WVPDLCancel(downloading_list[i]);
				}
			}
		}
		catch (err) {
			//alert ("Error calling QueryAllAssets: " + err.description);
		}
		return "";
	}

	widevine.init();

