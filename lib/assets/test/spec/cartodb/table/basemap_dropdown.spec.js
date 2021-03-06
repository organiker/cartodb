describe("basemap_dropdown", function() {

  var view, mapView;

  beforeEach(function() {

    var table = TestUtil.createTable('test');
    var infowindow = new cdb.geo.ui.InfowindowModel({ });
    var vis = TestUtil.createVis("jam");
    var map = new cdb.admin.Map();
    var layer = new cdb.admin.CartoDBLayer({
      table_name: 'test',
      tile_style: 'test',
      user_name: 'test'
    });

    map.layers.add(layer);
    map.layers.add(new cdb.admin.CartoDBLayer({
      table_name: 'test2',
      tile_style: 'style',
      user_name: 'test'
    }));

    var element = $('<div><div class="cartodb-map"></div></div>');
    element.appendTo($('body'))

    mapView = new cdb.admin.MapTab({
      user: TestUtil.createUser('jamon'),
      model: map,
      vis: vis,
      menu: new cdb.admin.RightMenu({}),
      geocoder: new cdb.admin.Geocoding('', table),
      el: element,
      baseLayers: new cdb.admin.Layers([ new cdb.admin.TileLayer({ urlTemplate: 'rabos'}) ])
    });

    mapView.enableMap();
    mapView.render();

    layerView = new cdb.admin.LayerPanelView({
      model: layer,
      vis: TestUtil.createVis(),
      user: TestUtil.createUser('jamon'),
      globalError: new cdb.admin.GlobalError({ el: $('<div>') })
    });

    mapView.setActiveLayer(layerView);

    view = new cdb.admin.DropdownBasemap({
      target: $('.basemap_dropdown'),
      position: "position",
      template_base: "table/views/basemap/basemap_dropdown",
      model: map,
      mapview: mapView,
      baseLayers: new cdb.admin.Layers([ new cdb.admin.TileLayer({ urlTemplate: 'rabos'}) ]),
      available_basemaps: { stamen: true, here: false },
      tick: "left",
      vertical_offset: 40,
      horizontal_position: "left"
    });

  });

  afterEach(function() {
    if (mapView.options.geocoder.dlg) mapView.options.geocoder.dlg.hide();
    if (mapView.noGeoRefDialog) mapView.noGeoRefDialog.clean();
    localStorage.clear();
    mapView.$el.html('').remove();
    $('.dropdown').remove();
  })

  it("should render the view", function() {
    view.render();
    expect(view.$el.length).toEqual(1);
  });

  it("should render the available basemaps", function() {
    view.render();
    expect(view.$el.find(".thumbs.stamen").length).toEqual(1);
    expect(view.$el.find(".thumbs.here").length).toEqual(0);
  });

});
