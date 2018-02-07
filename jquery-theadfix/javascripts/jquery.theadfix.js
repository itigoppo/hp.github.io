/*
 *  Project: Theadfix - jQuery Plugin
 *  Description:
 *  Author: Yu Ishihara (http://12px.com)
 *  License: MIT
 *  Example:

$(function() {
  $('[data-theadfix]').on('fix.theadfix', function(event) {
    console.log('fix.theadfix: ', event.target);
  });
});

 */

;( function( $, window, document, undefined ) {
  "use strict";

  //--------------------------------------------------
  // plugin settings

  var PLUGIN_NAME = 'theadfix';
  var EVENT_KEY = '.' + PLUGIN_NAME;
  var Event = {
    FIX: 'fix' + EVENT_KEY,
    RELEACE: 'release' + EVENT_KEY
  };
  var defaults = {
    wait: 30,
    position: "fixed",
    isFixed: false,
    mode: 'window'
  };

  function Plugin ( element, options ) {
    this.element = element;
    this.settings = $.extend( {}, defaults, options );
    this._defaults = defaults;
    this._name = PLUGIN_NAME;
    this.init();
  }

  $.extend( Plugin.prototype, {
    init: function() {
      var $table = $(this.element);
      var $thead = $table.children('thead').eq(0);

      if($table.attr('data-theadfix') == 'parent' || this.settings.theadfix == 'parent') {
        this.settings.mode = 'parent';
        this.settings.position = 'absolute';
      } else {
        this.settings.position = 'fixed';
      }

      if(!$thead.data('clone')){
        var $clone = $thead.clone();
        $thead.after($clone);
        $clone.css('visibility', 'hidden');
        $clone.attr('aria-hidden', 'true');
        $thead.data('clone', $clone);
        this.updateSize();
      }

      var self = this;
      if(this.settings.mode == 'window') {
        $(window).on('scroll resize', debounce(function() {
          self.onScroll();
        }, this.settings.wait));
      } else {
        $(window).on('resize', debounce(function() {
          self.onScroll();
        }, this.settings.wait));
      }
      this.onScroll();
    },

    onScroll: function() {
      var $table = $(this.element);
      var $thead = $table.children('thead').eq(0);
      var offset = $table.offset();
      if(this.settings.mode == 'parent') {
        this.update(false);
      } else if(offset.top + $table.height() - $thead.height() < $(window).scrollTop() || offset.top > $(window).scrollTop()){
        this.update(true);
      } else if(offset.top < $(window).scrollTop()){
        this.update(false);
      }
    },

    updateSize: function() {
      var $table = $(this.element);
      var $thead = $table.children('thead').eq(0);
      var $thead_clone = $thead.data('clone');

      for(var i = 0; i < $thead.children('tr').length; i++)
      {
        var $thead_tr = $thead.children('tr').eq(i);
        var $clone_tr = $thead_clone.children('tr').eq(i);
        $thead_tr.css('width', $clone_tr.css('width'));
        for (var j = 0; j < $thead_tr.children('th').length; j++){
          var $thead_th = $thead_tr.children('th').eq(j);
          var $clone_th = $clone_tr.children('th').eq(j);
          $thead_th.css('width', $clone_th.css('width'));
        }
      }
    },

    update: function(isFixed) {
      var $table = $(this.element);
      var $thead = $table.children('thead').eq(0);

      if(isFixed) {
        $thead.css('position', 'static');
        $thead.data('clone').css('display', 'none');

        if(this.settings.isFixed != isFixed) {
          this.settings.isFixed = isFixed;
          $table.trigger($.Event(Event.RELEACE));
        }
      } else {
        var border = $table.parent().css('border-top-width');
        $thead.css('position', this.settings.position);
        $thead.css('top', border);
        $thead.data('clone').css('display', 'table-header-group');

        if(this.settings.mode == 'window') {
          var scrollLeft = $(window).scrollLeft();
          var left = $table.offset().left;
          $thead.css("left", -scrollLeft+left);
        }

        if(this.settings.isFixed != isFixed) {
          this.settings.isFixed = isFixed;
          $table.trigger($.Event(Event.FIX));
        }
      }

      this.updateSize();
    }
  });

  function debounce(f, interval) {
    var timer;
    return function() {
      clearTimeout(timer);
      timer = setTimeout(function() {
        f.call();
      }, interval);
    };
  }

  $.fn[ PLUGIN_NAME ] = function( options ) {
    return this.each( function() { if ( !$.data( this, PLUGIN_NAME ) ) {
        $.data( this, PLUGIN_NAME, new Plugin( this, options ) );
      }
    });
  };

  $(function() {
    $('[data-'+PLUGIN_NAME+']')[ PLUGIN_NAME ]();
  });
})( jQuery, window, document );