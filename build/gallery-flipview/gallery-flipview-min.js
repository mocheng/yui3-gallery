YUI.add("gallery-flipview",function(b){var a=15;b.FlipView=b.Base.create("flipview",b.Widget,[],{initializer:function(){this.cb=this.get("contentBox");},destructor:function(){},renderUI:function(){var c;this.pages=this.cb.get("children").filter(".page");this.pageWidth=parseInt(this.pages.item(0).getComputedStyle("width"));this.pageHeight=parseInt(this.pages.item(0).getComputedStyle("height"));this.cb.setStyles({width:this.pageWidth,height:this.pageHeight});c=this.pages.size();this.pages.each(function(e,d){if(d!=0){e.addClass("hidden");}},this);this.currPageIdx=0;},bindUI:function(){this.cb.on("flick",function(c){if(c.flick.distance<0){this.next();}else{this.prev();}},{minDistance:a,axis:"x",minVelocity:0,preventDefault:true},this);document.ontouchmove=function(c){c.preventDefault();};},next:function(){var k,j,c,f,h,e,g,d,i=this;if((this.currPageIdx>=this.pages.size()-1)||this.flipping){return;}this.flipping=true;k=this.pages.item(this.currPageIdx);f=this.pages.item(this.currPageIdx+1);f.removeClass("hidden");c=b.Node.create('<div class="left-clipper page"></div>').append(k);e=b.Node.create('<div class="right-clipper page"></div>').append(f);f.setStyles({"margin-left":-this.pageWidth/2});this.cb.append(c);this.cb.append(e);j=k.cloneNode(true);h=f.cloneNode(true);h.removeClass("hidden");j.setStyles({"margin-left":-this.pageWidth/2});h.setStyles({"margin-left":0});g=b.Node.create('<div class="right-flip page"></div>').append(j);g.setStyles({width:this.pageWidth/2});g.appendTo(this.cb);d=b.Node.create('<div class="left-flip page"></div>').append(h);d.setStyles({width:this.pageWidth/2});d.appendTo(this.cb);g.transition({easing:"ease-in-out",duration:this.get("flipDuration"),transform:"rotateY(-180deg)"},function(){});d.transition({easing:"ease-in-out",duration:this.get("flipDuration"),transform:"rotateY(0)"},function(){i.currPageIdx++;f.setStyles({"margin-left":0});k.addClass("hidden");f.appendTo(i.cb);k.appendTo(i.cb);c.remove();e.remove();g.remove();d.remove();i.flipping=false;});},prev:function(){var k,j,c,f,h,e,g,d,i=this;if((this.currPageIdx<=0)||this.flipping){return;}this.flipping=true;k=this.pages.item(this.currPageIdx);f=this.pages.item(this.currPageIdx-1);f.removeClass("hidden");c=b.Node.create('<div class="right-clipper page"></div>').append(k);e=b.Node.create('<div class="left-clipper page"></div>').append(f);k.setStyles({"margin-left":-this.pageWidth/2});this.cb.append(c);this.cb.append(e);j=k.cloneNode(true);h=f.cloneNode(true);h.removeClass("hidden");h.setStyles({"margin-left":-this.pageWidth/2});j.setStyles({"margin-left":0});g=b.Node.create('<div class="right-flip to-left page"></div>').append(h);g.setStyles({width:this.pageWidth/2});g.appendTo(this.cb);d=b.Node.create('<div class="left-flip to-left page"></div>').append(j);d.setStyles({width:this.pageWidth/2});d.appendTo(this.cb);g.transition({easing:"ease-in-out",duration:this.get("flipDuration"),transform:"rotateY(0deg)"},function(){});d.transition({easing:"ease-in-out",duration:this.get("flipDuration"),transform:"rotateY(180deg)"},function(){i.currPageIdx--;f.setStyles({"margin-left":0});k.addClass("hidden");f.appendTo(i.cb);k.appendTo(i.cb);c.remove();e.remove();g.remove();d.remove();i.flipping=false;});}},{NAME:"flipview",ATTRS:{flipDuration:{value:0.5}}});},"@VERSION@",{skinnable:false,requires:["base","widget","node","event-flick","transition"]});