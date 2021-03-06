var FiltersView = require('new_dashboard/filters_view');
var Router = require('new_dashboard/router');
var LocalStorage = require('new_common/local_storage');
var Backbone = require('backbone');
var $ = require('jquery');

describe('new_dashboard/filters_view', function() {
  beforeEach(function() {
    spyOn(cdb.config, 'prefixUrl');
    cdb.config.prefixUrl.and.returnValue('/u/paco');

    this.user = new cdb.admin.User({ username: 'paco' });
    this.router = new Router({ rootUrl: '' });
    this.router.model.set({
      content_type: 'datasets'
    });

    spyOn(this.router.model, 'bind').and.callThrough();

    this.collection = new cdb.admin.Visualizations();
    spyOn(this.collection, 'bind').and.callThrough();

    this.localStorage = new LocalStorage('test');
    
    this.view = new FiltersView({
      user:         this.user,
      router:       this.router,
      collection:   this.collection,
      localStorage: this.localStorage 
    })
  });

  describe('render', function() {

    describe('regular user', function() {

      it('shouldn\'t show shared datasets link because user doesn\'t belong to an org', function() {
        this.view.render();
        expect(this.view.$('.DashboardFilters-typeItem').length).toBe(5);
        expect(this.view.$el.html()).not.toContain('datasets/shared');
        expect(this.view.$('.DashboardFilters-orderItem').length).toBe(3);
      });
    });

    describe('organization', function() {

      it('should show shared datasets link if user belongs to an org', function() {
        var userMock = sinon.mock(this.user);
        userMock.expects('isInsideOrg').returns('true');
        this.view.render();
        expect(this.view.$('.DashboardFilters-typeItem').length).toBe(6);
        expect(this.view.$el.html()).toContain('shared');
        expect(this.view.$('.DashboardFilters-orderItem').length).toBe(3);
      });
    });

  });

  it('should render on change events by router model', function() {
    var args = this.router.model.bind.calls.argsFor(0);
    expect(args[0]).toEqual('change');
    expect(args[1]).toEqual(this.view.render);
    expect(args[2]).toEqual(this.view);
  });

  it('should change order with one is clicked', function() {
    this.view.render();
    this.view.$('.DashboardFilters-orderLink.js-likes').click();
    expect(this.localStorage.get('dashboard.order')).toBe('likes');
  });

  it('should render when item is selected', function() {
    this.collection.reset({ selected: false })
    spyOn(this.view, '_animate').and.callThrough();
    this.collection.at(0).set('selected', true);
    expect(this.view._animate).toHaveBeenCalled();
    expect(this.view.$el.hasClass('items--selected')).toBeTruthy();
  });

  it('should show search when it is present in the route', function() {
    this.router.model.set('q', 'test');
    expect(this.view.$el.hasClass('search--enabled')).toBeTruthy();
    this.router.model.set('q', '');
    expect(this.view.$el.hasClass('search--enabled')).toBeFalsy();
    this.router.model.set('tag', 'paco');
    expect(this.view.$el.hasClass('search--enabled')).toBeTruthy();
    this.router.model.set('tag', '');
    expect(this.view.$el.hasClass('search--enabled')).toBeFalsy();
    this.router.model.set({ tag: 'tagg', search: 'paco' });
    expect(this.view.$el.hasClass('search--enabled')).toBeTruthy();
  });

  it('should hide search when click outside and it is not set', function() {
    this.view.render();
    this.view.$('.DashboardFilters-searchLink').click();
    expect(this.view.$el.hasClass('search--enabled')).toBeTruthy();
    cdb.god.trigger('closeDialogs');
    expect(this.view.$el.hasClass('search--enabled')).toBeFalsy();
  });

  it('should have no leaks', function() {
    this.view.render();
    expect(this.view).toHaveNoLeaks();
  });

  afterEach(function() {
    this.view.clean();
  });
});
