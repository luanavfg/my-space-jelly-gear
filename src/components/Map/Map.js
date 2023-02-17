import 'leaflet/dist/leaflet.css'
import * as ReactLeaflet from 'react-leaflet'
import styles from './Map.module.scss'
import iconMarker2x from 'leaflet/dist/images/marker-icon-2x.png'
import iconMarker from 'leaflet/dist/images/marker-icon.png'
import iconMarkerShadow from 'leaflet/dist/images/marker-shadow.png'
import { useEffect } from 'react'

const { MapContainer, MapConsumer } = ReactLeaflet;

const position = [51.505, -0.09]

const Map = ({ children, className, ...rest }) => {

  let mapClassName = styles.map
  if ( className ) {
    mapClassName = `${mapClassName} ${className}`
  }

  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: iconMarker2x.src,
      iconUrl: iconMarker.src,
      shadowUrl: iconMarkerShadow.src,
    })
  }, [])
  return (
    <MapContainer className={mapClassName} {...rest}>
       <MapConsumer>
        {(map) => children(ReactLeaflet, map)}
      </MapConsumer>
  </MapContainer>
  )
}
export default Map