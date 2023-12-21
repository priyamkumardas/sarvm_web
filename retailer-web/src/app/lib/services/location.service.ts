import { Injectable } from '@angular/core';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@awesome-cordova-plugins/geolocation/ngx';
import { CommonApi } from './api/common.api';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  options: GeolocationOptions;
  currentPos: Geoposition;

  constructor(
    private geolocation: Geolocation,
    private commonApi: CommonApi) {

  }

  getAddressFormLatlong(lat, lng) {
    const url =
      'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&key=AIzaSyB3mLu1YhKFrjGO5JnQtNYekBq47DOOTcc';
    return this.commonApi.getCDNLink(url);
  }

  getFormPostalCode(postalCode,country) {
    const url =
      'https://maps.googleapis.com/maps/api/geocode/json?address=' + postalCode + '&sensor=true&key=AIzaSyB3mLu1YhKFrjGO5JnQtNYekBq47DOOTcc';
    return this.commonApi.getCDNLink(url);
  }

  getSearchLocation(e) {
    const url = 'https://nominatim.openstreetmap.org/search.php?q=' + e + '&polygon_geojson=1&format=jsonv2';
    return this.commonApi.getDataByUrl(url);
  }
  // getSearchLocation(e) {
  //   const url = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=' + e + '&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&inputtype=textquery&key=AIzaSyB3mLu1YhKFrjGO5JnQtNYekBq47DOOTcc';
  //   return this.commonApi.getCDNLink(url);
  // }
  getUserLocation() {
    return new Promise((resolve, reject) => {
      this.options = {
        enableHighAccuracy: true
      };

      this.geolocation.getCurrentPosition(this.options).then((pos: Geoposition) => {
        this.currentPos = pos;
        const location = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        //console.log('loc', location);
        resolve(location);
      }, (err: PositionError) => {
        console.log("error : " + err.message);
        reject(err.message);
      });
    });
  }
}
