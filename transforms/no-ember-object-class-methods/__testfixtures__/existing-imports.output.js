import { addObserver, removeObserver, get, notifyPropertyChange, set } from '@ember/object';
import Service from '@ember/service';

export default Service.extend({
  init() {
    // TODO: remove `parseFloat` if this value is an integer
    // TODO: remove `|| 0` if this value is initialized and never undefined
    set(this, 'foo', (parseFloat(get(this, 'foo')) || 0) + 1);
    // TODO: remove `parseFloat` if this value is an integer
    // TODO: remove `|| 0` if this value is initialized and never undefined
    set(this, 'bar', (parseFloat(get(this, 'bar')) || 0) - 1);
    // Existing comment
    // TODO: remove `parseFloat` if this value is an integer
    // TODO: remove `|| 0` if this value is initialized and never undefined
    set(this, 'baz', (parseFloat(get(this, 'baz')) || 0) + 2);
    // TODO: remove `parseFloat` if this value is an integer
    // TODO: remove `|| 0` if this value is initialized and never undefined
    set(this, 'biz', (parseFloat(get(this, 'biz')) || 0) - 3.14);
    console.log(set(this, 'foo', !get(this, 'foo')));
  },

  doStuff() {
    addObserver(this, 'bar', observer);
    removeObserver(this, 'baz', observer);
    notifyPropertyChange(this, 'biz');
  },
});
