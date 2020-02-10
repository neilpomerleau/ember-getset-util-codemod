import { addObserver, removeObserver } from '@ember/object';
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
    addObserver(this, 'bar', observer);
    removeObserver(this, 'baz', observer);
    this.notifyPropertyChange('biz');
  },
});