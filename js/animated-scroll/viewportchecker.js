/**
 * ViewportChecker - 檢查元素是否進入視窗
 * 用於觸發滾動動畫
 */
(function($) {
    'use strict';

    $.fn.viewportChecker = function(options) {
        var defaults = {
            classToAdd: 'visible',
            offset: 100,
            repeat: false,
            callbackFunction: function(elem, action) {}
        };

        var settings = $.extend({}, defaults, options);
        var $elem = this;
        var $window = $(window);

        function checkElements() {
            var windowHeight = $window.height();
            var scrollTop = $window.scrollTop();
            
            $elem.each(function() {
                var $this = $(this);
                
                // 如果已經添加了 class 且不重複，跳過
                if ($this.hasClass(settings.classToAdd) && !settings.repeat) {
                    return;
                }

                var elementTop = $this.offset().top;
                var elementHeight = $this.outerHeight();
                var elementBottom = elementTop + elementHeight;

                // 檢查元素是否在視窗內（考慮 offset）
                var isInViewport = (elementBottom > scrollTop + settings.offset) && 
                                   (elementTop < scrollTop + windowHeight - settings.offset);

                if (isInViewport) {
                    if (!$this.hasClass(settings.classToAdd)) {
                        $this.addClass(settings.classToAdd);
                        if (settings.callbackFunction) {
                            settings.callbackFunction.call(this, $this, 'add');
                        }
                    }
                } else if (settings.repeat && $this.hasClass(settings.classToAdd)) {
                    $this.removeClass(settings.classToAdd);
                    if (settings.callbackFunction) {
                        settings.callbackFunction.call(this, $this, 'remove');
                    }
                }
            });
        }

        // 綁定事件
        $window.on('scroll.viewportChecker resize.viewportChecker', checkElements);
        
        // 立即執行一次檢查
        checkElements();

        return this;
    };
})(jQuery);
