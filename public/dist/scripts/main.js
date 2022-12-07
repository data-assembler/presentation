"use strict";var touchStartEvent="touchstart mousedown",touchStopEvent="touchend mouseup",touchMoveEvent="touchmove mousemove";function timeSince(e){const t=6e4,i=36e5,n=(new Date).getTime()-1e3*e;return n<t?0===Math.round(n/1e3)?"Now":Math.round(n/1e3)+" seconds ago":n<i?Math.round(n/t)+" minutes ago":n<864e5?Math.round(n/i)+" hours ago":formatDate(e)}function formatDate(e){var t=new Date(1e3*e);const i=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][t.getMonth()];var n=t.getHours(),o=t.getMinutes(),s=t.getSeconds();return n=(n<10?"0":"")+n,o=(o<10?"0":"")+o,s=(s<10?"0":"")+s,t.getDate()+" "+i+" "+t.getFullYear()+" "+n+":"+o+":"+s}function formatTime(e){return e?timeSince(e):""}$.event.special.swipeupdown={setup:function(){var e=$(this);e.bind(touchStartEvent,(function(t){var i,n=t.originalEvent.touches?t.originalEvent.touches[0]:t,o={time:(new Date).getTime(),coords:[n.pageX,n.pageY],origin:$(t.target)};function s(e){if(o){var t=e.originalEvent.touches?e.originalEvent.touches[0]:e;i={time:(new Date).getTime(),coords:[t.pageX,t.pageY]},Math.abs(o.coords[1]-i.coords[1])>10&&e.preventDefault()}}e.bind(touchMoveEvent,s).one(touchStopEvent,(function(t){e.unbind(touchMoveEvent,s),o&&i&&i.time-o.time<1e3&&Math.abs(o.coords[1]-i.coords[1])>30&&Math.abs(o.coords[0]-i.coords[0])<75&&o.origin.trigger("swipeupdown").trigger(o.coords[1]>i.coords[1]?"swipeup":"swipedown"),o=i=void 0}))}))}},$.each({swipedown:"swipeupdown",swipeup:"swipeupdown"},(function(e,t){$.event.special[e]={setup:function(){$(this).bind(t,$.noop)}}}));var fullScreen={init:function(){var e=this;$(document).keydown((function(t){if(70===t.which)return e.toggle(),!1}))},cancel:function(){var e=document,t=e.cancelFullScreen||e.webkitCancelFullScreen||e.mozCancelFullScreen||e.exitFullscreen||e.webkitExitFullscreen;if(t)t.call(e);else if(void 0!==window.ActiveXObject){var i=new ActiveXObject("WScript.Shell");null!==i&&i.SendKeys("{F11}")}},request:function(e){var t=e.requestFullScreen||e.webkitRequestFullScreen||e.mozRequestFullScreen||e.msRequestFullscreen;if(t)t.call(e);else if(void 0!==window.ActiveXObject){var i=new ActiveXObject("WScript.Shell");null!==i&&i.SendKeys("{F11}")}return!1},toggle:function(e){return e||(e=document.body),document.fullScreenElement&&null!==document.fullScreenElement||document.mozFullScreen||document.webkitIsFullScreen?this.cancel():this.request(e),!1}},slideshow={slider:null,currSlide:0,isBusy:!1,init:function(e,t,i,n){this.slider=$(e),this.progressElem=this.slider.find("#progress"),this.onReady=t,this.onMoveStart=i,this.onMoveEnd=n,this.setSlideHeight(),"function"==typeof this.onReady&&this.onReady();var o=this;document.location.hash?this.moveTo(Number(document.location.hash.substring(1)),null,(function(){o.start()})):this.start(),$(document).keydown((function(e){return 38===e.which?(o.moveUp(),!1):40===e.which?(o.moveDown(),!1):void 0})),$(document).on("swipedown",(function(){o.moveUp()})),$(document).on("swipeup",(function(){o.moveDown()})),$(window).on("resize",(function(){document.location.reload()}))},setSlideHeight:function(){this.slider.find(".slide").height($(window).height())},moveTo:function(e,t,i){if(!this.isBusy&&e>=0&&e<this.slider.find(".slide").length){this.isBusy=!0,"function"==typeof t&&t(this.currSlide,e),"function"==typeof this.onMoveStart&&this.onMoveStart(this.currSlide,e),this.updateProgress(e);var n=this;this.slider.animate({top:"-"+e*$(window).height()+"px"},1e3,(function(){"function"==typeof i&&i(n.currSlide,e),"function"==typeof n.onMoveEnd&&n.onMoveEnd(n.currSlide,e),n.currSlide=e,document.location.hash=n.currSlide.toString(),n.isBusy=!1}))}},moveDown:function(){this.moveTo(this.currSlide+1)},moveUp:function(){this.moveTo(this.currSlide-1)},updateProgress:function(e){this.progressElem.animate({width:(0===e?0:(e+1)/this.slider.find(".slide").length*100)+"%"},800)},start:function(){$("#loading").fadeOut()}};function reveal(e){var t=0,i=$(e).find("img");setInterval((function(){var e=(t+1)%i.length;$(i[t]).animate({opacity:0},200),$(i[e]).animate({opacity:1},300,(function(){t=e}))}),2e3)}function setupCounters(){$(".counter").on("click",(function(e){e.preventDefault();var t=$(this).find(".count");t.length>0&&t.text(Number(t.text())+1)}))}var reasonExample={isInitialized:!1,data:{hard:[{text:"The technical barriers are pissing me off.",memoji:{name:"hard-1.png",position:"right"}},{text:"It’s too complex. I am scared of making any changes.",memoji:{name:"hard-2.png",position:"left"}},{text:"Why is this chart broken (again)?",memoji:{name:"hard-3.png",position:"right"}}],expensive:[{text:"We don’t have budget to hire more people.",memoji:{name:"expensive-1.png",position:"left"}}],slow:[{text:"Integrating all the data sources is a time killer.",memoji:{name:"slow-1.png",position:"right"}}]},currReason:"hard",currExample:0,lastChange:-1,init:function(e){this.isInitialized||(this.isInitialized=!0,this.containerElem=$(e),this.textElem=this.containerElem.find("span"),this.memojiElem=this.containerElem.find("img"),this.start())},change:function(e,t){if(e!==this.currReason||t!==this.currExample){this.lastChange=(new Date).getTime(),this.currReason=e,this.currExample=t,this.hide();var i=this;setTimeout((function(){i.render()}),400),setTimeout((function(){i.memojiElem.hasClass("loaded")?i.show():i.memojiElem.on("load",(function(){i.show()}))}),500)}},hide:function(){this.memojiElem.removeClass("scale-100"),this.memojiElem.addClass("scale-0"),this.textElem.removeClass("opacity-100"),this.textElem.addClass("opacity-0")},show:function(){this.memojiElem.removeClass("scale-0"),this.memojiElem.addClass("scale-100"),this.textElem.removeClass("opacity-0"),this.textElem.addClass("opacity-100")},render:function(){var e=this.data[this.currReason][this.currExample];if(e){this.containerElem.hasClass("reason-example-"+e.memoji.position)||("left"===e.memoji.position?this.containerElem.removeClass("reason-example-right"):this.containerElem.removeClass("reason-example-left"),this.containerElem.addClass("reason-example-"+e.memoji.position)),this.textElem.text(e.text),this.memojiElem.removeClass("loaded"),this.memojiElem.off("load");var t=this;this.memojiElem.on("load",(function(){console.log("loaded"),t.memojiElem.addClass("loaded")})),this.memojiElem.attr("src","/dist/images/"+e.memoji.name)}},start:function(){var e=this;setInterval((function(){var t=e.data[e.currReason];t.length>1&&(new Date).getTime()-e.lastChange>=3e3&&e.change(e.currReason,(e.currExample+1)%t.length)}),5e3)}};function handleReasonSelection(){$(".reason").on("click",(function(e){e.preventDefault(),$(".reason").removeClass("reason-active"),$(this).addClass("reason-active"),reasonExample.change($(this).data("key"),0)}))}var dashboard={isInitialized:!1,init:function(){this.isInitialized||(this.isInitialized=!0,this.initCustomersSales("#customers"),this.initSalesChart("#sales"),this.initSignupsChart("#signups"))},initCustomersSales:function(e){new ApexCharts(document.querySelector(e),{chart:{type:"area",height:"100%",width:"100%",sparkline:{enabled:!0}},stroke:{curve:"smooth"},fill:{opacity:1},series:[{name:"Customers",data:[35,41,60,62,93,102,104,125,130,142,164,191]}],labels:["2022-01-01","2022-02-01","2022-03-01","2022-04-01","2022-05-01","2022-06-01","2022-07-01","2022-08-01","2022-09-01","2022-10-01","2022-11-01","2022-12-01"],yaxis:{min:0},xaxis:{type:"datetime"},colors:["#7CC4FA"]}).render()},initSalesChart:function(e){new ApexCharts(document.querySelector(e),{chart:{type:"bar",height:"100%",width:"100%",sparkline:{enabled:!0}},stroke:{curve:"smooth"},fill:{opacity:1},series:[{name:"Customers",data:[200,152,340,520,456,633,711,842,612,726,824,621]}],labels:["2022-01-01","2022-02-01","2022-03-01","2022-04-01","2022-05-01","2022-06-01","2022-07-01","2022-08-01","2022-09-01","2022-10-01","2022-11-01","2022-12-01"],yaxis:{min:0},xaxis:{type:"datetime"},colors:["#9FB3C8"]}).render()},initSignupsChart:function(e){new ApexCharts(document.querySelector(e),{series:[{name:"Visits",data:[310,401,366,435,578,402,604,724,679,783,901,855]}],chart:{height:"100%",width:"100%",type:"line",toolbar:{show:!1},zoom:{enabled:!1}},stroke:{width:4,curve:"smooth"},xaxis:{type:"category",categories:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]},fill:{type:"gradient",gradient:{shade:"dark",gradientToColors:["#FDD835"],shadeIntensity:1,type:"horizontal",opacityFrom:1,opacityTo:1,stops:[0,100,100,100]}},yaxis:{min:0,tickAmount:6}}).render()}},widget={position:"up",isInitialized:!1,init:function(e,t){this.isInitialized||(this.isInitialized=!0,this.widgetElem=$(e),this.widgetContainerElem=$(t))},moveDown:function(){if("down"!==this.position){this.widgetContainerElem.height(this.widgetElem.height()),this.widgetElem.data("orig-position",this.widgetElem.position().top),this.widgetElem.css({height:this.widgetElem.height()+"px",width:this.widgetElem.width()+"px",position:"absolute"});var e=this;this.widgetElem.animate({top:$(window).height()+this.widgetContainerElem.position().top+"px"},800,(function(){e.position="down"}))}},moveUp:function(){if("up"!==this.position){var e=this;this.widgetElem.animate({top:this.widgetElem.data("orig-position")+"px"},800,(function(){e.widgetElem.css({height:"auto",width:"100%",top:"auto",position:"relative"}),e.position="up"}))}}},workflow={isInitialized:!1,init:function(e,t,i){this.isInitialized||(this.workflowElem=$(e),this.widgetContainerElem=$(t),this.widgetWorkflowTunnelElem=$(i),this.runTimeElem=this.workflowElem.find(".run-time"),this.runBtnElem=this.workflowElem.find(".run-btn"),this.refreshRunTime((new Date).getTime()/1e3-3600),this.watchRunTime(),this.handleRun())},handleRun:function(){var e=this;this.runBtnElem.on("click",(function(t){if(t.preventDefault(),!e.runBtnElem.hasClass("running")){e.runBtnElem.addClass("running"),e.refreshRunTime((new Date).getTime()/1e3);var i=$('<div class="absolute bottom-[-20px] left-[50%] -translate-x-[50%] w-[20px] h-[20px] rounded-full bg-purple-500"></div>');e.widgetWorkflowTunnelElem.append(i),i.animate({bottom:"120%"},800,(function(){i.remove(),e.runBtnElem.removeClass("running")}))}}))},refreshRunTime:function(e){this.lastRunTime=e,this.runTimeElem.text(formatTime(e))},watchRunTime:function(){var e=this;setInterval((function(){e.refreshRunTime(e.lastRunTime)}),1e4)},showTunnel:function(){var e=this.workflowElem.offset().top-(this.widgetContainerElem.offset().top+this.widgetContainerElem.height());this.widgetWorkflowTunnelElem.animate({height:e+"px"},800)},hideTunnel:function(){this.widgetWorkflowTunnelElem.css({height:0})}};$(document).ready((function(){history.scrollRestoration="manual",$(window).on("beforeunload",(function(){$("#loading").show(),$(window).scrollTop(0)}));var e=2,t=4,i=5,n=6;fullScreen.init(),slideshow.init("#slider",(function(){reveal("#data-is-here"),setTimeout((function(){reveal("#data-is-there")}),1e3),setupCounters(),handleReasonSelection(),widget.init("#widget","#widget-container"),workflow.init("#workflow","#widget-container","#widget-workflow-tunnel")}),(function(e,t){e<i&&t>=i?widget.moveDown():e>=i&&t<i&&(workflow.hideTunnel(),widget.moveUp()),e<n&&t>=n&&workflow.showTunnel()}),(function(i,n){i<e&&n>=e&&reasonExample.init("#reason-example"),i<t&&n>=t&&dashboard.init()}))}));
