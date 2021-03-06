var UserUrlsModel = require('new_dashboard/user_urls_model');
var UserNotifications = require('new_dashboard/header/notifications/view');
var cdbAdmin = require('cdb.admin');
var LocalStorage = require('new_common/local_storage');

var fakeConfig = {
  prefixUrl: function() {
    return 'https://bodega.cartodb.com';
  }
};

describe("new_dashboard/user_notifications", function() {
  var view, user, navigation;
 
  beforeEach(function() {
    this.localStorage = new LocalStorage('test');
    this.localStorage.remove('notification.new_dashboard');
    this.localStorage.remove('notification.close_limits');
    
    user = new cdbAdmin.User({
      account_type: 'CORONELLI',
      remaining_byte_quota: 900,
      quota_in_bytes: 1000,
      trial_ends_at: null,
      username: 'test-user',
      table_count: 1
    });
    
    navigation = new UserUrlsModel({
      config: fakeConfig
    }, {});

    view = new UserNotifications({
      userUrls:     navigation,
      user:         user,
      localStorage: this.localStorage
    });
  });

  describe('render', function() {

    it('should render properly', function() {
      view.render();
      expect(view.$el.hasClass('UserNotifications')).toBeTruthy();
      expect(view.$('.UserNotifications-Icon').length).toBe(1);
      expect(view.$('.UserNotifications-Count').length).toBe(1);
      expect(view.$('.UserNotifications-Count').text()).toBe('1');
      expect(view.$el.hasClass('has--alerts')).toBeTruthy();

      user.set('remaining_byte_quota', 10);
      expect(view.$('.UserNotifications-Count').text()).toBe('2');
      expect(view.$('.UserNotifications-Count').length).toBe(1);
      expect(view.$el.hasClass('has--alerts')).toBeTruthy();

      this.localStorage.set({ 'notification.new_dashboard': true });
      user.set('remaining_byte_quota', 1000);
      expect(view.$('.UserNotifications-Count').length).toBe(0);
      expect(view.$el.hasClass('has--alerts')).toBeFalsy();
    });

    it('should have no leaks', function() {
      view.render();
      expect(view).toHaveNoLeaks();
    });

  });

  describe('click', function() {
    beforeEach(function() {
      this.dropdownMock = jasmine.createSpyObj('fake-SettingsDropdown-object', ['render', 'on', 'open', 'clean']);
      this.dropdownMock.options = {
        target: jasmine.createSpyObj('dropdown-target-element', ['unbind'])
      };
      this.DropdownSpy = jasmine.createSpy('fake-SettingsDropdown-constructor');
      this.DropdownSpy.and.returnValue(this.dropdownMock);
      UserNotifications.__set__('NotificationsDropdown', this.DropdownSpy);

      view.render();

      this.clickSettings = function() {
        view.$el.click();
      }
    });

    it('should create dropdown view with expected params', function() {
      this.clickSettings();

      expect(this.DropdownSpy).toHaveBeenCalled();

      var viewToBeInstantiatedWith = this.DropdownSpy.calls.argsFor(0)[0];
      expect(viewToBeInstantiatedWith.target[0]).toEqual(view.$el[0]);
      expect(viewToBeInstantiatedWith.template_base).toEqual('new_dashboard/views/notifications_dropdown');
    });

    it('should have rendered and opened the dropdown view', function() {
      this.clickSettings();
      expect(this.dropdownMock.render).toHaveBeenCalled();
      expect(this.dropdownMock.open).toHaveBeenCalled();
    });

    it('should add the dropdown view to the child views', function() {
      var spy = spyOn(view, 'addView');
      this.clickSettings();
      expect(spy).toHaveBeenCalled();
    });

    it('should clean up dropdown view after the dropdown is hidden', function(done) {
      var self = this;

      this.clickSettings();
      
      expect(this.dropdownMock.on).toHaveBeenCalledWith('onDropdownHidden', jasmine.any(Function), view);

      // trigger the listener callback manually to verify assertions below
      this.dropdownMock.on.calls.argsFor(0)[1].call(view);

      setTimeout(function() {
        expect(self.dropdownMock.clean).toHaveBeenCalled();
        expect(view.$el.hasClass('has--alerts')).toBeFalsy();
        done();
      }, 400)
      
    });

    it('should close any other open dialogs', function() {
      spyOn(cdb.god, 'trigger');
      this.clickSettings();
      expect(cdb.god.trigger).toHaveBeenCalledWith('closeDialogs');
    });

  });


  describe('collection', function() {

    it('should generate collection data', function() {
      expect(view.collection.size()).toBe(1); // New dashboard will be present always
    });

    it('should reset collection data when user data is changed', function() {
      var spy = spyOn(view.collection, 'reset');
      user.set('remaining_byte_quota', 10);
      expect(spy).toHaveBeenCalled();
    });

  });

});

