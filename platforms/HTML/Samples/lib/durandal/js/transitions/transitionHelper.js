define(['durandal/system', 'jquery', 'knockout'], function(system, $, ko) {

  var animationTypes = [
    'bounce',
    'bounceIn',
    'bounceInDown',
    'bounceInLeft',
    'bounceInRight',
    'bounceInUp',
    'bounceOut',
    'bounceOutDown',
    'bounceOutLeft',
    'bounceOutRight',
    'bounceOutUp',
    'fadeIn',
    'fadeInDown',
    'fadeInDownBig',
    'fadeInLeft',
    'fadeInLeftBig',
    'fadeInRight',
    'fadeInRightBig',
    'fadeInUp',
    'fadeInUpBig',
    'fadeOut',
    'fadeOutDown',
    'fadeOutDownBig',
    'fadeOutLeft',
    'fadeOutLeftBig',
    'fadeOutRight',
    'fadeOutRightBig',
    'fadeOutUp',
    'fadeOutUpBig',
    'flash',
    'flip',
    'flipInX',
    'flipInY',
    'flipOutX',
    'flipOutY',
    'hinge',
    'lightSpeedIn',
    'lightSpeedOut',
    'pulse',
    'rollIn',
    'rollOut',
    'rotateIn',
    'rotateInDownLeft',
    'rotateInDownRight',
    'rotateInUpLeft',
    'rotateInUpRight',
    'rotateOut',
    'rotateOutDownLeft',
    'rotateOutDownRight',
    'rotateOutUpLeft',
    'roateOutUpRight',
    'shake',
    'swing',
    'tada',
    'wiggle',
    'wobble'
  ];

  return App = {
    duration: 1000 * .6, // seconds
    isNotCss3Compliant: function() {
      return !!(Modernizr && !Modernizr.csstransitions && !Modernizr.csstransforms);
    },
    create: function(settings) {
      settings = ensureSettings(settings);
      return doTrans(settings);
    }
  };

  function animValue(type) {
    if (Object.prototype.toString.call(type) == '[object String]') {
      return type;
    } else {
      return animationTypes[type];
    }
  }

  function ensureSettings(settings) {
    settings.inAnimation = settings.inAnimation || 'fadeInRight';
    settings.outAnimation = settings.outAnimation || 'fadeOut';
    return settings;
  }

  function doTrans(settings) {
    var parent = settings.parent,
      activeView = settings.activeView,
      newChild = settings.child,
      outAn = animValue(settings.outAnimation),
      inAn = animValue(settings.inAnimation),
      $newView, $previousView;

    return system.defer(function(dfd) {
      if (newChild) {

        $newView = $(newChild);
        //$newView = $(newChild).removeClass(outAn + ' ' + inAn + ' animated');
        if (settings.activeView) {
          outTransition(inTransition);
        } else {
          inTransition();
        }
      }

      function outTransition(callback) {
        $previousView = $(activeView);

        if (this.jsOutFallback && App.isNotCss3Compliant()) {
          $previousView.stop();
          this.jsOutFallback($previousView, App.duration);
          if (callback) {
            callback();
          }
        } else {
          $previousView.addClass(outAn + ' animated');
          setTimeout(function() {
            $previousView.hide();
            $previousView.removeClass(outAn + ' animated');
            if (callback) {
              callback();
            }
          }, App.duration);
        }
      }

      function inTransition() {
        if (this.jsInFallback && App.isNotCss3Compliant()) {
          $newView.stop();
          this.jsInFallback($newView, App.duration);
          dfd.resolve(true);
        } else {
          $newView.addClass(inAn + ' animated');
          $newView.show(App.duration, function() {
            $newView.removeClass(inAn + ' ' + outAn + ' animated');
            dfd.resolve(true);
          });
        }
      }

    }).promise();
  }
});