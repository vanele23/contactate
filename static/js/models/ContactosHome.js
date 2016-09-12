/*Moldelo Libroo*/

var Contactos = Backbone.Model.extend({
	defaults: { id:0, nombre: '', apellido:'', alias:'', telefono:'',email: '',direccion:'',fechaCreacion:''},
	/*urlRoot: "libros.json",*/

	parse : function(response)
	{
		//en caso de que el server nos pase un array,
		//tomamos el 1er elemento
		if($.isArray(response))
			return response[0];

		return response;
	}
});


var ContactosList = Backbone.Collection.extend({
defaults: {
        model: Contactos
    },
	model: Contactos,
	url: "libros.json", /*Donde se alojan los datos de todos los libros*/

	/* Orden ascendete por titulo*/
	sortOrder: "asc",
	sortField: "apellido",
	/*initialize: function(){
        this.parse();
    },*/
		parse: function(response){
       return response.results;
    },

  /*  parse: function(json) {
        return _.map(json, function(p) { return p.product });
    },*/

	/*Metodos a implementar Comparator y Search*/
	comparator: function (libro1, libro2)
	{
		if(this.sortOrder === "asc")
		{
			return libro1.get(this.sortField) > libro2.get(this.sortField);

		}else //this.sortOder === "desc"
		{
			return libro1.get(this.sortField) < libro2.get(this.sortField);
		}
	},

	search: function(letters)
	{
		if(letters === "") return this;

		//filtramos por regexp, i flag para ignore case (no distinguir lowercase/uppercase)
		var pattern = new RegExp(letters,'i');

		//iteramos la coll
		var filteredList = this.filter(function(data)
		{
			return (pattern.test( data.get('nombre') + "  "+data.get('apellido') ));
			//podríamos filtrar por editorial también
			//return ( pattern.test(data.get('autor')) || pattern.test(data.get('titulo')) );// || pattern.test(data.get('editorial')) );
		});

		//create new coll con los elementos filtrados
		var coll = new ContactosList(filteredList);

		return coll;

	}
});
