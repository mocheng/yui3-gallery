YUI.add("gallery-accordion",function(a){(function(){var U=a.Lang,v=a.Node,z=a.Anim,h=a.Easing,n="accordion",x=a.WidgetStdMod,S=document.compatMode=="BackCompat",t=S&&a.UA.ie>0,u=t?1:0,j=a.ClassNameManager.getClassName,w="yui3-accordion-item",F=j(n,"proxyel","visible"),H=j(n,"graggroup"),B="beforeItemAdd",E="itemAdded",d="beforeItemRemove",I="itemRemoved",c="beforeItemResized",P="itemResized",D="beforeItemExpand",G="beforeItemCollapse",k="itemExpanded",M="itemCollapsed",J="beforeItemReorder",r="beforeEndItemReorder",s="itemReordered",K="default",o="animation",p="alwaysVisible",e="expanded",C="collapseOthersOnExpand",y="items",T="contentHeight",b="iconClose",f="iconAlwaysVisible",g="stretch",R="px",A="contentBox",N="boundingBox",i="srcNode",L="rendered",O="bodyContent",q="children",l="parentNode",Q="node",m="data";a.Accordion=a.Base.create(n,a.Widget,[],{initializer:function(V){this.after("render",a.bind(this._afterRender,this));},destructor:function(){var V,Y,W,X;V=this.get(y);X=V.length;for(W=X-1;W>=0;W--){Y=V[W];V.splice(W,1);this._removeItemHandles(Y);Y.destroy();}},_bindItemChosenEvent:function(W){var V;V=this.get(A);V.delegate(W,a.bind(this._onItemChosenEvent,this),".yui3-widget-hd");},_forCollapsing:{},_forExpanding:{},_animations:{},_itemsHandles:{},_removeItemHandles:function(X){var W,V;W=this._itemsHandles[X];for(V in W){if(W.hasOwnProperty(V)){V=W[V];V.detach();}}delete this._itemsHandles[X];},_getNodeOffsetHeight:function(X){var V,W;if(X instanceof v){if(X.hasMethod("getBoundingClientRect")){W=X.invoke("getBoundingClientRect");if(W){V=W.bottom-W.top;return V;}}else{V=X.get("offsetHeight");return a.Lang.isValue(V)?V:0;}}else{if(X){V=X.offsetHeight;return a.Lang.isValue(V)?V:0;}}return 0;},_setItemProperties:function(X,Z,W){var V,Y;V=X.get(p);Y=X.get(e);if(Z!=Y){X.set(e,Z,{internalCall:true});}if(W!==V){X.set(p,W,{internalCall:true});}},_setItemUI:function(W,X,V){W.markAsExpanded(X);W.markAsAlwaysVisible(V);},_afterRender:function(W){var V;V=this.get("resizeEvent");this._setUpResizing(V);this.after("resizeEventChange",a.bind(this._afterResizeEventChange,this));},_afterResizeEventChange:function(V){this._setUpResizing(V.newVal);},_onItemChosen:function(aa,ab,V){var Z,X,Y,W;Z={};W=this.get(C);X=aa.get(p);Y=aa.get(e);if(V){this.removeItem(aa);return;}else{if(ab){if(Y){X=!X;Y=X?true:Y;this._setItemProperties(aa,Y,X);this._setItemUI(aa,Y,X);return;}else{this._forExpanding[aa]={"item":aa,alwaysVisible:true};if(W){Z[aa]={"item":aa};this._storeItemsForCollapsing(Z);}}}else{if(Y){this._forCollapsing[aa]={"item":aa};}else{this._forExpanding[aa]={"item":aa,"alwaysVisible":X};if(W){Z[aa]={"item":aa};this._storeItemsForCollapsing(Z);}}}}this._processItems();},_adjustStretchItems:function(){var W=this.get(y),X,V;X=this._getHeightPerStretchItem();V=this._forExpanding;a.Array.each(W,function(ac,ab,aa){var Y,ae,ad,af,Z;af=ac.get(T);Z=ac.get(e);if(!V[ac]&&af.method===g&&Z){ad=this._animations[ac];if(ad){ad.stop();}Y=ac.getStdModNode(x.BODY);ae=this._getNodeOffsetHeight(Y);if(X<ae){this._processCollapsing(ac,X);}else{if(X>ae){this._processExpanding(ac,X);}}}},this);return X;},_getHeightPerStretchItem:function(){var V,X,W=0;X=this.get(y);V=this.get(N).get("clientHeight");a.Array.each(X,function(ac,ab,aa){var ad,Z,af,ae,Y;af=ac.getStdModNode(x.HEADER);ae=ac.get(T);Y=this._getNodeOffsetHeight(af);V-=Y;ad=!ac.get(e);if(ad){V-=u;return;}if(ae.method===g){W++;}else{Z=this._getItemContentHeight(ac);V-=Z;}},this);if(W>0){V/=W;}if(V<0){V=0;}return V;},_getItemContentHeight:function(X){var Z,W=0,V,Y;Z=X.get(T);if(Z.method==="auto"){V=X.getStdModNode(x.BODY);Y=V.get(q).item(0);W=Y?this._getNodeOffsetHeight(Y):0;}else{if(Z.method==="fixed"){W=Z.height;}else{W=this._getHeightPerStretchItem();}}return W;},_storeItemsForCollapsing:function(W){var V;W=W||{};V=this.get(y);a.Array.each(V,function(ab,aa,Z){var Y,X;Y=ab.get(e);X=ab.get(p);if(Y&&!X&&!W[ab]){this._forCollapsing[ab]={"item":ab};}},this);},_expandItem:function(X,V){var W=X.get(p);this._processExpanding(X,V);this._setItemUI(X,true,W);},_processExpanding:function(ac,ab,V){var W,X,Z,ad=false,aa,Y;Y=ac.getStdModNode(x.BODY);this.fire(c,{"item":ac});if(Y.get("clientHeight")<=u){ad=true;this.fire(D,{"item":ac});}if(!V&&this.get("useAnimation")){Z=ac.get(o)||{};W=new z({node:Y,to:{"height":ab}});W.on("end",a.bind(this._onExpandComplete,this,ac,ad));aa=this.get(o);W.set("duration",Z.duration||aa.duration);W.set("easing",Z.easing||aa.easing);X=this._animations[ac];if(X){X.stop();}ac.markAsExpanding(true);this._animations[ac]=W;W.run();}else{Y.setStyle("height",ab+R);this.fire(P,{"item":ac});if(ad){this.fire(k,{"item":ac});}}},_onExpandComplete:function(V,W){delete this._animations[V];V.markAsExpanding(false);this.fire(P,{"item":V});if(W){this.fire(k,{"item":V});}},_collapseItem:function(V){this._processCollapsing(V,u);this._setItemUI(V,false,false);},_processCollapsing:function(ac,ab,V){var W,X,Z,aa,Y,ad=(ab===u);Y=ac.getStdModNode(x.BODY);this.fire(c,{"item":ac});if(ad){this.fire(G,{"item":ac});}if(!V&&this.get("useAnimation")){Z=ac.get(o)||{};W=new z({node:Y,to:{"height":ab}});W.on("end",a.bind(this._onCollapseComplete,this,ac,ad));aa=this.get(o);W.set("duration",Z.duration||aa.duration);W.set("easing",Z.easing||aa.easing);X=this._animations[ac];if(X){X.stop();}ac.markAsCollapsing(true);this._animations[ac]=W;W.run();}else{Y.setStyle("height",ab+R);this.fire(P,{"item":ac});if(ad){this.fire(M,{"item":ac});}}},_onCollapseComplete:function(V,W){delete this._animations[V];V.markAsCollapsing(false);this.fire(P,{item:V});if(W){this.fire(M,{"item":V});}},_initItemDragDrop:function(W){var aa,V,Z,X,Y;aa=W.getStdModNode(x.HEADER);if(aa.dd){return;}Z=this.get(N);X=W.get(N);V=new a.DD.Drag({node:aa,groups:[H]}).plug(a.Plugin.DDProxy,{moveOnEnd:false}).plug(a.Plugin.DDConstrained,{constrain2node:Z});Y=new a.DD.Drop({node:X,groups:[H]});V.on("drag:start",a.bind(this._onDragStart,this,V));V.on("drag:end",a.bind(this._onDragEnd,this,V));V.after("drag:end",a.bind(this._afterDragEnd,this,V));
V.on("drag:drophit",a.bind(this._onDropHit,this,V));},_onDragStart:function(V,Y){var X,W;W=this.getItem(V.get(Q).get(l));X=V.get("dragNode");X.addClass(F);X.set("innerHTML",W.get("label"));return this.fire(J,{"item":W});},_onDragEnd:function(V,Y){var X,W;X=V.get("dragNode");X.removeClass(F);X.set("innerHTML","");W=this.getItem(V.get(Q).get(l));return this.fire(r,{"item":W});},_afterDragEnd:function(V,Y){var W,X;X=V.get(m);if(X.drophit){W=this.getItem(V.get(Q).get(l));V.set(m,{drophit:false});return this.fire(s,{"item":W});}return true;},_onDropHit:function(ae,aa){var Z,ad,W,ac,Y,V,ab,X,af;af=this.getItem(ae.get(Q).get(l));X=this.getItem(aa.drop.get(Q));if(X===af){return false;}Z=this.getItemIndex(af);ad=this.getItemIndex(X);W=X.get(N);ac=af.get(N);Y=this.get(A);V=false;ab=this.get(y);if(ad<Z){V=true;}Y.removeChild(ac);if(V){Y.insertBefore(ac,W);ab.splice(Z,1);ab.splice(ad,0,af);}else{Y.insertBefore(ac,W.next(w));ab.splice(ad+1,0,af);ab.splice(Z,1);}ae.set(m,{drophit:true});return true;},_processItems:function(){var X,W,Y,aa,V,ab,Z;X=this._forCollapsing;W=this._forExpanding;this._setItemsProperties();for(Z in X){if(X.hasOwnProperty(Z)){Y=X[Z];this._collapseItem(Y.item);}}aa=this._adjustStretchItems();for(Z in W){if(W.hasOwnProperty(Z)){Y=W[Z];Z=Y.item;V=aa;ab=Z.get(T);if(ab.method!==g){V=this._getItemContentHeight(Z);}this._expandItem(Z,V);}}this._forCollapsing={};this._forExpanding={};},_setItemsProperties:function(){var X,W,V;X=this._forCollapsing;W=this._forExpanding;for(V in X){if(X.hasOwnProperty(V)){V=X[V];this._setItemProperties(V.item,false,false);}}for(V in W){if(W.hasOwnProperty(V)){V=W[V];this._setItemProperties(V.item,true,V.alwaysVisible);}}},_afterItemExpand:function(Z){var X,Y,W,V;if(Z.internalCall){return;}X=Z.newVal;Y=Z.currentTarget;W=Y.get(p);V=this.get(C);if(X){this._forExpanding[Y]={"item":Y,"alwaysVisible":W};if(V){this._storeItemsForCollapsing();}}else{this._forCollapsing[Y]={"item":Y};}this._processItems();},_afterItemAlwaysVisible:function(Y){var X,V,W;if(Y.internalCall){return;}V=Y.newVal;X=Y.currentTarget;W=X.get(e);if(V){if(W){this._setItemProperties(X,true,true);this._setItemUI(X,true,true);return;}else{this._forExpanding[X]={"item":X,"alwaysVisible":true};this._storeItemsForCollapsing();}}else{if(W){this._setItemUI(X,true,false);return;}else{return;}}this._processItems();},_afterContentHeight:function(aa){var Y,W,V,Z,X;Y=aa.currentTarget;this._adjustStretchItems();if(aa.newVal.method!==g){X=Y.get(e);W=this._getItemContentHeight(Y);V=Y.getStdModNode(x.BODY);Z=this._getNodeOffsetHeight(V);if(W<Z){this._processCollapsing(Y,W,!X);}else{if(W>Z){this._processExpanding(Y,W,!X);}}}},_afterContentUpdate:function(aa){var X,V,Z,W,ab,Y;X=aa.currentTarget;ab=X.get("contentHeight").method==="auto";W=X.get(e);V=X.getStdModNode(x.BODY);Z=this._getNodeOffsetHeight(V);if(ab&&W&&aa.src!==a.Widget.UI_SRC){a.later(0,this,function(){var ac=this._getItemContentHeight(X);if(ac!==Z){Y=this._animations[X];if(Y){Y.stop();}this._adjustStretchItems();if(ac<Z){this._processCollapsing(X,ac,!W);}else{if(ac>Z){this._processExpanding(X,ac,!W);}}}});}},_setUpResizing:function(V){if(this._resizeEventHandle){this._resizeEventHandle.detach();}if(V===K){this._resizeEventHandle=a.on("windowresize",a.bind(this._adjustStretchItems,this));}else{this._resizeEventHandle=V.sourceObject.on(V.resizeEvent,a.bind(this._adjustStretchItems,this));}},renderUI:function(){var Y,X,W,V;Y=this.get(i);W=this.get(A);V=Y.get("id");W.set("id",V);X=Y.all("> ."+w);X.each(function(ac,Z,ab){var aa;if(!this.getItem(ac)){aa=new a.AccordionItem({srcNode:ac,id:ac.get("id")});this.addItem(aa);}},this);},bindUI:function(){var V,X,W;X=this.get("itemChosen");if(U.isArray(X)){W=X.length;for(V=0;V<W;V++){this._bindItemChosenEvent(X[V]);}}else{this._bindItemChosenEvent(X);}},_onItemChosenEvent:function(aa){var ac,ab,X,Y,W,Z,V;ac=aa.currentTarget;ab=ac.get(l);X=this.getItem(ab);Y=X.get(f);W=X.get(b);Z=(Y===aa.target);V=(W===aa.target);this._onItemChosen(X,Z,V);},addItem:function(ah,X){var ab,af,Z,aa,V,ae,ad,ag,Y,ac,W;ac=this.fire(B,{"item":ah});if(!ac){return false;}ae=this.get(y);ad=this.get(A);Y=ah.get(A);if(!Y.inDoc()){if(X){V=this.getItemIndex(X);if(V<0){return false;}ae.splice(V,0,ah);ad.insertBefore(Y,X.get(N));}else{ae.push(ah);ad.insertBefore(Y,null);}}else{W=ad.get(q);ac=W.some(function(ak,aj,ai){if(ak===Y){ae.splice(aj,0,ah);return true;}else{return false;}},this);if(!ac){return false;}}Z=ah.getStdModNode(x.BODY);aa=ah.get(O);if(!Z&&!aa){ah.set(O,"");}if(!ah.get(L)){ah.render();}ab=ah.get(e);af=ah.get(p);ab=ab||af;if(ab){this._forExpanding[ah]={"item":ah,"alwaysVisible":af};}else{this._forCollapsing[ah]={"item":ah};}this._processItems();if(this.get("reorderItems")){this._initItemDragDrop(ah);}ag=this._itemsHandles[ah];if(!ag){ag={};}ag={"expandedChange":ah.after("expandedChange",a.bind(this._afterItemExpand,this)),"alwaysVisibleChange":ah.after("alwaysVisibleChange",a.bind(this._afterItemAlwaysVisible,this)),"contentHeightChange":ah.after("contentHeightChange",a.bind(this._afterContentHeight,this)),"contentUpdate":ah.after("contentUpdate",a.bind(this._afterContentUpdate,this))};this._itemsHandles[ah]=ag;this.fire(E,{"item":ah});return true;},removeItem:function(W){var V,aa,Y=null,X,Z;V=this.get(y);if(U.isNumber(W)){X=W;}else{if(W instanceof a.AccordionItem){X=this.getItemIndex(W);}else{return null;}}if(X>=0){Z=this.fire(d,{item:W});if(!Z){return null;}Y=V.splice(X,1)[0];this._removeItemHandles(Y);aa=Y.get(N);aa.remove();this._adjustStretchItems();this.fire(I,{item:W});}return Y;},getItem:function(X){var V=this.get(y),W=null;if(U.isNumber(X)){W=V[X];return(W instanceof a.AccordionItem)?W:null;}else{if(X instanceof v){a.Array.some(V,function(ab,aa,Z){var Y=ab.get(A);if(Y===X){W=ab;return true;}else{return false;}},this);}}return W;},getItemIndex:function(X){var W=-1,V;if(X instanceof a.AccordionItem){V=this.get(y);a.Array.some(V,function(aa,Z,Y){if(aa===X){W=Z;return true;}else{return false;}},this);}return W;},_findStdModSection:function(V){return this.get(i).one("> ."+a.WidgetStdMod.SECTION_CLASS_NAMES[V]);
},CONTENT_TEMPLATE:null},{NAME:n,ATTRS:{itemChosen:{value:"click",validator:function(V){return U.isString(V)||U.isArray(V);}},items:{value:[],readOnly:true,validator:U.isArray},resizeEvent:{value:K,validator:function(V){if(V===K){return true;}else{if(U.isObject(V)){if(U.isValue(V.sourceObject)&&U.isValue(V.resizeEvent)){return true;}}}return false;}},useAnimation:{value:true,validator:U.isBoolean},animation:{value:{duration:1,easing:h.easeOutStrong},validator:function(V){return U.isObject(V)&&U.isNumber(V.duration)&&U.isFunction(V.easing);}},reorderItems:{value:false,validator:function(V){return U.isBoolean(V)&&!U.isUndefined(a.DD);}},collapseOthersOnExpand:{value:true,validator:U.isBoolean}}});}());(function(){var U=a.Lang,B=a.Node,p=a.JSON,C=a.WidgetStdMod,D="accordion-item",n=a.ClassNameManager.getClassName,d=n(D,"iconexpanded","expanding"),S=n(D,"iconexpanded","collapsing"),o=n(D,"icon"),k=n(D,"label"),O=n(D,"iconalwaysvisible"),F=n(D,"icons"),M=n(D,"iconexpanded"),J=n(D,"iconclose"),q=n(D,"iconclose","hidden"),s=n(D,"iconexpanded","on"),l=n(D,"iconexpanded","off"),e=n(D,"iconalwaysvisible","on"),K=n(D,"iconalwaysvisible","off"),y=n(D,"expanded"),v=n(D,"closable"),H=n(D,"alwaysvisible"),I=n(D,"contentheight"),L="title",c="strings",Q="rendered",h="className",E="auto",j="stretch",w="fixed",t=".yui3-widget-hd",z=".",N=".yui3-widget-hd "+z,R="innerHTML",T="iconsContainer",G="icon",r="nodeLabel",g="iconAlwaysVisible",A="iconExpanded",b="iconClose",P="href",u="#",f="yuiConfig",i=/^(?:true|yes|1)$/,m=/^auto\s*/,V=/^stretch\s*/,x=/^fixed-\d+/;a.AccordionItem=a.Base.create(D,a.Widget,[a.WidgetStdMod],{_createHeader:function(){var ae,ac,ad,aa,ab,Z,X,W,Y;ab=this.get(G);Z=this.get(r);X=this.get(A);W=this.get(g);Y=this.get(b);aa=this.get(T);ad=this.get(c);ae=this.get("closable");ac=a.AccordionItem.TEMPLATES;if(!ab){ab=B.create(ac.icon);this.set(G,ab);}if(!Z){Z=B.create(ac.label);this.set(r,Z);}else{if(!Z.hasAttribute(P)){Z.setAttribute(P,u);}}Z.setContent(this.get("label"));if(!aa){aa=B.create(ac.iconsContainer);this.set(T,aa);}if(!W){W=B.create(ac.iconAlwaysVisible);W.setAttribute(L,ad.title_always_visible_off);this.set(g,W);}else{if(!W.hasAttribute(P)){W.setAttribute(P,u);}}if(!X){X=B.create(ac.iconExpanded);X.setAttribute(L,ad.title_iconexpanded_off);this.set(A,X);}else{if(!X.hasAttribute(P)){X.setAttribute(P,u);}}if(!Y){Y=B.create(ac.iconClose);Y.setAttribute(L,ad.title_iconclose);this.set(b,Y);}else{if(!Y.hasAttribute(P)){Y.setAttribute(P,u);}}if(ae){Y.removeClass(q);}else{Y.addClass(q);}this._addHeaderComponents();},_addHeaderComponents:function(){var ac,X,ab,Y,aa,Z,W;X=this.get(G);ab=this.get(r);aa=this.get(A);Z=this.get(g);W=this.get(b);Y=this.get(T);ac=this.getStdModNode(C.HEADER);if(!ac){ac=new B(document.createDocumentFragment());ac.appendChild(X);ac.appendChild(ab);ac.appendChild(Y);Y.appendChild(Z);Y.appendChild(aa);Y.appendChild(W);this.setStdModContent(C.HEADER,ac,C.REPLACE);}else{if(!ac.contains(X)){if(ac.contains(ab)){ac.insertBefore(X,ab);}else{ac.appendChild(X);}}if(!ac.contains(ab)){ac.appendChild(ab);}if(!ac.contains(Y)){ac.appendChild(Y);}if(!Y.contains(Z)){Y.appendChild(Z);}if(!Y.contains(aa)){Y.appendChild(aa);}if(!Y.contains(W)){Y.appendChild(W);}}},_labelChanged:function(X){var W;if(this.get(Q)){W=this.get(r);W.set(R,X.newVal);}},_closableChanged:function(X){var W;if(this.get(Q)){W=this.get(b);if(X.newVal){W.removeClass(q);}else{W.addClass(q);}}},initializer:function(W){this.after("labelChange",a.bind(this._labelChanged,this));this.after("closableChange",a.bind(this._closableChanged,this));},destructor:function(){},renderUI:function(){this._createHeader();},bindUI:function(){var W=this.get("contentBox");W.delegate("click",a.bind(this._onLinkClick,this),t+" a");},_onLinkClick:function(W){W.preventDefault();},markAsAlwaysVisible:function(X){var Y,W;Y=this.get(g);W=this.get(c);if(X){if(!Y.hasClass(e)){Y.replaceClass(K,e);Y.set(L,W.title_always_visible_on);return true;}}else{if(Y.hasClass(e)){Y.replaceClass(e,K);Y.set(L,W.title_always_visible_off);return true;}}return false;},markAsExpanded:function(X){var W,Y;Y=this.get(A);W=this.get(c);if(X){if(!Y.hasClass(s)){Y.replaceClass(l,s);Y.set(L,W.title_iconexpanded_on);return true;}}else{if(Y.hasClass(s)){Y.replaceClass(s,l);Y.set(L,W.title_iconexpanded_off);return true;}}return false;},markAsExpanding:function(X){var W=this.get(A);if(X){if(!W.hasClass(d)){W.addClass(d);return true;}}else{if(W.hasClass(d)){W.removeClass(d);return true;}}return false;},markAsCollapsing:function(W){var X=this.get(A);if(W){if(!X.hasClass(S)){X.addClass(S);return true;}}else{if(X.hasClass(S)){X.removeClass(S);return true;}}return false;},resize:function(){this.fire("contentUpdate");},_extractFixedMethodValue:function(aa){var X,Z,Y,W=null;for(X=6,Z=aa.length;X<Z;X++){Y=aa.charAt(X);Y=parseInt(Y,10);if(U.isNumber(Y)){W=(W*10)+Y;}else{break;}}return W;},_validateIcon:function(W){return !this.get(Q)||W;},_validateNodeLabel:function(W){return !this.get(Q)||W;},_validateIconsContainer:function(W){return !this.get(Q)||W;},_validateIconExpanded:function(W){return !this.get(Q)||W;},_validateIconAlwaysVisible:function(W){return !this.get(Q)||W;},_validateIconClose:function(W){return !this.get(Q)||W;},_setIcon:function(W){return a.one(W)||null;},_setNodeLabel:function(W){return a.one(W)||null;},_setIconsContainer:function(W){return a.one(W)||null;},_setIconExpanded:function(W){return a.one(W)||null;},_setIconAlwaysVisible:function(W){return a.one(W)||null;},_setIconClose:function(W){return a.one(W)||null;},_applyParser:function(W){var X;X=this.get("srcNode");if(X){this._parsedYUIConfig=X.getAttribute(f);if(this._parsedYUIConfig){this._parsedYUIConfig=p.parse(this._parsedYUIConfig);}}a.AccordionItem.superclass._applyParser.apply(this,arguments);delete this._parsedYUIConfig;},_findStdModSection:function(W){return this.get("srcNode").one("> ."+a.WidgetStdMod.SECTION_CLASS_NAMES[W]);},CONTENT_TEMPLATE:null},{NAME:D,ATTRS:{icon:{value:null,validator:function(W){return this._validateIcon(W);
},setter:function(W){return this._setIcon(W);}},label:{value:"&#160;",validator:U.isString},nodeLabel:{value:null,validator:function(W){return this._validateNodeLabel(W);},setter:function(W){return this._setNodeLabel(W);}},iconsContainer:{value:null,validator:function(W){return this._validateIconsContainer(W);},setter:function(W){return this._setIconsContainer(W);}},iconExpanded:{value:null,validator:function(W){return this._validateIconExpanded(W);},setter:function(W){return this._setIconExpanded(W);}},iconAlwaysVisible:{value:null,validator:function(W){return this._validateIconAlwaysVisible(W);},setter:function(W){return this._setIconAlwaysVisible(W);}},iconClose:{value:null,validator:function(W){return this._validateIconClose(W);},setter:function(W){return this._setIconClose(W);}},expanded:{value:false,validator:U.isBoolean},contentHeight:{value:{method:E},validator:function(W){if(U.isObject(W)){if(W.method===E){return true;}else{if(W.method===j){return true;}else{if(W.method===w&&U.isNumber(W.height)&&W.height>=0){return true;}}}}return false;}},alwaysVisible:{value:false,validator:U.isBoolean},animation:{value:{},validator:U.isObject},strings:{value:{title_always_visible_off:"Click to set always visible on",title_always_visible_on:"Click to set always visible off",title_iconexpanded_off:"Click to expand",title_iconexpanded_on:"Click to collapse",title_iconclose:"Click to close"}},closable:{value:false,validator:U.isBoolean}},HTML_PARSER:{icon:N+o,label:function(Z){var Y,aa,X,W;X=this._parsedYUIConfig;if(X&&U.isValue(X.label)){return X.label;}W=Z.getAttribute("data-label");if(W){return W;}aa=N+k;Y=Z.one(aa);return(Y)?Y.get(R):null;},nodeLabel:N+k,iconsContainer:N+F,iconAlwaysVisible:N+O,iconExpanded:N+M,iconClose:N+J,expanded:function(Y){var X,W;X=this._parsedYUIConfig;if(X&&U.isBoolean(X.expanded)){return X.expanded;}W=Y.getAttribute("data-expanded");if(W){return i.test(W);}return Y.hasClass(y);},alwaysVisible:function(Y){var X,W;X=this._parsedYUIConfig;if(X&&U.isBoolean(X.alwaysVisible)){W=X.alwaysVisible;}else{W=Y.getAttribute("data-alwaysvisible");if(W){W=i.test(W);}else{W=Y.hasClass(H);}}if(W){this.set("expanded",true,{internalCall:true});}return W;},closable:function(Y){var X,W;X=this._parsedYUIConfig;if(X&&U.isBoolean(X.closable)){return X.closable;}W=Y.getAttribute("data-closable");if(W){return i.test(W);}return Y.hasClass(v);},contentHeight:function(ac){var aa,ab,W=0,X,Z,Y;Z=this._parsedYUIConfig;if(Z&&Z.contentHeight){return Z.contentHeight;}Y=ac.getAttribute("data-contentheight");if(m.test(Y)){return{method:E};}else{if(V.test(Y)){return{method:j};}else{if(x.test(Y)){W=this._extractFixedMethodValue(Y);return{method:w,height:W};}}}ab=ac.get(h);aa=I+"-";X=ab.indexOf(aa,0);if(X>=0){X+=aa.length;ab=ab.substring(X);if(m.test(ab)){return{method:E};}else{if(V.test(ab)){return{method:j};}else{if(x.test(ab)){W=this._extractFixedMethodValue(ab);return{method:w,height:W};}}}}return null;}},TEMPLATES:{icon:'<a class="'+o+'"></a>',label:'<a href="#" class="'+k+'"></a>',iconsContainer:'<div class="'+F+'"></div>',iconExpanded:['<a href="#" class="',M," ",l,'"></a>'].join(""),iconAlwaysVisible:['<a href="#" class="',O," ",K,'"></a>'].join(""),iconClose:['<a href="#" class="',J," ",q,'"></a>'].join("")}});}());},"gallery-2011.02.23-19-01",{optional:["dd-constrain","dd-proxy","dd-drop"],requires:["event","anim-easing","widget","widget-stdmod","json-parse"]});