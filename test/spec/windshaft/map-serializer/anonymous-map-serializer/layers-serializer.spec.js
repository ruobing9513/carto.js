var Backbone = require('backbone');
var CartoDBLayer = require('../../../../../src/geo/map/cartodb-layer');
var PlainLayer = require('../../../../../src/geo/map/plain-layer');
var TileLayer = require('../../../../../src/geo/map/tile-layer');
var TorqueLayer = require('../../../../../src/geo/map/torque-layer');
var VisModel = require('../../../../../src/vis/vis');
var LayersSerializer = require('../../../../../src/windshaft/map-serializer/anonymous-map-serializer/layers-serializer');
var fakeFactory = require('../../../../helpers/fakeFactory');

describe('layers-serializer', function () {
  describe('.serialize', function () {
    var visMock;
    var sourceMock;
    var layersCollection;

    // Create all test objects once
    beforeAll(function () {
      layersCollection = new Backbone.Collection();
      visMock = new VisModel();
      sourceMock = fakeFactory.createAnalysisModel({ id: 'a1' });
    });

    it('should serialize a cartodb layer', function () {
      var cartoDBLayer = new CartoDBLayer({
        id: 'l1',
        source: sourceMock,
        cartocss: 'cartoCSS1',
        cartocss_version: '2.0'
      }, {
        vis: visMock
      });
      layersCollection.reset([cartoDBLayer]);

      var actual = LayersSerializer.serialize(layersCollection);
      var expected = [{
        'id': 'l1',
        'type': 'mapnik',
        'options': {
          'cartocss': 'cartoCSS1',
          'cartocss_version': '2.0',
          'interactivity': [ 'cartodb_id' ],
          'source': { id: 'a1' }
        }
      }];
      expect(actual).toEqual(expected);
    });

    it('should serialize a plain layer', function () {
      var plainLayer = new PlainLayer({
        id: 'l2',
        color: 'COLOR',
        image: 'http://carto.com/image.png'
      }, { vis: {} });
      layersCollection.reset([plainLayer]);

      var actual = LayersSerializer.serialize(layersCollection);
      var expected = [{
        'id': 'l2',
        'type': 'plain',
        'options': {
          'color': 'COLOR',
          'imageUrl': 'http://carto.com/image.png'
        }
      }];
      expect(actual).toEqual(expected);
    });

    it('should serialize a torque layer', function () {
      var torqueLayer = new TorqueLayer({
        id: 'l3',
        source: sourceMock,
        cartocss: 'cartocss'
      }, {
        vis: visMock
      });
      layersCollection.reset([torqueLayer]);

      var actual = LayersSerializer.serialize(layersCollection);
      var expected = [{
        'id': 'l3',
        'type': 'torque',
        'options': {
          'source': { id: 'a1' },
          'cartocss': 'cartocss',
          'cartocss_version': '2.1.0'
        }
      }];
      expect(actual).toEqual(expected);
    });

    it('should serialize a tile layer', function () {
      var tileLayer = new TileLayer({
        id: 'l4',
        urlTemplate: 'URL_TEMPLATE',
        subdomains: 'abc',
        tms: false
      }, { vis: {} });
      layersCollection.reset([tileLayer]);

      var actual = LayersSerializer.serialize(layersCollection);
      var expected = [{
        'id': 'l4',
        'type': 'http',
        'options': {
          'urlTemplate': 'URL_TEMPLATE',
          'subdomains': 'abc',
          'tms': false
        }
      }];
      expect(actual).toEqual(expected);
    });
  });
});
