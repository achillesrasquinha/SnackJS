// helper module for miscellaneous functions.
var help;
(function (help) {
    function toggleClass(element, class1, class2) {
        removeClass(element, class1);
        addClass(element, class2);
    }
    help.toggleClass = toggleClass;
    function addClass(element, clss) {
        if (!hasClass(element, clss)) {
            element.classList.add(clss);
        }
    }
    help.addClass = addClass;
    function removeClass(element, clss) {
        if (hasClass(element, clss)) {
            element.classList.remove(clss);
        }
    }
    help.removeClass = removeClass;
    function hasClass(element, clss) {
        return element.classList.contains(clss);
    }
    help.hasClass = hasClass;
})(help || (help = {}));
var Snack = (function () {
    function Snack() {
        this.option = {
            duration: Snack.SHORT,
            action: null,
            actionColor: Snack.INFO,
            onAction: null,
            hideOnClick: true
        };
        this.layout = new Snack.Layout();
    }
    Snack.prototype.settings = function (option) {
        for (var key in option) {
            this.option[key] = option[key];
        }
        var thss = this;
        this.layout.root.addEventListener('click', this.option.hideOnClick ? function () { thss.hide(); } : null);
        this.action(this.option.action, this.option.onAction);
        return this;
    };
    Snack.prototype.message = function (message) {
        this.layout.message.innerHTML = message;
        return this;
    };
    Snack.prototype.action = function (action, listener) {
        if (action === null || action === '' || listener === null) {
            this.layout.visibility(Snack.Layout.ACTION, false);
        }
        else {
            this.layout.visibility(Snack.Layout.ACTION, true);
            this.layout.action.innerHTML = action;
            this.layout.action.style.color = this.option.actionColor;
            this.layout.action.addEventListener('click', listener);
        }
    };
    Snack.prototype.show = function () {
        snackmaster.show(this);
    };
    Snack.prototype.hide = function () {
        snackmaster.hide(this, null);
    };
    Snack.make = function (message, option) {
        var snack = new Snack();
        snack.message(message)
            .settings(option);
        return snack;
    };
    // Snack durations
    Snack.LONG = 2750;
    Snack.SHORT = 1500;
    Snack.INDEFINITE = -1;
    Snack.ANIMATION = 300; // must be same as that defined in _variables.scss
    // Snack states
    Snack.INFO = '#2196F3';
    Snack.SUCCESS = '#8BC34A';
    Snack.WARNING = '#FFEB3B';
    Snack.DANGER = '#F44336';
    // the DOM manipulator
    Snack.Layout = (function () {
        function class_1() {
            // assuming an entire SnackLayout is needed
            // starting from the child
            this.action = document.createElement('div');
            this.action.className = 'snack-acttxt';
            this.wrap = document.createElement('div');
            this.wrap.className = 'snack-col snack-act';
            this.wrap.appendChild(this.action);
            this.message = document.createElement('div');
            this.message.className = 'snack-col snack-msg';
            this.body = document.createElement('div');
            this.body.className = 'snack-body';
            this.body.appendChild(this.message);
            this.body.appendChild(this.wrap);
            this.root = document.createElement('div');
            this.root.className = 'snack';
            this.root.appendChild(this.body);
        }
        class_1.prototype.visibility = function (which, visible) {
            switch (which) {
                case Snack.Layout.ROOT:
                    if (visible) {
                        if (!document.body.contains(this.root)) {
                            document.body.appendChild(this.root);
                        }
                    }
                    else {
                        if (document.body.contains(this.root)) {
                            document.body.removeChild(this.root);
                        }
                    }
                    break;
                case Snack.Layout.ACTION:
                    if (visible) {
                        help.addClass(this.message, 'snack-col');
                        if (!this.body.contains(this.wrap)) {
                            this.body.appendChild(this.wrap);
                        }
                    }
                    else {
                        help.removeClass(this.message, 'snack-col');
                        // remove action wrapper
                        if (this.body.contains(this.wrap)) {
                            this.body.removeChild(this.wrap);
                        }
                    }
            }
        };
        class_1.ROOT = 1;
        class_1.ACTION = 2;
        return class_1;
    }());
    return Snack;
}());
var SnackMaster = (function () {
    function SnackMaster() {
        // assuming none to serve, yet
        this.snack = null;
        this.timeout = {
            show: null,
            hide: null
        };
    }
    SnackMaster.prototype.show = function (snack) {
        clearTimeout(this.timeout.hide);
        // if is currently serving a visible snack
        if (this.snack) {
            if (this.snack !== snack) {
                var thss_1 = this;
                this.hide(this.snack, function () {
                    thss_1.show(snack);
                });
            }
        }
        else {
            // show snack, this being the current one to serve
            this.snack = snack;
            this.snack.layout.visibility(Snack.Layout.ROOT, true);
            help.toggleClass(this.snack.layout.root, 'snack-hide', 'snack-show');
            if (snack.option.duration !== Snack.INDEFINITE) {
                var thss_2 = this;
                this.timeout.show = setTimeout(function () {
                    help.removeClass(thss_2.snack.layout.root, 'snack-show');
                    thss_2.snack.hide();
                }, snack.option.duration + Snack.ANIMATION);
            }
        }
    };
    SnackMaster.prototype.hide = function (snack, callback) {
        clearTimeout(this.timeout.show);
        // hide only serving snack.
        if (this.snack === snack) {
            help.toggleClass(this.snack.layout.root, 'snack-show', 'snack-hide');
            var thss_3 = this;
            this.timeout.hide = setTimeout(function () {
                // officially dismiss the snack
                help.removeClass(snack.layout.root, 'snack-hide');
                snack.layout.visibility(Snack.Layout.ROOT, false);
                // ...and declare it
                thss_3.snack = null;
                if (callback) {
                    callback();
                }
            }, Snack.ANIMATION);
        }
    };
    return SnackMaster;
}());
var snackmaster = new SnackMaster();
