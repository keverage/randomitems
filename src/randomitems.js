/**
 * RandomItems
 *
 * Permet d'afficher aléatoire des éléments
 *
 * @version 1.0 (19/11/2015)
 */
(function($) {
    'use strict';

    $.RandomItems = function(parent, options) {
        // Éléments
        this.elements = {
            parent: parent
        };

        // Config
        $.extend((this.settings = {}), $.RandomItems.defaults, options);

        // Variables par défaut
        this.len = 0;
        this.order = [];

        // Init
        this.init();
    };

    $.RandomItems.defaults = {
        activeClass: 'is-active',
        duration: 3000,
        loop: true,
        shuffleLoop: false,
        minItems: 1
    };

    $.RandomItems.prototype = {
        /**
         * Initialisation
         */
        init: function() {
            var self = this;

            // Liste des éléments
            self.elements.items = self.elements.parent.children();
            self.len = self.elements.items.length;

            // Définition de l'ordre
            var i = 0;
            for (i; i < self.len; i++) {
                self.order[i] = i;
            }

            // Aléatoire
            self.shuffleOrder();
            self.applyOrder();

            // Si c'est en mode loop, on répère l'ordre aléatoire
            if (self.settings.loop) {
                setInterval(function() {
                    if (self.settings.shuffleLoop) {
                        self.shuffleOrder();
                    }
                    self.applyOrder();
                }, self.len * self.settings.duration)
            }
        },

        /**
         * Créer l'ordre aléatoire
         */
        shuffleOrder: function() {
            var lastId = this.len;

            while (lastId > 0) {
                var randId = Math.floor(Math.random() * lastId);
                var lastElem = this.order[--lastId];

                this.order[lastId] = this.order[randId];
                this.order[randId] = lastElem;
            }
        },

        /**
         * Applique l'ordre aléatoire aux éléments
         */
        applyOrder: function() {
            var self = this;

            $.each(this.order, function(i, item) {
                var item = self.elements.items.eq(item);
                self.applyItem(i, item);
            });
        },

        /**
         * Affiche l'item
         *
         * @param  int    i    Index de l'ordre
         * @param  object item Element jquery
         */
        applyItem: function(i, item) {
            var self = this;

            setTimeout(function() {
                item.addClass(self.settings.activeClass);

                setTimeout(function() {
                    item.removeClass(self.settings.activeClass);
                }, self.settings.minItems * self.settings.duration);
            }, i * self.settings.duration);
        }
    };

    $.fn.randomItems = function(options) {
        return new $.RandomItems($(this), options);
    };
})(jQuery);