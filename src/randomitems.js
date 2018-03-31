(function ($) {
    'use strict';

    $.RandomItems = function (container, options) {
        // Éléments
        this.elements = {};
        this.elements.container = container,
        this.elements.items = this.elements.container.children();

        // Config
        $.extend((this.settings = {}), $.RandomItems.defaults, options);

        // Variables par défaut
        this.order = [];
        this.loop;
        this.timers = {};

        // Init
        return this.init();
    };

    $.RandomItems.defaults = {
        activeClass: 'is-active',
        duration: 3000,
        loop: true,
        shuffleLoop: true,
        minItems: 1,
        onChange: undefined
    };

    $.RandomItems.prototype = {
        /**
         * Initialisation
         */
        init: function () {
            var self = this;

            if (self.elements.items.length) {
                // Définition de l'ordre
                var i = 0;
                for (i; i < self.elements.items.length; i++) {
                    self.order[i] = i;
                }

                // Aléatoire
                self.shuffleOrder();
                self.applyOrder();

                // Si c'est en mode loop, on répète l'ordre aléatoire
                if (self.settings.loop) {
                    self.loop = setInterval(function () {
                        if (self.settings.shuffleLoop) {
                            self.shuffleOrder();
                        }
                        self.applyOrder();
                    }, self.elements.items.length * self.settings.duration);
                }
            }

            return self;
        },

        /**
         * Stop le fonctionnement de RandomItems
         */
        destroy: function () {
            // Stop loop
            if (this.settings.loop) {
                clearInterval(this.loop);
            }

            // Stop timeout
            var i = 0;
            for (i; i < this.elements.items.length; i++) {
                if (this.timers[i] !== undefined) {
                    if (this.timers[i].add !== undefined) {
                        clearTimeout(this.timers[i].add);
                    }
                    if (this.timers[i].remove !== undefined) {
                        clearTimeout(this.timers[i].remove);
                    }
                }
            }

            // Remove classes
            this.elements.items.removeClass(this.settings.activeClass);

            return this;
        },

        /**
         * Créer l'ordre aléatoire
         */
        shuffleOrder: function () {
            this.order.sort(function() {
                return .5 - Math.random();
            });

            return this;
        },

        /**
         * Applique l'ordre aléatoire aux éléments
         */
        applyOrder: function () {
            var self = this;

            $.each(self.order, function (i, item) {
                self.applyItem(i, self.elements.items.eq(item));
            });

            return self;
        },

        /**
         * Affiche l'item
         *
         * @param  int    i    Index de l'ordre
         * @param  object item Element jquery
         */
        applyItem: function (i, item) {
            var self = this;
            self.timers[i] = {};

            self.timers[i].add = setTimeout(function () {
                item.addClass(self.settings.activeClass);

                // User callback
                if (self.settings.onChange !== undefined) {
                    self.settings.onChange.call({
                        randomItems: self,
                        item: item,
                        active: true,
                        index: i
                    });
                }

                self.timers[i].remove = setTimeout(function () {
                    item.removeClass(self.settings.activeClass);

                    // User callback
                    if (self.settings.onChange !== undefined) {
                        self.settings.onChange.call({
                            randomItems: self,
                            item: item,
                            active: false,
                            index: i
                        });
                    }
                }, self.settings.minItems * self.settings.duration);
            }, i * self.settings.duration);

            return self;
        }
    };

    $.fn.randomItems = function (options) {
        return new $.RandomItems($(this), options);
    };
})(jQuery);