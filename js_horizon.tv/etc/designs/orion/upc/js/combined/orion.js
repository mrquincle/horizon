BBV.namespace("orion.util").oesp=orion.util.oesp||(function($){var oesp={};
oesp.xhr={};
oesp.SESSION_URL=$("#login-form").attr("action");
oesp.request=function(type,url,options){options=options||{};
options.type=type;
return new orion.oesp.Request(url,options)
};
oesp.abortRequest=function(xhr){if(xhr){xhr.abort()
}};
oesp.username="";
oesp.token="";
oesp.locationId="";
oesp.user=null;
oesp.get=function(url,options){return this.request("GET",url,options)
};
oesp.post=function(url,options){return this.request("POST",url,options)
};
oesp.del=function(url,options){var parsedUrl;
if(BBV.settings.ajax.supportsPutDelete){return this.request("DELETE",url,options)
}else{parsedUrl=url.indexOf("?")>-1?url+"&_method=DELETE":url+"?_method=DELETE";
return this.request("POST",parsedUrl,options)
}};
oesp.put=function(url,options){var parsedUrl;
if(BBV.settings.ajax.supportsPutDelete){return this.request("PUT",url,options)
}else{parsedUrl=url.indexOf("?")>-1?url+"&_method=PUT":url+"?_method=PUT";
return this.request("POST",parsedUrl,options)
}};
oesp.aquireCredentials=function(callback){orion.oesp.session.done(function(session){callback(session.oespToken,session.username);
if(!oesp.token){oesp.token=session.token;
oesp.username=session.username;
log("setting location id from session");
log(session.locationId);
oesp.locationId=session.locationId;
oesp.user=session
}})
};
BBV.ajax.load=function(url,settings){var settings=settings||{},config=BBV.extend({},BBV.ajax.defaults,settings),type=config.type||"GET";
orion.util.oesp.request(type,url,config)
};
return oesp
})(jQuery);
BBV.namespace("orion.widgets").Dialog=orion.widgets.Dialog||(function($,PubSub){function hasFixedPositionAncestor($elem){var p=$elem.offsetParent();
var pElem=p.get(0);
if(document.body==pElem||$elem.get(0)==pElem){return false
}if(p.css("position")=="fixed"){return true
}return hasFixedPositionAncestor(p)
}function Dialog(){var self=this;
PubSub.call(self);
self.$=null;
self.elem=null;
self.contentArea=null;
self.render()
}orion.util.inherits(Dialog,PubSub);
Dialog.prototype.render=function(){var self=this;
var templateContent={};
var $dialog=$(Mustache.to_html(orion.templates.Dialog,templateContent));
$dialog.delegate(".close-dialog","click",function(e){self._onClose()
});
self.$=$dialog;
self.elem=$dialog.get(0);
self.contentArea=$dialog.find(".dialog-content");
return self
};
Dialog.prototype.setModal=function(isModal){var self=this;
self.modal=isModal
};
Dialog.prototype.setCloseBehavior=function(fn){this._onClose=fn
};
Dialog.prototype._onClose=function(){this.hide()
};
Dialog.prototype.show=function(){var self=this;
var container;
self.$.show();
if(self.modal){container=$("#dialog-container");
container.css({top:0,left:0,bottom:$(body).height(),right:$(body).width()})
}return self
};
Dialog.prototype.hide=function(){this.$.hide();
return this
};
Dialog.prototype.close=function(){var self=this;
self._onClose()
};
Dialog.prototype.pointTo=function(target,pointDirection){var $target=$(target);
var isFixed=hasFixedPositionAncestor($target);
var tPos=$target.offset();
var arrowSize=20;
var centerHorizontal;
var centerVertical;
var top;
var left;
var topSpace;
var bottomSpace;
var $window=$(window);
var scrollTop=$window.scrollTop();
var scrollLeft=$window.scrollLeft();
tPos.top-=isFixed?scrollTop:0;
tPos.left-=isFixed?scrollLeft:0;
tPos.width=$target.outerWidth();
tPos.height=$target.outerHeight();
tPos.bottom=tPos.top+tPos.height;
tPos.right=tPos.left+tPos.width;
centerHorizontal=tPos.left+(tPos.width/2)-(this.$.innerWidth()/2);
centerVertical=tPos.top+(tPos.height/2)-(this.$.innerHeight()/2);
if(!pointDirection){topSpace=tPos.top-scrollTop;
bottomSpace=$window.height()+scrollTop-tPos.bottom;
pointDirection=topSpace>bottomSpace?"down":"up"
}if(pointDirection==="up"){left=centerHorizontal;
top=tPos.bottom+arrowSize
}if(pointDirection==="down"){left=centerHorizontal;
top=tPos.top-this.$.innerHeight()-arrowSize
}if(pointDirection==="left"){left=tPos.right+arrowSize;
top=centerVertical
}if(pointDirection==="right"){left=tPos.left-this.$.innerWidth()-arrowSize;
top=centerVertical
}this.$.css({left:left,top:top,position:isFixed?"fixed":"absolute"});
this.$.removeClass("up down left right");
this.$.addClass(pointDirection)
};
Dialog.prototype.centerOn=function(target){var self=this;
var tw,th,tt,tl,dw,dh,toffset,$target,pos;
var top,left;
if(target==="window"||target===window){$target=$(window);
tt=0;
tl=0;
pos="fixed"
}else{$target=$(target);
toffset=$target.offset();
tt=toffset.top;
tl=toffset.left;
pos="absolute"
}tw=$target.width();
th=$target.height();
dw=self.$.width();
dh=self.$.height();
top=tt+th/2-dh/2;
left=tl+tw/2-dw/2;
self.$.removeClass("up down left right");
self.$.css({top:top,left:left,position:pos})
};
Dialog.prototype.setHtmlContent=function(content){this.contentArea.html(content)
};
Dialog.prototype.setTextContent=function(content){this.contentArea.text(content)
};
Dialog.prototype.startLoadingAnimation=function(){var self=this;
if(!self.isLoaderInitialized){self.$.loader({flow:["overlay"],target:".dialog-inner"});
self.isLoaderInitialized=true
}self.$.trigger("loading")
};
Dialog.prototype.stopLoadingAnimation=function(){var self=this;
self.$.trigger("loaded")
};
return Dialog
})(jQuery,orion.util.PubSub);
BBV.namespace("orion.widgets").TvodDialog=orion.widgets.TvodDialog||(function($,Dialog,DialogManager){function TvodDialog(){var self=this;
self.localStrings=orioni18n.tvodCheckout;
Dialog.call(self);
self.item=null
}function formatPrice(price){if(price){var result=/(\d*[\.\,]\d*)/.exec(price);
if(result&&result.length>0){var priceResult=result[0].replace(",",".");
var priceNum=parseFloat(priceResult);
var priceCents=(priceNum-Math.floor(priceNum));
var priceDollars=priceNum-priceCents;
priceCents=Math.round(priceCents*100);
var priceStr=priceDollars===0?"0.":priceDollars+".";
if(priceCents===0){return priceStr+"00"
}else{if(priceCents<10){return priceStr+"0"+priceCents
}}return priceStr+priceCents
}}return price
}orion.util.inherits(TvodDialog,Dialog);
TvodDialog.prototype.setItem=function(item){var self=this;
self.item=item;
log("TvodDialog rendered with item! ",item);
self.render()
};
TvodDialog.prototype.render=function(){var self=this;
var viewModel={i18n_review_order:self.localStrings.i18n_review_order,i18n_bill_to_account:self.localStrings.i18n_bill_to_account,item:self.item,i18n_about_rentals:self.localStrings.i18n_about_rentals,i18n_by_clicking:self.localStrings.i18n_by_clicking,i18n_enter_pin:self.localStrings.i18n_enter_pin,i18n_buy_now_button:self.localStrings.i18n_buy_now_button,i18n_enter_pin_or:self.localStrings.i18n_enter_pin_or,i18n_why_pin_required:self.localStrings.i18n_why_pin_required,i18n_cancel:self.localStrings.i18n_cancel,i18n_enter_pw:self.localStrings.i18n_enter_pw,i18n_enter_pw_or:self.localStrings.i18n_enter_pw_or,i18n_why_pw_required:self.localStrings.i18n_why_pw_required};
var content=Mustache.to_html(orion.templates.TvodDialog,viewModel);
if(!self.$){Dialog.prototype.render.call(self);
self.bindEvents()
}else{self.setHtmlContent(content);
orion.util.analytics.trackEvent("action",{pageName:"Order Process/Checkout",channel:"Order Process",prop23:"Order Process",prop24:"Order Process",prop26:"Checkout",eVar32:self.item.productId,products:";"+self.item.productId+";1;"+formatPrice(self.item.cost),events:"event9,scCheckout"})
}return self
};
TvodDialog.prototype.bindEvents=function(){var self=this;
if(!self.$){return
}self.$.delegate("#offer-cancel-link, .close-dialog","click",function closeOffer(){self.hide();
orion.util.analytics.trackEvent("action",{pageName:"Order Process/Order Cancelled",channel:"Order Process",prop23:"Order Process",prop24:"Order Process",prop26:"Order Cancelled",eVar32:self.item.productId,products:";"+self.item.productId+";1;"+formatPrice(self.item.cost),events:"event9"});
return false
});
self.$.delegate('.field input[maxlength="1"]',"keydown",function(event){var BACKSPACE=8,TAB=9,DELETE=46,ENTER=13,$this=$(this),siblings=$this.siblings(),pinValue="";
siblings.each(function(){pinValue+=$(this).val()
});
var str=$this.attr("name");
if(!(event.which===DELETE||event.which===BACKSPACE||event.which===TAB||event.which===ENTER)){event.preventDefault();
if((event.which>=48&&event.which<=57)||(event.which>=96&&event.which<=105)){$this.attr("value",String.fromCharCode(event.which>=96?event.which-48:event.which));
if(!(parseInt(str.substring(str.length-1))===4)){$this.next().focus()
}}}else{if(event.which===ENTER){self.$.find("form").submit();
return false
}else{if(event.which===BACKSPACE&&siblings.index($this)!==0){event.preventDefault();
$this.val("").prev().focus()
}}}});
self.$.delegate("form","submit",function submitForm(){if(self.processingOrder===undefined){self.submitOrder()
}arguments[0].preventDefault()
});
self.$.delegate("#buynow","click",function buyNow(){if(self.processingOrder===undefined){self.submitOrder()
}return false
})
};
TvodDialog.prototype.setFocus=function(){var self=this;
if(self.item.isAdult){self.$.find('[name="pin1"]').focus()
}else{self.$.find('[name="pw"]').focus()
}};
TvodDialog.prototype.getProductId=function(){var self=this;
return self.item.productId
};
TvodDialog.prototype.getOfferId=function(){var self=this;
return self.item.offerId
};
TvodDialog.prototype.getPw=function(){var self=this;
if(self.item.isAdult){var pin1=self.$.find('[name="pin1"]').val();
var pin2=self.$.find('[name="pin2"]').val();
var pin3=self.$.find('[name="pin3"]').val();
var pin4=self.$.find('[name="pin4"]').val();
return""+pin1+pin2+pin3+pin4
}else{return self.$.find('[name="pw"]').val()
}};
TvodDialog.prototype.submitOrder=function(){var self=this;
self.processingOrder=true;
var purchaseEndpoint=orion.oesp.purchaseEndpoint;
var purchase;
var productId=self.getProductId();
log("productid",productId);
var offerId=self.getOfferId();
log("offerId",offerId);
var pw=self.getPw();
if(pw.length===0){delete self.processingOrder;
if(self.item.isAdult){self.showPwError(self.localStrings.i18n_pin_invalid)
}else{self.showPwError(self.localStrings.i18n_pw_invalid)
}}else{if(productId&&offerId){self.startLoadingAnimation();
purchase=purchaseEndpoint.makePurchase(productId,offerId,pw);
purchase.done($.proxy(self.orderSuccess,self));
purchase.fail($.proxy(self.orderFail,self));
purchase.always(function afterPurchase(){delete self.processingOrder
})
}}};
TvodDialog.prototype.showPwError=function(errorMessage){var self=this;
var errorField=self.$.find("form.dialog-pw-form .error, form.dialog-pin-form .error");
$(".pin-settings .field","#tvod-checkout").find("input").val("").eq(0).focus();
errorField.text(errorMessage);
errorField.show()
};
TvodDialog.prototype.hidePwError=function(){var self=this;
var errorField=self.$.find("form.dialog-pw-form .error, form.dialog-pin-form .error");
errorField.hide()
};
TvodDialog.prototype.orderSuccess=function(data){var self=this;
orion.util.analytics.trackEvent("action",{pageName:"Order Process/Order Completed",channel:"Order Process",prop23:"Order Process",prop24:"Order Process",prop26:"Order Completed",eVar32:self.item.productId,products:";"+self.item.productId+";1;"+formatPrice(self.item.cost),events:"event9,purchase"});
window.location.reload()
};
TvodDialog.prototype.orderFail=function(error){var self=this;
self.stopLoadingAnimation();
orion.util.analytics.trackEvent("action",{pageName:"Order Process/Incorrect PIN",channel:"Order Process",prop23:"Order Process",prop24:"Order Process",prop26:"Incorrect PIN",eVar32:self.item.productId,products:";"+self.item.productId+";1;"+formatPrice(self.item.cost),events:"event9"});
if(self.item.isAdult){self.showPwError(self.localStrings.i18n_pin_invalid)
}else{self.showPwError(self.localStrings.i18n_pw_invalid)
}};
return TvodDialog
})(jQuery,orion.widgets.Dialog,orion.widgets.DialogManager);
BBV.namespace("orion.widgets").PinChangeDialog=orion.widgets.PinChangeDialog||(function($,Dialog,DialogManager){function PinChangeDialog(){var self=this;
self.localStrings=orioni18n.utilityBar;
Dialog.call(self);
var tmpl=Mustache.to_html(orion.templates.PinChangeDialog,{title:self.localStrings.pinChangeTitle,message:self.localStrings.pinChangeMessage,i18nConfirm:self.localStrings.confirmationDialogButtonConfirm,i18nCancel:self.localStrings.confirmationDialogButtonCancel});
self.setHtmlContent(tmpl);
orion.util.analytics.trackEvent("action",{pageName:"Pin change/Pin change required",channel:"Pin change/Pin change/Pin change required.",prop23:"Pin change",prop24:"Pin change",prop26:"Pin change required",events:"event9"});
self.bindEvents()
}orion.util.inherits(PinChangeDialog,Dialog);
PinChangeDialog.prototype.bindEvents=function(){var self=this;
self.$.delegate(".confirm","click",function(e){self.trigger("accept");
self.hide();
orion.util.analytics.trackEvent("action",{pageName:"Pin change/Pin change accepted",channel:"Pin change",prop23:"Pin change",prop24:"Pin change",prop26:"Pin change accepted",events:"event9"});
return false
});
self.$.delegate(".cancel, .close-dialog","click",function(e){self.trigger("cancel");
self.hide();
orion.util.analytics.trackEvent("action",{pageName:"Pin change/Pin change declined",channel:"Pin change",prop23:"Pin change",prop24:"Pin change",prop26:"Pin change declined",events:"event9"});
return false
})
};
return PinChangeDialog
})(jQuery,orion.widgets.Dialog,orion.widgets.DialogManager);
BBV.namespace("orion.widgets").ResumeDialog=orion.widgets.ResumeDialog||(function($,Dialog,DialogManager){function ResumeDialog(){var self=this;
var prompt=$.Deferred();
Dialog.call(self);
self.$.delegate(".replay a, .close-dialog","click",function(e){e.preventDefault();
self.trigger("replay");
self.hide();
return false
});
self.$.delegate(".resume a","click",function(e){e.preventDefault();
self.trigger("resume");
self.hide();
return false
})
}orion.util.inherits(ResumeDialog,Dialog);
ResumeDialog.prototype.render=function(){var self=this;
Dialog.prototype.render.call(self);
var content=$('[data-module-type="VideoPlayer"] .welcome-back');
self.contentArea.append(content);
content.show();
return self
};
ResumeDialog.prototype.bindEvents=function(){var self=this;
if(!self.$){return
}self.setCloseBehavior(function(){self.$.find(".resume a").click();
self.hide();
return false
})
};
return ResumeDialog
})(jQuery,orion.widgets.Dialog,orion.widgets.DialogManager);
BBV.namespace("orion.widgets").ConfirmationDialog=orion.widgets.ConfirmationDialog||(function($,Dialog){function ConfirmationDialog(){var self=this;
self.$utilityBar=$("#site-utility-bar");
self.localStrings=orioni18n.utilityBar;
self.viewModel={title:self.localStrings.confirmationDialogButtonConfirm,body:"",i18nConfirm:self.localStrings.confirmationDialogButtonConfirm,i18nCancel:self.localStrings.confirmationDialogButtonCancel,i18nClose:self.localStrings.confirmationDialogButtonCancel};
self.setCloseBehavior(function(){self.hide();
self.trigger("cancel")
});
Dialog.call(self)
}orion.util.inherits(ConfirmationDialog,Dialog);
ConfirmationDialog.prototype.setContent=function(_title,_body){var self=this;
self.viewModel.title=_title;
self.viewModel.body=_body;
self.render()
};
ConfirmationDialog.prototype.render=function(){var self=this;
var content=Mustache.to_html(orion.templates.ConfirmationDialog,self.viewModel);
if(!self.$){Dialog.prototype.render.call(self);
self.bindEvents()
}self.$.addClass("confirmation");
self.setHtmlContent(content);
return self
};
ConfirmationDialog.prototype.bindEvents=function(){var self=this;
if(!self.$){return
}self.$.delegate(".close-dialog, .cancel","click",function(){self.hide();
self.trigger("cancel");
return false
});
self.$.delegate(".confirm","click",function(){self.hide();
self.trigger("confirm");
return false
})
};
return ConfirmationDialog
})(jQuery,orion.widgets.Dialog);
BBV.namespace("orion.widgets").PinDialog=orion.widgets.PinDialog||(function($,Dialog){function PinDialog(){log("Initialized PinDialog");
var self=this;
Dialog.call(self);
self.setHtmlContent($("form.dialog-pin-form"));
self.profileUrl=$("#site-navigation-bar").data("profile-url");
self.publisher=orion.app;
self.isPinDefault;
self.$container;
self.pinVerificationType="default";
self.getPinSettings();
self.bindEvents()
}orion.util.inherits(PinDialog,Dialog);
PinDialog.prototype.getPinSettings=function(){var self=this;
orion.oesp.session.done(function(session){self.isPinDefault=session.profileSettings.pinSettings.isDefault;
if(self.isPinDefault){self.$.find("#pin-setup").css("display","block")
}else{self.$.find("#pin-restricted").css("display","block");
self.$.find("#forgot-pin").css("display","block")
}})
};
PinDialog.prototype.setFocus=function(){var self=this;
log("PinDialog: binding keydown event");
self.$.find('[name="pin1"]').focus();
self.$.find(".pin-settings").find("input").keydown(function(event){var BACKSPACE=8;
TAB=9;
DELETE=46,ENTER=13,$this=$(this),siblings=$this.siblings(),pinValue="";
log("keydown: ",event.which);
siblings.each(function(){pinValue+=$(this).val()
});
var str=$this.attr("name");
if(!(event.which===DELETE||event.which===BACKSPACE||event.which===TAB||event.which===ENTER)){event.preventDefault();
log("keydown prevented default (1)");
if((event.which>=48&&event.which<=57)||(event.which>=96&&event.which<=105)){$this.attr("value",String.fromCharCode(event.which>=96?event.which-48:event.which));
if(!(parseInt(str.substring(str.length-1))===4)){$this.next().focus()
}}}else{if(event.which===ENTER){$("form.dialog-pin-form").submit();
return false
}else{if(event.which===BACKSPACE&&siblings.index($this)!==0){event.preventDefault();
log("keydown prevented default (2)");
$this.val("").prev().focus()
}}}})
};
PinDialog.prototype.setVerificationType=function setIsProfilePinVerify(type){var self=this;
self.pinVerificationType=type
};
PinDialog.prototype.bindEvents=function bindEvents(){var self=this;
$(document).delegate("form.dialog-pin-form","submit",function(event){event.preventDefault();
self.form=this;
self.$form=$(this);
self.$error=$(".error",self.$form);
var pin=self.getPin();
self.verifyPin(pin)
});
$(self.$).delegate(".close-dialog","click",function(){log("close dialog triggered");
self.publisher.trigger("pinDialogCancelled")
});
$(self).bind("pinRejected",function(){log("pin rejected triggered");
$(".pin-settings").find("input").val("").eq(0).focus();
self.$error.show()
});
$(self).bind("pinVerified",function(){log("pin verified triggered");
self.$error.hide()
})
};
PinDialog.prototype.verifyPin=function(pin){var self=this;
switch(self.pinVerificationType){case"all":self.pinVerifyAll(pin);
break;
case"profile":self.pinVerifyProfile(pin);
break;
case"adult":self.pinVerifyAdult(pin);
break;
default:self.pinVerifyParental(pin);
break
}};
PinDialog.prototype.getPin=function(){var self=this;
return self.form.pin1.value+self.form.pin2.value+self.form.pin3.value+self.form.pin4.value
};
PinDialog.prototype.showErrorMessage=function(msgHtml){var self=this;
log("Show error msg")
};
PinDialog.prototype.pinVerifyParental=function(pin){var self=this;
var parentalPinRequest=orion.oesp.profileEndpoint.verifyParentalPin(pin);
self.startLoadingAnimation();
parentalPinRequest.done(function(){log("parental/verifypin success");
self.publisher.trigger("pinVerified");
self.trigger("pinVerified");
self.stopLoadingAnimation();
setTimeout(function(){self.startLoadingAnimation()
},1)
}).fail(function(data){self.trigger("pinRejected");
self.stopLoadingAnimation();
log("parental verifypin endpoint failure: ",data)
})
};
PinDialog.prototype.pinVerifyAdult=function(pin){var self=this;
var adultPinRequest=orion.oesp.profileEndpoint.verifyAdultPin(pin);
self.startLoadingAnimation();
adultPinRequest.done(function(){log("adult/verifypin success");
var parentalPinRequest=orion.oesp.profileEndpoint.verifyParentalPin(pin);
self.startLoadingAnimation();
parentalPinRequest.done(function(){log("parental/verifypin success");
self.publisher.trigger("pinVerified");
self.trigger("pinVerified");
self.stopLoadingAnimation();
setTimeout(function(){self.startLoadingAnimation()
},1)
}).fail(function(data){self.trigger("pinRejected");
self.stopLoadingAnimation();
log("parental verifypin endpoint failure: ",data)
})
}).fail(function(data){self.trigger("pinRejected");
self.stopLoadingAnimation();
log("adult verifypin endpoint failure: ",data)
})
};
PinDialog.prototype.pinVerifyProfile=function(pin){var self=this;
var profilePinRequest=orion.oesp.profileEndpoint.verifyProfilePin(pin);
self.startLoadingAnimation();
profilePinRequest.done(function(){log("Profile/verifypin success");
self.publisher.trigger("pinVerified");
self.trigger("pinVerified");
self.stopLoadingAnimation();
setTimeout(function(){self.startLoadingAnimation()
},1)
}).fail(function(data){self.trigger("pinRejected");
self.stopLoadingAnimation();
log("profile verifypin endpoint failure: ",data)
})
};
PinDialog.prototype.pinVerifyAll=function(pin){var self=this;
var profilePinRequest=orion.oesp.profileEndpoint.verifyProfilePin(pin);
self.startLoadingAnimation();
profilePinRequest.done(function(){var parentalPinRequest=orion.oesp.profileEndpoint.verifyParentalPin(pin);
self.startLoadingAnimation();
parentalPinRequest.done(function(){var adultPinRequest=orion.oesp.profileEndpoint.verifyAdultPin(pin);
self.startLoadingAnimation();
adultPinRequest.done(function(){log("profile/verifypin success");
log("parental/verifypin success");
log("adult/verifypin success");
self.publisher.trigger("pinVerified");
self.trigger("pinVerified");
self.stopLoadingAnimation();
setTimeout(function(){self.startLoadingAnimation()
},1)
});
adultPinRequest.fail(function(data){self.trigger("pinRejected");
self.stopLoadingAnimation();
log("adult verifypin endpoint failure: ",data)
})
}).fail(function(data){self.trigger("pinRejected");
self.stopLoadingAnimation();
log("parental verifypin endpoint failure: ",data)
})
}).fail(function(data){self.trigger("pinRejected");
self.stopLoadingAnimation();
log("profile verifypin endpoint failure: ",data)
})
};
return PinDialog
})(jQuery,orion.widgets.Dialog);
BBV.namespace("orion.widgets").LoginDialog=orion.widgets.LoginDialog||(function($,Dialog){function LoginDialog(){var self=this;
Dialog.call(self);
self.$utilityBar=$("#site-utility-bar");
self.localStrings=orioni18n.utilityBar;
self.setContent();
self.bindEvents()
}orion.util.inherits(LoginDialog,Dialog);
LoginDialog.prototype.addError=function(message){var self=this;
var form=self.form;
self.clearError();
form.prepend('<p class="error">'+message+"</p>");
form.addClass("error")
};
LoginDialog.prototype.clearError=function(){var self=this;
var form=self.form;
form.removeClass("error");
form.find("p.error").remove()
};
LoginDialog.prototype.clearLogin=function(session){var self=this;
self.form.find("#login-username-input, #login-password-input").val("");
self.form.find("#login-remember-input").attr("checked",false)
};
LoginDialog.prototype.validate=function(forceValidation){var self=this;
var form=self.form;
var username=form.find("#login-username-input");
var password=form.find("#login-password-input");
var localStrings=orioni18n.utilityBar;
var uError=/^\s*$/.test(username.val())&&(forceValidation||username.hasClass("touched"));
var pError=/^\s*$/.test(password.val())&&(forceValidation||password.hasClass("touched"));
if(uError){username.addClass("error")
}else{username.removeClass("error")
}if(pError){password.addClass("error")
}else{password.removeClass("error")
}if(uError&&!pError){self.addError(localStrings.missingUsername)
}if(!uError&&pError){self.addError(localStrings.missingPassword)
}if(uError&&pError){self.addError(localStrings.missingBoth)
}if(!uError&&!pError){self.clearError()
}return !uError&&!pError
};
LoginDialog.prototype.setContent=function(){var self=this;
var content=$("#login-form");
self.form=content;
self.setHtmlContent(content)
};
LoginDialog.prototype.show=function(){var self=this;
Dialog.prototype.show.call(self);
self.form.find("#login-username-input").focus();
orion.util.analytics.trackEvent("action",{pageName:"Login screen",channel:"Login",prop23:"Login",prop24:"Login",prop26:"Login",events:"event9"})
};
LoginDialog.prototype.bindEvents=function(){var self=this;
var content=self.$;
var form=self.form;
var nameFromCookie=BBV.utils.cookie("rememberUser").get("username");
if(nameFromCookie){content.find("#login-remember-input").prop("checked",true);
content.find("#login-username-input").val(nameFromCookie)
}else{content.find("#login-remember-input").prop("checked",false)
}content.delegate("input","blur",function(){$(this).addClass("touched")
});
content.delegate("input.required","blur change keyup",function(){var cont=$("#login-form-content");
setTimeout(function(){if(self.isValidationEnabled){self.validate()
}},100)
});
content.delegate("#login-forgot","mousedown",function(){self.isValidationEnabled=false
});
content.delegate("#login-forgot","click",function(){var cont=$("#login-form-content");
var info=$("#login-forgot-info");
info.width(cont.width());
cont.hide();
info.show();
self.clearError()
});
content.delegate("#cancel-forgot","click",function(){$("#login-form-content").show();
$("#login-forgot-info").hide();
self.isValidationEnabled=true
});
self.$.delegate(".close-dialog","click",function(e){e.preventDefault();
$("#login-form-content").show();
$("#login-forgot-info").hide()
});
self.$.find("form").on("keypress","input",function(event){if(event.which===13){self.$.find("form").submit();
return false
}});
self.$.delegate("form","submit",function(event){self.submitLogin();
return false
})
};
LoginDialog.prototype.submitLogin=function(){var self=this;
var content=self.$;
var form=self.form;
var username=form.find("#login-username-input").val();
var password=form.find("#login-password-input").val();
var loginRequest;
if(!self.validate(true)){return false
}loginRequest=orion.oesp.session.login(username,password);
self.startLoadingAnimation();
loginRequest.done(function(session){var termsDialog;
var serverTermsDate=$("#site-utility-bar").data("terms-date");
var clientTermsDate=null;
if(session.profileSettings.termsSettings!=null){clientTermsDate=session.profileSettings.termsSettings.version
}self.hide();
self.stopLoadingAnimation();
if(clientTermsDate==null||clientTermsDate<serverTermsDate){termsDialog=orion.app.dialogManager.getDialog("terms");
termsDialog.setUsername(username);
termsDialog.centerOn("window");
termsDialog.bind("accept",function(){var termsRequest=orion.oesp.profileEndpoint.setTerms(session,serverTermsDate);
termsRequest.done(function(){self.acceptTerms(session);
termsDialog.unbind("cancel");
termsDialog.unbind("accept")
})
});
termsDialog.bind("cancel",function(){self.clearLogin();
termsDialog.unbind("cancel");
termsDialog.unbind("accept")
});
termsDialog.show()
}else{self.acceptTerms(session)
}});
loginRequest.fail(function(e){var errorCode;
self.stopLoadingAnimation();
try{errorCode=JSON.parse(e.responseText)[0].code;
log("Sign-in call was unsuccessful; error code is",errorCode);
if(errorCode=="accountLocked"){self.addError(self.localStrings.accountLocked);
self.clearLogin()
}else{if(errorCode=="invalidCredentials"){self.addError(self.localStrings.invalidCredentials)
}else{self.addError(self.localStrings.unknownError)
}}}catch(e){self.addError(self.localStrings.unknownError)
}});
return false
};
LoginDialog.prototype.acceptTerms=function(session){var self=this;
var content=self.$;
var form=self.form;
var username=form.find("#login-username-input").val();
var rememberMe;
var pinChangeDialog;
BBV.user().login(session,0);
rememberMe=form.find("#login-remember-input").prop("checked");
if(rememberMe){BBV.utils.cookie("rememberUser").set("username",username)
}else{BBV.utils.cookie.remove("rememberUser")
}if(session.isPinDefault()){pinChangeDialog=orion.app.dialogManager.getDialog("pin-change-confirmation");
pinChangeDialog.centerOn("window");
pinChangeDialog.bind("accept",function(){window.location.href=self.$utilityBar.data("pin-management-url")
});
pinChangeDialog.bind("cancel",function(){window.location.reload()
});
pinChangeDialog.show()
}else{orion.app.reInitialize()
}};
LoginDialog.prototype.handleRedirect=function(session){var self=this
};
return LoginDialog
})(jQuery,orion.widgets.Dialog);
BBV.namespace("orion.widgets").TermsDialog=orion.widgets.TermsDialog||(function($,Dialog,DialogManager){function TermsDialog(){var self=this;
Dialog.call(self);
self.bindEvents()
}orion.util.inherits(TermsDialog,Dialog);
TermsDialog.prototype.render=function(){var self=this;
var privacyPolicy;
var container;
var termsRequest;
if(!self.$){Dialog.prototype.render.call(self)
}privacyPolicy=$("#privacy-policy");
self.setHtmlContent(privacyPolicy);
container=self.contentArea.find(".eu-privacy-policy");
termsRequest=$.get($("#site-utility-bar").data("terms-url"));
termsRequest.success(function(data){self.stopLoadingAnimation();
orion.util.analytics.trackEvent("action",{pageName:"Privacy and terms/Privacy and terms required",channel:"Privacy and terms/Privacy and terms required",prop23:"Privacy and terms",prop24:"Privacy and terms",prop26:"Privacy and terms required",events:"event9"})
});
termsRequest.fail(function(){self.stopLoadingAnimation();
container.html("Unable to load terms and conditions")
})
};
TermsDialog.prototype.show=function(){var self=this;
Dialog.prototype.show.call(self);
if(!self.isDialogRendered){self.startLoadingAnimation();
self.isDialogRendered=true
}};
TermsDialog.prototype.bindEvents=function(){var self=this;
self.$.delegate("#accept-tos","click",function(e){var cookieName=encodeURIComponent(self.username)+"_terms";
BBV.utils.cookie(cookieName).set("acceptTerms",$.now());
self.trigger("accept");
self.hide();
orion.util.analytics.trackEvent("action",{pageName:"Privacy and terms/Privacy and terms accepted",channel:"Privacy and terms",prop23:"Privacy and terms",prop24:"Privacy and terms",prop26:"Privacy and terms accepted",events:"event9"});
return false
});
self.$.delegate("#decline-tos, .close-dialog","click",function(e){self.trigger("cancel");
self.hide();
orion.util.analytics.trackEvent("action",{pageName:"Privacy and terms/Privacy and terms declined",channel:"Privacy and terms",prop23:"Privacy and terms",prop24:"Privacy and terms",prop26:"Privacy and terms declined",events:"event9"});
return false
})
};
TermsDialog.prototype.setUsername=function(username){var self=this;
self.username=username
};
return TermsDialog
})(jQuery,orion.widgets.Dialog,orion.widgets.DialogManager);
BBV.namespace("orion.widgets").DvrSettingsDialog=orion.widgets.DvrSettingsDialog||(function($,Dialog){function DvrSettingsDialog(){var self=this;
Dialog.call(self)
}orion.util.inherits(DvrSettingsDialog,Dialog);
DvrSettingsDialog.prototype.render=function(){var self=this;
if(!self.$){Dialog.prototype.render.call(self);
self.setHtmlContent($("#dvr-settings"));
self.$.find("form#dvr-settings").bind("submit",function(e){e.preventDefault();
self.submit()
});
self.setCloseBehavior(function(){self.hide();
self.$.find(".error").hide()
});
var form=self.$.find("#dvr-settings");
var profile=form.data("profile");
if(!profile){return
}var $multipleBoxes=self.$.find("#multiple-boxes");
var $ul=$multipleBoxes.find("ul");
var boxes=profile.boxes;
var boxInput="";
if(boxes&&boxes.length===1){$.each(boxes,function(idx,box){var capability=box.isRemoteRecordingCapable&&box.isRemoteReminderCapable?"record-remind":box.isRemoteRecordingCapable?"record":"remind";
boxInput+="<li>"+box.boxType+" "+box.smartCardId+" <span>"+form.data(capability+"-label")+"</span></li>"
});
$ul.append(boxInput).show();
form.find(".close").css({display:"block"});
$ul.show()
}if(boxes&&boxes.length>1&&boxes.length!==$multipleBoxes.find("li").length){$.each(boxes,function(idx,box){var checked=profile.defaultSmartCardId==box.smartCardId?' checked="checked"':"";
var capability=box.isRemoteRecordingCapable&&box.isRemoteReminderCapable?"record-remind":box.isRemoteRecordingCapable?"record":"remind";
boxInput+='<li><input type="radio" id="box-'+box.smartCardId+'" name="box" value="'+box.smartCardId+'"'+checked+' /> <label for="box-'+box.smartCardId+'">'+box.boxType+" "+box.smartCardId+" <span>"+form.data(capability+"-label")+"</span></label></li>"
});
$ul.append(boxInput).show();
form.find(".save").css({display:"block"});
$ul.show()
}}};
DvrSettingsDialog.prototype.submit=function(){var self=this;
var $boxes=self.$.find('input[name="box"]');
var $defaultBox=self.$.find('input[name="box"]:checked');
var $notifications=$("#dvr-settings #notifications:checked");
var errors=0;
if(!$boxes.length){self._onClose();
return
}self.$.find(".error").hide();
if($boxes.length&&!$defaultBox.length){errors++;
self.$.find(".error.default-box").show()
}if(errors){return
}var settings=JSON.stringify({defaultSmartCardId:$defaultBox.val(),accountEnabled:true});
var rbUrl=$("#site-utility-bar").data("remote-bookings-url");
orion.util.oesp.put(rbUrl+"/profile/",{data:settings,success:function(data){var $trigger=$(self.$.find("#dvr-settings").data("trigger"));
self.$.find(".error").hide();
if($trigger.length){self._onClose()
}else{orion.app.trigger("requestDialog",{dialogName:"dvr-booking",centerOn:"window",destroyOnClose:true})
}},error:function(){log("dvr error")
},complete:function(){self._onClose()
}})
};
return DvrSettingsDialog
})(jQuery,orion.widgets.Dialog);
BBV.namespace("orion.widgets").BookingErrorDialog=orion.widgets.BookingErrorDialog||(function($,Dialog,DialogManager){function BookingErrorDialog(){var self=this;
Dialog.call(self)
}orion.util.inherits(BookingErrorDialog,Dialog);
BookingErrorDialog.prototype.render=function(){var self=this;
var BookingError;
if(!self.$){Dialog.prototype.render.call(self)
}BookingError=$("#booking-error");
self.setHtmlContent(BookingError)
};
BookingErrorDialog.prototype.show=function(){var self=this;
Dialog.prototype.show.call(self)
};
return BookingErrorDialog
})(jQuery,orion.widgets.Dialog,orion.widgets.DialogManager);
BBV.namespace("orion.widgets").DialogManager=orion.DialogManager||(function($){function DialogManager(publisher){var self=this;
var container;
if(!(self instanceof DialogManager)){return new DialogManager(publisher)
}container=$("#dialog-container");
if(container.size()<1){$("body").append('<div id="dialog-container"/>');
container=$("#dialog-container")
}self._container=container;
self._dialogInstances={};
self._dialogConstructors={tvod:orion.widgets.TvodDialog,resume:orion.widgets.ResumeDialog,confirmation:orion.widgets.ConfirmationDialog,login:orion.widgets.LoginDialog,terms:orion.widgets.TermsDialog,"dvr-settings":orion.widgets.DvrSettingsDialog,"booking-error":orion.widgets.BookingErrorDialog,"pin-verification":orion.widgets.PinDialog,"pin-change-confirmation":orion.widgets.PinChangeDialog};
self.initScripts={};
self.publisher=publisher;
self.setInitScripts();
self.subscribeToEvents()
}DialogManager.prototype.getDialog=function(dialogName,destroyOnClose){var self=this;
var $oldDialog;
var dialog;
if(destroyOnClose){$oldDialog=self._dialogInstances[dialogName]?self._dialogInstances[dialogName].$:null;
delete self._dialogInstances[dialogName]
}if(self._dialogInstances[dialogName]){dialog=self._dialogInstances[dialogName]
}else{dialog=new (self.lookupConstructor(dialogName))();
self._dialogInstances[dialogName]=dialog;
self._container.append(dialog.$);
if(self.initScripts[dialogName]){self.initScripts[dialogName](dialog)
}}if($oldDialog){$oldDialog.remove()
}return dialog
};
DialogManager.prototype.registerConstructor=function(name,Constructor){var self=this;
self._dialogConstructors[name]=Constructor
};
DialogManager.prototype.lookupConstructor=function(dialogName){var self=this;
if(self._dialogConstructors[dialogName]){return self._dialogConstructors[dialogName]
}else{return orion.widgets.Dialog
}};
DialogManager.prototype.setInitScripts=function(){var dm=this;
var publisher=dm.publisher;
dm.initScripts={"dvr-booking":function(dialog){var $dialog=$("#dvr-booking");
var $trigger=$($dialog.data("trigger"));
var $programDetails=$trigger.closest(".program-details-wrap");
var $channel=$programDetails.prev("dl");
var closeDialog=function(){dialog.hide();
$dialog.find(".error").hide();
$("input:checked","#dvr-booking").each(function(idx,field){$(field).removeAttr("checked")
});
$("#dvr-booking .submit button").removeAttr("disabled").parent().removeClass("disabled")
};
var isRecord=$trigger.closest("span").is(".record");
var $content=$dialog.find(isRecord?"#schedule-recording":"#set-reminder");
var program={name:$dialog.data("show"),channelId:$channel.data("channel-id"),channelName:$dialog.data("channel")};
if(dialog.contentArea.html()===""){dialog.setHtmlContent($dialog)
}$dialog.children().hide();
$content.find(".show").text(program.name);
$content.find(".channel").text(program.channelName);
$content.show();
if(isRecord){orion.util.analytics.trackEvent("action",{pageName:"TV Guide/Set Recording/"+program.channelId,channel:"TV Guide/Set Recording/Set Recording",prop23:"TV Guide",prop24:"Set Recording",prop26:"Set Recording",eVar42:program.name,eVar43:program.channelId,eVar44:program.channelName,events:"event9,event41"})
}else{orion.util.analytics.trackEvent("action",{pageName:"TV Guide/Set Reminder/"+program.channelId,channel:"TV Guide/Set Reminder/Set Reminder",prop23:"TV Guide",prop24:"Set Reminder",prop26:"Set Reminder",eVar42:program.name,eVar43:program.channelId,eVar44:program.channelName,events:"event9,event42"})
}dialog.$.delegate("#dvr-booking .submit button","click",function(e){e.preventDefault();
var $elem=$(e.target);
var listingId=$dialog.data("listing-id");
var rbUrl=$("#site-utility-bar").data("remote-bookings-url");
var $listing=$("						li.listing[data-listing-id='"+listingId+"'] .notifications,						div.program-details-wrap[data-listing-id='"+listingId+"'] .user-functionality					");
if($("#schedule-recording:visible").length){if(!$("input:checked","#schedule-recording fieldset").length){$dialog.find(".error").show();
return
}$dialog.find(".error").hide();
$elem.attr("disabled","disabled").parent().addClass("disabled");
var bookingType="recordings",overwriteExisting=$("input:checked","#schedule-recording fieldset").val()=="1"?true:false,bookingData=JSON.stringify({listingId:listingId,overwriteExisting:overwriteExisting})
}else{var bookingType="reminders",bookingData=JSON.stringify({listingId:listingId})
}orion.util.oesp.post(rbUrl+"/"+bookingType+"/",{data:bookingData,success:function(data){var status=data[bookingType][0].status;
var errorMsg=data[bookingType][0].reason;
$("#dvr-booking .submit button").removeAttr("disabled").parent().removeClass("disabled");
$listing.each(function(idx,icon){$(icon).addClass(bookingType+"-pending")
});
if(bookingType==="recordings"&&(status==="success"||status==="pending")){orion.util.analytics.trackEvent("action",{pageName:"TV Guide/Set recording success",channel:"TV Guide/Set Recording/Set Recording success",prop23:"TV Guide",prop24:"Set Recording",prop26:"Set Recording success",prop44:"[INSERT EPG transaction ID]",eVar42:program.name,eVar43:program.channelId,eVar44:program.channelName,events:"event9,event43"})
}else{if(bookingType==="recordings"&&status==="failure"){orion.util.analytics.trackEvent("action",{pageName:"TV Guide/Set recording failed",channel:"TV Guide/Set Recording/Set Recording failed",prop23:"TV Guide",prop24:"Set Recording",prop26:"Set Recording failed",prop41:errorMsg,eVar42:program.name,eVar43:program.channelId,eVar44:program.channelName,events:"event9,event48"})
}else{if(bookingType==="reminders"&&(status==="success"||status==="pending")){orion.util.analytics.trackEvent("action",{pageName:"TV Guide/Set reminder success",channel:"TV Guide/Set Reminder/Set Reminder success",prop23:"TV Guide",prop24:"Set Reminder",prop26:"Set Reminder success",prop44:"[INSERT EPG transaction ID]",eVar42:program.name,eVar43:program.channelId,eVar44:program.channelName,events:"event9,event49"})
}else{if(bookingType==="reminders"&&status==="failure"){orion.util.analytics.trackEvent("action",{pageName:"TV Guide/Set reminder failed",channel:"TV Guide/Set Reminder/Set Reminder failed",prop23:"TV Guide",prop24:"Set Reminder",prop26:"Set Reminder failed",prop41:errorMsg,eVar42:program.name,eVar43:program.channelId,eVar44:program.channelName,events:"event9,event50"})
}}}}publisher.trigger("getRemoteBookings",bookingType)
},error:function(data){$listing.each(function(idx,icon){$(icon).addClass(bookingType+"-failed")
});
publisher.trigger("requestDialog",{dialogName:"booking-error",centerOn:"window",destroyOnClose:true});
if(data[bookingType]){var errorMsg=orioni18n.EPG.bookingErrors[data[bookingType][0].reason]
}else{var errorMsg=orioni18n.EPG.bookingErrors.unknown
}$("#booking-error .show").text($("#booking-error").data("show"));
$("#booking-error .channel").text($("#booking-error").data("channel"));
$("#booking-error .error").text(errorMsg);
if(bookingType==="recordings"){orion.util.analytics.trackEvent("action",{pageName:"TV Guide/Set recording failed",channel:"TV Guide/Set Recording/Set Recording failed",prop23:"TV Guide",prop24:"Set Recording",prop26:"Set Recording failed",prop41:errorMsg,eVar42:program.name,eVar43:program.channelId,eVar44:program.channelName,events:"event9,event48"})
}else{orion.util.analytics.trackEvent("action",{pageName:"TV Guide/Set reminder failed",channel:"TV Guide/Set Reminder/Set Reminder failed",prop23:"TV Guide",prop24:"Set Reminder",prop26:"Set Reminder failed",prop41:errorMsg,eVar42:program.name,eVar43:program.channelId,eVar44:program.channelName,events:"event9,event50"})
}},complete:function(){closeDialog()
}})
});
dialog.$.delegate("#dvr-booking a.cancel","click",function(e){closeDialog()
});
dialog.setCloseBehavior(function(){closeDialog()
})
}}
};
DialogManager.prototype.subscribeToEvents=function(){var self=this;
self.publisher.subscribe("requestDialog",function(eventOptions){var dialog;
if(!eventOptions.dialogName){throw new Error("dialogName not specified")
}destroyOnClose=eventOptions.destroyOnClose||false;
dialog=self.getDialog(eventOptions.dialogName,destroyOnClose);
if(eventOptions.centerOn){dialog.centerOn(eventOptions.centerOn)
}if(eventOptions.pointTo){dialog.pointTo(eventOptions.pointTo.target,eventOptions.pointTo.direction)
}if(eventOptions.setVerificationType){dialog.setVerificationType(eventOptions.setVerificationType)
}dialog.show()
})
};
return DialogManager
})(jQuery);
BBV.namespace("orion").Recommendations=orion.Recommendations||(function($){function Recommendations(publisher,isDialog){var self=this;
if(!(self instanceof Recommendations)){return new Recommendations(publisher)
}self.isDialog=(isDialog)?true:false;
self.publisher=publisher;
self.$myOrionBar=$("#site-orion-bar");
self.elem="#recommendations";
self.url=self.$myOrionBar.data("recommendations-url");
self.localStrings=orioni18n.myOrionBar;
self.$containers=$("#recommendations, #recommendations-module");
self.$containerDialog=$("#myorionbar-dialog .dialog-inner");
self.$containerModule=$("#recommendations-module");
self.$myorionbarDialogs=$("#myorionbar-dialog");
if(!self.url){log("missing url for recommendations");
return
}orion.oesp.session.withSession(function(session){if(session.isAuthenticated()){self.initialize();
self.handlers()
}});
return self
}Recommendations.prototype.initialize=function(){var self=this;
orion.util.oesp.get(self.url,{success:function(data){self.recommendations=data;
self.build();
self.attach()
},fail:function(){self.recommendations=[];
self.build();
self.attach()
}});
return self
};
Recommendations.prototype.handlers=function(){var self=this;
self.$containers.delegate(".view-toggle a","click",function(event){self.toggleViews(event)
})
};
Recommendations.prototype.toggleViews=function(event){event.preventDefault();
var self=this,elem=event.target,$elem=$(elem),$container=$elem.closest(".myorionbar-module"),$parent=$elem.closest(".view-toggle"),$newView=$($elem.attr("href").replace("#","."),$container);
if(!$elem.is(".active")){$parent.find(".active").removeClass("active");
$elem.addClass("active");
$(".content-list ul",$container).hide();
$newView.show()
}};
Recommendations.prototype.build=function(){var self=this;
var target;
var medias=$.map(self.recommendations.mediaGroups||self.recommendations.mediaItems,function(item){var extendedItem=BBV.extend(item,{localStrings:self.localStrings},orion.util.mediamethods);
var mediaobject=BBV.Object.create(BBV.feed.MediaObject);
mediaobject.initialize(extendedItem);
return mediaobject
});
var viewModel=BBV.extend({medias:medias},{localStrings:self.localStrings,count:self.recommendations.mediaItems.length},orion.util.mediamethods);
if(self.isDialog){var htmlDialog=Mustache.to_html(orion.templates.RecommendationsWrapper,viewModel,{RecommendationsBody:orion.templates.RecommendationsBody});
self.$templateDialog=$(htmlDialog)
}else{if(self.$containerModule.length){var htmlModule=Mustache.to_html(orion.templates.RecommendationsBody,viewModel);
self.$templateModule=$(htmlModule)
}}return self
};
Recommendations.prototype.attach=function(options){var self=this;
if(self.isDialog){self.$containerDialog.append(self.$templateDialog);
orion.modules.MyOrionBar.showDialog("recommendations");
self.checkEntitlements(self.$containerDialog)
}else{if(self.$containerModule.length){self.$containerModule.find(".section").empty().html(self.$templateModule);
self.checkEntitlements(self.$containerModule.find(".section"))
}}self.stopLoaders();
orion.Playlist.setState("#recommendations");
return self
};
Recommendations.prototype.checkEntitlements=function(element){var self=this;
var selector="[data-media-entitlements]";
var lock=".locked";
var $elem=$(element);
var items=$elem.is(selector)?$elem:$elem.find(selector);
orion.oesp.session.done(function(session){items.each(function(){var item=$(this);
var entitlement=item.data("media-entitlements").split(",");
if(session.hasEntitlement(entitlement)){item.find(lock).hide()
}})
})
};
Recommendations.prototype.stopLoaders=function(){var self=this;
self.$myorionbarDialogs.trigger("loaded")
};
return Recommendations
})(jQuery);
BBV.namespace("orion").Playlist=orion.Playlist||(function($){function unique(arr){var a=arr.concat();
for(var i=0;
i<a.length;
++i){for(var j=i+1;
j<a.length;
++j){if(a[i]===a[j]){a.splice(j,1)
}}}return a
}var initialized=false;
function PlaylistModel(controller){var self=this;
self.controller=controller
}function Playlist(publisher,isDialog){var self=this;
self.isDialog=(isDialog)?true:false;
self.publisher=publisher;
self.$myOrionBar=$("#site-orion-bar");
self.elem="#playlist";
self.dialogContent=".dialog-content";
self.name=self.$myOrionBar.data("playlist-name")||"default";
self.mediaUrl=self.$myOrionBar.data("mediaitems-url");
self.manageUrl=self.$myOrionBar.data("manage-playlist-url");
self.localStrings=orioni18n.myOrionBar;
self.$myorionbarDialogs=$("#myorionbar-dialog");
self.$containers=$("#myorionbar-dialog, .myorionbar-module");
self.$containerDialog=$("#myorionbar-dialog .dialog-inner");
self.$containerModule=$("#playlist-module");
self.$modules=$(".module");
self.playlistLocalStrings=orioni18n.playlist;
self.currentPlaylistItemIds=[];
self.playlists=orion.oesp.playlistEndpoint;
orion.oesp.session.withSession(function(session){if(session.isAuthenticated()){self.model=new PlaylistModel(self)
}});
if(initialized&&!orion.app.resettingNow){return
}initialized=true;
if(orion.app.resettingNow){self.destroyBindings()
}if(!(self instanceof Playlist)){throw new Error("Playlist called without new.")
}orion.oesp.session.withSession(function(session){if(session.isAuthenticated()){self.isAuthenticated=true;
self.handlers();
self.initialize()
}else{self.handlers()
}});
self.publisher.subscribe("updatePlaylist",function(eventOptions){if(!eventOptions.action){throw new Error("action not specified")
}orion.oesp.session.withSession(function(session){if(!session.isAuthenticated()){self.publisher.trigger("requestDialog",{dialogName:"login",pointTo:{target:self.$myOrionBar.find('[data-dialog="playlist"]'),direction:"down"}})
}else{var options={action:eventOptions.action,mediaId:eventOptions.mediaId||"",moduleId:eventOptions.moduleId||"",isGroup:eventOptions.isGroup||false,isPlaylistModule:eventOptions.isPlaylistModule||false,sortBy:eventOptions.sortBy||"",success:eventOptions.success||self.addRemoveSuccess,complete:eventOptions.complete||BBV.noop};
if(options.action=="add"&&options.mediaId){orion.app.recommendations.learnAddToPlaylist(options.mediaId)
}self.update(options)
}});
return self
});
return self
}Playlist.prototype.destroyBindings=function(){var self=this;
self.$modules.not("#playlist-module").undelegate(".media-item .add a, .media-item .remove a, .add-all a","click");
self.$containers.undelegate(".media-item a.remove, .media-item .remove a, .view-toggle a","click");
self.$modules.not("#playlist-module").undelegate(".media-item .add a, .add-all a, .view-toggle a","click");
self.$modules.not("#playlist-module").undelegate(".media-item","mouseover");
self.$modules.not("#playlist-module").undelegate(".media-item .add a, .media-item .remove a","click");
self.$modules.not("#playlist-module").undelegate(".add-all a","click");
self.$containers.undelegate(".media-item a.add, .media-item a.remove, .media-item .add a, .media-item .remove a","click");
orion.app.dialogManager.getDialog("confirmation").unbind("confirm");
$(document).unbind("playlist:updateMediaItems")
};
Playlist.containsProgramId=function(options){options=$.extend({},options);
var id=options.id||0;
var inPlaylist=false;
var localMediaItemIds=(typeof(model)!=="undefined")?model.mediaItemIds:[];
var mediaItemIds=sessionStorage.getItem("playlist")?$.parseJSON(sessionStorage.getItem("playlist")).mediaItems:localMediaItemIds;
if(mediaItemIds.length){$.each(mediaItemIds,function(idx,mediaItemId){if(id===mediaItemId){inPlaylist=true
}})
}return inPlaylist
};
Playlist.getNext=function(options){options=$.extend({},options);
var id=options.id||0;
var playlistId=$("#playlist").data("playlist-id");
var count=options.count||4;
var callback=options.callback||BBV.noop;
var mediaItems=[];
var nextMediaItems=[];
var getPlaylist=orion.oesp.playlistEndpoint.requestPlaylistById(playlistId);
getPlaylist.done(function(data){$.each(data.mediaItems,function(index,mediaItem){if(id==mediaItem.id||(nextMediaItems.length<=count)){nextMediaItems.push(mediaItem)
}});
if(nextMediaItems.length<=1){return
}nextMediaItems.shift();
callback.call(unique(nextMediaItems))
})
};
Playlist.setState=function(context){var self=this;
var mediaItemIds=sessionStorage.getItem("playlist")?$.parseJSON(sessionStorage.getItem("playlist")).mediaItems:null;
$("[data-media-id]",context).each(function(){if(!mediaItemIds||!$(this).data("media-id")){return
}if($.inArray($(this).data("media-id").toString(),mediaItemIds)>-1){$(this).addClass("in-playlist")
}else{$(this).removeClass("in-playlist")
}})
};
Playlist.prototype.handlers=function(){var self=this;
var model=self.model;
if(self.isAuthenticated){$(document).bind("playlist:updateMediaItems",function(event,options){var mediaItems=[];
var updatePlaylist;
model.mediaItemIds=options.mediaItems?unique(options.mediaItems):unique(model.mediaItemIds);
$.each(model.mediaItemIds,function(){mediaItems.push({id:this})
});
updatePlaylist=self.playlists.updatePlaylist(model.id,self.name,mediaItems);
updatePlaylist.done(function(){options.success.call(self,options)
}).fail(function(){self.stopLoaders()
})
});
self.$modules.not("#playlist-module").delegate(".media-item .add a, .media-item .remove a, .add-all a","click",function(event){event.preventDefault()
});
self.$containers.delegate(".media-item a.remove, .media-item .remove a, .view-toggle a","click",function(event){event.preventDefault()
})
}else{self.$modules.not("#playlist-module").delegate(".media-item .add a, .add-all a, .view-toggle a","click",function(event){event.preventDefault();
self.publisher.trigger("requestDialog",{dialogName:"login",pointTo:{target:$('#site-orion-bar li[data-dialog="playlist"]'),direction:"down"}})
});
self.$modules.not("#playlist-module").delegate(".media-item","mouseover",function(event){if(!$(this).data("media-id")){return
}event.preventDefault();
var $elem=$(this),mediaId=$elem.data("media-id"),isGroup=$elem.is(".media-group");
if(!$elem.data("is-draggable")){$elem.data("is-draggable",true);
$elem.draggable({revert:true,helper:"clone",cursor:"move",opacity:1,zIndex:99999,start:function(event,ui){self.publisher.trigger("requestDialog",{dialogName:"login",pointTo:{target:$('#site-orion-bar li[data-dialog="playlist"]'),direction:"down"}})
}})
}})
}};
Playlist.prototype.handlersLoggedIn=function(){var self=this;
var model=self.model;
self.handlersBound=true;
self.confirmationDialog=orion.app.dialogManager.getDialog("confirmation");
self.$modules.not("#playlist-module").delegate(".media-item .add a, .media-item .remove a","click",function(event){event.preventDefault();
var elem=event.target,$elem=$(elem),mediaId=$elem.closest(".media-item").data("media-id"),isGroup=$elem.closest(".media-item").is(".media-group"),action=$elem.closest("span").attr("class");
self.publisher.trigger("updatePlaylist",{action:action,mediaId:mediaId,isGroup:isGroup})
});
self.$modules.not("#playlist-module").delegate(".media-item","mouseover",function(event){if(!$(this).data("media-id")){return
}var $elem=$(this),mediaId=$elem.data("media-id"),isGroup=$elem.is(".media-group");
$elem.draggable({revert:function(elem){if(elem===false){self.$myorionbarDialogs.hide();
$(self.elem).hide();
return true
}else{return false
}},helper:"clone",zIndex:99999,opacity:1,cursor:"move",start:function(event,ui){self.$myorionbarDialogs.show();
$(self.elem).show()
}});
$(self.elem).droppable({over:function(event,ui){self.$myorionbarDialogs.addClass("over")
},out:function(event,ui){self.$myorionbarDialogs.removeClass("over")
},drop:function(event,ui){self.publisher.trigger("updatePlaylist",{action:"add",mediaId:mediaId,isGroup:isGroup,isPlaylistModule:true})
}})
});
self.$modules.not("#playlist-module").delegate(".add-all a","click",function(event){event.preventDefault();
var elem=event.target,$elem=$(elem),moduleId=$elem.closest("section").find("ul.tabs").length?$elem.closest("div.section").attr("id"):$elem.closest("section").attr("id");
self.publisher.trigger("updatePlaylist",{action:"addAll",moduleId:moduleId})
});
self.$containers.delegate("a#clear-playlist","click",function(event){event.preventDefault();
if(model.id){self.startLoaders();
self.confirmationDialog=orion.app.dialogManager.getDialog("confirmation");
self.confirmationDialog.setContent(self.playlistLocalStrings.confirmDeletePlaylistTitle,self.playlistLocalStrings.confirmDeletePlaylistMessage);
self.confirmationDialog.centerOn("window");
self.confirmationDialog.show();
self.confirmationDialog.bind("confirm",function(){var deletePlaylist=self.playlists.deletePlaylist(model.id);
deletePlaylist.done(function(){self.create()
}).fail(function(){self.stopLoaders()
});
return false
});
self.confirmationDialog.bind("cancel",function(){self.stopLoaders();
return false
})
}return false
});
self.$containers.delegate(".media-item a.add, .media-item a.remove, .media-item .add a, .media-item .remove a","click",function(event){event.preventDefault();
var elem=event.target,$elem=$(elem),mediaId=$elem.closest(".media-item").data("media-id"),isPlaylistModule=$elem.closest(".playlist").is("section"),action=$elem.attr("class")||$elem.closest("span").attr("class");
self.publisher.trigger("updatePlaylist",{action:action,mediaId:mediaId,isGroup:false,isPlaylistModule:isPlaylistModule})
});
self.$containers.delegate(".view-toggle a","click",function(event){event.preventDefault();
var elem=event.target,$elem=$(elem),$container=$elem.closest(".myorionbar-dialog, .myorionbar-module"),$parent=$elem.closest(".view-toggle"),$highlightView=$($elem.attr("href").replace("#",".")+" .highlight",$container),$newView=$($elem.attr("href").replace("#","."),$elem.parents(".dialog-content:first, .section:first").find(".content-list"));
if(!$elem.is(".active")){$parent.find(".active").removeClass("active");
$elem.addClass("active");
if($parent.is(".medium-toggle")&&$elem.attr("href")=="#all"){$(".media-item .highlight").css("display","none")
}else{if($parent.is(".medium-toggle")){$(".media-item .highlight").css("display","block");
$highlightView.css("display","none")
}else{$newView.siblings().hide();
$newView.show()
}}}});
self.$containers.delegate(".sort-playlist li a","click",function(event){event.preventDefault();
var elem=event.target,$elem=$(elem),$playlist=$elem.closest(".myorionbar-dialog, .myorionbar-module"),isPlaylistModule=$playlist.is("section"),sortBy=$(event.target).closest("li").attr("class").substr(7),sortStr="INFO";
if(sortBy=="title"){sortStr=self.localStrings.title
}else{if(sortBy=="air-date"){sortStr=self.localStrings.airDate
}else{if(sortBy=="expiration-date"){sortStr=self.localStrings.expirationDate
}}}$(".sort-confirmation,.sort-confirmation .dialog",$playlist).css("display","block");
$(".sort-confirmation").find(".dialog h2 span",$playlist).html(sortStr);
$(".sort-confirmation .close-alt, .sort-confirmation .cancel-sort, .my-orion-list li",$playlist).click(function(event){event.preventDefault();
$(".sort-confirmation,.sort-confirmation .dialog",$playlist).css("display","none")
});
$(".sort-confirmation .button a",$playlist).click(function(){self.sortText=$elem.text();
self.publisher.trigger("updatePlaylist",{action:"sort",sortBy:sortBy,isPlaylistModule:isPlaylistModule});
$(".sort-confirmation,.sort-confirmation .dialog",$playlist).css("display","none")
})
})
};
Playlist.prototype.initialize=function(){var self=this;
var model=self.model;
self.activePurchases=orion.oesp.purchaseEndpoint.requestActivePurchases();
self.getPlaylists=self.get();
self.load();
self.$containerModule.loader({flow:["overlay"],target:".section",minheight:438,minwidth:926});
return self
};
Playlist.prototype.get=function(){var self=this;
var $playlists=$.Deferred();
self.playlists.requestPlaylists().done(function(data){self.set(data.playlists).done(function(){$playlists.resolve()
})
});
return $playlists.promise()
};
Playlist.prototype.set=function(playlists){var self=this;
var model=self.model;
var $playlist=$.Deferred();
if(!playlists.length){self.create().done(function(){$playlist.resolve()
})
}else{model.id=playlists[0].id;
model.mediaItemIds=playlists[0].mediaItems||[];
$playlist.resolve()
}return $playlist.promise()
};
Playlist.prototype.clear=function(){var self=this;
var $playlists=$.Deferred();
self.playlists.requestPlaylists().done(function(data){$.each(data.playlists,function(){self.playlists.deletePlaylist(this.id)
});
$playlists.resolve()
});
return $playlists.promise()
};
Playlist.prototype.create=function(){var self=this;
var model=self.model;
var $playlist=$.Deferred();
self.playlists.createPlaylist(self.name).done(function(playlist){model.id=playlist.id;
model.mediaItemIds=playlist.mediaItems;
self.onLoadSuccess.call(self,playlist);
$playlist.resolve()
});
return $playlist.promise()
};
Playlist.prototype.load=function(options){var self=this;
var model=self.model;
var $playlist=$.Deferred();
options=$.extend({},options);
self.getPlaylists.done(function(){self.getPlaylist=self.playlists.requestPlaylistById(model.id);
self.getPlaylist.done(function(playlist){self.onLoadSuccess.call(self,playlist,options);
$playlist.resolve()
}).fail(function(data){self.onLoadError.call(self,data);
$playlist.reject()
})
});
return $playlist.promise()
};
Playlist.prototype.onLoadSuccess=function(data,options){var self=this;
var model=self.model;
model.mediaItems=data.mediaItems;
self.counts={tv:0,movie:0,all:0};
$.each(model.mediaItems,function(index,mediaItem){model.mediaItemIds.push(mediaItem.id);
if(mediaItem.medium=="TV"){self.counts.tv++
}else{self.counts.movie++
}self.counts.all++
});
model.mediaItemIds=unique(model.mediaItemIds);
sessionStorage.setItem("playlist",JSON.stringify({id:model.id,name:self.name,mediaItems:model.mediaItemIds}));
self.render(options)
};
Playlist.prototype.onLoadError=function(data){var self=this;
setTimeout(function(){self.initialize()
},30000);
self.stopLoaders()
};
Playlist.prototype.render=function(options){var self=this;
var model=self.model;
options=$.extend({},options);
if(!self.handlersBound){self.handlersLoggedIn()
}self.build(options);
orion.Playlist.setState(".module, .dialog");
self.publisher.trigger("playlistLoaded");
if(options.complete){options.complete.call(self,options)
}return self
};
Playlist.prototype.build=function(options){var self=this;
var model=self.model;
var floor=0;
var ceil=100;
var floorLimitReached=model.mediaItemIds.length==floor?true:false;
var ceilLimitReached=model.mediaItemIds.length==ceil?true:false;
self.activePurchases.done(function(purchases){$.each(purchases.products,function(productIdx,product){$.each(model.mediaItems,function(itemIdx,item){if(product.id===item.productId){item.expirationDate=product.entitlementEnd
}})
});
if(floorLimitReached||ceilLimitReached){if(self.$containerModule.length){self.$templateModule=$(Mustache.to_html(orion.templates[floorLimitReached?"PlaylistEmpty":"PlaylistFull"],BBV.extend({template:model.mediaItems},{localStrings:self.localStrings,manageUrl:self.manageUrl},orion.util.mediamethods)))
}self.$templateDialog=$(Mustache.to_html(orion.templates.PlaylistWrapper,BBV.extend({template:model.mediaItems},{localStrings:self.localStrings,manageUrl:self.manageUrl,isDialog:true},orion.util.mediamethods),{PlaylistBody:orion.templates[floorLimitReached?"PlaylistEmpty":"PlaylistFull"]}))
}else{BBV.each(model.mediaItems,function(index,item){item.localStrings=self.localStrings;
item.index=index;
item.order=index+1;
BBV.extend(item,orion.util.mediamethods)
});
if(self.$containerModule.length){self.$templateModule=$(Mustache.to_html(orion.templates.PlaylistStructure,BBV.extend({template:model.mediaItems},{localStrings:self.localStrings,manageUrl:self.manageUrl,counts:self.counts},orion.util.mediamethods),{mediaItemsGrid:orion.templates.PlaylistGridItem,mediaItemsList:orion.templates.PlaylistListItem}))
}self.$templateDialog=$(Mustache.to_html(orion.templates.PlaylistWrapper,BBV.extend({template:model.mediaItems},{localStrings:self.localStrings,manageUrl:self.manageUrl,counts:self.counts,isDialog:true},orion.util.mediamethods),{PlaylistBody:orion.templates.PlaylistStructure,mediaItemsGrid:orion.templates.PlaylistGridItem,mediaItemsList:orion.templates.PlaylistListItem}))
}self.attach(options);
$(self.elem).data("playlist-id",model.id)
});
return self
};
Playlist.prototype.attach=function(options){var self=this;
var $dialogContent=self.$containerDialog.find(".content-list");
options=$.extend({},options);
var reorderOptions={opacity:0.9,cursor:"move",helper:"clone",forceHelperSize:true,appendTo:"body",scroll:false,zIndex:99999,over:function(event,ui){self.isDraggedOut=false;
self.$myorionbarDialogs.addClass("over")
},out:function(event,ui){self.isDraggedOut=true;
self.$myorionbarDialogs.removeClass("over")
},update:function(event,ui){self.makeDraggable(event,ui)
},beforeStop:function(event,ui){self.dragStop(event,ui)
}};
if(self.$containerModule.length){var currentView=$("#playlist-module").find(".myorionbar-sub-functionality .active").parent().attr("class");
self.$containerModule.find(".section").empty().html(self.$templateModule);
self.$containerModule.find(".myorionbar-sub-functionality ."+currentView+" a").click();
orion.app.recommendations.updateRatedItems(self.$containerModule.find(".section"));
if(self.sortText){self.sortSuccess({sortText:self.sortText})
}}$(self.elem).remove();
self.$containerDialog.append(self.$templateDialog);
orion.app.recommendations.updateRatedItems(self.$containerDialog);
orion.modules.MyOrionBar.showDialog("playlist");
if(options.visibility==="visible"){self.$myorionbarDialogs.show();
$(self.elem).show();
self.$containerDialog.find(".content-list").animate({scrollTop:10000},2000)
}$("#playlist .content-list ul, #playlist-module .content-list ul").sortable(reorderOptions).disableSelection();
self.stopLoaders();
return self
};
Playlist.prototype.update=function(options){var self=this;
if(!options.isPlaylistModule){self.$myorionbarDialogs.show();
$(self.dialogContent).hide();
$(self.elem).show()
}self.startLoaders();
self[options.action](options);
return self
};
Playlist.prototype.add=function(options){var self=this;
var model=self.model;
var mediaId=options.mediaId.toString();
if($.inArray(mediaId,model.mediaItemIds)==-1){model.mediaItemIds.push(mediaId)
}if(options.isGroup){orion.util.oesp.get(self.mediaUrl+"?byMediaGroupId="+encodeURIComponent(mediaId),{success:function(data){$.each(data.mediaItems,function(index,mediaItem){switch(mediaItem.mediaType.toLowerCase()){case"featurefilm":case"episode":if($.inArray(mediaItem.id,model.mediaItemIds)==-1){model.mediaItemIds.push(mediaItem.id)
}break;
default:break
}if(index===data.mediaItems.length-1){options.mediaItems=unique(model.mediaItemIds);
$(document).trigger("playlist:updateMediaItems",options)
}});
orion.util.analytics.trackEvent("action",{pageName:"Playlist/Add to Playlist",channel:"Playlist/Add to Playlist",prop23:"Playlist",prop24:"Playlist",prop26:"Add to Playlist",eVar32:mediaId,events:"event9,event31"})
},error:function(){self.stopLoaders()
}})
}else{orion.util.analytics.trackEvent("action",{pageName:"Playlist/Add to Playlist",channel:"Playlist/Add to Playlist",prop23:"Playlist",prop24:"Playlist",prop26:"Add to Playlist",eVar32:mediaId,events:"event9,event31"});
options.mediaItems=unique(model.mediaItemIds);
$(document).trigger("playlist:updateMediaItems",options)
}return self
};
Playlist.prototype.addAll=function(options){var self=this;
var model=self.model;
var $module=$("#"+options.moduleId);
$module.find(".media-item").each(function(index,mediaItem){var mediaId=$(mediaItem).data("media-id");
if($.inArray(mediaId,model.mediaItemIds)==-1){model.mediaItemIds.push(mediaId)
}orion.util.analytics.trackEvent("action",{pageName:"Playlist/Add to Playlist",channel:"Playlist/Add to Playlist",prop23:"Playlist",prop24:"Playlist",prop26:"Add to Playlist",eVar32:mediaId,events:"event9,event31"})
});
options.mediaItems=unique(model.mediaItemIds);
$(document).trigger("playlist:updateMediaItems",options);
return self
};
Playlist.prototype.remove=function(options){var self=this;
var model=self.model;
var mediaId=options.mediaId.toString();
var aMediaItemIds=[];
$.each(model.mediaItemIds,function(index,mediaItemId){if(mediaItemId!==mediaId&&$.inArray(mediaItemId,model.mediaItemIds)!==-1){aMediaItemIds.push(mediaItemId)
}});
orion.util.analytics.trackEvent("action",{pageName:"Playlist/Remove from Playlist",channel:"Playlist/Remove from Playlist",prop23:"Playlist",prop24:"Playlist",prop26:"Remove from Playlist",eVar32:mediaId,events:"event9,event32"});
model.mediaItemIds=unique(aMediaItemIds);
options.mediaItems=model.mediaItemIds;
$(document).trigger("playlist:updateMediaItems",options);
return self
};
Playlist.prototype.addRemoveSuccess=function(options){var self=this;
options=$.extend({},options);
var completeCallback=options.complete||BBV.noop;
self.load({visibility:options.isPlaylistModule?"hidden":"visible",complete:completeCallback});
self.publisher.trigger("playlistUpdated",{action:options.action,mediaId:options.mediaId.toString()})
};
Playlist.prototype.dragStop=function(event,ui){var self=this;
var container=ui.item.closest(".myorionbar-dialog, .myorionbar-module");
var isPlaylistModule=container.is("section");
if(self.isDraggedOut){self.publisher.trigger("updatePlaylist",{action:"remove",mediaId:ui.item.data("media-id"),isGroup:false,isPlaylistModule:isPlaylistModule})
}};
Playlist.prototype.makeDraggable=function(event,ui){var self=this;
if(self.isDraggedOut){return
}var container=ui.item.closest(".myorionbar-dialog, .myorionbar-module"),isPlaylistModule=container.is("section"),aMediaItems=[];
container.find(".media-item:visible").each(function(index,mediaItem){aMediaItems.push($(mediaItem).data("media-id").toString())
});
self.publisher.trigger("updatePlaylist",{action:"reorder",mediaId:aMediaItems,isPlaylistModule:isPlaylistModule,success:self.reorderSuccess});
return self
};
Playlist.prototype.reorder=function(options){var self=this;
options.mediaItems=options.mediaId;
$(document).trigger("playlist:updateMediaItems",options);
return self
};
Playlist.prototype.reorderSuccess=function(options){var self=this;
var model=self.model;
var getPlaylist=orion.oesp.playlistEndpoint.requestPlaylistById(model.id);
getPlaylist.done(function(playlist){model.mediaItems=playlist.mediaItems;
self.setOrderNumber()
});
self.stopLoaders()
};
Playlist.prototype.setOrderNumber=function(){var self=this;
var gridItemsModule=$(".grid-view .order",self.$containerModule);
var listItemsModule=$(".list-view .order",self.$containerModule);
var gridItems=$(".grid-view .order","#playlist");
var listItems=$(".list-view .order","#playlist");
if(self.$containerModule.length){gridItemsModule.each(function(idx,item){if(idx===0){$(".grid-view .order:first",self.$containerModule).text("1")
}else{$(item).text(idx+1)
}});
listItemsModule.each(function(idx,item){if(idx===0){$(".list-view .order:first",self.$containerModule).text("1")
}else{$(item).text(idx+1)
}})
}gridItems.each(function(idx,item){if(idx===0){$(".grid-view .order:first","#playlist").text("1")
}else{$(item).text(idx+1)
}});
listItems.each(function(idx,item){if(idx===0){$(".list-view .order:first","#playlist").text("1")
}else{$(item).text(idx+1)
}});
return self
};
Playlist.prototype.sort=function(options){var self=this;
var model=self.model;
options=$.extend({},options);
var sortBy=options.sortBy;
var map={title:"title","air-date":"airDate","expiration-date":"expirationDate"};
var aMediaItemObjs=[];
var aMediaItemsSorted=[];
self.sortOrder=sortBy==self.sortBy?self.sortOrder=="DESC"?"ASC":"DESC":"ASC";
self.sortBy=sortBy;
$.each(model.mediaItems,function(index,mediaItem){aMediaItemObjs.push({id:mediaItem.id,sorted:mediaItem[map[sortBy]]})
});
aMediaItemObjs.sort(function(a,b){var x=!a.sorted?"":isNaN(a.sorted)?a.sorted.toLowerCase():a.sorted;
var y=!b.sorted?"":isNaN(b.sorted)?b.sorted.toLowerCase():b.sorted;
if(self.sortOrder=="DESC"){return((y<x)?-1:((y>x)?1:0))
}else{return((x<y)?-1:((x>y)?1:0))
}});
$.each(aMediaItemObjs,function(index,mediaItem){aMediaItemsSorted.push(mediaItem.id)
});
model.mediaItemIds=unique(aMediaItemsSorted);
options.mediaItems=model.mediaItemIds;
$(document).trigger("playlist:updateMediaItems",options);
return self
};
Playlist.prototype.sortSuccess=function(options){options=$.extend({},options);
$(".sort-playlist .sort span").text(options.sortText)
};
Playlist.prototype.startLoaders=function(){var self=this;
if(self.$containers.length&&!self.$containerModule.find(".loading-wrapper:visible").length){self.$containerModule.trigger("loading")
}if(!$(self.elem).find(".loading-wrapper:visible").length&&!self.$containers.find(".loading-wrapper:visible").length){$(self.elem).trigger("loading")
}return self
};
Playlist.prototype.stopLoaders=function(){var self=this;
if(self.$containers.length){self.$containers.trigger("loaded")
}$(self.elem).trigger("loaded");
return self
};
return Playlist
})(jQuery);
BBV.namespace("orion").RecentlyViewed=orion.RecentlyViewed||(function($){function RecentlyViewed(publisher,isDialog){var rv=this;
rv.publisher=publisher;
rv.$myOrionBar=$("#site-orion-bar");
rv.elem="#recently-viewed";
rv.mediaUrl=rv.$myOrionBar.data("mediaitems-url");
rv.localStrings=orioni18n.myOrionBar;
rv.$container=$("#myorionbar-dialog .dialog-inner");
rv.$myorionbarDialogs=$("#myorionbar-dialog");
if(!(rv instanceof RecentlyViewed)){throw new Error("RecentlyViewed called without new.")
}if(BBV.user().isLoggedIn){rv.handlers();
rv.initialize()
}return rv
}RecentlyViewed.prototype.handlers=function(){var self=this;
self.$container.delegate("#clear-recent","click",function(event){var bookmarkRequest=orion.oesp.bookmarkEndpoint.clearBookmarks();
bookmarkRequest.done(function(){log("clear");
$(self.elem).find("ul.grid-view").empty()
});
event.preventDefault()
})
};
RecentlyViewed.prototype.initialize=function(){var self=this;
var bookmarkRequest=orion.oesp.bookmarkEndpoint.requestBookmarks();
bookmarkRequest.done(function(data){self.bookmarks=data.bookmarks;
if(self.bookmarks.length){self.getBookmarks()
}else{self.mediaItems="";
self.render()
}});
return self
};
RecentlyViewed.prototype.getBookmarks=function(){var self=this;
var programs=$.map(self.bookmarks,function(bookmark){return bookmark.mediaItemId
}).join("|");
orion.oesp.mediaItemEndpoint.requestMediaItems({byId:programs}).done(function(data){self.mediaItems=data.mediaItems;
self.render()
}).fail(function(){self.mediaItems="";
self.render()
});
return self
};
RecentlyViewed.prototype.render=function(){var self=this;
self.build();
self.attach();
return self
};
RecentlyViewed.prototype.build=function(){var rv=this;
BBV.each(rv.mediaItems,function(index,item){item.localStrings=rv.localStrings;
item.index=index;
BBV.extend(item,orion.util.mediamethods)
});
rv.$template=$(Mustache.to_html(orion.templates.RecentlyViewedWrapper,BBV.extend({template:rv.mediaItems},{localStrings:rv.localStrings,count:rv.mediaItems.length},orion.util.mediamethods),{RecentlyViewedBody:orion.templates.RecentlyViewedBody}));
return rv
};
RecentlyViewed.prototype.attach=function(){var rv=this;
$(rv.elem).remove();
rv.$container.append(rv.$template);
rv.$myorionbarDialogs.trigger("loaded");
return rv
};
return RecentlyViewed
})(jQuery);
BBV.namespace("orion").MyRentals=orion.MyRentals||(function($){function MyRentals(publisher,isDialog){var self=this;
self.isDialog=(isDialog)?true:false;
self.publisher=publisher;
self.$myOrionBar=$("#site-orion-bar");
self.elem="#my-rentals";
self.localStrings=orioni18n.myOrionBar;
self.manageUrl=self.$myOrionBar.data("manage-my-rentals-url");
self.$containers=$("#my-rentals, section.my-rentals");
self.$containerDialog=$("#myorionbar-dialog .dialog-inner");
self.$containerModule=$("#my-rentals-module");
self.$myorionbarDialogs=$("#myorionbar-dialog");
self.isAdult=false;
if(!(self instanceof MyRentals)){throw new Error("MyRentals called without new.")
}orion.oesp.session.done(function(session){if(session.isAuthenticated()){self.isAdult=session.isAdultPinVerified();
self.initialize();
self.handlers()
}});
return self
}MyRentals.prototype.initialize=function(){var self=this;
var purchaseEndpoint=orion.oesp.purchaseEndpoint;
var purchaseRequest={};
var mediaRequest={};
purchaseRequest=purchaseEndpoint.requestActivePurchases();
mediaRequest=purchaseRequest.requestMediaItems(self.isAdult);
purchaseRequest.done(function(purchaseData){mediaRequest.done(function(mediaData){self.products=purchaseData.products;
self.mediaItems=mediaData.mediaItems;
self.extendMediaItems();
log("MyRentals is dialog: ",self.isDialog);
if(self.isDialog){self.buildDialogTemplate()
}else{self.buildModuleTemplate();
self.activeRentalCount()
}self.activeRentalCount()
}).fail(function(){log("MyRentals: no purchased items");
self.mediaItems=[];
self.extendMediaItems();
if(self.isDialog){self.buildDialogTemplate()
}else{self.buildModuleTemplate()
}})
}).fail(function(){log("MyRentals purchase request failed")
});
return self
};
MyRentals.prototype.handlers=function(){var self=this;
self.$containers.delegate(".view-toggle a","click",function(event){self.toggleViews(event)
})
};
MyRentals.prototype.toggleViews=function(event){event.preventDefault();
var self=this,elem=event.target,$elem=$(elem),$container=$elem.closest(".myorionbar-module"),$parent=$elem.closest(".view-toggle"),$newView=$($elem.attr("href").replace("#","."),$container);
if(!$elem.is(".active")){$parent.find(".active").removeClass("active");
$elem.addClass("active");
$(".content-list ul",$container).hide();
$newView.show()
}};
MyRentals.prototype.extendMediaItems=function(){var self=this;
BBV.each(self.mediaItems,function(mediaIdx,item){item.localStrings=self.localStrings;
item.index=mediaIdx;
BBV.each(self.products,function(productIdx,product){if(item.hasCurrentProductId(product.id)){item.productExpirationDate=product.entitlementEnd
}})
});
self.viewModel=BBV.extend({template:self.mediaItems},{localStrings:self.localStrings,manageUrl:self.manageUrl,count:self.mediaItems.length},orion.util.mediamethods);
return self
};
MyRentals.prototype.buildDialogTemplate=function(){var self=this;
var htmlDialog=Mustache.to_html(orion.templates.MyRentalsWrapper,self.viewModel,{MyRentalsBody:orion.templates.MyRentalsBody});
self.$templateDialog=$(htmlDialog);
self.$containerDialog.append(self.$templateDialog);
orion.modules.MyOrionBar.showDialog("my-rentals");
orion.Playlist.setState("#my-rentals");
self.stopLoaders()
};
MyRentals.prototype.buildModuleTemplate=function(){var self=this;
if(self.$containerModule.length){var htmlModule=Mustache.to_html(orion.templates.MyRentalsBody,self.viewModel);
self.$templateModule=$(htmlModule);
self.$containerModule.find(".section").empty().html(self.$templateModule);
orion.app.recommendations.updateRatedItems(self.$containerModule.find(".section"))
}self.stopLoaders()
};
MyRentals.prototype.stopLoaders=function(){var self=this;
self.$myorionbarDialogs.trigger("loaded")
};
MyRentals.prototype.activeRentalCount=function(){var self=this;
var arCount=(self.mediaItems)?self.mediaItems.length:0;
self.$containerModule.find(".active-rental-count").html(arCount)
};
return MyRentals
})(jQuery);
BBV.namespace("orion").FacebookActivity=orion.FacebookActivity||(function($){function FacebookActivity(publisher,isDialog){var fb=this;
fb.publisher=publisher;
fb.$myOrionBar=$("#site-orion-bar");
fb.elem="#facebook";
fb.localStrings=orioni18n.myOrionBar;
fb.$container=$("#myorionbar-dialog .dialog-inner");
fb.$myorionbarDialogs=$("#myorionbar-dialog");
if(!(fb instanceof FacebookActivity)){throw new Error("FacebookActivity called without new.")
}orion.util.oesp.aquireCredentials(function(){if(BBV.user().isLoggedIn){fb.initialize()
}});
return fb
}FacebookActivity.prototype={initialize:function(){var fb=this;
fb.build();
fb.attach();
return fb
},build:function(){var fb=this;
fb.options={url:encodeURI(window.location.host),width:"940",height:"403",header:"false",colorScheme:"dark",font:"arial",borderColor:"#000000",recommendations:"true",appId:BBV.settings.facebook.appId};
fb.viewModel=BBV.extend({template:fb.options},{localStrings:fb.localStrings},orion.util.mediamethods);
fb.$template=$(Mustache.to_html(orion.templates.FacebookActivity,fb.viewModel));
return fb
},attach:function(options){var fb=this;
$(fb.elem).remove();
fb.$container.append(fb.$template);
facebook.parse();
fb.$myorionbarDialogs.trigger("loaded");
return fb
}};
return FacebookActivity
})(jQuery);
BBV.namespace("orion.widgets").FeedContainer=orion.widgets.FeedContainer||(function($,window){function parseBoolean(value){if(typeof value=="boolean"){return value
}if(typeof value==="string"){value=value.replace(/^\s+|\s+$/g,"").toLowerCase();
if(value==="true"||value==="false"){return value==="true"
}else{if(value==="1"||value==="0"){return value==="1"
}}}return false
}function FeedContainer(elem,options){var fc=this;
var $elem=$(elem);
var range,rangeParts;
var template;
options=options||{};
if(!(this instanceof FeedContainer)){return new FeedContainer(elem,feedObj)
}fc.elem=elem;
fc.$=$elem;
fc.localStrings=options.localStrings||orioni18n[$elem.data("i18n-property")];
fc.imageType=options.imageType||$elem.data("image-type");
fc.loaderWidth=options.loaderWidth||926;
fc.loaderHeight=options.loaderHeight||260;
fc.pageSize=options.pageSize||$elem.data("page-size");
fc.pageSize=typeof fc.pageSize=="number"?fc.pageSize:0;
fc.enablePaging=options.enablePaging||parseBoolean($elem.data("enable-paging"));
template=$elem.data("template");
if(template&&template.indexOf&&template.indexOf(",")>-1){fc.template=[];
fc.templates=$elem.data("template").split(",");
$.each(fc.templates,function(idx,template){fc.template.push(orion.templates[$.trim(template)])
})
}else{fc.template=orion.templates[$elem.data("template")]||orion.templates.FeedGridItem
}range=options.range||orion.util.url.getParam(fc.feedUrl,"range");
if(range){rangeParts=range.split("-");
fc.outerRange={start:parseInt(rangeParts[0],10),end:parseInt(rangeParts[1],10)}
}if(options.feedData){fc.feedUrl="";
fc.processFeed(options.feedData)
}else{fc.feedUrl=$elem.data("feed-url");
fc.$.empty().loader({flow:["append","overlay"],target:".content-list",minheight:fc.loaderHeight,minwidth:fc.loaderWidth});
fc.queryForFeed()
}return fc
}FeedContainer.prototype={constructor:FeedContainer,processFeed:function(feedData){var self=this;
self.medias=self.formatData(feedData);
self.mediaType=feedData.mediaGroups?"mediaGroups":"mediaItems";
self.$.empty();
if(typeof(self.template)==="string"){self.render()
}else{$.each(self.template,function(idx,template){self.render(template)
})
}self.$.trigger("loaded");
view=self.$.closest(".content-list").siblings(".user-functionality").find(".view-toggle a.active").closest("li").attr("class")||"grid";
self.$.children("ul").hide();
self.$.children("ul."+view+"-view").show()
},queryForFeed:function(){var self=this,range={start:1,end:self.pageSize},baseFeedUrl=self.feedUrl;
if("outerRange" in self&&(self.outerRange.end-self.outerRange.start)){range.start=self.outerRange.start;
range.end=range.start-1+self.pageSize
}self.feedUrl=orion.util.url.setParam(self.feedUrl,"range",range.start+"-"+range.end);
self.$.trigger("loading");
orion.util.oesp.get(self.feedUrl,{success:function(data){self.totalResults=data.totalResults;
self.processFeed(data);
orion.app.trigger("feedLoaded:"+baseFeedUrl,self.totalResults)
},error:function(){}})
},setTemplate:function(template){if(typeof template=="string"){switch(template.toLowerCase()){case"grid":this.template=orion.templates.FeedGridItem;
break;
case"list":this.template=orion.templates.FeedListItem;
break;
case"thumb":this.template=orion.templates.FeedThumbItem;
break
}}else{this.template=template
}},render:function(template){var feedContainer=this;
var data=BBV.extend({medias:feedContainer.medias},{localStrings:feedContainer.localStrings,imageType:feedContainer.imageType},orion.util.mediamethods);
var template=template||feedContainer.template;
var feed=Mustache.to_html(template,data);
feedContainer.$.append(feed);
feedContainer.checkEntitlements(feedContainer.$);
if(feedContainer.enablePaging){var pagerOptions={elem:feedContainer.$,pageSize:feedContainer.pageSize,totalLength:feedContainer.totalResults,updateFn:function(range){var outerRange={start:1,end:Infinity};
if("outerRange" in feedContainer){outerRange=feedContainer.outerRange
}range.start=(range.start-1)+outerRange.start;
range.end=(range.start-1)+feedContainer.pageSize;
range.end=Math.min(range.end,outerRange.end);
new orion.widgets.FeedContainer(feedContainer.elem,{range:range.start+"-"+range.end})
}};
if(!feedContainer.$.siblings(".pagination").length){this.pager=new orion.widgets.Pager(pagerOptions)
}}else{}orion.Playlist.setState(feedContainer.$);
orion.app.recommendations.updateRatedItems(feedContainer.$)
},checkEntitlements:function(element){var feedContainer=this;
var selector="[data-media-entitlements]";
var lock=".locked";
var $elem=$(element);
var items=$elem.is(selector)?$elem:$elem.find(selector);
orion.oesp.session.done(function(session){items.each(function(){var item=$(this);
var entitlement=item.data("media-entitlements").split(",");
if(session.hasEntitlement(entitlement)){item.find(lock).hide()
}})
})
},formatData:function(data){var result=[];
var mediaAssets=data.mediaGroups||data.mediaItems||data;
var i,length;
var asset,mediaObject;
var self=this;
if(self.pageSize===0){length=mediaAssets.length
}else{length=Math.min(self.pageSize,mediaAssets.length);
if("outerRange" in self){length=Math.min(length,((self.outerRange.end+1)-self.outerRange.start))
}}self.totalLength=length;
for(i=0;
i<length;
i++){asset=mediaAssets[i];
asset=BBV.extend({localStrings:self.localStrings,imageType:self.imageType},asset,orion.util.mediamethods);
mediaObject=BBV.Object.create(BBV.feed.MediaObject);
result.push(mediaObject.initialize(asset))
}return result
}};
return FeedContainer
})(jQuery,window);
BBV.namespace("orion.widgets").ListingContainer=orion.widgets.ListingContainer||(function($){function parseBoolean(value){if(typeof value=="boolean"){return value
}if(typeof value==="string"){value=value.replace(/^\s+|\s+$/g,"").toLowerCase();
if(value==="true"||value==="false"){return value==="true"
}else{if(value==="1"||value==="0"){return value==="1"
}}}return false
}function msToTime(time){var n=new Date(time),hours=n.getHours(),minutes=n.getMinutes();
return[(hours<10)?"0"+hours:+hours,":",(minutes<10)?"0"+minutes:+minutes].join("")
}function msToDate(time){return(BBV.utils.date(time).format("DDD D MMM")).toUpperCase()
}var currentDate=null;
var utilMethods={listings:{checkIfLiveStream:function(){var now=+new Date(),isStationLive=false,isShowLive=(this.startTime<now&&this.endTime>now);
return(isStationLive&&isShowLive)
},getFormattedTime:function(){return msToTime(this.startTime)+"-"+msToTime(this.endTime)
},getFormattedStartTime:function(){return msToTime(this.startTime)
},getFormattedDate:function(){currentDate=msToDate(this.startTime);
return currentDate
},isNewDate:function(){return this.index===0||currentDate!=msToDate(this.startTime)
},isAvailable:function(){var notEntitled=BBV.user().isEntitlementLocked(),loggedIn=this.isLoggedIn();
return(loggedIn&&!notEntitled)
},isLoggedIn:function(){return BBV.user().isLoggedIn
},localizeText:function(){return function(text){return this.localStrings[text]
}
},upcomingLink:function(){var link=[BBV.settings.site.urls.search.tvresults,"?q="],title=this.title||"";
link.push(encodeURIComponent(title.replace(/\s/g,"-")));
return link.join("")
}}};
function ListingContainer(elem,options){var self=this;
var $elem=$(elem);
var range,rangeParts;
options=options||{};
if(!(this instanceof ListingContainer)){return new ListingContainer(elem,options)
}self.elem=elem;
self.$=$elem;
self.localStrings=orioni18n[$elem.data("i18n-property")];
if($.type(self.localStrings)==="string"){self.localStrings=JSON.parse(self.localStrings)
}self.isLive=$elem.data("isLive");
self.title=$elem.data("title");
self.startTime=(function(){var n=new Date();
n.setMinutes(Math.floor(n.getMinutes()/30)*30);
n.setSeconds(0);
n.setMilliseconds(0);
return n.getTime()
})();
self.pageSize=options.pageSize||$elem.data("page-size");
self.pageSize=typeof self.pageSize=="number"?self.pageSize:0;
self.enablePaging=options.enablePaging||parseBoolean($elem.data("enable-paging"));
if($elem.data("template").indexOf(",")>-1){self.template=[];
self.templates=$elem.data("template").split(",");
$.each(self.templates,function(idx,template){self.template.push(orion.templates[$.trim(template)])
})
}else{self.template=orion.templates[$elem.data("template")]||orion.templates.CardListings
}range=options.range||orion.util.url.getParam(self.listingUrl,"range");
if(range){rangeParts=range.split("-");
self.outerRange={start:parseInt(rangeParts[0],10),end:parseInt(rangeParts[1],10)}
}if(options.listingData){self.listingUrl="";
self.processListing(options.listingData)
}else{self.listingUrl=$elem.data("listing-url");
self.$.loader({flow:["append","overlay"],target:".content-list",minheight:260,minwidth:926});
self.queryForListing()
}var $currentSelection=null;
self.$.delegate("li","click",function(event){var $container=$(event.target).closest("li");
if(!$container.hasClass("focused")){if($currentSelection!=null){$currentSelection.removeClass("focused");
$currentSelection.find(".program-details-wrap").slideUp()
}$currentSelection=$container;
$container.addClass("focused");
$container.find(".program-details-wrap").slideDown()
}});
return self
}ListingContainer.prototype={constructor:ListingContainer,processListing:function(listingData){var self=this;
self.listings=self.formatData(listingData);
self.$.empty();
if(typeof(self.template)==="string"){self.render()
}else{$.each(self.template,function(idx,template){self.render(template)
})
}self.$.trigger("loaded")
},queryForListing:function(){var self=this,range={start:1,end:self.pageSize};
if("outerRange" in self&&(self.outerRange.end-self.outerRange.start)){range.start=self.outerRange.start;
range.end=range.start-1+self.pageSize
}orion.oesp.session.withSession(function(session){self.listingUrl=orion.util.url.setParam(self.listingUrl,"range",range.start+"-"+range.end);
self.listingUrl=orion.util.url.setParam(self.listingUrl,"byStartTime",self.startTime+"~");
self.listingUrl=orion.util.url.setParam(self.listingUrl,"byLocationId",session.locationId);
self.$.trigger("loading");
orion.util.oesp.get(self.listingUrl,{success:function(data){self.totalResults=data.totalResults;
self.processListing(data)
},error:function(){}})
})
},render:function(template){var lc=this,listings=lc.listings,len=listings.length,i=0,data=[];
for(;
i<len;
i++){data.push(BBV.extend({localStrings:lc.localStrings},{index:i,listingId:listings[i].id,stationId:listings[i].stationId,stationTitle:lc.title,isLive:lc.isLive,startTime:listings[i].startTime,endTime:listings[i].endTime,rating:listings[i].program.parentalRating},listings[i].program,utilMethods.listings))
}data={listings:data,ratedLabel:orioni18n.channelCardFeed.ratedlabel};
var template=template||lc.template;
var listing=Mustache.to_html(template,data);
lc.$.append(listing);
if(lc.enablePaging){var pagerOptions={elem:lc.$,pageSize:lc.pageSize,totalLength:lc.totalResults,updateFn:function(range){var outerRange={start:1,end:Infinity};
if("outerRange" in lc){outerRange=lc.outerRange
}range.start=(range.start-1)+outerRange.start;
range.end=(range.start-1)+lc.pageSize;
range.end=Math.min(range.end,outerRange.end);
new orion.widgets.ListingContainer(lc.elem,{range:range.start+"-"+range.end});
orion.Playlist.setState(lc.$)
}};
if(!lc.$.siblings(".pagination").length){this.pager=new orion.widgets.Pager(pagerOptions)
}}else{}},formatData:function(data){var result=[];
var listingAssets=data.listings||data;
var i,length;
var asset,mediaObject;
var self=this;
if(self.pageSize===0){length=listingAssets.length
}else{length=Math.min(self.pageSize,listingAssets.length);
if("outerRange" in self){length=Math.min(length,((self.outerRange.end+1)-self.outerRange.start))
}}self.totalLength=length;
for(i=0;
i<length;
i++){asset=listingAssets[i];
asset=BBV.extend({localStrings:self.localStrings},asset,utilMethods.listings);
result.push(asset)
}return result
}};
return ListingContainer
})(jQuery);
BBV.namespace("orion.widgets").VideoPlayer=orion.widgets.VideoPlayer||(function($){var MIN_FLASH_VERSION="10.1",FLASH_INSTALL_URL="swf/expressInstall.swf",PLAYER_STANDARD_WIDTH="768",PLAYER_STANDARD_HEIGHT="436",PLAYER_MINI_WIDTH="317",PLAYER_MINI_HEIGHT="180",PLAYER_ID_BASE="orionPlayer",VIDEO_EVENTS={setOptData:function(vp,e){if(e.offset){vp.setOptDatas((e.offset>0)?e.offset:0)
}},assetReady:function(vp,e){$(".video-player-module > .loader").hide();
vp.playHandler()
},assetLoaded:null,contentStart:null,contentEnd:null,stateChange:function(vp,e){vp.stateChange(e)
},addedToPlaylist:null,shareClicked:null,fullScreen:null,channelSelected:null,programChanged:function(vp,e){vp.trigger("programChange",e)
},errorOccurred:function(vp,e){vp.addError(e)
},inactivity:function(vp,e){vp.handleInactivity(e)
},parentalPINUnverified:null,inactivityTimeout:null,debug:null};
var idCounter=1;
var makeEventHandler=function(videoPlayer,eventName,publisher,fn){return function(event){if(fn&&typeof fn=="function"){fn(videoPlayer,event)
}videoPlayer.trigger(eventName,event);
publisher.trigger(eventName,event)
}
};
function VideoPlayer(playerMode,placeholder){var self=this;
orion.util.PubSub.call(self);
if(!(this instanceof VideoPlayer)){return new VideoPlayer(playerMode,placeholder)
}log("Widget:VideoPlayer: Creating a video player widget.");
var isMini=("mini"==playerMode);
self.id=idCounter++;
self._player=new $.Deferred();
self.playerMode=playerMode||"standard";
self.width=isMini?PLAYER_MINI_WIDTH:PLAYER_STANDARD_WIDTH;
self.height=isMini?PLAYER_MINI_HEIGHT:PLAYER_STANDARD_HEIGHT;
self.languagePack=BBV.settings.videoPlayer.languagePackPath;
self.swfUrl=BBV.settings.videoPlayer.swfPath;
self.offset;
self.errors=[];
self.playState="playing";
self.placeholder=placeholder||null;
if(placeholder){this.embed(placeholder)
}if($.isFunction(checkFlash)){checkFlash()
}}orion.util.inherits(VideoPlayer,orion.util.PubSub);
VideoPlayer.prototype.getId=function(){return PLAYER_ID_BASE+this.id
};
VideoPlayer.prototype.getSelector=function(){return"#"+this.getId()
};
VideoPlayer.prototype.isEmbeded=function(){var self=this;
return self._player.isResolved()
};
VideoPlayer.prototype.stateChange=function(event){var self=this;
self.playState=event.state==="playing"||event.state==="paused"?event.state:""
};
VideoPlayer.prototype.addError=function(error){var self=this;
self.errors.push(error.errorCode)
};
VideoPlayer.prototype.embed=function(elem,flashVars,params,attributes){log("Widget:VideoPlayer: Embedding player widget.");
var self=this;
var swf={};
var $elem=$(elem);
if(self.isEmbeded()){return
}swf.placeholderId=$elem.attr("id");
if(!swf.placeholderId){swf.placeholderId=self.getId()+"placeholder";
$elem.attr("id",swf.placeholderId)
}orion.oesp.session.withSession(function(session){var playerInitFn="onPlayerLoaded_"+self.getId();
var cookie=BBV.utils.cookie(BBV.settings.cookie.tokenName);
self.baseUrl=/[^\/]*\/\/[^\/]*/.exec(window.location)[0];
self.username=session.username;
self.token=session.oespToken;
self.tpToken=cookie.get("tpToken")||"asdasdasdaefewfdksldkcjlsdkcs";
self.mediaItem=null;
var _flashVars={OESPBaseUrl:self.baseUrl+"/oesp/api/",OESPUsername:self.username,TPAuthToken:self.tpToken,authToken:self.token,autoPlay:true,showMinimisedScrubber:false,favouriteChannelList:null,languagePack:self.baseUrl+self.languagePack,omnitureBaseUri:BBV.settings.site.urls.omniture.script,playerLoadedCallback:playerInitFn,playerMode:self.playerMode,omnitureAccount:BBV.settings.omniture.s_account,omnitureVisitorNamespace:BBV.settings.omniture.visitorNamespace,omnitureTrackingServer:BBV.settings.omniture.trackingServer,omniturePageName:"player/videoplayer",posterFrameURL:"/etc/designs/orion/upc/nl/img/backgrounds/player_bg.png",sharing:true,viewedCheckPoint:300,countryCode:session.countryCode,languageCode:session.languageCode,inactivityLimit:"14400",bufferTime:1};
var _params={allowFullScreen:"true",allowScriptAccess:"always",wmode:"opaque",bgcolor:"#000000"};
var _attributes={id:self.getId()};
swf.flashVars=$.extend(flashVars||{},_flashVars);
swf.params=$.extend(params||{},_params);
swf.attributes=$.extend(attributes||{},_attributes);
window[playerInitFn]=function(){var i,event,handler;
var orionPlayer=$(self.getSelector()).get(0);
log("Widget:VideoPlayer: Initializing player");
window.orionPlayer=orionPlayer;
if(!orionPlayer){log("Widget:VideoPlayer: Warning: cannot find the orionPlayer.");
log("Aborting video player event binding.");
return
}for(event in VIDEO_EVENTS){handler="on"+event.substr(0,1).toUpperCase()+event.substr(1)+"_"+self.getId();
window[handler]=makeEventHandler(self,event,orion.app,VIDEO_EVENTS[event]);
orionPlayer.addListener(event,handler)
}self._player.resolveWith(orionPlayer)
};
swf.savedClasses=$("#"+swf.placeholderId).attr("class");
$(".video-player-module > .loader").show();
if(session.isAuthenticated()){orion.util.oesp.get(orion.oesp.routes.favouritechannels,{success:function(responseFavorites){self.favorites=responseFavorites.favouriteChannels;
orion.util.oesp.get(orion.oesp.routes.channels,{success:function(responseChannels){self.channels=responseChannels.channels;
swf.flashVars.favouriteChannelList=self.getFavouriteChannels();
self.initializeSwf(swf)
}})
}})
}else{self.initializeSwf(swf)
}})
};
VideoPlayer.prototype.initializeSwf=function(swf){var self=this;
swfobject.embedSWF(self.swfUrl,swf.placeholderId,self.width,self.height,MIN_FLASH_VERSION,FLASH_INSTALL_URL,swf.flashVars,swf.params,swf.attributes,function(e){if(e.success){log("Widget:VideoPlayer: Player embed success.");
$("#"+swf.attributes.id).addClass(swf.savedClasses)
}else{log("Widget:VideoPlayer: Player failed to embed.")
}})
};
VideoPlayer.prototype.remove=function(){var player=this;
if(!player.isEmbeded()){return
}player._player.then(function(){log("Widget:VideoPlayer: Removing player widget:",player.getId());
swfobject.removeSWF(player.getId());
player._player=new $.Deferred()
})
};
VideoPlayer.prototype.setOptDatas=function(offset){var self=this;
var offsetStr=(offset)?",offset="+offset:"";
var token=self.token?self.token:"";
var username=self.username?self.username:"";
var optData="={token="+token+",username="+username+",mediaItemId="+self.mediaItem.id+offsetStr+",playState="+self.playState+"}";
document.getElementById("WidevinePlugin").setOptData(optData);
log("setOptDatas:Widget:VideoPlayer: optData = ",optData)
};
VideoPlayer.prototype.loadVideo=function(mediaItem){var self=this;
self.mediaItem=mediaItem;
self.setOptDatas();
self._player.done(function(){var swf=this;
WVSetEmmURL(WVConfig.WV_EMM_URL);
WVSetHeartbeatUrl(WVConfig.WV_HEARTBEAT_URL);
WVSetHeartbeatPeriod(WVConfig.WV_HEARTBEAT_PERIOD);
var pollCount=0;
var isSwfReady=setInterval(function(){pollCount++;
if(!swf.loadVideo){if(pollCount>=100){log("VideoPlayer.loadVideo -> swf.loadVideo DNE, we gave up on it");
clearInterval(isSwfReady)
}}else{log("VideoPlayer.loadVideo -> swf.loadVideo exists, loading mediaItem.id: "+mediaItem.id);
log("VideoPlayer.loadVideo -> pollCount: "+pollCount);
swf.loadVideo(mediaItem.id);
clearInterval(isSwfReady)
}},100)
});
self._player.fail(function(){log("Widget:VideoPlayer: There was an error loading the mediaItem.")
});
return self
};
VideoPlayer.prototype.loadChannel=function(channelId){var self=this;
self._player.done(function(){var swf=this;
var token=self.token?self.token:"";
var username=self.username?self.username:"";
var optData="={token="+token+",username="+username+",channelId="+channelId+",playState="+self.playState+"}";
document.getElementById("WidevinePlugin").setOptData(optData);
log("Widget:VideoPlayer: optData = ",optData);
log("Widget:VideoPlayer: Loading channel into the swf.",channelId);
WVSetEmmURL(WVConfig.WV_EMM_URL);
WVSetHeartbeatUrl(WVConfig.WV_HEARTBEAT_URL);
WVSetHeartbeatPeriod(WVConfig.WV_HEARTBEAT_PERIOD);
swf.loadChannel(channelId)
});
return self
};
VideoPlayer.prototype.playHandler=function(){var self=this;
if(self.playerMode=="standard"){self._player.done(function(){if(self.offset){self.playFrom(self.offset)
}else{self.play()
}})
}else{log("Ignore AssetReady Handler For Live Player...")
}};
VideoPlayer.prototype.play=function(){var self=this;
self._player.done(function(){var swf=this;
try{swf.playVideo()
}catch(e){log('error trying to call method "playVideo" on the orion player swf');
log(e)
}});
return self
};
VideoPlayer.prototype.pause=function(){var self=this;
self._player.done(function(){var swf=this;
swf.pauseVideo()
});
return self
};
VideoPlayer.prototype.stop=function(){var self=this;
self._player.done(function(){var swf=this;
try{swf.stopVideo()
}catch(e){log('error trying to call method "stopVideo" on the orion player swf');
log(e)
}});
return self
};
VideoPlayer.prototype.seekTo=function(bookmark){var self=this;
self._player.done(function(){var swf=this;
swf.seekTo(bookmark)
});
return self
};
VideoPlayer.prototype.playFrom=function(offset){var self=this;
self._player.done(function(){var swf=this;
log("offset",offset);
try{swf.playFrom(offset)
}catch(e){log('error trying to call method "playFrom" on the orion player swf');
log(e)
}});
return self
};
VideoPlayer.prototype.playlistSuccess=function(){var self=this;
self._player.done(function(){var swf=this;
if(swf.playlistSuccess){swf.playlistSuccess()
}else{$(".video-player-module > .loader").hide()
}});
return self
};
VideoPlayer.prototype.loadMediaItem=function(mediaItem,offset){var self=this;
self.mediaItem=mediaItem;
orion.oesp.session.done(function(session){var permission=session.getPermissionToPlayMediaItem(mediaItem);
permission.done(function(){var inList=orion.Playlist.containsProgramId({id:mediaItem.id});
if(inList){log("VideoPlayer.loadMediaItem -> playlist success");
self.playlistSuccess()
}self.loadVideo(mediaItem);
if(offset){self.setOptDatas(offset);
self.offset=offset
}else{self.setOptDatas(0);
self.offset=0
}});
permission.fail(function(reason){self.trigger("permission.fail."+reason)
})
})
};
VideoPlayer.prototype.playChannel=function(channel){var self=this;
orion.oesp.session.done(function(session){var permission=session.getPermissionToPlayChannel(channel);
permission.done(function(){self.loadChannel(channel.id);
self.bind("programChange",function(e){var p=session.getPermissionToPlayChannel(channel);
p.fail(function(reason){self.trigger("permission.fail."+reason)
})
})
});
permission.fail(function(reason){self.trigger("permission.fail."+reason)
})
})
};
VideoPlayer.prototype.getFavouriteChannels=function(){var self=this;
var channelIds=[];
var channels=[];
$.each(self.favorites,function(){channelIds.push(this.channelId)
});
$.each(self.channels,function(){if($.inArray(this["id"],channelIds)>=0){channels.push(this["channelNumber"])
}});
return channels.join(",")
};
VideoPlayer.prototype.handleInactivity=function(){var self=this,confirm=orion.app.dialogManager.getDialog("confirmation"),resumePlay=function(){clearTimeout(deactiveTimer);
cleanupConfirmDialog();
self.play()
},deactivatePlayer=function(){cleanupConfirmDialog();
log("TODO: Send error to player saying the user is inactive.");
self.trigger("inactivityTimeout")
},cleanupConfirmDialog=function(){confirm.hide();
confirm.unbind("cancel",deactivatePlayer);
confirm.unbind("confirm",resumePlay);
delete confirm
};
self.stop();
confirm.bind("cancel",deactivatePlayer);
confirm.bind("confirm",resumePlay);
confirm.setContent(orioni18n.videoPlayer.inactivityAlertTitle,orioni18n.videoPlayer.inactivityAlertMessage);
confirm.centerOn("window");
confirm.show();
var deactiveTimer=setTimeout(deactivatePlayer,60000);
return self
};
return VideoPlayer
})(jQuery);
BBV.namespace("orion.widgets").VideoMessage=orion.widgets.VideoMessage||(function($){function VideoMessage(message,direction){log("Running VideoMessage constructor.");
this.message=message;
this.direction=direction||"left"
}VideoMessage.prototype.render=function(){var videoMessage=this;
var templateContent={close:"close",message:videoMessage.message||"",onLeftSide:videoMessage.direction=="left"};
if(videoMessage.message!=""){var $videoMessage=$(Mustache.to_html(orion.templates.VideoMessage,templateContent));
videoMessage.$=$videoMessage;
videoMessage.elem=$videoMessage.get(0);
videoMessage.contentArea=$videoMessage.find(".message-body");
$videoMessage.delegate(".close","click",function(){videoMessage.hide()
});
return this
}};
VideoMessage.prototype.appendTo=function(elem){if(!this.$){this.render()
}$(elem).append(this.$);
return this
};
VideoMessage.prototype.show=function(){if(!this.$){this.render()
}this.$.show();
return this
};
VideoMessage.prototype.hide=function(){if(this.$){this.$.hide()
}return this
};
VideoMessage.prototype.remove=function(){if(this.$){this.$.remove()
}return this
};
return VideoMessage
})(jQuery);
BBV.namespace("orion.widgets").Pager=orion.widgets.Pager||(function($){function Pager(options){var self=this;
self.pagingElement=$('<div class="pagination"><ul></ul></div>');
var opts={elem:null,pageSize:15,totalLength:0,updateFn:function(){}};
$.extend(opts,options);
this.elem=opts.elem;
this.pageSize=opts.pageSize;
this.totalLength=opts.totalLength;
this.update=opts.updateFn;
this.currentStartIndex=1;
$(this.elem).after(self.pagingElement);
if(this.totalLength>0){this.render()
}this.bindEvents()
}Pager.prototype={constructor:Pager,setTotalLength:function(value){if(typeof value==="number"&&value!==this.totalLength){this.totalLength=value;
if(this.currentStartIndex>this.totalLength){this.currentStartIndex=this.totalLength
}this.render()
}},render:function(){var self=this,current,last,li1,li2,li3,li5,li6,li7;
current=Math.ceil(self.currentStartIndex/self.pageSize);
last=Math.ceil(self.totalLength/self.pageSize);
if(last<=1){self.pagingElement.remove();
return
}self.pagingElement.children("ul").empty();
li1=current!==1?current<=4?'<li><a href="javascript:/*1*/;" data-page-number="1">1</a></li>':'<li><a href="javascript:/*1*/;" data-page-number="1">1</a></li><li>...</li>':"";
li2=(current-2)>1?'<li><a href="javascript:/*'+(current-2)+'*/;" data-page-number="'+(current-2)+'">'+(current-2)+"</a></li>":"";
li3=(current-1)>1?'<li><a href="javascript:/*'+(current-1)+'*/;" data-page-number="'+(current-1)+'">'+(current-1)+"</a></li>":"";
li5=(current+1)<last?'<li><a href="javascript:/*'+(current+1)+'*/;" data-page-number="'+(current+1)+'">'+(current+1)+"</a></li>":"";
li6=(current+2)<last?'<li><a href="javascript:/*'+(current+2)+'*/;" data-page-number="'+(current+2)+'">'+(current+2)+"</a></li>":"";
li7=current!==last?current>=(last-3)?'<li><a href="javascript:/*'+last+'*/;" data-page-number="'+last+'">'+last+"</a></li>":'<li>...</li><li><a href="javascript:/*'+last+'*/;" data-page-number="'+last+'">'+last+"</a></li>":"";
self.pagingElement.children("ul").append("				"+li1+"				"+li2+"				"+li3+'				<li><a href="javascript:/*'+current+'*/;" data-page-number="'+current+'" class="active">'+current+"</a></li>				"+li5+"				"+li6+"				"+li7+"			")
},bindEvents:function(){var self=this;
self.pagingElement.delegate("a","click",function(e){e.preventDefault();
var $this=$(this),pageNumber=$this.data("pageNumber"),newOffsetIndex=(pageNumber-1)*self.pageSize,newRange={start:newOffsetIndex+1,pageNumber:pageNumber};
self.currentStartIndex=newRange.start;
self.render();
self.update(newRange)
})
}};
return Pager
})(jQuery);
BBV.namespace("orion.widgets").Recommendations=orion.widgets.Recommendations||(function($){var oesp=orion.util.oesp;
var RATINGS_URL=BBV.settings.oespRoutes.mediaitemratings;
var EVENTS_URL=BBV.settings.oespRoutes.events;
var RATINGS_CACHE="ratingsCache";
function Rating(customerId,countryCode,mediaItemId,rating){this.customerId=customerId;
this.countryCode=countryCode;
this.mediaItemId=mediaItemId;
this.rating=rating
}function findIndexByKeyValue(obj,key,value){for(var i=0;
i<obj.length;
i++){if(obj[i][key]==value){return i
}}return null
}Rating.prototype.toString=function(){return JSON.stringify(this)
};
function Recommendations(){var self=this;
self.initialize();
self.bindRatingEvents();
self.listenForSocialEvents();
orion.app.subscribe("loggedIn",$.proxy(self.initialize,self,true))
}Recommendations.Rating={LIKE:"like",DISLIKE:"dislike",NEUTRAL:"neutral"};
Recommendations.prototype.initialize=function(resettingNow){var self=this;
var ratings;
cacheDeferred=$.Deferred();
self.ratingsCache=cacheDeferred.promise();
orion.oesp.session.done(function(session){if(session.isAuthenticated()){if(sessionStorage&&$.isFunction(sessionStorage.getItem)&&sessionStorage.getItem(RATINGS_CACHE)){ratings=JSON.parse(sessionStorage.getItem(RATINGS_CACHE));
if(ratings){ratings=$.map(ratings,function(rating){return new Rating(rating.customerId,rating.countryCode,rating.mediaItemId,rating.rating)
});
cacheDeferred.resolve(ratings)
}}if(!ratings){oesp.get(RATINGS_URL+"/",{success:function(data){ratings=$.map(data.mediaItemRatings,function(rating){return new Rating(rating.customerId,rating.countryCode,rating.mediaItemId,rating.rating)
});
if(sessionStorage&&$.isFunction(sessionStorage.setItem)){sessionStorage.setItem(RATINGS_CACHE,JSON.stringify(ratings))
}cacheDeferred.resolve(ratings)
}})
}}if(resettingNow){cacheDeferred.done(function(){session.setModuleStateAll()
})
}})
};
Recommendations.prototype.clearCache=function(){sessionStorage.removeItem(RATINGS_CACHE)
};
Recommendations.prototype.inspectCache=function(){var self=this;
self.ratingsCache.done(function(cache){log("Ratings Cache:",cache)
})
};
Recommendations.prototype.bindRatingEvents=function(){var self=this;
$(".thumbs-up a").live("click",function(e){e.preventDefault();
target=$(e.target);
if(target.closest(".rating-like").length){handleRating(e,"reset")
}else{handleRating(e,"like")
}});
$(".thumbs-down a").live("click",function(e){e.preventDefault();
target=$(e.target);
if(target.closest(".rating-dislike").length){handleRating(e,"reset")
}else{handleRating(e,"dislike")
}});
function handleRating(e,status){var element=e.target;
orion.oesp.session.done(function(session){if(session.isAuthenticated()){if(status==="like"){self.likeAsset(getAssetId(element))
}else{if(status==="dislike"){self.dislikeAsset(getAssetId(element))
}else{if(status==="reset"){self.resetAsset(getAssetId(element))
}}}}else{var loginDialog=orion.app.dialogManager.getDialog("login");
loginDialog.pointTo(element);
loginDialog.show()
}})
}function getAssetId(element){var item=$(element).closest(".media-item, .media-group, .media-item-title-card");
return item.data("media-id")
}};
Recommendations.prototype.likeAsset=function(assetId){log("user likes",assetId);
this.rateAsset(assetId,Recommendations.Rating.LIKE)
};
Recommendations.prototype.dislikeAsset=function(assetId){log("user dislikes",assetId);
this.rateAsset(assetId,Recommendations.Rating.DISLIKE)
};
Recommendations.prototype.resetAsset=function(assetId){log("user neither likes nor dislikes",assetId);
this.rateAsset(assetId,Recommendations.Rating.NEUTRAL)
};
Recommendations.prototype.rateAsset=function(assetId,ratingValue){var self=this;
orion.oesp.session.done(function(session){var rating=new Rating(session.customer.id,session.countryCode,assetId,ratingValue);
if(ratingValue==="neutral"){oesp.del(RATINGS_URL+"/"+assetId,{data:JSON.stringify(rating),success:function(){self.ratingsCache.done(function(cache){self.removeRatedItems(cache,assetId)
})
}})
}else{oesp.put(RATINGS_URL+"/"+assetId,{data:JSON.stringify(rating),success:function(){self.ratingsCache.done(function(cache){self.removeRatedItems(cache,assetId);
cache.push(rating);
if(sessionStorage&&$.isFunction(sessionStorage.setItem)){sessionStorage.setItem(RATINGS_CACHE,JSON.stringify(cache))
}$('[data-media-id="'+assetId+'"]').each(function(){self.updateRatedItems(this)
});
if(ratingValue==="like"){orion.util.analytics.trackEvent("action",{pageName:"Engagement/Rating/Like",channel:"Engagement/Rating/Like",prop23:"Engagement",prop24:"Rating",prop26:"Like",eVar32:assetId,events:"event9,event33"})
}else{orion.util.analytics.trackEvent("action",{pageName:"Engagement/Rating/Dislike",channel:"Engagement/Rating/Dislike",prop23:"Engagement",prop24:"Rating",prop26:"Dislike",eVar32:assetId,events:"event9,event30"})
}})
}})
}}).fail(function(){log("user is not logged in and therfore cannot rate items")
})
};
Recommendations.prototype.withRating=function(assetId,callback){var self=this;
self.ratingsCache.done(function(cache){var i=cache.length;
var rating=null;
while(i--){if(cache[i].mediaItemId===assetId){rating=cache[i].rating;
break
}}callback(rating)
})
};
Recommendations.prototype.removeRatedItems=function(cache,assetId){var self=this;
var assetIndex=findIndexByKeyValue(cache,"mediaItemId",assetId);
if(assetIndex>=0){cache.splice(assetIndex,1);
if(sessionStorage&&$.isFunction(sessionStorage.setItem)){sessionStorage.setItem(RATINGS_CACHE,JSON.stringify(cache))
}$('[data-media-id="'+assetId+'"]').each(function(){self.updateRatedItems(this)
})
}};
Recommendations.prototype.updateRatedItems=function(element){var self=this;
var selector="[data-media-id]";
var $elem=$(element);
var items=$elem.is(selector)?$elem:$elem.find(selector);
items.each(function(){var item=$(this);
var crid=item.data("media-id");
self.withRating(crid,function(rating){if(rating===Recommendations.Rating.LIKE){item.removeClass("rating-dislike");
item.addClass("rating-like")
}else{if(rating===Recommendations.Rating.DISLIKE){item.removeClass("rating-like");
item.addClass("rating-dislike")
}else{item.removeClass("rating-like");
item.removeClass("rating-dislike")
}}})
})
};
Recommendations.prototype.learnEvent=function(eventType,assetId){oesp.post(EVENTS_URL+"/"+assetId,{data:JSON.stringify({type:eventType})})
};
Recommendations.prototype.learnSocialLike=function(assetId,assetName){this.learnEvent("socialLike",assetId);
orion.util.analytics.trackEvent("action",{pageName:"Engagement/Social/Facebook Like",channel:"Engagement/Social/Facebook Like",prop23:"Engagement",prop24:"Social",prop26:"Facebook Like",eVar14:assetId,eVar15:assetName,events:"event9,event29"})
};
Recommendations.prototype.learnAddToPlaylist=function(assetId){this.learnEvent("addToPlaylist",assetId)
};
Recommendations.prototype.listenForSocialEvents=function(){var self=this;
window.facebook.done(function(){FB.Event.subscribe("edge.create",function(response){if(arguments[1]&&arguments[1].dom&&$(arguments[1].dom).data("asset-id")){self.learnSocialLike($(arguments[1].dom).data("asset-id"),$(arguments[1].dom).data("asset-name"))
}else{log('Recommendations: missing "asset-id" data for .fb-like element')
}})
})
};
return Recommendations
})(jQuery);
BBV.namespace("orion.widgets").PredictiveSearch=orion.widgets.PredictiveSearch||(function($){function PredictiveSearch(container){var self=this;
self.form=$(container).find("form");
if(self.form.length>1){throw"PredictiveSearchError\n -> form has too many elements"
}self.dropDownTarget=self.form.find(".predictive-search");
self.searchUrl=orion.oesp.routes.searchpredictive;
self.linkText=self.form.data("link-text");
orion.oesp.session.done(function(session){if(session.isAuthenticated()){$("#site-search-form-logged-in",self.form).attr("id","site-search-form");
self.searchBox=self.form.find("#site-search-text-input-logged-in").attr("id","site-search-text-input")
}else{$("#site-search-form-logged-out",self.form).attr("id","site-search-form");
self.searchBox=self.form.find("#site-search-text-input-logged-out").attr("id","site-search-text-input")
}self.initialize()
})
}PredictiveSearch.buildSearchItemUrl=function(item){var url;
if(item.medium&&item.id&&item.title){url=[BBV.settings.site.urls.mediagroup[item.medium.toLowerCase()],encodeURIComponent(item.id),item.encodeTitle()]
}else{url=[BBV.settings.site.urls.base,"404.html"]
}return url.join("/")
};
PredictiveSearch.prototype.initialize=function(){var self=this,rxSearchTerm=/[^\w ._,'\&\-]/g,$positionOf=self.form.find(".field:first");
var auto=self.searchBox.autocomplete({appendTo:self.dropDownTarget,minLength:2,source:function(req,callback){orion.util.oesp.get(self.searchUrl,{data:"q="+encodeURIComponent(req.term),dataType:"json",success:function(data){var sanitized=[];
var results=data.results;
results=results.sort(function(a,b){if(a.deliveryType==null){a.deliveryType="vod"
}if(b.deliveryType==null){b.deliveryType="vod"
}if(a.deliveryType==b.deliveryType){return 0
}if(a.deliveryType=="linear"&&b.deliveryType=="vod"){return 1
}if(a.deliveryType=="vod"&&b.deliveryType=="linear"){return -1
}});
callback($.map(results,function(item){var regex=new RegExp("(?![^&;]+;)(?!<[^<>]*)("+req.term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi,"\\$1")+")(?![^<>]*>)(?![^&;]+;)","gi");
var category=orioni18n.utilityBar.predictiveSearchOnDemandText;
if(item.deliveryType==="linear"){category=orioni18n.utilityBar.predictiveSearchLinearText
}return{label:item.title.replace(regex,"<span>$1</span>"),value:item.title,title:item.title,id:item.mediaGroupId,medium:item.medium,category:category,currentChildMediaTypeCounts:1,encodeTitle:orion.oesp.res.Media.prototype.encodeTitle,buildMediaUrl:orion.oesp.res.Media.prototype.buildMediaUrl}
}))
},error:function(data){callback(data)
}})
},open:function(event,ui){var searchTerm=self.searchBox.val().replace(rxSearchTerm,"");
self.dropDownTarget.find("p.view-all").remove();
self.dropDownTarget.append('<p class="view-all"><a class="view-all-link" href="#">'+self.linkText+" '"+searchTerm+"'</a></p>")
},close:function(event,ui){self.form.find("p.view-all").remove()
},select:function(event,ui){if(ui.item){BBV.extend(ui.item,orion.util.mediamethods);
window.location.href=PredictiveSearch.buildSearchItemUrl(ui.item)
}},position:{my:"left top",at:"left center",of:$positionOf}}).each(function(){var autoData=$(this).data("autocomplete");
autoData._renderItem=self.renderItem;
autoData._renderMenu=self.renderMenu
});
self.form.bind("submit",function(){self.searchBox.val(self.searchBox.val().replace(rxSearchTerm,""));
if(self.searchBox.val()==""){return false
}});
$(".view-all a",self.form).live("click",function(event){event.preventDefault();
self.form.submit()
})
};
PredictiveSearch.prototype.renderMenu=function(ul,items){var self=this,currentCategory="",firstCategory=true;
$.each(items,function(index,item){if(item.category!=currentCategory){ul.append('<li class="ui-autocomplete-category'+(firstCategory?" first":"")+'">'+item.category+"</li>");
currentCategory=item.category;
first=false
}self._renderItem(ul,item)
})
};
PredictiveSearch.prototype.renderItem=function(ul,item){return $('<li class="suggestion"></li>').data("item.autocomplete",item).append('<a class="suggestion-link">'+item.label+"</a>").appendTo(ul)
};
return PredictiveSearch
})(jQuery);
BBV.namespace("orion.modules").UtilityBar=orion.modules.UtilityBar||(function($,Model,View){function UtilityBarModel(){var self=this;
Model.call(self);
self.userSignedIn=false;
self.currentMenu="none";
self.username=""
}orion.util.inherits(UtilityBarModel,Model);
function UtilityBarView(model,element){var self=this;
View.call(self,model);
self.$=$(element);
self.bindEvents();
self.model.bind("change",function(){self.render()
})
}UtilityBarView.MENU_OPEN_CLASS="open";
UtilityBarView.getMenuOverlay=function getMenuOverlay(){var overlay;
overlay=$("#generated-menu-overlay");
if(overlay.size()===0){overlay=$('<div id="generated-menu-overlay"/>');
overlay.css({width:$(window).width(),height:$(window).height()})
}return overlay
};
UtilityBarView.prototype.render=function render(){var view=this;
var model=this.model;
var overlay;
var currentMenu=model.get("currentMenu");
if(model.get("userSignedIn")){$("#welcome-username .username").text(model.get("username"));
view.$.find(".no-js").hide();
view.$.find(".logged-out").hide();
$(".dialog").hide();
view.$.find(".logged-in").show()
}else{view.$.find(".no-js").hide();
view.$.find(".logged-out").show();
view.$.find(".logged-in").hide()
}if(currentMenu=="none"){overlay=UtilityBarView.getMenuOverlay();
overlay.hide();
view.hideMenu("account-menu");
view.hideMenu("notification-menu");
view.hideMenu("language-menu")
}else{view.showMenu(currentMenu);
if(currentMenu!="account-menu"){view.hideMenu("account-menu")
}if(currentMenu!="notification-menu"){view.hideMenu("notification-menu")
}if(currentMenu!="language-menu"){view.hideMenu("language-menu")
}}};
UtilityBarView.prototype.getMenu=function getMenu(menuName){var containerSelector=this.model.get("userSignedIn")?".logged-in":".logged-out";
var menuSelector;
if("account-menu"==menuName){menuSelector=".user-options.menu"
}if("notification-menu"==menuName){menuSelector=".user-notifications.menu"
}if("language-menu"==menuName){menuSelector=".user-language.menu"
}return this.$.find(containerSelector).find(menuSelector)
};
UtilityBarView.prototype.hideMenu=function hideMenu(menuName){var trigger=this.$.find('[data-trigger="'+menuName+'"]');
trigger.removeClass(UtilityBarView.MENU_OPEN_CLASS);
trigger.closest(".function").find(".menu").hide()
};
UtilityBarView.prototype.showMenu=function showMenu(menuName){var view=this;
var overlay=UtilityBarView.getMenuOverlay();
var dvrSettingsLink=$("#dvr-settings-link");
var menu=view.getMenu(menuName);
var ancestor=menu.closest(".logged-in, .logged-out");
var trigger=ancestor.find('[data-trigger="'+menuName+'"]');
var menuWidth=menu.width()>125?menu.width():125;
if(trigger.width()+12>menuWidth){menuWidth=trigger.width()+12;
menu.width(menuWidth)
}trigger.addClass(UtilityBarView.MENU_OPEN_CLASS);
menu.show();
ancestor.append(overlay);
overlay.show();
overlay.unbind("click");
overlay.click(function(){$(view).trigger("closemenus");
overlay.hide()
});
dvrSettingsLink.click(function(){$(view).trigger("closemenus");
overlay.hide()
})
};
UtilityBarView.prototype.bindEvents=function(){var view=this;
var $view=$(view);
if(this._eventsBound){return
}this._eventsBound=true;
$(".user-language").on("click",".language-item",function(e){$view.trigger("setlanguage",this);
return false
});
view.$.delegate("#utility-signin-link","click",function(e){$view.trigger("signin",this);
return false
});
view.$.delegate(".menu-trigger","click",function(e){var menuName=$(this).data("trigger");
$view.trigger("togglemenu",menuName);
return false
});
view.$.delegate("#sign-out-link","click",function(e){$view.trigger("signout",this.href);
return false
});
view.$.delegate("#account-link","click",function(e){$view.trigger("accountlink",this.href);
return false
})
};
function UtilityBar(elem,publisher){var self=this;
var util,view,model;
if(!elem){throw new Error("Please provide an element to use for the utility bar.")
}if(!(this instanceof UtilityBar)){throw new Error("UtilityBar called without new.")
}self.pub=publisher;
self.model=new UtilityBarModel();
self.view=new UtilityBarView(self.model,elem);
self.initialize()
}UtilityBar.prototype.initialize=function(){var self=this;
var model=self.model;
var view=self.view;
self.bindEvents();
orion.oesp.session.done(function(session){model.set({userSignedIn:session.isAuthenticated(),username:session.username})
});
self.predictiveSearches=[];
view.$.find(".search").each(function(index,element){self.predictiveSearches.push(new orion.widgets.PredictiveSearch(element))
})
};
UtilityBar.prototype.bindEvents=function(){var util=this;
var view=this.view;
var model=this.model;
var $view=$(view);
$view.bind("setlanguage",function(e,target){$langItem=$(target);
var language=$langItem.data("language");
var oespLanguage=$langItem.data("oesplanguage");
var oespCountry=$langItem.data("oespcountry");
if(language){localStorage.setItem("language",language);
log("setting local storage language to: ",language)
}orion.util.oesp.put(BBV.settings.oespRoutes.session,{xhrId:"sessionUpdate",data:JSON.stringify({languageCode:oespLanguage}),success:function(){log("UTILITYBAR::Session Language Updated Successfully")
},error:function(){log("UTILITYBAR::Session Language change failed")
},complete:function(){window.location.href=$langItem.attr("href")
}})
});
$view.bind("signin",function(e,target){model.set("currentMenu","none");
util.pub.trigger("requestDialog",{dialogName:"login",pointTo:{target:target,direction:"up"}})
});
$view.bind("openmenu",function(e,menuName){model.set("currentMenu",menuName)
});
$view.bind("closemenus",function(){model.set("currentMenu","none")
});
$view.bind("togglemenu",function(e,menuName){if(menuName==model.get("currentMenu")){model.set("currentMenu","none")
}else{model.set("currentMenu",menuName)
}});
$view.bind("signout",function(e,url){sessionStorage.clear();
orion.util.oesp.del(url,{complete:function(data){BBV.user().logout();
window.location.reload()
}})
});
$view.bind("accountlink",function(e,url){var accountDialog=orion.app.dialogManager.getDialog("accountLink");
var accountUrl=url;
var menu=view.getMenu("account-menu");
var os=menu.offset();
this.model.set("currentMenu","none");
accountDialog.setHtmlContent($("#account-link-dialog-content"));
accountDialog.contentArea.delegate("#cancel-redirect","click.redirect",function(){accountDialog.hide()
});
accountDialog.$.css("position","fixed");
accountDialog.$.css({left:0,top:0});
accountDialog.$.offset(os);
accountDialog.show()
})
};
return UtilityBar
})(jQuery,orion.util.mvc.Model,orion.util.mvc.View);
BBV.namespace("orion.modules").NavigationBar=orion.modules.NavigationBar||(function($,Model,View){function NavigationBarModel(){var self=this;
Model.call(self);
self.currentMenu=null
}orion.util.inherits(NavigationBarModel,Model);
function NavigationBarView(model,elem){var self=this;
View.call(self,model);
self.$=$(elem);
if(BBV.settings.showMegaNavs){self.setupMegaMenus()
}var uaHas=(function(uA){return function(text){return uA.indexOf(text)!==-1
}
})(navigator.userAgent);
var isMacSafari=(uaHas("Macintosh")&&uaHas("Safari")&&!uaHas("Chrome"));
if(isMacSafari){self.setupMacSafariDisplayFix()
}}orion.util.inherits(NavigationBarView,View);
NavigationBarView.prototype.setupMacSafariDisplayFix=function(){var resizeTimeout,fixSelector="#site-utility-bar, div.navigation-bar-wrapper";
$(window).resize(function(){clearTimeout(resizeTimeout);
resizeTimeout=setTimeout(function(){$(fixSelector).css("z-index","8998");
setTimeout(function(){$(fixSelector).css("z-index","8999")
},1)
},10)
})
};
NavigationBarView.prototype.setupMegaMenus=function(){var self=this;
self.$.find(".nav-item").each(function(){var item=$(this);
var megamenus=$(".megamenu");
var megamenu=item.find(".megamenu[data-url]");
var sidebarLink=$(".megamenu").find(".column").children("a");
var url;
if(megamenu.size()>0){url=megamenu.attr("data-url");
if(url){item.bind("mouseenter",function(event){var delay=megamenus.is(":visible")?0:400;
self.model.currentMenu=item;
item.data("is-open",true);
setTimeout(function(){self.openMenu(item)
},delay)
});
item.bind("mouseleave",function(event){item.data("is-open",false);
setTimeout(function(){self.closeMenu(item)
},400)
})
}}})
};
NavigationBarView.prototype.openMenu=function(navItem){var self=this;
var $navItem=$(navItem);
if(!$navItem.data("is-open")){return
}self.loadMenu(navItem);
if(navItem&&self.model.get("currentMenu")===navItem){self.$.find(".nav-item").removeClass("hover");
$navItem.addClass("hover");
if($navItem.hasClass("hover")){$navItem.find(".megamenu-wrapper").slideDown(125)
}}};
NavigationBarView.prototype.closeMenu=function(navItem){var self=this;
var $navItem=$(navItem);
if($navItem.data("is-open")){return
}$navItem.removeClass("hover");
$navItem.find(".megamenu-wrapper").fadeOut(100)
};
NavigationBarView.prototype.loadMenu=function(navItem){var self=this;
var $navItem=$(navItem);
var megaMenu=$navItem.find(".megamenu");
var url=megaMenu.data("url");
if(!megaMenu.data("loaded")){$.get(url,function(content){megaMenu.empty().html(content);
megaMenu.data("loaded",true);
megaMenu.find(".column").delegate("a","click",function(){$(navItem).trigger("mouseleave")
})
})
}};
function NavigationBar(elem,publisher){var self=this;
var model,view;
if(!elem){log("No navigation bar element is available. Aborting NavigationBar constructor.");
return
}if(!(this instanceof NavigationBar)){return new NavigationBar(elem,publisher)
}self.model=new NavigationBarModel();
self.view=new NavigationBarView(self.model,elem);
NavigationBar.setupAdultMonitoring()
}NavigationBar.showAdultDialogs=function(){orion.oesp.session.done(function(session){var loginDialog;
var pinDialog;
if(session.isAuthenticated()){if(!session.isAdultPinVerified()){pinDialog=orion.app.dialogManager.getDialog("pin-verification");
pinDialog.setVerificationType("adult");
pinDialog.centerOn(window);
pinDialog.show();
pinDialog.setFocus();
pinDialog.bind("pinVerified",function(){window.location.reload()
})
}}else{loginDialog=orion.app.dialogManager.getDialog("login");
loginDialog.centerOn(window);
loginDialog.show()
}})
};
NavigationBar.categoryIsAdult=function(categoryId){return categoryId&&BBV.settings.i18n.genreMap[categoryId]&&BBV.settings.i18n.genreMap[categoryId].isAdult
};
NavigationBar.getCategoryIdFromHash=function(){var hash=window.location.hash;
var index=hash.indexOf("byCategoryIds=");
var categoryId;
if(index>=0){categoryId=hash.replace("#byCategoryIds=","")
}else{categoryId=0
}return categoryId
};
NavigationBar.showPinIfNeeded=function(){var categoryId=NavigationBar.getCategoryIdFromHash();
if(NavigationBar.categoryIsAdult(categoryId)){NavigationBar.showAdultDialogs()
}};
NavigationBar.setupAdultMonitoring=function(){NavigationBar.showPinIfNeeded();
$(window).bind("hashchange",function(){NavigationBar.showPinIfNeeded()
})
};
return NavigationBar
})(jQuery,orion.util.mvc.Model,orion.util.mvc.View);
BBV.namespace("orion.modules").SubNavigationBar=orion.modules.SubNavigationBar||(function($,Model,View){function SubNavigationBarModel(){Model.call(this)
}orion.util.inherits(SubNavigationBarModel,Model);
SubNavigationBarModel.prototype.resetCategories=function(data){this.set("categories",[])
};
SubNavigationBarModel.prototype.updateCategories=function(data){var categories=[];
if(this.has("categories")){categories=this.get("categories")
}for(var i=0;
i<data.length;
i++){var categoryId=data[i];
if(BBV.settings.i18n.genreMap.hasOwnProperty(categoryId)&&BBV.settings.i18n.genreMap[categoryId].parentId=="null"){var category=BBV.settings.i18n.genreMap[categoryId];
category.id=categoryId;
if($.inArray(category,categories)===-1){categories.push(category)
}}}categories.sort(function(a,b){return a.title.localeCompare(b.title)
});
this.set("categories",categories)
};
function SubNavigationBarView(model,element){View.call(this,model);
this.$=$(element);
this.model.bind("change",$.proxy(this.update,this))
}orion.util.inherits(SubNavigationBarView,View);
SubNavigationBarView.prototype.update=function(){var self=this;
if(self.model.has("categories")){self.addCategories()
}};
SubNavigationBarView.prototype.addCategories=function(){var $dropdown=this.$.find("#nav-genre + .subnavigation");
var $categories=$dropdown.children();
var $first=$($categories[0]).clone();
var categories=this.model.get("categories");
$dropdown.empty();
$dropdown.append($first);
for(var i=0;
i<categories.length;
i++){if(categories[i].hasOwnProperty("title")){$dropdown.append('<li class="nav-item" data-isAdult="'+categories[i].isAdult+'" data-categoryId="'+categories[i].id+' data-parentId="'+categories[i].parentId+'"><a href="#byCategoryIds='+categories[i].id+'">'+categories[i].title+"</a></li>")
}}};
function SubNavigationBar(element,publisher){var model,view;
if(!element){log("No sub navigation bar element is available. Aborting SubNavigationBar constructor.");
return
}if(!(this instanceof SubNavigationBar)){return new SubNavigationBar(elem,publisher)
}this.publisher=publisher;
this.model=new SubNavigationBarModel();
this.view=new SubNavigationBarView(this.model,element);
this.linearDataService=orion.services.LinearDataService;
this.setupHandlers()
}SubNavigationBar.prototype.showAdultDialogs=function(){orion.oesp.session.done(function(session){var loginDialog;
var pinDialog;
if(session.isAuthenticated()){if(!session.isAdultPinVerified()){pinDialog=orion.app.dialogManager.getDialog("pin-verification");
pinDialog.setVerificationType("adult");
pinDialog.centerOn(window);
pinDialog.show();
pinDialog.setFocus();
pinDialog.bind("pinVerified",function(){window.location.reload()
})
}}else{loginDialog=orion.app.dialogManager.getDialog("login");
loginDialog.centerOn(window);
loginDialog.show()
}})
};
SubNavigationBar.prototype.updateCategories=function updateCategories(data){this.model.updateCategories(data)
};
SubNavigationBar.prototype.resetCategories=function resetCategories(){this.model.resetCategories()
};
SubNavigationBar.prototype.setupHandlers=function setupHandlers(){var self=this;
this.view.$.delegate(".subnavigation li[data-isadult=true] a","click",function(event){event.preventDefault();
orion.oesp.session.done(function(session){if(session.isAuthenticated()&&session.isPinVerified()){window.location.href=event.target.href
}else{self.showAdultDialogs()
}})
});
this.publisher.subscribe("EPG.updateCategories",$.proxy(this.updateCategories,this));
this.publisher.subscribe("EPG.resetCategories",$.proxy(this.resetCategories,this))
};
return SubNavigationBar
})(jQuery,orion.util.mvc.Model,orion.util.mvc.View);
BBV.namespace("orion.modules").ContentDiscovery=orion.modules.ContentDiscovery||(function($){var viewstates={GRID:{template:"FeedGridItem",imageType:"boxart-medium",size:7},LIST:{template:"FeedListItem",size:14},THUMB:{template:"FeedThumbItem",imageType:"still-medium",size:5}};
function readUrlString(url){var keyValue=url.split("?");
return{url:keyValue[0],query:keyValue[1]}
}function parseParam(p){var custom=/\}\{/,obj={},tmp_;
if(p&&custom.test(p)){tmp_=p.replace(/\}\{/,"}${");
tmp_=tmp_.split("$");
obj[tmp_[0]]=p
}else{if(p&&p.indexOf("=")>-1){tmp_=p.split("=");
obj[tmp_[0]]=p
}else{if(p){obj[p]=p
}}}return obj
}function topInView(el){var windowTop=$(window).scrollTop();
var windowBottom=windowTop+$(window).height();
var elTop=el.offset().top;
return(elTop>windowTop&&elTop<windowBottom)
}function ContentDiscoveryModel(c){var model=this;
model.content=c;
return model
}ContentDiscoveryModel.prototype.data=null;
ContentDiscoveryModel.prototype.datamedia=[];
ContentDiscoveryModel.prototype.getMediaRange=function(strt,stp){var model=this;
return{medias:model.datamedia.slice(strt,stp)}
};
ContentDiscoveryModel.prototype.update=function(data){var model=this,content=model.content;
view=content.view;
model.data=data;
var datatype=model.data.mediaGroups||model.data.mediaItems;
BBV.each(datatype,function(item){var item=BBV.extend({localStrings:content.localStrings,imageType:view.currentview.imageType},this,orion.util.mediamethods),mediobject=BBV.Object.create(BBV.feed.MediaObject);
model.datamedia.push(mediobject.initialize(item))
});
content.$.trigger("loaded");
model.content.view.notify(data)
};
function ContentDiscoveryView(c){var view=this,content;
view.notifications={};
view.content=content=c;
view.model=content.model;
view.root=view.content.$;
view.element=view.root.find(".content-list");
view.currentview=(function(){var current=view.root.find(".view-toggle > li").has(".active").attr("class");
if(current){return viewstates[current.toUpperCase()]
}})();
view.start=0;
view.end=14;
return view
}ContentDiscoveryView.prototype.isExpanded=false;
ContentDiscoveryView.prototype.bind=function(){var view=this;
var model=this.model;
var content=model.content;
var feed=Mustache.to_html(orion.templates[view.currentview.template],BBV.extend(model.getMediaRange(0,view.currentview.size),{localStrings:content.localStrings},orion.util.mediamethods));
var didScroll=false;
var interval;
function applyFeed(){view.element.empty().html(feed);
if($(feed).find(".media-group").length==0){$(view.element).addClass("landscape")
}orion.oesp.session.done(function(session){session.setModuleState(view.element)
})
}if(topInView(content.$)){applyFeed()
}else{$(window).on("scroll.ContentDiscovery",function(){didScroll=true
});
interval=window.setInterval(function(){if(didScroll&&topInView(content.$)){$(window).off("scroll.ContentDiscovery");
window.clearInterval(interval);
applyFeed()
}},250)
}};
ContentDiscoveryView.prototype.expand=function(){var view=this,model=this.model,content=model.content,feed=Mustache.to_html(orion.templates[view.currentview.template],BBV.extend(model.getMediaRange(view.currentview.size,view.currentview.size*2),{localStrings:content.localStrings},orion.util.mediamethods));
view.element.append(feed);
orion.oesp.session.done(function(session){session.setModuleState(view.element)
})
};
ContentDiscoveryView.prototype.handlers=function(){var view=this,content=view.content,model=content.model,controller=content.controller;
view.subscribe("bind",view.bind);
content.$.loader({flow:["overlay"],target:".content-list",minheight:260,minwidth:926});
content.$.find(".view-toggle").delegate("a","click",function(e){var $root=$(this).closest(".view-toggle"),$this=$(this),$showButtonContainer=$this.closest(".content-discovery").find(".show-all"),$showButton=$showButtonContainer.find("a"),currentview=$this.context.parentNode.getAttribute("class");
if(viewstates[currentview.toUpperCase()]!==view.currentview){view.currentview=viewstates[currentview.toUpperCase()];
view.bind();
$root.find(".active").removeClass("active");
$this.addClass("active");
if(view.currentview==viewstates.GRID){$showButton.html($showButton.attr("data-text-more")+'<span class="icon"></span>')
}}if(view.currentview==viewstates.GRID){if($showButton.attr("href")=="#"){$showButtonContainer.show()
}if(view.isExpanded){view.expand();
if($showButton.attr("href")!=="#"){$showButton.html($showButton.attr("data-text-expand")+'<span class="more"></span>')
}else{$showButton.html($showButton.attr("data-text-less")+'<span class="less"></span>')
}}else{$showButton.html($showButton.attr("data-text-more")+'<span class="icon"></span>')
}}else{if($showButton.attr("href")=="#"){$showButtonContainer.hide()
}else{$showButton.html($showButton.attr("data-text-expand")+'<span class="more"></span>')
}}return false
});
content.$.find(".add-all .count").bind("contentloaded",function(){var datatype=content.model.data.mediaGroups||content.model.data.mediaItems;
$(this).text(datatype.length)
});
content.$.find(".show-all").delegate("a","click",function(e){var $this=$(this);
var maxRowCnt=2;
var props={height:view.element.outerHeight()};
if(!view.isExpanded&&view.currentview!==viewstates.LIST){view.element.css(props);
if(view.element.find(".grid-view").length<maxRowCnt){view.expand();
$this.addClass("expanded")
}else{view.element.find(".grid-view").last().show()
}view.element.animate({height:props.height*2},500,function(){$(this).css({height:"auto"})
});
view.isExpanded=true;
if($this.attr("href")=="#"){$this.html($this.data("text-less")+'<span class="less"></span>')
}else{$this.html($this.data("text-expand")+'<span class="more"></span>')
}return false
}else{if(view.isExpanded&&view.currentview!==viewstates.LIST&&$this.attr("href")=="#"){view.element.css(props);
view.element.animate({height:props.height/2},500,function(){view.element.find(".grid-view").last().hide();
$(this).css({height:"auto"})
});
view.isExpanded=false;
$this.html($this.data("text-more")+"<span></span>");
return false
}}});
if(content.$.find(".tabs").find(".tab").length){var $first=content.$.find(".tabs .tab:eq(0)"),$active=content.$.find(".tabs .active a"),refine=($active.length)?$active.attr("href").substr(1):$first.find("a").attr("href").substr(1);
if(!$active.length){$first.addClass("active")
}controller.setParam(refine)
}content.$.find(".tabs").each(function(){var $root=$(this),$active=$root.find(".active");
$root.delegate("a","click",function(e){var $this=$(this),$parent=$($this.context.parentNode),refine=$this.attr("href").substr(1);
if(!$parent.hasClass("active")){$active.removeClass("active");
$active=$parent.addClass("active");
controller.setParam(refine);
controller.update()
}return false
})
})
};
ContentDiscoveryView.prototype.notify=function(name,data_){var view=this,data=(BBV.type(name)==="string")?data_||{}:name;
if(BBV.type(name)==="string"){view.notifications[name].call(view,data);
return
}BBV.each(view.notifications,function(name,notification){notification.call(view,data)
})
};
ContentDiscoveryView.prototype.subscribe=function(name,fn){var view=this;
view.notifications[name]=fn;
return view
};
function ContentDiscoveryController(c,url){var controller=this,content;
controller.content=content=c;
controller.feed=new BBV.feed(controller.content.$.attr("id"),{url:readUrlString(url).url,callback:function(){content.model.update(this.data)
}});
return controller
}ContentDiscoveryController.prototype.clearParams=function(){var controller=this,content=controller.content;
content.appliedFilters.params={};
return controller
};
ContentDiscoveryController.prototype.removeParam=function(param_){var controller=this,content=controller.content,param=parseParam(param_);
BBV.each(content.appliedFilters.params,function(name,value){if(content.appliedFilters.params[name]){delete content.appliedFilters.params[name]
}});
return controller
};
ContentDiscoveryController.prototype.serializeParams=function(){var controller=this,qs=[];
if(controller.content.appliedFilters.default_){qs.push(controller.content.appliedFilters.default_)
}BBV.each(controller.content.appliedFilters.params,function(name,val){qs.push(val)
});
controller.feed.settings.data=qs.join("&")
};
ContentDiscoveryController.prototype.setParam=function(param_){var controller=this,content=controller.content,param=parseParam(param_);
BBV.extend(content.appliedFilters.params,param);
return controller
};
ContentDiscoveryController.prototype.load=function(){var controller=this,model=controller.content.model;
model.datamedia=[];
controller.update()
};
ContentDiscoveryController.prototype.update=function(){var controller=this,content=controller.content,view=content.view;
controller.setParam("range="+view.start+"-"+view.end);
controller.serializeParams();
controller.feed.update();
content.$.trigger("loading")
};
function ContentDiscovery(elem,publisher){var id;
var url;
var content;
var model,view,controller;
content=this;
content.root=elem;
content.publisher=publisher;
content.$=$(content.root);
content.localStrings=orioni18n.contentDiscovery;
id=content.$.attr("id");
orion.oesp.session.withSession(function(session){if(session.isAuthenticated()){url=content.$.attr("data-module-logged-in-feed-url");
if(!url){url=content.$.attr("data-module-feed-url")
}}else{url=content.$.attr("data-module-feed-url")
}if(!url){return false
}content.model=model=new ContentDiscoveryModel(content);
content.view=view=new ContentDiscoveryView(content);
content.controller=controller=new ContentDiscoveryController(content,url);
content.appliedFilters={default_:readUrlString(url).query};
rxMediaItems=/mediaitems/;
if(!url.match(rxMediaItems)){content.appliedFilters.params={byVod:"byHasCurrentVod=true"}
}content.bindEvents();
controller.load()
});
return content
}ContentDiscovery.prototype.bindEvents=function(sortType){this.view.handlers(sortType)
};
return ContentDiscovery
})(jQuery);
BBV.namespace("orion.modules").ContentBrowse=orion.modules.ContentBrowse||(function($){var viewTypes={DEFAULT:"alpha",COLLATE:"collate",DATE:"date"},dateRange={today:{start:(function(){var d=new Date(),less=1000*60*60*24;
return Date.parse(d)-less
})(),end:(function(){var d=new Date();
return Date.parse(d)
})()},yesterday:{start:(function(){var d=new Date(),less=1000*60*60*24*2;
return Date.parse(d)-less
})(),end:(function(){var d=new Date();
return Date.parse(d)
})()},week:{start:(function(){var d=new Date(),less=1000*60*60*24*7;
return Date.parse(d)-less
})(),end:(function(){var d=new Date();
return Date.parse(d)
})()},month:{start:(function(){var d=new Date(),less=1000*60*60*24*7*30;
return Date.parse(d)-less
})(),end:(function(){var d=new Date();
return Date.parse(d)
})()},within:function(date_){if(date_>=dateRange.today.start&&date_<=dateRange.today.end){return"today"
}else{if(date_>=dateRange.yesterday.start&&date_<=dateRange.yesterday.end){return"yesterday"
}else{if(date_>=dateRange.week.start&&date_<=dateRange.week.end){return"week"
}else{if(date_>=dateRange.month.start&&date_<=dateRange.month.end){return"month"
}else{return -1
}}}}}},encode_=["#"],defaultParam=getHashFilter(),defaulthash=defaultParam;
if(!("onhashchange" in window)){var loc=window.location,hash;
setInterval(function(){var hash=getHashFilter();
if(hash!==defaulthash){BBV.events.trigger("hashchange",{hash:hash,oldhash:defaulthash});
defaulthash=hash
}},1000)
}else{$(window).bind("hashchange",function(){var hash=getHashFilter();
BBV.events.trigger("hashchange",{hash:hash,oldhash:defaulthash});
defaulthash=hash
})
}function escapeCharacters(str_){var raw=str_,purity=raw;
BBV.each(encode_,function(idx,itm){var regex=new RegExp(itm,"g");
purity=purity.replace(regex,encodeURIComponent(itm))
});
return purity
}function getHashFilter(){return decodeURIComponent(window.location.hash.substr(1))
}function updatePreFilter(){return defaultParam=getHashFilter()
}function mapPreFilter(char_){return(char_&&/[a-zA-Z]/.test(char_))?char_.toLowerCase():"pound"
}function readUrlString(url){var keyValue=url.split("?");
return{url:keyValue[0],query:keyValue[1]}
}function parseParam(p){var custom=/\}\{/,obj={},tmp_;
if(p&&custom.test(p)){tmp_=p.replace(/\}\{/,"}${");
tmp_=tmp_.split("$");
obj[tmp_[0]]=p
}else{if(p&&p.indexOf("=")>-1){tmp_=p.split("=");
obj[tmp_[0]]=p
}else{if(p){obj[p]=p
}}}return obj
}function parseCategory(cat_){var catIDs=cat_.split("=");
var catID=catIDs[catIDs.length-1];
var category=BBV.settings.i18n.genreMap[catID];
return category.title
}function parseCategoryID(param){var catID=parseParam(param).byCategoryIds?parseParam(param).byCategoryIds.split("=")[1]:null;
return catID
}function filterAlphaList(content,filter_){var pattern=/byCollateChar=([\w\#])/i,char1=(filter_&&pattern.test(filter_))?pattern.exec(filter_)[1]:null,char2=(char1)?mapPreFilter(char1):null,t,$results=((t=content.$.find(".sort-"+char2)).length)?t:[];
content.$.find(".content-list").hide();
if($results.length){$results.show()
}}function topInView(el){var windowTop=$(window).scrollTop();
var windowBottom=windowTop+$(window).height();
var elTop=el.offset().top;
return(elTop>windowTop&&elTop<windowBottom)
}function swapImageData($img){$img.attr("src",$img.data("art-src"));
$img.removeData("artSrc");
$img.removeAttr("data-art-src")
}function ContentBrowseModel(c){var model=this;
model.content=c;
return model
}ContentBrowseModel.prototype.data=null;
ContentBrowseModel.prototype.datamedia=[];
ContentBrowseModel.prototype.update=function(data,q){var model=this,content=model.content;
model.data=data;
var datatype=model.data.mediaGroups||model.data.mediaItems;
BBV.each(datatype,function(item){var item=BBV.extend(this,orion.util.mediamethods),mediobject=BBV.Object.create(BBV.feed.MediaObject);
model.datamedia.push(mediobject.initialize(item))
});
content.$.trigger("loaded");
model.content.view.notify([data,q])
};
function ContentBrowseView(c){var view=this;
view.notifications={};
view.content=c;
view.size=30;
view.start=1;
view.end=view.size;
view.element=view.content.$.find(".content-list .results");
return view
}ContentBrowseView.prototype.collate=function(q){var view=this,feed={},cnt_=view.start-1,media_=view.content.model.datamedia,lngth_=view.content.model.datamedia.length,$items,char_,tmp;
for(;
cnt_<lngth_;
cnt_++){var itm=media_[cnt_];
char_=mapPreFilter(itm.collateChar);
feed[char_]=feed[char_]||[];
feed[char_].push(itm)
}BBV.each(feed,function(name,val){var sort,regex=new RegExp(name==="pound"?"#":name.toUpperCase()),$results,$newImages;
if(regex.test(getHashFilter())||!getHashFilter()){sort=$(".sort-"+name).show(),$results=sort.find(".results");
$items=$results.find(".grid-view").children("li");
if(!$items.length){$tmp=$(Mustache.to_html(orion.templates.BrowseItemWrapper,{medias:val},{items:orion.templates.BrowseItem}));
$results.html($tmp)
}else{var newItems=[];
for(var i=0;
i<val.length;
i++){var hasVal=false;
$items.each(function(){var current=$(this);
if(current.data("media-id")===val[i].id){hasVal=true
}});
if(!hasVal){newItems.push(val[i])
}}$tmp=$(Mustache.to_html(orion.templates.BrowseItem,{medias:newItems}));
$items.closest(".grid-view").append($tmp)
}view.addNewImages($tmp);
orion.oesp.session.done(function(session){session.setModuleState($results)
})
}});
view.notify("rendered","collate")
};
ContentBrowseView.prototype.addNewImages=function($data){$images=$data.find("img[data-art-src]");
var lastVisibleIndex=0;
$images.each(function(index,element){$element=$(element);
var isInView=topInView($images);
if(isInView){swapImageData($element);
if(isInView){lastVisibleIndex++
}}})
};
ContentBrowseView.prototype.handlers=function(type){var view=this,content=view.content,defaultFilter=$('a[href*="'+defaultParam+'"]');
content.$.loader({element:{append:"<div/>",insert:"<li/>"},elementClass:"grid-item",flow:["append","insert"],location:"inside",minheight:204,minwidth:110,target:".content-list:visible .grid-view:last"});
BBV.events.bind("hashchange",function(e,params){view.resetRange();
var param=params.hash;
category=parseCategoryID(param);
$(".grid-view").empty();
if(param&&param.indexOf("byCategoryIds")>-1&&BBV.settings.i18n.genreMap[category].parentId=="null"){content.$.find("#genre-category").text(" - "+parseCategory(param));
$("#nav-genre",".subnav-wrapper").text(parseCategory(param))
}if(param){content.controller.setParam(param)
}else{content.controller.removeParam(params.oldhash)
}content.controller.load()
});
if(defaultFilter.length&&!defaultFilter.hasClass("active")){content.$.find(".active").removeClass("active");
defaultFilter.addClass("active");
filterAlphaList(content,defaultParam)
}view.subscribe("render",function(a){if(type===viewTypes.COLLATE){this.collate(a[1])
}else{if(type===viewTypes.DATE){this.sort()
}else{this.render()
}}}).subscribe("count",function(a){var results=a[0],resultCount;
if(results){resultCount=results.totalResults;
view.content.$.find(".results-listed .count").text(resultCount)
}}).subscribe("rendered",function(data){if($.isArray(data)){return
}var selectors=content.$.find(".grid-item");
var selector=content.$.find(".grid-item:not(.loading-wrapper)").last();
var idx=selectors.index(selector)+1;
content.$.off("inview",".content-list");
selector.on("inview",function(e,isInView){if(view.end===idx&&view.end<view.content.model.data.totalResults&&isInView){view.scroll();
selector.off("inview")
}else{if(idx>=view.content.model.data.totalResults){selector.off("inview")
}}});
content.$.on("inview",".content-list",function(evt,isInView){var $currentTarget=$(evt.currentTarget);
if(isInView&&$currentTarget.is(":visible")&&($currentTarget.has("img[data-art-src]")||$currentTarget.next().has("img[data-art-src]"))){var $imgs=$currentTarget.find("img[data-art-src]");
var $nextImgs=$currentTarget.next().find("img[data-art-src]");
function addImageSrc(index,element){var $element=$(element);
swapImageData($element)
}$imgs.each(addImageSrc);
$nextImgs.each(addImageSrc)
}})
});
content.$.find(".sort-by").delegate("a","click",function(e){var selectors=content.$.find(".grid-item");
selector=content.$.find(".grid-item:eq("+parseInt(selectors.length-1)+")");
selector.off("inview");
var $root=content.$.find(".sort-by"),$this=$(this),$href=decodeURIComponent($this.attr("href").substr(1)),$active=$root.find(".active");
if(!$this.hasClass("active")){view.resetRange();
$active.removeClass("active");
$this.addClass("active");
window.location.hash=$this.attr("href");
filterAlphaList(content,$href);
view.notify("count")
}return false
});
content.$.find(".back-to-top a").live("click",function(){$("html, body").animate({scrollTop:0},"fast");
return false
});
content.$.find("#subgenres .current").live("click",function(e){e.preventDefault()
})
};
ContentBrowseView.prototype.notify=function(name,data_){var view=this,data=(BBV.type(name)==="string")?data_||{}:name;
if(BBV.type(name)==="string"){view.notifications[name].call(view,data);
return
}BBV.each(view.notifications,function(name,notification){notification.call(view,data)
})
};
ContentBrowseView.prototype.render=function(){var view=this,model=view.content.model,cnt_=view.start-1,feeds=[],media_=model.datamedia,lngth_=model.datamedia.length,$results=view.element,$items=$results.find(".grid-view");
for(;
cnt_<lngth_;
cnt_++){var itm=media_[cnt_];
feeds.push(itm)
}view.content.$.find(".content-list").show();
if(!$items.length){$tmp=$(Mustache.to_html(orion.templates.BrowseItemWrapper,{medias:feeds},{items:orion.templates.BrowseItem}));
$results.html($tmp)
}else{$tmp=$(Mustache.to_html(orion.templates.BrowseItem,{medias:feeds}));
$items.append($tmp)
}view.addNewImages($tmp);
orion.oesp.session.done(function(session){session.setModuleState($results)
});
view.notify("rendered","alpha")
};
ContentBrowseView.prototype.resetRange=function(){var view=this;
view.start=1;
view.end=view.size
};
ContentBrowseView.prototype.sort=function(){var view=this,range={},timeframe_,cnt_=view.start-1,media_=view.content.model.datamedia,lngth_=view.content.model.datamedia.length,$results,$items,tmp;
for(;
cnt_<lngth_;
cnt_++){var itm=media_[cnt_];
timeframe_=dateRange.within(itm.latestOfferStartDate);
range[timeframe_]=range[timeframe_]||[];
range[timeframe_].push(itm)
}BBV.each(range,function(name,val){var sort=$(".sort-"+name).show();
$results=$(".sort-"+name).find(".results");
$items=$results.find(".grid-view");
if(!$items.length){$tmp=$(Mustache.to_html(orion.templates.BrowseItemWrapper,{medias:val},{items:orion.templates.BrowseItem}));
$results.html($tmp)
}else{$tmp=$(Mustache.to_html(orion.templates.BrowseItem,{medias:val}));
$items.append($tmp)
}view.addNewImages($tmp);
orion.oesp.session.done(function(session){session.setModuleState($results)
})
});
view.notify("rendered","sort")
};
ContentBrowseView.prototype.scroll=function(){var view=this,controller=view.content.controller;
view.start=view.end+1;
view.end=view.end+view.size;
controller.update()
};
ContentBrowseView.prototype.subscribe=function(name,fn){var view=this;
view.notifications[name]=fn;
return view
};
function ContentBrowseController(c,url){var controller=this;
controller.content=c;
this.fetch(url);
return controller
}BBV.extend(ContentBrowseController.prototype,{fetch:function(url){var controller=this;
controller.feed=new BBV.feed(controller.content.$.attr("id"),{url:readUrlString(url).url,callback:function(query_){controller.content.model.update(this.data,query_)
},error:function(jqXHR,textStatus,errorThrown){window.setTimeout(function(){controller.feed.update()
},0);
log("ContentBrowseController.feed.error\n -> jqXHR: ",jqXHR)
}})
},clearParams:function(){var controller=this,content=controller.content;
content.appliedFilters.params={};
return controller
},removeParam:function(param_){var controller=this,content=controller.content,param=parseParam(param_);
BBV.each(content.appliedFilters.params,function(name,value){if(content.appliedFilters.params[name]){delete content.appliedFilters.params[name]
}});
return controller
},serializeParams:function(){var controller=this,qs=[];
if(controller.content.appliedFilters.default_){qs.push(controller.content.appliedFilters.default_)
}BBV.each(controller.content.appliedFilters.params,function(name,val){qs.push(val)
});
controller.feed.settings.data=escapeCharacters(qs.join("&"))
},setParam:function(param_){var controller=this,content=controller.content,param=parseParam(param_);
BBV.extend(content.appliedFilters.params,param);
return controller
},load:function(){var controller=this,model=controller.content.model;
model.datamedia=[];
controller.update()
},update:function(){var controller=this;
var category=defaultParam?parseCategoryID(defaultParam):null;
var content=controller.content;
var view=content.view;
orion.oesp.session.done(function(session){if(session.isAdultPinVerified()&&BBV.settings.i18n.genreMap[category]&&BBV.settings.i18n.genreMap[category].isAdult){controller.setParam("includeAdult=true")
}if(content.sortType===viewTypes.DATE){controller.setParam("byLatestOfferStartDate="+content.byLatestOfferStartDate)
}controller.setParam("range="+view.start+"-"+view.end);
controller.serializeParams();
controller.feed.update();
controller.setSubGenres();
content.$.trigger("loading")
})
},setSubGenres:function(){var defaultParam=getHashFilter(),category=parseCategoryID(defaultParam),medium=$("ul.subnavigation",".subnav-wrapper").data("medium"),topCategory,subCategory="";
$("#subgenres").hide().find("li").remove();
if(BBV.settings.i18n.genreMap[category]){if(BBV.settings.i18n.genreMap[category].parentId=="null"){$("#subgenres .current").html('<a href="#">'+orioni18n.contentBrowse.alltextSingular+" "+BBV.settings.i18n.genreMap[category].title+"</a>");
topCategory='<li><a href="#byCategoryIds='+category+'">'+orioni18n.contentBrowse.alltextSingular+" "+BBV.settings.i18n.genreMap[category].title+"</a></li>";
$.each(BBV.settings.i18n.genreMap,function(index,genre){if(category==genre.parentId&&genre.mediaItemCounts[medium]){subCategory+='<li><a href="#byCategoryIds='+index+'">'+genre.title+"</a></li>"
}})
}else{$("#subgenres .current").html('<a href="#">'+BBV.settings.i18n.genreMap[category].title+"</a>");
topCategory='<li><a href="#byCategoryIds='+BBV.settings.i18n.genreMap[category].parentId+'">'+orioni18n.contentBrowse.alltextSingular+" "+BBV.settings.i18n.genreMap[BBV.settings.i18n.genreMap[category].parentId].title+"</a></li>";
$.each(BBV.settings.i18n.genreMap,function(index,genre){if((category==index||BBV.settings.i18n.genreMap[category].parentId==genre.parentId)&&genre.mediaItemCounts[medium]){subCategory+='<li><a href="#byCategoryIds='+index+'">'+genre.title+"</a></li>"
}})
}if(subCategory.length){var $ul=$("#subgenres ul").length?$("#subgenres ul"):$("<ul></ul>").appendTo("#subgenres");
$ul.append(topCategory).append(subCategory);
$("#subgenres").show()
}}}});
function ContentBrowse(elem,publisher){var id,url,sortType,content,model,view,controller;
content=this;
content.root=elem;
content.$=$(content.root);
id=content.$.attr("id");
url=content.$.attr("data-module-feed-url");
this.sortType=sortType=content.$.attr("data-module-sort-type");
this.byLatestOfferStartDate=this.getDateRangeString(-30);
content.model=model=new ContentBrowseModel(content);
content.view=view=new ContentBrowseView(content);
content.controller=controller=new ContentBrowseController(content,url);
content.appliedFilters={default_:readUrlString(url).query,params:{}};
if(defaultParam){if(defaultParam.indexOf("?")>=0){defaultParam=defaultParam.split("?")[0]
}controller.setParam(defaultParam);
var category=parseCategoryID(defaultParam);
if(defaultParam.indexOf("byCategoryIds")>-1){content.$.find("#genre-category").append(" - "+parseCategory(BBV.settings.i18n.genreMap[category].parentId=="null"?defaultParam:BBV.settings.i18n.genreMap[category].parentId));
$("#nav-genre",".subnav-wrapper").text(parseCategory(BBV.settings.i18n.genreMap[category].parentId=="null"?defaultParam:BBV.settings.i18n.genreMap[category].parentId))
}}content.bindEvents(sortType);
controller.load()
}BBV.extend(ContentBrowse.prototype,{bindEvents:function(sortType){this.view.handlers(sortType)
},getDateRangeString:function getDateRangeString(days){var roundToFifteen=1000*60*15;
var nowRounded=Math.floor((new Date()).getTime()/roundToFifteen)*roundToFifteen;
var now=new Date(nowRounded);
var then=new Date(now);
then.setDate(then.getDate()+days);
return then.getTime()+"~"+now.getTime()
}});
return ContentBrowse
})(jQuery);
BBV.namespace("orion.modules").EPG=orion.modules.EPG||(function($,time){var defaultHash=(function(){var hash=window.location.hash.substr(1);
var hashObj=BBV.utils.uri.toObject(hash);
return hashObj
})();
var activeDateHash=defaultHash.startDate||null;
var defaultGenreFilter=defaultHash.byCategoryIds||null;
var timeFrameInHours=2.5;
var keyTime={width:25,increments:6};
function EPG(elem,publisher){var epg=this;
epg.templateHelperMethods=orion.modules.EPG.TemplateHelperMethods;
epg.publisher=publisher;
epg.$=$(elem);
epg.localStrings=orioni18n.EPG;
epg.filterLive=epg.$.attr("data-module-live-filter");
epg.linearDataService=orion.services.LinearDataService;
epg.timeView=new orion.modules.EPG.TimeView(elem,publisher);
epg.timeView.goToDate(epg.templateHelperMethods.parseDateToStart());
epg.timeView.setupDateRange(epg.templateHelperMethods.parseDateToStart());
epg.listingsView=new orion.modules.EPG.ListingsView(elem,publisher);
var favoriteUrl=epg.$.attr("data-module-favorite-url");
epg.favoritesContainer=epg.$.find(".favorite-list");
epg.channelsContainer=epg.$.find(".grid-container");
epg.configureLoaders();
epg.updateGenre();
epg.Favorite=new orion.modules.EPG.FavoriteManager({url:favoriteUrl,favoritesContainer:epg.favoritesContainer,channelsContainer:epg.channelsContainer});
orion.oesp.session.withSession(function generateMarkupWhenDone(session){if(session.isAuthenticated()){epg.Favorite.load()
}});
epg.RemoteBookings=new orion.modules.EPG.RemoteBookings(publisher);
epg.RemoteBookings.initialize();
epg.bindSubscriptions();
epg.bindHandlers();
epg.$.trigger("loading");
if(activeDateHash!==null){epg.currentTimeSetId=time.roundTo30Minutes(new Date(activeDateHash.startDate)).getTime()
}else{epg.currentTimeSetId=time.roundTo30Minutes(new Date()).getTime()
}epg.publisher.subscribe("loggedIn",function(){epg.Favorite.load();
epg.getData()
});
orion.oesp.session.done(function(){var initialData=epg.linearDataService.getData({urgent:true,timestamp:epg.currentTimeSetId});
if(initialData.state()==="pending"){initialData.progress($.proxy(epg.onDataProgress,epg))
}else{initialData.done($.proxy(epg.onDataDone,epg))
}});
setInterval($.proxy(function(){var epg=this;
var now=(new Date()).getTime();
var start=epg.currentTimeSetId;
var stop=new Date(epg.currentTimeSetId);
stop=time.addTime(stop,2.5,"hours").getTime();
if(now>stop){epg.timeView.onNext()
}else{if(now>=start){epg.timeView.setCurrentTime(start)
}}},epg),60000)
}EPG.prototype.constructor=EPG;
EPG.prototype.appliedFilter=[];
EPG.prototype.configureLoaders=function(){var epg=this;
epg.$.loader({elementClass:"grid-loading",flow:["overlay"],minheight:600,minwidth:923,target:".channel-guide-wrap",img:{top:"250px"}});
epg.channelsContainer.loader({element:{append:"<dl/>"},elementClass:"channels-loading",flow:["append"],location:"inside",minheight:110,minwidth:923,target:".grid-container",img:{top:"35px"}})
};
EPG.prototype.filterLiveChannels=function(){var epg=this;
var FILTER="live";
if(!epg.appliedFilter.length||BBV.inArray(FILTER,epg.appliedFilter)===-1){epg.appliedFilter.push(FILTER);
epg.$.find("dl.channel-listing").not(".live").fadeOut()
}else{BBV.each(epg.appliedFilter,function eachFilter(idx,itm){if(itm===FILTER){epg.appliedFilter.splice(idx,1)
}});
epg.$.find("dl.channel-listing:hidden").not(".live").fadeIn()
}};
EPG.prototype.bindSubscriptions=function(){var epg=this;
epg.publisher.subscribe("TimeView.goNext",$.proxy(epg.onTimeViewGoNext,epg));
epg.publisher.subscribe("TimeView.goPrevious",$.proxy(epg.onTimeViewGoPrevious,epg))
};
EPG.prototype.onTimeViewGoNext=function onTimeViewGoNext(){var epg=this;
var newDate;
epg.$.trigger("loaded");
newDate=time.addTime(new Date(epg.currentTimeSetId),timeFrameInHours,"hours");
epg.currentTimeSetId=newDate.getTime();
epg.getData()
};
EPG.prototype.onTimeViewGoPrevious=function onTimeViewGoPrevious(){var epg=this;
var newDate;
epg.$.trigger("loaded");
newDate=time.addTime(new Date(epg.currentTimeSetId),-timeFrameInHours,"hours");
if(epg.currentTimeSetId>(new Date()).getTime()){epg.currentTimeSetId=newDate.getTime();
epg.getData()
}};
EPG.prototype.getData=function getData(){var epg=this;
var timeDefered=epg.linearDataService.getData({urgent:true,timestamp:epg.currentTimeSetId});
epg.$.trigger("loaded");
epg.$.trigger("loading");
epg.favoritesContainer.fadeOut("fast");
epg.channelsContainer.fadeOut("fast",function onFadeOut(){epg.favoritesContainer.empty();
epg.channelsContainer.empty();
$(".grid-loading").height(600);
epg.publisher.trigger("EPG.resetCategories");
if(timeDefered.state()==="pending"){timeDefered.progress([$.proxy(epg.onDataProgress,epg),$.proxy(epg.goToDate,epg)])
}else{timeDefered.done([$.proxy(epg.onDataDone,epg),$.proxy(epg.goToDate,epg)])
}})
};
EPG.prototype.goToDate=function goToDate(){this.timeView.goToDate(this.currentTimeSetId,true)
};
EPG.prototype.bindHandlers=function bindHandlers(){var epg=this;
epg.$.find(".channel-guide-wrap").on("click",".favorite a",function(){var target=this;
var $parent=$(target).closest(".favorite");
var $channel=$parent.closest(".channel-listing");
var $activeListing=$channel.find(".listing.active");
if($activeListing.length>0){epg.listingsView.destroyDetailsAll()
}orion.oesp.session.done(function(session){if(session.isAuthenticated()){if(!$parent.hasClass("active")){epg.Favorite.add(target)
}else{epg.Favorite.remove(target)
}}else{var loginDialog=orion.app.dialogManager.getDialog("login");
loginDialog.pointTo($parent,"left");
loginDialog.show()
}});
return false
});
epg.RemoteBookings.delegate(".channel-guide",[".program-details-wrap .user-functionality .button.record",".program-details-wrap .user-functionality .button.remind","#dvr-settings-link"]);
epg.RemoteBookings.delegate(".user-options",["#dvr-settings-link"]);
epg.$.find("#channel-guide-input").focus(function onInputFocus(){$(this).val("")
});
epg.$.find("#channel-search-form").submit(function onFormSubmit(e){var form=$(this);
var rxSearchTerm=/[^\w ._,\-]/g;
var searchBox=form.find('input:not([type="submit"])');
searchBox.val(searchBox.val().replace(rxSearchTerm,""));
if(searchBox.val()===""){return false
}var query=encodeURIComponent(searchBox.val());
var wholeUrl=form.attr("action");
var urlParts;
var url;
var fragment;
e.preventDefault();
if(wholeUrl.indexOf("#")>=0){urlParts=wholeUrl.split("#");
url=urlParts[0];
fragment=urlParts[1]
}else{url=wholeUrl
}url+="?q="+query+(fragment?"#"+fragment:"");
window.location.assign(url)
});
epg.$.delegate(".sign-in","click",function(){var loginDialog=orion.app.dialogManager.getDialog("login");
loginDialog.pointTo(this,"right");
loginDialog.show();
return false
});
$(window).bind("hashchange",function onHashChange(){var loc=window.location;
var start=parseInt(BBV.utils.uri.toObject(loc.hash.substr(1)).startDate,10);
var genreKey="#byCategoryIds=";
if(!isNaN(start)){epg.currentTimeSetId=epg.templateHelperMethods.parseDateToStart(start);
epg.getData()
}if(window.location.hash.indexOf(genreKey)>-1){defaultGenreFilter=window.location.hash.substr(genreKey.length);
epg.updateGenre()
}});
if(!("onhashchange" in window)){var loc=window.location,hash;
setInterval(function onHashInterval(){hash=BBV.utils.uri.toObject(loc.hash.substr(1)).startDate;
if(hash!==activeDateHash){$(window).trigger("hashchange");
activeDateHash=hash
}},1000)
}return epg
};
EPG.prototype.onDataDone=function onDataDone(data,currentTimeSetId){var epg=this;
orion.oesp.session.withSession(function generateMarkupWhenDone(session){var html=epg.addMarkupFromData(data,session);
epg.channelsContainer.html(html);
epg.$.trigger("loaded");
epg.Favorite.render();
if(defaultGenreFilter!==null){html.hide();
epg.toggleChannelsByGenre()
}epg.favoritesContainer.fadeIn("fast");
epg.channelsContainer.fadeIn("fast");
epg.RemoteBookings.getRemoteBookings()
})
};
EPG.prototype.onDataProgress=function onDataProgress(type,data){var epg=this;
orion.oesp.session.withSession(function generateMarkupOnProgress(session){if(type==="LinearTimeSet.summaryComplete"){var markup=epg.addMarkupFromData(data,session);
if(defaultGenreFilter!==null){markup.hide();
epg.toggleChannelsByGenre()
}epg.channelsContainer.trigger("loaded");
epg.channelsContainer.append(markup);
epg.channelsContainer.trigger("loading");
epg.Favorite.render();
epg.favoritesContainer.fadeIn("fast");
epg.channelsContainer.fadeIn("fast",function(){epg.$.trigger("loaded")
})
}else{if(type==="LinearTimeSet.detailComplete"){epg.updateMarkupFromData(data);
if(epg.RemoteBookings.pollingInitialized){return
}epg.RemoteBookings.getRemoteBookings();
epg.RemoteBookings.pollingInitialized=true
}else{if(type==="LinearTimeSet.timeSetComplete"){epg.$.trigger("loaded");
epg.channelsContainer.trigger("loaded")
}}}})
};
EPG.prototype.addMarkupFromData=function addMarkupFromData(data,session){var epg=this;
var channelMethods=orion.modules.EPG.TemplateHelperMethods.channels;
var listingMethods=orion.modules.EPG.TemplateHelperMethods.listings;
var currentTimeSetId=epg.currentTimeSetId;
var $channels=$(".channel-guide-wrap .grid-container, .channel-guide-wrap .favorite-list").find(".channel-listing");
var channelsRendered="|";
data=JSON.parse(JSON.stringify(data));
for(var i=0;
i<$channels.length;
i++){channelsRendered+=$channels.eq(i).data("station-id")+"|"
}for(var i=0;
i<data.channels.length;
i++){var station=data.channels[i].stationSchedules[0].station;
if(channelsRendered.indexOf("|"+station.id+"|")!==-1||typeof station.listings==="undefined"){data.channels.splice(i,1);
i--
}}for(var i=0;
i<data.channels.length;
i++){var channel=data.channels[i];
var station=channel.stationSchedules[0].station;
var genreList="";
$.extend(true,channel,{timestamp:currentTimeSetId,station:station,channelNumber:channelMethods.formatChannel(channel.channelNumber),URL:channelMethods.getUrl({id:channel.id,title:station.title,hasLiveStream:channel.hasLiveStream}),images:channelMethods.getImages(station.images),i18n:{recordFailed:orioni18n.EPG.bookingButtons.recordfailedtext,recordPending:orioni18n.EPG.bookingButtons.recordpendingtext,recordSet:orioni18n.EPG.bookingButtons.recordsettext,reminderFailed:orioni18n.EPG.bookingButtons.reminderfailedtext,reminderPending:orioni18n.EPG.bookingButtons.reminderpendingtext,reminderSet:orioni18n.EPG.bookingButtons.remindersettext}});
if(channel.station.listings){for(var j=0;
j<channel.station.listings.length;
j++){var listing=channel.station.listings[j];
var listingDetail;
if(listing){if(listing.program){var genres=listingMethods.getGenres(listing.program.categories);
listingDetail={id:listing.program.id+"-"+listing.imi,width:listingMethods.getWidth(listing.startTime,listing.endTime,currentTimeSetId),URL:channel.URL,genres:genres,genreHighlight:listingMethods.genreHighlight(listing.program.categories),time:listingMethods.getStartEndTime(listing.startTime,listing.endTime),channelIsEntitled:(session.hasEntitlement(station.entitlements)&&session.isAuthenticated()),rbIsEntitled:(session.hasRbEntitlement(station.entitlements)&&session.isAuthenticated())};
listingDetail.channelOrRbIsEntitled=listingDetail.channelIsEntitled||listingDetail.rbIsEntitled;
if(genres.length>0){genreList+=(genres+" ")
}}else{listingDetail={width:listingMethods.getWidth(listing.startTime,listing.endTime,currentTimeSetId),program:{title:orioni18n.EPG.TBA}}
}$.extend(true,listing,listingDetail)
}}}channel.genres=genreList;
if(genreList.length>0){epg.publisher.trigger("EPG.updateCategories",genreList.split(" "))
}}return $(Mustache.to_html(orion.templates.EPGListSummary,data))
};
EPG.prototype.updateMarkupFromData=function updateMarkupFromData(data){var epg=this;
var listingMethods=orion.modules.EPG.TemplateHelperMethods.listings;
var categoryList="";
if(data.listings){for(var listingIndex=0;
listingIndex<data.listings.length;
listingIndex++){var listing=data.listings[listingIndex];
if(listing.program){var $elem=$('li[data-listing-id="'+listing.program.id+"-"+listing.imi+'"]');
var categories=listingMethods.getGenres(listing.program.categories);
$elem.attr("data-categories",categories);
if(listingMethods.genreHighlight(listing.program.categories)){$elem.addClass("highlight")
}categoryList+=(categories+" ");
var $channel=$('dl[data-station-id="'+listing.stationId+'"]');
var channelCategories=$channel.attr("data-categories");
channelCategories+=(categories+" ");
var allCategories=channelCategories.split(" ");
var uniqueCategories=$.grep(allCategories,function grepForUnique(element,index){return index==$.inArray(element,allCategories)
});
$channel.attr("data-categories",uniqueCategories.join(" "))
}}epg.publisher.trigger("EPG.updateCategories",categoryList.split(" "));
if(defaultGenreFilter!==null){epg.toggleChannelsByGenre()
}}};
EPG.prototype.updateGenre=function updateGenre(){var epg=this;
if(defaultGenreFilter!==null){var $subnav=$("#site-sub-navigation-bar .navigation");
$($subnav.children()).removeClass("active");
$("#nav-genre").parent(".nav-item").addClass("active");
$("#nav-genre",".subnav-wrapper").text(BBV.settings.i18n.genreMap[defaultGenreFilter].title);
epg.publisher.trigger("genreChanged");
epg.toggleChannelsByGenre()
}};
EPG.prototype.toggleChannelsByGenre=function toggleChannelsByGenre(){var epg=this;
var channelListings=epg.$.find(".channel-listing");
var listings=channelListings.find(".listing");
var categorySelector='[data-categories*="'+defaultGenreFilter+'"]';
channelListings.not(categorySelector).fadeOut("fast");
epg.$.find(".channel-listing"+categorySelector).fadeIn("fast");
listings.not(categorySelector).removeClass("highlight");
epg.$.find(".listing"+categorySelector).addClass("highlight")
};
EPG.defaultGenreFilter=function(){return defaultGenreFilter
};
EPG.timeFrameInHours=timeFrameInHours;
EPG.keyTime=keyTime;
EPG.defaultHash=function(){return defaultHash
};
return EPG
})(jQuery,orion.util.time);
BBV.namespace("orion.modules").PinManagement=orion.modules.PinManagement||(function($){var viewstates={UNVERIFIED:{elem:$("#first-time")},VERIFIED:{elem:$("#controls-enabled")}};
function PinManagement(elem,publisher){var model,view,manager=this;
manager.publisher=publisher;
manager.elem=elem;
manager.$=$(elem);
manager.url=manager.$.data("profile-url");
manager.MESSAGES=orioni18n.pinManagement;
manager.$slider=$("#slider");
orion.oesp.session.done(function(session){manager.parentalPinVerified=session.parentalPinVerified;
manager.profilePinVerified=session.profilePinVerified;
manager.profileSettings=session.profileSettings;
manager.init()
});
return manager
}PinManagement.prototype={init:function(){var manager=this;
if(BBV.user().isLoggedIn){manager.handlers();
manager.buildSlider();
manager.buildRatings();
if(manager.profilePinVerified){viewstates.VERIFIED.elem.show()
}else{viewstates.UNVERIFIED.elem.show()
}}},handlers:function(){var manager=this;
manager.$.delegate(".pin-form","submit",function(e){e.stopPropagation();
e.preventDefault();
var form=this,$container=$(form).find(".pin-settings"),oldPin=form.oldPin1.value+form.oldPin2.value+form.oldPin3.value+form.oldPin4.value,newPin=form.newPin1?form.newPin1.value+form.newPin2.value+form.newPin3.value+form.newPin4.value:false;
if(newPin===false||newPin.length==4){orion.util.oesp.post(manager.url+"verifypin",{xhrId:"verifyPIN",data:JSON.stringify({value:oldPin}),success:function(data){orion.util.oesp.post(manager.url+"parental/verifypin",{xhrId:"verifyPIN",data:JSON.stringify({value:oldPin})});
manager.verifyPinSuccess($container,newPin)
},error:function(){manager.verifyPinError($container)
}})
}else{manager.changePinError($container)
}});
$(document).find(".pin-settings").find("input").keydown(function(event){var BACKSPACE=8;
TAB=9;
DELETE=46,ENTER=13,$this=$(this),siblings=$this.siblings(),pinValue="";
siblings.each(function(){pinValue+=$(this).val()
});
var str=$this.attr("name");
if(!(event.keyCode===DELETE||event.keyCode===BACKSPACE||event.keyCode===TAB||event.keyCode===ENTER)){event.preventDefault();
if((event.keyCode>=48&&event.keyCode<=57)||(event.keyCode>=96&&event.keyCode<=105)){$this.attr("value",String.fromCharCode(event.keyCode>=96?event.keyCode-48:event.keyCode));
if(!(parseInt(str.substring(str.length-1))===4)){$this.next().focus()
}}}else{if(event.keyCode===BACKSPACE&&siblings.index($this)!==0){event.preventDefault();
$this.val("").prev().focus()
}}});
manager.$.delegate(".pin-form .default a","click",function(e){e.preventDefault();
$(".default").hide();
viewstates.VERIFIED.elem.find(".confirmation").hide();
$(".change").show()
});
manager.$.delegate(".pin-form .change a","click",function(e){e.preventDefault();
manager.resetAndHideChangePin()
});
manager.$.delegate(".content-form","submit",function(e){e.preventDefault();
orion.util.oesp.post(manager.url+"parental/set",{xhrId:"setParentalSettings",data:JSON.stringify({unrestrictedContentRatingCodes:$("#slider").data("ratings")}),success:function(data){var profileSettings;
viewstates.VERIFIED.elem.find(".content-form .confirmation").show().html(manager.MESSAGES.settingsSaved)
}})
});
manager.$.delegate(".content-settings ul li","mouseover mouseout",function(e){$(this).find(".tooltip").toggle()
})
},resetAndHideChangePin:function(){$(".change").hide();
$(".default").show();
$(".error").hide();
$(".old-pin,.new-pin").children("input").attr("value","")
},buildSlider:function(){var manager=this,$pinRequiredLabel=$("#parental-labels .pin-required"),$allowedLabel=$("#parental-labels .allowed"),ratingsMap=[],parentalSetting,defaultPosition;
orion.util.oesp.aquireCredentials(function(){parentalSetting=manager.profileSettings.parentalSettings.unrestrictedContentRatingCodes;
defaultPosition=100/(BBV.settings.ratings.length-1)*parentalSetting.length;
$.each(BBV.settings.ratings,function(index,rating){ratingsMap.push(rating.rating)
});
$("#slider").data("ratings",parentalSetting);
manager.$slider.slider({range:"min",value:parentalSetting.length,min:0,max:BBV.settings.ratings.length-1,step:1,slide:function(event,ui){},change:function(event,ui){if(ui.value===0){$allowedLabel.hide()
}else{$allowedLabel.show()
}if(ui.value>=(BBV.settings.ratings.length-1)){$pinRequiredLabel.hide()
}else{$pinRequiredLabel.show().css({left:($(ui.handle).position().left+"px")})
}viewstates.VERIFIED.elem.find(".confirmation").hide();
if(ui.value===0){$("#slider").data("ratings",[])
}else{$("#slider").data("ratings",ratingsMap.slice(1,ui.value+1))
}}});
if(defaultPosition===0){$allowedLabel.hide()
}$pinRequiredLabel.css({left:defaultPosition+"%"})
})
},buildRatings:function(){var manager=this,ratingsList=$("<ul>");
$.each(BBV.settings.ratings,function(index,rating){ratingsList.append('<li title="'+rating.description+'">					<div class="tooltip dialog down"><span class="content-rating">'+rating.rating+"</span>"+rating.description+"</div>"+rating.rating+"				</li>")
});
ratingsList.insertAfter(manager.$slider);
manager.resizeSlider()
},resizeSlider:function(){var manager=this;
var $container=manager.$slider.closest("fieldset");
var itemIndent=13;
var itemWidth=Math.floor(manager.$slider.width()/(BBV.settings.ratings.length-1))-itemIndent;
$container.width(manager.$slider.width()+itemWidth+itemIndent);
$container.find("li").css({width:itemWidth,"padding-left":itemIndent})
},verifyPinSuccess:function(container,newPin){var manager=this,$container=container;
if(newPin){orion.util.oesp.post(manager.url+"pin/set",{xhrId:"setPIN",data:JSON.stringify({value:newPin}),success:function(data){manager.changePinSuccess(newPin)
}})
}else{$container.removeClass("invalid-old");
viewstates.UNVERIFIED.elem.find(".old-pin").removeClass("invalid");
viewstates.UNVERIFIED.elem.hide();
viewstates.VERIFIED.elem.show()
}},verifyPinError:function(container){var manager=this,$container=container,$oldPin=$container.find(".old-pin"),$newPin=$container.find(".new-pin");
$oldPin.addClass("invalid");
$oldPin.find("input").val("").eq(0).focus();
$newPin.removeClass("invalid");
$container.find(".confirmation").hide().empty();
$container.find(".error").show().html(manager.MESSAGES.invalidOldPin)
},changePinSuccess:function(newPin){var manager=this;
manager.resetAndHideChangePin();
viewstates.VERIFIED.elem.find(".old-pin").removeClass("invalid").end().find(".new-pin").removeClass("invalid");
viewstates.VERIFIED.elem.find(".error").empty();
viewstates.VERIFIED.elem.find(".default").show();
viewstates.VERIFIED.elem.find(".change").hide();
viewstates.VERIFIED.elem.hide();
viewstates.UNVERIFIED.elem.find(".old-pin").removeClass("invalid");
viewstates.UNVERIFIED.elem.find(".pin-form .error").hide().empty();
viewstates.UNVERIFIED.elem.find(".pin-form .confirmation").show().html(manager.MESSAGES.pinChanged);
viewstates.UNVERIFIED.elem.show()
},changePinError:function(){var manager=this;
viewstates.VERIFIED.elem.find(".old-pin").removeClass("invalid").end().find(".new-pin").addClass("invalid");
viewstates.VERIFIED.elem.find(".error").show().html(manager.MESSAGES.invalidNewPin)
}};
return PinManagement
})(jQuery);
BBV.namespace("orion.modules").VideoPlayer=orion.modules.VideoPlayer||(function($,Model,View){function VideoPlayerModel(){var self=this;
Model.call(this);
self.flashVars={autoplay:false};
self.params={};
self.attributes={}
}orion.util.inherits(VideoPlayerModel,Model);
function VideoPlayerView(elem,model,publisher){var self=this;
var playerType;
View.call(self,model);
self.$=$(elem);
orion.oesp.session.withSession(function(session){if(session.isAuthenticated()){self.isAuthenticated=true;
self.$.removeClass("video-player-signed-out");
log("VIDEOPLAYER:IS AUTHENTICATED")
}});
if(self.model.playerType=="channel"&&self.model.channelBackground.length>0){self.backgroundContainer=$("#backgrounds-div-container").css("background-image","url("+self.model.channelBackground+")")
}self.background=$("#backgrounds-div");
self.background.removeClass().addClass("vod-bg").hide();
self.publisher=publisher;
self.playerScreen=self.$.find(".video-player").hide();
self.endScreen=self.$.find(".video-finished").hide();
self.loginScreen=self.$.find(".logged-out-video-aspot").hide();
self.upgradeScreen=self.$.find(".upgrade-video-aspot").hide();
self.pinScreen=self.$.find(".parental-settings").hide();
self.errorScreen=self.$.find(".player-error").hide();
self.screens=[self.playerScreen,self.loginScreen,self.endScreen,self.pinScreen,self.errorScreen];
self.placeholderId="player-placeholder";
self.placeholder=$("#"+self.placeholderId).get(0);
self.loadVideoPlayer()
}orion.util.inherits(VideoPlayerView,View);
VideoPlayerView.prototype.loadVideoPlayer=function(){var self=this;
self.player=new orion.widgets.VideoPlayer(self.model.playerType=="channel"?"live":"standard");
return self
};
VideoPlayerView.prototype.setScreen=function(screen){var self=this;
var i=self.screens.length;
while(i--){if(self.screens[i]!=screen){self.screens[i].hide()
}}screen.show();
self.$.show();
return self
};
VideoPlayerView.prototype.showSocialOverlay=function(){var self=this;
var content=$(".video-social-overlay");
var social=orion.app.dialogManager.getDialog("video-social-overlay");
var assetId=self.$.data("media-id");
social.setHtmlContent(content);
social.contentArea.find(".video-social-overlay").show();
if(self.playerScreen.is(":visible")){social.centerOn(self.playerScreen.get(0))
}else{social.centerOn(self.endScreen.get(0))
}social.show();
orion.util.analytics.trackEvent("action",{pageName:"Engagement/Social/Share",channel:"Engagement/Social/Share",prop23:"Engagement",prop24:"Social",prop26:"Share",eVar32:assetId,events:"event9,event34"});
return self
};
VideoPlayerView.prototype.showPlayerScreen=function(){var self=this;
self.setScreen(self.playerScreen);
self.ensurePlayerIsEmbedded();
self.background.addClass("player-bg").show();
$("video-player-module > .loader").show();
return self
};
VideoPlayerView.prototype.showLoginScreen=function(){var self=this;
var model=self.model;
var playerType=model.get("playerType");
var signinButton=self.$.find(".sign-in");
var bgImg;
var mediaItem;
var channel;
self.setScreen(self.loginScreen);
if(playerType==="channel"){channel=model.get("channel");
bgImg=channel.getBackgroundImageUrl();
currentStationRequest=channel.requestCurrentStation();
currentStationRequest.done(function(station){var currentProgramRequest=station.requestCurrentProgram();
currentProgramRequest.done(function(program){var aspot=self.loginScreen.find(".aspot-messaging");
var boxart;
aspot.find(".channel-title").text(channel.title||station.title);
aspot.find(".show-title").text(program.title);
if(program.title!=program.secondaryTitle){aspot.find(".episode-title").text(program.secondaryTitle)
}aspot.find(".season-number").text(program.seasonNumber);
aspot.find(".episode-number").text(program.seriesEpisodeNumber);
if(program.images){boxart=orion.oesp.res.Media.prototype.getBoxArtMedium.call(program);
if(boxart){aspot.find(".box-art").html('<img src="'+boxart+'" alt="'+program.title+'" />')
}}})
})
}else{mediaItem=model.get("mediaItem");
bgImg=mediaItem.getBackgroundImageUrl()
}if(bgImg){self.background.css({"background-image":'url("'+bgImg+'")'}).removeClass().addClass("vod-login-bg")
}else{self.background.addClass("vod-default-bg")
}self.background.show();
signinButton.bind("click",function(){self.publisher.trigger("requestDialog",{dialogName:"login",centerOn:self.$.get(0)});
return false
});
return self
};
VideoPlayerView.prototype.showUpgradeScreen=function(){var self=this;
var model=self.model;
var playerType=model.get("playerType");
var purchases=orion.oesp.purchaseEndpoint;
var bgImg;
var mediaItem;
var channel;
var currentStationRequest;
self.setScreen(self.upgradeScreen);
if(playerType==="channel"){channel=model.get("channel");
bgImg=channel.getBackgroundImageUrl();
currentStationRequest=channel.requestCurrentStation();
currentStationRequest.done(function(station){var currentProgramRequest=station.requestCurrentProgram();
currentProgramRequest.done(function(program){var aspot=self.upgradeScreen.find(".aspot-messaging");
var previewButton=aspot.find(".play-preview").hide();
var boxart;
aspot.find(".channel-title").text(channel.title||station.title);
aspot.find(".show-title").text(program.title);
aspot.find(".episode-title").text(program.secondaryTitle);
aspot.find(".season-number").text(program.seasonNumber);
aspot.find(".episode-number").text(program.seriesEpisodeNumber);
if(program.images){boxart=orion.oesp.res.MediaItem.prototype.getImageUrlByType.call(program,"box-art");
if(boxart){aspot.find(".box-art").html('<img src="'+boxart+'" alt="'+program.title+'" />')
}}})
})
}else{mediaItem=model.get("mediaItem");
bgImg=mediaItem.getBackgroundImageUrl();
offersRequest=purchases.requestSetOfProductOffers(mediaItem.currentTvodProductIds);
orion.oesp.session.done(function(session){offersRequest.done(function(offers){if(!mediaItem.hasVodType("SVOD")&&offers.products.length){self.upgradeScreen.find("a.upgrade").closest("span.button").hide()
}if(!session.customer.stbType){self.upgradeScreen.find(".upgrade-message").text(self.$.data("upgrade-no-box"))
}else{if(!offers||!offers.products){self.upgradeScreen.find(".upgrade-message").text(self.$.data("upgrade-not-entitled"))
}}})
})
}if(bgImg){self.background.css({"background-image":'url("'+bgImg+'")'}).removeClass().addClass("vod-upgrade-bg")
}else{self.background.addClass("vod-default-bg")
}self.background.show();
return self
};
VideoPlayerView.prototype.showEndScreen=function(){var self=this;
var endScreen=self.endScreen;
var feedContainerElem=endScreen.find(".feed-container");
var mediaItem=self.model.get("mediaItem");
var mediaGroup=self.model.get("mediaGroup");
mediaItem=BBV.extend(mediaItem,orion.util.mediamethods);
var mediaItemId=mediaItem.id;
if(mediaItem.isTrailer()&&$(mediaGroup.currentChildMediaCounts).length>1){var redirectUrl=mediaItem.buildMediaGroupUrlForItem();
if(redirectUrl.length>0){window.location.assign(redirectUrl);
return self
}}if(!self.endScreen.initialized){self.$.delegate(".replay","click",function(e){$(".video-player-module > .loader").show();
e.preventDefault();
self.showPlayerScreen();
self.player.loadMediaItem(mediaItem);
return false
});
self.$.delegate(".share","click",function(e){e.preventDefault();
self.showSocialOverlay()
});
if(orion.Playlist.containsProgramId({id:mediaItemId})){orion.Playlist.getNext({id:mediaItemId,count:4,callback:function(){var nextItems=this;
var nextUp=[nextItems.shift()];
var nextUpElem=endScreen.find(".related ul");
var nextUpParent=nextUpElem.parent();
endScreen.feedContainer=new orion.widgets.FeedContainer(feedContainerElem,{feedData:nextItems});
new orion.widgets.FeedContainer(nextUpElem,{feedData:nextUp,pageSize:0,enablePaging:false})
}})
}else{endScreen.feedContainer=new orion.widgets.FeedContainer(feedContainerElem,{imageType:"boxart-small",loaderHeight:200,loaderWidth:450})
}endScreen.initialized=true
}self.setScreen(endScreen);
self.background.hide();
$(".video-finished .no-hover .title a").ellipsis({setTitle:"onEllipsis"});
return self
};
VideoPlayerView.prototype.showPinScreen=function(pinType){var self=this;
var pinType=pinType||"parental";
self.setScreen(self.pinScreen);
var pinDialog=orion.app.dialogManager.getDialog("pin-verification");
pinDialog.centerOn(window);
pinDialog.setVerificationType(pinType);
pinDialog.show();
pinDialog.setFocus();
self.publisher.subscribe("pinDialogCancelled",function(e){self.showErrorScreen("PIN_ERROR");
log("pin dialog closed, showing error screen")
});
self.publisher.subscribe("pinVerified",function(){log("Pin verified.");
window.location.reload()
});
return self
};
VideoPlayerView.prototype.showErrorScreen=function(errorType){$(".video-player-module > .loader").hide();
var self=this;
log("Module:VideoPlayer: Showing errorType",errorType);
switch(errorType){case"PLAYER_PROGRAM_NOT_FOUND":self.errorScreen.find(".listing-error").show();
break;
case"TP_GEO_BLOCKED":self.errorScreen.find(".geo-error").show();
break;
case"WV_CONCURRENT_HB_FAILURE":self.errorScreen.find(".concurrency-error").show();
break;
case"INACTIVITY_TIMEOUT":self.errorScreen.find(".inactivity-error").show();
break;
default:self.errorScreen.find(".generic-error").show();
break
}self.setScreen(self.errorScreen)
};
VideoPlayerView.prototype.showMessage=function(message){var self=this;
if(self.currentMessage){self.currentMessage.remove()
}self.currentMessage=new orion.widgets.VideoMessage(message,"left");
self.currentMessage.appendTo(self.playerScreen);
return self
};
VideoPlayerView.prototype.ensurePlayerIsEmbedded=function(){var self=this;
if(!self.player.isEmbeded()){self.player.embed(self.placeholder,self.model.flashVars,self.model.params,self.model.attributes)
}};
function VideoPlayer(elem,publisher){if(!(this instanceof VideoPlayer)){return new VideoPlayer(elem,publisher)
}var self=this;
var view,model;
var $elem=$(elem);
self.publisher=publisher;
self.$elem=$elem;
self.model=model=new VideoPlayerModel();
model.set("playerType",$elem.data("player-type"));
model.set("isPreview",$elem.data("is-preview"));
model.set("channelBackground",$elem.data("channel-background"));
self.view=view=new VideoPlayerView(elem,model,publisher);
self.initialize()
}VideoPlayer.prototype.initialize=function(channelId){var self=this;
var model=self.model;
var view=self.view;
var channelRequest;
var mediaItemRequest;
if(model.get("playerType")=="channel"){model.set("channelId",channelId?channelId:self.$elem.data("channel-id"));
channelRequest=orion.oesp.channelEndpoint.requestChannel(model.get("channelId"));
channelRequest.done(function(channel){model.set("channel",channel);
self.channelSetup()
});
channelRequest.fail(function(){log("orion.modules.VideoPlayer:","There was an error aquiring the channel from the OESP.","channelId:",model.channelId);
view.showErrorScreen()
})
}else{mediaItemRequest=orion.oesp.mediaItemEndpoint.requestMediaItem(self.$elem.data("media-id"));
mediaItemRequest.done(function(mediaItem){model.set("mediaItem",mediaItem);
self.vodSetup()
});
mediaItemRequest.fail(function(mediaItem){log("orion.modules.VideoPlayer: error aquiring the mediaItem (",mediaItem,")")
})
}};
VideoPlayer.prototype.channelSetup=function(){var self=this;
var model=self.model;
var channel=model.get("channel");
var view=self.view;
var player=view.player;
orion.oesp.session.done(function(session){var permission=session.getPermissionToPlayChannel(channel);
permission.done(function(){if($(".video-player:hidden").length){view.showPlayerScreen();
self.subscribeToVideoEvents()
}player.playChannel(channel)
});
permission.fail(function(reason){log("orion.modules.VideoPlayer: there was a permission failure for this channel",reason);
switch(reason){case"login":view.showLoginScreen();
break;
case"upgrade":view.showUpgradeScreen();
break;
case"purchase":view.showUpgradeScreen();
break;
case"adultpin":view.showPinScreen("adult");
break;
case"parentalpin":view.showPinScreen("parental");
break;
default:view.showErrorScreen();
break
}})
})
};
VideoPlayer.prototype.vodSetup=function(){var self=this;
var mediaItem=self.model.get("mediaItem");
var view=self.view;
var player=view.player;
orion.oesp.session.done(function(session){var permission=session.getPermissionToPlayMediaItem(mediaItem);
permission.done(function(){if(session.isAuthenticated()){var bookmarkRequest=orion.oesp.bookmarkEndpoint.requestBookmarks(mediaItem.id);
view.showPlayerScreen();
self.subscribeToVideoEvents();
bookmarkRequest.done(function(bookmark){var bookmarkDialog;
if(bookmark.offset>0){bookmarkDialog=orion.app.dialogManager.getDialog("resume");
bookmarkDialog.centerOn(view.playerScreen.get(0));
bookmarkDialog.bind("resume",function(){player.loadMediaItem(mediaItem,bookmark.offset);
return false
});
bookmarkDialog.bind("replay",function(){player.loadMediaItem(mediaItem);
return false
});
bookmarkDialog.show()
}else{player.loadMediaItem(mediaItem)
}}).fail(function(){log("VideoPlayer.vodSetup -> no bookmark found");
player.loadMediaItem(mediaItem)
})
}else{view.showPlayerScreen();
self.subscribeToVideoEvents();
player.loadMediaItem(mediaItem)
}}).fail(function(reason){log("VideoPlayer.vodSetup -> there was a permission failure for this video");
log("VideoPlayer.vodSetup -> reason: "+reason);
switch(reason){case"login":view.showLoginScreen();
break;
case"upgrade":view.showUpgradeScreen();
break;
case"purchase":view.showUpgradeScreen();
break;
case"adultpin":view.showPinScreen("adult");
break;
case"parentalpin":view.showPinScreen("parental");
break;
default:view.showErrorScreen();
break
}})
})
};
VideoPlayer.prototype.subscribeToVideoEvents=function(){var vp=this;
var self=this;
var view=self.view;
var model=self.model;
var player=view.player;
var mediaItem=self.model.get("mediaItem");
player.bind("contentEnd",function(){view.showEndScreen()
});
player.bind("errorOccurred",function(vp,e){var error=player.errors.pop();
log("MODULE:VIDEOPLAYER: Error Occurred on the video player:",error,e);
if(e.causedPlaybackFailure){view.showErrorScreen(error)
}});
player.bind("inactivityTimeout",function(vp,e){view.showErrorScreen("INACTIVITY_TIMEOUT")
});
player.bind("parentalPINUnverified",function(e){log("MODULE:VIDEOPLAYER: Need to enter parental PIN");
view.showPinScreen("parental")
});
player.bind("shareClicked",function(e){if(model.get("playerType")!=="channel"){player.pause()
}view.showSocialOverlay();
return false
});
vp.publisher.subscribe("addedToPlaylist",function(e){var id=vp.model.mediaItem.id;
var updateHandler=function(e){if(e.mediaId===id){log("MODULE:VIDEOPLAYER: item successfully added to playlist.");
player.playlistSuccess();
vp.publisher.unsubscribe("playlistUpdated",updateHandler)
}};
log("MODULE:VIDEOPLAYER: Adding",id,"to the playlist.");
vp.publisher.trigger("updatePlaylist",{action:"add",mediaId:id});
vp.publisher.subscribe("playlistUpdated",updateHandler)
});
vp.publisher.subscribe("updatePlaylist",function(ev){if(ev.action==="remove"&&model.mediaItem&&ev.mediaId===model.mediaItem.id){var orionPlayer=view.$.find("object").get(0);
orionPlayer.playlistRemoved();
log("Removed playlist item from orion player")
}});
player.bind("channelSelected",function(e,data){var channelId=data.channel;
var channelName=data.channelName||"channel";
self.initialize(channelId)
});
player.bind("assetLoaded",function(event){if(model.mediaItem!==undefined){var mediaGroupId=model.mediaItem.mediaGroupId;
var isPreview=model.get("isPreview");
if(!isPreview){return
}$.when(orion.oesp.session,orion.oesp.mediaGroupEndpoint.requestFormattedMediaGroup(mediaGroupId)).done(function(session,mediaGroup){model.set("mediaGroup",mediaGroup);
if(!session.hasEntitlement(model.mediaItem.entitlements)){if(session.isAuthenticated()){view.showMessage($("#upgrade-overlay-content").html())
}else{view.showMessage($("#login-overlay-content").html())
}}})
}});
player.bind("permission.fail.login",function(){view.showLoginScreen()
});
player.bind("permission.fail.upgrade",function(){view.showUpgradeScreen()
});
player.bind("permission.fail.purchase",function(){view.showUpgradeScreen()
});
player.bind("permission.fail.adultpin",function(){view.showPinScreen("adult")
});
player.bind("permission.fail.parentalpin",function(){view.showPinScreen("parental")
});
return this
};
return VideoPlayer
})(jQuery,orion.util.mvc.Model,orion.util.mvc.View);
BBV.namespace("orion.modules").Promo=orion.modules.Promo||(function($){function Promo(elem,publisher){var promo,view;
if(!elem){throw new Error("Please provide an element to use for the promo.")
}if(!(this instanceof Promo)){throw new Error("Promo called without new.")
}promo=this;
promo.view=view={elem:elem,$:$(elem)};
orion.util.oesp.aquireCredentials(function(){if(BBV.user().isLoggedIn){promo.showLoggedInView()
}else{promo.showLoggedOutView()
}})
}Promo.prototype.showLoggedInView=function(){this.view.$.find(".signed-in").show();
this.view.$.find(".signed-out").hide()
};
Promo.prototype.showLoggedOutView=function(){this.view.$.find(".signed-out").show();
this.view.$.find(".signed-in").hide()
};
return Promo
})(jQuery);
BBV.namespace("orion.modules").MyOrionBar=orion.modules.MyOrionBar||(function($){function MyOrionBar(elem,publisher){var self=this;
if(!(self instanceof MyOrionBar)){return new MyOrionBar(elem,publisher)
}orion.modules.MyOrionBar.loading=[];
self.elem=elem;
self.$=$(self.elem);
self.publisher=publisher;
self.$container=self.$.find("ul");
self.$containerDialogs=$("#dialog-container");
self.$loadingWrapper=self.$containerDialogs.find(".loading-wrapper");
self.dialogMap={recommendations:{module:"Recommendations","module-id":"recommendations-module"},playlist:{module:"Playlist","module-id":"playlist-module"},"recently-viewed":{module:"RecentlyViewed"},facebook:{module:"FacebookActivity"},"my-rentals":{module:"MyRentals","module-id":"my-rentals-module"}};
if(!elem){throw new Error("Please provide an element to use for the orionBar.")
}self.initialize()
}MyOrionBar.prototype.initialize=function(){var self=this;
self.render();
self.handlers();
new orion.Playlist(self.publisher);
for(dialog in self.dialogMap){if($("#"+self.dialogMap[dialog]["module-id"]).length){new orion[self.dialogMap[dialog]["module"]](self.publisher)
}}};
MyOrionBar.prototype.handlers=function(){var self=this;
self.$.delegate("li a","click",function(event){self.toggleDialog(event)
});
self.$containerDialogs.delegate("a.close-dialog, a.cancel","click",function(event){self.dialogClose(event)
});
self.publisher.subscribe("updatePlaylist",function pointToPlaylist(){self.pointArrowTo($(".my-orion-list").find('[data-dialog="playlist"] .my-orion-link'))
})
};
MyOrionBar.prototype.render=function(){var self=this;
self.localStrings=orioni18n.myOrionBar;
self.$template=$(Mustache.to_html(orion.templates.MyOrionBarDialogWrapper,{localStrings:self.localStrings}));
self.$containerDialogs.append(self.$template);
self.$myorionbarDialogs=$("#myorionbar-dialog");
self.$myorionbarDialogs.loader({flow:["overlay"],target:".dialog-inner",minheight:475,minwidth:926})
};
MyOrionBar.prototype.pointArrowTo=function(elem){var self=this;
var arrowMoveSpeed=($("#myorionbar-dialog").css("display")=="none")?0:600;
var $arrow=self.$myorionbarDialogs.find("#dialog-arrow");
var dialogLeft=$("#myorionbar-dialog").offset().left;
var buttonLeft=elem.parent().offset().left+(elem.parent().width()/2);
var arrowPos=buttonLeft-dialogLeft-13;
setTimeout(function(){$arrow.stop().animate({left:arrowPos},arrowMoveSpeed)
},1)
};
MyOrionBar.prototype.toggleDialog=function(event){var self=this;
var elem=event.target;
var $elem=$(elem);
var $dialogs=$(".dialog, .dialog-content");
var dialog=$elem.closest("li").data("dialog");
var loginDialog;
var showDialog=$("#"+dialog).is(":visible")?false:true;
event.preventDefault();
orion.oesp.session.withSession(function(session){if(session.isAuthenticated()){self.$myorionbarDialogs.trigger("loaded");
self.$loadingWrapper.hide();
$dialogs.hide();
if(!$("#"+dialog).length){orion.modules.MyOrionBar.loading.push(dialog);
self.$myorionbarDialogs.show();
self.$myorionbarDialogs.trigger("loading");
var orionBarObj=new orion[self.dialogMap[dialog]["module"]](self.publisher,showDialog)
}else{if(showDialog){self.$myorionbarDialogs.show();
$("#"+dialog).show()
}}if(showDialog){self.pointArrowTo($elem);
if(dialog==="playlist"){orion.util.analytics.trackEvent("action",{pageName:"Playlist/Overlay",channel:"Playlist/Overlay",prop23:"Playlist",prop24:"Playlist",prop26:"Overlay",events:"event9"})
}else{if(dialog==="recommendations"){orion.util.analytics.trackEvent("action",{pageName:"Recommendations/Overlay",channel:"Recommendations/Overlay",prop23:"Recommendations",prop24:"Recommendations",prop26:"Overlay",events:"event9"})
}else{if(dialog==="recently-viewed"){orion.util.analytics.trackEvent("action",{pageName:"Recently Viewed/Overlay",channel:"Recently Viewed/Overlay",prop23:"Recently Viewed",prop24:"Recently Viewed",prop26:"Overlay",events:"event9"})
}else{if(dialog==="my-rentals"){orion.util.analytics.trackEvent("action",{pageName:"My Rentals/Overlay",channel:"My Rentals/Overlay",prop23:"My Rentals",prop24:"My Rentals",prop26:"Overlay",events:"event9"})
}else{orion.util.analytics.trackEvent("action",{pageName:"Engagement/Social/Friends activity overlay",channel:"Engagement/Social/Friends activity overlay",prop23:"Engagement",prop24:"Social",prop26:"Friends activity overlay",events:"event9"})
}}}}}}else{if(self.$container.attr("class")==dialog){self.$container.attr("class","")
}else{self.$container.attr("class",dialog);
loginDialog=orion.app.dialogManager.getDialog("login");
loginDialog.pointTo(elem,"down");
loginDialog.$.show()
}}})
};
MyOrionBar.showDialog=function(dialog){if($.inArray(dialog,orion.modules.MyOrionBar.loading)<0&&orion.modules.MyOrionBar.loading.length){$("#"+dialog).hide()
}if($.inArray(dialog,orion.modules.MyOrionBar.loading)>=0){orion.modules.MyOrionBar.loading=[]
}};
MyOrionBar.prototype.dialogClose=function(event){event.preventDefault();
var content=this;
var $dialogs=$(".dialog");
$dialogs.hide();
content.$container.attr("class","")
};
return MyOrionBar
})(jQuery);
BBV.namespace("orion.modules").Playlist=orion.modules.Playlist||(function($){function Playlist(elem,publisher){var content,model,view;
content=this;
content.elem=elem;
content.$=$(content.elem);
if(!elem){throw new Error("Please provide an element to use for the orionBar.")
}if(!(this instanceof Playlist)){throw new Error("Playlist called without new.")
}content.publisher=publisher
}Playlist.prototype={constructor:Playlist};
return Playlist
})(jQuery);
BBV.namespace("orion.modules").Recommendations=orion.modules.Recommendations||(function($){function Recommendations(elem,publisher){var content,model,view;
content=this;
content.elem=elem;
content.$=$(content.elem);
if(!elem){throw new Error("Please provide an element to use for the orionBar.")
}if(!(this instanceof Recommendations)){throw new Error("Recommendations called without new.")
}content.publisher=publisher
}Recommendations.prototype={constructor:Recommendations};
return Recommendations
})(jQuery);
BBV.namespace("orion.modules").MyRentals=orion.modules.MyRentals||(function($){function MyRentals(elem,publisher){var content,model,view;
content=this;
content.elem=elem;
content.$=$(content.elem);
if(!elem){throw new Error("Please provide an element to use for the orionBar.")
}if(!(this instanceof MyRentals)){throw new Error("MyRentals called without new.")
}content.publisher=publisher
}MyRentals.prototype={constructor:MyRentals};
return MyRentals
})(jQuery);
BBV.namespace("orion.modules").ASpot=orion.modules.ASpot||(function($){var instanceCounter=0;
var params={menu:"false",scale:"noScale",allowFullscreen:"true",allowScriptAccess:"always",bgcolor:"#FFFFFF",wmode:"transparent"};
var attributes={id:"Liberty"};
function ASpot(elem,publisher){var aspot=this,model,view;
var $elem=$(elem);
var placeholder=$elem.find(".aspot-placeholder");
var placeholderId="aspot-placeholder"+instanceCounter++;
placeholder.attr("id",placeholderId);
var flashVars={debug:false,siteURLs:encodeURIComponent(JSON.stringify(BBV.settings.site.urls)),stacked:$elem.data("stacked"),providers:$elem.data("providers"),i18n:$elem.data("i18n"),posterOrientation:$elem.data("poster-orientation"),countryCode:BBV.settings.oespRoutes.countryCode,languageCode:BBV.settings.oespRoutes.languageCode};
var background=$elem.data("background");
if(background){flashVars.background=background
}var feed=$elem.data("feed-url");
var swfPath=$elem.data("swf-path");
if(feed.indexOf("byMediaGroupId")!==-1){feed+="&sort=secondaryTitle"
}orion.util.oesp.get(feed,{success:function(data){flashVars.jsonData=encodeURIComponent(JSON.stringify(data));
flashVars.token=orion.util.oesp.token;
flashVars.username=orion.util.oesp.username;
swfobject.embedSWF(swfPath,placeholderId,"100%","100%","10.0.0","expressInstall.swf",flashVars,params,attributes,function(e){if(e.success){log("ASpot: done embedding the swf: success.")
}else{log("ASpot: there was an error embedding the swf.")
}})
},error:function(jqXHR,textStatus,errorThrown){log("ASpot: there was an error aquiring the feed.");
log("ASpot error report:");
log("jqXHR:",jqXHR);
log(textStatus+": "+errorThrown)
}})
}return ASpot
})(jQuery);
BBV.namespace("orion.modules").SearchResults=orion.modules.SearchResults||(function($){var viewstates={ONLINE:{template:"SearchResultsOnline",url:$("#search-results-tabs").attr("data-vod-url"),size:10},TV:{template:"SearchResultsTv",url:$("#search-results-tabs").attr("data-epg-url"),size:10}};
function readUrlString(url){var keyValue=url.split("?");
return{url:keyValue[0],query:keyValue[1]}
}function parseParam(p){var custom=/\}\{/,obj={},tmp_;
if(p&&custom.test(p)){tmp_=p.replace(/\}\{/,"}${");
tmp_=tmp_.split("$");
obj[tmp_[0]]=p
}else{if(p&&p.indexOf("=")>-1){tmp_=p.split("=");
obj[tmp_[0]]=p
}else{if(p){obj[p]=p
}}}return obj
}function SearchResultsModel(content){var self=this;
self.content=content;
self.data=null;
self.datamedia=[]
}SearchResultsModel.prototype.getMediaRange=function(strt,stp){var model=this;
return{medias:model.datamedia.slice(strt,stp)}
};
SearchResultsModel.prototype.update=function(data){var model=this;
var content=model.content;
var view=content.view;
model.data=data;
model.datamedia=[];
if(view.element.attr("id")=="tv"&&!content.stations){setTimeout(function(){content.model.update(data)
},250);
return
}$.each(model.data.results,function(index,group){if(!group.mediaGroup){group.mediaGroup={title:"Missing mediaGroup"}
}BBV.each(group,function(name,item){if(!item){log(name);
log(item);
log(group)
}if(BBV.isArray(item)){BBV.each(item,function(index,items){BBV.each(content.stations,function(index,station){if(items.stationId==station.stationId){items.channelNumber=station.channelNumber;
items.channelTitle=station.channelTitle;
items.stationTitle=station.stationTitle;
items.entitlements=station.entitlements
}});
items.index=index;
items.length=item.length;
items.groupTitle=group.mediaGroup.title;
items.localStrings=content.localStrings;
BBV.extend(items,orion.util.mediamethods)
})
}else{item.index=0;
item.length=group.length;
item.groupTitle=group.mediaGroup.title;
item.localStrings=content.localStrings;
BBV.extend(item,orion.util.mediamethods)
}});
model.datamedia.push(group)
});
view.pagination();
view.counts(view.element.attr("id"),model.data.totalResults);
content.$.trigger("loaded");
if(model.data.entryCount==0){$("#"+view.element.attr("id")).find(".no-results").show()
}else{model.content.view.notify(data)
}};
function SearchResultsView(c){var view=this,content;
view.notifications={};
view.content=content=c;
view.model=content.model;
view.initialized=false;
view.root=view.content.$;
view.currentview=(function(){if(window.location.hash.substr(1).toUpperCase()==="TV"){view.root.find(".tabs > li").removeClass("active");
view.root.find(".tabs > li:eq(1)").addClass("active");
view.root.find(".panel").removeClass("active");
view.root.find(".panel:eq(1)").addClass("active")
}var current=view.root.find(".tabs > li.active > a").attr("href").substr(1);
if(current){return viewstates[current.toUpperCase()]
}})();
view.element=$(view.root.find(".tabs > li.active > a").attr("href"));
view.start=1;
view.end=view.currentview.size;
return view
}SearchResultsView.prototype.bind=function(){var view=this,model=view.model,feed=Mustache.to_html(orion.templates[view.currentview.template],model.getMediaRange(0,view.currentview.size));
view.element=$(view.root.find(".tabs > li.active > a").attr("href"));
view.element.find(".results").prepend(feed);
view.checkEntitlements(view.element.find(".results"))
};
SearchResultsView.prototype.checkEntitlements=function(element){var view=this;
var selector="[data-media-entitlements]";
var lock=".locked";
var $elem=$(element);
var items=$elem.is(selector)?$elem:$elem.find(selector);
orion.oesp.session.done(function(session){items.each(function(){var item=$(this);
var entitlement=item.data("media-entitlements").split(",");
if(session.hasEntitlement(entitlement)){item.find(lock).hide()
}})
})
};
SearchResultsView.prototype.handlers=function(){var view=this,content=view.content,model=content.model,controller=content.controller;
view.subscribe("bind",view.bind);
content.$.loader({flow:["insert"],target:".panel:visible .results",minheight:200,minwidth:926});
if(content.$.find(".tabs").find(".tab").length){var $first=content.$.find(".tabs .tab:eq(0)"),$active=content.$.find(".tabs .active a");
if(!$active.length){$first.addClass("active")
}}content.$.find(".tabs").delegate("a","click",function(e){var $root=content.$.find(".tabs"),$this=$(this),$active=$root.find(".active"),$parent=$($this.context.parentNode),currentview=$this.attr("href").substr(1);
orion.util.oesp.abortRequest(orion.util.oesp.xhr[view.element.attr("id")]);
view.element=$($this.attr("href"));
$(view.element).find(".no-results").hide();
if(!$parent.hasClass("active")){$active.removeClass("active");
$active=$parent.addClass("active")
}content.$.trigger("loaded");
if(viewstates[currentview.toUpperCase()]!==view.currentview){view.currentview=viewstates[currentview.toUpperCase()];
view.root.find(".panel").removeClass("active");
view.root.find("#"+currentview).addClass("active");
if(!$($this.attr("href")).find(".results-list").length){view.start=1;
view.end=view.currentview.size;
controller.load()
}}return false
});
content.$.find(".show-more a").live("click",function(e){e.preventDefault();
var $this=$(this),$hiddenItems=$this.closest(".grouped-media-items").find(".hidden-items");
model=view.model;
$hiddenItems.slideToggle();
$.trim($this.find(".toggler").text())==$.trim($this.attr("data-text-expand"))?$this.find(".toggler").text($.trim($this.attr("data-text-collapse"))):$this.find(".toggler").text($.trim($this.attr("data-text-expand")));
return false
});
content.$.find(".pagination a").live("click",function(e){if($(this).is(".active")){return false
}var $this=$(this),model=view.model,page=parseInt($this.attr("href").substr(1));
view.start=page*view.currentview.size-view.currentview.size+1;
view.end=model.data.totalResults<(page*view.currentview.size)?model.data.totalResults:(page*view.currentview.size);
$this.closest(".pagination").siblings(".results-list").remove();
$this.closest("ul").empty();
controller.load();
return false
})
};
SearchResultsView.prototype.pagination=function(){var view=this,model=this.model,current,last,li1,li2,li3,li5,li6,li7;
if(model.data.entryCount==0){return
}current=Math.ceil(view.start/view.currentview.size);
last=Math.ceil(model.data.totalResults/view.currentview.size);
li1=current!==1?current<=4?'<li><a href="#1">1</a></li>':'<li><a href="#1">1</a></li><li>...</li>':"";
li2=(current-2)>1?'<li><a href="#'+(current-2)+'">'+(current-2)+"</a></li>":"";
li3=(current-1)>1?'<li><a href="#'+(current-1)+'">'+(current-1)+"</a></li>":"";
li5=(current+1)<last?'<li><a href="#'+(current+1)+'">'+(current+1)+"</a></li>":"";
li6=(current+2)<last?'<li><a href="#'+(current+2)+'">'+(current+2)+"</a></li>":"";
li7=current!==last?current>=(last-3)?'<li><a href="#'+last+'">'+last+"</a></li>":'<li>...</li><li><a href="#'+last+'">'+last+"</a></li>":"";
view.element.find(".pagination > ul").append("		"+li1+"		"+li2+"		"+li3+'		<li><a href="#'+current+'" class="active">'+current+"</a></li>		"+li5+"		"+li6+"		"+li7+"	")
};
SearchResultsView.prototype.counts=function(view,count){var $tab=$(".tabs a[href=#"+view+"] .count");
$tab.text("("+count+")").data("itemCount",count);
this.numCounts=this.numCounts||0;
this.numCounts++;
if(this.numCounts==2){this.setActiveTab()
}};
SearchResultsView.prototype.setActiveTab=function(){var tab=$(".tabs").find("a");
for(i=0;
i<tab.length;
i++){var onlineTabCount=$(tab[0]).children(".count").data("itemCount");
var tvTabCount=$(tab[1]).children(".count").data("itemCount");
if(onlineTabCount&&tvTabCount>0){return
}if(onlineTabCount===0&&tvTabCount>0){$(".tabs a[href=#tv]").trigger("click")
}}};
SearchResultsView.prototype.notify=function(name,data_){var view=this,data=(BBV.type(name)==="string")?data_||{}:name;
if(BBV.type(name)==="string"){view.notifications[name].call(view,data);
return
}BBV.each(view.notifications,function(name,notification){notification.call(view,data)
})
};
SearchResultsView.prototype.subscribe=function(name,fn){var view=this;
view.notifications[name]=fn;
return view
};
function SearchResultsController(content,url){var self=this;
self.content=content;
self.feed=new BBV.feed(self.content.$.attr("id"),{xhrId:content.view.element.attr("id"),url:readUrlString(url).url,callback:function(){content.model.update(this.data)
}})
}SearchResultsController.prototype.clearParams=function(){var controller=this,content=controller.content;
content.appliedFilters.params={};
return controller
};
SearchResultsController.prototype.removeParam=function(param_){var controller=this,content=controller.content,param=parseParam(param_);
BBV.each(content.appliedFilters.params,function(name,value){if(content.appliedFilters.params[name]){delete content.appliedFilters.params[name]
}});
return controller
};
SearchResultsController.prototype.serializeParams=function(){var controller=this,qs=[];
if(controller.content.appliedFilters.default_){qs.push(controller.content.appliedFilters.default_)
}BBV.each(controller.content.appliedFilters.params,function(name,val){qs.push(val)
});
controller.feed.settings.data=qs.join("&")
};
SearchResultsController.prototype.setParam=function(param_){var controller=this,content=controller.content,param=parseParam(param_);
BBV.extend(content.appliedFilters.params,param);
return controller
};
SearchResultsController.prototype.load=function(){var controller=this,content=controller.content,model=content.model,view=content.view,searchTerm=BBV.utils.uri.builder(window.location.href).params.q;
model.datamedia=[];
$(".search-terms").text(searchTerm.replace(/\+/gi," "));
if(!content.view.initialized){var url,viewId;
if(window.location.hash.substr(1).toUpperCase()==="TV"){url=viewstates.ONLINE.url;
viewId="online"
}else{url=viewstates.TV.url;
viewId="tv"
}orion.util.oesp.get(url+"?q="+encodeURIComponent(searchTerm)+"&range=1-1",{success:function(data){view.counts(viewId,data.totalResults)
},error:function(){content.$.trigger("loaded")
}});
content.view.initialized=true;
controller.load()
}else{controller.setParam("q="+encodeURIComponent(searchTerm));
controller.setParam("range="+view.start+"-"+view.end);
controller.serializeParams();
controller.feed.settings.xhrId=content.view.element.attr("id");
controller.feed.update(view.currentview.url);
content.$.trigger("loading")
}};
SearchResultsController.prototype.getChannels=function(){var controller=this,content=controller.content,model=content.model,view=content.view;
orion.util.oesp.get($(content.root).attr("data-channels-url"),{xhrId:"oespChannels",success:function(data){content.stations=[];
$.each(data.channels,function(index,channel){$.each(channel.stationSchedules,function(index,station){var stationData={};
stationData.channelNumber=channel.channelNumber;
stationData.channelTitle=channel.title;
stationData.stationId=station.station.id;
stationData.stationTitle=station.station.title;
stationData.entitlements=station.station.entitlements;
content.stations.push(stationData)
})
})
}})
};
function SearchResults(elem,publisher){var self=this;
var url;
var hash=window.location.hash.substr(1).toUpperCase();
if(!hash){hash="ONLINE"
}url=viewstates[hash].url;
self.root=elem;
self.$=$(elem);
self.localStrings=orioni18n.searchResults;
self.model=new SearchResultsModel(self);
self.view=new SearchResultsView(self);
self.controller=new SearchResultsController(self,url);
self.appliedFilters={default_:readUrlString(url).query,params:{}};
self.view.handlers();
self.controller.load();
self.controller.getChannels()
}return SearchResults
})(jQuery);
BBV.namespace("orion.modules").TitleCard=orion.modules.TitleCard||(function($){var $sectionWrapper,$tabWrapper,$tabs,$sections;
var viewstates={GRID:{template:"TitleCardFeedGridItem",size:10},LIST:{template:"TitleCardFeedListItem",size:20}};
function TitleCard(elem){var self=this,model,view,$elem=$(elem);
if(!elem){throw new Error("Please provide an element to use for the TitleCard.")
}if(!(self instanceof TitleCard)){throw new Error("TitleCard called without new.")
}self.$=$elem;
self.model=model={};
self.view=view={root:elem,$:$elem};
self.currentview=(function(){var current=view.$.find(".view-toggle > li").has(".active").attr("class");
if(current){return viewstates[current.toUpperCase()]
}})();
self.initialize()
}TitleCard.prototype.initialize=function(){var self=this;
$mediaItemTitleCard=$("[data-module-type=MediaItemTitleCard]");
$sectionWrapper=self.$.children(".section");
$tabWrapper=self.$.find(".tabs");
$tabs=self.$.find(".tab");
$sections=$sectionWrapper.children(".section");
var activeTab=$tabs.filter(".active");
if(activeTab.length<1){activeTab=$tabs.eq(0);
self.activateTab(activeTab)
}orion.oesp.session.done(function(session){self.$.find(".feed-container").each(function(){var $feedContainer=$(this);
if(!$feedContainer.data("feedUrl")){$feedContainer.data("feedUrl",session.isAuthenticated()?$feedContainer.data("feedLoggedInUrl"):$feedContainer.data("feedLoggedOutUrl"))
}var fc=new orion.widgets.FeedContainer($feedContainer);
$tabs.each(function(){var $tab=$(this);
if($tab.find("a").attr("href")==="#"+$feedContainer.closest(".section:not(.content-list)").attr("id")){if($tab.hasClass("hidden")){orion.app.subscribe("feedLoaded:"+$feedContainer.data("feedUrl"),function(totalResults){if(totalResults){$tab.removeClass("hidden")
}})
}}})
});
self.$.find(".listing-container").each(function(){var $listingContainer=$(this);
var lc=new orion.widgets.ListingContainer($listingContainer)
});
self.bindEvents();
self.checkHashForTabId()
})
};
TitleCard.prototype.activateTab=function($tab){if(!(!!$tab.jquery&&$tab.length===1&&$tab[0].tagName==="LI"&&$tab.hasClass("tab"))){!!window.console&&!!console.error&&console.error("Problem details: ",!!$tab.jquery,$tab.length===1,$tab[0].tagName==="LI",$tab.hasClass("tab"));
throw new Error("Please provide a tab element to activate.")
}var self=this;
var idToActivate=$tab.find("a").attr("href");
var sectionToActivate=$sections.filter(idToActivate);
var tabsCurrentView=sectionToActivate.find(".active").parent().attr("class");
if($tabs.filter(".active").eq(0).is($tab)&&sectionToActivate.css("display")==="block"){return false
}if(sectionToActivate.length<1){throw new Error("Could not find a section associated with the selected tab.")
}$tabs.removeClass("active");
$tab.addClass("active");
$sections.hide();
sectionToActivate.show();
if(typeof tabsCurrentView!=="undefined"){self.currentview=viewstates[tabsCurrentView.toUpperCase()]
}facebook.parse();
return true
};
TitleCard.prototype.checkHashForTabId=function(){var self=this,$selectedTab=$tabs.filter(':has(a[href="'+location.hash+'"])');
if($selectedTab.length>0){self.activateTab($selectedTab)
}else{self.activateTab($tabs.eq(0))
}};
TitleCard.prototype.bindEvents=function(){var self=this;
$tabWrapper.undelegate(".tab","click").delegate(".tab","click",function(){var $this=$(this);
return self.activateTab($this)
});
self.$.find(".meta-info .cast a").click(function(){var $castContainer=$(this).closest(".cast");
if($castContainer.hasClass("less")){$castContainer.removeClass("less").addClass("more")
}else{$castContainer.removeClass("more").addClass("less")
}});
self.$.find(".view-toggle").delegate("a","click",function(e){var $this=$(this);
var $targetTab=$this.closest(".section");
var $viewToggle=$targetTab.find(".view-toggle");
var $feedContainer=$targetTab.find(".feed-container");
var currentview=$this.context.parentNode.getAttribute("class");
if(viewstates[currentview.toUpperCase()]!==self.currentview){self.currentview=viewstates[currentview.toUpperCase()];
$feedContainer.children().hide();
$feedContainer.find("."+currentview+"-view").show();
$viewToggle.find(".active").removeClass("active");
$this.addClass("active")
}return false
});
$(window).hashchange(function(){TitleCard.prototype.checkHashForTabId()
})
};
return TitleCard
})(jQuery);
BBV.namespace("orion.modules").MediaItemTitleCard=orion.modules.MediaItemTitleCard||(function($,Model,View){function MediaItemTitleCardModel(){var self=this;
Model.call(self)
}orion.util.inherits(MediaItemTitleCardModel,Model);
function MediaItemTitleCardView(model,elem,publisher){var self=this;
var $elem;
self.publisher=publisher;
View.call(self,model);
self.$=$(elem);
self.localStrings=orioni18n.mediaItemTitleCard;
self.monitorModel();
self.bindEvents();
self.setPlaylistState()
}orion.util.inherits(MediaItemTitleCardView,View);
MediaItemTitleCardView.formatPrice=function(price){var priceLength=price.length;
var whole,fraction;
if(priceLength<5){for(i=0;
i<5-priceLength;
i++){price="0"+price
}}whole=price.slice(0,price.length-4);
fraction=price.slice(price.length-4,price.length-2);
price=whole+","+fraction;
return price
};
MediaItemTitleCardView.prototype.monitorModel=function(){var self=this;
var model=self.model;
model.bind("change.offers change.rentalTime",$.proxy(self.renderOffers,self));
model.bind("change.inPlaylist",$.proxy(self.renderPlaylistLinks,self));
orion.app.recommendations.updateRatedItems(self.$)
};
MediaItemTitleCardView.prototype.bindEvents=function(){var self=this;
var assetId=self.$.data("media-id");
self.$.delegate(".offer-button-login","click",function(event){if($(event.target).closest("span").is(".disabled")){return
}self.publisher.trigger("requestDialog",{dialogName:"login",centerOn:self.$.get(0)});
return false
});
self.$.delegate(".offer-button-link","click",function(event){$buyButton=$(this);
self.trigger("purchase",{offerId:$buyButton.data("offer-id"),productId:$buyButton.data("product-id")});
return false
});
self.$.delegate(".playlists-wrapper .add","click",function(event){self.trigger("addToPlaylist");
return false
});
self.$.delegate(".playlists-wrapper .remove","click",function(event){self.trigger("removeFromPlaylist");
return false
});
self.$.delegate(".share-link","click",function(event){self.trigger("share");
orion.util.analytics.trackEvent("action",{pageName:"Engagement/Social/Share",channel:"Engagement/Social/Share",prop23:"Engagement",prop24:"Social",prop26:"Share",eVar32:assetId,events:"event9,event34"});
return false
})
};
MediaItemTitleCardView.prototype.renderOffers=function(){var self=this;
var model=self.model;
var offers=model.get("offers");
var rentalTime=model.get("rentalTime");
var loginRequired=model.get("loginToSeeOffers");
var offersContainer=self.$.find(".offers");
var viewModel={products:[],offers_link:BBV.settings.site.urls.offers.upcoming};
var html,i18nFor,i18nBuy;
var offerProducts=[];
var numberOfOffers=0;
offersContainer.empty();
orion.oesp.session.done(function(session){if((!rentalTime&&!loginRequired&&!offers)||session.hasEntitlement(model.mediaItem.entitlements)){return
}else{if(rentalTime){viewModel.rental_message=self.localStrings.tvodrentaltime;
viewModel.rental_time=new Date(rentalTime+$.now()).toLocaleString();
html=Mustache.to_html(orion.templates.RentalTime,viewModel)
}else{if(loginRequired){viewModel.i18n_buy=self.localStrings.buy;
viewModel.i18n_offers_head=self.localStrings.offers_heading_logged_out;
viewModel.i18n_offers_text=self.localStrings.offers_text_logged_out;
viewModel.i18n_offers_link=self.localStrings.offers_link_logged_out;
viewModel.show_login_button=true;
html=Mustache.to_html(orion.templates.Offers,viewModel)
}else{if(offers){$.each(offers,function(){var offer=$.isArray(this)?this[0]:this;
if(!offer.products||!offer.products.length){return
}offerProducts.push(offer.products[0])
});
if(offerProducts.length){i18nFor=self.localStrings["for"];
i18nBuy=self.localStrings.buy;
viewModel.i18n_offers_head=self.localStrings.offers_heading;
viewModel.i18n_offers_text=self.localStrings.offers_text;
viewModel.i18n_offers_link=self.localStrings.offers_link
}else{viewModel.i18n_buy=self.localStrings.buy;
viewModel.i18n_offers_head=self.localStrings.offers_heading_not_entitled;
viewModel.i18n_offers_text=self.localStrings.offers_text_not_entitled;
viewModel.i18n_offers_link=self.localStrings.offers_link_not_entitled;
viewModel.show_login_button=true;
viewModel.not_entitled=true
}$.each(offerProducts,function(productIndex,product){if(!product.offers){log("MediaItemTitleCard:: product.offers is null - exiting rendering of offer",product);
return
}var rentalDays=product.rentalPeriodInSeconds/(60*60*24);
var rentalDuration=rentalDays+" "+self.localStrings[rentalDays>1?"days":"day"];
$.each(product.offers,function(offerIndex,offer){if(numberOfOffers<3){viewModel.products.push({name:product.title,currency:BBV.settings.currency[model.mediaItem.countryCode].symbol,price:MediaItemTitleCardView.formatPrice(offer.price),i18n_for:i18nFor,i18n_buy:i18nBuy,rentalDuration:rentalDuration,offerId:offer.id,productId:product.id});
numberOfOffers++
}else{return false
}})
});
html=Mustache.to_html(orion.templates.Offers,viewModel)
}}}}self.$.addClass("has-offers");
offersContainer.append(html).show();
self.adjustFacebookWidgetSize()
})
};
MediaItemTitleCardView.prototype.adjustFacebookWidgetSize=function(){var self=this;
var fbLike=self.$.find(".fb-like");
var infoWidth=self.$.find(".info").width();
if(fbLike.data("width")>infoWidth){fbLike.data("width",infoWidth);
fbLike.attr("data-width",infoWidth);
facebook.parse()
}};
MediaItemTitleCardView.prototype.setPlaylistState=function(){var self=this;
orion.Playlist.setState(".mediaitemtitlecard");
if($("[data-media-id]",".mediaitemtitlecard").is(".in-playlist")){self.model.set("inPlaylist",true)
}};
MediaItemTitleCardView.prototype.renderPlaylistLinks=function(){var self=this;
var add=self.$.find(".playlists-wrapper .add");
var remove=self.$.find(".playlists-wrapper .remove");
if(self.model.get("inPlaylist")){add.hide();
remove.show()
}else{add.show();
remove.hide()
}};
MediaItemTitleCardView.prototype.showSocialOverlay=function(){var self=this;
var content=$(".video-social-overlay");
var social=orion.app.dialogManager.getDialog("video-social-overlay");
social.setHtmlContent(content);
social.contentArea.find(".video-social-overlay").show();
social.centerOn(window);
social.show();
$(".addthis_toolbox").delegate("a","click",function(e){$(".dialog").hide()
});
return self
};
function MediaItemTitleCard(elem,publisher){var self=this;
var mediaItemId=$(elem).data("media-id");
self.publisher=publisher;
if(!(self instanceof MediaItemTitleCard)){return new MediaItemTitleCard(elem)
}self.model=new MediaItemTitleCardModel();
self.view=new MediaItemTitleCardView(self.model,elem,publisher);
self.monitorView();
$.when(orion.oesp.session,orion.oesp.mediaItemEndpoint.requestMediaItem(mediaItemId)).done($.proxy(self.configureModel,self))
}MediaItemTitleCard.prototype.monitorView=function(){var self=this;
var view=self.view;
var model=self.model;
view.bind("purchase",function(event,purchaseMap){var id=purchaseMap.offerId;
var productId=purchaseMap.productId;
var tvodDialog=orion.app.dialogManager.getDialog("tvod");
orion.util.analytics.set.offerId(id);
var productSet=model.offers;
var product,isOnlyProduct,offer,item;
$.each(productSet,function(){var products;
if(this.products){products=this.products;
isOnlyProduct=true
}else{products=this[0].products
}if(!products){return
}$.each(products,function(){product=this;
$.each(this.offers,function(){if(this.id==id){offer=this;
return
}});
if(offer){return
}});
if(offer||isOnlyProduct){return false
}});
if(!offer){log("not able to find matching offer")
}var rentalDays=product.rentalPeriodInSeconds/(60*60*24);
var rentalDuration=rentalDays+" "+self.view.localStrings[rentalDays>1?"days":"day"];
item={offerId:id,productId:productId,productIds:model.mediaItem.currentProductIds,isAdult:model.mediaItem.isAdult,tvodProductIds:model.mediaItem.currentTvodProductIds,title:product.title,secondary_title:offer.name||"",cost:BBV.settings.currency[model.mediaItem.countryCode].symbol+" "+MediaItemTitleCardView.formatPrice(offer.price),rental_duration:rentalDuration};
tvodDialog.setItem(item);
tvodDialog.centerOn("window");
tvodDialog.show();
tvodDialog.setFocus();
return false
});
orion.app.subscribe("playlistUpdated",function(e){if(e.mediaId===model.mediaItem.id){if(e.action==="remove"){model.set("inPlaylist",false)
}else{if(e.action==="add"){model.set("inPlaylist",true)
}}}});
view.bind("addToPlaylist",function(){orion.app.trigger("updatePlaylist",{action:"add",mediaId:model.mediaItem.id})
});
view.bind("removeFromPlaylist",function(){orion.app.trigger("updatePlaylist",{action:"remove",mediaId:model.mediaItem.id})
});
view.bind("share",function(){view.showSocialOverlay()
})
};
MediaItemTitleCard.prototype.configureModel=function(session,mediaItem){var self=this;
var model=self.model;
var purchases=orion.oesp.purchaseEndpoint;
var offersRequest;
var activePurchasesRequest;
model.set("mediaItem",mediaItem);
if(mediaItem.isTVOD()){if(session.isAuthenticated()){offersRequest=purchases.requestSetOfProductOffers(mediaItem.currentTvodProductIds);
offersRequest.done(function(idx,offers){model.set("offers",arguments)
});
activePurchasesRequest=purchases.requestActivePurchases();
activePurchasesRequest.done(function(activePurchases){var timeRemaining=0;
var purchases=activePurchases.products;
var i,length=purchases.length;
for(i=0;
i<length&&!timeRemaining;
i++){if(mediaItem.hasCurrentTvodProductId(purchases[i].id)){if(purchases[i].isEntitled){timeRemaining=purchases[i].entitlementEnd-$.now()
}}}if(timeRemaining){model.set("rentalTime",timeRemaining)
}})
}else{model.set("loginToSeeOffers",true)
}}};
return MediaItemTitleCard
})(jQuery,orion.util.mvc.Model,orion.util.mvc.View);
BBV.namespace("orion.modules").LiveChannels=orion.modules.LiveChannels||(function($){function LiveChannelsModel(view,collection){var self=this;
self.view=view;
self.collection=collection;
self.liveChannels=[];
return self
}LiveChannelsModel.prototype.getLiveChannels=function(){var self=this;
$.each(self.collection,function(){var model={channelID:this.id,channelNumber:this.channelNumber,channelUrl:this.getChannelUrl(),stationID:this.stationSchedules[0].station.id,title:this.stationSchedules[0].station.title,entitlements:"[",stationImg:{}};
$.each(this.stationSchedules[0].station.entitlements,function(idx,entitlement){if(idx===0){model.entitlements+="'"+entitlement+"'"
}else{model.entitlements+=",'"+entitlement+"'"
}});
model.entitlements+="]";
$.each(this.stationSchedules[0].station.images,function(){if(this.assetType==="station-logo-medium"){model.stationImg={url:this.url,width:this.width,height:this.height}
}});
self.liveChannels.push(model)
});
return self
};
function LiveChannels(elem){var self=this;
self.$=$(elem);
self.channelItemSelector=".channel-list > .channel-item";
self.$list=self.$.find(".channel-list");
self.localStrings=orioni18n.liveChannels;
self.interval=60000*5;
self.listingsRangeInHours=3;
self.animationSettings={hideSpeed:300,showSpeed:300};
self.eventsBound=false;
self.stationListings={};
self.initialize()
}LiveChannels.prototype.initialize=function(){var self=this;
var getChannels=orion.oesp.channelEndpoint.requestChannels({byLiveStream:true,sort:"channelNumber"});
self.loader=self.$.loader({element:{overlay:"<div/>"},elementClass:"grid-loading",flow:["append"],location:"outside",minheight:95,target:".channel-list",img:{top:"45px"}});
self.$.trigger("loading");
getChannels.done(function(response){self.model=new LiveChannelsModel(self,response.channels);
self.model.getLiveChannels();
self.render()
})
};
LiveChannels.prototype.render=function(){var self=this;
var $container=$(".channel-list");
$tmp=$(Mustache.to_html(orion.templates.LiveChannels,{channels:self.model.liveChannels}));
$container.html($tmp);
self.$.trigger("loaded");
self.stationIds=self.getChannelsDataAsArray("station-id");
self.heartbeat();
self.bindTooltipEvents()
};
LiveChannels.prototype.addLocks=function(){var self=this;
orion.oesp.session.done(function(session){$(self.channelItemSelector).each(function(){if(!session.hasEntitlement(someArray)){var $item=$(this)
}})
})
};
LiveChannels.prototype.heartbeat=function(){var self=this;
self.updateModel();
self.timer=setInterval(function heartbeatInterval(){self.updateModel()
},self.interval)
};
LiveChannels.prototype.bindEvents=function(){var self=this;
self.bindGenreFilterEvents()
};
LiveChannels.prototype.updateModel=function(){if(this.lastRequest){var nowMs=(new Date()).getTime();
var msElapsedSinceLastRequest=nowMs-this.lastRequest.getTime();
var listingsRangeInMs=this.listingsRangeInHours*3600000;
log("LiveChannels.updateModel -> msElapsedSinceLastRequest: ",msElapsedSinceLastRequest);
log("LiveChannels.updateModel -> listingsRangeInMs: ",listingsRangeInMs);
if(msElapsedSinceLastRequest>listingsRangeInMs){this.requestModel()
}else{this.updateView()
}}else{this.lastRequest=new Date();
this.requestModel()
}};
LiveChannels.prototype.requestModel=function(){var self=this;
self.listingEndpoint=new orion.oesp.req.ListingEndpoint();
function roundToNearest30Minutes(d){d.setMinutes(Math.floor(d.getMinutes()/30)*30);
d.setSeconds(0);
d.setMilliseconds(0)
}var endTime=new Date();
var startTime=new Date();
roundToNearest30Minutes(endTime);
roundToNearest30Minutes(startTime);
startTime.setHours(startTime.getHours()+self.listingsRangeInHours);
var chunkSize=14;
var chunkingIds=self.stationIds;
(function recursiveRequesting(){if(chunkingIds.length>0){var chunkedIds=chunkingIds.splice(0,chunkSize).join("|");
var listingResponse=self.listingEndpoint.requestListings({byStartTime:"~"+startTime.getTime(),byEndTime:endTime.getTime()+"~",sort:"startTime|asc",byStationId:chunkedIds});
listingResponse.done(function listingRequestDone(data){self.populateListingsData(data);
self.updateGenresData();
self.updateView();
if(!self.eventsBound){self.bindEvents();
self.eventsBound=true
}recursiveRequesting()
})
}else{self.lastRequest=new Date()
}})()
};
LiveChannels.prototype.getListingDuration=function(listing){var self=this;
var duration;
if(listing.program&&listing.startTime&&listing.endTime){return BBV.utils.date(listing.startTime).format("H:m")+"-"+BBV.utils.date(listing.endTime).format("H:m")
}else{return undefined
}};
LiveChannels.prototype.updateView=function(){var self=this;
self.updateTooltips();
self.updateGenresSelect()
};
LiveChannels.prototype.sortTitles=function(unsortedArray){return(unsortedArray.sort(function(a,b){if(a[0]==b[0]){return 0
}if(a[0]>b[0]){return 1
}else{return -1
}}))
};
LiveChannels.prototype.updateGenresSelect=function(){var self=this;
var genreId;
var genresArray=[];
$select=$("#live-channels-genres-select");
$select.empty();
$select.append('<li class="genre-item" data-category-id="all"><a class="genre-link" href="#">'+self.localStrings.selectall+"</a></li>");
for(genreId in self.genres){var genre=[];
if(self.genres[genreId].hasOwnProperty("title")){genre.push(self.genres[genreId].title);
genre.push(genreId)
}genresArray.push(genre)
}self.sortTitles(genresArray);
for(var i=0;
i<genresArray.length;
i++){$select.append('<li class="genre-item" data-category-id="'+genresArray[i][1]+'"><a class="genre-link" href="#'+genresArray[i][1]+'">'+genresArray[i][0]+"</a></option>")
}};
LiveChannels.prototype.updateTooltips=function(){var self=this;
var $elem,$tip,tmpl,channelTitle,hasNextListing,nowListing,nextListing,model,stationId,nowIdx;
for(stationId in self.stationListings){if(self.stationListings.hasOwnProperty(stationId)){nextListing={};
nowListing={};
nowIdx=0;
if(self.stationListings[stationId].length){for(var i=0;
i<self.stationListings[stationId].length;
i++){var currentEndTime=self.stationListings[stationId][i].endTime;
var currentStartTime=self.stationListings[stationId][i].startTime;
var now=(new Date()).getTime();
if(currentStartTime<=now&&currentEndTime>now){nowIdx=i;
break
}}}if(self.stationListings[stationId].length>nowIdx+1){nowListing=self.stationListings[stationId][nowIdx];
nextListing=self.stationListings[stationId][nowIdx+1]
}else{if(self.stationListings[stationId].length===nowIdx+1){nowListing=self.stationListings[stationId][nowIdx]
}}$elem=$("#station-"+nowListing.stationId);
$elem.addClass("ready");
$tip=$elem.find(".channel-tooltip");
channelTitle=$elem.find("a").attr("title");
if(nowListing.program){toolTipModel={title:nowListing.program&&nowListing.program.title,description:nowListing.program&&nowListing.program.description,duration:self.getListingDuration(nowListing),genreText:self.localStrings.genre,episodeText:self.localStrings.episode,seasonText:self.localStrings.season,onnextText:self.localStrings.onnext,seasonNumber:nowListing.program&&nowListing.program.seasonNumber,seasonEpisodeNumber:nowListing.program&&nowListing.program.seasonEpisodeNumber,channelTitle:channelTitle,nextTitle:nextListing.program&&nextListing.program.title,nextDuration:self.getListingDuration(nextListing)};
tmpl=Mustache.to_html(orion.templates.LiveChannelsTooltip,toolTipModel);
$tip.html(tmpl)
}else{if(!nowListing.program&&$elem){toolTipModel={title:nowListing.program&&nowListing.program.title,tba_text:orioni18n.liveChannels.tba};
$elem.data("no-data","1");
tmpl=Mustache.to_html(orion.templates.LiveChannelsTooltipEmpty,toolTipModel);
$tip.html(tmpl)
}}}}};
LiveChannels.prototype.populateListingsData=function(data){var self=this;
var li;
for(li=0;
li<data.listings.length;
li++){var listing=data.listings[li];
var listingStation=listing.stationId;
if(self.stationListings[listingStation]===undefined){self.stationListings[listingStation]=[]
}self.stationListings[listingStation].push(listing)
}};
LiveChannels.prototype.updateGenresData=function(){var self=this;
var listing,program,ci,listingCategories,category,stationId;
self.genres={};
for(stationId in self.stationListings){if(self.stationListings.hasOwnProperty(stationId)){if(self.stationListings[stationId].length>0){listing=self.stationListings[stationId][0];
if(listing.hasOwnProperty("program")&&listing.program.hasOwnProperty("categories")){listingCategories=listing.program.categories;
for(ci=0;
ci<listingCategories.length;
ci++){category=listingCategories[ci];
if(!self.genres.hasOwnProperty(category.id)&&BBV.settings.i18n.genreMap.hasOwnProperty(category.id)&&BBV.settings.i18n.genreMap[category.id].parentId=="null"){self.genres[category.id]=BBV.settings.i18n.genreMap[category.id]
}}}}}}};
LiveChannels.prototype.stationListingHasCategory=function(stationId,categoryId){var self=this;
var ci,categories;
var stationsListings=self.stationListings[stationId];
if(stationsListings.length>0&&stationsListings[0].hasOwnProperty("program")){if(!stationsListings[0].program.hasOwnProperty("categories")){return false
}categories=stationsListings[0].program.categories;
for(ci=0;
ci<categories.length;
ci++){if(categories[ci].hasOwnProperty("id")){if(categories[ci].id==categoryId){return true
}}}}return false
};
LiveChannels.prototype.filterChannelsByGenre=function(categoryId){var self=this;
var stationId,listing;
if(categoryId=="all"){$(self.channelItemSelector).show()
}else{var stationIds=[];
for(stationId in self.stationListings){stationIds.push(stationId);
if(self.stationListings.hasOwnProperty(stationId)){if(!self.stationListingHasCategory(stationId,categoryId)){$("#station-"+stationId).hide()
}else{$("#station-"+stationId).show()
}}}self.$list.each(function(){var $this=$(this);
if(!BBV.inArray($this.data("stationId"),stationIds)){log("removing channel with no genre");
$this.hide()
}})
}};
LiveChannels.prototype.bindGenreFilterEvents=function(){var self=this;
var categoryId;
var $currentSort=$(".current");
var $select=$("#live-channels-genres-select");
self.$.delegate(".genre-item","click",function(event){var $item=$(this);
categoryId=$item.data("category-id");
$currentSort.html((categoryId=="all")?self.localStrings.selectall:BBV.settings.i18n.genreMap[categoryId].title);
if(categoryId){self.filterChannelsByGenre(categoryId)
}})
};
LiveChannels.prototype.bindTooltipEvents=function(){var self=this;
self.$.on("mouseenter",self.channelItemSelector+".ready",function(event){var $elem=$(this);
var $tip=$elem.find(".channel-tooltip").clone().show();
self.$list.addClass("hover");
$elem.addClass("hover");
if(!self.dialog){self.dialog=orion.app.dialogManager.getDialog("LiveChannelsToolTip");
self.dialog.$.find(".close-dialog").hide()
}self.dialog.setHtmlContent($tip);
self.dialog.pointTo(this);
self.dialog.show()
});
self.$.on("mouseleave",self.channelItemSelector+".ready",function(event){var $elem=$(this);
self.$list.removeClass("hover");
$elem.removeClass("hover");
if(self.dialog){self.dialog.hide()
}})
};
LiveChannels.prototype.getChannelsDataAsArray=function(dataKey){var self=this;
var vals=[];
var channelElems=$(self.channelItemSelector);
channelElems.each(function(){var item=this;
var $current=$(item);
var dataVal=$current.data(dataKey);
if(dataVal){vals.push(dataVal)
}});
return vals
};
return LiveChannels
})(jQuery);
BBV.namespace("orion.modules").NetworkCard=orion.modules.NetworkCard||(function($){function NetworkCard(elem){var self=this;
self.$=$(elem);
self.setBackground()
}NetworkCard.prototype.setBackground=function(){var self=this;
var backgroundUrl=self.$.data("background");
if(backgroundUrl&&backgroundUrl.length>0){self.backgroundContainer=$("#backgrounds-div-container").css("background-image","url("+backgroundUrl+")")
}};
return NetworkCard
})(jQuery);
BBV.namespace("orion.modules").ChannelCard=orion.modules.ChannelCard||(function($){function ChannelCard(elem,publisher){this.$=$(elem);
this.elem=elem;
this.bindEvents(publisher);
this.getData()
}ChannelCard.prototype.bindEvents=function(publisher){publisher.subscribe("channelSelected",$.proxy(this.channelSelected,this))
};
ChannelCard.prototype.getData=function(){var self=this;
var channelId=self.$.data("channel-id");
var getChannel=orion.oesp.channelEndpoint.requestChannel(channelId);
var dataLoaded=$.Deferred();
getChannel.done(function(channel){self.model={channelId:channelId,stationId:channel.stationSchedules[0].station.id,providerId:channel.stationSchedules[0].station.providerId,hasLiveStream:channel.hasLiveStream,title:channel.stationSchedules[0].station.title,description:channel.stationSchedules[0].station.description,tvGuidePath:self.$.data("tvguide-path"),dataFeedUrl:self.$.data("feed-url"),fbLinkUrl:document.location.href,routes:BBV.settings.oespRoutes,i18nChannelCard:orioni18n.channelCardListing,i18nChannelCardFeed:orioni18n.channelCardFeed};
$.each(channel.stationSchedules[0].station.images,function(){if(this.assetType==="station-logo-large"){self.model.logo={url:this.url,width:this.width,height:this.height}
}if(this.assetType==="station-titlecard-background"){self.model.background=this.url
}});
self.render();
dataLoaded.resolve()
});
return dataLoaded.promise()
};
ChannelCard.prototype.render=function(){var self=this;
$tmp=$(Mustache.to_html(orion.templates.ChannelCard,self.model));
$(self.elem).html($tmp);
new orion.modules.TitleCard(self.elem);
facebook.parse(self.elem)
};
var jqxhr=null;
ChannelCard.prototype.channelSelected=function(e){var self=this,stationObj={id:e.channel,title:e.channelName,hasLiveStream:true},url=orion.modules.EPG.TemplateHelperMethods.channels.getUrl(stationObj);
log("Updating channel card...",arguments);
self.model.fbLinkUrl=url;
self.$.data("channel-id",e.channel);
self.getData()
};
return ChannelCard
})(jQuery);
BBV.namespace("orion.modules.EPG").MVC=orion.modules.EPG.MVC||(function($){var MVC={Model:{publish:function(name,args_){var model=this,args=args_||[],params=(BBV.isArray(args))?args:[args];
if(name&&model.subscribers[name]){model.subscribers[name].apply(model,args)
}return model
},subscribe:function(name,fn){var model=this;
if(model.subscribers[name]){BBV.error("A subscriber with that name already exists and will be overwritten.").warn()
}model.subscribers[name]=fn;
return model
},subscribers:{},unsubscribe:function(name){var model=this;
if(model.subscribers[name]){delete model.subscribers[name]
}}},Controller:{clearParams:function(){var controller=this;
controller.appliedFilters.params={};
return controller
},removeParam:function(param_){var controller=this,param=orion.modules.EPG.TemplateHelperMethods.parseParam(param_);
BBV.each(controller.appliedFilters.params,function(name,value){if(controller.appliedFilters.params[name]){delete controller.appliedFilters.params[name]
}});
return controller
},serializeParams:function(){var controller=this,qs=[];
if(controller.appliedFilters.default_){qs.push(controller.appliedFilters.default_)
}BBV.each(controller.appliedFilters.params,function(name,val){qs.push(val)
});
controller.query.data=qs.join("&")
},setParam:function(param_){var controller=this,param=orion.modules.EPG.TemplateHelperMethods.parseParam(param_);
BBV.extend(controller.appliedFilters.params,param);
return controller
}}};
return MVC
})(jQuery);
BBV.namespace("orion.modules.EPG").Favorite=orion.modules.EPG.Favorite||(function($){function Favorite(channelID){this.id=channelID;
this.online=BBV.user().isLoggedIn
}Favorite.prototype={constructor:Favorite,save:function(elem,fn){var f=this;
BBV.ajax.load(orion.modules.EPG.FavoriteManager.endpoint+"?_method=PUT",{type:"POST",data:f.format(),success:fn})
},format:function(){var f=this,data={favouriteChannels:[]},cookie=[];
if(f.online){BBV.each(orion.modules.EPG.FavoriteManager.favorites,function(key,favorite){data.favouriteChannels.push({channelId:favorite.id})
});
return BBV.json.serialize(data)
}else{BBV.each(orion.modules.EPG.FavoriteManager.favorites,function(key,favorite){cookie.push(favorite.id)
});
return cookie
}}};
return Favorite
})(jQuery);
BBV.namespace("orion.modules.EPG").FavoriteManager=orion.modules.EPG.FavoriteManager||(function($){var display=[],channelIDs=[];
var defaultGenreFilter=orion.modules.EPG.defaultGenreFilter;
function FavoriteManager(options){if(!options||!options.url){throw {name:"MissingParameter",message:"URL is a required parameter"}
}this.url=FavoriteManager.endpoint=options.url;
this.favoritesContainer=options.favoritesContainer||null;
this.channelsContainer=options.channelsContainer
}FavoriteManager.prototype.add=function(_this){var self=this;
var $this=$(_this);
var $wrapper=$this.closest("dl");
var stationID=$wrapper.attr("id");
var channelID=$wrapper.data("channel-id");
var channelName=$wrapper.data("channel-name");
var sort=$wrapper.attr("data-sort");
$wrapper.removeClass("current");
FavoriteManager.favorites[sort]={dom:$wrapper.attr("id",stationID).get(0),id:channelID};
channelIDs.push(channelID);
FavoriteManager._length+=1;
(new orion.modules.EPG.Favorite(channelID)).save($this,function(){$wrapper.find(".favorite").addClass("active");
self.render()
});
orion.util.analytics.trackEvent("action",{pageName:"TV Guide/Add favorite channel",channel:"TV Guide/Grid/Add favorite channel",prop23:"TV Guide",prop24:"Grid",prop26:"Add favorite channel",eVar43:channelID,eVar44:channelName,events:"event9,event46"});
return false
};
FavoriteManager.prototype.collate=function(){var self=this,keys=[];
display=[];
BBV.each(FavoriteManager.favorites,function(key,val){keys.push(key)
});
keys.sort(function numericSortAsc(a,b){return parseInt(a,10)-parseInt(b,10)
});
BBV.each(keys,function(idx,val){if(FavoriteManager.favorites[val].domDetails){self.setActiveListing(FavoriteManager.favorites[val]);
display.push(FavoriteManager.favorites[val].dom);
display.push(FavoriteManager.favorites[val].domDetails)
}else{display.push(FavoriteManager.favorites[val].dom)
}});
return self
};
FavoriteManager.prototype.setActiveListing=function(channel){var activeListingId=$(channel.domDetails).attr("data-listing-id");
var $activeChannel=$(channel.dom);
var $activeListing=$activeChannel.find('li.listing[data-listing-id="'+activeListingId+'"]');
$activeChannel.addClass("details");
$activeListing.addClass("active")
};
FavoriteManager.prototype.getFavorites=function(){var self=this;
var defer=new $.Deferred();
$.when(orion.oesp.session).done(function(session){if(session.isAuthenticated()){BBV.utils.cookie.remove("favorites");
BBV.ajax.load(FavoriteManager.endpoint,{type:"GET",success:function(_favorites){BBV.each(_favorites.favouriteChannels,function(idx,itm){channelIDs.push(itm.channelId)
});
FavoriteManager._length=channelIDs.length;
defer.resolve()
}})
}});
return defer
};
FavoriteManager.prototype.load=function(){var self=this;
var favoritesRequest=self.getFavorites();
favoritesRequest.done(function(){self.render();
BBV.events.trigger("favoritesComplete")
})
};
FavoriteManager.prototype.parse=function(_favorites){var ids=_favorites;
BBV.each(ids,function(idx,itm){var d=$("#station-"+itm)
})
};
FavoriteManager.prototype.render=function(){var self=this,$wrapper,stationID,sort,channelID,$this;
FavoriteManager.favorites={};
BBV.each(channelIDs,function(idx,itm){$wrapper=$('dl[data-channel-id="'+itm+'"]');
$programDetails=$('.program-details-wrap[data-channel-id="'+itm+'"]');
$wrapper.each(function(){$this=$(this);
stationID=$this.attr("id");
$this.find(".favorite").addClass("active");
channelID=itm;
sort=$this.attr("data-sort");
FavoriteManager.favorites[sort]={dom:$this.attr("id",stationID).get(0),id:channelID};
if($programDetails.length){FavoriteManager.favorites[sort].domDetails=$programDetails.get(0)
}})
});
self.collate();
self.favoritesContainer.html(display);
self.show();
return self
};
FavoriteManager.prototype.show=function(){if(!defaultGenreFilter()){$(".channel-listing",".favorite-list").show()
}return this
};
FavoriteManager.prototype.remove=function(_this){var self=this;
var $this=$(_this);
var $favoriteEl=$this.closest(".favorite");
var $wrapper=$this.closest("dl");
var channelID=$wrapper.data("channel-id");
var channelName=$wrapper.data("channel-name");
var stationID=$wrapper.attr("id").match(/station\-[0-9]+/gi);
var favoriteSort=$wrapper.attr("data-sort");
delete FavoriteManager.favorites[favoriteSort];
channelIDs=$.grep(channelIDs,function(value){return value!=channelID
});
FavoriteManager._length-=1;
(new orion.modules.EPG.Favorite(channelID)).save($this,function(){$wrapper.removeClass("current").find(".favorite").removeClass("active");
self.insert($wrapper);
self.render()
});
orion.util.analytics.trackEvent("action",{pageName:"TV Guide/Remove favorite channel",channel:"TV Guide/Grid/Remove favorite channel",prop23:"TV Guide",prop24:"Grid",prop26:"Remove favorite channel",eVar43:channelID,eVar44:channelName,events:"event9,event47"});
return false
};
FavoriteManager.prototype.insert=function($element){var self=this;
var favoriteSort=$element.data("sort");
var $channels=$(self.channelsContainer.children(".channel-listing"));
$.each($channels,function(index,element){var channelSort=$(element).data("sort");
var nextSort;
if(index+1<$channels.length){nextSort=$($channels[index+1]).data("sort")
}if(favoriteSort<channelSort){self.channelsContainer.prepend($element);
return false
}else{if(favoriteSort>channelSort&&typeof(nextSort)!=="undefined"&&favoriteSort<nextSort){$(element).after($element);
return false
}else{if(favoriteSort>channelSort&&typeof(nextSort)==="undefined"){self.channelsContainer.append($element);
return false
}}}})
};
FavoriteManager._length=0;
FavoriteManager.favorites={};
FavoriteManager.endpoint=null;
return FavoriteManager
})(jQuery);
BBV.namespace("orion.modules.EPG").RemoteBookings=orion.modules.EPG.RemoteBookings||(function($){function RemoteBookings(publisher){var self=this;
self.publisher=publisher;
self.$epg=$(".channel-guide");
self.url=self.$epg.data("module-bookings-url");
self.localStrings=orioni18n.EPG;
self.dvrStatus=$.Deferred()
}RemoteBookings.prototype.initialize=function(){var self=this;
if(BBV.user().isLoggedIn){new orion.modules.EPG.RemoteBookingsManager(self.publisher);
$.when(self.getProfile()).done(function(){self.triggerSettings();
self.getDvrStatus()
}).fail(function(data){log("RemoteBookings.initialize -> error on getProfile");
log(" -> data: ",data);
self.getDvrStatus()
})
}return self
};
RemoteBookings.prototype.delegate=function(selector,delegateSelectors){var self=this;
self.selector=selector;
self.delegateSelectors=delegateSelectors.join(", ");
self.handlers()
};
RemoteBookings.prototype.handlers=function(){var self=this;
$(self.selector).on("click",self.delegateSelectors,function(e){log("RemoteBookings.onClick -> clicked e.target: ",e.target);
e.preventDefault();
self.addDataToModals(e);
self.showModals(e)
});
return self
};
RemoteBookings.prototype.addDataToModals=function(e){var self=this;
if($(e.target).is("#dvr-settings-link")){$("#dvr-settings").data("trigger",e.target);
$("#dvr-booking").data("listing-id","").data("trigger","").data("show","").data("channel","")
}else{var $elem=$(e.target).closest(".program-details-wrap");
$("#dvr-settings").data("trigger","");
$("#dvr-booking").data("listing-id",$elem.data("listing-id")).data("trigger",e.target).data("show",$elem.find(".description h3").text()).data("channel",$elem.data("channel-name"));
$("#booking-error").data("listing-id",$elem.data("listing-id")).data("trigger",e.target).data("show",$elem.find(".description h3").text()).data("channel",$elem.data("channel-name"))
}};
RemoteBookings.prototype.showModals=function(e){var self=this;
if(!BBV.user().isLoggedIn){self.publisher.trigger("requestDialog",{dialogName:"login",pointTo:{target:$(e.target),direction:"down"}})
}else{if($(e.target).is("#dvr-settings-link")||$("body.no-dvr-enabled").length){self.publisher.trigger("requestDialog",{dialogName:"dvr-settings",centerOn:"window"})
}else{self.publisher.trigger("requestDialog",{dialogName:"dvr-booking",centerOn:"window",destroyOnClose:true})
}}};
RemoteBookings.prototype.getProfile=function(){var self=this,dfd=$.Deferred();
orion.util.oesp.get(self.url+"/profile/",{success:function(data){self.profile=data;
dfd.resolve()
},error:function(data){self.profile={};
dfd.reject(data)
}});
return dfd.promise()
};
RemoteBookings.prototype.triggerSettings=function(){var self=this;
if(window.location.hash=="#dvr"){$("#dvr-settings").data("trigger",$("#dvr-settings-link"));
$("#dvr-booking").data("listing-id","").data("trigger","").data("show","").data("channel","");
self.publisher.trigger("requestDialog",{dialogName:"dvr-settings",centerOn:"window",destroyOnClose:true})
}};
RemoteBookings.prototype.getDvrStatus=function(){var self=this;
if(self.profile.boxes){self.hasEnabledDvr=self.profile.boxes.length?true:false;
self.hasRecordingDvr=true;
self.hasReminderDvr=true
}else{self.hasEnabledDvr=false;
self.setRecordingCapability(false);
self.setReminderCapability(false)
}self.setDvrStatus();
return self.dvrStatus.promise()
};
RemoteBookings.prototype.setDvrStatus=function(){var self=this;
if(!self.hasEnabledDvr){$("body").addClass("no-dvr")
}if(self.profile.isAccountEnabled){$("body").addClass("dvr-enabled")
}else{$("body").addClass("no-dvr-enabled")
}if(self.profile.boxes){$.each(self.profile.boxes,function(idx,box){if(self.profile.defaultSmartCardId!==box.smartCardId){return
}if(!box.isRemoteRecordingCapable){self.hasRecordingDvr=false;
self.setRecordingCapability(false)
}if(!box.isRemoteReminderCapable){self.hasReminderDvr=false;
self.setReminderCapability(false)
}})
}$("#dvr-settings").data("profile",self.profile);
self.dvrStatus.resolve()
};
RemoteBookings.prototype.setRecordingCapability=function(isCapable){if(!isCapable){$("body").addClass("no-recording-capable")
}};
RemoteBookings.prototype.setReminderCapability=function(isCapable){if(!isCapable){$("body").addClass("no-reminder-capable")
}};
RemoteBookings.prototype.pollingInitialized=false;
RemoteBookings.prototype.getRemoteBookings=function(){var self=this;
self.dvrStatus.done(function(){if(self.hasRecordingDvr){self.publisher.trigger("getRemoteBookings","recordings")
}if(self.hasReminderDvr){self.publisher.trigger("getRemoteBookings","reminders")
}})
};
return RemoteBookings
})(jQuery);
BBV.namespace("orion.modules.EPG").RemoteBookingsManager=orion.modules.EPG.RemoteBookingsManager||(function($){function RemoteBookingsManager(publisher){if(!publisher){throw new Error("RemoteBookingsManager called without publisher.")
}var self=this;
self.publisher=publisher;
self.$epg=$(".channel-guide");
self.bookingTypes=["recordings","reminders"];
self.url=this.$epg.data("module-bookings-url");
self.pending={};
self.pollingDelay=5*60*1000;
if(!(self instanceof RemoteBookingsManager)){throw new Error("RemoteBookingsManager called without new.")
}$.each(self.bookingTypes,function(idx,bookingType){self.pending[bookingType]=[]
});
self.publisher.subscribe("getRemoteBookings",function(bookingType){if(!RemoteBookingsManager.pendingCnt){self.getRemoteBookings(bookingType)
}})
}RemoteBookingsManager.prototype.getRemoteBookings=function(bookingType){var self=this;
self.rBookings={};
orion.util.oesp.get(self.url+"/"+bookingType+"/",{cache:false,success:function(data){self.rBookings[bookingType]=data[bookingType]||false;
self.setStatus(bookingType)
},error:function(data){log("RemoteBookingsManager.getRemoteBookings -> error: ",data);
self.pending[bookingType]=[]
}})
};
RemoteBookingsManager.prototype.setStatus=function(bookingType){var self=this;
var remoteBookings=self.rBookings[bookingType];
var activeRecordings=[];
$.each(self.rBookings[bookingType],function(idx,remoteBooking){if(bookingType==="recordings"){activeRecordings.push(remoteBooking.listingId)
}var listingIsPending=$.inArray(remoteBooking.listingId,self.pending[bookingType])>=0,$listing=$("                li.listing[data-listing-id='"+remoteBooking.listingId+"'] .notifications,                div.program-details-wrap[data-listing-id='"+remoteBooking.listingId+"'] .user-functionality            ");
if(remoteBooking.status=="success"&&!$listing.is("."+bookingType+"-confirmed")){if(self.pending[bookingType].length&&listingIsPending){BBV.remove(self.pending[bookingType],$.inArray(remoteBooking.listingId,self.pending[bookingType]))
}$listing.each(function(idx,icon){$(icon).addClass(bookingType+"-confirmed");
$(icon).removeClass(bookingType+"-pending")
})
}else{if(remoteBooking.status=="failed"||remoteBooking.status=="failure"){if($("#booking-error").length&&$("#booking-error").data("listing-id")==remoteBooking.listingId){self.publisher.trigger("requestDialog",{dialogName:"booking-error",centerOn:"window",destroyOnClose:true});
var errorMsg=orioni18n.EPG.bookingErrors[remoteBooking.reason];
$("#booking-error .show").text($("#booking-error").data("show"));
$("#booking-error .channel").text($("#booking-error").data("channel"));
$("#booking-error .error").text(errorMsg)
}if(self.pending[bookingType].length&&listingIsPending){BBV.remove(self.pending[bookingType],$.inArray(remoteBooking.listingId,self.pending[bookingType]))
}$listing.each(function(idx,icon){$(icon).removeClass(bookingType+"-pending");
$(icon).addClass(bookingType+"-failed")
})
}else{if(remoteBooking.status=="pending"){if(!listingIsPending){self.pending[bookingType].push(remoteBooking.listingId)
}$listing.each(function(idx,icon){$(icon).removeClass(bookingType+"-failed");
$(icon).addClass(bookingType+"-pending")
})
}}}});
if(bookingType==="recordings"){$(".notifications.recordings-confirmed").each(function(){var listing=$(this).closest(".listing");
var listingId=listing.data("listing-id");
var isActive=$.inArray(listingId,activeRecordings)>-1;
if(!isActive){$('[data-listing-id="'+listingId+'"]').find(".notifications, .user-functionality").removeClass("recordings-confirmed")
}})
}if(self.pending[bookingType].length){RemoteBookingsManager.pendingCnt=self.pending[bookingType].length;
setTimeout(function(){self.getRemoteBookings(bookingType)
},self.pollingDelay)
}};
return RemoteBookingsManager
})(jQuery);
BBV.namespace("orion.modules.EPG").TemplateHelperMethods=orion.modules.EPG.TemplateHelperMethods||(function($){var defaultGenreFilter=orion.modules.EPG.defaultGenreFilter;
var timeFrameInHours=orion.modules.EPG.timeFrameInHours;
var keyTime=orion.modules.EPG.keyTime;
function runtimeToWidth(minutes){var slots=Math.ceil(minutes/5),pmbW=2,lngth=slots*keyTime.width-pmbW,limit=(timeFrameInHours*2)*(keyTime.increments*keyTime.width);
if(lngth>limit){lngth=limit
}return lngth
}function msToTime(time){var n=new Date(time),hours=n.getHours(),minutes=n.getMinutes();
return[(hours<10)?"0"+hours:+hours,":",(minutes<10)?"0"+minutes:+minutes].join("")
}var utilMethods={msToTime:msToTime,readUrlString:function(url){var keyValue=url.split("?");
return{url:keyValue[0],query:keyValue[1]}
},parseParam:function(p){var custom=/\}\{/,obj={},tmp_;
if(p&&custom.test(p)){tmp_=p.replace(/\}\{/,"}${");
tmp_=tmp_.split("$");
obj[tmp_[0]]=p
}else{if(p&&p.indexOf("=")>-1){tmp_=p.split("=");
obj[tmp_[0]]=p
}else{if(p){obj[p]=p
}}}return obj
},parseDateToStart:function(_time){var n=(BBV.type(_time)==="number")?new Date(_time):new Date();
n.setMinutes(Math.floor(n.getMinutes()/30)*30);
n.setSeconds(0);
n.setMilliseconds(0);
return n.getTime()
},channels:{formatChannel:function(channel){var lngth=3,toFormat=channel.toString(),l=toFormat.length;
for(;
l<lngth;
l++){toFormat="0"+toFormat
}return toFormat
},getImages:function(imgs){var active,inactive;
BBV.each(imgs,function(idx,val){if(val.assetType==="station-logo-medium"){active=val
}if(val.assetType==="station-logo-small"){inactive=val
}});
return{active:(active&&active.url)?active.url:"",inactive:(inactive&&inactive.url)?inactive.url:""}
},getUrl:function(station){var name=station.title||"",urlParts=[station.id,encodeURIComponent(name.replace(/\s/g,"-").replace(/\//g,"_"))],channels=BBV.settings.site.urls.channels;
if(station.hasLiveStream){urlParts.unshift(channels.live)
}else{urlParts.unshift(channels.vod)
}return urlParts.join("/")+".html"
}},listings:{checkIfAlreadyEnded:function(endTime){var now=+new Date();
var padding=1000*60*2;
var hasShowEnded=endTime-padding<now;
return(hasShowEnded)
},checkIfAlreadyStarted:function(startTime){var now=+new Date();
var padding=1000*60*2;
var hasShowStarted=startTime-padding<now;
return(hasShowStarted)
},checkIfLiveStream:function(hasLiveStream,startTime,endTime){var now=+new Date();
var isShowLive=(startTime<now&&endTime>now);
return(hasLiveStream&&isShowLive)
},genreHighlight:function(genres){var filter=defaultGenreFilter;
var genreList=this.getGenres(genres);
var genresSplit=genreList.split(" ");
var willFilter=(BBV.inArray(filter(),genresSplit)>-1);
return willFilter
},getBoxArtMedium:function(images){var img=false;
for(var i=0;
i<images.length;
i++){if(images[i].assetType==="boxart-medium"){img=images[i].url;
return img
}}return img
},getGenres:function(genres){var categories=[];
for(var i=0;
i<genres.length;
i++){categories.push(genres[i].id||"")
}return categories.join(" ")
},getStartEndTime:function(startTime,endTime){return msToTime(startTime)+"-"+msToTime(endTime)
},getUpcomingLink:function(title){var link=[BBV.settings.site.urls.search.tvresults,"?q="];
var title=title||"";
link.push(encodeURIComponent(title.replace(/\s/g,"+")));
return link.join("")
},getWidth:function(startTime,endTime,viewStart){var viewStop=(timeFrameInHours*1000*60*60)+viewStart;
var start=(startTime<viewStart)?viewStart:startTime;
var end=(endTime>viewStop)?viewStop:endTime;
var ms=end-start;
var runtime=ms/1000/60;
return runtimeToWidth(runtime)
}}};
return utilMethods
})(jQuery);
BBV.namespace("orion.modules.EPG").ChannelsMVC=orion.modules.EPG.ChannelsMVC||(function($){var utilMethods;
function ChannelModel(epg_){var model=this;
utilMethods=orion.modules.EPG.TemplateHelperMethods;
model.controller=epg_.channelController;
model.view=epg_.channelView;
model.originalRange={start:1,end:20};
model.range={start:model.originalRange.start,end:model.originalRange.end};
model.previousRange={};
model.channels={};
model.cache={};
ChannelModel.getCache=function(sort){return model.cache
};
return model
}BBV.extend(ChannelModel.prototype,orion.modules.EPG.MVC.Model,{constructor:ChannelModel,update:function(data){this.entryCount=data.entryCount;
this.totalResults=data.totalResults;
this.updateCache(data.channels);
this.updateRange();
BBV.events.trigger("channelsLoaded",data)
},updateRange:function(){var model=this;
if(this.totalResults>=model.range.end){model.previousRange={start:model.range.start,end:model.range.end};
model.range.start=model.range.end+1;
if(this.totalResults<=model.range.end+20){model.range.end=this.totalResults
}else{model.range.end+=20
}}},backupRange:function(){var model=this;
if(model.previousRange!==null){model.range.start=model.previousRange.start;
model.range.end=model.previousRange.end;
model.previousRange=null
}else{model.range={start:1,end:20}
}},resetRange:function(){this.range={start:21,end:40};
this.previousRange={start:1,end:20}
},updateCache:function(channels){var model=this;
model.channels={};
BBV.each(channels,function(index,channel){var station=channel.stationSchedules[0].station;
model.channels[station.id]=BBV.extend({channelId:channel.id,stationId:channel.stationSchedules[0].station.id,channelNumber:utilMethods.formatChannel(channel.channelNumber),stations:channel.stationSchedules,name:station.title,isHd:station.isHd,isLive:station.hasLiveStream,hasLiveStream:channel.hasLiveStream},utilMethods.channels);
if(model.cache[station.id]===undefined||model.cache[station.id].listingCache===undefined){model.cache[station.id]=model.channels[station.id]
}})
},getCachedArray:function(){var model=this;
var channelListing=[];
channelListing=model.sortChannels(model.cache);
return channelListing
},getCurrentArray:function(){var model=this;
var channelListing=[];
channelListing=model.sortChannels(model.channels);
return channelListing
},getFirstArray:function(useCache){var channelListing=[];
this.resetRange();
if(useCache){channelListing=this.sortChannels(this.cache)
}else{channelListing=this.sortChannels(this.channels)
}channelListing=channelListing.slice(this.previousRange.start-1,this.previousRange.end);
return channelListing
},sortChannels:function(channels){var channelListing=[];
BBV.each(channels,function(index,channel){channelListing.push(channel)
});
channelListing.sort(function(a,b){if(a.channelNumber<b.channelNumber){return -1
}if(a.channelNumber>b.channelNumber){return 1
}return 0
});
return channelListing
}});
function ChannelView(epg_,elem){var view=this;
view.$=epg_.$.find(".channel-guide-wrap").find(".grid-container");
view.$.loader({element:{append:"<dl/>"},elementClass:"grid-loading",flow:["append"],location:"inside",minheight:110,minwidth:923,target:".grid-container",img:{top:"55px"}})
}function ChannelController(epg_){var self=this;
self.epg=epg_;
self.model=epg_.channelModel;
self.view=epg_.channelView;
self.scrollInterval=100
}ChannelController.prototype={constructor:ChannelController,timer:null,requestChannels:function(){var self=this;
if(typeof(this.model.totalResults)=="undefined"||this.model.totalResults>=this.model.range.end){var request=orion.oesp.channelEndpoint.requestChannels({sort:"channelNumber",range:self.getRange()});
request.done(function(data){self.model.update(data)
})
}else{self.epg.$.triggerHandler("loaded");
self.view.$.triggerHandler("loaded")
}},requestGenres:function(){var self=this;
this.model.resetRange();
var request=orion.oesp.channelEndpoint.requestChannels({sort:"channelNumber",range:self.getPreviousRange()});
request.done(function(data){self.model.update(data)
})
},getRange:function(){var str=this.model.range.start+"-"+this.model.range.end;
return str
},getPreviousRange:function(){if(this.model.previousRange.start&&this.model.previousRange.end){var str=this.model.previousRange.start+"-"+this.model.previousRange.end;
this.model.backupRange();
return str
}else{return this.getRange()
}}};
var ChannelsMVC={Model:ChannelModel,View:ChannelView,Controller:ChannelController};
return ChannelsMVC
})(jQuery);
BBV.namespace("orion.modules.EPG").ListingsView=orion.modules.EPG.ListingsView||(function($){function ListingsView(elem,publisher){this.$=$(elem);
this.publisher=publisher;
this.$container=this.$.find(".channel-guide-wrap");
this.bindHandlers()
}ListingsView.prototype.bindHandlers=function bindHandlers(){this.$container.on("mouseenter mouseleave",".channel-listing",{timer:null},$.proxy(this.channelHighlight,this));
this.$container.on("click",".listing",$.proxy(this.activateDetails,this));
this.$container.on("click",".close-details",$.proxy(this.destroyDetailsSingle,this));
this.publisher.subscribe("genreChanged",$.proxy(this.destroyDetailsAll,this));
var timer=0;
var self=this;
$(window).scroll(function(){if(timer){clearTimeout(timer)
}var pinHeader=function(){self.pinHeader(".pin")
};
timer=setTimeout(pinHeader,15)
})
};
ListingsView.prototype.pinHeader=function pinHeader(elem){var $pinned=$(elem);
var intPinnedHeight=$pinned.outerHeight();
var intElemAfterPinnedOffset=$pinned.next().offset().top;
var intPinnablePxTracker=intElemAfterPinnedOffset-$(window).scrollTop();
if(intPinnablePxTracker>=0){$pinned.removeClass("pinned");
$pinned.next().css("margin-top","0")
}if(($pinned.offset().top-$(window).scrollTop())<=0){$pinned.addClass("pinned");
$pinned.next().css("margin-top",intPinnedHeight+"px")
}};
ListingsView.prototype.channelHighlight=function channelHighlight(e){var $elem=$(e.currentTarget);
if(e.type==="mouseenter"){$elem.addClass("current");
$elem.find(".asset-details").addClass("active-asset")
}else{$elem.removeClass("current");
$elem.find(".asset-details").removeClass("active-asset")
}};
ListingsView.prototype.activateDetails=function activateDetails(e){var self=this;
var $listing=$(e.currentTarget);
var $channel=$listing.closest(".channel-listing");
var imi=$listing.data("imi");
var $activeListing=$('.program-details-wrap[data-imi="'+imi+'"]:visible');
var isVisible=$activeListing.length;
var hasNoInformation=$listing.data("imi")==="";
var listingDeferred=orion.services.LinearDataService.getActiveListing(imi);
var listingRequestSent=listingDeferred.state()==="pending";
var html;
if(hasNoInformation){return
}if(isVisible){self.destroyDetailsSingle($activeListing);
return
}self.destroyDetailsAll();
orion.oesp.session.withSession(function(session){if(listingRequestSent){var detailsLoader=self.showDetailsLoader(imi);
listingDeferred.done(function clearLoading(){detailsLoader.trigger("loaded");
if($listing.hasClass("active")){detailsLoader.remove()
}})
}listingDeferred.done(function getCurrentListing(currentListing){if($listing.hasClass("active")||!listingRequestSent){currentListing=self.getFormattedDetailsData(currentListing,session);
html=self.generateDetailsMarkup(currentListing);
self.appendDetails($channel,html);
self.showDetails(imi);
self.setLiveStreamPermissions(imi)
}})
})
};
ListingsView.prototype.getFormattedDetailsData=function getFormattedDetailsData(currentListing,session){var channelMethods=orion.modules.EPG.TemplateHelperMethods.channels;
var listingMethods=orion.modules.EPG.TemplateHelperMethods.listings;
if(!currentListing){return
}$.extend(true,currentListing,{listingId:currentListing.program.id+"-"+currentListing.imi,URL:channelMethods.getUrl({id:currentListing.channelId,title:currentListing.channelTitle,hasLiveStream:currentListing.channelHasLiveStream}),genres:listingMethods.getGenres(currentListing.program.categories),time:listingMethods.getStartEndTime(currentListing.startTime,currentListing.endTime),channelIsEntitled:(session.hasEntitlement(currentListing.channelEntitlements)&&session.isAuthenticated()),rbIsEntitled:(session.hasRbEntitlement(currentListing.channelEntitlements)&&session.isAuthenticated()),isLocked:(!session.hasEntitlement(currentListing.channelEntitlements)&&session.isAuthenticated()),isLoggedIn:session.isAuthenticated(),isStarted:listingMethods.checkIfAlreadyStarted(currentListing.startTime),isEnded:listingMethods.checkIfAlreadyEnded(currentListing.endTime),isLiveStream:listingMethods.checkIfLiveStream(currentListing.channelHasLiveStream,currentListing.startTime,currentListing.endTime),boxArtMedium:listingMethods.getBoxArtMedium(currentListing.program.images),upcomingLink:listingMethods.getUpcomingLink(currentListing.program.title),i18n:{episode:orioni18n.EPG.episode,learnMore:orioni18n.EPG.learnMore,learnMoreLink:orioni18n.EPG.learnMoreLink,liveRequired:orioni18n.EPG.liveRequired,recordButton:orioni18n.EPG.bookingButtons.recordbuttontext,recordFailed:orioni18n.EPG.bookingButtons.recordfailedtext,recordPending:orioni18n.EPG.bookingButtons.recordpendingtext,recordSet:orioni18n.EPG.bookingButtons.recordsettext,reminderButton:orioni18n.EPG.bookingButtons.remindbuttontext,reminderFailed:orioni18n.EPG.bookingButtons.reminderfailedtext,reminderPending:orioni18n.EPG.bookingButtons.reminderpendingtext,reminderSet:orioni18n.EPG.bookingButtons.remindersettext,season:orioni18n.EPG.season,signIn:orioni18n.EPG.signIn,subscription:orioni18n.EPG.subscription,tba:orioni18n.EPG.TBA,upcoming:orioni18n.EPG.upcoming,watchNow:orioni18n.EPG.bookingButtons.watchnowtext}});
currentListing.channelOrRbIsEntitled=currentListing.channelIsEntitled||currentListing.rbIsEntitled;
return currentListing
};
ListingsView.prototype.generateDetailsMarkup=function generateDetailsMarkup(data){return $(Mustache.to_html(orion.templates.EPGListDetails,data))
};
ListingsView.prototype.appendDetails=function appendDetails($channel,html){$channel.after(html)
};
ListingsView.prototype.showDetailsLoader=function showDetailsLoader(imi){var self=this;
var $listing=$('.listing[data-imi="'+imi+'"]');
var $channel=$listing.closest(".channel-listing");
var $loader=$('<div class="program-details-wrap details-loader" data-imi="'+imi+'"></div>');
$loader.loader({element:{overlay:"<div/>"},elementClass:"details-loading",flow:["append"],location:"outside",minheight:150,minwidth:920,target:".program-details-wrap",img:{top:"70px"}});
$loader.trigger("loading");
self.appendDetails($channel,$loader);
$listing.addClass("active");
$channel.addClass("details");
$loader.fadeIn(500);
return $loader
};
ListingsView.prototype.showDetails=function showDetails(imi){var $listing=$('.listing[data-imi="'+imi+'"]');
var $channel=$listing.closest(".channel-listing");
var $programDetails=$channel.next(".program-details-wrap");
var $notifications=$listing.find(".notifications");
var remoteBookingsStatus;
if($notifications.length){remoteBookingsStatus=$notifications.attr("class").replace("notifications","")
}else{remoteBookingsStatus=""
}$listing.addClass("active");
$channel.addClass("details");
$programDetails.fadeIn(500).find(".user-functionality").addClass(remoteBookingsStatus)
};
ListingsView.prototype.destroyDetailsAll=function destroyDetailsAll(){var self=this;
var $programDetails=self.$container.find(".program-details-wrap");
var $channels=self.$container.find(".channel-listing");
var $listings=self.$container.find(".listing");
$programDetails.remove();
$channels.removeClass("details");
$listings.removeClass("active")
};
ListingsView.prototype.destroyDetailsSingle=function destroyDetailsSingle(e){var self=this;
var $elem=e.currentTarget?$(e.currentTarget):e;
var $programDetails=$elem.closest(".program-details-wrap");
var $channels=$programDetails.prev(".channel-listing");
var imi=$programDetails.data("imi");
var $listings=$('.listing[data-imi="'+imi+'"]');
$programDetails.fadeOut(200,function(){$channels.removeClass("details");
$listings.removeClass("active");
$programDetails.remove()
})
};
ListingsView.prototype.setLiveStreamPermissions=function setLiveStreamPermissions(imi){var self=this;
var $listing=self.$container.find('.program-details-wrap[data-imi="'+imi+'"]');
var $player=self.$player=$listing.find(".mini-player");
var $watchButton=$listing.find(".button.watch-now");
var channelId=$listing.attr("data-channel-id");
var channelRequest,placeholderElement;
if($player.size()>0){channelRequest=orion.oesp.channelEndpoint.requestChannel(channelId);
$.when(orion.oesp.session,channelRequest).done(function(session,channel){var permission=session.getPermissionToPlayChannel(channel);
permission.done(function(){log("permission granted");
placeholderElement=$("<div/>");
$player.empty().append(placeholderElement).show();
$watchButton.css({display:"block"});
self.vp=new orion.widgets.VideoPlayer("mini");
self.vp.embed(placeholderElement);
self.vp.playChannel(channel);
self.vp.bind("errorOccurred",function(vp,e){var error=self.vp.errors.pop();
if(error=="PARENTAL_PIN_NOT_VERIFIED"){var pinDialog=orion.app.dialogManager.getDialog("pin-verification");
pinDialog.centerOn(window);
pinDialog.show();
pinDialog.setFocus();
pinDialog.bind("pinVerified",function(){window.location.reload()
})
}else{if(e.causedPlaybackFailure){log("MODULE:EPG: Error Occurred on the video player:",error,e);
self.showError(error)
}}})
});
permission.fail(function(reason){log("Unable to play the mini preview because there was a permission error:",reason)
})
})
}};
ListingsView.prototype.showError=function showError(errorType){var view=this;
var error,errorMsg;
log("MODULE:EPG: Error Occurred on the mini-player:",errorType);
if(view.vp){view.vp.remove();
delete view.vp
}if(orioni18n.EPG.playerErrors.hasOwnProperty(errorType)){error=orioni18n.EPG.playerErrors[errorType]
}else{error=orioni18n.EPG.playerErrors.GENERIC
}errorMsg={heading:error.heading,message:error.message};
view.$player.html(Mustache.to_html(orion.templates.MiniVideoPlayerError,errorMsg))
};
return ListingsView
})(jQuery);
BBV.namespace("orion.modules.EPG").TimeView=orion.modules.EPG.TimeView||(function($,time){function TimeView(elem,publisher){this.$parent=$(elem);
this.publisher=publisher;
this.$=this.$parent.find(".time-slot-wrap").find(".band");
this.$.next=this.$parent.find(".channel-guide-head .next");
this.$.previous=this.$parent.find(".channel-guide-head .prev");
this.$.currentTime=this.$parent.find(".current-time");
this.bindHandlers()
}TimeView.prototype={constructor:TimeView,bindHandlers:function bindHandlers(){this.$parent.on("click",this.$.next.selector,$.proxy(this.onNext,this));
this.$parent.on("click",this.$.previous.selector,$.proxy(this.onPrevious,this))
},onNext:function onNext(evt){this.publisher.trigger("TimeView.goNext");
$("html, body").animate({scrollTop:0},"fast");
return false
},onPrevious:function onPrevious(evt){this.publisher.trigger("TimeView.goPrevious");
$("html, body").animate({scrollTop:0},"fast");
return false
},goToDate:function goToDate(start,animate){var view=this;
if(view.start!==start){var previousStart=view.start;
view.start=start;
var startDate=new Date(view.start);
var previousDate=new Date(previousStart);
if(startDate.getDate()!==previousDate.getDate()){view.updateDateRange(view.start)
}var markup=TimeView.helpers.getRangedMarkup(start);
if(animate){view.animate(view.$,"fadeOut",function onAnimate(){view.$.html(markup).fadeIn("fast")
})
}else{view.$.html(markup)
}var now=(new Date()).getTime();
var end=start+TimeView.helpers.displayMilliseconds();
if(start>now||end<now){view.$.currentTime.hide()
}else{view.$.currentTime.show()
}view.setCurrentTime(start)
}},animate:function animate(el_,effect_,callback_){var view=this;
var el=el_;
var callback=callback_||function(){};
el[effect_]({duration:"fast",complete:callback})
},setupDateRange:function setupDateRange(start){var view=this;
var dates=[];
var days=7;
var markup;
var day=start;
var plusDay=1000*60*60*24;
var stop=start+TimeView.helpers.displayMilliseconds();
for(var i=1;
i<=7;
i+=1){dates.push({time:day,display:BBV.utils.date(day).format(BBV.settings.l10n.date.listingformat)});
day=day+plusDay
}markup=Mustache.to_html(orion.templates.DatePicker,{dates:dates});
$(".channel-guide-head").find(".date").text(BBV.utils.date(start).format(BBV.settings.l10n.date.listingformat));
$(".channel-guide-head").find(".end-date").text(BBV.utils.date(stop).format(BBV.settings.l10n.date.listingformat));
$(".channel-guide-head").find(".select").html(markup);
$(".channel-guide-head").find(".select > ol > li > a").on("click",function(){$("html, body").animate({scrollTop:0},"fast")
})
},setCurrentTime:function setCurrentTime(start){var view=this;
var current=new Date();
var diffInMinutes=Math.floor((current.getTime()-start)/1000/60);
var minuteWidth=(TimeView.helpers.keyTime.width*TimeView.helpers.keyTime.increments)/30;
if(diffInMinutes>=0){var leftValue=172+(diffInMinutes*minuteWidth);
view.$.currentTime.animate({left:leftValue+"px"},{duration:500,complete:function(){$(this).show()
}})
}else{view.$.currentTime.hide()
}},updateDateRange:function updateDateRange(start){var stop=start+TimeView.helpers.displayMilliseconds();
$(".channel-guide-head").find(".date").text(BBV.utils.date(start).format(BBV.settings.l10n.date.listingformat));
$(".channel-guide-head").find(".end-date").text(BBV.utils.date(stop).format(BBV.settings.l10n.date.listingformat))
}};
TimeView.helpers={};
TimeView.helpers.getRangedMarkup=function getRangedMarkup(start){var range=TimeView.helpers.getRangeArray(start,TimeView.helpers.displayHours());
var markup=Mustache.to_html(orion.templates.TimeSlot,{times:range});
return markup
};
TimeView.helpers.getRangeArray=function getRangeArray(date,count){var next=date;
var timerange=[];
var unit=TimeView.helpers.unit();
for(var i=0;
i<count;
i++){timerange.push({time:next,display:TimeView.helpers.msToTime(next)});
next=next+unit
}return timerange
};
TimeView.helpers.unit=function unit(){var increment=TimeView.helpers.displayMilliseconds()/(orion.modules.EPG.timeFrameInHours*2);
return increment
};
TimeView.helpers.displayHours=function displayHours(){return orion.modules.EPG.timeFrameInHours*2
};
TimeView.helpers.displayMilliseconds=function displayMilliseconds(){return orion.modules.EPG.timeFrameInHours*60*60*1000
};
TimeView.helpers.msToTime=orion.modules.EPG.TemplateHelperMethods.msToTime;
TimeView.helpers.keyTime=orion.modules.EPG.keyTime;
return TimeView
})(jQuery,orion.util.time);
BBV.namespace("orion.services").LinearDataService=orion.services.LinearDataService||(function($,time){var self={};
self.initialized=false;
self.epgFoundOnPage=$(".channel-guide.module").length>0;
self.initialize=function(){if(self.initialized){return
}else{self.initialized=true
}self.activeTimeStamp=time.roundTo30Minutes(new Date()).getTime();
self.storageLimitExceeded=false;
var sessionTimeSetData=sessionStorage.getItem("linearTimeSets")||null;
if(sessionTimeSetData){self.timesetDataStore=$.parseJSON(sessionTimeSetData)
}else{self.timesetDataStore={}
}var sessionChannelData=sessionStorage.getItem("linearChannels")||null;
self.cachingHasBegun=false;
if(sessionChannelData){self.channelData=$.parseJSON(sessionChannelData);
self.channelDataDeferred=$.Deferred().resolve(self.channelData);
if(self.locationIdChanged()||self.channelData.expires<(new Date()).getTime()){self.killCacheData()
}}else{self.getChannelData()
}orion.app.subscribe("loggedIn",$.proxy(function(session){var self=this;
if(self.locationIdChanged(session)){self.activeCacheId="";
self.cachingHasBegun=false;
var reloadCache=function(){self.killCacheData();
self.beginCaching()
};
if(self.cachePipe){self.cachePipe.done(reloadCache)
}else{reloadCache()
}}},self));
self.linearTimeSets={};
self.listingData={}
};
self.getChannelData=function(){if(self.channelDataDeferred&&self.channelDataDeferred.state()==="pending"){return
}if(self.channelData&&!self.locationIdChanged()&&(self.channelData.expires-(new Date()).getTime()>time.timeFrameInMilliseconds(10,"minutes"))){return
}self.channelData={};
sessionStorage.removeItem("linearChannels");
self.channelDataDeferred=orion.oesp.channelEndpoint.requestChannels({sort:"channelNumber"});
self.channelDataDeferred.done(function storeChannels(data){self.channelData=data;
if(data.channels.length>0){self.channelData.locationId=data.channels[0].locationId
}sessionStorage.setItem("linearChannels",JSON.stringify(data))
})
};
self.locationIdChanged=function(session){session=session||orion.util.oesp.session;
if(session&&self.channelData){var sessionLocId=session.locationId;
var cacheLocId=self.channelData.locationId;
if(sessionLocId!==cacheLocId){return true
}else{return false
}}return null
};
self.beginCaching=function(doThisFirst){self.initialize();
if(self.cachingHasBegun){return
}else{self.cachingHasBegun=true
}doThisFirst=doThisFirst||self.channelDataDeferred;
doThisFirst.done($.proxy(self.buildCacheData,self))
};
self.activeCacheId="";
self.buildCacheData=function(channelModel){var cacheId=(new Date()).getTime().toString();
self.activeCacheId=cacheId;
var roundedNow=time.roundTo30Minutes(new Date());
var timeStampsToCache=[roundedNow.getTime(),time.addTime(roundedNow,2.5,"hours").getTime(),time.addTime(roundedNow,5,"hours").getTime(),time.addTime(roundedNow,7.5,"hours").getTime(),time.addTime(roundedNow,1,"days").getTime(),time.addTime(roundedNow,2,"days").getTime()];
var pipeFunction=function(){if(self.activeCacheId!==this.cacheId){return
}return self.getData({timestamp:this.stamp})
};
var clearCacheId=$.proxy(function(){var self=this.self;
var cacheId=this.cacheId;
if(self.activeCacheId===cacheId){self.activeCacheId="";
delete self.cachePipe
}},{self:self,cacheId:cacheId});
var i=1;
self.cachePipe=self.getData({timestamp:timeStampsToCache[0]});
for(;
i<timeStampsToCache.length;
i++){var cacheTimeSet=$.proxy(pipeFunction,{stamp:timeStampsToCache[i],cacheId:cacheId});
self.cachePipe=self.cachePipe.pipe(cacheTimeSet,cacheTimeSet)
}self.cachePipe.always(clearCacheId);
if(!self.epgFoundOnPage){var timeout=time.timeFrameInMilliseconds(15,"minutes");
setTimeout($.proxy(function(){this.killCacheData();
this.channelDataDeferred.done($.proxy(this.buildCacheData,this))
},self),timeout)
}};
self.getData=function(options){self.initialize();
options=options||{};
options=$.extend({urgent:false},options);
options.timestamp=options.timestamp||self.activeTimeStamp;
options.model=self.timesetDataStore[options.timestamp]||undefined;
if(options.urgent){var requestedTimeSet=self.linearTimeSets[options.timestamp];
if(typeof requestedTimeSet!=="undefined"&&requestedTimeSet.state()==="pending"){orion.app.trigger("abortTimeSet",options.timestamp);
delete self.linearTimeSets[options.timestamp];
delete self.timesetDataStore[options.timestamp]
}if(self.activeTimeStamp!==options.timestamp){var activeTimeSet=self.linearTimeSets[self.activeTimeStamp];
if(self.activeTimeStamp>0&&typeof activeTimeSet!=="undefined"&&activeTimeSet.state()==="pending"){orion.app.trigger("abortTimeSet",self.activeTimeStamp);
delete self.linearTimeSets[self.activeTimeStamp];
delete self.timesetDataStore[self.activeTimeStamp]
}}self.activeTimeStamp=options.timestamp
}if(options.model){if(options.model.locationId!==orion.util.oesp.session.locationId){self.killCacheData();
delete options.model
}else{if(options.model.expires<(new Date()).getTime()){delete self.linearTimeSets[options.timestamp];
delete self.timesetDataStore[options.timestamp];
delete options.model
}}}if(options.urgent){if(options.model){log("loading timeset "+options.timestamp+" from memory")
}else{log("loading timeset "+options.timestamp+" using chunking")
}}if(typeof self.linearTimeSets[options.timestamp]==="undefined"){var chained=self.channelDataDeferred.pipe(function channelDataPipe(channelModel){options.channels=JSON.parse(JSON.stringify(channelModel));
var newLts=new orion.services.models.LinearTimeSet(options);
newLts.done($.proxy(self.linearTimeSetLoaded,self));
return newLts
});
self.linearTimeSets[options.timestamp]=chained
}var lastActionQueued=self.linearTimeSets[options.timestamp];
if(options.urgent){self.listingData={};
if(self.linearTimeSets[options.timestamp].state()==="pending"){self.linearTimeSets[options.timestamp].progress(self.fillListingDataFromChunks)
}else{self.linearTimeSets[options.timestamp].done(self.fillListingDataFromModel)
}var nextTimestamp=options.timestamp+time.timeFrameInMilliseconds(2.5,"hours");
if(typeof self.timesetDataStore[nextTimestamp]==="undefined"){lastActionQueued=self.linearTimeSets[options.timestamp].pipe(function queueNextPage(){return self.getData({timestamp:nextTimestamp})
})
}}if(!self.cachingHasBegun){self.beginCaching(lastActionQueued)
}return self.linearTimeSets[options.timestamp]
};
self.fillListingDataFromChunks=function(type,data){if(type==="LinearTimeSet.detailComplete"){var listings=data.listings;
for(var i=0;
i<listings.length;
i++){var listing=listings[i];
if(typeof self.listingData[listing.imi]==="undefined"){self.listingData[listing.imi]=self.extendListingWithChannelData(listing)
}}}};
self.fillListingDataFromModel=function(model){var listings,channel,a,b;
for(a=0;
a<model.channels.length;
a++){channel=model.channels[a];
listings=channel.stationSchedules[0].station.listings;
if(typeof listings!=="undefined"){for(b=0;
b<listings.length;
b++){if(listings[b].program){self.listingData[listings[b].imi]=self.extendListingWithChannelData(listings[b],channel)
}}}}};
self.extendListingWithChannelData=function(listing,channel){channel=channel||self.getChannelByStationId(self.channelData.channels,listing.stationId);
return $.extend({channelId:channel.id,channelHasLiveStream:channel.hasLiveStream,channelTitle:channel.stationSchedules[0].station.title,channelEntitlements:channel.stationSchedules[0].station.entitlements},listing)
};
self.getActiveListing=function(imi){var _d=$.Deferred();
var $listing=$('.listing[data-imi="'+imi+'"]');
var listingId=$listing.data("listing-id");
if(self.listingData[imi]){_d.resolve(self.listingData[imi])
}else{if($listing.length>0){_d=orion.oesp.listingEndpoint.requestListing(listingId).pipe(function requestedListing(listing){return self.extendListingWithChannelData(listing)
})
}else{_d.reject()
}}return _d
};
self.getChannelByStationId=function(channels,stationId){for(var c=0;
c<channels.length;
c++){if(channels[c].stationSchedules[0].station.id===stationId){return channels[c]
}}return null
};
self.updateTimesetModelWithListingDetail=function(data){for(var c=0;
c<data.channels.length;
c++){var channel=data.channels[c];
var listings=channel.stationSchedules[0].station.listings;
if(listings){for(var i=0;
i<listings.length;
i++){if(typeof listings[i].program!=="undefined"){listings[i]=self.listingData[listings[i].imi]
}}}}};
self.linearTimeSetLoaded=function(data,timestamp){var isIE=/msie/gi.test(navigator.userAgent);
if(data.chunked){self.updateTimesetModelWithListingDetail(data)
}if(self.timesetDataStore[timestamp]!==data){self.timesetDataStore[timestamp]=data;
if(!self.storageLimitExceeded&&!isIE){try{sessionStorage.setItem("linearTimeSets",JSON.stringify(self.timesetDataStore))
}catch(err){self.storageLimitExceeded=true
}}}};
self.killCacheData=function(){delete self.timesetDataStore;
self.timesetDataStore={};
delete self.linearTimeSets;
self.linearTimeSets={};
sessionStorage.removeItem("linearTimeSets");
self.storageLimitExceeded=false;
self.getChannelData()
};
function Range(max,interval){this.start=1;
this.end=21;
this.max=max;
if(typeof interval!=="undefined"){this.interval=interval
}else{this.interval=20
}}Range.prototype.getRangeString=function(){return"range="+this.start+"-"+this.end
};
Range.prototype.advance=function(){if(this.max>this.end){this.start=this.end+1;
if(this.max<=this.end+this.interval){this.end=this.max
}else{this.end+=this.interval
}}return this.getRangeString()
};
Range.prototype.decrease=function(){if(this.start-this.interval<1){this.start=1
}else{this.start-=this.interval
}this.end=this.start+this.interval;
return this.getRangeString()
};
return{beginCaching:self.beginCaching,getData:self.getData,getActiveListing:self.getActiveListing}
})(jQuery,orion.util.time);
BBV.namespace("orion.services.models").LinearTimeSet=orion.services.models.LinearTimeSet||(function($,time){function LinearTimeSet(options){var self=this;
self.model={};
self._params={sort:"startTime"};
self.timestamp=options.timestamp;
self._d=$.Deferred();
self._aborted=false;
self._detailRequests=[];
self._ranged=false;
if(typeof options.model!=="undefined"){options.model.chunked=false;
self._d.resolve(options.model,self.timestamp)
}else{if(typeof options.channels!=="undefined"){orion.app.subscribe("abortTimeSet",$.proxy(function(timestamp){if(timestamp===this.timestamp){this.abort()
}},self));
self.model=self._cleanUsingConfig(options.channels,"channels");
self._chunk=options.urgent===true;
self.timestamp=options.timestamp;
self.model.chunked=self._chunk;
self._constructTimestamp(options.timestamp)
}else{throw new Error("Requires channels object to construct with timestamp")
}}orion.oesp.session.done(function(session){self.locationIdWhenRequested=session.locationId;
if(options.urgent){var onLoggedIn=$.proxy(function(){var self=this;
if(self._d.state()==="pending"&&self.locationIdWhenRequested!==orion.util.oesp.session.locationId){self.abort()
}},self);
orion.app.subscribe("loggedIn",onLoggedIn);
self._d.always(function(){orion.app.unsubscribe("loggedIn",onLoggedIn)
})
}});
return self._d
}LinearTimeSet.prototype.abort=function(){var self=this;
self._aborted=true;
self._d.reject()
};
LinearTimeSet.prototype._constructTimestamp=function(timestamp){var requestOffset=1000;
var startDate=new Date(timestamp+requestOffset);
var endDate=time.addTime(new Date(timestamp-requestOffset),2.5,"hours");
this._requestListings(startDate.getTime(),endDate.getTime())
};
LinearTimeSet.prototype._requestListings=function(start,end){var self=this;
if(self._aborted){return
}if(self._chunk){self._params.byStationId=self._getStationIds(20);
if(self._params.byStationId===null){$.when.apply(self,self._detailRequests).done(function allDetailsAreDone(){self._d.notify("LinearTimeSet.timeSetComplete",self.model);
self._d.resolve(self.model,self.timestamp)
});
return
}}self._params.byStartTime="~"+end;
self._params.byEndTime=start+"~";
var summaryRequest;
if(self._chunk){var params=$.extend({},self._params,{mode:"summary"});
summaryRequest=orion.oesp.listingEndpoint.requestListings(params);
summaryRequest.done(function summaryRequestDone(data){self._insertListings(data.listings);
self._addShimListings();
self._d.notify("LinearTimeSet.summaryComplete",self.model)
})
}else{summaryRequest=$.Deferred().resolve()
}summaryRequest.done(function summaryRequestDone(){var detailRequest=orion.oesp.listingEndpoint.requestListings(self._params);
self._detailRequests.push(detailRequest);
detailRequest.done(function detailRequestDone(data){if(self._chunk){for(var i=0;
i<data.listings.length;
i++){self._cleanUsingConfig(data.listings[i],"listings")
}self._d.notify("LinearTimeSet.detailComplete",data)
}else{self._insertListings(data.listings);
if(!self._ranged&&data.entryCount<data.totalResults){self._ranged=true;
self._params.range=(data.entryCount+1)+"-"+data.totalResults;
self._requestListings(start,end)
}else{if(self._ranged||data.entryCount==data.totalResults){self._addShimListings(true);
self.model.expires=data.expires;
self.model.updated=data.updated;
self._d.notify("LinearTimeSet.timeSetComplete",self.model);
self._d.resolve(self.model,self.timestamp)
}}}});
if(self._chunk){self._requestListings(start,end)
}})
};
LinearTimeSet.prototype._insertListings=function(listings){var self=this;
for(var i=0;
i<listings.length;
i++){var listing=listings[i];
var stationId=listing.stationId;
var station=self._getStationById(stationId);
if(station!==null){if(typeof station.listings==="undefined"){station.listings=[]
}self._cleanUsingConfig(listing,"listings");
station.listings.push(listing)
}}};
LinearTimeSet.prototype._addShimListings=function(timeSetComplete){var self=this;
var shimAllChannels=timeSetComplete===true;
var shimChannels="|"+(self._params.byStationId||"")+"|";
var start=parseInt(self._params.byEndTime.replace("~",""),10)-1000;
var end=parseInt(self._params.byStartTime.replace("~",""),10)+1000;
var channels=self.model.channels;
for(var i=0;
i<channels.length;
i++){var station=channels[i].stationSchedules[0].station;
if((shimChannels.indexOf("|"+station.id+"|")!==-1||shimAllChannels)&&typeof station.listings==="undefined"){station.listings=[]
}if(station.listings){var listings=station.listings;
var lastEndTime=start;
for(var l=0;
l<listings.length;
l++){if(lastEndTime<listings[l].startTime){listings.splice(l,0,{startTime:lastEndTime,endTime:listings[l].startTime});
l++
}lastEndTime=listings[l].endTime
}if(lastEndTime<end){listings.push({startTime:lastEndTime,endTime:end})
}}}};
LinearTimeSet.prototype._getStationById=function(stationId){var self=this;
for(var c=0;
c<self.model.channels.length;
c++){if(self.model.channels[c].stationSchedules[0].station.id===stationId){return self.model.channels[c].stationSchedules[0].station
}}return null
};
LinearTimeSet.prototype._getStationIds=function(count){var self=this;
if(typeof self._idSet==="undefined"){self._idSet=0
}var min=self._idSet*count;
var max=min+count;
var ids=[];
for(var i=min;
i<max&&i<self.model.totalResults;
i++){ids.push(self.model.channels[i].stationSchedules[0].station.id)
}if(ids.length>0){self._idSet++;
return ids.join("|")
}else{return null
}};
LinearTimeSet.prototype._cleanUsingConfig=function(data,config){var self=this;
config=orion.services.models.ModelCleanerConfigs[config];
for(var i=0;
i<config.length;
i++){self._cleanData(config[i],data)
}return data
};
var alerted=false;
LinearTimeSet.prototype._cleanData=function(pathString,data,original){var self=this;
var orig=original||{path:pathString,data:data};
pathString=pathString.split(".");
var path=pathString.splice(0,1)[0];
var subItem;
pathString=pathString.join(".");
if(path.indexOf("[")!==-1){subItem=parseInt(path.split("[")[1].split("]").join(""),10);
path=path.split("[")[0]
}if(pathString.length>0){if(typeof data[path]!=="undefined"){data=data[path];
if(data instanceof Array){if(typeof subItem!=="undefined"){self._cleanData(pathString,data[subItem],orig)
}else{for(var i=0;
i<data.length;
i++){self._cleanData(pathString,data[i],orig)
}}}else{self._cleanData(pathString,data,orig)
}}else{}}else{if(typeof data[path]!=="undefined"){delete data[path]
}else{}}};
return LinearTimeSet
})(jQuery,orion.util.time);
BBV.namespace("orion.services.models").ModelCleanerConfigs=orion.services.models.ModelCleanerConfigs||(function($){return{channels:["updated","title","channels.title","channels.countryCode","channels.languageCode","channels.deviceCode","channels.locationId","channels.stationSchedules[0].station.countryCode","channels.stationSchedules[0].station.language","channels.stationSchedules[0].station.locationId","channels.stationSchedules[0].station.serviceId"],listings:["countryCode","languageCode","deviceCode","id","locationId","program.countryCode","program.languageCode","program.deviceCode","program.mediaGroupId","program.mediaType","program.medium","program.shortDescription","program.longDescription","program.cast","program.directors","program.videos"]}
})(jQuery);
BBV.namespace("orion").app=orion.app||(function($){function main(){var end,start=$.now(),app=this,module,modules=this.modules=[],moduleElements=$("[data-module-type]");
this.resettingNow=false;
orion.oesp.session=new orion.oesp.req.SessionEndpoint();
orion.oesp.purchaseEndpoint=new orion.oesp.req.PurchaseEndpoint();
orion.oesp.mediaItemEndpoint=new orion.oesp.req.MediaItemEndpoint();
orion.oesp.mediaGroupEndpoint=new orion.oesp.req.MediaGroupEndpoint();
orion.oesp.bookmarkEndpoint=new orion.oesp.req.BookmarkEndpoint();
orion.oesp.channelEndpoint=new orion.oesp.req.ChannelEndpoint();
orion.oesp.listingEndpoint=new orion.oesp.req.ListingEndpoint();
orion.oesp.profileEndpoint=new orion.oesp.req.ProfileEndpoint();
orion.oesp.playlistEndpoint=new orion.oesp.req.PlaylistEndpoint();
this.dialogManager=orion.widgets.DialogManager(app);
this.recommendations=new orion.widgets.Recommendations();
this.analytics=new orion.util.analytics();
this.adultAdapter=new orion.util.AdultAdapter();
moduleElements.each(function(){module=app.createModule(this,app);
if(module){modules.push(module)
}});
this.main=function(){if(console&&console.trace){console.trace()
}log("Warning: Attempting to run main function more than once!")
};
end=$.now();
(function(){var on=$.fn.on;
$.fn.on=function newOn(){var a=arguments;
if(orion.app.resettingNow&&this.data("events")){var type=a[0].split(".")[0];
var namespace=(a[0].indexOf(".")!==-1)?a[0].replace(type+".",""):"";
var events=this.data("events")[type]||[];
for(var i=0;
i<events.length;
i++){var e=events[i];
if(e.type==type&&e.namespace==namespace&&e.selector==a[1]){this.off(a[0],e.selector,e.handler)
}}}return on.apply(this,a)
}
})();
orion.oesp.session.done(function(){var isIE=/msie/gi.test(navigator.userAgent);
var hasVideoPlayer=$("div.video-player-module").length>0?true:false;
if(!isIE&&!hasVideoPlayer){orion.services.LinearDataService.beginCaching()
}});
log("Main completed in ",end-start+"ms.")
}var constructorResetConfig={UtilityBar:{markup:false},VideoPlayer:{markup:true},Playlist:{markup:false},MyOrionBar:{markup:false},PinManagement:{markup:false},MediaItemTitleCard:{markup:false}};
function createModule(elem,pub){var moduleType=elem.getAttribute("data-module-type");
var Constructor=orion.modules[moduleType];
var module=null;
var initialMarkup=elem.innerHTML;
if(Constructor&&typeof Constructor=="function"){var resetConfig=constructorResetConfig[moduleType]||false;
module=new Constructor(elem,pub);
if(resetConfig){module.reset=function(html,elem,pub,resetConfig){return function(){if(resetConfig.markup){elem.innerHTML=html
}return createModule(elem,pub)
}
}(initialMarkup,elem,pub,resetConfig)
}}return module
}function reInitialize(noNewSession){var self=this;
noNewSession=noNewSession===true;
self.resettingNow=true;
if(noNewSession===false){orion.oesp.session=new orion.oesp.req.SessionEndpoint()
}orion.oesp.session.done(function(session){for(var i=0,m=self.modules;
i<m.length;
i++){if(m[i].reset){var newMod=m[i].reset();
delete self.modules[i];
self.modules[i]=newMod
}}setTimeout(function(){orion.app.resettingNow=false;
self.trigger("loggedIn",session)
},1)
})
}function trigger(eventType,eventOptions){var observers=this._observers[eventType];
var i;
if(observers){i=observers.length;
setTimeout(function(){while(i--){if($.isFunction(observers[i])){observers[i](eventOptions)
}}},0)
}return this
}function subscribe(eventType,callback){var self=this,i;
var observers=this._observers;
if(!(eventType in observers)){observers[eventType]=[]
}if(self.resettingNow){var o=observers[eventType];
for(i=0;
i<o.length;
i++){if(""+o[i]==""+callback){delete o[i];
o.splice(i,1);
i--
}}}observers[eventType].push(callback);
return this
}function unsubscribe(eventType,handler){var i,observers=this._observers[eventType];
if(observers){for(i=0;
i<observers.length;
i++){if(observers[i]==handler){delete observers[i];
observers.splice(i,1);
i--
}}}return this
}function once(eventType,callback){var publisher=this;
var wrappedCallback=function(eventOptions){callback(eventOptions);
publisher.unsubscribe(eventType,wrappedCallback)
};
publisher.subscribe(eventType,wrappedCallback);
return this
}return{main:main,createModule:createModule,trigger:trigger,subscribe:subscribe,unsubscribe:unsubscribe,once:once,modules:[],_observers:{},constructors:[],reInitialize:reInitialize,resettingNow:this.resettingNow}
})(jQuery);
(function(d){var pageTitle=$("head").data("page-title");
if(pageTitle&&pageTitle!==d.title){setTimeout(function(){d.title=pageTitle
},3000)
}})(document);
(function($){var $languageList=$("ul.user-language"),$languageLinks=$languageList.find(".language-item"),canonicalPath=$languageList.data("canonicalPath"),storageLanguage=localStorage.getItem("language"),windowLanguage=window.navigator.userLanguage||window.navigator.language,currentLanguage=$languageList.data("currentLanguage");
windowLanguage=(windowLanguage)?windowLanguage.replace("-","_"):null;
log("window.navigator Language: "+windowLanguage);
log("localStorage Language: "+storageLanguage);
log("Current pages Language: "+currentLanguage);
if(currentLanguage&&typeof currentLanguage=="string"){if(storageLanguage&&typeof storageLanguage=="string"){if(currentLanguage.toLowerCase()!=storageLanguage.toLowerCase()){if(matchLanguageAndRedirect($languageLinks,canonicalPath,storageLanguage,currentLanguage)){return
}else{log("Local storage language no longer valid. Continuing...")
}}else{log("Local storage matches page language");
return
}}else{localStorage.setItem("language",currentLanguage)
}if(windowLanguage&&typeof windowLanguage=="string"){if(currentLanguage.toLowerCase()!=windowLanguage.toLowerCase()){if(!matchLanguageAndRedirect($languageLinks,canonicalPath,windowLanguage,currentLanguage,true)){log("No language matching local machine")
}}}else{log("No window language information, browser compatible?")
}}else{log("CurrentLanguage data attribute is empty or null")
}function convertLanguageLinks(){$languageLinks.each(function(){var $this=$(this),toLanguage=$this.data("language"),translatedHref=getUrlForLanguage(currentLanguage,toLanguage,location.href,location.pathname,canonicalPath);
$this.attr("href",translatedHref)
})
}function matchLanguageAndRedirect($links,canonicalPath,toLanguage,currentPageLanguage,setStorage){for(var i=0;
i<$links.length;
i++){$link=$($links[i]);
var linkLanguage=$link.data("language");
if(toLanguage&&linkLanguage&&linkLanguage.toLowerCase()==toLanguage.toLowerCase()&&location.pathname.indexOf(currentPageLanguage.toLowerCase())>-1&&canonicalPath.indexOf(currentPageLanguage.toLowerCase())>-1){var href=getUrlForLanguage(currentPageLanguage,toLanguage,location.href,location.pathname,canonicalPath);
if(href&&href.length>0){log("Found language match: "+linkLanguage+" : "+toLanguage);
log("Redirecting to href: "+href);
if(setStorage){localStorage.setItem("language",toLanguage)
}window.location.href=href;
return true
}}}return false
}function getUrlForLanguage(currentLanguage,toLanguage,href,pathname,canonicalPath){var locationUrlParts=pathname.split(currentLanguage.toLowerCase()),pathUrlParts=canonicalPath.split(currentLanguage.toLowerCase()),locationPartsAfterLanguage=locationUrlParts[1].split("/"),pathPartsAfterLanguage=pathUrlParts[1].split("/");
for(var j=0;
j<locationPartsAfterLanguage.length&&j<pathPartsAfterLanguage.length;
j++){var lpal=locationPartsAfterLanguage[j],ppal=pathPartsAfterLanguage[j],indexOfDot=lpal.indexOf(".");
if(indexOfDot>-1){locationPartsAfterLanguage[j]=lpal.replace(lpal.substr(0,indexOfDot),ppal)
}else{locationPartsAfterLanguage[j]=ppal
}}locationUrlParts[1]=locationPartsAfterLanguage.join("/");
return href.replace(pathname,locationUrlParts.join(toLanguage.toLowerCase()))
}})(jQuery);
jQuery(document).ready(function(){orion.app.main()
});
