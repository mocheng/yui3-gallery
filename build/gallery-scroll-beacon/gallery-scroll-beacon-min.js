YUI.add("gallery-scroll-beacon",function(c){var a=c.config.scrollBeaconInterval||100,b="beacon:reached";c.Event.define(b,{_attach:function(g,f,e,d){var h=d?"delegate":"on";if(d){h="delegate";if(!c.Lang.isString(d)){throw new Error("only string filter is supported");}f._nodeList=g.all(d);}else{h="on";f._nodeList=new c.NodeList(g);}f["_"+h+"Handle"]=c.later(a,this,this._checkBeacon,[g,f,e],true);this._checkBeacon(g,f,e);},_checkBeacon:function(f,e,d){e._nodeList.each(function(h,g){if(c.DOM.inViewportRegion(c.Node.getDOMNode(h),false)){if(!e._inViewport){d.fire({target:h,currentTarget:f});}e._inViewport=true;}else{e._inViewport=false;}});},_detach:function(d,f){var e=d["_"+f+"Handle"];if(e){e.cancel();}},on:function(f,e,d){this._attach.apply(this,arguments);},detach:function(e,d){this._detach(d,"on");},delegate:function(g,f,e,d){this._attach.apply(this,arguments);},detachDelegate:function(e,d){this._detach(d,"delegate");}});},"@VERSION@",{requires:["event","event-custom","event-simulate","node"],skinnable:false});