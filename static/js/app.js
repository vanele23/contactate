/**
 * App
 */
var App = new (Backbone.Router.extend({

  routes: {
    //"libro/:id": "show", //matches "libro/1" y "libro/1/"
    "contactos(/)": "index", //matches "libros" y "libros/"
    "*any" : "redirect" //matches anything else *wildcard ;)
     },

  initialize: function(){

  },

  start: function(bootstrap){

    //creamos lista de libros sin filtrar
    //mediante bootstrapping :)
    this.ContactosList = new ContactosList(bootstrap.data);

    //lista filtrada que se usará para generar las vistas
    this.activeList = null;

    this.filter='';

    Backbone.history.start();
  },

  redirect: function()
  {
    //redirigimos a ruta inicial
    this.navigate("contactos/",true);
  },

  index: function(){

    //initialize
    if(!this.activeList)
      this.activeList = new ContactosList(this.ContactosList.models);

    var librosView = new LibroListaView({collection: this.activeList});

    //generamos vista
    $('#ui').html(_.template($('#searchTemplate').html(),
      //escape to prevent XSS attack
      { filter: _.escape(this.filter), sortOrder: this.activeList.sortOrder, sortField: this.activeList.sortField }
    ));
    $('#app').html(librosView.el);

    //pedimos datos al server
    //this.activeList.fetch();

    //render
    //no haria falta si cargamos del server ya que reaccionamos a los eventos :)
    librosView.render();

  },

  //ordenar por attr field en order order
  sortBy: function(field, order)
  {
    this.activeList.sortField = field;
    this.activeList.sortOrder = order;

    this.activeList.sort();
  },

  //filtrar libros
  filterBy: function(filter)
  {
    this.filter = filter;

    //"remember" sort options
    var field = this.activeList.sortField;
    var order = this.activeList.sortOrder;

    this.activeList = this.librosList.search(this.filter);

    //sort results
    this.activeList.sortField = field;
    this.activeList.sortOrder = order;
    this.activeList.sort();

    //creamos nueva vista con datos filtrados
    var librosView = new LibroListaView({collection: this.activeList });

    //regeneramos vista
    librosView.render();
    $('#app').html(librosView.el);

  }

}))();
