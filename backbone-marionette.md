# Backbone & Marionette

## Backbone

Backbone is a library of objects for building javascript applications. Among other things, it provides Events, Models, and Collections.

### Backbone.Events

At the heart of Backbone is an event system, which all Backbone objects incorporate.

Objects `trigger` events.

Other objects can `listenTo` those events.

An object will `stopListening` when it is destroyed.

### Backbone.Model

A model is an object, with properties.

```js
var person = new Backbone.Model({
	first_name: 'Pascal',
	last_name: 'Balthrop',
	user_name: 'pascal'
});
```

A model has `get` and `set` methods.

```js
person.get('first_name'); //=> 'Pascal'
person.set('last_name', 'Koplovitz');
```

A model triggers `change` events when a property is changed.

```js
person.set('first_name', 'Blaise');
// events 'change' and 'change:first_name' are triggered
```

Setting the same value on a property _does not_ trigger a change event.
```js
// set the same first_name again
person.set('first_name', 'Blaise');
// nothing changed, so no event is triggered
```


### Backbone.Collection

A collection is an array, containing models.

```js
var pool = new Backbone.Collection([
	{ id: 'pascal', first_name: 'Pascal', last_name: 'Balthrop' },
	{ id: 'sierra', first_name: 'Sierra', last_name: 'Brown' },
	{ id: 'paul', first_name: 'Paul', last_name: 'Nues' }
]);
```

#### Working with collection members

`add`, `remove`, or `reset`.

```js
// put jake in the pool
pool.add({ id: 'jake', first_name: 'Jake', last_name: 'Alheid' });

// never mind, remove jake
pool.remove('jake');

// everybody out of the pool
pool.reset();

```

##### Methods borrowed from `Array` and `Underscore`

- `push`, `pop`
- `shift`, `unshift`
- `first`, `last`
- `map`, `each`
- `find`, `filter`
- and more

#### Collection Events

An `add` or `remove` event when a model is added or removed.

Any `change` events triggered on a collection's models are triggered on the collection too.

### Backbone.View

Backbone provides a rudimentary View class.

A view is a controller that is associated with a DOM node.

In a view, `this.el` is a reference to that DOM node, and `this.$el` is a jQuery reference to that same DOM node.

A Backbone view's render method is _empty_, leaving the implementation to you. This is where Marionette comes in.

## Marionette

Marionette provides a set a of view classes that do a lot of heavy lifting for you.

### Marionette.ItemView

An item view displays data from a single model. You provide a template, and it renders a DOM fragment using the data in the model.

#### Create a template

```htm
<!-- person.html -->
<div class="name">{{ data.first_name }} {{ data.last_name }}</div>
<div class="username">{{ data.user_name }}</div>
```

Note that the template doesn't define the outermost node, which belongs to the view. The template defines the content to be inserted into the view's `el`.

#### Define a view that uses that template
```js
// person_view.js

var Template = require('text!./person.html');

var PersonView = Marionette.ItemView.extend({

	tag: 'li',

	className: 'person',

	template: _.template(Template),

	initialize: function(options) {
		// the view's initialize method is empty by default
		// use it to parse the options passed in and set up listeners

		// re-render the view any time the model changes
		this.listenTo(this.model, 'change', this.render);
	}

});
```

#### Instantiate the view with a model

```
var User = require('model/user');
var PersonView = require('./person_view');

// create a user
var pascal = new User({
	first_name: 'Pascal',
	last_name: 'Balthrop',
	user_name: 'pascal'
});

// create a view
var person_view = new PersonView({
	model: pascal
});

// show the view in a region
AboutMe.main_region.show(person_view);
```

### Marionette.CollectionView

A collection view accepts a `collection` and renders a `childView` for each member in the collection.

#### Define a collection view class

```js
// people_view.js

var PeopleView = Marionette.CollectionView.extend({

	tag: 'ul',

	className: 'people',

	childView: PersonView

});
```

Note that a collection view does not use a template, while its child views do.

#### Instantiate the collection view with a collection

```js
var PeopleView = require('./people_view');

var people_view = new PeopleView({
	collection: pool
});

// show the view in a region
AboutMe.main_region.show(people_view);
```

Collection views automatically listen for `add`, `remove`, and `reset` events, so as you add and remove members in a collection, the collection view will automatically add or remove the item views for those models.


### Marionette.LayoutView

A layout view is just an item view with the ability to define regions within itself. Other views can then be shown in those regions.

#### Create a layout template

```htm
<!-- layout.html -->
<h1>A layout with two regions</h1>
<div class="head-region"></div>
<div class="body-region"></div>
```

#### Define a layout view that uses that template

```js
// layout_view.js

var Template = require('text!./layout.html');

// require in a couple child views
var HeadView = require('./head_view');
var BodyView = require('./body_view');

var MyLayoutView = Marionette.LayoutView.extend({

	className: 'my-layout',

	template: _.template(Template),

	regions: {
		head: '.head-region',
		body: '.body-region'
	},

	onRender: function() {
		// instantiate a new HeadView and show it in the head region
		this.head.show(new HeadView({
			model: this.model
		}));

		// instantiate a new BodyView and show it in the body region
		this.body.show(new BodyView({
			model: this.model
		}));
	}

});
```

### Marionette View Events

Backbone events are triggered _after_ the event has occurred. In Marionette, many events have a `before` companion event that is triggered before the event occurs.

When a view is shown in a region in the DOM, the following events are triggered, in order:

- `before:render` : The view is about to render.
- `render`        : The view has rendered.
- `before:show`   : The view is about to be shown.
- `before:attach` : The view is about to be inserted into the DOM.
- `attach`        : The view has been inserted into the DOM.
- `show`          : The view has been shown.

A view can `listenTo` any of these events, but it can also define specially-named methods which will automatically be triggered when the corresponding event occurs. These methods are created by capitalizing each part of the event name and prefixing it with `on`. For example, a view's `onRender` method is called when the 'render' event occurs. Similarly, `onBeforeRender` is called when the `before:render` event is triggered.

You can leverage this convention for custom events, by using `triggerMethod`. For example, calling `view.triggerMethod('button:click')` will call a method `onButtonClick` if it's defined in the view.


### Inside the View

Views can also def



When a view is destroyed, its event listeners are removed and its `el` is removed from the DOM.
