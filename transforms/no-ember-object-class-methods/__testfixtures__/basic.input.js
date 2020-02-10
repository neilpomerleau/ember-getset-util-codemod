import Service from '@ember/service';

export default Service.extend({
  init() {
    this.incrementProperty('foo');
    this.decrementProperty('bar');
    this.incrementProperty('baz', 2);
    this.decrementProperty('biz', 3.14);
    console.log(this.toggleProperty('foo'));
  },

  doStuff() {
    this.addObserver('bar', observer);
    this.removeObserver('baz', observer);
    this.notifyPropertyChange('biz');
  },
});
