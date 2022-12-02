"use strict";var touchStartEvent="touchstart mousedown",touchStopEvent="touchend mouseup",touchMoveEvent="touchmove mousemove";$.event.special.swipeupdown={setup:function(){var e=$(this);e.bind(touchStartEvent,(function(t){var i,n=t.originalEvent.touches?t.originalEvent.touches[0]:t,o={time:(new Date).getTime(),coords:[n.pageX,n.pageY],origin:$(t.target)};function s(e){if(o){var t=e.originalEvent.touches?e.originalEvent.touches[0]:e;i={time:(new Date).getTime(),coords:[t.pageX,t.pageY]},Math.abs(o.coords[1]-i.coords[1])>10&&e.preventDefault()}}e.bind(touchMoveEvent,s).one(touchStopEvent,(function(t){e.unbind(touchMoveEvent,s),o&&i&&i.time-o.time<1e3&&Math.abs(o.coords[1]-i.coords[1])>30&&Math.abs(o.coords[0]-i.coords[0])<75&&o.origin.trigger("swipeupdown").trigger(o.coords[1]>i.coords[1]?"swipeup":"swipedown"),o=i=void 0}))}))}},$.each({swipedown:"swipeupdown",swipeup:"swipeupdown"},(function(e,t){$.event.special[e]={setup:function(){$(this).bind(t,$.noop)}}}));var fullScreen={init:function(){var e=this;$(document).keydown((function(t){if(70===t.which)return e.toggle(),!1}))},cancel:function(){var e=document,t=e.cancelFullScreen||e.webkitCancelFullScreen||e.mozCancelFullScreen||e.exitFullscreen||e.webkitExitFullscreen;if(t)t.call(e);else if(void 0!==window.ActiveXObject){var i=new ActiveXObject("WScript.Shell");null!==i&&i.SendKeys("{F11}")}},request:function(e){var t=e.requestFullScreen||e.webkitRequestFullScreen||e.mozRequestFullScreen||e.msRequestFullscreen;if(t)t.call(e);else if(void 0!==window.ActiveXObject){var i=new ActiveXObject("WScript.Shell");null!==i&&i.SendKeys("{F11}")}return!1},toggle:function(e){return e||(e=document.body),document.fullScreenElement&&null!==document.fullScreenElement||document.mozFullScreen||document.webkitIsFullScreen?this.cancel():this.request(e),!1}},slideshow={slider:null,currentSlide:0,isBusy:!1,init:function(e,t,i,n){this.slider=$(e),this.onReady=t,this.setSlideHeight(),this.onChangeStart=i,this.onChangeEnd=n,document.location.hash?this.moveTo(Number(document.location.hash.substring(1)),null,this.onReady):"function"==typeof this.onReady&&this.onReady();var o=this;$(document).keydown((function(e){return 38===e.which?(o.moveUp(),!1):40===e.which?(o.moveDown(),!1):void 0})),$(document).on("swipedown",(function(){o.moveUp()})),$(document).on("swipeup",(function(){o.moveDown()})),$(window).on("resize",(function(){document.location.reload()}))},setSlideHeight:function(){this.slider.find(".slide").height($(window).height())},moveTo:function(e,t,i){if(!this.isBusy&&e>=0&&e<this.slider.find(".slide").length){this.isBusy=!0,"function"==typeof t&&t(this.currentSlide,e),"function"==typeof this.onChangeStart&&this.onChangeStart(this.currentSlide,e);var n=this;this.slider.animate({top:"-"+e*$(window).height()+"px"},1e3,(function(){"function"==typeof i&&i(n.currentSlide,e),"function"==typeof n.onChangeEnd&&n.onChangeEnd(n.currentSlide,e),n.currentSlide=e,document.location.hash=n.currentSlide.toString(),n.isBusy=!1}))}},moveDown:function(){this.moveTo(this.currentSlide+1)},moveUp:function(){this.moveTo(this.currentSlide-1)}};function reveal(e){var t=0,i=$(e).find("img");setInterval((function(){var e=(t+1)%i.length;$(i[t]).animate({opacity:0},200),$(i[e]).animate({opacity:1},300,(function(){t=e}))}),2e3)}function setupCounters(){$(".counter").on("click",(function(e){e.preventDefault();var t=$(this).find(".count");t.length>0&&t.text(Number(t.text())+1)}))}var reasonExample={isInitialized:!1,data:{hard:[{text:"The technical barriers are pissing me off.",memoji:{name:"hard-1.png",position:"right"}},{text:"It’s too complex. I am scared of making any changes.",memoji:{name:"hard-2.png",position:"left"}},{text:"Why is this chart broken (again)?",memoji:{name:"hard-3.png",position:"right"}}],expensive:[{text:"We don’t have budget to hire more people.",memoji:{name:"expensive-1.png",position:"left"}}],slow:[{text:"Integrating all the data sources is a time killer.",memoji:{name:"slow-1.png",position:"right"}}]},currReason:"hard",currExample:0,lastChange:-1,init:function(e){this.isInitialized||(this.isInitialized=!0,this.containerElem=$(e),this.textElem=this.containerElem.find("span"),this.memojiElem=this.containerElem.find("img"),this.start())},change:function(e,t){if(e!==this.currReason||t!==this.currExample){this.lastChange=(new Date).getTime(),this.currReason=e,this.currExample=t,this.hide();var i=this;setTimeout((function(){i.render()}),400),setTimeout((function(){i.show()}),500)}},hide:function(){this.memojiElem.removeClass("scale-100"),this.memojiElem.addClass("scale-0"),this.textElem.removeClass("opacity-100"),this.textElem.addClass("opacity-0")},show:function(){this.memojiElem.removeClass("scale-0"),this.memojiElem.addClass("scale-100"),this.textElem.removeClass("opacity-0"),this.textElem.addClass("opacity-100")},render:function(){var e=this.data[this.currReason][this.currExample];e&&(this.containerElem.hasClass("reason-example-"+e.memoji.position)||("left"===e.memoji.position?this.containerElem.removeClass("reason-example-right"):this.containerElem.removeClass("reason-example-left"),this.containerElem.addClass("reason-example-"+e.memoji.position)),this.textElem.text(e.text),this.memojiElem.attr("src","/dist/images/"+e.memoji.name))},start:function(){var e=this;setInterval((function(){var t=e.data[e.currReason];t.length>1&&(new Date).getTime()-e.lastChange>=3e3&&e.change(e.currReason,(e.currExample+1)%t.length)}),5e3)}};function handleReasonSelection(){$(".reason").on("click",(function(e){e.preventDefault(),$(".reason").removeClass("reason-active"),$(this).addClass("reason-active"),reasonExample.change($(this).data("key"),0)}))}var dashboard={isInitialized:!1,init:function(){this.isInitialized||(this.isInitialized=!0,this.initCustomersSales("#customers"),this.initSalesChart("#sales"),this.initSignupsChart("#signups"))},initCustomersSales:function(e){new ApexCharts(document.querySelector(e),{chart:{type:"area",height:"100%",width:"100%",sparkline:{enabled:!0}},stroke:{curve:"smooth"},fill:{opacity:1},series:[{name:"Customers",data:[35,41,60,62,93,102,104,125,130,142,164,191]}],labels:["2022-01-01","2022-02-01","2022-03-01","2022-04-01","2022-05-01","2022-06-01","2022-07-01","2022-08-01","2022-09-01","2022-10-01","2022-11-01","2022-12-01"],yaxis:{min:0},xaxis:{type:"datetime"},colors:["#7CC4FA"]}).render()},initSalesChart:function(e){new ApexCharts(document.querySelector(e),{chart:{type:"bar",height:"100%",width:"100%",sparkline:{enabled:!0}},stroke:{curve:"smooth"},fill:{opacity:1},series:[{name:"Customers",data:[200,152,340,520,456,633,711,842,612,726,824,621]}],labels:["2022-01-01","2022-02-01","2022-03-01","2022-04-01","2022-05-01","2022-06-01","2022-07-01","2022-08-01","2022-09-01","2022-10-01","2022-11-01","2022-12-01"],yaxis:{min:0},xaxis:{type:"datetime"},colors:["#9FB3C8"]}).render()},initSignupsChart:function(e){new ApexCharts(document.querySelector(e),{series:[{name:"Visits",data:[310,401,366,435,578,402,604,724,679,783,901,855]}],chart:{height:"100%",width:"100%",type:"line",toolbar:{show:!1},zoom:{enabled:!1}},stroke:{width:4,curve:"smooth"},xaxis:{type:"category",categories:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]},fill:{type:"gradient",gradient:{shade:"dark",gradientToColors:["#FDD835"],shadeIntensity:1,type:"horizontal",opacityFrom:1,opacityTo:1,stops:[0,100,100,100]}},yaxis:{min:0,tickAmount:6}}).render()}};$(document).ready((function(){history.scrollRestoration="manual",$(window).on("beforeunload",(function(){$("#loading").show(),$(window).scrollTop(0)})),fullScreen.init(),slideshow.init("#slider",(function(){reveal("#data-is-here"),setTimeout((function(){reveal("#data-is-there")}),1e3),setupCounters(),handleReasonSelection(),$("#workflow button").on("click",(function(e){e.preventDefault(),$(this).hasClass("running"),$(this).toggleClass("running")})),$("#loading").fadeOut()}),(function(e,t){var i=$("#widget"),n=$("#widget-container"),o=$("#widget-workflow-tunnel");i.length>0&&n.length>0&&o.length>0&&(e<5&&t>=5?(n.height(i.height()),i.data("orig-position",i.position().top),i.css({height:i.height()+"px",width:i.width()+"px",position:"absolute"}),i.animate({top:$(window).height()+n.position().top+"px"},800)):e>=5&&t<5&&(o.css({height:0}),i.animate({top:i.data("orig-position")+"px"},800,(function(){i.css({height:"auto",width:"100%",top:"auto",position:"relative"})}))));var s=$("#workflow");if(s.length>0&&n.length>0&&o.length>0&&e<6&&t>=6&&o.height()<=0){var a=s.offset().top-(n.offset().top+n.height());o.animate({height:a+"px"},800)}}),(function(e,t){e<2&&t>=2&&reasonExample.init("#reason-example");e<4&&t>=4&&dashboard.init()}))}));
