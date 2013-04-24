BBV.namespace("orion.util").inherits=orion.util.inherits||(function(){var inherits=function inherits(klass,superKlass,copyStaticProperties){var prop;
function F(){}F.prototype=superKlass.prototype;
klass.prototype=new F();
klass.prototype.constructor=klass;
if(copyStaticProperties){for(prop in superKlass){if(superKlass.hasOwnProperty(prop)){klass[prop]=superKlass[prop]
}}}};
return inherits
})();
BBV.namespace("orion.util").PubSub=orion.util.PubSub||(function($){function PubSub(){}PubSub.prototype.bind=function(event,eventData,handler){var $this=$(this);
$this.bind.apply($this,arguments)
};
PubSub.prototype.unbind=function(eventType,handler){var $this=$(this);
$this.unbind.apply($this,arguments)
};
PubSub.prototype.trigger=function(eventType,extraParameters){var $this=$(this);
$this.trigger.apply($this,arguments)
};
return PubSub
})(jQuery);
BBV.namespace("orion.util.mvc").Model=orion.util.mvc.Model||(function($,PubSub){function Model(config){var self=this;
PubSub.call(self);
if(config&&$.type(config)=="object"){self.set(config,true)
}}orion.util.inherits(Model,PubSub);
Model.prototype.has=function(property){var self=this;
return property in self&&self.hasOwnProperty(property)
};
Model.prototype.get=function(property){return this[property]
};
Model.prototype.set=function(property,value,silent){var self=this;
var type=$.type(property);
var customSetters=self.constructor.customSetters||{};
var prop;
if(type=="object"){silent=value;
for(prop in property){if(property.hasOwnProperty(prop)){self.set(prop,property[prop],silent)
}}}else{if(type=="string"){if(customSetters.hasOwnProperty(property)){customSetters[property].call(self,value)
}else{self[property]=value
}}}if(!silent){self.trigger("change");
if($.type(property)=="string"){self.trigger("change."+property)
}}};
Model.prototype.unset=function(property){var self=this;
if(self.has(property)){delete self[property]
}};
return Model
})(jQuery,orion.util.PubSub);
BBV.namespace("orion.util.mvc").View=orion.util.mvc.View||(function($,PubSub){function View(model){PubSub.call(this);
this.model=model
}orion.util.inherits(View,PubSub);
View.prototype.render=function(){};
return View
})(jQuery,orion.util.PubSub);
BBV.namespace("orion.util").mediamethods=orion.util.mediamethods||(function($){function parseCategory(catID){var category=BBV.settings.i18n.genreMap[catID]||{title:null};
return category.title
}var mediamethods={buildCategoryUrl:function(genre){var url=[genre];
if(this.medium){url.unshift(BBV.settings.site.urls.category[this.medium.toLowerCase()])
}return url.join("")
},buildMediaGroupUrlForItem:function(){var url;
url=[BBV.settings.site.urls.mediagroup[this.medium.toLowerCase()],encodeURIComponent(this.mediaGroupId)];
return url===undefined?"#":url.join("/")
},buildMediaUrl:function(){return orion.oesp.res.Media.prototype.buildMediaUrl.call(this)
},isTVOD:function(){return orion.oesp.res.Media.prototype.isTVOD.call(this)
},isSVOD:function(){return orion.oesp.res.Media.prototype.isSVOD.call(this)
},encodeTitle:function(title_){var title=title_||this.title;
title=title.replace(/ /g,"-").replace(/\//g,"~");
return encodeURI(title)
},truncatedTitle:function(){if(this.imageType==="boxart-small"&&this.title.length>=18){return this.title.substring(0,15)+"..."
}else{return this.title
}},formatLength:function(){var duration=this.videos&&this.videos[0]?this.videos[0].duration:this.duration?this.duration:0;
if(!duration){return false
}else{return BBV.utils.time.format(duration)
}},getImg:function(){var images=this.images,imgType=this.imageType||"",imgStyle=imgType.split("-")[0],imgSize=imgType.split("-")[1],img="";
BBV.each(images,function(idx,itm){if(itm.assetType===imgStyle+"-"+imgSize){img=itm.url;
return false
}});
return img
},getBoxArtSmall:function(){var images=this.images,img="";
BBV.each(images,function(idx,itm){if(itm.assetType==="boxart-small"){img=itm.url;
return false
}});
return img
},getBoxArtMedium:function(){var images=this.images,img="";
BBV.each(images,function(idx,itm){if(itm.assetType==="boxart-medium"){img=itm.url;
return false
}});
return img
},getStillArtMedium:function(){var images=this.images,img="";
BBV.each(images,function(idx,itm){if(itm.assetType==="still-medium"){img=itm.url;
return false
}});
return img
},getChildMedias:function(){var media=this.currentChildMediaTypeCounts,display=[],itm=[];
BBV.each(media,function(name,value){i18nName=value>1?name.replace(" ","")+"Plural":name.replace(" ","");
mediaType=BBV.settings.i18n.mediaType[i18nName];
itm.push(value+" ");
itm.push(mediaType);
display.push(itm.join(""));
itm=[]
});
return display.join(", ")
},getMedium:function(){i18nName=value>1?this.medium+"Plural":this.medium;
return BBV.settings.i18n.medium[i18nName]
},getGenre:function(){return orion.oesp.res.Media.prototype.getGenre.call(this)
},getFormattedDate:function(){return BBV.utils.date(this.latestOfferStartDate).format(BBV.settings.l10n.date.longformat)
},getFormattedAirDate:function(){var airDate=this.startTime;
return airDate==null?"":BBV.utils.date(parseInt(airDate)).format(BBV.settings.l10n.date.shortformat)
},getFormattedProductExpirationDate:function(){var expirationDate=this.productExpirationDate;
return BBV.utils.date(parseInt(expirationDate)).format(BBV.settings.l10n.date.expirationformat)
},getFormattedPlaylistExpirationDate:function(){var maxDays=15,oneDay=24*60*60*1000,today=new Date().getTime(),future=today+(maxDays*oneDay);
return this.expirationDate&&this.expirationDate>today&&this.expirationDate<future?BBV.utils.date(parseInt(this.expirationDate)).format(BBV.settings.l10n.date.shortformat):false
},getEarliestBroadcastDate:function(){var broadcastDate=this.earliestBroadcastStartTime;
return broadcastDate==null?"":BBV.utils.date(parseInt(broadcastDate)).format(BBV.settings.l10n.date.shortformat)
},getCurrency:function(){return BBV.settings.currency[this.countryCode].symbol
},getDuration:function(){function addZero(digits){return digits<10?"0"+digits:digits
}var endTime=parseInt(this.endTime),startTime=parseInt(this.startTime),duration=endTime-startTime,hour=60*60*1000,minute=60*1000,H=Math.floor(duration/hour),M=Math.floor((duration-(H*hour))/minute),S=duration-(H*hour)-(M*minute),durationFormatted=addZero(H)+":"+addZero(M)+":"+addZero(S);
return durationFormatted
},getThumb:function(){var img=this.images,art="";
BBV.each(img,function(idx,itm){if(itm.assetType==="still-small"){art=itm.url
}});
return art
},getYear:function(){return BBV.utils.date(this.releaseDate).format("YYYY")
},getRunYears:function(){var runYears;
if(!this.endYear||this.startYear==this.endYear){runYears=this.startYear
}else{runYears=this.startYear+"-"+this.endYear
}return runYears
},hasCategories:function(){return(this.categories&&this.categories.length)?this.categories.length:0
},hasChildMedia:function(){return(this.currentChildMediaTypeCounts&&(this.currentChildMediaTypeCounts.Clip||this.currentChildMediaTypeCounts.Episode||this.currentChildMediaTypeCounts.FeatureFilm))?1:0
},hasRunDates:function(){return(this.startYear||this.endYear)
},hasParentalRating:function(){return(this.parentalRating)
},highestParentalRating:function(){var parentalRating=this.parentalRating?this.parentalRating.split(","):[],highestRating="";
BBV.each(BBV.settings.ratings,function(idxRating,rating){BBV.each(parentalRating,function(idxItem,item){if(rating.rating.toUpperCase()==item.toUpperCase()){highestRating=item.toUpperCase()
}})
});
return(highestRating)
},inPlaylist:function(){if(!this.id){return false
}var playlistIds=[];
$("#playlist .grid-view .media-item").each(function(index,mediaItem){playlistIds.push($(mediaItem).data("media-id").toString())
});
return BBV.inArray(this.id.toString(),playlistIds)==-1?false:true
},isEpisode:function(){return(this.mediaType==="Episode")
},isMediaGroup:function(){return BBV.isObj(this.currentChildMediaTypeCounts)
},isMovie:function(){return(this.medium==="Movie")
},isMovieItem:function(){return(this.medium==="Movie"&&!BBV.isObj(this.currentChildMediaTypeCounts))
},isPlayable:function(){var self=this;
return !self.isMediaGroup()||self.medium&&self.medium.toLowerCase()==="movie"
},isTV:function(){return(this.medium==="TV")
},isExpandable:function(){return this.index>=3
},isFirstItem:function(){return this.index==0
},isLastItem:function(){return this.index==this.length-1
},hiddenStart:function(){return this.index==3?'<div class="hidden-items">':""
},hiddenEnd:function(){var lastItem=this.length<4?4:this.length;
return this.index==lastItem-1?"</div>":""
},lowerCase:function(){return function(text){if(this[text]){return this[text].toLowerCase()
}else{return this[text]
}}
},localizeText:function(){return function(text){return" "+this.localStrings[text]+" "
}
},hasVodType:function(vodType){return orion.oesp.res.Media.prototype.hasVodType.call(this,vodType)
}};
return mediamethods
})(jQuery);
(function($,window,undefined){window.facebook=$.Deferred();
window.fbAsyncInit=function(){FB.init({appId:BBV.settings.facebook.appId,channelURL:BBV.settings.currentDomain+"/etc/designs/orion/upc/js/lib/fb/channel.html",status:true,cookie:true,oauth:true,xfbml:true});
FB.Event.subscribe("auth.login",function(response){});
FB.Event.subscribe("auth.logout",function(response){});
FB.Event.subscribe("edge.create",function(targetUrl){});
FB.Event.subscribe("edge.remove",function(targetUrl){});
FB.Event.subscribe("comment.create",function(commentDetail){});
FB.Event.subscribe("comment.remove",function(commentDetail){});
FB.Event.subscribe("message.send",function(targetUrl){});
log("fbAsyncInit: facebook API is ready");
window.facebook.resolve()
};
window.facebook.promise()
})(jQuery,window);
(function(d){var js,id="facebook-jssdk";
if(d.getElementById(id)){return
}js=d.createElement("script");
js.id=id;
js.async=true;
js.src="//connect.facebook.net/"+BBV.settings.facebook.facebookLocale+"/all.js";
d.getElementsByTagName("head")[0].appendChild(js)
}(document));
window.facebook.parse=function(elem){facebook.done(function(){FB.XFBML.parse(elem)
})
};
BBV.namespace("orion.util").url=orion.util.url||(function($){var url={};
url.queryToObj=function(url){var retObj={},urlParts,query,pairs,pair,i;
if(typeof url!=="string"){return retObj
}urlParts=/^([^?#]*)(\?[^#]*)?(\#.*)?$/i.exec(url);
if(urlParts.length>2){query=urlParts[2]
}if(query){query=query.slice(1);
pairs=query.split("&");
for(i=0;
i<pairs.length;
i++){pair=pairs[i].split("=");
retObj[pair[0]]=pair[1]||""
}}return retObj
};
url.readUrlString=function(url){var keyValue=url.split("?");
return{url:keyValue[0],query:keyValue[1]}
};
url.parseParam=function(p){var custom=/\}\{/,obj={},tmp_;
if(p&&custom.test(p)){tmp_=p.replace(/\}\{/,"}${");
tmp_=tmp_.split("$");
obj[tmp_[0]]=p
}else{if(p&&p.indexOf("=")>-1){tmp_=p.split("=");
obj[tmp_[0]]=p
}else{if(p){obj[p]=p
}}}return obj
};
url.getParam=function(url,key){var query=this.queryToObj(url);
return query[key]||""
};
url.setParam=function(url,key,value){var urlParts,query,queryIndex,hashIndex,before,after,queryString,k;
if(typeof url!=="string"){return""
}urlParts=/^([^?#]*)(\?[^#]*)?(\#.*)?$/i.exec(url);
before=urlParts[1]||"";
after=urlParts[3]||"";
query=this.queryToObj(url);
query[key]=value;
beforeUrlQuery=url.substring(0,queryIndex);
afterUrlQuery=url.substring(hashIndex,url.length);
queryString="?";
for(k in query){if(query.hasOwnProperty(k)){if(queryString.length>1){queryString+="&"
}queryString+=k+"="+query[k]
}}return before+queryString+after
};
return url
})(jQuery);
BBV.namespace("orion.util").analytics=orion.util.analytics||(function($){analytics.set={loginStatus:function(){if(window.analytics.vars.loginStatus!==""){return
}window.analytics.vars.loginStatus=BBV.utils.cookie("orionuser").exists;
return window.analytics.vars.loginStatus
},customerId:function(){if(window.analytics.vars.customerId!==""){return
}window.analytics.vars.customerId=BBV.utils.cookie("orionuser").get("customer")?BBV.utils.cookie("orionuser").get("customer").id:null;
return window.analytics.vars.customerId
},username:function(){if(window.analytics.vars.username!==""){return
}window.analytics.vars.username=BBV.utils.cookie("orionuser").get("username")?BBV.utils.cookie("orionuser").get("username"):null;
return window.analytics.vars.username
},deviceCode:function(){if(window.analytics.vars.deviceCode!==""){return
}window.analytics.vars.deviceCode=BBV.utils.cookie("orionuser").get("deviceCode")?BBV.utils.cookie("orionuser").get("deviceCode"):null;
return window.analytics.vars.deviceCode
},stbType:function(){if(window.analytics.vars.stbType!==""){return
}window.analytics.vars.stbType=BBV.utils.cookie("orionuser").get("stbType")?BBV.utils.cookie("orionuser").get("stbType"):null;
return window.analytics.vars.stbType
},productString:function(productString){if(window.analytics.vars.productString!==""){return
}window.analytics.vars.productString=productString;
return window.analytics.vars.productString
},offerId:function(offerId){if(window.analytics.vars.offerId!==""){return
}window.analytics.vars.offerId=offerId;
return window.analytics.vars.offerId
},mediaGroupName:function(mediaGroupName){if(window.analytics.vars.mediaGroupName!==""){return
}window.analytics.vars.mediaGroupName=mediaGroupName;
return window.analytics.vars.mediaGroupName
},mediaGroupID:function(mediaGroupID){if(window.analytics.vars.mediaGroupID!==""){return
}window.analytics.vars.mediaGroupID=unescape(mediaGroupID.replace(/~~2F/g,"/"));
return window.analytics.vars.mediaGroupID
},mediaItemID:function(mediaItemID){if(window.analytics.vars.mediaItemID!==""){return
}window.analytics.vars.mediaItemID=unescape(mediaItemID.replace(/~~2F/g,"/"));
return window.analytics.vars.mediaItemID
},mediaProviderId:function(mediaProviderId){if(window.analytics.vars.mediaProviderId!==""){return
}window.analytics.vars.mediaProviderId=mediaProviderId;
return window.analytics.vars.mediaProviderId
},mediaCategoriesId:function(mediaCategoriesId){if(window.analytics.vars.mediaCategoriesId!==""){return
}window.analytics.vars.mediaCategoriesId=mediaCategoriesId;
return window.analytics.vars.mediaCategoriesId
},mediaCategoriesTitle:function(mediaCategoriesTitle){if(window.analytics.vars.mediaCategoriesTitle!==""){return
}window.analytics.vars.mediaCategoriesTitle=mediaCategoriesTitle;
return window.analytics.vars.mediaCategoriesTitle
},mediaVodType:function(mediaVodType){if(window.analytics.vars.mediaVodType!==""){return
}window.analytics.vars.mediaVodType=mediaVodType;
return window.analytics.vars.mediaVodType
},mediaSeasonNumber:function(mediaSeasonNumber){if(window.analytics.vars.mediaSeasonNumber!==""){return
}window.analytics.vars.mediaSeasonNumber=mediaSeasonNumber;
return window.analytics.vars.mediaSeasonNumber
},mediaSeasonEpisodeNumber:function(mediaSeasonEpisodeNumber){if(window.analytics.vars.mediaSeasonEpisodeNumber!==""){return
}window.analytics.vars.mediaSeasonEpisodeNumber=mediaSeasonEpisodeNumber;
return window.analytics.vars.mediaSeasonEpisodeNumber
},mediaSeriesEpisodeNumber:function(mediaSeriesEpisodeNumber){if(window.analytics.vars.mediaSeriesEpisodeNumber!==""){return
}window.analytics.vars.mediaSeriesEpisodeNumber=mediaSeriesEpisodeNumber;
return window.analytics.vars.mediaSeriesEpisodeNumber
},mediaGroupProviderId:function(mediaGroupProviderId){if(window.analytics.vars.mediaGroupProviderId!==""){return
}window.analytics.vars.mediaGroupProviderId=mediaGroupProviderId;
return window.analytics.vars.mediaGroupProviderId
},mediaGroupTitle:function(mediaGroupTitle){if(window.analytics.vars.mediaGroupTitle!==""){return
}window.analytics.vars.mediaGroupTitle=mediaGroupTitle;
return window.analytics.vars.mediaGroupTitle
},mediaGroupCategoriesId:function(mediaGroupCategoriesId){if(window.analytics.vars.mediaGroupCategoriesId!==""){return
}window.analytics.vars.mediaGroupCategoriesId=mediaGroupCategoriesId;
return window.analytics.vars.mediaGroupCategoriesId
},mediaGroupCategoriesTitle:function(mediaGroupCategoriesTitle){if(window.analytics.vars.mediaGroupCategoriesTitle!==""){return
}window.analytics.vars.mediaGroupCategoriesTitle=mediaGroupCategoriesTitle;
return window.analytics.vars.mediaGroupCategoriesTitle
},channelName:function(channelName){if(window.analytics.vars.channelName!==""){return
}window.analytics.vars.channelName=channelName;
return window.analytics.vars.channelName
},channelId:function(channelId){if(window.analytics.vars.channelId!==""){return
}window.analytics.vars.channelId=channelId;
return window.analytics.vars.channelId
}};
analytics.trackEvent=function(type,options){if(window.s&&type==="action"){s.record(options)
}};
analytics.prototype.handlers=function(e){var self=this;
var $analyticsContext=$('[data-module-type="ContentDiscovery"], [data-module-type="ASpot"], [data-module-type="Playlist"], [data-module-type="Recommendations"], [data-module-type="MyRentals"], #dialog-container');
$analyticsContext.delegate(".content-list a[href]","click",self.updateQueryString)
};
analytics.prototype.updateQueryString=function(e){var self=this;
var $elem=$(e.target).closest("a");
var target=$elem.attr("href");
var delimeter=orion.util.url.readUrlString(target).query?"&":"?";
var $container=$elem.closest(".dialog").length?$elem.closest(".dialog"):$elem.closest(".module");
var id=$elem.closest(".dialog").length?$container.attr("id"):$container.data("module-type");
var actionElement=$container.find("header h1").length?"&actionElement="+encodeURIComponent($container.find("header h1").text()):"";
var newHref=target+delimeter+"previousAction="+id+actionElement;
$elem.attr("href",newHref)
};
analytics.prototype.setUserVars=function(e){var analytics=orion.util.analytics;
analytics.set.loginStatus();
analytics.set.customerId();
analytics.set.username();
analytics.set.deviceCode();
analytics.set.stbType()
};
analytics.prototype.triggerQueue=function(e){if(!window.analyticsQueue){return
}$.each(window.analyticsQueue,function(){(window.analyticsQueue.shift())()
})
};
function analytics(){var self=this;
if(!window.analytics){window.analytics={vars:{}}
}else{if(!window.analytics.vars){window.analytics.vars={}
}}window.analytics.vars={loginStatus:"",customerId:"",username:"",deviceCode:"",stbType:"",productString:"",offerId:"",mediaGroupName:"",mediaGroupID:"",mediaItemID:"",mediaProviderId:"",mediaCategoriesId:"",mediaCategoriesTitle:"",mediaVodType:"",mediaSeasonNumber:"",mediaSeasonEpisodeNumber:"",mediaSeriesEpisodeNumber:"",mediaGroupProviderId:"",mediaGroupTitle:"",mediaGroupCategoriesId:"",mediaGroupCategoriesTitle:"",channelName:"",channelId:""};
self.handlers();
self.setUserVars();
self.triggerQueue();
return self
}return analytics
})(jQuery);
BBV.namespace("orion.util").AdultAdapter=orion.util.AdultAdapter||(function($){var PIN_DIALOG="pin-verification";
var PIN_VERIFIED="pinVerified";
var LOGIN_DIALOG="login";
var BOXART_MEDIUM="boxart-medium";
var $sections;
var sectionDataHistory;
AdultAdapter.prototype.renderTitle=function(elem,item){elem.prepend(item.title)
};
AdultAdapter.prototype.renderSeasonEpisodeNumber=function(elem,item){elem.text(item.seasonEpisodeNumber)
};
AdultAdapter.prototype.renderSeasonNumber=function(elem,item){elem.text(item.seasonNumber)
};
AdultAdapter.prototype.renderSecondaryTitle=function(elem,item){elem.text("&ldquo;"+item.secondaryTitle+"&rdquo;")
};
AdultAdapter.prototype.renderStillMedium=function(elem,item){var $img=$("<img />");
$.each(item.images,function(index,image){if(image.assetType==BOXART_MEDIUM){$img.attr({src:image.url,width:image.width,height:image.height,alt:item.title})
}});
elem.prepend($img)
};
AdultAdapter.prototype.renderPreviewLink=function(elem,item){log("AdultAdapter.renderPreviewLink -> stub")
};
AdultAdapter.prototype.renderFacebookLike=function(elem,item){elem.attr({"data-asset-name":item.title})
};
AdultAdapter.prototype.renderDescription=function(elem,item){elem.text(item.description)
};
function unique(arr){var a=arr.concat();
for(var i=0;
i<a.length;
++i){for(var j=i+1;
j<a.length;
++j){if(a[i]===a[j]){a.splice(j,1)
}}}return a
}function AdultAdapter(){var self=this;
$sections=$(document).find("[data-adult-section]");
sectionDataHistory={};
$.each($sections,function(index,section){var sectionType=$(section).data("adult-section");
var sectionId;
var sectionToRequest;
if(sectionType=="media-item-id"){sectionId=$(section).data("media-id");
self.requestSectionData(sectionId,section,orion.oesp.mediaItemEndpoint.requestMediaItem)
}else{sectionId=$(section).data("group-id");
self.requestSectionData(sectionId,section,orion.oesp.mediaGroupEndpoint.requestFormattedMediaGroup)
}})
}AdultAdapter.prototype.requestSectionData=function(id,section,method){var self=this;
if(sectionDataHistory[id]!=undefined){$.when(orion.oesp.session).done(function(session){if(self.hasPermission(session)){self.render(session,sectionDataHistory[id],section)
}})
}else{$.when(orion.oesp.session,method(id)).done(function(session,data){if(self.hasPermission(session)){sectionDataHistory[id]=data;
self.render(session,data,section)
}})
}};
AdultAdapter.prototype.hasPermission=function(session){var loginDialog;
var pinDialog;
if(session.isAuthenticated()){if(!session.isPinVerified()){pinDialog=orion.app.dialogManager.getDialog(PIN_DIALOG);
pinDialog.centerOn(window);
pinDialog.show();
pinDialog.setFocus();
pinDialog.bind(PIN_VERIFIED,function(){window.location.reload()
});
return false
}}else{loginDialog=orion.app.dialogManager.getDialog(LOGIN_DIALOG);
loginDialog.centerOn(window);
loginDialog.show();
return false
}return true
};
AdultAdapter.prototype.render=function(session,item,section){var self=this;
var elements=$(section).find("[data-adult]");
$.each(elements,function(index,element){var $element=$(element);
var type=$element.data("adult");
type=type[0].toUpperCase()+type.slice(1);
var method="render"+type.replace(/-([a-z])/g,function(g){return g[1].toUpperCase()
});
if(self[method]&&typeof self[method]=="function"){self[method]($element,item)
}else{log("AdultAdapter.render -> method: "+method);
log("AdultAdapter.render -> does not exist")
}})
};
return AdultAdapter
})(jQuery);
BBV.namespace("orion.util").time=orion.util.time||(function($){var time={};
time.timeFrameInMilliseconds=function(amount,type){var multiplier=0;
switch(type){case"seconds":multiplier=1000;
break;
case"minutes":multiplier=60000;
break;
case"hours":multiplier=3600000;
break;
case"days":multiplier=86400000;
break;
case"weeks":multiplier=604800000;
break
}if(multiplier===0){throw ("orion.util.time.timeFrameInMilliseconds -> Invalid time frame type: "+type)
}return amount*multiplier
};
time.roundTo30Minutes=function(date){date=date||new Date();
date.setMinutes(Math.floor(date.getMinutes()/30)*30);
date.setSeconds(0);
date.setMilliseconds(0);
return date
};
time.addTime=function(date,amount,type){return new Date(date.getTime()+time.timeFrameInMilliseconds(amount,type))
};
return time
}(jQuery));
