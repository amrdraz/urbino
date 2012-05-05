/*
---
description: Interfaces provides some Interface functionality to Class (and also provides an Interface Object)

license: MIT-style

authors:
- Sebastian Wohlrab

requires:
  core/1.2.4: '*'
# actually:
# - core/1.2.4: Element

provides: [Class.Interfaces]

...
*/

Class.Mutators.Interfaces = function( interfaces ) {
	this.implement('initialize', function(){});
	return interfaces;
};
Class.Mutators.initialize = function( initialize ) {
	return function() {
		$splat( this.Interfaces ).each( function( implemented ) {
			implemented.Interface.Check( this );
		}, this);
		return initialize.apply( this, arguments );
	};
};
var Interface = function( name, members ) {
	members.Interface = {
		Name: name,
		Check: function( obj ) {
			var error = [];
			for ( p in members ) {
				switch( p ) {
					case "Interface": /* reservated */ break;
					case "Interfaces":
						var existing = false;
						$splat(members[p]).each(function(iNeeded) {
							$splat(obj[p]).each(function(iExisting) {
								if ( iNeeded.Interface.Name == iExisting.Interface.Name) existing = true;
							});
						});
						if ( !existing ) {
							error.push( p );
						}
					break;
					default:
						if ( !(p in obj) ) {
							error.push( p );
						}
					break;
				}
			}
			if ( error.length > 0 ) {
				throw new Error( "[" + this.Name + "] The following Interface members are not implemented yet: " + error.join(', ') );
			}
		}
	};
	return members;
};