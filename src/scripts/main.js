'use strict';
//DETECT MOBILE DEVICES
var isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

var touchStartEvent = "touchstart mousedown",
    touchStopEvent = "touchend mouseup",
    touchMoveEvent = "touchmove mousemove";
$.event.special.swipeupdown = {
    setup: function () {
        var thisObject = this;
        var $this = $(thisObject);
        $this.bind(touchStartEvent, function (event) {
            var data = event.originalEvent.touches ?
                event.originalEvent.touches[0] :
                event,
                start = {
                    time: (new Date).getTime(),
                    coords: [data.pageX, data.pageY],
                    origin: $(event.target)
                },
                stop;

            function moveHandler(event) {
                if (!start) {
                    return;
                }
                var data = event.originalEvent.touches ?
                    event.originalEvent.touches[0] :
                    event;
                stop = {
                    time: (new Date).getTime(),
                    coords: [data.pageX, data.pageY]
                };

                // prevent scrolling
                if (Math.abs(start.coords[1] - stop.coords[1]) > 10) {
                    event.preventDefault();
                }
            }
            $this
                .bind(touchMoveEvent, moveHandler)
                .one(touchStopEvent, function (event) {
                    $this.unbind(touchMoveEvent, moveHandler);
                    if (start && stop) {
                        if (stop.time - start.time < 1000 &&
                            Math.abs(start.coords[1] - stop.coords[1]) > 30 &&
                            Math.abs(start.coords[0] - stop.coords[0]) < 75) {
                            start.origin
                                .trigger("swipeupdown")
                                .trigger(start.coords[1] > stop.coords[1] ? "swipeup" : "swipedown");
                        }
                    }
                    start = stop = undefined;
                });
        });
    }
};
$.each({
    swipedown: "swipeupdown",
    swipeup: "swipeupdown"
}, function (event, sourceEvent) {
    $.event.special[event] = {
        setup: function () {
            $(this).bind(sourceEvent, $.noop);
        }
    };
});

var slideshow = {
    slider: null,
    currentSlide: 0,
    isBusy: false,
    init: function (id) {
        this.slider = $(id);
        this.refreshSlideHeight();

        var self = this;
        $(document).keydown(function (e) {
            if (e.which === 38) {
                self.moveUp();
                return false;
            } else if (e.which === 40) {
                self.moveDown();
                return false;
            }
        });

        $(document).on('swipedown', function () { self.moveUp(); });
        $(document).on('swipeup', function () { self.moveDown(); });

        $(window).on('resize', function () {
            self.refreshSlideHeight();
        });
    },
    refreshSlideHeight: function () {
        this.slider.find('.slide').height($(window).height());
    },
    moveDown: function () {
        if (!this.isBusy && this.currentSlide + 1 < this.slider.find('.slide').length) {
            this.isBusy = true;
            var self = this;
            this.slider.animate({ top: '-' + ((self.currentSlide + 1) * $(window).height()) + 'px' }, 1000, function () {
                self.currentSlide++;
                self.isBusy = false;
            });
        }
    },
    moveUp: function () {
        if (!this.isBusy && this.currentSlide - 1 >= 0) {
            this.isBusy = true;
            var self = this;
            this.slider.animate({ top: '-' + ((self.currentSlide - 1) * $(window).height()) + 'px' }, 1000, function () {
                self.currentSlide--;
                self.isBusy = false;
            });
        }
    }
};

$(document).ready(function () {
    slideshow.init('#slider');
});