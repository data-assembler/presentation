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

var fullScreen = {
    init: function () {
        var self = this;
        $(document).keydown(function (e) {
            if (e.which === 70) {
                self.toggle();
                return false;
            }
        });
    },
    cancel: function () {
        var el = document;
        var requestMethod = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullscreen || el.webkitExitFullscreen;
        if (requestMethod) { // cancel full screen.
            requestMethod.call(el);
        } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }
    },
    request: function (el) {
        // Supports most browsers and their versions.
        var requestMethod = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;

        if (requestMethod) { // Native full screen.
            requestMethod.call(el);
        } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }
        return false
    },
    toggle: function (el) {
        if (!el) {
            el = document.body; // Make the body go full screen.
        }
        var isInFullScreen = (document.fullScreenElement && document.fullScreenElement !== null) || (document.mozFullScreen || document.webkitIsFullScreen);

        if (isInFullScreen) {
            this.cancel();
        } else {
            this.request(el);
        }
        return false;
    }
}

var slideshow = {
    slider: null,
    currentSlide: 0,
    isBusy: false,
    init: function (id, onChangeStart, onChangeEnd) {
        this.slider = $(id);
        this.onChangeStart = onChangeStart;
        this.onChangeEnd = onChangeEnd;
        if (document.location.hash) {
            this.moveTo(Number(document.location.hash.substring(1)));
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
            if (typeof this.onChangeStart === 'function') {
                this.onChangeStart(this.currentSlide, toSlide);
            }
            var self = this;
            this.slider.animate({ top: '-' + (toSlide * $(window).height()) + 'px' }, 1000, function () {
                if (typeof self.onChangeEnd === 'function') {
                    self.onChangeEnd(self.currentSlide, toSlide);
                }
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
    isInitialized: false,
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
    lastChange: -1,
    init: function (id) {
        if (!this.isInitialized) {
            this.isInitialized = true;
            this.containerElem = $(id);
            this.textElem = this.containerElem.find('span');
            this.memojiElem = this.containerElem.find('img');
            this.start();
        }
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

var dashboard = {
    isInitialized: false,
    init: function () {
        if (!this.isInitialized) {
            this.isInitialized = true;
            this.initCustomersSales("#customers");
            this.initSalesChart("#sales");
            this.initSignupsChart("#signups");
        }
    },
    initCustomersSales: function (id) {
        var customersChart = new ApexCharts(document.querySelector(id), {
            chart: {
                type: "area",
                height: '100%',
                width: '100%',
                sparkline: {
                    enabled: true
                }
            },
            stroke: {
                curve: "smooth"
            },
            fill: {
                opacity: 1
            },
            series: [
                {
                    name: "Customers",
                    data: [
                        35,
                        41,
                        60,
                        62,
                        93,
                        102,
                        104,
                        125,
                        130,
                        142,
                        164,
                        191
                    ]
                }
            ],
            labels: [
                "2022-01-01",
                "2022-02-01",
                "2022-03-01",
                "2022-04-01",
                "2022-05-01",
                "2022-06-01",
                "2022-07-01",
                "2022-08-01",
                "2022-09-01",
                "2022-10-01",
                "2022-11-01",
                "2022-12-01"
            ],
            yaxis: {
                min: 0
            },
            xaxis: {
                type: "datetime"
            },
            colors: ["#7CC4FA"]
        });
        customersChart.render();
    },
    initSalesChart: function (id) {
        var salesChart = new ApexCharts(document.querySelector(id), {
            chart: {
                type: "bar",
                height: '100%',
                width: '100%',
                sparkline: {
                    enabled: true
                }
            },
            stroke: {
                curve: "smooth"
            },
            fill: {
                opacity: 1
            },
            series: [
                {
                    name: "Customers",
                    data: [
                        200,
                        152,
                        340,
                        520,
                        456,
                        633,
                        711,
                        842,
                        612,
                        726,
                        824,
                        621
                    ]
                }
            ],
            labels: [
                "2022-01-01",
                "2022-02-01",
                "2022-03-01",
                "2022-04-01",
                "2022-05-01",
                "2022-06-01",
                "2022-07-01",
                "2022-08-01",
                "2022-09-01",
                "2022-10-01",
                "2022-11-01",
                "2022-12-01"
            ],
            yaxis: {
                min: 0
            },
            xaxis: {
                type: "datetime"
            },
            colors: ["#9FB3C8"]
        });
        salesChart.render();
    },
    initSignupsChart: function (id) {
        var visitsAndSignupsChart = new ApexCharts(document.querySelector(id), {
            series: [{
                name: 'Visits',
                data: [310, 401, 366, 435, 578, 402, 604, 724, 679, 783, 901, 855]
            }],
            chart: {
                height: '100%',
                width: '100%',
                type: 'line',
                toolbar: {
                    show: false
                },
                zoom: {
                    enabled: false
                }
            },
            stroke: {
                width: 4,
                curve: 'smooth'
            },
            xaxis: {
                type: 'category',
                categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'dark',
                    gradientToColors: ['#FDD835'],
                    shadeIntensity: 1,
                    type: 'horizontal',
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 100, 100, 100]
                },
            },
            yaxis: {
                min: 0,
                tickAmount: 6
            }
        });
        visitsAndSignupsChart.render();
    }
}

$(document).ready(function () {
    fullScreen.init();
    slideshow.init(
        '#slider',
        function (from, to) {

        },
        function (from, to) {
            // Slide 3
            if (from < 2 && to >= 2) {
                reasonExample.init('#reason-example');
            }
            // Slide 5
            if (from < 4 && to >= 4) {
                dashboard.init();
            }
        }
    );
    reveal('#data-is-here');
    setTimeout(function () {
        reveal('#data-is-there');
    }, 1000);

    setupCounters();
    handleReasonSelection();
});