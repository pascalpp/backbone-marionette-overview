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
            var args = _.toArray(arguments);
            var event_name = args.shift();
            console.log('%c'+object_name, 'color:white;background-color:#990000;padding:3px 8px;border-radius:10px', event_name, args);
        };
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

var PersonTemplate = '<div class="name">Name: {{ data.first_name }} {{ data.last_name }}</div><div class="username">Username: {{ data.user_name }}</div>';

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

var region = new Marionette.Region({
    el: '.testnode'
});
