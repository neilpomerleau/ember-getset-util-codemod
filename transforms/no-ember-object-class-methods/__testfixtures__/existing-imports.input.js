import { notifyPropertyChange } from '@ember/object';
import { addObserver } from '@ember/object/observers';
import Service from '@ember/service';

export default Service.extend({
  init() {
    this.incrementProperty('foo');
    this.decrementProperty('bar');
    // Existing comment
    this.incrementProperty('baz', 2);
    this.decrementProperty('biz', 3.14);
    console.log(this.toggleProperty('foo'));
  },

  doStuff() {
    addObserver(this, 'bar', observer);
    this.removeObserver('baz', observer);
    notifyPropertyChange(this, 'biz');
  },
});