var transEndEventName = 'transitionend',
    onEndTransition = function(el, callback) {
        var onEndCallbackFn = function(ev) {
            if (ev.target != this) return;
            this.removeEventListener(transEndEventName, onEndCallbackFn);
            if (callback && typeof callback === 'function') { callback.call(this); }
        };
        el.addEventListener(transEndEventName, onEndCallbackFn);
    };

/**
 * some helper functions
 */

function throttle(fn, delay) {
    var allowSample = true;

    return function(e) {
        if (allowSample) {
            allowSample = false;
            setTimeout(function() { allowSample = true; }, delay);
            fn(e);
        }
    };
}

function nextSibling(el) {
    var nextSibling = el.nextSibling;
    while (nextSibling && nextSibling.nodeType != 1) {
        nextSibling = nextSibling.nextSibling
    }
    return nextSibling;
}

function extend(a, b) {
    for (var key in b) {
        if (b.hasOwnProperty(key)) {
            a[key] = b[key];
        }
    }
    return a;
}


class GridFx {
    constructor(el, options) {
        this.gridEl = el;
        // this.options = extend({}, this.options);
        // extend(this.options, options);

        this.options = {
            pagemargin: 0,
            // x and y can have values from 0 to 1 (percentage). If negative then it means the alignment is left and/or top rather than right and/or bottom
            // so, as an example, if we want our large image to be positioned vertically on 25% of the screen and centered horizontally the values would be x:1,y:-0.25
            imgPosition: { x: 1, y: 1 },
            onInit: function(instance) { return false; },
            onResize: function(instance) { return false; },
            onOpenItem: function(instance, item) { return false; },
            onCloseItem: function(instance, item) { return false; },
            onExpand: function() { return false; },
            ...options
        }

        this.items = [].slice.call(this.gridEl.querySelectorAll('.grid__item'));
        this.previewEl = nextSibling(this.gridEl);
        this.isExpanded = false;
        this.isAnimating = false;
        this.closeCtrl = this.previewEl.querySelector('button.action--close');
        // this.previewDescriptionEl = this.previewEl.querySelector('.description--preview');
        this.previewDescriptionEl = this.previewEl.querySelector('.preview-container');

        this._init();
    }

    _init() {
        // callback
        this.options.onInit(this);

        var self = this;
        // init masonry after all images are loaded
        imagesLoaded(this.gridEl, function() {
            // initialize masonry
            new Masonry(self.gridEl, {
                itemSelector: '.grid__item',
                isFitWidth: true
            });
            // show grid after all images (thumbs) are loaded
            self.gridEl.classList.add('grid--loaded');
            // init/bind events
            self._initEvents();
            // create the large image and append it to the DOM
            self._setOriginal();
            // create the clone image and append it to the DOM
            self._setClone();
        });
    }

    _initEvents() {
        var self = this,
            clickEvent = (document.ontouchstart !== null ? 'click' : 'touchstart');

        this.items.forEach(function(item) {
            var touchend = function(ev) {
                ev.preventDefault();
                self._openItem(ev, item);
                item.removeEventListener('touchend', touchend);
            },
                touchmove = function(ev) {
                    item.removeEventListener('touchend', touchend);
                },
                manageTouch = function() {
                    item.addEventListener('touchend', touchend);
                    item.addEventListener('touchmove', touchmove);
                };

            item.addEventListener(clickEvent, function(ev) {
                if (clickEvent === 'click') {
                    ev.preventDefault();
                    self._openItem(ev, item);
                }
                else {
                    manageTouch();
                }
            });
        });

        // close expanded image
        this.closeCtrl.addEventListener('click', function() {
            self._closeItem();
        });

        window.addEventListener('resize', throttle(function(ev) {
            // callback
            self.options.onResize(self);
        }, 10));
    }

    _openItem = function(ev, item) {
        if (this.isAnimating || this.isExpanded) return;
        this.isAnimating = true;
        this.isExpanded = true;

        // item's image
        var gridImg = item.querySelector('img'),
            gridImgOffset = gridImg.getBoundingClientRect();

        // index of current item
        this.current = this.items.indexOf(item);

        // set the src of the original image element (large image)
        this._setOriginal(item.querySelector('a').getAttribute('href'));

        // callback
        this.options.onOpenItem(this, item);

        // set the clone image
        this._setClone(gridImg.src, {
            width: gridImg.offsetWidth,
            height: gridImg.offsetHeight,
            left: gridImgOffset.left,
            top: gridImgOffset.top
        });

        // hide original grid item
        item.classList.add('grid__item--current');

        // calculate the transform value for the clone to animate to the full image view
        var win = this._getWinSize(),
            originalSizeArr = item.getAttribute('data-size').split('x'),
            originalSize = { width: originalSizeArr[0], height: originalSizeArr[1] },
            dx = ((this.options.imgPosition.x > 0 ? 1 - Math.abs(this.options.imgPosition.x) : Math.abs(this.options.imgPosition.x)) * win.width + this.options.imgPosition.x * win.width / 2) - gridImgOffset.left - 0.5 * gridImg.offsetWidth,
            dy = ((this.options.imgPosition.y > 0 ? 1 - Math.abs(this.options.imgPosition.y) : Math.abs(this.options.imgPosition.y)) * win.height + this.options.imgPosition.y * win.height / 2) - gridImgOffset.top - 0.5 * gridImg.offsetHeight,
            z = Math.min(Math.min(win.width * Math.abs(this.options.imgPosition.x) - this.options.pagemargin, originalSize.width - this.options.pagemargin) / gridImg.offsetWidth, Math.min(win.height * Math.abs(this.options.imgPosition.y) - this.options.pagemargin, originalSize.height - this.options.pagemargin) / gridImg.offsetHeight);

        // apply transform to the clone
        this.cloneImg.style.WebkitTransform = 'translate3d(' + dx + 'px, ' + dy + 'px, 0) scale3d(' + z + ', ' + z + ', 1)';
        this.cloneImg.style.transform = 'translate3d(' + dx + 'px, ' + dy + 'px, 0) scale3d(' + z + ', ' + z + ', 1)';

        // add the description if any
        var descriptionEl = item.querySelector('.description');
        if (descriptionEl) {
            this.previewDescriptionEl.innerHTML = descriptionEl.innerHTML;
        }

        var self = this;
        setTimeout(function() {
            // controls the elements inside the expanded view
            self.previewEl.classList.add('preview--open');
            // callback
            self.options.onExpand();
        }, 0);

        // after the clone animates..
        onEndTransition(this.cloneImg, function() {
            // when the original/large image is loaded..
            imagesLoaded(self.originalImg, function() {
                // close button just gets shown after the large image gets loaded
                self.previewEl.classList.add('preview--image-loaded');
                // animate the opacity to 1
                self.originalImg.style.opacity = 1;
                // and once that's done..
                onEndTransition(self.originalImg, function() {
                    // reset cloneImg
                    self.cloneImg.style.opacity = 0;
                    self.cloneImg.style.WebkitTransform = 'translate3d(0,0,0) scale3d(1,1,1)';
                    self.cloneImg.style.transform = 'translate3d(0,0,0) scale3d(1,1,1)';

                    self.isAnimating = false;
                });

            });
        });
    }

    _setOriginal(src) {
        if (!src) {
            this.originalImg = document.createElement('img');
            this.originalImg.className = 'original';
            this.originalImg.style.opacity = 0;
            this.originalImg.style.maxWidth = 'calc(' + parseInt(Math.abs(this.options.imgPosition.x) * 100) + 'vw - ' + this.options.pagemargin + 'px)';
            this.originalImg.style.maxHeight = 'calc(' + parseInt(Math.abs(this.options.imgPosition.y) * 100) + 'vh - ' + this.options.pagemargin + 'px)';
            // need it because of firefox
            this.originalImg.style.WebkitTransform = 'translate3d(0,0,0) scale3d(1,1,1)';
            this.originalImg.style.transform = 'translate3d(0,0,0) scale3d(1,1,1)';

            // force to fit image (max)
            // this.originalImg.style.width = '100%'
            // this.originalImg.style.height = '100%'

            src = '';
            this.previewEl.appendChild(this.originalImg);
        }

        this.originalImg.setAttribute('src', src);
    }

    _setClone(src, settings) {
        if (!src) {
            this.cloneImg = document.createElement('img');
            this.cloneImg.className = 'clone';
            src = '';
            this.cloneImg.style.opacity = 0;
            this.previewEl.appendChild(this.cloneImg);
        }
        else {
            this.cloneImg.style.opacity = 1;
            // set top/left/width/height of grid item's image to the clone
            this.cloneImg.style.width = settings.width + 'px';
            this.cloneImg.style.height = settings.height + 'px';
            this.cloneImg.style.top = settings.top + 'px';
            this.cloneImg.style.left = settings.left + 'px';
        }

        this.cloneImg.setAttribute('src', src);
    }

    _closeItem() {
        if (!this.isExpanded || this.isAnimating) return;
        this.isExpanded = false;
        this.isAnimating = true;

        // the grid item's image and its offset
        var gridItem = this.items[this.current],
            gridImg = gridItem.querySelector('img'),
            gridImgOffset = gridImg.getBoundingClientRect(),
            self = this;

        this.previewEl.classList.remove('preview--open');
        this.previewEl.classList.remove('preview--image-loaded');

        // callback
        this.options.onCloseItem(this, gridItem);

        // large image will animate back to the position of its grid's item
        this.originalImg.classList.add('animate');

        // set the transform to the original/large image
        var win = this._getWinSize(),
            dx = gridImgOffset.left + gridImg.offsetWidth / 2 - ((this.options.imgPosition.x > 0 ? 1 - Math.abs(this.options.imgPosition.x) : Math.abs(this.options.imgPosition.x)) * win.width + this.options.imgPosition.x * win.width / 2),
            dy = gridImgOffset.top + gridImg.offsetHeight / 2 - ((this.options.imgPosition.y > 0 ? 1 - Math.abs(this.options.imgPosition.y) : Math.abs(this.options.imgPosition.y)) * win.height + this.options.imgPosition.y * win.height / 2),
            z = gridImg.offsetWidth / this.originalImg.offsetWidth;

        this.originalImg.style.WebkitTransform = 'translate3d(' + dx + 'px, ' + dy + 'px, 0) scale3d(' + z + ', ' + z + ', 1)';
        this.originalImg.style.transform = 'translate3d(' + dx + 'px, ' + dy + 'px, 0) scale3d(' + z + ', ' + z + ', 1)';

        // once that's done..
        onEndTransition(this.originalImg, function() {
            // clear description
            self.previewDescriptionEl.innerHTML = '';

            // show original grid item
            gridItem.classList.remove('grid__item--current');

            // fade out the original image
            setTimeout(function() { self.originalImg.style.opacity = 0; }, 60);

            // and after that
            onEndTransition(self.originalImg, function() {
                // reset original/large image
                self.originalImg.classList.remove('animate');
                self.originalImg.style.WebkitTransform = 'translate3d(0,0,0) scale3d(1,1,1)';
                self.originalImg.style.transform = 'translate3d(0,0,0) scale3d(1,1,1)';

                self.isAnimating = false;
            });
        });
    }

    _getWinSize() {
        return {
            width: document.documentElement.clientWidth,
            height: window.innerHeight
        };
    }
}

export default GridFx;
