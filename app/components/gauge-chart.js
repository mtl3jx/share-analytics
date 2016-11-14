/* global c3 */
import Ember from 'ember';

export default Ember.Component.extend({

  sourcesList: Ember.computed('aggregations', function() {
      let data = this.get('aggregations.sources.buckets');
      return data ? data.map(({ key, doc_count }) => [key, doc_count]) : [];
  }),

  dataChanged: Ember.observer('aggregations', function() {
      let data = this.get('sourcesList');
      this.updateGauge(data);
  }),

  updateGauge(data) {
      let columns = data; // jscs:ignore
      let title = 'Published in...';

      let gauge = this.get('gauge');
      if (!gauge) {
          this.initGauge(title, columns);
      } else {
          gauge.load({
              columns,
              unload: true
          });
      }
  },

  initGauge(title, columns) {
      let element = this.$(`.gauge`).get(0);
      let gauge = c3.generate({
          bindto: element,
          data: {
              columns,
              type: 'gauge',
              onclick: function (d, i) { console.log("onclick", d, i); },
              onmouseover: function (d, i) { console.log("onmouseover", d, i); },
              onmouseout: function (d, i) { console.log("onmouseout", d, i); }
          },
          legend: { show: false },
          gauge: {
            //        label: {
            //            format: function(value, ratio) {
            //                return value;
            //            },
            //            show: false // to turn off the min/max labels.
            //        },
            //    min: 0, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
            //    max: 100, // 100 is default
            //    units: ' %',
            //    width: 39 // for adjusting arc thickness
          },
          color: {
            pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
            threshold: {
              // unit: 'value', // percentage is default
              // max: 200, // 100 is default
              values: [30, 60, 90, 100]
            }
          },
          size: { height: 300 }
      });
      this.set('gauge', gauge);
  },

  init() { // Init should be used ONLY for setting component proprties. When we want to work on the component DOM element, we use didInsertElement hool
      this._super(...arguments);
  },

  didInsertElement() {
      let data = this.get('sourcesList');
      this.updateGauge(data);
  },

  actions: {
      removeChart: function() {
          this.sendAction('removeChart','gauge');
      }
  },

});
