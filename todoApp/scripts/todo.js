"use strict";

//Creating model class
var TodoItem = Backbone.Model.extend({
	//moving View togglefunction to inside model, because this is better backbone logicm keeign model Status functions inside Model
	toggleStatus: function(){
		if(this.get('status')==='incomplete'){
			this.set({'status': 'complete'});
		}else{
			this.set({'status': 'incomplete'});
		}
		//save to api endpoint
		this.save();

	},
});

//creating model instance
var todoItem = new TodoItem(
	{ description: 'Pick up milk',
	  status: 'incomplete',
	  id: 1
	});

//creatign View instance
var TodoView = Backbone.View.extend({	
	//Changes default div tag to article
	tagName: 'article',
	id: 'todo-view',
	//top-level element is created with a class of todo
	className: 'todo',
	template: _.template('<h3 class="<%= status %>">'+
		'<input type=checkbox'+
		'<% if(status=== "complete") print("checked") %>/>' +
		'<%= description %></h3>'),

	events: {
		//<event> <selector>: <method>
		"click h3": "changeColor",
		"change input": 'toggleStatus'
	},
	changeColor: function(e){
		this.$el.css({
			color: 'red'
		});
	},
	//called whenever a new instance of the todoStatus function is created i.e. in simple terms, whenever a change is made, we can rerender the view
	initialize: function(){
		this.model.on('change', this.render, this);
		this.model.on('destroy', this.remove, this);
		this.model.on('hide', this.remove, this);
	},
	toggleStatus: function(){
		this.model.toggleStatus();
	},
	render: function(){
		var attributes = this.model.toJSON();
		//var html = '<h3>' + this.model.get('description') + '</h3>';
		this.$el.html(this.template(attributes));
	},

	remove: function(){
		this.$el.remove();
	}
});

// instanciating Views
var todoView = new TodoView({model: todoItem});
todoView.render();


// Declaring Todolist collection
var TodoList = Backbone.Collection.extend({
	model: TodoItem
});

//initializing collection 
var todoList = new TodoList();

//Sending an alert whenever data added to collection
todoList.on('reset', function(){
  alert("fetched" + this.length + "appointments from the server");
});

//populating todolist collection
var todos = [
	{description: "Pick up the milk.", status: 'incomplete', id:1},
	{description: "Get a car wash", status: 'incomplete', id:2},
	{description: "Learn Backbone", status: 'incomplete', id:3}
];

//Reset populates the TodoList
//todoList.reset(todos);

//Loop through the collection and alert description
/*todoList.forEach(function(todoItem){
	alert(todoItem.get('description'));
});*/


//Defining Collection view
var TodoListView = Backbone.View.extend({
	initialize: function(){
		this.collection.on('add', this.addOne, this);
		this.collection.on('reset', this.addAll, this);
		this.on('remove', this.hideModel);
	},
	addOne: function(todoItem){
		var todoView = new TodoView({model: todoItem});
		this.$el.append(todoView.render().el);
	},
	addAll: function(){
		this.collection.forEach(this.addOne, this);
	},
	hideModel: function(model){
		model.trigger('hide');
	},
	render: function(){
		this.addAll();
	}
});

//create new instance of the collection
var todoListView = new TodoListView({collection: todoList});
todoListView.render();
console.log(todoListView.el);



/*
	Defining a router for forward and back buttons
*/
/*
var TodoRouter = new Backbone.Router.extend({
	routes: {"": "index",
		"todos/:id": 'show'},
	index: function(){
		this.todoList.fetch();
	},
	show: function(id){
		this.todoList.functionOnTodoItem(id);
	},
	initialize: function(options){
		this.todoList = options.todoList;
	}

})*/

/* Reformatting the above router code to organize application usign TodoApp router*/
var TodoApp = new (Backbone.Router.extend({
	routes: {"": "index", 
		"todos/:id": "show"},
	initialize: function(){
		this.todoList = new TodoList();
		this.todoView = new TodoListView({collection: this.todoList});
		$('#app').append(this.todosView.el);
	},
	start: function(){
		Backbone.history.start({pushState: true});
	},
	index: function(){
		this.todoList.fetch();
	},
	show: function(id){
		this.todoList.focusOnTodoItem(id);
	}
}));

$(function(){ TodoApp.start() });





//testing below
if(todoItem.attributes.status == 'incomplete'){
	$('#canvas').html(todoView.el);
}
else{
	$('#canvas').html("<p>No Tasks Left</p>");
}
