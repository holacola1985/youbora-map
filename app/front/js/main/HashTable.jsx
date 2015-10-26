import React from 'react';

class HashTable extends React.Component {

  static propTypes = {
    data: React.PropTypes.any.isRequired,
    fields: React.PropTypes.any.isRequired,
    className: React.PropTypes.string
  };

  render() {
    let lines = [];
    for (let key in this.props.fields) {
      lines.push(<tr key={'hashtable-' + key}>
        <th>{this.props.fields[key]}:</th>
        <td>{this.props.data[key]}</td>
      </tr>);
    }
    return <table className={this.props.className}>
      <tbody>
        {lines}
      </tbody>
    </table>;
  }
}

export
default HashTable;
