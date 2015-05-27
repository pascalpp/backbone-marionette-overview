# Backbone & Marionette

The important bits

!

# Backbone

Javascript building blocks

[reveal]

- Events
- Models
- Collections
- Views
- more (Routing, Sync, etc.)

!

# Backbone.Events

An event system built into every Backbone object

[reveal]

- When something happens, objects `trigger` events
- Other objects `listenTo` those events with event handlers
- Objects `stopListening` when they’re destroyed

Events names typically take the form of `verb` or `verb:subject`.

!

# Backbone.Events


- Event handlers typically get three arguments:
	- [reveal]
	- the object that changed
	- the value that changed
	- an options object
- Special `all` event
- Backbone events _are not_ DOM events

!

# Backbone.Model

A model is an object that manages data.

[reveal]

```js
var person = new Backbone.Model({
	first_name: 'Pascal',
	last_name:  'Balthrop',
	user_name:  'pascal'
});
```

Similar to an `{object}`, but smarter.

!

# Backbone.Model

Attributes are stored internally as `model.attributes`.

[reveal]

You can `set` or `get` individual attributes.

```js
person.set('first_name', 'James');

person.get('first_name'); // returns 'James'
```

!

# Backbone.Model

You can set multiple attributes at once.

```js
person.set({
	'first_name': 'Pascal',
	'last_name':  'Balthrop'
});
```

!

# Backbone.Model

A model triggers `change` events when attributes are changed.

[reveal]

```js
person.set('first_name', 'Blaise');
// triggers 'change:first_name' and 'change'
```

A model _does not_ trigger `change` events when attributes are set to the same value as before.

`DEMO:model_events`


!

# Backbone.Collection

A collection is an object that manages a list of models.

[reveal]

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

# Backbone.Collection

Models are stored internally in an array called `collection.models`.

Things you can do with a collection:

[reveal]

- read the `length`
- `add` and `remove` models
- `pluck` a list of values
- `push`, `pop`, `shift`, `unshift`
- `find`, `filter`, `map`, `each`
- define a `comparator` for sorting
- and more

`DEMO:collection_methods`

!

# Backbone.Collection

Collection events:

[reveal]

- `add`: a model was added.
- `remove`: a model was removed.
- `sort`: the collection was sorted.
- `change`: one of the models in the collection was changed.
- and more

`DEMO:collection_events`

!

# Backbone.View

A view is an object that manages a DOM node.

[reveal]

```
var MyView = Backbone.View.extend({
	tagName: 'div',
	className: 'myview'
});

var myview = new MyView();
```

The above view creates this DOM element:

```htm
<div class="myview"></div>
```

which can be accessed as `this.el` or `this.$el`.


!

# Backbone.View

But our DOM element is empty!

[reveal]

Because the `render` method in a Backbone view is *empty*.

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

# Marionette

Marionette objects do a lot of the heavy lifting for you.

[reveal]

- ItemView
- CollectionView
- Region
- LayoutView
- and some other stuff

!

# Marionette.ItemView

A view of a model

[reveal]

- Accepts a model (`this.model`) and a template
- Provides a `render` method
- Renders a DOM fragment by inserting data from the model into the template
- Inserts that DOM fragment into its `el`
- Can `listenTo` changes in the model and react accordingly
- Manages any DOM events within its `el`

Let’s make a view!

!

#### Using Marionette.ItemView
# Define a template

[reveal]

```htm
<!-- person.html -->
<div class="name">
	{{ data.first_name }} {{ data.last_name }}
</div>
<div class="actions">
	<button class="poke">Poke</button>
</div>
```

Note that we don’t define the outermost node in the template.

!

#### Using Marionette.ItemView
# Define a view

[reveal]

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

Note that we don’t have to define a `render` method.

!

#### Using Marionette.ItemView
# Define a view

```js
// person_view.js
var PersonTemplate = require('text!./person.html');

var PersonView = Marionette.ItemView.extend({
	tagName: 'li',
	className: 'person',
	template: _.template(PersonTemplate),
	initialize: function(options) {
		// re-render the view any time the model changes
		this.listenTo(this.model, 'change', this.render);
	}
});
```

Note that we don’t have to define a `render` method.

!

#### Using Marionette.ItemView
# Instantiate the view with a model and show it

[reveal]

```js
var PersonView = require('./person_view');

// create a view
var person_view = new PersonView({
	model: person
});

// show the view in a region
region.show(person_view);
```

`DEMO:show_item_view`

!

#### Using Marionette.ItemView
# The UI and Events Hashes

[reveal]

```js
var PersonView = Marionette.ItemView.extend({
	[...]
	ui: {
		poke: 'button.poke'
	},
});
```

The `ui` hash lets us create jQuery handles on parts of our view. (`this.ui.poke`)

!

#### Using Marionette.ItemView
# The UI and Events Hashes

```js
var PersonView = Marionette.ItemView.extend({
	[...]
	ui: {
		poke: 'button.poke'
	},
	events: {
		'click @ui.poke': 'onClickPoke'
	},
});
```

[reveal]

The `events` hash lets us map DOM events to methods in the view.

!

#### Using Marionette.ItemView
# The UI and Events Hashes

```js
var PersonView = Marionette.ItemView.extend({
	[...]
	ui: {
		poke: 'button.poke'
	},
	events: {
		'click @ui.poke': 'onClickPoke'
	},
	onClickPoke: function() {
		this.model.set('poked', true);
		this.ui.poke.remove();
		alert('You poked ' + this.model.get('first_name') + '!');
	}
});
```

[reveal]

`DEMO:show_item_view_with_events`

!

# Marionette.CollectionView

A view of a collection

[reveal]

- Accepts a collection of models (`this.collection`) and a `childView`
- Renders a child view for each model in the collection
- Automatically responds to collection events, such as `add` or `remove`
- Can filter the collection, so only certain models are shown

Let’s make a collection view!

!

#### Using Marionette.CollectionView
# Define a collection view

[reveal]

```js
// people_view.js
var PersonView = require('./person_view');

var PeopleView = Marionette.CollectionView.extend({
	tagName: 'ul',
	className: 'people',
	childView: PersonView
});
```

This creates a `ul.people` node and fills it with `li.person` nodes.

Note that a collection view does not use a template; its child views do.

!

#### Using Marionette.CollectionView
# Instantiate the view with a collection and show it

[reveal]

```js
var PeopleView = require('./people_view');

var people_view = new PeopleView({
	collection: people
});

// show the view in a region
region.show(people_view);
```

`DEMO:collection_view`

!

#### Using Marionette.CollectionView
# Filtering the collection

Collection views can define a `filter` method to control which models are displayed.

[reveal]

```js
var PeopleView = Marionette.CollectionView.extend({
	[...],
	initialize: function() {
        this.listenTo(this.collection, 'change', this.render);
    }
});
```

!
#### Using Marionette.CollectionView
# Filtering the collection

Collection views can define a `filter` method to control which models are displayed.

```js
var PeopleView = Marionette.CollectionView.extend({
	[...],
	initialize: function() {
        this.listenTo(this.collection, 'change', this.render);
    },
	filter: function(model) {
		// return true if the model should be displayed
	}
});
```

!
#### Using Marionette.CollectionView
# Filtering the collection

Collection views can define a `filter` method to control which models are displayed.

```js
var PeopleView = Marionette.CollectionView.extend({
	[...],
	initialize: function() {
        this.listenTo(this.collection, 'change', this.render);
    },
	filter: function(model) {
		return ! model.get('poked');
	}
});
```

[reveal]

`DEMO:filtered_collection_view`

!

# Marionette.Region

[reveal]

A region is an object that manages showing views in the DOM.

```js
var region = new Marionette.Region({
	el: '.my-region'
});
```

```js
region.show(view);
```

This calls `view.render` and appends `view.el` to the region’s `el`.

One view at a time! Any previous view is removed and destroyed.

```js
region.empty();
```


!

# Marionette View Events

[reveal]

Backbone events are triggered _after_ the event has occurred.

Many events have a `before` companion event.

- `before:render` : The view is about to render.
- `render`        : The view has rendered.
- `before:show`   : The view is about to be shown.
- `before:attach` : The view is about to be inserted into the DOM.
- `attach`        : The view has been inserted into the DOM.
- `show`          : The view has been shown.

!

# Marionette View Events

A view can `listenTo` any of these events when it is initialized.

[reveal]

Or, it can define methods named after these events, using the convention:

```
event name      view event handler
'some:event'    'onSomeEvent'
```

`onBeforeRender`, `onRender`, `onBeforeAttach`, `onAttach`, `onBeforeShow`, `onShow`, etc.

This convention can be used for `custom:event` names too.

!

# Marionette.LayoutView

[reveal]

- Basically just an ItemView with built-in `regions`
- Can show other views in its `regions`
- Can be used as the `childView` in a collection

Let’s make a layout view!

TODO: show people view with first/last sort buttons in the head

!

#### Using Marionette.LayoutView
# Define a template with some regions

[reveal]

```htm
<!-- layout.html -->
<div class="head-region"></div>
<div class="body-region"></div>
```

!

#### Using Marionette.LayoutView
# Define a layout view

[reveal]

```js
// require our template and a couple child views
var Template = require('text!./layout.html');
var HeadView = require('./head_view');
var BodyView = require('./body_view');
```

!

#### Using Marionette.LayoutView
# Define a layout view

```js
// require our template and a couple child views
var Template = require('text!./layout.html');
var HeadView = require('./head_view');
var BodyView = require('./body_view');

var MyLayoutView = Marionette.LayoutView.extend({
	className: 'my-layout',
	template: _.template(Template)
});
```

!

#### Using Marionette.LayoutView
# Define a layout view

```js
// require our template and a couple child views
var Template = require('text!./layout.html');
var HeadView = require('./head_view');
var BodyView = require('./body_view');

var MyLayoutView = Marionette.LayoutView.extend({
	className: 'my-layout',
	template: _.template(Template),
	regions: {
		head: '.head-region',
		body: '.body-region'
	}
});
```

!

#### Using Marionette.LayoutView
# Define a layout view

```js
// require our template and a couple child views
var Template = require('text!./layout.html');
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

[reveal]

Adding child views `onRender` allows you to build a whole view hierarchy and push it into the DOM in one fell swoop.

!

# The End!
