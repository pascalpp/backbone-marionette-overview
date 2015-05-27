// setup underscore
_.templateSettings.escape		= /\{\{(.+?)\}\}/g;  // {{ escaped_value }}
_.templateSettings.interpolate	= /\[\[(.+?)\]\]/g;  // [[ raw_value ]]
_.templateSettings.evaluate		= /<:([\s\S]+?):>/g; // <: javascript logic :>
_.templateSettings.variable		= 'data';

var Logger = Marionette.Object.extend({
    log: function(object, name) {
        this.listenTo(object, 'all', this.makeLog(name));
    },

    makeLog: function(object_name) {
        return function() {
            if (! this.is_on) return;
            var args = _.toArray(arguments);
            var event_name = args.shift();
            console.log('%c'+object_name, 'margin:0 -3px;margin-left:-8px;color:white;background-color:#990000;padding:3px 8px;border-radius:10px', event_name, args);
        };
    },

    on: function() {
        this.is_on = true;
    },

    off: function() {
        this.is_on = false;
    }
});

logger = new Logger();


var person = new Backbone.Model({
	first_name: 'Pascal',
	last_name: 'Balthrop',
	user_name: 'pascal'
});
logger.log(person, 'person');

var people = new Backbone.Collection([
	{ id: 'pascal', first_name: 'Pascal', last_name: 'Balthrop' },
	{ id: 'daisy',  first_name: 'Daisy',  last_name: 'Fan' },
	{ id: 'david',  first_name: 'David',  last_name: 'Brock' },
	{ id: 'sierra', first_name: 'Sierra', last_name: 'Brown' },
	{ id: 'paul',   first_name: 'Paul',   last_name: 'Nues' },
	{ id: 'jake',   first_name: 'Jake',   last_name: 'Alheid' }
]);
logger.log(people, 'people');

var PersonTemplate = '<div class="data"><div class="name">{{ data.first_name }} {{ data.last_name }}</div></div><div class="actions"><button class="poke">Poke</button></div>';

var PersonView = Marionette.ItemView.extend({
	tagName: 'li',
	className: 'person',
	template: _.template(PersonTemplate),
	initialize: function(options) {
        logger.log(this, 'person_view');
        // re-render the view any time the model changes
		this.listenTo(this.model, 'change', this.render);
	}
});

var PersonViewWithEvents = Marionette.ItemView.extend({
	tagName: 'li',
	className: 'person',
	template: _.template(PersonTemplate),
	initialize: function(options) {
        logger.log(this, 'person_view');
        // re-render the view any time the model changes
		this.listenTo(this.model, 'change', this.render);
	},
    ui: {
		poke: 'button.poke',
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

var PeopleView = Marionette.CollectionView.extend({
	tagName: 'ul',
	className: 'people',
	childView: PersonViewWithEvents
});

var FilteredPersonView = Marionette.ItemView.extend({
	tagName: 'li',
	className: 'person',
	template: _.template(PersonTemplate),
	initialize: function(options) {
        logger.log(this, 'person_view');
        // re-render the view any time the model changes
		this.listenTo(this.model, 'change', this.render);
	},
    ui: {
		poke: 'button.poke',
	},
	events: {
		'click @ui.poke': 'onClickPoke'
	},
	onClickPoke: function() {
		this.model.set('poked', true);
		alert('You poked ' + this.model.get('first_name') + '!');
	}
});


var FilteredPeopleView = Marionette.CollectionView.extend({
	tagName: 'ul',
	className: 'people',
	childView: FilteredPersonView,
    initialize: function() {
        this.listenTo(this.collection, 'change', this.render);
    },
    filter: function(model) {
        return ! model.get('poked');
    }
});


var region = new Marionette.Region({
    el: '.testnode'
});


var dispatcher = function(demo) {
    console.clear();
    switch(demo) {
        case 'model_events':
            logger.on();
            console.log("person: set the first name");
            console.log("set it again");
            break;
        case 'collection_methods':
            logger.off();
            console.log("people: check the length");
            console.log("pluck first names");
            console.log("set the comparator and sort");
            console.log("pluck first names again");
            break;
        case 'collection_events':
            logger.on();
            console.log("people: get the last person");
            console.log("remove the last person");
            console.log("re-add the last person");
            console.log("modify the last person");
            break;
        case 'show_item_view':
            logger.off();
            person_view = new PersonView({ model: person });
            region.show(person_view);
            console.log("person: change the first name");
            console.log("poke button doesn't work yet");
            break;
        case 'show_item_view_with_events':
            logger.off();
            person_view = new PersonViewWithEvents({ model: person });
            region.show(person_view);
            break;
        case 'collection_view':
            logger.off();
            people.comparator = 'first_name';
            people.sort();
            var people_view = new PeopleView({
            	collection: people
            });
            region.show(people_view);
            console.log("david = people.remove('david')");
            console.log("re-add david");
            console.log("re-sort by last name");
            break;
        case 'filtered_collection_view':
            logger.off();
            var filtered_people_view = new FilteredPeopleView({
            	collection: people
            });
            region.show(filtered_people_view);
            break;
        default:
            console.log('demo:', demo);
    }
};
