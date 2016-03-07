/* @flow */
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { doubleAsync } from '../../redux/modules/counter'
import {GoogleMapLoader, GoogleMap, Marker} from "react-google-maps"

// We can use Flow (http://flowtype.org/) to type our component's props
// and state. For convenience we've included both regular propTypes and
// Flow types, but if you want to try just using Flow you'll want to
// disable the eslint rule `react/prop-types`.
// NOTE: You can run `npm run flow:check` to check for any errors in your
// code, or `npm i -g flow-bin` to have access to the binary globally.
// Sorry Windows users :(.
type Props = {
  counter: number,
  doubleAsync: Function,
  increment: Function
};

// We avoid using the `@connect` decorator on the class definition so
// that we can export the undecorated component for testing.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
export class HomeView extends React.Component<void, Props, void> {
  static propTypes = {
    markers: PropTypes.array.isRequired,
    doubleAsync: PropTypes.func.isRequired,
  };
  componentDidMount () {
    this.props.doubleAsync();
  }

  handleMapClick(event) {
    let { doubleAsync } = this.props
    doubleAsync({
      lat :event.latLng.lat(),
      lng: event.latLng.lng()
    })
  }

  render() {
    return (
      <GoogleMapLoader
        containerElement={
          <div
            {...this.props}
            style={{
              height: `1000px`,
            }}
          />
        }
        googleMapElement={
          <GoogleMap
            ref={(map) => (this._googleMapComponent = map) && console.log(map.getZoom())}
            defaultZoom={9}
            defaultCenter={{ lat: 51.5629849081, lng: 4.89 }}
            onClick={::this.handleMapClick}

          >
            {this.props.markers.map((marker, index) => {
              return (
                <Marker
                  {...marker}
                />
              );
            })}
          </GoogleMap>
        }
      />
    );
  }
}

const mapStateToProps = (state) => ({
  markers: state.markers.markers
})
export default connect((mapStateToProps), {
  doubleAsync
})(HomeView)
