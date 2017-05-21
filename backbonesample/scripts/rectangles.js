(function (){
	var Rectangle = Backbone.Model.extend({});
	var RectangleView = Backbone.View.extend({
		tagName: 'div',
		className: 'rectangle',
		events:{
			'click': 'move'
		},

		render: function(){
			this.setDimensions();
			this.setPosition();
			this.setColor();
			return this;
		},

		setDimensions: function () {
			this.$el.css({
				width: this.model.get('width') + 'px',
				height: this.model.get('height') + 'px'
			});
		},

		setPosition: function(){
			var position = this.model.get('position');
			this.$el.css({
				left: position.x,
				top: position.y
			});
		},

		setColor: function(){
			this.$el.css('background-color', this.model.get('color'));
		},

		move: function(){
			this.$el.css('left', this.$el.position().left + 10);
		}

	});

	var models = [
		new Rectangle({
			width: 100,
			height: 60,
			position: {
				x: 300,
				y: 150
			},
			color: 'blue'
		}),
		new Rectangle({
			width: 300,
			height: 60,
			position: {
				x: 400,
				y: 150
			},
			color: 'red'
		}),
		new Rectangle({
			width: 50,
			height: 80,
			position: {
				x: 100,
				y: 60
			},
			color: 'green'
		})
	];

	_(models).each(function(model){
		$('div#canvas').append(new RectangleView({model: model}).render().el);
	});	

})();