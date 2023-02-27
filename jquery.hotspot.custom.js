/**
 * jQuery plugin for image hotspots
 * Featuring public and private methods and overridable/extensible defaults.
 * 
 * @requires jQuery {@link https://jquery.com/}
 * @author Firstname Lastname <email@address.dom>
 * @license LICENSE (/path/to/LICENSE.md)
 */

'use strict';

(function($, window, document, undefined) {
    
    const NAME = 'customhotspot',
        VERSION = '1.0.1',
        DATA_KEY = 'custom.hotspot',
        CLASS_PREFIX = 'custom-hotspot',
        EVENT_KEY = '.' + DATA_KEY;

    const Trigger = {
        HOVER  : 'hover',
        CLICK  : 'click',
        MOUSEOVER: 'mouseover',
        MOUSEOUT: 'mouseout'
    };

    const defaults = {
        "interactivity": "click",
        "theme" : 'some value',
        "schema": {
            'type': 'text',
            'content': '<div class="text-content">Hello</div><div class="text-content">World</div>'
        },
        createWorkspace: function() {

            var $tagElement = _originalPlugin.tagElement,
                height = $tagElement.height(),
                width = $tagElement.width();                
            _instance._$element.css({'height': 'inherit', 'width': 'fit-content', 'position': 'relative'});
                
            $('<span/>')
            .addClass(_instance.options.hotspotOverlayClass)
            .css({'height': '100%', 'width': '100%'})
            .appendTo(_instance._$element)
            .on('click', function(event) {
                event.preventDefault();
                event.stopPropagation();

                // Get coordinates
                const offset = $(this).offset(),
                    relativeX = (event.pageX - offset.left),
                    relativeY = (event.pageY - offset.top);

                const hotspot = { 
                    x: relativeX/width*100, 
                    y: relativeY/height*100,
                    type: _instance.options.schema.type,
                    content: _instance.options.schema.content
                };

                _instance.options.data.push(hotspot);
                _originalPluginPrototype.displaySpot.call(_originalPlugin, hotspot);
            });
        }
    };


    var _instance, _originalPlugin, _originalPluginPrototype;
        
    class Plugin {

        constructor(element, config) {
            _instance = this;
            const options = $.extend(true, {}, defaults, config || {});
            this._$element = $(element);

            
            this._$element.hotspot(options);
            _originalPlugin = this._$element.data('hotspot');
            _originalPluginPrototype = Object.getPrototypeOf(_originalPlugin);

            this.options = $.extend(true, {}, options, _originalPlugin.config);
            if(this.options.createWorkspace){
                this.options.createWorkspace();
            }
            

            this._$element
            .addClass(CLASS_PREFIX + '-container')
            .addClass(Object.values(this.options.theme).join(' '));

            this._$element.append(this.options.containerHtml);

            this.#privateMethod();
        }

        // template to write public methods
        updateTheme() {
            console.log('update theme');
        }

        // template to write private methods
        #privateMethod() {
            // do something
        }
    }


	$.fn[NAME] = function( methodOrOptions ) {
        if (!$(this).length) {
            return $(this);
        }

        // If the first parameter is a string, treat this as a call to a public method.
        if (typeof methodOrOptions === 'string') {
            var methodName = methodOrOptions,
                args = Array.prototype.slice.call(arguments, 1),
                returnVal;

            this.each(function() {
                // Check that the element has a plugin instance, and that
                // the requested public method exists.
                var instance = $(this).data(DATA_KEY);

                // CASE: action method (public method on PLUGIN class)        
                if ( instance 
                    && instance[ methodOrOptions ] 
                    && typeof( instance[ methodOrOptions ] ) == 'function' ) {
                  // Call the method of the Plugin instance, and Pass it the supplied arguments.
                  returnVal = instance[methodOrOptions].apply(instance, args);
                // CASE: method called before init
                } else if ( !instance ) {
                    $.error( 'Plugin must be initialised before using method: ' + methodOrOptions );
                } else {
                    $.error( 'Method ' +  methodOrOptions + ' does not exist.' );
                }
            });
            if (returnVal !== undefined){
                // If the method returned a value, return the value.
                return returnVal;
            } else {
                // Otherwise, returning 'this' preserves chainability.
                return this;
            }
        // CASE: argument is options object or empty = initialise                           
        } else if (typeof methodOrOptions === "object" || !methodOrOptions) {
            return this.each(function() {
                // Only allow the plugin to be instantiated once.
                var instance = $(this).data(DATA_KEY);
                    if (!instance) {
                        // Pass options to Plugin constructor, and store Plugin
                        // instance in the elements jQuery data object.
                        instance = new Plugin( $(this), methodOrOptions );    // ok to overwrite if this is a re-init
                        $(this).data( DATA_KEY, instance );
                }
            });
        }
    };
})(jQuery, window, document);