BBV.namespace("orion.oesp").routes=orion.oesp.routes||BBV.settings.oespRoutes;
BBV.namespace("orion.oesp.res").ServerResource=orion.oesp.res.ServerResource||(function($){function ServerResource(data,session){var self=this;
var protectedData={session:session};
self.inflate(data);
self.getProtectedData=function(){return protectedData
};
return self
}ServerResource.prototype.inflate=function(data){var schema=this.constructor.schema;
var prop;
if(schema){for(prop in schema){if(schema.hasOwnProperty(prop)){if(prop in data){if(typeof schema[prop]=="function"){this[prop]=schema[prop](data[prop])
}else{this[prop]=data[prop];
if(typeof schema[prop]!==typeof data[prop]){log("While constructing an instance of",this.prototype.constructor,"the property",prop,"was expected to be of type",typeof schema[prop],"but was instead of type",typeof data[prop])
}}}else{log("While constructing an instance of",this.prototype.constructor,"an expected property,",prop+",","was not found.","the default value of",schema[prop],"will be used");
if(typeof schema[prop]=="function"){this[prop]=schema[prop]()
}else{this[prop]=schema[prop]
}}}}for(prop in data){if(data.hasOwnProperty(prop)){if(!(prop in schema)){log("While constructing an instance of",this.prototype.constructor,"an unexpected property,",prop+",","was not found on the data returned by the server.")
}}}}else{for(prop in data){if(data.hasOwnProperty(prop)){this[prop]=data[prop]
}}}};
ServerResource.prototype.toString=function(){return JSON.stringify(this)
};
return ServerResource
})(jQuery);
BBV.namespace("orion.oesp.res").Session=orion.oesp.res.Session||(function($,ServerResource){function Session(data,authenticated){var self=this;
ServerResource.call(self,data,self);
self.getProtectedData().isAuthenticated=authenticated
}orion.util.inherits(Session,ServerResource);
Session.prototype.isAuthenticated=function(){var self=this;
return self.getProtectedData().isAuthenticated
};
Session.prototype.hasEntitlement=function(entitlementId){var self=this;
var i,length;
var type=$.type(entitlementId);
var entitled=false;
if(type=="array"){length=entitlementId.length;
for(i=0;
i<length&&!entitled;
i++){entitled=self.hasEntitlement(entitlementId[i])
}}else{length=self.entitlements.length;
for(i=0;
i<length&&!entitled;
i++){if(self.entitlements[i]===entitlementId){entitled=true
}}}return entitled
};
Session.prototype.hasRbEntitlement=function(entitlementId){var self=this;
var i,length;
var type=$.type(entitlementId);
var entitled=false;
if(type=="array"){length=entitlementId.length;
for(i=0;
i<length&&!entitled;
i++){entitled=self.hasRbEntitlement(entitlementId[i])
}}else{if(!self.rbEntitlements){self.rbEntitlements=self.entitlements
}length=self.rbEntitlements?self.rbEntitlements.length:0;
for(i=0;
i<length&&!entitled;
i++){if(self.rbEntitlements[i]===entitlementId){entitled=true
}}}return entitled
};
Session.prototype.isAdult=function(asset){var self=this;
if(asset.isAdult){return true
}else{return false
}};
Session.prototype.requiresParentalPin=function(asset){var self=this;
var ratingCodes;
if(!asset.parentalRating){return false
}return BBV.inArray(asset.parentalRating,self.getValidRatingCodes())==-1
};
Session.prototype.getValidRatingCodes=function(){var self=this;
var profileSettings=self.profileSettings;
var parentalSettings;
var unrestrictedContentRatingCodes;
if(profileSettings){parentalSettings=profileSettings.parentalSettings
}if(parentalSettings){unrestrictedContentRatingCodes=parentalSettings.unrestrictedContentRatingCodes
}if($.type(unrestrictedContentRatingCodes)=="array"){return unrestrictedContentRatingCodes
}else{return[]
}};
Session.prototype.isVip=function(){var self=this;
if(self.customer&&$.isArray(self.customer.status)){return $.inArray("vip",self.customer.status)>-1
}else{return false
}};
Session.prototype.isPinVerified=function(){var self=this;
return self.parentalPinVerified
};
Session.prototype.isAdultPinVerified=function(){return this.adultPinVerified
};
Session.prototype.isPinDefault=function(){var self=this;
return self.profileSettings.pinSettings.isDefault
};
Session.prototype.getPermissionToPlayMediaItem=function(mediaItem){var self=this;
var purchaseRequest;
var permission=$.Deferred();
var adultPinRequired=self.isAdult(mediaItem)&&!self.adultPinVerified;
var parentalPinRequired=self.requiresParentalPin(mediaItem)&&!self.parentalPinVerified;
if(adultPinRequired){permission.reject(self.isAuthenticated()?"adultpin":"login")
}else{if(self.hasEntitlement(mediaItem.entitlements)&&!parentalPinRequired){permission.resolve()
}else{if(self.hasEntitlement(mediaItem.entitlements)){permission.reject(self.isAuthenticated()?"parentalpin":"login")
}else{if(mediaItem.isTvod()&&self.isAuthenticated()){doTvodCheck(mediaItem,permission,parentalPinRequired)
}else{permission.reject(self.isAuthenticated()?"upgrade":"login")
}}}}return permission.promise()
};
function doTvodCheck(mediaItem,permission,parentalPinRequired){log("performing tvod check");
purchaseRequest=orion.oesp.purchaseEndpoint.requestActivePurchases();
purchaseRequest.done(function(data){var i,l;
var purchases=data.products;
var purchase;
var entitled;
if(!purchases.length){permission.reject("upgrade")
}else{for(i=0,l=purchases.length;
i<l&&!entitled;
i++){purchase=purchases[i];
if(mediaItem.hasCurrentTvodProductId(purchase.id)&&purchase.isEntitled){entitled=true
}}if(!entitled){permission.reject("purchase")
}else{if(parentalPinRequired){permission.reject("parentalpin")
}else{permission.resolve()
}}}});
purchaseRequest.fail(function(){permission.reject("oesp")
})
}Session.prototype.getPermissionToPlayChannel=function(channel){var self=this;
var permission=$.Deferred();
var stationRequest;
stationRequest=channel.requestCurrentStation();
stationRequest.done(function(station){station.requestCurrentProgram().done(function(program){var ratingCodes=self.getValidRatingCodes();
var adultPinRequired=self.isAdult(program)&&!self.adultPinVerified;
var parentalPinRequired=self.requiresParentalPin(program)&&!self.parentalPinVerified;
if(!self.isAuthenticated()){permission.reject("login")
}else{if(self.isVip()){if(adultPinRequired){permission.reject("adultpin")
}else{if(parentalPinRequired){permission.reject("parentalpin")
}else{permission.resolve()
}}}else{if(!self.hasEntitlement(station.entitlements)){permission.reject("upgrade")
}else{if(adultPinRequired){permission.reject("adultpin")
}else{if(parentalPinRequired){permission.reject("parentalpin")
}else{permission.resolve()
}}}}}}).fail(function(){log("orion.widgets.VideoPlayer: unable to aquire current program")
})
}).fail(function(){log("orion.widgets.VideoPlayer: failed to aquire station or session")
});
return permission.promise()
};
Session.prototype.setModuleState=function(module){var self=this;
if(self.isAuthenticated()){orion.Playlist.setState(module);
orion.app.recommendations.updateRatedItems(module);
self.checkEntitlements(module)
}return self
};
Session.prototype.setModuleStateAll=function(){var self=this;
var $modules=$("[data-module-type]");
$modules.each(function(){self.setModuleState($(this))
})
};
Session.prototype.checkEntitlements=function(module){var self=this;
var $module=$(module);
var selector="[data-media-entitlements]";
var lock=".locked";
var items=$module.is(selector)?$module:$module.find(selector);
items.each(function(){var item=$(this);
var entitlement=item.data("media-entitlements").split(",");
if(self.hasEntitlement(entitlement)){item.find(lock).hide()
}});
return self
};
return Session
})(jQuery,orion.oesp.res.ServerResource);
BBV.namespace("orion.oesp.res").Media=orion.oesp.res.Media||(function($,ServerResource){function Media(data,session){log("Creating media");
ServerResource.call(this,data,session)
}orion.util.inherits(Media,ServerResource);
Media.prototype.isEpisode=function(){return this.mediaType==="Episode"
};
Media.prototype.isPlayable=function(){var self=this;
return !self.isMediaGroup()||self.medium&&self.medium.toLowerCase()==="movie"
};
Media.prototype.isTVOD=function(){return this.hasVodType("TVOD")
};
Media.prototype.isSVOD=function(){return this.hasVodType("SVOD")
};
Media.prototype.buildCategoryUrl=function(genre){var self=this;
var url=[genre];
if(self.medium){url.unshift(BBV.settings.site.urls.category[self.medium.toLowerCase()])
}return url.join("")
};
Media.prototype.getCategoryUrl=Media.prototype.buildCategoryUrl;
Media.prototype.buildMediaUrl=function(){var self=this;
var url;
if(self.isMediaGroup()){url=[encodeURIComponent(self.id),self.encodeTitle()];
if(self.medium){url.unshift(BBV.settings.site.urls.mediagroup[self.medium.toLowerCase()])
}else{log("Broken mediagroup, missing medium on id: "+encodeURIComponent(this.id)+" title: "+this.encodeTitle())
}}else{if(self.isTV()){url=[encodeURIComponent(this.mediaGroupId),this.encodeTitle(),encodeURIComponent(this.id),this.encodeTitle(this.secondaryTitle)];
url.unshift(BBV.settings.site.urls.media.tv)
}else{if(self.isMovie()){url=[encodeURIComponent(self.mediaGroupId),self.encodeTitle(),encodeURIComponent(self.id),this.encodeTitle(this.secondaryTitle)];
url.unshift(BBV.settings.site.urls.media.movie)
}}}return url===undefined?"#":url.join("/")+".html"
};
Media.prototype.getMediaUrl=Media.prototype.buildMediaUrl;
Media.prototype.isEntitlementLocked=function(){var self=this;
var session=self.getProtectedData().session;
if(session.customer&&$.isArray(session.customer.status)){return $.inArray("vip",session.customer.status)>-1
}else{return false
}};
Media.prototype.encodeTitle=function(title_){var title=title_||this.title;
title=title.replace(/ /g,"-").replace(/\//g,"~");
return encodeURI(title)
};
Media.prototype.formatLength=function(){var duration=this.videos&&this.videos[0]?this.videos[0].duration:0;
return BBV.utils.time.format(duration)
};
Media.prototype.getImg=function(){var images=this.images,imgType=this.imageType||"",imgStyle=imgType.split("-")[0],imgSize=imgType.split("-")[1],img="";
BBV.each(images,function(idx,itm){if(itm.assetType===imgStyle+"-"+imgSize){img=itm.url;
return false
}});
return img
};
Media.prototype.getBoxArtSmall=function(){var images=this.images,img="";
BBV.each(images,function(idx,itm){if(itm.assetType==="boxart-small"){img=itm.url;
return false
}});
return img
};
Media.prototype.getBoxArtMedium=function(){var images=this.images,img="";
BBV.each(images,function(idx,itm){if(itm.assetType==="boxart-medium"){img=itm.url;
return false
}});
return img
};
Media.prototype.getStillArtMedium=function(){var images=this.images,img="";
BBV.each(images,function(idx,itm){if(itm.assetType==="still-medium"){img=itm.url;
return false
}});
return img
};
Media.prototype.getChildMedias=function(){var media=this.currentChildMediaTypeCounts,display=[],itm=[];
BBV.each(media,function(name,value){i18nName=value>1?name.replace(" ","")+"Plural":name.replace(" ","");
mediaType=BBV.settings.i18n.mediaType[i18nName];
itm.push(value+" ");
itm.push(mediaType);
display.push(itm.join(""));
itm=[]
});
return display.join(", ")
};
Media.prototype.getMedium=function(){i18nName=value>1?this.medium+"Plural":this.medium;
return BBV.settings.i18n.medium[i18nName]
};
Media.prototype.getGenre=function(){var genres=[],data=this;
var uniqueCategories=BBV.unique(data.categories,function(x,y){if(x.id!=null&&y.id!=null){var categoryX=BBV.settings.i18n.genreMap[x.id]||{title:null},categoryY=BBV.settings.i18n.genreMap[y.id]||{title:null};
return categoryX.title===categoryY.title
}return false
});
BBV.each(uniqueCategories,function(idx,genre){var category;
if(genre.id!==null){category=BBV.settings.i18n.genreMap[genre.id]||{title:null};
if(category.title!==null){genres.push('<a href="'+data.buildCategoryUrl(genre.id)+'">'+category.title+"</a>")
}}});
return genres.join(", ")
};
Media.prototype.getFormattedDate=function(){return BBV.utils.date(this.latestOfferStartDate).format(BBV.settings.l10n.date.longformat)
};
Media.prototype.getFormattedAirDate=function(){var airDate=this.program?this.program.airDate:this.airDate;
return BBV.utils.date(parseInt(airDate)).format(BBV.settings.l10n.date.shortformat)
};
Media.prototype.getCurrency=function(){return BBV.settings.currency[this.countryCode].symbol
};
Media.prototype.getDuration=function(){function addZero(digits){return digits<10?"0"+digits:digits
}var endTime=parseInt(this.endTime),startTime=parseInt(this.startTime),duration=endTime-startTime,hour=60*60*1000,minute=60*1000,H=Math.floor(duration/hour),M=Math.floor((duration-(H*hour))/minute),S=duration-(H*hour)-(M*minute),durationFormatted=addZero(H)+":"+addZero(M)+":"+addZero(S);
return durationFormatted
};
Media.prototype.getThumb=function(){var img=this.images,art="";
BBV.each(img,function(idx,itm){if(itm.assetType==="still-small"){art=itm.url
}});
return art
};
Media.prototype.getYear=function(){return BBV.utils.date(this.releaseDate).format("YYYY")
};
Media.prototype.getRunYears=function(){var runYears;
if(!this.endYear||this.startYear==this.endYear){runYears=this.startYear
}else{runYears=this.startYear+"-"+this.endYear
}return runYears
};
Media.prototype.hasCategories=function(){return(this.categories&&this.categories.length)?this.categories.length:0
};
Media.prototype.hasChildMedia=function(){return(this.currentChildMediaTypeCounts&&(this.currentChildMediaTypeCounts.Clip||this.currentChildMediaTypeCounts.Episode||this.currentChildMediaTypeCounts.FeatureFilm))?1:0
};
Media.prototype.hasRunDates=function(){return(this.startYear||this.endYear)
};
Media.prototype.hasParentalRating=function(){return(this.parentalRating)
};
Media.prototype.highestParentalRating=function(){var parentalRating=this.parentalRating?this.parentalRating.split(","):[],highestRating="";
BBV.each(BBV.settings.ratings,function(idxRating,rating){BBV.each(parentalRating,function(idxItem,item){if(rating.rating.toUpperCase()==item.toUpperCase()){highestRating=item.toUpperCase()
}})
});
return(highestRating)
};
Media.prototype.inPlaylist=function(){var playlistIds=[];
$("#playlist .grid-view .media-item").each(function(index,mediaItem){playlistIds.push($(mediaItem).data("media-id").toString())
});
return BBV.inArray(this.id.toString(),playlistIds)==-1?false:true
};
Media.prototype.isExpiring=function(){var today=new Date().getTime(),tomorrow=today+(24*60*60*1000);
return this.expirationDate?this.expirationDate<tomorrow:false
};
Media.prototype.isProductExpiring=function(){var today=new Date().getTime(),tomorrow=today+(24*60*60*1000);
return this.productExpirationDate?this.productExpirationDate<tomorrow:false
};
Media.prototype.isMediaGroup=function(){return BBV.isObj(this.currentChildMediaTypeCounts)
};
Media.prototype.isMovie=function(){return(this.medium==="Movie")
};
Media.prototype.isMovieItem=function(){return(this.medium==="Movie"&&!BBV.isObj(this.currentChildMediaTypeCounts))
};
Media.prototype.isTV=function(){return(this.medium==="TV")
};
Media.prototype.isExpandable=function(){return this.index>=3
};
Media.prototype.isFirstItem=function(){return this.index==0
};
Media.prototype.isLastItem=function(){return this.index==this.length-1
};
Media.prototype.hiddenStart=function(){return this.index==3?'<div class="hidden-items">':""
};
Media.prototype.hiddenEnd=function(){var lastItem=this.length<4?4:this.length;
return this.index==lastItem-1?"</div>":""
};
Media.prototype.lowerCase=function(){return function(text){if(this[text]){return this[text].toLowerCase()
}else{return this[text]
}}
};
Media.prototype.localizeText=function(){return function(text){return" "+this.localStrings[text]+" "
}
};
Media.prototype.hasCurrentProductId=function(productId){var hasId=false;
$.each(this.currentProductIds,function(index,value){if(value===productId){hasId=true;
return
}});
return hasId
};
Media.prototype.hasCurrentTvodProductId=function(productId){var hasId=false;
$.each(this.currentTvodProductIds,function(index,value){if(value===productId){hasId=true;
return
}});
return hasId
};
Media.prototype.hasVodType=function(vodType){if(!("currentVodTypes" in this)){return false
}for(var i=0;
i<this.currentVodTypes.length;
i++){var currentVodType=this.currentVodTypes[i];
currentVodType=currentVodType.replace(/[-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&");
if(new RegExp(currentVodType,"i").test(vodType)){return true
}}return false
};
return Media
})(jQuery,orion.oesp.res.ServerResource);
BBV.namespace("orion.oesp.res").MediaItem=orion.oesp.res.MediaItem||(function($,Media){function MediaItem(data,session){var self=this;
Media.call(self,data,session)
}orion.util.inherits(MediaItem,Media);
MediaItem.DisplayContext={GRID:1,LIST:2,THUMB:3};
MediaItem.prototype.render=function(context){var self=this;
var template;
if(context){switch(context){case MediaItem.DisplayContext.GRID:template=orion.templates.MediaItem;
break;
case MediaItem.DisplayContext.LIST:template=orion.templates.MediaItem;
break;
case MediaItem.DisplayContext.THUMB:template=orion.templates.MediaItem;
break;
default:template=orion.templates.MediaItem;
break
}}else{template=orion.templates.MediaItem
}return Mustache.to_html(template,self)
};
MediaItem.prototype.isTrailer=function(){var self=this;
if(self.mediaType=="Trailer"){return true
}else{return false
}};
MediaItem.prototype.getBackgroundImageUrl=function(){var self=this;
return self.getImageUrlByType("aspot-large")
};
MediaItem.prototype.getImageUrlByType=function(type){var self=this;
var i,len;
if(self.images){len=self.images.length;
for(i=0;
i<len;
i++){if(self.images[i].assetType===type){return self.images[i].url
}}}return""
};
MediaItem.prototype.isPlayable=function(){return true
};
MediaItem.prototype.isTvod=function(){return this.hasVodType("tvod")
};
MediaItem.prototype.isSvod=function(){return this.hasVodType("svod")
};
return MediaItem
})(jQuery,orion.oesp.res.Media);
BBV.namespace("orion.oesp.res").MediaGroup=orion.oesp.res.MediaGroup||(function($,Media){function MediaGroup(data,session){Media.call(this,data,session)
}orion.util.inherits(MediaGroup,Media);
MediaGroup.prototype.render=function(){var self=this;
return Mustache.to_html(orion.templates.MediaGroup,self)
};
MediaGroup.prototype.isPlayable=function(){var self=this;
return self.medium.toLowerCase()==="movie"
};
return MediaGroup
})(jQuery,orion.oesp.res.Media);
BBV.namespace("orion.oesp.res").Bookmark=orion.oesp.res.Bookmark||(function($,ServerResource){function Bookmark(data,session){var self=this;
ServerResource.call(self,data,session)
}orion.util.inherits(Bookmark,ServerResource);
Bookmark.schema={programId:"",offset:0,playState:"",lastUpdated:""};
return Bookmark
})(jQuery,orion.oesp.res.ServerResource);
BBV.namespace("orion.oesp.res").Station=orion.oesp.res.Station||(function($,ServerResource){function Station(data,session){var self=this;
if(!(self instanceof Station)){return new Station(data,session)
}ServerResource.call(self,data,session)
}orion.util.inherits(Station,ServerResource);
Station.prototype.requestCurrentProgram=function(){var self=this;
var deferred=$.Deferred();
var now=new Date();
var year=now.getFullYear();
var month=now.getMonth();
var day=now.getDate();
var hours=now.getHours();
var minutes=(Math.floor(now.getMinutes()/5)*5)%60;
var seconds=0;
var roundedDate=new Date(year,month,day,hours,minutes,seconds).getTime();
var listingsRequest=orion.oesp.listingEndpoint.requestListings({byStationId:self.id,byStartTime:"~"+(roundedDate+2*60*1000),byEndTime:(roundedDate-2*60*1000)+"~"});
listingsRequest.done(function(data){var listings=data.listings;
var postRequestNow=$.now();
var currentProgram;
var i,listing;
for(i=0;
i<listings.length&&!currentProgram;
i++){listing=listings[i];
if(listing.startTime<=postRequestNow&&listing.endTime>=postRequestNow){currentProgram=listing.program
}}if(currentProgram){deferred.resolve(currentProgram)
}else{deferred.reject()
}});
return deferred.promise()
};
return Station
})(jQuery,orion.oesp.res.ServerResource);
BBV.namespace("orion.oesp.res").Channel=orion.oesp.res.Channel||(function($,ServerResource){function Channel(data,session){var self=this;
ServerResource.call(self,data,session)
}orion.util.inherits(Channel,ServerResource);
Channel.prototype.requestCurrentStation=function(){var self=this;
var deferred=$.Deferred();
deferred.resolve(new orion.oesp.res.Station(self.stationSchedules[0].station,self.getProtectedData().session));
return deferred.promise()
};
Channel.prototype.getBackgroundImageUrl=function(){var self=this;
var images=self.stationSchedules[0].station.images;
var i,len;
if(images){len=images.length;
for(i=0;
i<len;
i++){if(images[i].assetType=="aspot-large"){return self.images[i].url
}}}return""
};
Channel.prototype.getName=function(){var self=this;
var station=self.stations||self.stationSchedules;
var name=[];
var i=0;
var l=station.length;
for(;
i<l;
i++){name.push(station[i].station.title)
}return name.join("/")
};
Channel.prototype.extractName=Channel.prototype.getName;
Channel.prototype.getChannelActiveImage=function(){var self=this;
var imgs=self.stations[0].station.images;
var thumb;
BBV.each(imgs,function(idx,val){if(val.assetType==="station-logo-medium"){thumb=val
}});
return(thumb&&thumb.url)?thumb.url:""
},Channel.prototype.getChannelInactiveImage=function(){var self=this;
var imgs=this.stations[0].station.images;
var thumb;
BBV.each(imgs,function(idx,val){if(val.assetType==="station-logo-small"){thumb=val
}});
return(thumb&&thumb.url)?thumb.url:""
};
Channel.prototype.getStationID=function(){var self=this;
var stations=self.stations[0];
return stations.station.id
};
Channel.prototype.getChannelUrl=function(){var self=this;
var id=self.channelId||self.id;
var name=self.extractName()||"";
var urlParts=[id,encodeURIComponent(name.replace(/\s/g,"-").replace(/\//g,"_"))];
var channels=BBV.settings.site.urls.channels;
if(self.hasLiveStream){urlParts.unshift(channels.live)
}else{urlParts.unshift(channels.vod)
}return urlParts.join("/")+".html"
};
return Channel
})(jQuery,orion.oesp.res.ServerResource);
BBV.namespace("orion.oesp.res").Listing=orion.oesp.res.Listing||(function($,ServerResource){function Listing(data,session){var self=this;
ServerResource.call(self,data,session)
}orion.util.inherits(Listing,ServerResource);
Listing.prototype.getBoxArtMedium=function(){var images=this.images,img="";
BBV.each(images,function(idx,itm){if(itm.assetType==="boxart-medium"){img=itm.url;
return false
}});
return img
};
Listing.prototype.getCategoryString=function(){var self=this;
return $.map(self.categories,function(item,index){return item.id||""
}).join(" ")
};
Listing.prototype.getFormattedTime=function(){return msToTime(this.startTime)+"-"+msToTime(this.endTime)
};
Listing.prototype.getUpcomingLink=function(){var self=this;
var link=[BBV.settings.site.urls.search.tvresults,"?q="];
var title=self.title||"";
link.push(encodeURIComponent(title.replace(/\s/g,"+")));
return link.join("")
};
return Listing
})(jQuery,orion.oesp.res.ServerResource);
BBV.namespace("orion.oesp.req").SessionEndpoint=orion.oesp.req.SessionEndpoint||(function($,Session,routes){var SESSION_COOKIE_NAME=BBV.settings.cookie.tokenName;
function SessionEndpoint(){var self=this;
if(!(self instanceof SessionEndpoint)){return new SessionEndpoint()
}self.session=$.Deferred();
self.session.done(function(session){orion.util.oesp.session=session
});
self.sessionPromise=self.session.promise();
self.sessionCookie=BBV.utils.cookie(SESSION_COOKIE_NAME);
if(self.sessionCookie.exists){log("There is a session cookie, testing its credentials.");
self.testCredentials(self.sessionCookie.get("username"),self.sessionCookie.get("oespToken")).success(function testCredentialsSuccess(data){log("Credentials are valid.");
self.session.resolve(new Session(data,true))
}).error(function testCredentialsError(event){if(event.statusCode().status===0){log("SessionEndpoint:: Session check canceled by click before session call completed")
}else{log("Credentials are invalid.");
BBV.utils.cookie.remove(SESSION_COOKIE_NAME);
self.aquireAnonymousCredentials()
}})
}else{self.aquireAnonymousCredentials()
}self.sessionPromise.login=$.proxy(self.login,self);
self.sessionPromise.logout=$.proxy(self.logout,self);
self.sessionPromise.withSession=$.proxy(self.withSession,self);
return self.sessionPromise
}SessionEndpoint.prototype.testCredentials=function(username,oespToken){var req=$.ajax({url:routes.session,type:"GET",data:"{}",dataType:"json",contentType:"application/json",headers:{"X-OESP-Token":oespToken,"X-OESP-Username":username,Accept:"application/json"}});
req.done(function getTimeOffset(d,s,xhr){orion.util.oesp.serverTimeOffset=(new Date(xhr.getResponseHeader("Date"))).getTime()-(new Date()).getTime()
});
return req
};
SessionEndpoint.prototype.aquireAnonymousCredentials=function(){var self=this;
var req=$.ajax(routes.session,{type:"GET",success:function(data,s,xhr){orion.util.oesp.serverTimeOffset=(new Date(xhr.getResponseHeader("Date"))).getTime()-(new Date()).getTime();
self.session.resolve(new Session(data,false))
},error:function(){}});
return req
};
SessionEndpoint.prototype.logout=function logout(callback){var self=this;
self.session.done(function(credentials){if(credentials.isAuthenticated()){$.ajax(routes.session,{type:"DELETE",headers:{"X-OESP-Token":credentials.oespToken,"X-OESP-Username":credentials.username},always:function(){cleanUp()
}})
}else{cleanUp()
}});
function cleanUp(){BBV.user().logout();
callback()
}return self.sessionPromise
};
SessionEndpoint.prototype.login=function(username,password){var self=this;
return self.session.pipe(function(credentials){return $.ajax(routes.session,{dataType:"json",contentType:"application/json",type:"POST",headers:{"X-OESP-Token":credentials.oespToken,"X-OESP-Username":credentials.username,Accept:"application/json"},data:JSON.stringify({username:username,password:password})})
}).pipe(function(data){return new Session(data,true)
})
};
SessionEndpoint.prototype.withSession=function withSession(callback){var self=this;
self.session.done(callback);
return self.sessionPromise
};
return SessionEndpoint
})(jQuery,orion.oesp.res.Session,orion.oesp.routes);
BBV.namespace("orion.oesp").Request=orion.oesp.req.request||(function($){var DEFAULT_OPTIONS={cache:true,dataType:"json",timeout:10000,processData:false,oespSessionOverride:null,contentType:"application/json",headers:{Accept:"application/json"},xhrFields:{withCredentials:true}};
function Request(url,options,format){if(url&&typeof url=="object"){formatter=options;
options=url;
url=undefined
}options=options||{};
if(!options.url){if(typeof url=="string"){options.url=url
}else{throw new Error("Request is missing a URL")
}}function makeRequest(session){var jqxhr;
var headers={headers:{"X-OESP-Token":session.oespToken,"X-OESP-Username":session.username}};
options=$.extend(true,headers,DEFAULT_OPTIONS,options);
jqxhr=$.ajax(options);
if(format){return jqxhr.pipe(function(data){return format(data,session)
})
}else{return jqxhr
}}if(!!options.oespSessionOverride){log("overriding session");
return makeRequest(options.oespSessionOverride)
}else{return orion.oesp.session.pipe(makeRequest)
}}return Request
})(jQuery);
BBV.namespace("orion.oesp.req").Endpoint=orion.oesp.req.Endpoint||(function($){function Endpoint(){}Endpoint.prototype.encode=function(data){var stringified;
if(typeof data=="object"){if(data.toString&&data.toString!=Object.prototype.toString&&typeof data.toString=="function"){stringified=data.toString();
if(stringified!="[object Object]"){data=stringified
}}if(typeof data=="object"){data=JSON.stringify(data)
}}return data
};
Endpoint.prototype.queryToString=function(query){var param;
var queryStringBuilder=[];
if(!query){return""
}for(param in query){if(query.hasOwnProperty(param)){queryStringBuilder.push(param+"="+query[param])
}}return queryStringBuilder.join("&")
};
return Endpoint
})(jQuery);
BBV.namespace("orion.oesp.req").PurchaseEndpoint=orion.oesp.req.PurchaseEndpoint||(function($,routes,Request,Endpoint){function requestMediaItems(isAdultVerified){var self=this;
var deferred=$.Deferred();
self.done(function(data){var productIds;
var query;
var mediaItemRequest;
if(data&&data.products&&$.type(data.products)=="array"&&data.products.length){productIds=$.map(data.products,function(product){return product.id
}).join("|");
log("productIds",productIds);
query={byProductIds:productIds,includeInactive:true};
if(isAdultVerified){query.includeAdult=true
}mediaItemRequest=orion.oesp.mediaItemEndpoint.requestMediaItems(query);
mediaItemRequest.done(function(mediaItems){deferred.resolve(mediaItems)
})
}else{deferred.reject()
}});
return deferred.promise()
}function PurchaseEndpoint(){Endpoint.call(this)
}orion.util.inherits(PurchaseEndpoint,Endpoint);
PurchaseEndpoint.prototype.makePurchase=function(productId,offerId,pw){var self=this;
var url=routes.purchase;
var options={type:"POST",data:self.encode({productId:productId,offerId:offerId,credential:pw})};
var request=new Request(url,options);
return request
};
PurchaseEndpoint.prototype.requestActivePurchases=function(){var self=this;
var url=routes.purchaseactive;
var options={type:"GET"};
var request=new Request(url,options);
request.requestMediaItems=requestMediaItems;
return request
};
PurchaseEndpoint.prototype.requestProductOffers=function(productId){var self=this;
var url=routes.purchaseoffers+"/"+self.encode(productId);
var options={type:"GET"};
var request=new Request(url,options);
return request
};
PurchaseEndpoint.prototype.requestSetOfProductOffers=function(currentTvodProductIds){var self=this;
var requests=[];
$.each(currentTvodProductIds,function(index,id){requests.push(self.requestProductOffers(id))
});
return $.when.apply($,requests)
};
return PurchaseEndpoint
})(jQuery,orion.oesp.routes,orion.oesp.Request,orion.oesp.req.Endpoint);
BBV.namespace("orion.oesp.req").MediaItemEndpoint=orion.oesp.req.MediaItemEndpoint||(function($,routes,Request,Endpoint,MediaItem,Feed){function MediaItemEndpoint(){Endpoint.call(this)
}orion.util.inherits(MediaItemEndpoint,Endpoint);
var ANY=/.*/;
var NUMBER=/\d+/;
var RANGE=/\d+-\d+/;
var CRID=ANY;
var BOOLEAN=/true|false/;
MediaItemEndpoint.FilterParams={byCategories:ANY,byCategoryIds:CRID,byIsAdult:BOOLEAN,byMediaGroupId:CRID,byMediaType:ANY,byMedium:ANY,byProductIds:CRID,byId:CRID,byProvider:ANY,byProviderId:CRID,byEntitlements:ANY,byTags:ANY,byTitle:ANY,byTitlePrefix:ANY,endIndex:ANY,includeAdult:BOOLEAN,includeInactive:BOOLEAN,range:RANGE,sort:ANY,startIndex:NUMBER};
MediaItemEndpoint.SortParams={secondaryTitle:ANY,tvSeasonEpisodeNumber:ANY,tvSeasonNumber:ANY};
MediaItemEndpoint.queryToString=function(query){var param;
var queryStringBuilder=[];
if(!query){return""
}for(param in query){if(MediaItemEndpoint.FilterParams.hasOwnProperty(param)||MediaItemEndpoint.SortParams.hasOwnProperty(param)){queryStringBuilder.push(param+"="+query[param])
}}return queryStringBuilder.join("&")
};
MediaItemEndpoint.format=function(data,session){if(data.mediaItems){data.mediaItems=$.map(data.mediaItems,function(item){return new MediaItem(item,session)
})
}else{data=new MediaItem(data,session)
}return data
};
MediaItemEndpoint.prototype.requestMediaItem=function(mediaItemId){var self=this;
var url=routes.mediaitems+"/"+mediaItemId;
var options={type:"GET"};
var request=new Request(url,options,MediaItemEndpoint.format);
return request
};
MediaItemEndpoint.prototype.requestAdultMediaItem=function(mediaItemId){var self=this;
var url=routes.mediaitems+"/"+mediaItemId+"&includeAdult=true";
var options={type:"GET"};
var request=new Request(url,options,MediaItemEndpoint.format);
return request
};
MediaItemEndpoint.prototype.requestMediaItems=function(query){var self=this;
var queryString=MediaItemEndpoint.queryToString(query);
var url=routes.mediaitems+"?"+queryString;
var options={type:"GET"};
var request=new Request(url,options,MediaItemEndpoint.format);
return request
};
MediaItemEndpoint.prototype.get=function(query){var self=this;
var url=routes.mediaitems;
var queryString;
var request;
query=query||{};
if(query.id){return self.withMediaItem(query.id)
}queryString=MediaItemEndpoint.queryToString(query);
url+=queryString;
request=new Request(url);
request.done(function(response){var mediaItems=$.map(response.mediaItems,function(item){return new MediaItem(item)
});
feed.set("items",mediaItems)
})
};
return MediaItemEndpoint
})(jQuery,orion.oesp.routes,orion.oesp.Request,orion.oesp.req.Endpoint,orion.oesp.res.MediaItem,orion.oesp.res.Feed);
BBV.namespace("orion.oesp.req").MediaGroupEndpoint=orion.oesp.req.MediaGroupEndpoint||(function($,routes,Request,Endpoint,MediaGroup,Feed){function MediaGroupEndpoint(){Endpoint.call(this)
}orion.util.inherits(MediaGroupEndpoint,Endpoint);
MediaGroupEndpoint.queryToString=function(query){var param;
var queryStringBuilder=[];
if(!query){return""
}for(param in query){queryStringBuilder.push(param+"="+query[param])
}return queryStringBuilder.join("&")
};
MediaGroupEndpoint.format=function(data,session){if(data.mediaGroups){data.mediaGroups=$.map(data.mediaGroups,function(item){return new MediaGroup(item,session)
})
}else{data=new MediaGroup(data,session)
}return data
};
MediaGroupEndpoint.prototype.requestMediaGroup=function(mediaGroupId){var self=this;
var url=routes.mediagroups+"/"+mediaGroupId;
var options={type:"GET"};
var request=new Request(url,options);
return request
};
MediaGroupEndpoint.prototype.requestFormattedMediaGroup=function(mediaGroupId){var self=this;
var url=routes.mediagroups+"/"+mediaGroupId;
var options={type:"GET"};
var request=new Request(url,options,MediaGroupEndpoint.format);
return request
};
MediaGroupEndpoint.prototype.requestMediaGroups=function(query){var self=this;
var queryString=MediaGroupEndpoint.queryToString(query);
var url=routes.mediagroups+"?"+queryString;
var options={type:"GET"};
var request=new Request(url,options);
return request
};
MediaGroupEndpoint.prototype.get=function(query){};
return MediaGroupEndpoint
})(jQuery,orion.oesp.routes,orion.oesp.Request,orion.oesp.req.Endpoint,orion.oesp.res.MediaGroup,orion.oesp.res.Feed);
BBV.namespace("orion.oesp.req").BookmarkEndpoint=orion.oesp.req.BookmarkEndpoint||(function($,routes,Request,Endpoint){function BookmarkEndpoint(){var self=this;
Endpoint.call(self)
}orion.util.inherits(BookmarkEndpoint,Endpoint);
BookmarkEndpoint.prototype.requestBookmarks=function(programId){var self=this;
var maxRequests=40;
var url=routes.bookmarks+(programId?"/"+programId:"")+"?range=1-"+maxRequests;
var options={type:"GET"};
var request=orion.util.oesp.get(url,options);
return request
};
BookmarkEndpoint.prototype.setBookmark=function(bookmark){var self=this;
var url=routes.bookmarks+"/"+bookmark.programId;
var options={type:"PUT",data:bookmark};
var request=orion.util.oesp.put(url,options);
return request
};
BookmarkEndpoint.prototype.clearBookmarks=function(){var self=this;
var url=routes.bookmarks;
var options={type:"DELETE"};
var request=orion.util.oesp.del(url,options);
return request
};
return BookmarkEndpoint
})(jQuery,orion.oesp.routes,orion.oesp.Request,orion.oesp.req.Endpoint);
BBV.namespace("orion.oesp.req").ChannelEndpoint=orion.oesp.req.ChannelEndpoint||(function($,routes,Request,Endpoint,Channel){function ChannelEndpoint(){var self=this;
Endpoint.call(self)
}orion.util.inherits(ChannelEndpoint,Endpoint);
ChannelEndpoint.format=function(data,session){if(data.channels){data.channels=$.map(data.channels,function(item){return new Channel(item,session)
})
}else{data=new Channel(data,session)
}return data
};
ChannelEndpoint.queryToString=function(query){var param;
var queryStringBuilder=[];
if(!query){return""
}for(param in query){if(query.hasOwnProperty(param)){queryStringBuilder.push(param+"="+query[param])
}}return queryStringBuilder.join("&")
};
function _prepChannel(channel,session){if(channel.subChannels.length){var replaceWith;
$.each(channel.subChannels,function(idx,subChannel){var chanEnt=subChannel.stationSchedules[0].station.entitlements;
if(session.hasEntitlement(chanEnt)){replaceWith=subChannel
}});
if(replaceWith){channel=ChannelEndpoint.format(replaceWith,session)
}if(channel.subChannels){delete channel.subChannels
}}return channel
}ChannelEndpoint.prototype.requestChannel=function(channelId){var self=this;
return orion.oesp.session.pipe(function(session){var url=routes.channels+"/"+channelId+"?byLocationId="+session.locationId;
var options={type:"GET"};
var request=new Request(url,options,ChannelEndpoint.format);
request=request.pipe(function(data){return _prepChannel(data,session)
});
return request
})
};
ChannelEndpoint.prototype.requestChannels=function(query){var self=this;
return orion.oesp.session.pipe(function(session){var queryString;
var url;
query=query||{};
query.byLocationId=session.locationId;
queryString=ChannelEndpoint.queryToString(query);
url=routes.channels+"?"+queryString;
var options={type:"GET"};
var request=new Request(url,options,ChannelEndpoint.format);
request=request.pipe(function(data){$.each(data.channels,function(idx,channel){data.channels[idx]=_prepChannel(channel,session)
});
return data
});
return request
})
};
return ChannelEndpoint
})(jQuery,orion.oesp.routes,orion.oesp.Request,orion.oesp.req.Endpoint,orion.oesp.res.Channel);
BBV.namespace("orion.oesp.req").ListingEndpoint=orion.oesp.req.ListingEndpoint||(function($,routes,Request,Endpoint,Listing){function ListingEndpoint(){var self=this;
Endpoint.call(self)
}orion.util.inherits(ListingEndpoint,Endpoint);
ListingEndpoint.format=function(data){if(data.listings){data.listings=$.map(data.listings,function(item){return new Listing(item)
})
}else{data=new Listing(data)
}return data
};
ListingEndpoint.queryToString=function(query){var param;
var queryStringBuilder=[];
if(!query){return""
}for(param in query){if(query.hasOwnProperty(param)){queryStringBuilder.push(param+"="+query[param])
}}return queryStringBuilder.join("&")
};
ListingEndpoint.prototype.requestListing=function(listingId){var self=this;
return orion.oesp.session.pipe(function(session){var url=routes.listings+"/"+listingId+"?byLocationId="+session.locationId;
var options={type:"GET"};
var request=new Request(url,options,ListingEndpoint.format);
return request
})
};
ListingEndpoint.prototype.requestListings=function(query){var self=this;
return orion.oesp.session.pipe(function(session){var queryString;
var url;
query=query||{};
query.byLocationId=session.locationId;
queryString=ListingEndpoint.queryToString(query);
url=routes.listings+"?"+queryString;
var options={type:"GET",timeout:30000};
var request=new Request(url,options,ListingEndpoint.format);
return request
})
};
return ListingEndpoint
})(jQuery,orion.oesp.routes,orion.oesp.Request,orion.oesp.req.Endpoint,orion.oesp.res.Listing);
BBV.namespace("orion.oesp.req").ProfileEndpoint=orion.oesp.req.ProfileEndpoint||(function($,routes,Request,Endpoint){function ProfileEndpoint(){var self=this;
Endpoint.call(self)
}orion.util.inherits(ProfileEndpoint,Endpoint);
ProfileEndpoint.queryToString=function(query){var param;
var queryStringBuilder=[];
if(!query){return""
}for(param in query){if(query.hasOwnProperty(param)){queryStringBuilder.push(param+"="+query[param])
}}return queryStringBuilder.join("&")
};
ProfileEndpoint.prototype.verifyProfilePin=function(pin){var self=this;
var url=routes.profileverifypin;
return self.verifyPin(url,pin)
};
ProfileEndpoint.prototype.verifyParentalPin=function(pin){var self=this;
var url=routes.profileparentalverifypin;
return self.verifyPin(url,pin)
};
ProfileEndpoint.prototype.verifyAdultPin=function(pin){var self=this;
var url=routes.profileadultverifypin;
return self.verifyPin(url,pin)
};
ProfileEndpoint.prototype.verifyPin=function(url,pin){var self=this;
return orion.oesp.session.pipe(function(session){var options={type:"POST",data:JSON.stringify({value:pin}),timeout:20000};
var request=new Request(url,options);
return request
})
};
ProfileEndpoint.prototype.setTerms=function(session,termsVersion){var options={type:"POST",data:JSON.stringify({version:termsVersion}),timeout:20000,oespSessionOverride:session};
var request=new Request(routes.termsset,options);
return request
};
return ProfileEndpoint
})(jQuery,orion.oesp.routes,orion.oesp.Request,orion.oesp.req.Endpoint);
BBV.namespace("orion.oesp.req").PlaylistEndpoint=orion.oesp.req.PlaylistEndpoint||(function($,routes,Request,Endpoint){function PlaylistEndpoint(){Endpoint.call(this)
}orion.util.inherits(PlaylistEndpoint,Endpoint);
PlaylistEndpoint.prototype.createPlaylist=function(name){var self=this;
var url=routes.playlists;
var options={type:"POST",data:self.encode({name:name})};
var request=new Request(url,options);
return request
};
PlaylistEndpoint.prototype.requestPlaylists=function(){var self=this;
var url=routes.playlists;
var options={type:"GET"};
var request=new Request(url,options);
return request
};
PlaylistEndpoint.prototype.requestPlaylistById=function(playlistId){var self=this;
var url=routes.playlists+"/"+self.encode(playlistId);
var options={type:"GET"};
var request=new Request(url,options);
return request
};
PlaylistEndpoint.prototype.updatePlaylist=function(playlistId,name,mediaItems){var self=this;
var url=routes.playlists+"/"+self.encode(playlistId);
var options={type:"PUT",data:self.encode({name:name,mediaItems:mediaItems})};
var request=orion.util.oesp.put(url,options);
return request
};
PlaylistEndpoint.prototype.deletePlaylist=function(playlistId){var self=this;
var url=routes.playlists+"/"+self.encode(playlistId);
var options={type:"DELETE"};
var request=orion.util.oesp.del(url,options);
return request
};
return PlaylistEndpoint
})(jQuery,orion.oesp.routes,orion.oesp.Request,orion.oesp.req.Endpoint);
