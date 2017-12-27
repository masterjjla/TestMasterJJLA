(function() {

    $(document).ready(function() {
        $.get("./navbar.html", function(data) {
            $("#navbar").html(data);
        });
        var $container, calendar, d, date, m, y;
        $(".navbar").mouseover(function() {
            $(".navbar").removeClass("closed");
            return setTimeout((function() {
                return $(".navbar").css( {
                    overflow: "visible"
                }
                );
            }
            ), 350);
        });
        $(function() {
            var delta, lastScrollTop;
            lastScrollTop=0;
            delta=50;
            $(window).scroll(function(event) {
                var st;
                st=$(this).scrollTop();
                if (Math.abs(lastScrollTop - st) <=delta) {
                    return;
                }
                if (st > lastScrollTop) {
                    $('.navbar').addClass("closed");
                    $(".navbar").css( {
                        overflow: "hidden"
                    }
                    );
                }
                else {
                    $('.navbar').removeClass("closed");
                    setTimeout((function() {
                        return $(".navbar").css( {
                            overflow: "visible"
                        }
                        );
                    }
                    ), 350);
                }
                return lastScrollTop=st;
            });
            setTimeout(function() {
                $('.navbar-toggle').click(function() {
                    $('body, .navbar').toggleClass("nav-open");
                    return $('.container-fluid.main-nav').toggleClass("open");
                });
            }, 350);
        });
        $("#myTab a:last").tab("show");
        $("#popover").popover();
        $("#popover-left").popover( {
            placement: "left"
        }
        );
        $("#popover-top").popover( {
            placement: "top"
        }
        );
        $("#popover-right").popover( {
            placement: "right"
        }
        );
        $("#popover-bottom").popover( {
            placement: "bottom"
        }
        );
        $("#tooltip").tooltip();
        $("#tooltip-left").tooltip( {
            placement: "left"
        }
        );
        $("#tooltip-top").tooltip( {
            placement: "top"
        }
        );
        $("#tooltip-right").tooltip( {
            placement: "right"
        }
        );
        $("#tooltip-bottom").tooltip( {
            placement: "bottom"
        }
        );
        date=new Date();
        d=date.getDate();
        m=date.getMonth();
        y=date.getFullYear();
        $('.scrollbar').ClassyScroll( {
            sliderOpacity: 1, wheelSpeed: 2, onscroll: function() {
                return $(this).prev().addClass("shadow");
            }
        }
        );
        $('#popover').popover();
        $(".fancybox").fancybox({
          maxWidth: 700,
          height: 'auto',
          fitToView: false,
          autoSize: true,
          padding: 15,
          nextEffect: 'fade',
          prevEffect: 'fade',
          helpers: {
            title: {
              type: "outside"
          }
      }
  });
        $(".select2able").each(function () {
          $(this).select2({
            theme: "bootstrap"
        });
      });
        return $('.login-submit').click(function() {
            return $('.login').addClass("submitted");
        }
        );
    });
}

).call(this);