YUI.add("gallery-comet-stream",function(g){var d={UNINITIALIZED:0,LOADING:1,LOADED:2,INTERACTIVE:3,COMPLETED:4},b="start",a="fail",e="pushed",c="reconnect",h="invalidFormat";function f(i){f.superclass.constructor.apply(this,arguments);this.publish(b,{emitFacade:true});this.publish(a,{fireOnce:true,emitFacade:true});this.publish(e,{emitFacade:true});this.publish(c,{emitFacade:true});this.publish(h,{emitFacade:true});}f.NAME="cometStream";f.ATTRS={url:{},connectTimeout:{value:20*1000},resetTimeout:{value:300*1000},retryOnDisconnect:{value:true},operaXhrPollingInterval:{value:50}};f.prototype={start:function(){this._initStream();},close:function(){this._endStream();this._closed=true;},_initStream:function(){var j,i=this;this._lastMsgIdx=0;if(g.UA.ie){this._createIFrame(this.get("url"),function(k){if(i.cfg.on.pushed){i.cfg.on.pushed(k);}});}else{j=this.xhr=this._createXHR();j.onreadystatechange=function(){i._onXhrStreamStateChange();};j.open("GET",this.get("url"),true);j.send();}this._failTimer=g.later(this.get("connectTimeout"),this,this._failTimeout,null);this._streamStartTime=new Date();this._fireStartEvent();},_failTimeout:function(){this.fire(a);this._failTimer=null;this._endStream();},_succeedToConnect:function(){if(this._failTimer){this._failTimer.cancel();}},_endStream:function(){if(this.transDoc){this.transDoc=null;}if(this._pollHandler){this._pollHandler.cancel();}if(this.xhr){var i=this.xhr;this.xhr=null;i.onreadystatechange=null;i.abort();}},_pollResponse:function(){this._parseResponse(this.xhr.responseText);},_onXhrStreamStateChange:function(){var j=this.xhr,i;if(!j){return;}if(j.readyState<d.INTERACTIVE){return;}i=j.status;if(i===200){if(j.readyState===d.INTERACTIVE){if(g.UA.opera){this._pollHandler=g.later(this.get("operaXhrPollingInterval"),this,this._pollResponse,null,true);}else{this._parseResponse(j.responseText);}}else{if(j.readyState===d.COMPLETED){if(g.UA.opera){this._pollResponse();}if(this.get("retryOnDisconnect")){this._reconnect();}}}}else{this.fire(a);}},_fireStartEvent:function(){this.fire(b);},_reconnect:function(){this._endStream();if(!this._closed){this.fire(c);this._initStream();}},_parseResponse:function(m){this._succeedToConnect();while(true){var o,l,p,i,n,j,k;i=this._lastMsgIdx;n=m.indexOf("\r\n",i);if(n==-1){break;}j=m.substring(i,n);k=Number("0x"+g.Lang.trim(j));if(window.isNaN(k)){this.fire(h);this._endStream();return;}l=n+2;p=l+k;if(p>m.length){break;}this._lastMsgIdx=p+2;o=m.substr(l,k);this._fireMessageEvent(o);}if((new Date()).getTime()-this._streamStartTime.getTime()>=this.get("resetTimeout")){this._reconnect();}},_fireMessageEvent:function(i){this.fire(e,{data:i});},_createIFrame:function(j,k){this.transDoc=new window.ActiveXObject("htmlfile");this.transDoc.open();if(j.match(/^http.?:\/\/([^\/]+)\/?/)[1]!==window.document.domain){this.transDoc.write('<html><script type="text/javascript">document.domain="'+window.document.domain+'";<\/script></html>');}this.transDoc.write("<html></html>");this.transDoc.close();this.transDoc.parentWindow.push=k;this.transDoc.parentWindow.mo="mo";var i=this.transDoc.createElement("div");this.transDoc.body.appendChild(i);i.innerHTML='<iframe src="'+j+'"></iframe>';},_createXHR:function(){var i=null;if(window.XMLHttpRequest){i=new XMLHttpRequest();}else{if(window.ActiveXObject){}}if(!i){throw new Error("XMLHttpRequest is not supported");}return i;}};g.extend(f,g.Base,f.prototype);g.CometStream=f;},"@VERSION@",{requires:["base"]});