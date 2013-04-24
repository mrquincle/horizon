var BBV=(function(WINDOW,DOCUMENT,TRUE,FALSE,NULL,UNDEFINED){var modules={},TRIMBOTH=/^\s+|\s+$/g,URLPATTERN=/^.+\//i,VERSION="1.0",scripts=DOCUMENT.getElementsByTagName("script"),firstscript=scripts[0],scriptpath=(function(){return URLPATTERN.exec(scripts[scripts.length-1].src)
})(),datatypes={},hasOwn=Object.prototype.hasOwnProperty,slice=Array.prototype.slice,toString=Object.prototype.toString,trim=String.prototype.trim,bbv={inArray:function(item,arr){if(arr.indexOf){return arr.indexOf(item)
}for(var i=0,len=arr.length;
i<len;
i++){if(arr[i]===item){return i
}}return -1
},isArray:function(obj){return bbv.type(obj)==="array"
},remove:function(arr,from,to){var rest=arr.slice((to||from)+1||arr.length);
arr.length=from<0?arr.length+from:from;
return arr.push.apply(arr,rest)
},isEmptyObj:function(obj){for(var i in obj){return false
}return true
},isFunction:function(obj){return bbv.type(obj)==="function"
},isObj:function(obj){return(obj&&obj.length==UNDEFINED)&&bbv.type(obj)==="object"
},each:function(obj,fn){var name,value,i=0,object=obj||{},length=object.length,isObj=length===UNDEFINED||bbv.isFunction(object);
if(isObj){for(name in object){fn.call(object[name],name,object[name])
}}else{for(value=object[0];
i<length;
value=object[++i]){fn.call(value,i,value)
}}},unique:function(arr,comparer){if(arr.length===1){return arr
}comparer=comparer||function(x,y){return x===y
};
var a=[],length=arr.length;
for(var i=0;
i<length;
i++){for(var j=i+1;
j<length;
j++){if(comparer(arr[i],arr[j])){j=++i
}}a.push(arr[i])
}return a
},extend:function(){var args=arguments,length=args.length,target=args[0],option,i=0,l=length,name;
if(!target){target={}
}for(;
i<l;
i++){if((option=args[i])!==NULL){for(name in option){target[name]=option[name]
}}}return target
},module:function(name,fn){var temp={};
temp[name]=modules[name]=fn(WINDOW,DOCUMENT,TRUE,FALSE,NULL);
bbv.extend(bbv,temp)
},namespace:function(_ns){var ns=_ns.split("."),parnt=window;
BBV.each(ns,function(idx,val){parnt[val]=parnt[val]||{};
parnt=parnt[val]
});
return parnt
},noop:function(){},require:function(modules){var script,i=0,required=(BBV.type(modules)==="string")?slice.call(arguments):modules,mods=required.length;
for(;
i<mods;
i++){if(!BBV[required[i]]){throw new Error(required[i]+" is required but is missing.")
}}},trim:trim?function(str){return String(str).trim()
}:function(str){return String(str).replace(TRIMBOTH,"")
},type:function(o){return o==NULL?String(o):datatypes[toString.call(o)]||"object"
}};
bbv.Object={create:function(obj,_props){var _properties=_props||{};
function F(){}if(!BBV.isFunction(Object.create)){BBV.extend(obj,_properties);
F.prototype=obj;
return new F()
}else{return Object.create(obj,_properties)
}},extend:function(){}};
bbv.each("Array Boolean Date Function Number Object RegExp String".split(" "),function(i,t){datatypes["[object "+t+"]"]=t.toLowerCase()
});
return bbv
})(this,this.document,true,false,null),BBV_settings=(function(){var base={};
function settings(options){BBV.extend(base,options);
return base
}return settings
})();
BBV.extend(BBV,{settings:BBV_settings()});
BBV_settings(BBVSettingsObject);
BBV.module("error",function(WINDOW,BBV_){var history=[],type={AJAXERROR:{name:"AjaxErrorExceptions",msg:"Generic AJAX error"},DEFAULTERROR:{name:"GenericException",msg:"An error has occured"},INVALIDMETHOD:{name:"InvalidMethodException",msg:"Method cannot be called on this object"},MISSINGMODULE:{name:"MissingModuleException",msg:"{0} module is missing"}};
function Err(){var err_=(this instanceof Err)?this:new Err,args=Array.prototype.slice.call(arguments),l=args.length,isobj=BBV.isObj(args[0]);
return err_
}BBV.extend(Err.prototype,{log:function(){var err_=this
},warn:function(){},stop:function(){}},Error.prototype);
Err.DEBUG=false;
Err.type=type;
return Err
});
(function(WINDOW,DOCUMENT,TRUE,FALSE,NULL,UNDEFINED){BBV.require(["error"]);
var $=WINDOW.jQuery,defaults;
BBV.extend(BBV,{ajax:{defaults:defaults={async:true,crossDomain:BBV.settings.api.xhr||false,dataType:"json",type:"GET",error:function(data){BBV.error(BBV.error.type.AJAXERROR,{status:data.textStatus,msg:data.errorThrown})
},success:function(data){}},getJSON:function(url,settings){var settings=settings||{},config=BBV.extend({},defaults,settings,{dataType:"json"});
BBV.ajax.load(url,config)
},getJSONP:function(url,settings){var settings=settings||{},config=BBV.extend({},defaults,settings,{dataType:"jsonp",jsonpCallback:callback});
BBV.ajax.load(url,config)
},load:function(url,settings){var settings=settings||{},config=BBV.extend({},defaults,settings);
$.ajax(url,config)
}},dom:{addClass:function(selector,classname){var selector=selector||document;
$(selector).addClass(classname);
return BBV.get(selector)
},append:function(selector,element){var selector=selector||document;
$(selector).append(element);
return BBV.get(selector)
},detach:function(selector){var selector=selector||document;
return $(selector).detach()
},empty:function(selector){var selector=selector||document;
$(selector).empty();
return BBV.get(selector)
},get:function(selector,context,idx){var context=context||document,match=$(context).find(selector);
return match.get(idx)
},hasClass:function(selector,classname){var selector=selector||document;
return $(selector).hasClass(classname)
},removeClass:function(selector,classname){var selector=selector||document;
$(selector).removeClass(classname);
return BBV.get(selector)
}},events:{bind:function(event,handler){$(document).bind(event,handler)
},trigger:function(event,params){$.event.trigger(event,params)
}},json:{serialize:function(obj){return JSON.stringify(obj)
},parse:function(str){return JSON.parse(str)
}}})
})(this,this.document,true,false,null);
BBV.module("utils",function(WINDOW,DOCUMENT,TRUE,FALSE,NULL,UNDEFINED){var utils={};
utils.cookie=(function(){var cookie=function(name){var c=(!(this instanceof cookie))?new cookie:this;
c.data=null;
c.json=null;
c.name=name;
c.exists=c.check(c.name);
if(name){c.data=c.get(c.name)||"{}";
c.json=BBV.json.parse(decodeURIComponent(c.data))
}return c
};
cookie.prototype={check:function(key){var val=(this instanceof cookie)?this.get(key):cookie.get(key);
return(!!val||val==="")
},get:function(key){if(!key){return
}var c=(this instanceof cookie&&this.json)?this.json:document.cookie.split(";"),length=c.length,i=0,namexp=key+("="),data;
if(BBV.type(c)!=="object"){for(;
i<length;
i++){if(BBV.trim(c[i]).indexOf(namexp)===0){data=BBV.trim(c[i]);
break
}}return data?data.split("=")[1]:null
}else{if(BBV.isObj(c)){return c[key]
}}return c
},set:function(n,v,e,d,s){var self=this,name=n,value=v,expire=(e===0)?false:e||BBV.settings.cookie.daysToExpire||null,domain=d||null,secure=s||FALSE,strbuilder=[];
if(!(self instanceof cookie)){strbuilder.push(name+"="+value)
}else{var data=this.json||{},inject={};
inject[name]=value;
BBV.extend(data,inject);
strbuilder.push(this.name+"="+BBV.json.serialize(this.json))
}if(expire){var date=new Date(),expires;
if(typeof expire==="number"){date.setTime(date.getTime()+(expire*1000*60*60*24));
expires=date
}else{expires=expire
}strbuilder.push("expires="+expires.toGMTString())
}if(domain){strbuilder.push("domain="+domain)
}if("https:"==document.location.protocol&&secure){strbuilder.push("secure")
}strbuilder.push("path=/");
document.cookie=strbuilder.join("; ")
},remove:function(name){var key;
if(!(this instanceof cookie)){utils.cookie.set(name,"",-1)
}else{for(key in this.json){if(key===name){delete this.json[key]
}}utils.cookie.set(this.name,BBV.json.serialize(this.json))
}}};
BBV.extend(cookie,cookie.prototype);
return cookie
})();
utils.date=function(t){function DateObj(t){var self=this;
self.date=t?new Date(t):new Date;
return self
}DateObj.prototype={getMonthName:function(abbr){var offset=abbr?12:0,s=BBV.settings.i18n.dateformat,month=this.date.getMonth(),months=s&&s.monthNames.length?s.monthNames:[];
return months[month+offset]
},getDayName:function(abbr){var offset=abbr?7:0,s=BBV.settings.i18n.dateformat,day=this.date.getDay(),days=s&&s.dayNames.length?s.dayNames:[];
return days[day+offset]
},format:function(format){if(typeof format!=="string"){return false
}var self=this,pattern=/M{1,4}|D{1,4}|Y{2,4}|H{1,2}|h{1,2}|m|s|t{1,2}/g,d=self.date,M=d.getMonth(),D=d.getDate(),Y=d.getFullYear(),H=d.getHours(),m=d.getMinutes(),s=d.getSeconds(),tt=H>12?"PM":"AM",pad=function(val){return val<10?[0,val].join(""):val
},mappings={MMMM:self.getMonthName(),MMM:self.getMonthName(true),MM:pad(M+1),M:M+1,DDDD:self.getDayName(),DDD:self.getDayName(true),DD:pad(D),D:D,YYYY:Y,YY:String(Y).slice(2),HH:pad(H),H:H,hh:pad(H%12),h:H%12||12,m:pad(m),s:pad(s),tt:tt,t:String(tt).slice(0,1)};
return format.replace(pattern,function($0){return($0 in mappings)?mappings[$0]:$0
})
},toString:function(){return this.date.toString()
}};
return new DateObj(t)
};
BBV.extend(utils.date,{toMilliseconds:function(days){return(1000*60*60*24*days)
}});
utils.guid={expression:/^[0-9a-f]{8}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{12}$/,format:"xx-x-x-x-xxx",generate:function(pattern){var guid=null,pattern=pattern||utils.guid.format;
function field(){return(((1+Math.random())*65536)|0).toString(16).substring(1)
}guid=utils.guid.format.replace(/x/ig,function(){return field()
});
return guid
},validate:function(guid){return utils.guid.expression.test(guid)
}};
utils.time={format:function(time,lead){var time=Math.ceil(time),lead=lead||true,formatted=[],seconds=parseInt(time%60,10)||0,minutes=parseInt(time/60,10)||0,hours=parseInt(minutes/60,10)||0;
minutes=minutes-(hours*60);
function checkLeadingZero(num){return(num<10&&lead)?"0"+num:num
}return checkLeadingZero(hours)+":"+checkLeadingZero(minutes)+":"+checkLeadingZero(seconds)
}};
utils.uri={builder:function(url){var self={url:NULL,domain:NULL,port:NULL,path:NULL,hash:NULL,params:{},toString:function(){var str=[self.domain],param=[];
if(self.port){str.push(":"+self.port)
}if(self.path){str.push(self.path)
}for(var item in self.params){param.push(item+"="+self.params[item])
}if(param.length){str.push("?"+param.join("&"))
}if(self.hash){str.push("#"+self.hash)
}return str.join("")
}},urlmatch=/^([a-z]+:\/{2,3}[a-z0-9\.\-]+)(?::(\d{2,4}))?([a-z0-9\-\.\_\/]+)?(?:\?([^#]+))?(?:#(.+))?$/i,parts=["url","domain","port","path","params","hash"],type=typeof url,match=type==="string"?urlmatch.exec(url):[],length=match?match.length:0,i=0,pairs,params;
if(type==="string"&&length){for(;
i<length;
i++){if(i===4){self[parts[i]]=decodeURIComponent(match[i].replace("%26","%2526"))
}else{self[parts[i]]=decodeURIComponent(match[i])
}}params=self.params;
self.params={};
pairs=params.split("&");
for(i=0,length=pairs.length;
i<length;
i++){var keyValue=pairs[i].split("=");
self.params[decodeURIComponent(keyValue[0])]=decodeURIComponent(keyValue[1])
}}else{if(type==="object"){BBV.extend(self,url)
}}return self
},resolveURL:function(path){var context=BBV.settings.context,resolved;
if(context){resolved=path.replace(/^~/,context)
}else{resolved=path.replace(/^~/,"")
}return resolved
},toObject:function(uri){var obj={},pairs=uri.split("&");
BBV.each(pairs,function(idx,val){var keyValue=val.split("=");
obj[keyValue[0]]=keyValue[1]
});
return obj
}};
return utils
});
BBV.module("api",function(WINDOW,DOCUMENT,TRUE,FALSE,NULL,UNDEFINED){BBV.require(["utils"]);
var base=BBV.settings.api.urls.base,endpoint=BBV.settings.api.urls.endpoints,xhr=BBV.settings.api.xhr,cache=[],api={};
function Query(url,settings){var self=!(this instanceof Query)?new Query:this,settings=BBV.isObj(settings)?settings:{};
self.url=url||base;
self.callback=settings&&BBV.isFunction(settings.callback)?settings.callback:null;
self.success=function(){var args=Array.prototype.slice.call(arguments);
self.response=args[0];
self.lastrun=new Date();
if(self.callback){self.callback.apply(self,args)
}BBV.events.trigger("BBV#Query",args)
};
self.settings=BBV.extend({},settings,{success:self.success});
return self
}Query.prototype={constructor:Query,response:{},data:null,lastrun:null,remove:function(overrideType){var self=this;
if(overrideType){BBV.extend(self.settings,{type:"DELETE"})
}self.run()
},run:function(){var self=this;
if(!xhr){BBV.ajax.getJSON(self.url,BBV.extend(self.settings,{data:self.data}))
}else{BBV.ajax.getJSONP(self.url,BBV.extend(self.settings,{data:self.data}))
}},save:function(){BBV.error(BBV.error.type.INVALIDMETHOD)
},update:function(settings){var self=this;
BBV.extend(self.settings,settings);
BBV.each(settings,function(property,value){if(!BBV.isFunction(self[property])){self[property]=value
}})
}};
function ChannelListQuery(settings){var self=!(this instanceof ChannelListQuery)?new ChannelListQuery:this,settings=BBV.isObj(settings)?settings:{};
self.url=(settings.url)?settings.url:[base,endpoint.channels].join("/");
self.callback=settings&&BBV.isFunction(settings.callback)?settings.callback:null;
self.settings=BBV.extend({},settings,{success:self.success});
self.success=function(){var args=Array.prototype.slice.call(arguments);
self.response=args[0];
self.lastrun=new Date();
if(self.callback){args.unshift(this);
self.callback.apply(self,args)
}BBV.events.trigger("BBV#ChannelListQuery",args)
};
self.settings=BBV.extend({},settings,{success:self.success});
return self
}ChannelListQuery.prototype=new Query;
function FeedQuery(feedID,settings){var self=!(this instanceof FeedQuery)?new FeedQuery:this,settings=BBV.isObj(settings)?settings:{};
self.feedID=feedID||null;
self.url=(settings.url)?settings.url:[base,endpoint.feeds].join("/");
self.callback=settings&&BBV.isFunction(settings.callback)?settings.callback:null;
self.success=function(){var args=Array.prototype.slice.call(arguments);
self.response=args[0];
self.lastrun=new Date();
if(self.callback){args.unshift(this);
self.callback.apply(self,args)
}BBV.events.trigger("BBV#FeedQuery",args)
};
self.settings=BBV.extend({},settings,{success:self.success});
return self
}FeedQuery.prototype=new Query;
BBV.extend(FeedQuery.prototype,{});
function ListingsQuery(settings){var self=!(this instanceof ListingsQuery)?new ListingsQuery:this,settings=BBV.isObj(settings)?settings:{};
self.url=(settings.url)?settings.url:[base,endpoint.channels].join("/");
self.callback=settings&&BBV.isFunction(settings.callback)?settings.callback:null;
self.settings=BBV.extend({},settings,{success:self.success});
self.success=function(){var args=Array.prototype.slice.call(arguments);
self.response=args[0];
self.lastrun=new Date();
if(self.callback){args.unshift(this);
self.callback.apply(self,args)
}BBV.events.trigger("BBV#ListingsQuery",args)
};
self.settings=BBV.extend({},settings,{success:self.success});
return self
}ListingsQuery.prototype=new Query;
ListingsQuery.prototype.constructor=ListingsQuery;
function MediaObjectQuery(mediaID,callback,settings){var self=!(this instanceof MediaQuery)?new MediaQuery(mediaID,callback,settings):this,settings=BBV.isObj(settings)?settings:BBV.isObj(callback)?callback:{},callback=BBV.isFunction(callback)?callback:(settings&&settings.success)?settings.success:null;
self.url=(settings.url)?settings.url:[base,endpoint.media].join("/");
self.mediaID=mediaID||null
}MediaObjectQuery.prototype=new Query;
BBV.extend(MediaObjectQuery.prototype,{remove:function(){},save:function(){}});
function RatingQuery(){}function ReviewQuery(){}BBV.extend(api,{Query:Query,ChannelListQuery:ChannelListQuery,FeedQuery:FeedQuery,ListingsQuery:ListingsQuery});
return api
});
BBV.module("user",function(WINDOW,DOCUMENT,TRUE,FALSE,NULL,UNDEFINED){BBV.require(["utils","error"]);
var user,isloggedin=checkLoggedStatus();
function checkLoggedStatus(){return BBV.utils.cookie.check(BBV.settings.cookie.tokenName)
}checkLoggedStatus.mappings={account:BBV.settings.cookie.map.account||"account",parentalRestrict:BBV.settings.cookie.map.parental||"parental",deviceID:BBV.settings.cookie.map.deviceID||"deviceID",entitlements:BBV.settings.cookie.map.entitlements||"entitlements",fullname:BBV.settings.cookie.map.fullname||"fullname",status:BBV.settings.cookie.map.status||"status",languageCode:BBV.settings.cookie.map.languageCode||"languageCode",playlists:BBV.settings.cookie.map.playlists||"playlists",SID:BBV.settings.cookie.map.SID||"SID",UID:BBV.settings.cookie.map.UID||"UID",username:BBV.settings.cookie.map.username||"username"};
function checkUserStatus(callback){var loggedStatus=checkLoggedStatus();
if(loggedStatus!==isloggedin||user===UNDEFINED){user=(loggedStatus)?new Member:new User;
user.init();
isloggedin=checkLoggedStatus()
}if(BBV.isFunction(callback)){callback.call(user)
}return user
}function User(){var self=this,map_=checkLoggedStatus.mappings;
self.isLoggedIn=false;
self.properties={account:null,deviceID:null,entitlements:[],fullname:"Guest User",languageCode:null,parentalRestrict:null,playlists:null,SID:null,UID:null,username:"guest"};
self.isEntitlementLocked=function(control_){var self=this,notentitled=true,control=control_||"",entitle=self.get(checkLoggedStatus.mappings.entitlements)||[];
if(entitle.length>0){var i=0,entitledTo=BBV.isArray(entitle)?entitle:entitle.split(","),entitlements=BBV.isArray(control)?control:control.split(",");
BBV.each(entitledTo,function(idx,id){notentitled=(BBV.inArray(id,entitlements)!==-1)?false:notentitled
})
}return notentitled
};
self.checkInPlaylists=function(id){};
self.init=function(){};
self.login=function(response,sessionLength){var self=this;
if(BBV.settings.cookie.generate){var token={oespToken:response.oespToken,username:response.username};
BBV.utils.cookie.set(BBV.settings.cookie.tokenName,encodeURIComponent(BBV.json.serialize(token)),sessionLength,null,BBV.settings.cookie.secure)
}checkUserStatus(function(){if(this.isLoggedIn){BBV.events.trigger("User#login")
}});
return this
};
self.logout=function(){BBV.utils.cookie.remove(BBV.settings.cookie.tokenName);
checkUserStatus(function(){if(!this.isLoggedIn){BBV.events.trigger("User#logout")
}});
return this
};
self.get=function(property_){var self=this,subscript=property_.split("."),property=self.properties,key=property[subscript.shift()];
BBV.each(subscript,function(idx,val_){if(key&&BBV.type(key[val_])!==UNDEFINED){key=key[val_]
}});
return key
};
return self
}function Member(){var self=this;
self.isLoggedIn=true;
self.init=function(){var self=this;
$.when(orion.oesp.session).done(function(session){BBV.extend(self.properties,BBV.json.parse(decodeURIComponent(BBV.utils.cookie.get(BBV.settings.cookie.tokenName))),session)
})
};
return self
}Member.prototype=new User;
return checkUserStatus
});
BBV.module("feed",function(WINDOW,DOCUMENT,TRUE,FALSE,NULL,UNDEFINED){var feedcache={},mediacache={},MediaObject={properties:{},initialize:function(data){BBV.extend(this,data);
return this
}};
function Feed(context,settings){var self=this;
self.context=context;
self.settings=settings||{};
self.url=self.settings.url||null;
self.callback=settings.callback||BBV.noop;
BBV.extend(self.settings,{callback:function(queryObj,data){self.data=data;
self.callback.call(self,this)
}});
self.query=new BBV.api.FeedQuery(self.context,BBV.extend(self.settings,{url:self.url}));
return self
}Feed.prototype={constructor:Feed,data:null,update:function(url){var self=this;
self.query.update(BBV.extend(self.settings,{url:url||self.url}));
self.query.run()
}};
function Filter(){}function Pager(){}function Sorter(){}function s(){}function feed(context,settings){if(!feedcache[context]){feedcache[context]=new Feed(context,settings)
}return feedcache[context]
}feed.s=s;
feed.MediaObject=MediaObject;
return feed
});
