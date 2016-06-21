// helper module for miscellaneous functions.
namespace help {
    export function toggleClass(element: Element, class1: string, class2: string) {
        removeClass(element, class1);
        addClass(element, class2);
    }

    export function addClass (element: Element, clss: string) {
        if (!hasClass(element, clss)) {
            element.classList.add(clss);
        }
    }

    export function removeClass (element: Element, clss: string) {
        if (hasClass(element, clss)) {
            element.classList.remove(clss);
        }
    }

    export function hasClass (element: Element, clss: string) {
        return element.classList.contains(clss);
    }
}

class Snack {
    // Snack durations
    public static LONG      : number = 2750;
    public static SHORT     : number = 1500;
    public static INDEFINITE: number =   -1;
    public static ANIMATION : number =  300; // must be same as that defined in _variables.scss

    // Snack states
    public static INFO      : string = '#2196F3';
    public static SUCCESS   : string = '#8BC34A';
    public static WARNING   : string = '#FFEB3B';
    public static DANGER    : string = '#F44336';

    public option;
    public layout;

    public constructor ( ) {
        this.option = {
            duration   : Snack.SHORT,
            action     : null       ,
            actionColor: Snack.INFO ,
            onAction   : null       ,
            hideOnClick: true      
        };
        this.layout = new Snack.Layout();
    }

    public settings (option: Object): Snack {
        for (var key in option) {
            this.option[key] = option[key];
        }

        let thss: Snack = this;
        this.layout.root.addEventListener('click', this.option.hideOnClick ? function() { thss.hide(); } : null);

        this.action(this.option.action, this.option.onAction);

        return this;
    }

    public message (message: string): Snack {
        this.layout.message.innerHTML = message;

        return this;
    }

    private action (action: string, listener): void {
        if ( action === null || action === '' || listener === null ) {
            this.layout.visibility(Snack.Layout.ACTION, false);
        } else {
            this.layout.visibility(Snack.Layout.ACTION, true);

            this.layout.action.innerHTML   = action;
            this.layout.action.style.color = this.option.actionColor;
            this.layout.action.addEventListener('click', listener);
        }
    }

    public show ( ): void {
        snackmaster.show(this);
    }

    public hide ( ): void {
        snackmaster.hide(this, null);
    }

    public static make (message: string, option: Object): Snack {
        let snack: Snack = new Snack();

        snack.message (message)
             .settings(option );

        return snack;
    }

    // the DOM manipulator
    public static Layout             = class {
        public static ROOT  : number = 1;
        public static ACTION: number = 2;

        public root   : Element;
        public message: Element;
        public action : Element;

        private body  : Element; // main   wrapper
        private wrap  : Element; // action wrapper

        public constructor ( ) {
            // assuming an entire SnackLayout is needed
            // starting from the child
            this.action            = document.createElement('div');
            this.action.className  = 'snack-acttxt';

            this.wrap              = document.createElement('div');
            this.wrap.className    = 'snack-col snack-act';
            this.wrap.appendChild(this.action);

            this.message           = document.createElement('div');
            this.message.className = 'snack-col snack-msg';

            this.body              = document.createElement('div');
            this.body.className    = 'snack-body';
            this.body.appendChild(this.message);
            this.body.appendChild(this.wrap);

            this.root              = document.createElement('div');
            this.root.className    = 'snack';
            this.root.appendChild(this.body);
        }

        public visibility (which: number, visible: boolean): void {
            switch ( which ) {
                case Snack.Layout.ROOT:
                    if ( visible ) {
                        if (!document.body.contains(this.root)) {
                             document.body.appendChild(this.root);
                        }
                    } else {
                        if (document.body.contains(this.root)) {
                            document.body.removeChild(this.root);
                        }
                    }

                    break;

                case Snack.Layout.ACTION:
                    if ( visible ) {
                        help.addClass(this.message, 'snack-col');

                        if (!this.body.contains(this.wrap)) {
                             this.body.appendChild(this.wrap);
                        }

                    } else {
                        help.removeClass(this.message, 'snack-col');
                        // remove action wrapper
                        if (this.body.contains(this.wrap)) {
                            this.body.removeChild(this.wrap);
                        }
                    }
            }
        }
    }
}

class SnackMaster {
    // current snack it wishes to serve
    private snack  : Snack;
    private timeout;

    public constructor ( ) {
        // assuming none to serve, yet
        this.snack   = null;
        this.timeout = {
            show: null,
            hide: null
        };
    }

    public show (snack: Snack): void {
        clearTimeout(this.timeout.hide);
        // if is currently serving a visible snack
        if ( this.snack ) {
            if (this.snack !== snack) {
                let thss = this;
                this.hide(this.snack, function ( ) {
                    thss.show(snack);
                });
            }
        } else {
            // show snack, this being the current one to serve
            this.snack = snack;

            this.snack.layout.visibility(Snack.Layout.ROOT, true);
            help.toggleClass(this.snack.layout.root, 'snack-hide', 'snack-show');

            if (snack.option.duration !== Snack.INDEFINITE) {
                let thss: SnackMaster = this;
                this.timeout.show = setTimeout(function() {
                    help.removeClass(thss.snack.layout.root, 'snack-show');
                    thss.snack.hide();
                }, snack.option.duration + Snack.ANIMATION);
                // show-animation + desired duration
            }
        }
    }

    public hide(snack: Snack, callback): void {
        clearTimeout(this.timeout.show);
        // hide only serving snack.
        if ( this.snack === snack ) {
            help.toggleClass(this.snack.layout.root, 'snack-show', 'snack-hide');

            let thss: SnackMaster = this;
            this.timeout.hide = setTimeout(function() {
                // officially dismiss the snack
                help.removeClass(snack.layout.root, 'snack-hide');
                snack.layout.visibility(Snack.Layout.ROOT, false);
                // ...and declare it
                thss.snack = null;

                if (callback) { callback(); }

            }, Snack.ANIMATION);
            // hide animation
        }
    }
}

let snackmaster: SnackMaster = new SnackMaster();