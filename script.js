// ==========================================================================
// THE ILLUSION OF CONTROL (UI Interactions)
// ==========================================================================

$(function() {
    var $window = $(window);
    var $header = $('.main_h');
    var $parallaxImages = $('.img-parallax');
    var ticking = false;

    function isMobileNavLayout() {
        return window.matchMedia('(max-width: 980px)').matches;
    }

    function scheduleVisualUpdate() {
        if (ticking) {
            return;
        }

        ticking = true;
        var run = function() {
            updateStickyHeader();
            updateParallax();
            ticking = false;
        };

        if (window.requestAnimationFrame) {
            window.requestAnimationFrame(run);
        } else {
            setTimeout(run, 16);
        }
    }

    // Sticky Header - Because people are too lazy to scroll back up
    function updateStickyHeader() {
        if (isMobileNavLayout()) {
            $header.addClass('sticky');
            return;
        }

        $header.toggleClass('sticky', $window.scrollTop() > 100);
    }

    // Mobile Navigation Toggle - The Hamburger Menu Trap
    $('.mobile-toggle').on('click', function() {
        $header.toggleClass('open-nav');
    });

    $window.on('resize', function() {
        if (!isMobileNavLayout()) {
            $header.removeClass('open-nav');
        }
    });

    // Close nav on link click
    $('.main_h li a').on('click', function() {
        $header.removeClass('open-nav');
    });

    // Smooth Scrolling - Lubricating the descent into the void
    $('nav a').on('click', function(event) {
        var href = $(this).attr('href');

        // Guard against missing/empty href values before checking for '#'.
        if (!href || href.charAt(0) !== '#') {
            return;
        }

        var $target = $(href);
        if (!$target.length) {
            return;
        }

        var offset = 70; // Header height
        var targetTop = $target.offset().top - offset;

        $('html, body').animate(
            {
                scrollTop: targetTop
            },
            500
        );

        event.preventDefault();
    });

    // ==========================================================================
    // THE DOPAMINE DRIP (Parallax Engine)
    // ==========================================================================

    function isParallaxEnabled() {
        return window.matchMedia('(min-width: 767px)').matches;
    }

    function updateParallax() {
        if (!isParallaxEnabled()) {
            $parallaxImages.css({
                top: '50%',
                transform: 'translate(-50%, -50%)'
            });
            return;
        }

        var winY = $window.scrollTop();
        var winH = $window.height();
        var winBottom = winY + winH;

        $parallaxImages.each(function() {
            var $img = $(this);
            var $imgParent = $img.parent();
            var speed = Number($img.data('speed'));

            if (!isFinite(speed)) {
                speed = 0;
            }

            var imgY = $imgParent.offset().top;
            var parentH = $imgParent.innerHeight();
            var imgPercent = 0;

            // If block is shown on screen
            if (winBottom > imgY && winY < imgY + parentH) {
                // Number of pixels shown after block appears
                var imgBottom = (winBottom - imgY) * speed;
                // Max number of pixels until block disappears
                var imgTop = winH + parentH;
                // Percentage between start showing until disappearing
                imgPercent = (imgBottom / imgTop) * 100 + (50 - speed * 50);
            }

            // Apply the visual lie
            $img.css({
                top: imgPercent + '%',
                transform: 'translate(-50%, -' + imgPercent + '%)'
            });
        });
    }

    $window.on('scroll resize', scheduleVisualUpdate);
    $window.on('load', function() {
        scheduleVisualUpdate();
    });

    // Demo behavior for the card snippet.
    $('figure.snip1321').on('mouseleave', function() {
        $(this).removeClass('hover');
    });

    scheduleVisualUpdate();
});
