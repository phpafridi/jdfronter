try {
    $('.singglepic img').load(function () {
        setImg()
    });
} catch (e) {
    // console.log(e)
}

var spic = new Image();
spic.src = $(".singglepic img").attr("src");

(function ($) {
    var sh = setImg();
    $('.singglepic').css('height', sh);
    $('.singglepic').hover(function () {
        $(this).addClass('on');
        var wh = spic.height;
        var wl = spic.width;
        if (wl < 450) {
            $(this).animate({}, 100).removeClass('on');
            $('.singglepic img').css('position', 'relative');
            $('.singglepic img').css('left', '0');
            $('.singglepic img').css('top', '0');
        } else {
            $('.singglepic').find('img').css('position', 'absolute');
            $('.singglepic').find('img').css('left', -(wl - 400) / 2);
            if ($(".on img").offset().left < 0) $('.singglepic').find('img').css('left', 0);
            if ((wh - 300) / 2 < 160) {
                $('.singglepic').find('img').css('top', -(wh - 300) / 2);
            } else {
                $('.singglepic').find('img').css('top', -120);
            }
        }
    }, function () {
        $(this).animate({},
            100).removeClass('on');
        $('.singglepic img').css('position', 'relative');
        $('.singglepic img').css('left', '0');
        $('.singglepic img').css('top', '0');
    });
})(jQuery);

function setImg() {
    var img = new Image()
    img.src = $('.singglepic img').attr("src")
    var sh = img.height;
    if (sh == 0 || sh > 380) {
        $('.singglepic').css('height', 380);
        return 380;
    } else {
        if (sh < 280) {
            $('.singglepic').css({'height':sh,'padding-top':(280 - sh) / 2,'padding-bottom':(280 - sh) / 2,"box-sizing":"content-box"})
        } else {
            $('.singglepic').css('height', sh)
        }
    }
    return sh;
}