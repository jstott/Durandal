define(['durandal/system', './transitionHelper'], function(system, helper) {

  var settings = {
    inAnimation: 'fadeInLeftBig',
    outAnimation: 'fadeOutRightBig',
    jsOutFallback: function($previousView, duration) {
      $previousView.animate({
        left: '101%'
      }, duration);
    },
    jsInFallback: function($newView, duration) {
      $newView.css({
        left: '-101%'
      });
      $newView.animate({
        left: '0'
      }, duration);
    }
  }, 
  slideInRight = function(context) {
      system.extend(context, settings);
      return helper.create(context);
    };

  return slideInRight;

});