import React from 'react';
import {
  Map, MapboxLayer, Layer, Marker
}
from 'mapbox-react';

class YouboraMap extends React.Component {

  static propTypes = {
    map: React.PropTypes.any,
    collection: React.PropTypes.any
  };

  constructor(props) {
    super(props);
    this.props.collection.on('add remove', () => {
      this.setState({
        list: this.props.collection.toJSON()
      });
    });
  }

  state = {
    list: []
  };

  render() {

    let markers = this.state.list.map((model) => {
      return <Marker key={model.id} geojson={model.geojson}>
        <div className="vid"></div>
      </Marker>;
    });
    return <Map map={this.props.map}>
      <MapboxLayer url="mapbox.emerald"/>
      <Layer>
        {markers}
      </Layer>
    </Map>;
  }

}

export
default YouboraMap;
