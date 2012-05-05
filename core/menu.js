/* Command, Composite and MenuObject interfaces. */
/*global Class,Interface,Element*/


var ICommand = new Interface('Command', {
        'execute': function(){}
    });
var IComposite = new Interface('Composite', {
    'add': function(){}, 'remove':function(){}, 'getChild':function(){}, 'getElement':function(){}
    });
var IMenuObject = new Interface('MenuObject', {
    'show':function(){}
    });


// var ICommand = new Interface('Command', ['execute']);
// var IComposite = new Interface('Composite', ['add', 'remove', 'getChild', 'getElement']);
// var IMenuObject = new Interface('MenuObject', ['show']);

/* MenuBar class, a composite. */
var MenuBar = new Class({// implements Composite, MenuObject
    
    Interfaces: [IComposite, IMenuObject],
    
    initialize: function () {
        this.menus = {};
        this.element = new Element('ul',{"class":"hide"});
    },
    
    add : function(menuObject) {
        Interface.ensureImplements(menuObject, Composite, MenuObject);
        this.menus[menuObject.name] = menuObject;
        this.element.appendChild(this.menus[menuObject.name].getElement());
    },
    remove : function(name) {
        delete this.menus[name];
    },
    getChild : function(name) {
        return this.menus[name];
    },
    getElement : function() {
        return this.element;
    },
    show : function() {
        this.element.style.display = 'block';
        for(var name in this.menus) {// Pass the call down the composite.
            this.menus[name].show();
        }
    }
});
console.log(new MenuBar());
/* Menu class, a composite. */
var Menu = function(name) {// implements Composite, MenuObject
    this.name = name;
    this.items = {};

    this.element = document.createElement('li');
    this.element.innerHTML = this.name;
    this.element.style.display = 'none';
    this.container = document.createElement('ul');
    this.element.appendChild(this.container);
};
Menu.prototype = {
    add : function(menuItemObject) {
        Interface.ensureImplements(menuItemObject, Composite, MenuObject);
        this.items[menuItemObject.name] = menuItemObject;
        this.container.appendChild(this.items[menuItemObject.name].getElement());
    },
    remove : function(name) {
        delete this.items[name];
    },
    getChild : function(name) {
        return this.items[name];
    },
    getElement : function() {
        return this.element;
    },
    show : function() {
        this.element.style.display = 'block';
        for(name in this.items) {// Pass the call down the composite.
            this.items[name].show();
        }
    }
};

/* MenuItem class, a leaf. */
var MenuItem = function(name, command) {// implements Composite, MenuObject
    Interface.ensureImplements(command, Command);
    this.name = name;
    this.element = document.createElement('li');
    this.element.style.display = 'none';
    this.anchor = document.createElement('a');
    this.anchor.href = '#';
    // To make it clickable.

    this.element.appendChild(this.anchor);
    this.anchor.innerHTML = this.name;
    addEvent(this.anchor, 'click', function(e) {// Invoke the command on click.
        e.preventDefault();
        command.execute();
    });
};
MenuItem.prototype = {
    add : function() {
    },
    remove : function() {
    },
    getChild : function() {
    },
    getElement : function() {
        return this.element;
    },
    show : function() {
        this.element.style.display = 'block';
    }
};
/* MenuCommand class, a command object. */
var MenuCommand = function(action) { // implements Command
this.action = action;
};
MenuCommand.prototype.execute = function() {
this.action();
};