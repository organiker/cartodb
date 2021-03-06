var cdb = require('cartodb.js');
var handleAHref = require('new_common/view_helpers/handle_a_href_on_click');
var pluralizeString = require('new_common/view_helpers/pluralize_string');

/**
 *  Dashboard filters.
 *
 *  - 'Order by' (time,likes,etc) collection.
 *  - 'Filter by' collection.
 *  - 'Search' any pattern within collection.
 *
 */
module.exports = cdb.core.View.extend({

  className: 'DashboardFilters-inner',

  _TOOLTIPS: ['js-likes', 'js-mapviews', 'js-updated_at'],

  events: {
    'submit .DashboardFilters-searchForm':  '_submitSearch',
    'click .DashboardFilters-searchLink':   '_onSearchClick',
    'click .DashboardFilters-cleanSearch':  '_onCleanSearchClick',
    'click .DashboardFilters-searchForm':   'killEvent',
    'click .js-deselect_all':               '_unselectAll',
    'click .js-select_all':                 '_selectAll',
    'click .DashboardFilters-orderLink':    '_changeOrder',
    'click a.DashboardFilters-typeLink':     handleAHref
  },

  initialize: function() {
    this.router = this.options.router;
    this.user = this.options.user;
    this.localStorage = this.options.localStorage;
    this.template = cdb.templates.getTemplate('new_dashboard/views/filters');

    this._initBinds();
  },

  render: function() {
    this.clearSubViews();

    var selectedItems = this._getSelectedItems();

    this.$el.html(
      this.template(
        _.extend({
            order:                 this.localStorage.get('dashboard.order'),
            isInsideOrg:           this.user.isInsideOrg(),
            prefix:                cdb.config.prefixUrl(),
            selectedItems:         selectedItems,
            totalItems:            this.collection.size(),
            routerModel:           this.router.model,
            pluralizedContentType: pluralizeString(this.router.model.get('content_type') === "datasets" ? 'dataset' : 'map', selectedItems)
          },
          this.router.model.attributes
        )
      )
    );

    // Init views
    this._initViews();

    // Animations?
    this._animate();

    return this;
  },

  _initBinds: function() {
    this.router.model.bind('change', this.render, this);
    this.collection.bind('change reset', this.render, this);
    cdb.god.bind('closeDialogs', this._animate, this);

    this.add_related_model(this.collection);
    this.add_related_model(this.router.model);
    this.add_related_model(cdb.god);
  },

  _initViews: function() {
    // Tipsys?
    var self = this;
    _.each(this._TOOLTIPS, function(el,i){
      self.addView(
        new cdb.common.TipsyTooltip({
          el: self.$('.' + el),
          title: function(e) {
            return $(this).attr('data-title')
          }
        })
      )
    });
  },

  _getSelectedItems: function() {
    return this.collection.filter(function(mdl,i){
      return mdl.get('selected')
    }).length;
  },

  _animate: function() {
    // Show filters or selected items actions
    var selectedItems = this._getSelectedItems();
    this.$el[ selectedItems > 0 ? 'addClass' : 'removeClass' ]('items--selected');
    
    // Check if any search is applied
    var search = this.router.model.get('q') || this.router.model.get('tag');
    this.$el[ search ? 'addClass' : 'removeClass' ]('search--enabled');
  },


  // Selection actions

  _selectAll: function(e) {
    if (e) e.preventDefault();
    this.collection.each(function(map) {
      if (!map.get('selected'))
        map.set('selected', true)
    })
  },

  _unselectAll: function(e) {
    if (e) e.preventDefault();
    this.collection.each(function(map) {
      if (map.get('selected'))
        map.set('selected', false)
    });
  },

  _deleteMaps: function() {
    console.log("TODO: implement delete modal dialog");
  },

  _lockMaps: function() {
    console.log("TODO: implement lock modal dialog");
  },

  _changeMapsPrivacy: function() {
    console.log("TODO: implement privacy modal dialog");
  },

  _onSearchClick: function(e) {
    if (e) this.killEvent(e);
    this.$el.addClass('search--enabled');
    this.$('.DashboardFilters-searchInput').focus();
  },

  // Creation actions

  _newMap: function() {
    console.log("TODO: implement new map modal dialog");
  },

  _newDataset: function() {
    console.log("TODO: implement new dataset modal dialog");
  },

  // Filter actions

  _onCleanSearchClick: function(e) {
    if (e) e.preventDefault();
    this._navigateToUrl({
      search: ''
    });
  },

  _submitSearch: function(e) {
    if (e) e.preventDefault();
    this._navigateToUrl({
      search: this.$('.DashboardFilters-searchInput').val().trim()
    });
  },

  _navigateToUrl: function(opts) {
    this.router.navigate(this.router.model.url(opts), { trigger: true });
  },

  _changeOrder: function(e) {
    if (e) e.preventDefault();

    var $el = $(e.target).closest('.DashboardFilters-orderLink');
    var order = 'updated_at';

    if ($el.hasClass('js-mapviews')) order = 'mapviews';
    if ($el.hasClass('js-likes')) order = 'likes';

    // Order change?
    if (this.localStorage.get('dashboard.order') !== order) {
      this.localStorage.set({ 'dashboard.order': order });
      this.render();
      var orderObj = {};
      orderObj[order] = 'desc';
      this.collection.fetch({ data: { o: orderObj } });
    }
  }
});
