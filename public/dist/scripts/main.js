"use strict";var isMobile={Android:function(){return navigator.userAgent.match(/Android/i)},BlackBerry:function(){return navigator.userAgent.match(/BlackBerry/i)},iOS:function(){return navigator.userAgent.match(/iPhone|iPad|iPod/i)},Opera:function(){return navigator.userAgent.match(/Opera Mini/i)},Windows:function(){return navigator.userAgent.match(/IEMobile/i)},any:function(){return isMobile.Android()||isMobile.BlackBerry()||isMobile.iOS()||isMobile.Opera()||isMobile.Windows()}},touchStartEvent="touchstart mousedown",touchStopEvent="touchend mouseup",touchMoveEvent="touchmove mousemove";$.event.special.swipeupdown={setup:function(){var e=$(this);e.bind(touchStartEvent,(function(i){var t,n=i.originalEvent.touches?i.originalEvent.touches[0]:i,o={time:(new Date).getTime(),coords:[n.pageX,n.pageY],origin:$(i.target)};function r(e){if(o){var i=e.originalEvent.touches?e.originalEvent.touches[0]:e;t={time:(new Date).getTime(),coords:[i.pageX,i.pageY]},Math.abs(o.coords[1]-t.coords[1])>10&&e.preventDefault()}}e.bind(touchMoveEvent,r).one(touchStopEvent,(function(i){e.unbind(touchMoveEvent,r),o&&t&&t.time-o.time<1e3&&Math.abs(o.coords[1]-t.coords[1])>30&&Math.abs(o.coords[0]-t.coords[0])<75&&o.origin.trigger("swipeupdown").trigger(o.coords[1]>t.coords[1]?"swipeup":"swipedown"),o=t=void 0}))}))}},$.each({swipedown:"swipeupdown",swipeup:"swipeupdown"},(function(e,i){$.event.special[e]={setup:function(){$(this).bind(i,$.noop)}}}));var slideshow={slider:null,currentSlide:0,isBusy:!1,init:function(e){this.slider=$(e),document.location.hash&&(this.currentSlide=Number(document.location.hash.substring(1)),this.moveTo(this.currentSlide)),this.refreshSlideHeight();var i=this;$(document).keydown((function(e){return 38===e.which?(i.moveUp(),!1):40===e.which?(i.moveDown(),!1):void 0})),$(document).on("swipedown",(function(){i.moveUp()})),$(document).on("swipeup",(function(){i.moveDown()})),$(window).on("resize",(function(){i.refreshSlideHeight()}))},refreshSlideHeight:function(){this.slider.find(".slide").height($(window).height())},moveTo:function(e){if(!this.isBusy&&e>=0&&e<this.slider.find(".slide").length){this.isBusy=!0;var i=this;this.slider.animate({top:"-"+e*$(window).height()+"px"},1e3,(function(){i.currentSlide=e,document.location.hash=i.currentSlide.toString(),i.isBusy=!1}))}},moveDown:function(){this.moveTo(this.currentSlide+1)},moveUp:function(){this.moveTo(this.currentSlide-1)}};function reveal(e){var i=0,t=$(e).find("img");setInterval((function(){var e=(i+1)%t.length;$(t[i]).animate({opacity:0},200),$(t[e]).animate({opacity:1},300,(function(){i=e}))}),2e3)}$(document).ready((function(){slideshow.init("#slider"),reveal("#data-is-here"),setTimeout((function(){reveal("#data-is-there")}),1e3),$(".counter").on("click",(function(e){e.preventDefault();var i=$(this).find(".count");i.length>0&&i.text(Number(i.text())+1)}))}));
