# Backbone & Marionette

A high-level overview, covering all the important bits.

!

## Backbone

"Building blocks"

- Events
- Models
- Collections
- Views
- more (Routing, Sync, etc.)

!

## Backbone Events

- When something happens, objects `trigger` events
- Other objects `listenTo` those events and respond
- Objects `stopListening` when they’re destroyed
- Special `all` event

!

## Backbone Events

- Backbone events _are not_ DOM events

!

## Backbone.Model

A model is an object that manages data.

```js
var person = new Backbone.Model({
	first_name: 'Pascal',
	last_name: 'Balthrop',
	user_name: 'pascal'
});
```

Similar to an `{object}`, but smarter.

!

## Backbone.Model

You can `set` or `get` the properties of a model.

```js
person.set('first_name', 'James');

person.get('first_name');
// returns 'James'
```

!

## Backbone.Model

A model triggers `change` events when properties are changed.  `DEMO`

```js
person.set('first_name', 'Blaise');
// triggers 'change:first_name' and 'change'
```

!

## Backbone.Model

A model _does not_ trigger `change` events when properties<br>
are set to the same value as before.

```js
person.set('first_name', 'Blaise');
// nothing changed, so nothing is triggered
```

!

## Backbone.Collection

A collection is an object that manages a list of models.

```js
var people = new Backbone.Collection([
	{ id: 'pascal', first_name: 'Pascal', last_name: 'Balthrop' },
	{ id: 'daisy',  first_name: 'Daisy',  last_name: 'Fan' },
	{ id: 'david',  first_name: 'David',  last_name: 'Brock' },
	{ id: 'sierra', first_name: 'Sierra', last_name: 'Brown' },
	{ id: 'paul',   first_name: 'Paul',   last_name: 'Nues' },
	{ id: 'jake',   first_name: 'Jake',   last_name: 'Alheid' },
	[...]
]);
```

Similar to an `[array]`, but smarter.



!

## Backbone.Collection

You can add or remove models, or query the collection, or iterate over it. `DEMO`

- `length`
- `add`, `remove`, `reset`
- `push`, `pop`, `shift`, `unshift`
- `first`, `last`
- `map`, `each`
- `find`, `filter`
- and more

!

## Collection Events

- An `add` event is triggered when a model is added.
- A `remove` event is triggered when a model is removed.
- Any `change` events triggered on the models in a collection are triggered on the collection too.

`DEMO`

!

## Backbone.View

A view is an object that manages a DOM node.

You can access a view’s DOM node as `this.el` or `this.$el`.

!

## Backbone.View

The render method in a Backbone view is *empty*.

The implementation is left up to you:

```
- data serialization
- template parsing
- html string concatenation
- DOM insertion
- responding to data changes
- DOM removal and cleanup
```

This is where Marionette comes in.

!

## Marionette

Marionette objects do a lot of the heavy lifting for you.

- ItemView
- CollectionView
- LayoutView
- Region
- other stuff too

!

## Marionette.ItemView

- Accepts a model (`this.model`)
- Consumes an HTML template you provide
- Renders a DOM fragment with data from the model
- Doesn’t insert itself into the DOM

!

#### Using Marionette.ItemView
## Define a template

```htm
<!-- person.html -->
<div class="name">
	Name:
	{{ data.first_name }}
	{{ data.last_name }}
</div>
<div class="username">
	Username:
	{{ data.user_name }}
</div>
```

!

#### Using Marionette.ItemView
## Define a view

```js
// person_view.js
var PersonTemplate = require('text!./person.html');

var PersonView = Marionette.ItemView.extend({
	tagName: 'li',
	className: 'person',
	template: _.template(PersonTemplate),
	initialize: function(options) {
		// the initialize method is empty
		// parse options and set up listeners here
	}
});
```

Note that there is no `render` method;<br>
Marionette.ItemView provides that for us.

!

#### Using Marionette.ItemView
## Define a view

```js
// person_view.js
var Template = require('text!./person.html');

var PersonView = Marionette.ItemView.extend({
	tagName: 'li',
	className: 'person',
	template: _.template(Template),
	initialize: function(options) {
		// re-render the view any time the model changes
		this.listenTo(this.model, 'change', this.render);
	}
});
```

Note that there is no `render` method;<br>Marionette.ItemView provides that for us.

!

#### Using Marionette.ItemView
## Instantiate the view with a model and show it

```js
var PersonView = require('./person_view');

// create a view
var person_view = new PersonView({
	model: person
});

// show the view in a region
AboutMe.main_region.show(person_view);
```

!

## Demo


!

## Inside a view

A view can define a few other helpful properties or methods.


!

## Marionette.Region

A region is an object that manages showing views in a particular DOM node.

```js
var my_region = new Marionette.Region({
	el: '.my-region'
});
```

!

#### Marionette.Region
## Showing a view in the region

```js
my_region.show(view);
```

The view's `render` method is called, and then `view.el` is appended to the region’s DOM node.

!

#### Marionette.Region
## One view at a time!

If you show a view in a region that already contains a view, the previous view is removed and destroyed.

!

#### Marionette.Region
## Emptying a region

```js
my_region.empty();
```

Empties the region, destroying any view it contains.

!

## Marionette.CollectionView

- Accepts a collection of models (`this.collection`)
- Consumes an ItemView you define (`childView`)
- Renders a view for each model in the collection
- Combines them all into a single DOM fragment
- Automatically responds to collection events, such as `add` or `remove`

!

#### Using Marionette.CollectionView
## Define a collection view

```js
// people_view.js

var PeopleView = Marionette.CollectionView.extend({
	tagName: 'ul',
	className: 'people',
	childView: PersonView
});
```

Note that a collection view does not use a template; its child views do.

!

#### Using Marionette.CollectionView
## Instantiate the view with a collection and show it

```js
// people_view.js

var PeopleView = require('./people_view');

var people_view = new PeopleView({
	collection: people
});

// show the view in a region
AboutMe.main_region.show(people_view);
```

!

## Marionette.LayoutView

- Basically just an ItemView with built-in `regions`
- Can show other views in its `regions`
- Can be used as the `childView` in a collection

!

#### Using Marionette.LayoutView
## Define a template with some regions

```htm
<!-- layout.html -->
<p>Head region</p>
<div class="head-region"></div>
<p>Body region</p>
<div class="body-region"></div>
```

!

#### Using Marionette.LayoutView
## Define a layout view

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
		// instantiate a new HeadView
		// and show it in the head region
		this.head.show(new HeadView({
			model: this.model
		}));

		// instantiate a new BodyView
		// and show it in the body region
		this.body.show(new BodyView({
			model: this.model
		}));
	}
});
```

!

## Marionette View Events

Backbone events are triggered _after_ the event has occurred.

Many events have a `before` companion event.

- `before:render` : The view is about to render.
- `render`        : The view has rendered.
- `before:show`   : The view is about to be shown.
- `before:attach` : The view is about to be inserted into the DOM.
- `attach`        : The view has been inserted into the DOM.
- `show`          : The view has been shown.

!

## Marionette View Events

A view can `listenTo` any of these events when it is initialized.

Or, it can define methods names after these events, using the convention:

```
event name      view event handler
'some:event'    'onSomeEvent'
```

`onBeforeRender`, `onRender`, `onBeforeAttach`, `onAttach`, `onBeforeShow`, `onShow`, etc.

This convention can be used for `custom:events` too.
