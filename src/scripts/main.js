'use strict';
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
        if (document.location.hash) {
            this.currentSlide = Number(document.location.hash.substring(1));
            this.moveTo(this.currentSlide);
        }
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
    moveTo: function (toSlide) {
        if (!this.isBusy && toSlide >= 0 && toSlide < this.slider.find('.slide').length) {
            this.isBusy = true;
            var self = this;
            this.slider.animate({ top: '-' + (toSlide * $(window).height()) + 'px' }, 1000, function () {
                self.currentSlide = toSlide;
                document.location.hash = self.currentSlide.toString();
                self.isBusy = false;
            });
        }
    },
    moveDown: function () {
        this.moveTo(this.currentSlide + 1);
    },
    moveUp: function () {
        this.moveTo(this.currentSlide - 1);
    }
};

function reveal(id) {
    var currImg = 0,
        imgElems = $(id).find('img');

    setInterval(function () {
        var nextImg = (currImg + 1) % imgElems.length;
        $(imgElems[currImg]).animate({ opacity: 0 }, 200);
        $(imgElems[nextImg]).animate({ opacity: 1 }, 300, function () {
            currImg = nextImg;
        });
    }, 2000);
};

function setupCounters() {
    $('.counter').on('click', function (e) {
        e.preventDefault();
        var countElem = $(this).find('.count');
        if (countElem.length > 0) {
            countElem.text(Number(countElem.text()) + 1);
        }
    });
}

var reasonExample = {
    data: {
        hard: [
            {
                text: "The technical barriers are pissing me off.",
                memoji: {
                    name: "hard-1.png",
                    position: "right"
                }
            },
            {
                text: "It’s too complex. I am scared of making any changes.",
                memoji: {
                    name: "hard-2.png",
                    position: "left"
                }
            },
            {
                text: "Why is this chart broken (again)?",
                memoji: {
                    name: "hard-3.png",
                    position: "right"
                }
            }
        ],
        expensive: [
            {
                text: "We don’t have budget to hire more people.",
                memoji: {
                    name: "expensive-1.png",
                    position: "left"
                }
            }
        ],
        slow: [
            {
                text: "Integrating all the data sources is a time killer.",
                memoji: {
                    name: "slow-1.png",
                    position: "right"
                }
            }
        ]
    },
    currReason: "hard",
    currExample: 0,
    init: function (id) {
        this.containerElem = $(id);
        this.textElem = this.containerElem.find('span');
        this.memojiElem = this.containerElem.find('img');
        this.start();
    },
    change: function (reason, example) {
        if (reason !== this.currReason || example !== this.currExample) {
            this.lastChange = new Date().getTime();
            this.currReason = reason;
            this.currExample = example;
            this.hide();
            var self = this;
            setTimeout(function () {
                self.render();
            }, 400);
            setTimeout(function () {
                self.show();
            }, 500);
        }
    },
    hide: function () {
        this.memojiElem.removeClass('scale-100');
        this.memojiElem.addClass('scale-0');
        this.textElem.removeClass('opacity-100');
        this.textElem.addClass('opacity-0');
    },
    show: function () {
        this.memojiElem.removeClass('scale-0');
        this.memojiElem.addClass('scale-100');
        this.textElem.removeClass('opacity-0');
        this.textElem.addClass('opacity-100');
    },
    render: function () {
        var ex = this.data[this.currReason][this.currExample];
        if (ex) {
            if (!this.containerElem.hasClass('reason-example-' + ex.memoji.position)) {
                if (ex.memoji.position === 'left') {
                    this.containerElem.removeClass('reason-example-right');
                } else {
                    this.containerElem.removeClass('reason-example-left');
                }
                this.containerElem.addClass('reason-example-' + ex.memoji.position);
            }
            this.textElem.text(ex.text);
            this.memojiElem.attr('src', '/dist/images/' + ex.memoji.name);
        }
    },
    start: function () {
        var self = this;
        setInterval(function () {
            var examples = self.data[self.currReason];
            if (examples.length > 1 && (new Date().getTime() - self.lastChange) >= 3000) {
                self.change(self.currReason, (self.currExample + 1) % examples.length);
            }
        }, 5000);
    }
};

function handleReasonSelection() {
    $('.reason').on('click', function (e) {
        e.preventDefault();
        $('.reason').removeClass('reason-active');
        $(this).addClass('reason-active');
        reasonExample.change($(this).data('key'), 0);
    });
}

$(document).ready(function () {
    slideshow.init('#slider');
    reveal('#data-is-here');
    setTimeout(function () {
        reveal('#data-is-there');
    }, 1000);

    setupCounters();
    handleReasonSelection();
    reasonExample.init('#reason-example');
});