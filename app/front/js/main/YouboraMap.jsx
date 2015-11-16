import React from 'react';
import HashTable from './HashTable.jsx';
import { Map, MapboxLayer, Layer, Marker, Popup } from 'mapbox-react';

class YouboraMap extends React.Component {

  static propTypes = {
    map: React.PropTypes.any,
    collection: React.PropTypes.any
  };

  constructor(props) {
    super(props);
    this.props.collection.on('add remove change', () => {
      this.setState({
        list: this.props.collection.toJSON()
      });
    });
  }

  state = {
    list: []
  };

  render() {

    let markers = this.state.list.map((model, i) => {
      let style = {
        transform: 'scale(' + (0.3 + (0.9 * i / this.props.collection.length)) + ')'
      };
      let data = model.data;
      let fields = {
        quality: 'Quality'
      };
      let className = 'marker';
      if(data.quality && data.quality > 2){
        className += ' delayed';
      }else if(data.quality){
        className += ' good';
      }
      return <Marker key={model.id} geojson={model.geojson}>
        <div className={className} style={style}>
          <div className="center"></div>
        </div>
        <Popup>
          <HashTable className="info" data={data} fields={fields}/>
        </Popup>
      </Marker>;
    });
    return <Map map={this.props.map}>
      <MapboxLayer url="benoitarguel.f1f06bd4"/>
      <Layer>
        {markers}
      </Layer>
    </Map>;
  }

}

export default YouboraMap;
