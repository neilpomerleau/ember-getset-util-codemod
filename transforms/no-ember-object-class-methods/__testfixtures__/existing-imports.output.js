import { addObserver, removeObserver, get, notifyPropertyChange, set } from '@ember/object';
import Service from '@ember/service';

export default Service.extend({
  init() {
    set(this, 'foo', (parseFloat(get(this, 'foo')) || 0) + 1);
    set(this, 'bar', (parseFloat(get(this, 'bar')) || 0) - 1);
    set(this, 'baz', (parseFloat(get(this, 'baz')) || 0) + 2);
    set(this, 'biz', (parseFloat(get(this, 'biz')) || 0) - 3.14);
    console.log(set(this, 'foo', !get(this, 'foo')));
  },

  doStuff() {
    addObserver(this, 'bar', observer);
    removeObserver(this, 'baz', observer);
    notifyPropertyChange(this, 'biz');
  },
});
