define(['durandal/system', './transitionHelper'], function(system, helper) {
	var settings = {
		inAnimation: 'bounceIn',
		outAnimation: 'bounceOut'
	},
		transition = function(context) {
			system.extend(context, settings);
			return helper.create(context);
		};

	return transition;

});