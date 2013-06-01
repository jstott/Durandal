﻿define(['durandal/widget', 'durandal/system'], function(widget, system) {

    var ctor = function() { };

    ctor.prototype.activate = function(settings) {
        this.settings = settings;
    };

    ctor.prototype.getHeaderText = function(item) {
        if (this.settings.headerProperty) {
            return item[this.settings.headerProperty];
        }

        return item.toString();
    };

    ctor.prototype.afterRenderItem = function(elements, item) {
        var parts = widget.getParts(elements);
        var $itemContainer = $(parts.itemContainer);

        $itemContainer.hide();

        $(parts.headerContainer).bind('click', function() {
            $itemContainer.toggle('fast');
        });
    };

    ctor.prototype.domDetached = function() {
        system.log('Detached from DOM'); //to see this called, set cacheViews:false on the shell's router composition binding
    };

    return ctor;
});