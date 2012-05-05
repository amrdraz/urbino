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

/* THIS IS AN EXAMPLE */

/* Interface INotifyPropertyChanged */
INotifyPropertyChanged = new Interface( "INotifyPropertyChanged", {
	Intefaces: [ITypeIdentifyable], /* This wouldnt be needed for an INotifyPropertyChanged Interface */
	NotifyPropertyChanged: function() {},
	Set: function() {}
});
/* Interface ICloneable */
ICloneable = new Interface( "IClonable", {
	Clone: function() {}
});
/* Interface ITypeIdentifyable */
ITypeIdentifyable = new Interface( "ITypeIdentifyable", {
	Type: String
});
/* Interface IConvertible */
IConvertible = new Interface( "IConvertible", {
	ToString: function() {}
});

/* A sample Class wich implements some Intefaces */
var NotifyPropertyChanged = new Class({
	Implements: Events,
	Interfaces: [ INotifyPropertyChanged, ITypeIdentifyable, IClonable, IConvertible ],
	
/* #region ITypeIdentifyable Members */
	Type: "NotifyPropertyChanged",
/* #endregion */

/* #region INotifyPropertyChanged Members */	
	NotifyPropertyChanged: function( pName, pValue ) {
		this.fireEvent('propertyChanged', { sender: this, property: pName, value : pValue });
	},
	Set: function( pName, pValue ) {
		try {
			if ( pName in this ) {
				this[pName] = pValue;
				this.NotifyPropertyChanged( pName, pValue );
			}
			else {
				throw new ReferenceError( pName + " does not exist" );
			}
		}
		catch( error ) {
			try {
				console.log( error );
			}
			catch( e ) {
				alert( error );
			}
			
		}
	},
/* #endregion */

/* #region IClonable Members */
	Clone: function() {
		var obj = new Class();
		
		for ( p in this ) {
			obj[p] = this[p];
		}
		return obj;
	},
/* #endregion */

/* #region IConvertible Members */
	ToString: function() {
		return this.Type;
	}
/* #endregion */
});