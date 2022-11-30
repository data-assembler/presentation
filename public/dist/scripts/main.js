"use strict";var touchStartEvent="touchstart mousedown",touchStopEvent="touchend mouseup",touchMoveEvent="touchmove mousemove";$.event.special.swipeupdown={setup:function(){var e=$(this);e.bind(touchStartEvent,(function(t){var i,n=t.originalEvent.touches?t.originalEvent.touches[0]:t,o={time:(new Date).getTime(),coords:[n.pageX,n.pageY],origin:$(t.target)};function s(e){if(o){var t=e.originalEvent.touches?e.originalEvent.touches[0]:e;i={time:(new Date).getTime(),coords:[t.pageX,t.pageY]},Math.abs(o.coords[1]-i.coords[1])>10&&e.preventDefault()}}e.bind(touchMoveEvent,s).one(touchStopEvent,(function(t){e.unbind(touchMoveEvent,s),o&&i&&i.time-o.time<1e3&&Math.abs(o.coords[1]-i.coords[1])>30&&Math.abs(o.coords[0]-i.coords[0])<75&&o.origin.trigger("swipeupdown").trigger(o.coords[1]>i.coords[1]?"swipeup":"swipedown"),o=i=void 0}))}))}},$.each({swipedown:"swipeupdown",swipeup:"swipeupdown"},(function(e,t){$.event.special[e]={setup:function(){$(this).bind(t,$.noop)}}}));var fullScreen={init:function(){var e=this;$(document).keydown((function(t){if(70===t.which)return e.toggle(),!1}))},cancel:function(){var e=document,t=e.cancelFullScreen||e.webkitCancelFullScreen||e.mozCancelFullScreen||e.exitFullscreen||e.webkitExitFullscreen;if(t)t.call(e);else if(void 0!==window.ActiveXObject){var i=new ActiveXObject("WScript.Shell");null!==i&&i.SendKeys("{F11}")}},request:function(e){var t=e.requestFullScreen||e.webkitRequestFullScreen||e.mozRequestFullScreen||e.msRequestFullscreen;if(t)t.call(e);else if(void 0!==window.ActiveXObject){var i=new ActiveXObject("WScript.Shell");null!==i&&i.SendKeys("{F11}")}return!1},toggle:function(e){return e||(e=document.body),document.fullScreenElement&&null!==document.fullScreenElement||document.mozFullScreen||document.webkitIsFullScreen?this.cancel():this.request(e),!1}},slideshow={slider:null,currentSlide:0,isBusy:!1,init:function(e){this.slider=$(e),document.location.hash&&(this.currentSlide=Number(document.location.hash.substring(1)),this.moveTo(this.currentSlide)),this.refreshSlideHeight();var t=this;$(document).keydown((function(e){return 38===e.which?(t.moveUp(),!1):40===e.which?(t.moveDown(),!1):void 0})),$(document).on("swipedown",(function(){t.moveUp()})),$(document).on("swipeup",(function(){t.moveDown()})),$(window).on("resize",(function(){t.refreshSlideHeight()}))},refreshSlideHeight:function(){this.slider.find(".slide").height($(window).height())},moveTo:function(e){if(!this.isBusy&&e>=0&&e<this.slider.find(".slide").length){this.isBusy=!0;var t=this;this.slider.animate({top:"-"+e*$(window).height()+"px"},1e3,(function(){t.currentSlide=e,document.location.hash=t.currentSlide.toString(),t.isBusy=!1}))}},moveDown:function(){this.moveTo(this.currentSlide+1)},moveUp:function(){this.moveTo(this.currentSlide-1)}};function reveal(e){var t=0,i=$(e).find("img");setInterval((function(){var e=(t+1)%i.length;$(i[t]).animate({opacity:0},200),$(i[e]).animate({opacity:1},300,(function(){t=e}))}),2e3)}function setupCounters(){$(".counter").on("click",(function(e){e.preventDefault();var t=$(this).find(".count");t.length>0&&t.text(Number(t.text())+1)}))}var reasonExample={data:{hard:[{text:"The technical barriers are pissing me off.",memoji:{name:"hard-1.png",position:"right"}},{text:"It’s too complex. I am scared of making any changes.",memoji:{name:"hard-2.png",position:"left"}},{text:"Why is this chart broken (again)?",memoji:{name:"hard-3.png",position:"right"}}],expensive:[{text:"We don’t have budget to hire more people.",memoji:{name:"expensive-1.png",position:"left"}}],slow:[{text:"Integrating all the data sources is a time killer.",memoji:{name:"slow-1.png",position:"right"}}]},currReason:"hard",currExample:0,lastChange:-1,init:function(e){this.containerElem=$(e),this.textElem=this.containerElem.find("span"),this.memojiElem=this.containerElem.find("img"),this.start()},change:function(e,t){if(e!==this.currReason||t!==this.currExample){this.lastChange=(new Date).getTime(),this.currReason=e,this.currExample=t,this.hide();var i=this;setTimeout((function(){i.render()}),400),setTimeout((function(){i.show()}),500)}},hide:function(){this.memojiElem.removeClass("scale-100"),this.memojiElem.addClass("scale-0"),this.textElem.removeClass("opacity-100"),this.textElem.addClass("opacity-0")},show:function(){this.memojiElem.removeClass("scale-0"),this.memojiElem.addClass("scale-100"),this.textElem.removeClass("opacity-0"),this.textElem.addClass("opacity-100")},render:function(){var e=this.data[this.currReason][this.currExample];e&&(this.containerElem.hasClass("reason-example-"+e.memoji.position)||("left"===e.memoji.position?this.containerElem.removeClass("reason-example-right"):this.containerElem.removeClass("reason-example-left"),this.containerElem.addClass("reason-example-"+e.memoji.position)),this.textElem.text(e.text),this.memojiElem.attr("src","/dist/images/"+e.memoji.name))},start:function(){var e=this;setInterval((function(){var t=e.data[e.currReason];t.length>1&&(new Date).getTime()-e.lastChange>=3e3&&e.change(e.currReason,(e.currExample+1)%t.length)}),5e3)}};function handleReasonSelection(){$(".reason").on("click",(function(e){e.preventDefault(),$(".reason").removeClass("reason-active"),$(this).addClass("reason-active"),reasonExample.change($(this).data("key"),0)}))}function setupDashboard(){new ApexCharts(document.querySelector("#customers"),{chart:{type:"area",height:"100%",width:"100%",sparkline:{enabled:!0}},stroke:{curve:"smooth"},fill:{opacity:1},series:[{name:"Customers",data:[35,41,60,62,93,102,104,125,130,142,164,191]}],labels:["2022-01-01","2022-02-01","2022-03-01","2022-04-01","2022-05-01","2022-06-01","2022-07-01","2022-08-01","2022-09-01","2022-10-01","2022-11-01","2022-12-01"],yaxis:{min:0},xaxis:{type:"datetime"},colors:["#7CC4FA"]}).render(),new ApexCharts(document.querySelector("#sales"),{chart:{type:"bar",height:"100%",width:"100%",sparkline:{enabled:!0}},stroke:{curve:"smooth"},fill:{opacity:1},series:[{name:"Customers",data:[200,152,340,520,456,633,711,842,612,726,824,621]}],labels:["2022-01-01","2022-02-01","2022-03-01","2022-04-01","2022-05-01","2022-06-01","2022-07-01","2022-08-01","2022-09-01","2022-10-01","2022-11-01","2022-12-01"],yaxis:{min:0},xaxis:{type:"datetime"},colors:["#9FB3C8"]}).render()}$(document).ready((function(){fullScreen.init(),slideshow.init("#slider"),reveal("#data-is-here"),setTimeout((function(){reveal("#data-is-there")}),1e3),setupCounters(),handleReasonSelection(),reasonExample.init("#reason-example"),setupDashboard()}));
