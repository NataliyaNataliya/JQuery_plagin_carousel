"use strict";
/**
 * Plagin
 * Carousel
 * v1.0
 */

(function ($) {
  $.fn.pluginCarousel = function (options) {
    options = $.extend(
      {
        visible: 1,
        rotateBy: 1,
        speed: 500,
        btnNext: null,
        btnPrev: null,
        auto: null,
        backSlide: false,
      },
      options
    );

    if (options.visible < 0 || options.visible > 7) {
      options.quantity = 5;
    }

    let $this = $(this);
    let $carousel = $this.children(`:first`);
    let itemWidth = $carousel.children().outerWidth();
    let itemsTotal = $carousel.children().length;
    let running = false;
    let intID = null;

    $this.css({
      position: `relative`,
      overflow: `hidden`,
      width: options.visible * itemWidth + `px`,
    });

    $carousel.css({
      position: `relative`,
      width: 32767 + `px`,
      left: 0,
    });

    function slide(dir) {
      let direction = !dir ? -1 : 1;
      let leftIndent = 0;

      if (!running) {
        running = true;

        if (intID) {
          window.clearInterval(intID);
        }

        if (!dir) {
          $carousel
            .children(`:last`)
            .after($carousel.children().slice(0, options.rotateBy).clone(true));
        } else {
          $carousel.children(`:first`).before(
            $carousel
              .children()
              .slice(itemsTotal - options.rotateBy, itemsTotal)
              .clone(true)
          );
          $carousel.css(`left`, -itemWidth * options.rotateBy + `px`);
        }

        leftIndent =
          parseInt($carousel.css(`left`)) +
          itemWidth * options.rotateBy * direction;

        $carousel.animate(
          { left: leftIndent },
          {
            queue: false,
            duration: options.speed,
            complete: function () {
              if (!dir) {
                $carousel.children().slice(0, options.rotateBy).remove();
                $carousel.css(`left`, 0);
              } else {
                $carousel
                  .children()
                  .slice(itemsTotal, itemsTotal + options.rotateBy)
                  .remove();
              }

              if (options.auto) {
                intID = window.setInterval(function () {
                  slide(options.backslide);
                }, options.auto);
              }

              running = false;
            },
          }
        );
      }

      return false;
    }

    $(options.btnNext).click(function () {
      return slide(false);
    });

    $(options.btnPrev).click(function () {
      return slide(true);
    });

    if (options.auto) {
      intID = window.setInterval(function () {
        slide(options.backslide);
      }, options.auto);
    }

    return this;
  };
})(jQuery);
