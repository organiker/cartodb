var cdb = require('cartodb.js');
var SettingsDropdown = require('./header/settings_dropdown_view');
var BreadcrumbsDropdown = require('./header/breadcrumbs/dropdown_view');
var UserNotifications = require('./header/notifications/view');
var $ = require('jquery');

var settingsDropdownId = '#header-settings-dropdown';
var breadcrumbsDropdownId = '#header-breadcrumbs-dropdown';
var events = {};
events['click '+ settingsDropdownId] = '_createSettingsDropdown';
events['click '+ breadcrumbsDropdownId] = '_createBreadcrumbsDropdown';

/**
 * Responsible for the header part of the layout.
 * It's currently pre-rendered server-side, why the header element is required to be given when instantiating the view.
 */
module.exports = cdb.core.View.extend({
  events: events,

  initialize: function(args) {
    if (!args.el) throw new Error('The root element must be provided from parent view');

    this.router = args.router;
    this.router.model.bind('change', this.render, this);
    this.add_related_model(this.router);
  },

  render: function() {
    this.clearSubViews();
    this._renderBreadcrumbsDropdownLink();
    this._renderNotifications();

    return this;
  },

  _renderBreadcrumbsDropdownLink: function() {
    var contentType = this.router.model.get('content_type');
    var isLocked = this.router.model.get('locked');

    var title;
    if (contentType === 'datasets') {
      if (isLocked) {
        title = 'Locked datasets'
      } else {
        title = 'Datasets'
      }
    } else {
      if (isLocked) {
        title = 'Locked maps'
      } else {
        title = 'Maps'
      }
    }

    var template = cdb.templates.getTemplate('new_dashboard/header/breadcrumbs/dropdown_link');
    this.$(breadcrumbsDropdownId).html(template({
      title: title
    }));
  },

  _renderNotifications: function() {
    var userNotifications = new UserNotifications({
      userUrls:     this.options.userUrls,
      user:         this.model,
      localStorage: this.options.localStorage
    });

    this.$('.Header-settingsItemNotifications').html(userNotifications.render().el);
    this.addView(userNotifications);
  },

  _createSettingsDropdown: function(ev) {
    this.killEvent(ev);

    this._setupDropdown(new SettingsDropdown({
      target:             this.$(settingsDropdownId),
      model:              this.model,
      userUrls:           this.options.userUrls,
      horizontal_offset:  17,
      template_base:      'new_dashboard/header/settings_dropdown'
    }));
  },

  _createBreadcrumbsDropdown: function(ev) {
    this.killEvent(ev);

    this._setupDropdown(new BreadcrumbsDropdown({
      target:        this.$(breadcrumbsDropdownId),
      model:         this.model,
      router:        this.router,
      template_base: 'new_dashboard/header/breadcrumbs/dropdown'
    }));
  },

  _setupDropdown: function(dropdownView) {
    this._closeAnyOtherOpenDialogs();
    this.addView(dropdownView);

    dropdownView.on('onDropdownHidden', function() {
      dropdownView.clean();
    }, this);

    dropdownView.render();
    dropdownView.open();
  },

  _closeAnyOtherOpenDialogs: function() {
    cdb.god.trigger("closeDialogs");
  }
});
