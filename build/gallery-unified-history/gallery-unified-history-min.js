YUI.add("gallery-unified-history",function(a){var c="popstate",g=a.Do,f=a.Lang,h=a.config.win,m=h.location,i=a.HistoryHash,k=a.HistoryHTML5,e=k._init,l=i._init,d=i.parsetHash,b=i.createHash;function j(o,n){if(n.useKeyValuePair){return(m.href.indexOf("?")!=-1?"&":"?")+b(o);}else{if(a.config.usePath){return(m.href.charAt(m.href.length-1)==="/"?"":"/")+i.createHash(o);}}}k._updateUrl=function(p,o,n){if(p!==c){n.url=m.href+j(o,this._config);}};k.prototype._init=function(){g.before(k._updateUrl,this,"_storeState",this);e.apply(this,arguments);};i.prototype._init=function(n){if(n.usePath){a.config.usePath=n.usePath;}l.apply(this,arguments);};i.parseHash=function(q){if(!a.config.usePath){d.apply(this,arguments);return;}var n=i.decode,r,u,s,o,p={},t=i.hashPrefix,v;q=f.isValue(q)?q:i.getHash();if(t){v=q.indexOf(t);if(v===0||(v===1&&q.charAt(0)==="#")){q=q.replace(t,"");}}s=q.split("/");for(r=0,u=s.length;r<u;++r){p[n(a.config.usePath[r])]=n(s[r]);}return p;};i.createHash=function(p){if(!a.config.usePath){b.apply(this,arguments);return;}var o=i.encode,n=[];a.Array.each(a.config.usePath,function(r,q){if(f.isValue(p[r])){n.push(p[r]);}});return n.join("/");};},"@VERSION@",{skinnable:false,requires:["history"]});