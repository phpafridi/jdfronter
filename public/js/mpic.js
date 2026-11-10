(function ($) {
    $.fn.jqueryzoom = function (options) {
        var settings = {
            xzoom: 200,
            yzoom: 200,
            offset: 0,
            position: "right",
            lens: 1,
            preload: 1,
            pupSize: 190
        };
        if (options) {
            $.extend(settings, options)
        }
        //var noalt = "";
        $(this).hover(function () {
            var imageLeft = this.offsetLeft;
            var imageRight = this.offsetRight;
            var imageTop = $(this).get(0).offsetTop;
            var imageWidth = $(this).children("img").get(0).offsetWidth;
            var imageHeight = $(this).children("img").get(0).offsetHeight;
            if (imageWidth < 380) {
                imageWidth = 380;
                imageHeight = imageHeight * (380 / imageHeight)
            }
            //noalt = $(this).children("img").attr("alt");
            var bigimage = $(this).children("img").attr("jqimg");
            //$(this).children("img").attr("alt", "");
            if ($("div.zoomdiv").get().length == 0) {
                $(this).after("<div class='zoomdiv'><img class='bigimg' src='" + bigimage + "'/></div>");
                $(this).append("<div class='jqZoomPup'></div>")
            }
            if (settings.position == "right") {
                if (imageLeft + imageWidth + settings.offset + settings.xzoom > screen.width) {
                    leftpos = imageLeft - settings.offset - settings.xzoom
                } else {
                    leftpos = imageLeft + imageWidth + settings.offset
                }
            } else {
                leftpos = imageLeft - settings.xzoom - settings.offset;
                if (leftpos < 0) {
                    leftpos = imageLeft + imageWidth + settings.offset
                }
            }
            $("div.zoomdiv").css({
                top: imageTop - 1,
                left: leftpos
            });
            $("div.zoomdiv").width(settings.xzoom);
            $("div.zoomdiv").height(settings.yzoom);
            $("div.zoomdiv").show();
            if (!settings.lens) {
                $(this).css("cursor", "crosshair")
            }
            var ps = settings.pupSize;
            var psz = settings.xzoom / ps;
            var hps = ps / 2
            $(".bigimg").css({
                "width": psz * $(".jqzoom img").width() + "px",
                "height": psz * $(".jqzoom img").height() + "px"
            })
            $(document.body).mousemove(function (e) {
                mouse = new MouseEvent(e);
                var bigwidth = $(".bigimg").get(0).offsetWidth;
                var bigheight = $(".bigimg").get(0).offsetHeight;
                var scaley = "x";
                var scalex = "y";
                if (isNaN(scalex) | isNaN(scaley)) {
                    var scalex = (bigwidth / imageWidth);
                    var scaley = (bigheight / imageHeight);
                    $("div.jqZoomPup").width(ps);
                    $("div.jqZoomPup").height(ps);
                    if (settings.lens) {
                        $("div.jqZoomPup").css("visibility", "visible")
                    }
                }
                var jz = $(".jqzoom")
                var jzp = $(".jqZoomPup")
                var jzi = $(".jqzoom img")
                jzp.css("top", mouse.y - jz.offset().top - hps)
                jzp.css("left", mouse.x - jz.offset().left - hps)
                if (jzp.offset().top < jzi.offset().top) jzp.css("top", jzi.offset().top - jz.offset().top)
                else if (jzp.offset().top > jzi.offset().top + jzi.height() - ps) jzp.css("top", jzi.offset().top - jz.offset().top + jzi.height() - ps)
                if (jzp.offset().left < jzi.offset().left) jzp.css("left", jzi.offset().left - jz.offset().left)
                else if (jzp.offset().left > jzi.offset().left + jzi.width() - ps) jzp.css("left", jzi.offset().left - jz.offset().left + jzi.width() - ps)
                $(".bigimg").css({
                    "top": (jzi.offset().top - jzp.offset().top) * psz,
                    "left": (jzp.offset().left - jzi.offset().left) * -psz + "px"
                })
            })
        }, function () {
            //$(this).children("img").attr("alt", noalt);
            $(document.body).unbind("mousemove");
            if (settings.lens) {
                $("div.jqZoomPup").remove()
            }
            $("div.zoomdiv").remove()
        });
        count = 0;
        if (settings.preload) {
            $(this).each(function () {
                var imagetopreload = $(this).children("img").attr("jqimg");
                var content = jQuery("div.jqPreload" + count + "").html();
                jQuery("div.jqPreload" + count + "").html(content + '<img src="' + imagetopreload + '">')
            })
        }
    }
})(jQuery);

function MouseEvent(e) {
    this.x = e.pageX;
    this.y = e.pageY
}

function preview(img) {
    $(".items span").removeClass("active")
    $(img).parent().addClass("active")
    $("#preview .jqzoom img").attr("src", $(img).attr("bimg"));
    $("#preview .jqzoom img").attr("jqimg", $(img).attr("bimg"))
    //$("#preview .jqzoom img").attr("alt", $(img).attr("alt"))
}

function initSpecScroll() {

}
var TINY = {};

function T$(i) {
    return document.getElementById(i)
}
TINY.box = function () {
    var p, m, b, fn, ic, iu, iw, ih, ia, f = 0;
    return {
        show: function (c, u, w, h, a, t) {
            var ti = this;
            if (!f) {
                p = document.createElement("div");
                p.id = "tinybox";
                m = document.createElement("div");
                m.id = "tinymask";
                b = document.createElement("div");
                b.id = "tinycontent";
                document.body.appendChild(m);
                document.body.appendChild(p);
                p.appendChild(b);
                m.onclick = TINY.box.hide;
                window.onresize = TINY.box.resize;
                f = 1
            }
            if (!a && !u) {

                // p.style.width = w ? w + "px" : "auto";
                // p.style.height = h ? h + "px" : "auto";
                p.style.backgroundImage = "none";
                b.innerHTML = c

            } else {
                // b.style.display = "none";
                // p.style.width = p.style.height = "100px"
            }
            ti.mask();

            ic = c;
            iu = u;
            iw = w;
            ih = h;
            ia = a;
            ti.alpha(m, 1, 80, 3);
            if (t) {
                setTimeout(function () {
                    TINY.box.hide()
                }, 1000 * t)
            }

        },
        fill: function (c, u, w, h, a) {
            if (u) {
                p.style.backgroundImage = "";
                var x = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
                x.onreadystatechange = function () {
                    if (x.readyState == 4 && x.status == 200) {
                        TINY.box.psh(x.responseText, w, h, a)
                    }
                };
                x.open("GET", c, 1);
                x.send(null)
            } else {
                this.psh(c, w, h, a)
            }
        },
        psh: function (c, w, h, a) {
            if (a) {
                if (!w || !h) {
                    var x = p.style.width,
                        y = p.style.height;
                    b.innerHTML = c;
                    // p.style.width = w ? w + "px" : "";
                    // p.style.height = h ? h + "px" : "";
                    b.style.display = "";
                    w = parseInt(b.offsetWidth);
                    h = parseInt(b.offsetHeight);
                    // b.style.display = "none";
                    // p.style.width = x;
                    // p.style.height = y
                } else {
                    b.innerHTML = c
                }
                this.size(p, w, h, 4)
            } else {
                p.style.backgroundImage = "none"
            }
        },
        hide: function () {
            TINY.box.alpha(p, -1, 0, 5)
            $("#tinymaskNext,#tinymaskPrev").hide()
        },
        resize: function () {
            TINY.box.pos();
            TINY.box.mask()
        },
        mask: function () {
            m.style.height = TINY.page.theight() + "px";
            m.style.width = "";
            m.style.width = TINY.page.twidth() + "px"
        },
        pos: function () {
            var t = (TINY.page.height() / 2) - (p.offsetHeight / 2);
            t = t < 10 ? 10 : t;
            p.style.top = "50%";
            p.style.left = "50%"
        },
        alpha: function (e, d, a, s) {
            clearInterval(e.ai);
            if (d == 1) {
                if (!remainShadow) e.style.opacity = 0;
                e.style.filter = "alpha(opacity=0)";
                e.style.display = "block";
                this.pos()
            }
            e.ai = setInterval(function () {
                TINY.box.twalpha(e, a, d, s)
            }, 20)
        },
        twalpha: function (e, a, d, s) {
            var o = Math.round(e.style.opacity * 100);
            if (o == a) {
                clearInterval(e.ai);
                if (d == -1) {
                    e.style.display = "none";
                    e == p ? TINY.box.alpha(m, -1, 0, 3) : b.innerHTML = p.style.backgroundImage = ""
                } else {
                    e == m ? this.alpha(p, 1, 100, 5) : TINY.box.fill(ic, iu, iw, ih, ia)
                }
            } else {
                var n = o + Math.ceil(Math.abs(a - o) / s) * d;
                e.style.opacity = n / 100;
                e.style.filter = "alpha(opacity=" + n + ")"
            }
        },
        size: function (e, w, h, s) {
            e = typeof e == "object" ? e : T$(e);
            clearInterval(e.si);
            var ow = e.offsetWidth,
                oh = e.offsetHeight,
                wo = ow - parseInt(e.style.width),
                ho = oh - parseInt(e.style.height);
            var wd = ow - wo > w ? -1 : 1,
                hd = (oh - ho > h) ? -1 : 1;
            e.si = setInterval(function () {
                TINY.box.twsize(e, w, wo, wd, h, ho, hd, s)
            }, 20)
        },
        twsize: function (e, w, wo, wd, h, ho, hd, s) {
            var ow = e.offsetWidth - wo,
                oh = e.offsetHeight - ho;
            if (ow == w && oh == h) {
                clearInterval(e.si);
                p.style.backgroundImage = "none";
                b.style.display = "block"
            } else {
                if (ow != w) {
                    e.style.width = ow + (Math.ceil(Math.abs(w - ow) / s) * wd) + "px"
                }
                if (oh != h) {
                    e.style.height = oh + (Math.ceil(Math.abs(h - oh) / s) * hd) + "px"
                }
                this.pos()
            }
        }
    }
}();
TINY.page = function () {
    return {
        top: function () {
            return document.body.scrollTop || document.documentElement.scrollTop
        },
        width: function () {
            return self.innerWidth || document.documentElement.clientWidth
        },
        height: function () {
            return self.innerHeight || document.documentElement.clientHeight
        },
        theight: function () {
            var d = document,
                b = d.body,
                e = d.documentElement;
            return Math.max(Math.max(b.scrollHeight, e.scrollHeight), Math.max(b.clientHeight, e.clientHeight))
        },
        twidth: function () {
            var d = document,
                b = d.body,
                e = d.documentElement;
            return Math.max(Math.max(b.scrollWidth, e.scrollWidth), Math.max(b.clientWidth, e.clientWidth))
        }
    }
}();
var remainShadow = false;
var bigobj = new Image()
var bimgArr = []
var nowBig = 0;
var showBig = 0;

function preNextBigImg() {
    bigobj.src = bimgArr[showBig]
    
    remainShadow = true
    setTimeout(function () {
        remainShadow = false
    }, 500);
    var imgggg = $('<img src="' + bimgArr[showBig] + '">');
    $('#imgee').attr('src',bimgArr[showBig])

}
document.writeln("<style type='text/css'>.jqzoom{width:100%;height:100%;position:relative;cursor:pointer;overflow:hidden;display:flex;align-items:center;justify-content:center}.jqzoom img{max-width:100%;max-height:100%}.zoomdiv{z-index:200;position:absolute;top:0;left:0;width:380px;height:380px;background:#fff;border:1px solid #ddd;display:none;overflow:hidden}.zoomdiv .bigimg{position:absolute;top:0;left:0;max-width:unset;max-height:unset}.jqZoomPup{z-index:10;visibility:hidden;position:absolute;top:0;left:0;width:20px;height:20px;border:1px solid #ddd;background:#fafafa;opacity:.5;-moz-opacity:.5;-khtml-opacity:.5;filter:alpha(Opacity=50)}.jqZoomPup img{min-width:380px}.spec-preview{width:380px;height:380px;border:1px solid #ddd}.spec-scroll{clear:both;margin:5px 0;width:382px;height:54px}.spec-scroll .prev{float:left;margin-right:10px;background:url(/images/duo_left.gif) center no-repeat}.spec-scroll .next{float:right;background:url(/images/duo_right.gif) center no-repeat}.spec-scroll .next,.spec-scroll .prev{display:block;text-align:center;width:19px;height:54px;cursor:pointer}.spec-scroll .next:hover,.spec-scroll .prev:hover{background-color:none}.spec-scroll .items{float:left;position:relative;width:324px;height:56px;overflow:hidden}.spec-scroll .items ul{position:absolute;width:640px;height:56px;overflow:hidden}.spec-scroll .items ul li{float:left;width:67px}.spec-scroll .items ul li span{box-sizing:border-box;display:block;vertical-align:middle;width:50px;height:50px;text-align:center;border:1px solid #ddd;padding:0px}.spec-scroll .items ul li img{width:100%;height:100%;object-fit:cover;cursor:pointer}.spec-scroll .items ul li span.active,.spec-scroll .items ul li span:hover{border:2px solid #db241e;padding:0px}#tinybox{top:50%!important;left:50%!important;transform:translate(-50%,-50%);position:fixed;display:none;padding:10px;background:#fff;border:10px solid #ddd;z-index:99997}#tinymask{position:absolute;display:none;top:0;left:0;height:100%;width:100%;background:#000;z-index:99997}#tinycontent{background:#fff;width:100%;height:100%}.spec-scroll .items ul li img{margin:0 auto}#imgee{width:100%;height:100%;object-fit:contain}#tinymaskNext,#tinymaskPrev{display:none;position:fixed;top:50%;border:3px solid #fff;width:35px;height:35px;border-top:0;border-right:0;background:0 0;z-index:99999;outline:0}#tinymaskPrev{left:30px;transform:rotate(45deg)}#tinymaskNext{right:30px;transform:rotate(225deg)}.spec-scroll .items ul li:nth-last-child(1){width:50px}</style>");



var pupsize = 190
$(function () {});
$(document).ready(function () {
    var videoac = document.getElementById('media');
    var videoModel = {
        showVideo: function () {
            $(".spec-preview").css("position", "relative")
            $("#playVideo").removeClass('dtplay').hide();
            $("#stopVideo").show();
            $("#media").show();
            videoac.play();
        },
        hideVideo: function () {
            $(".spec-preview").css("position", "relative")
            $("#playVideo").addClass('dtplay').show();
            $("#stopVideo").hide();
            $("#media").hide();
            videoac.pause();
        }
    };
    var eee = "";
    $("body").append("<button id='tinymaskPrev'></button><button id='tinymaskNext'></button>")
    $(".items img").each(function () {
        bimgArr.push($(this).attr("bimg"))
    })
    $(".spec-scroll .items ul li").mouseenter(function () {
        nowBig = $(".spec-scroll .items ul li").index(this)
    })
    $("#tinymaskPrev").click(function () {
        if (showBig > 0) {
            showBig--;
            $("#tinymaskNext").show();
            preNextBigImg();
        }
        if (showBig == 0)
            $("#tinymaskPrev").hide()

    })
    $("#tinymaskNext").click(function () {
        if (showBig < (bimgArr.length - 1)) {
            showBig++;
            $("#tinymaskPrev").show();
            preNextBigImg()
        }
        if (showBig == (bimgArr.length - 1))
            $("#tinymaskNext").hide()
    })
    T$("ooooo").onclick = function () {
        $("#tinymaskNext,#tinymaskPrev").show()
        showBig = nowBig
        if (showBig == 0) $("#tinymaskPrev").hide()
        if (showBig == (bimgArr.length - 1)) $("#tinymaskNext").hide()
        
        eee = bimgArr[nowBig]
        
        var content2 = "<img id='imgee' src='" + eee + "' style='max-width:500px;max-height:500px'/>";
        TINY.box.show(content2, 0, 0, 0, 1)
    }
    $(".spec-scroll .items ul li:eq(0) span").addClass("active")
    $(".jqzoom").jqueryzoom({
        xzoom: 380,
        yzoom: 380,
        pupSize: pupsize
    })
    // initSpecScroll()
    var tempLength = 0;
    var viewNum = 4;
    var moveNum = 1;
    var moveTime = 300;
    var scrollDiv = $(".spec-scroll .items ul");
    var scrollItems = $(".spec-scroll .items ul li");
    $(".spec-scroll .items ul").css("width", scrollItems.length * 67 - 17 + "px")
    var moveLength = scrollItems.eq(0).width() * moveNum;
    var countLength = (scrollItems.length - viewNum) * scrollItems.eq(0).width();
    $(".spec-scroll .next").click(function () {
        var img = $(".spec-scroll .items ul li span.active").parent().next().find("img")
        if (img.length > 0) preview(img)
        if (tempLength < (countLength - moveLength)) {
            if ((countLength - tempLength) > moveLength) {
                scrollDiv.animate({
                    left: "-=" + moveLength + "px"
                }, moveTime);
                tempLength += moveLength
            } else {
                scrollDiv.animate({
                    left: "-=" + (countLength - tempLength) + "px"
                }, moveTime);
                tempLength += (countLength - tempLength)
            }
        }
    });
    $(".spec-scroll .prev").click(function () {
        var img = $(".spec-scroll .items ul li span.active").parent().prev().find("img")
        if (img.length > 0) preview(img)
        if (tempLength > 0) {
            if (tempLength > moveLength) {
                scrollDiv.animate({
                    left: "+=" + moveLength + "px"
                }, moveTime);
                tempLength -= moveLength
            } else {
                scrollDiv.animate({
                    left: "+=" + tempLength + "px"
                }, moveTime);
                tempLength = 0
            }
        }
    })
    // end

    $(".spec-scroll span").mouseover(function () {
        videoModel.hideVideo();

    });
    if ($("#media source").attr("src").length > 0) {
        $(".spec-preview").append(
            "<button id='playVideo'><img src='/images/video_play.png'></button>" +
            "<button id='stopVideo'><img src='/images/video_close.png'></button>" +
            "<style>" +
            ".spec-preview{position:relative}" +
            "#media{height:100%;width:100%;border:1px solid#FAFAFA;box-sizing:content-box;position:absolute;z-index:5;background-color:#fff;left:0}" +
            "#playVideo,#stopVideo{background-color:transparent;border:0px;outline:0px;position:absolute;z-index:99}" +
            "#playVideo{transform: translateY(-100%);}" +
            "#playVideo img{height:55px}" +
            "#stopVideo{top:20px;right:20px;display:none}" +
            "#stopVideo img{height:25px}" +
            "</style>"
        );
        $(".spec-preview").css("position", "relative")
        $("#playVideo").removeClass('dtplay').hide();
        $("#stopVideo").show();
        $("#media").show();
    };
    $('#playVideo').click(function () {
        videoModel.showVideo()
    })
    $('#stopVideo').click(function () {
        videoModel.hideVideo()
    })
});