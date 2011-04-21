(function ($) {
    function int_prop(a) {
        a.elem.style[a.prop] = parseInt(a.now, 10) + a.unit
    }
    var j = function (a) {
        throw ({
            name: "jquery.flip.js plugin error",
            message: a
        })
    };
    var k = function () {
        return ( /*@cc_on!@*/ false && (typeof document.body.style.maxHeight === "undefined"))
    };
    var l = {
        aqua: [0, 255, 255],
        azure: [240, 255, 255],
        beige: [245, 245, 220],
        black: [0, 0, 0],
        blue: [0, 0, 255],
        brown: [165, 42, 42],
        cyan: [0, 255, 255],
        darkblue: [0, 0, 139],
        darkcyan: [0, 139, 139],
        darkgrey: [169, 169, 169],
        darkgreen: [0, 100, 0],
        darkkhaki: [189, 183, 107],
        darkmagenta: [139, 0, 139],
        darkolivegreen: [85, 107, 47],
        darkorange: [255, 140, 0],
        darkorchid: [153, 50, 204],
        darkred: [139, 0, 0],
        darksalmon: [233, 150, 122],
        darkviolet: [148, 0, 211],
        fuchsia: [255, 0, 255],
        gold: [255, 215, 0],
        green: [0, 128, 0],
        indigo: [75, 0, 130],
        khaki: [240, 230, 140],
        lightblue: [173, 216, 230],
        lightcyan: [224, 255, 255],
        lightgreen: [144, 238, 144],
        lightgrey: [211, 211, 211],
        lightpink: [255, 182, 193],
        lightyellow: [255, 255, 224],
        lime: [0, 255, 0],
        magenta: [255, 0, 255],
        maroon: [128, 0, 0],
        navy: [0, 0, 128],
        olive: [128, 128, 0],
        orange: [255, 165, 0],
        pink: [255, 192, 203],
        purple: [128, 0, 128],
        violet: [128, 0, 128],
        red: [255, 0, 0],
        silver: [192, 192, 192],
        white: [255, 255, 255],
        yellow: [255, 255, 0],
        transparent: [255, 255, 255]
    };
    var m = function (a) {
        if (a && a.indexOf("#") == -1 && a.indexOf("(") == -1) {
            return "rgb(" + l[a].toString() + ")"
        } else {
            return a
        }
    };
    $.extend($.fx.step, {
        borderTopWidth: int_prop,
        borderBottomWidth: int_prop,
        borderLeftWidth: int_prop,
        borderRightWidth: int_prop
    });
    $.fn.revertFlip = function () {
        return this.each(function () {
            var a = $(this);
            a.flip(a.data('flipRevertedSettings'))
        })
    };
    $.fn.flip = function (i) {
        return this.each(function () {
            var c = $(this),
                flipObj, $clone, dirOption, dirOptions, newContent, ie6 = k();
            if (c.data('flipLock')) {
                return false
            }
            var e = {
                direction: (function (a) {
                    switch (a) {
                    case "tb":
                        return "bt";
                    case "bt":
                        return "tb";
                    case "lr":
                        return "rl";
                    case "rl":
                        return "lr";
                    default:
                        return "bt"
                    }
                })(i.direction),
                bgColor: m(i.color) || "#999",
                color: m(i.bgColor) || c.css("background-color"),
                content: c.html(),
                speed: i.speed || 500,
                onBefore: i.onBefore ||
                function () {},
                onEnd: i.onEnd ||
                function () {},
                onAnimation: i.onAnimation ||
                function () {}
            };
            c.data('flipRevertedSettings', e).data('flipLock', 1).data('flipSettings', e);
            flipObj = {
                width: c.width(),
                height: c.height(),
                bgColor: m(i.bgColor) || c.css("background-color"),
                fontSize: c.css("font-size") || "12px",
                direction: i.direction || "tb",
                toColor: m(i.color) || "#999",
                speed: i.speed || 500,
                top: c.offset().top,
                left: c.offset().left,
                target: i.content || null,
                transparent: "transparent",
                dontChangeColor: i.dontChangeColor || false,
                onBefore: i.onBefore ||
                function () {},
                onEnd: i.onEnd ||
                function () {},
                onAnimation: i.onAnimation ||
                function () {}
            };
            ie6 && (flipObj.transparent = "#123456");
            $clone = c.css("visibility", "hidden").clone(true).data('flipLock', 1).appendTo("body").html("").css({
                visibility: "visible",
                position: "absolute",
                left: flipObj.left,
                top: flipObj.top,
                margin: 0,
                zIndex: 9999
            });
            var f = function () {
                return {
                    backgroundColor: flipObj.transparent,
                    fontSize: 0,
                    lineHeight: 0,
                    borderTopWidth: 0,
                    borderLeftWidth: 0,
                    borderRightWidth: 0,
                    borderBottomWidth: 0,
                    borderTopColor: flipObj.transparent,
                    borderBottomColor: flipObj.transparent,
                    borderLeftColor: flipObj.transparent,
                    borderRightColor: flipObj.transparent,
                    background: "none",
                    borderStyle: 'solid',
                    height: 0,
                    width: 0
                }
            };
            var g = function () {
                var a = (flipObj.height / 100) * 25;
                var b = f();
                b.width = flipObj.width;
                return {
                    "start": b,
                    "first": {
                        borderTopWidth: 0,
                        borderLeftWidth: a,
                        borderRightWidth: a,
                        borderBottomWidth: 0,
                        borderTopColor: '#999',
                        borderBottomColor: '#999',
                        top: (flipObj.top + (flipObj.height / 2)),
                        left: (flipObj.left - a)
                    },
                    "second": {
                        borderBottomWidth: 0,
                        borderTopWidth: 0,
                        borderLeftWidth: 0,
                        borderRightWidth: 0,
                        borderTopColor: flipObj.transparent,
                        borderBottomColor: flipObj.transparent,
                        top: flipObj.top,
                        left: flipObj.left
                    }
                }
            };
            var h = function () {
                var a = (flipObj.height / 100) * 25;
                var b = f();
                b.height = flipObj.height;
                return {
                    "start": b,
                    "first": {
                        borderTopWidth: a,
                        borderLeftWidth: 0,
                        borderRightWidth: 0,
                        borderBottomWidth: a,
                        borderLeftColor: '#999',
                        borderRightColor: '#999',
                        top: flipObj.top - a,
                        left: flipObj.left + (flipObj.width / 2)
                    },
                    "second": {
                        borderTopWidth: 0,
                        borderLeftWidth: 0,
                        borderRightWidth: 0,
                        borderBottomWidth: 0,
                        borderLeftColor: flipObj.transparent,
                        borderRightColor: flipObj.transparent,
                        top: flipObj.top,
                        left: flipObj.left
                    }
                }
            };
            dirOptions = {
                "tb": function () {
                    var d = g();
                    d.start.borderTopWidth = flipObj.height;
                    d.start.borderTopColor = flipObj.bgColor;
                    d.second.borderBottomWidth = flipObj.height;
                    d.second.borderBottomColor = flipObj.toColor;
                    return d
                },
                "bt": function () {
                    var d = g();
                    d.start.borderBottomWidth = flipObj.height;
                    d.start.borderBottomColor = flipObj.bgColor;
                    d.second.borderTopWidth = flipObj.height;
                    d.second.borderTopColor = flipObj.toColor;
                    return d
                },
                "lr": function () {
                    var d = h();
                    d.start.borderLeftWidth = flipObj.width;
                    d.start.borderLeftColor = flipObj.bgColor;
                    d.second.borderRightWidth = flipObj.width;
                    d.second.borderRightColor = flipObj.toColor;
                    return d
                },
                "rl": function () {
                    var d = h();
                    d.start.borderRightWidth = flipObj.width;
                    d.start.borderRightColor = flipObj.bgColor;
                    d.second.borderLeftWidth = flipObj.width;
                    d.second.borderLeftColor = flipObj.toColor;
                    return d
                }
            };
            dirOption = dirOptions[flipObj.direction]();
            ie6 && (dirOption.start.filter = "chroma(color=" + flipObj.transparent + ")");
            newContent = function () {
                var a = flipObj.target;
                return a && a.jquery ? a.html() : a
            };
            $clone.queue(function () {
                flipObj.onBefore($clone, c);
                $clone.html('').css(dirOption.start);
                $clone.dequeue()
            });
            $clone.animate(dirOption.first, flipObj.speed);
            $clone.queue(function () {
                flipObj.onAnimation($clone, c);
                $clone.dequeue()
            });
            $clone.animate(dirOption.second, flipObj.speed);
            $clone.queue(function () {
                if (!flipObj.dontChangeColor) {
                    c.css({
                        backgroundColor: flipObj.toColor
                    })
                }
                c.css({
                    visibility: "visible"
                });
                var a = newContent();
                if (a) {
                    c.html(a)
                }
                $clone.remove();
                flipObj.onEnd($clone, c);
                c.removeData('flipLock');
                $clone.dequeue()
            })
        })
    }
})(jQuery);