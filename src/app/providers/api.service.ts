/*************************************************************
 * Name: tnsmart
*******************************
Author: Mohammed Rizwan S
Date:   23/09/2022 *
**************************************************************/

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

let headers = new HttpHeaders({
  'Access-Control-Allow-Origin': 'https://beta-tnsmart.rimes.int/',
  origin: 'https://beta-tnsmart.rimes.int/',
});

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) { }
  base_url = 'https://beta-tnsmart.rimes.int/';
  //new
  // base_url = 'https://tnsmart.tnsdma.rimes.int/';
  // base_url = 'http://192.168.1.103/tn-pk-smart/';
  /*************************
   * API USER *
   *************************/

  get_all_taluks() {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/Api_user/all_taluk_get'
    );
  }
  get_taluk_by_coords(param) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/Api_user/taluk_by_lat_long_get?lat=' +
      param.lat +
      '&&lng=' +
      param.lng
    );
  }

  get_all_district() {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/Api_user/district_get'
    );
  }

  ///get all district list
  get_district_list() {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/api_user/district_get'
    );
  }

  //get taluk details by district id
  get_taluk_data_by_district_id(params) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/api_user/taluk_get?id=' +
      params.id
    );
  }

  get_taluks_by_district_id(param) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/Api_user/taluk_get?id=' +
      param.id
    );
  }

  //get village details by taluk id
  get_village_data_by_taluk_id(params) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/api_user/village_get?id=' +
      params.id
    );
  }

  //get emergency category by role id
  get_emergency_category() {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/api_response/emergency_category_get'
    );
  }

  //get sub category  in english
  get_sub_category_en(params) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/api_response/sub_category_en_get?cat=' +
      params.cat
    );
  }

  //get sub category  in tn
  get_sub_category_tn(params) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/api_response/sub_category_tn_get?cat=' +
      params.cat
    );
  }

  //get call status by user phone
  get_call_status(param) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/api_response/call_status_get?id=' +
      param.id
    );
  }

  check_app_version() {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/api_user/check_app_version_get'
    );
  }

  checklogin(param) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/api_user/users_get?phone=' +
      param.phone +
      '&&password=' +
      param.password
    );
  }

  check_login_token(param) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/api_user/check_user_token_get?user_token=' +
      param.token
    );
  }

  //delete profile

  delete_profile(param) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/Api_user/users_delete?phone=' +
      param.phone
    );
  }

  //get helpline contacts
  get_helpline_contacts() {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/api_user/helpline_contacts_get'
    );
  }

  //get fav loc by user id
  get_fav_location(param) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/api_user/fav_loc_by_user_get?id=' +
      param.id
    );
  }

  //get hazard alerts
  get_hazard_alerts() {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/api_user/check_hazard_alert_get'
    );
  }

  get_forecast_by_lat_lon(params) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/Api_user/update_location?lat=' +
      params.lat +
      '&lng=' +
      params.lon
    );
  }

  get_forecast_by_lat_lon_device_id(params) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/Api_user/update_location_id?lat=' +
      params.lat +
      '&lng=' +
      params.lon +
      '&device_id=' +
      params.device_id
    );
  }

  get_forecast_by_lat_lon_user_id(params) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/Api_user/update_location_id?lat=' +
      params.lat +
      '&lng=' +
      params.lon +
      '&user_id=' +
      params.user_id
    );
  }
  send_coords_by_devceid(params) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/Api_common/update_location?device_id=' +
      params.device_id +
      '&lat=' +
      params.lat +
      '&lng=' +
      params.lon +
      '&fav_loc=' +
      params.favs,
      { responseType: 'text' }
    );
  }
  clear_devceid(params) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/Api_common/update_device_id?device_id=' +
      params.device_id +
      '&status=reset',
      { responseType: 'text' }
    );
  }

  /****************
   * API Weather *
   ****************/

  //get imd rainfall forecast by taluk id of single day
  get_rainfall_by_taluk_id(params) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/api_rainfall/rainfall_by_taluk_id_get?id=' +
      params.id
    );
  }

  //get 5 days imd rainfall for all taluk for map
  get_rainfall_all_for_map() {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/api_rainfall/rainfall_all_taluk_for_map_get'
    );
  }

  //get 5 days imd rainfall forecast for single taluk by id
  get_rainfall_5days_taluk_by_id(params) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/api_rainfall/rainfall_5days_taluk_by_id_get?id=' +
      params.id
    );
  }

  //get fav location rainfall forecast
  get_fav_location_rainfall_forecast(params) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/api_rainfall/rainfall_fav_loc_by_user_get?id=' +
      params.id
    );
  }

  //get 7 days rainfall forecast
  get_rainfall_7days_imd(params) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/Api_common/get_imd_forecast?user_id=' +
      params.id
    );
  }

  //get 7 days rainfall forecast
  get_rainfall_7days_ecm(params) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/Api_common/get_ecm_24_hrs_forecast?user_id=' +
      params.id
    );
  }
  //get 7 days rainfall forecast
  get_rainfall_6hr_ecm(params) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/Api_common/get_ecm_6_hrs_forecast?user_id=' +
      params.id
    );
  }

  //get 7 days rainfall forecast
  get_current_loc_lightning_user_id(params) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/Api_common/dta_notification?user_id=' +
      params.user_id
    );
  }

  //get  6 hrs ecm forecast using taluk id
  get_ecm_forecast_by_taluk_id(params) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/Api_rainfall/ecm_6_hrs_forecast_get?id=' +
      params.taluk_id
    );
  }

  /*************************
   * API Commom *
   *************************/

  get_notifcations() {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/Api_common/get_last_20_alerts'
    );
  }

  get_flash_alert(param) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/Api_common/get_flash_alert?user_id=' +
      +param.id
    );
  }

  /****************
   * API LIGHTNING *
   ****************/

  //get lightning thunderstorm data for registered location of user
  get_registered_loc_lightning_data(param) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/Api_lightning/block_advisory?block_id=' +
      param.id
    );
  }
  //get forecast lightning thunderstorm data for registered location of user
  get_registered_loc_lightning_data_forecast(param) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/api_lightning/dta_block_advisory?block_id=' +
      param.id
    );
  }

  //get lightning thunderstorm data for registered location of user
  get_fav_loc_lightning_data(param) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/Api_lightning/fav_block_advisory?user_id=' +
      param.id
    );
  }

  //get lightning thunderstorm data for registered location of user
  get_fav_loc_lightning_data_forecast(param) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/api_lightning/dta_fav_block_advisory?user_id=' +
      param.id
    );
  }

  //get nowcast data
  get_nowcast_data_lightning() {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/Api_lightning/total_record_for_30_min_block'
    );
  }
  //get iitm lightning data
  get_iitm_lightning_data() {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/api_lightning/lightning_data'
    );
  }

  getLxAlerts() {
    return this.http.get(
      // 'https://api.lxalerts.earthnetworks.com/CellAlerts.aspx?level=1,2,3&nwlat=37.69027&nwlon=62.69888&selat=4.50111&selon=101.033611&format=json&partnerid=B491167B-6969-4A35-893D-0FEE54C6F926' //india
      'https://api.lxalerts.earthnetworks.com/CellAlerts.aspx?level=1,2,3&nwlat=13.751817&nwlon=75.747883&selat=7.594689&selon=80.6472&format=json&partnerid=B491167B-6969-4A35-893D-0FEE54C6F926' //tn
    );
  }

  /****************
   * API Reservoir *
   ****************/

  get_reservoir_data(param) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/Api_common/get_overall_reservoir?date=' +
      param.date
    );
  }
  get_reservoirs_basin(param) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/Api_common/get_reservoir?id=' +
      param.id
    );
  }
  get_reservoir_level(param) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/Api_common/get_reservoir_id?code=' +
      param.id
    );
  }
  get_all_basin() {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/Api_common/get_basin'
    );
  }

  /****************
   * API vulnerble location *
   ****************/

  get_vulnerable_location_data() {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/Api_common/get_all_vulnerable_location'
    );
  }
  get_vulnerable_location_data_new(param) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/Api_common/get_flood_impact?lat=' +
      param.lat +
      '&lng=' +
      param.lng +
      '&user_id=' +
      param.user_id
    );
  }
  /****************
   * API rainfall
   ****************/

  get_overall_rainfall_date(param) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/Api_common/get_overall_rainfall?date=' +
      param.date
    );
  }

  get_rainfall_analysis_report(param) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/DATA/Rainfall/daily_reports/rainfall_analysis_+' +
      param.date +
      '.pdf'
    );
  }

  // get rimes updated dates
  getUpdatedDates() {
    return this.http.get(
      'https://satark.rimes.int/api_weather/latest_updated_date_get'
    );
  }

  // get cyclone info imd
  getInfoImd(date, parameter) {
    return this.http.get(
      'https://satark.rimes.int/DATA/forecast_data/imd/' +
      parameter +
      '/' +
      date +
      '/info.' +
      date +
      '.json'
    );
  }

  // get cyclone info ecm
  getInfoEcm(date, parameter = 'rainfall') {
    return this.http.get(
      'https://satark.rimes.int/DATA/forecast_data/ecmwf/' +
      parameter +
      '/' +
      date +
      '/info.' +
      date +
      '.json'
    );
  }
  // get cyclone info ecm geojson
  getInfoImdGeojson(geojson, date, parameter) {
    return this.http.get(
      'https://satark.rimes.int/DATA/forecast_data/imd/' +
      parameter +
      '/' +
      date +
      '/' +
      geojson
    );
  }

  // get cyclone info ecm geojson
  getInfoEcmGeojson(geojson, date, parameter = 'rainfall') {
    return this.http.get(
      'https://satark.rimes.int/DATA/forecast_data/ecmwf/' +
      parameter +
      '/' +
      date +
      '/' +
      geojson
    );
  }

  //----------------ADMIN APIS-----------------*/

  checkIdentifier(param) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/api_admin/check_identifier_get?phone=' +
      param.phone +
      '&&password=' +
      param.password
    );
  }

  resetIdentifier(param) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/api_admin/device_identifer_reset_initate_get?phone=' +
      param.phone
    );
  }

  districts_by_username_get(param) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/api_admin/districts_by_username_get?id=' +
      param.id
    );
  }

  stations_by_district_get(param) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/api_vendor/stations_by_district_get?id=' +
      param.id
    );
  }

  stations_by_district_taluk_get(param) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/api_vendor/stations_by_taluk_get?id=' +
      param.id +
      '&tname=' +
      param.name
    );
  }

  get_vendor_maintenance_menus() {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/api_vendor/vendor_maintenance_menus_get'
    );
  }

  //get taluk details by district id
  get_taluks_by_district_code(params) {
    return this.http.get(
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/api_vendor/taluks_by_district_code_get?id=' +
      params.id
    );
  }

  get_arg_stations(param) {
    return this.http.get(
      this.base_url +
      'index.php/Api_mobile/Api_admin/arg_stations_get?fetch='
      //'api/mobile/arg_stations_get?fetch='
      +
      param.fetch
    );
  }

  get_arg_stations_by_resolver_id(param) {
    return this.http.get(
      this.base_url +
      'index.php/Api_mobile/Api_admin/arg_stations_by_resolver_id_get?r_id=' +
      param.id +
      '&fetch=' +
      param.fetch
    );
  }

  //get all cw tickets
  get_all_cw_tickets() {
    return this.http.get(
      // 'https://beta-tnsmart.rimes.int/index.php/Api_mobile/Api_admin/all_cw_tickets_get'
      this.base_url + 'index.php/Api_mobile/Api_admin/all_cw_tickets_get'
    );
  }

  //get all cw tickets district wise using resolver_id
  get_all_cw_tickets_by_resolver_id(param) {
    return this.http.get(
      // 'https://beta-tnsmart.rimes.int/index.php/Api_mobile/Api_admin/all_cw_tickets_get'
      this.base_url +
      'index.php/Api_mobile/Api_admin/all_cw_tickets_by_resolver_id_get?page=' +
      param.page +
      '&&r_id=' +
      param.r_id +
      (param['type'] ? '&type=' + param.type : '')
    );
  }
  //get other admin cw tickets
  get_other_cw_tickets_by_admin(param) {
    return this.http.get(
      this.base_url +
      'index.php/Api_mobile/Api_admin/cw_other_hq_tickets_get?page=' +
      param.page +
      (param['type'] ? '&type=' + param.type : '')
    );
  }
  //get other admin cw tickets
  get_cw_tickets_by_district_id(param) {
    return this.http.get(
      this.base_url +
      'index.php/Api_mobile/Api_admin/get_cw_tickets_by_district_id?page=' +
      param.page +
      '&&d_id=' +
      param.d_id +
      (param['type'] ? '&type=' + param.type : '')
    );
  }

  //get raised cw tickets district bt resolver_id
  get_cw_tickets_raised_by_resolver_id(param) {
    return this.http.get(
      // 'https://beta-tnsmart.rimes.int/index.php/Api_mobile/Api_admin/all_cw_tickets_get'
      this.base_url +
      'index.php/Api_mobile/Api_admin/cw_tickets_raised_by_resolver_id_get?r_id=' +
      param.r_id +
      (param['type'] ? '&type=' + param.type : '')
    );
  }

  //get cw tickets by vendor id
  get_cw_tickets_by_raiser_id(param) {
    return this.http.get(
      // 'https://beta-tnsmart.rimes.int/index.php/Api_mobile/Api_admin/cw_tickets_by_vendor_id_get?v_id=' +
      // this.base_url +
      //   'index.php/Api_mobile/Api_admin/cw_tickets_by_raiser_id_get?page=' +
      //   param.page +
      //   '&&v_id=' +
      //   param.v_id
      `${this.base_url
      }index.php/Api_mobile/Api_admin/cw_tickets_by_raiser_id_get?page=${param.page ? param.page : ''
      }&v_id=${param.v_id ? param.v_id : ''}
      ${param['type'] ? '&type=' + param.type : ''}`
    );
  }

  //get cw tickets by resolver role admin 1
  get_cw_tickets_by_hq_resolver_role(param) {
    return this.http.get(
      `${this.base_url
      }index.php/Api_mobile/Api_admin/cw_tickets_by_hq_role_get?page=${param.page ? param.page : ''
      }&role=${param.role ? param.role : ''}
      ${param['type'] ? '&type=' + param.type : ''}`
    );
  }

  //get cw tickets by resolver role admin 1
  get_cw_tickets_districtwise(param) {
    return this.http.get(
      `${this.base_url
      }index.php/Api_mobile/Api_admin/cw_tickets_districtwise_get?page=${param.page ? param.page : ''
      }&d_id=${param.d_id ? param.d_id : ''}
       ${param['type'] ? '&type=' + param.type : ''}`
    );
  }

  //get cw tickets by resolver role  ven
  get_cw_tickets_districtwise_ven(param) {
    return this.http.get(
      `${this.base_url
      }index.php/Api_mobile/Api_admin/cw_tickets_districtwise_get?resolver=Vendor&&page=${param.page ? param.page : ''
      }&d_id=${param.d_id ? param.d_id : ''}
       ${param['type'] ? '&type=' + param.type : ''}`
    );
  }

  //get cw tickets by resolver role  ven
  get_all_cw_tickets_by_vendors(param) {
    const url =
      `${this.base_url
      }index.php/Api_mobile/Api_admin/all_cw_tickets_by_vendors_get?tag=Vendor&&page=${param.page ? param.page : ''
      }` +
      (param['type'] ? '&type=' + param.status : '') +
      (param['status'] ? '&status=' + param.status : '');
    return this.http.get(url);
  }

  //get cw tickets by vendor role
  get_cw_tickets_by_resolver_role(param) {
    return this.http.get(
      // 'https://beta-tnsmart.rimes.int/index.php/Api_mobile/Api_admin/cw_tickets_by_vendor_id_get?v_id=' +
      this.base_url +
      'index.php/Api_mobile/Api_admin/cw_tickets_by_resolver_role_get?role=' +
      param.role +
      '&page=' +
      param.page +
      '&v_id=' +
      param.v_id +
      (param['type'] ? '&type=' + param.type : '')
      // `${
      //       this.base_url
      //     }index.php/Api_mobile/Api_admin/cw_tickets_by_resolver_role_get?page=${
      //       param.page ? param.page : ''
      //     }&v_id=${param.v_id}&role=${param.role}`
    );
  }
  //get cw tickets by admin role
  get_cw_tickets_by_admin_role(param) {
    return this.http.get(
      `${this.base_url
      }index.php/Api_mobile/Api_admin/cw_tickets_by_resolver_role_get?page=${param.page ? param.page : ''
      }&role=${param.role}`
    );
  }

  //get cw ticket by ticket id
  get_cw_ticket_by_id(param) {
    return this.http.get(
      // 'https://beta-tnsmart.rimes.int/index.php/Api_mobile/Api_admin/cw_ticket_by_id_get?t_id=' +
      this.base_url +
      'index.php/Api_mobile/Api_admin/cw_ticket_by_id_get?t_id=' +
      param.t_id
    );
  }

  //get cw tickets by ticket id search
  get_cw_tickets_by_id_search(param) {
    return this.http.get(
      this.base_url +
      'index.php/Api_mobile/Api_admin/tickets_by_id_search_get?t_id=' +
      param.t_id +
      (param['d_id'] ? '&d_id=' + param['d_id'] : '') +
      (param['page'] ? '&page=' + param['page'] : '') +
      (param['d_id'] ? '&d_id=' + param['d_id'] : '') +
      (param['type'] ? '&type=' + param['type'] : '') +
      (param['role'] ? '&role=' + param['role'] : '')
    );
  }
  //get cw ticket actions by ticket id
  get_cw_ticket_actions_by_id(param) {
    return this.http.get(
      // 'https://beta-tnsmart.rimes.int/index.php/Api_mobile/Api_admin/cw_ticket_by_id_get?t_id=' +
      this.base_url +
      'index.php/Api_mobile/Api_admin/cw_ticket_actions_by_id_get?t_id=' +
      param.t_id
    );
  }

  //get cw ticket by resolver id
  get_cw_tickets_by_resolver_id(param) {
    return this.http.get(
      // 'https://beta-tnsmart.rimes.int/index.php/Api_mobile/Api_admin/cw_tickets_by_resolver_id_get?r_id=' +
      this.base_url +
      'index.php/Api_mobile/Api_admin/cw_tickets_by_resolver_id_get?page=' +
      param.page +
      '&&r_id=' +
      param.r_id +
      (param['type'] ? '&type=' + param.type : '')
    );
  }

  //get cw ticket related to resolver id
  get_cw_tickets_related_by_resolver_id(param) {
    return this.http.get(
      // 'https://beta-tnsmart.rimes.int/index.php/Api_mobile/Api_admin/cw_tickets_related_by_rid_get?r_id=' +
      this.base_url +
      'index.php/Api_mobile/Api_admin/cw_tickets_related_to_resolver_id_get?r_id=' +
      param.r_id +
      '&&page=' +
      param.page +
      (param['type'] ? '&type=' + param.type : '')
    );
  }

  //get open cw ticket with closure requests
  get_cw_tickets_open_with_closure_requests(param) {
    return this.http.get(
      this.base_url +
      'index.php/Api_mobile/Api_admin/open_cw_tickets_with_closure_requests?u_id='
      // 'api/mobile/open_cw_tickets_with_closure_requests?u_id='
      +
      param.u_id +
      '&&page=' +
      param.page
    );
  }
  //get open cw ticket with closure requests
  get_cw_tickets_open_with_closure_requests_count(param) {
    return this.http.get(
      this.base_url +
      'index.php/Api_mobile/Api_admin/open_cw_tickets_with_closure_requests_count?u_id='
      // 'api/mobile/open_cw_tickets_with_closure_requests_count?u_id='
      +
      param.u_id
    );
  }
  //get open cw ticket with actions requests pending count
  get_cw_tickets_with_entry_requests_count(param) {
    return this.http.get(
      this.base_url +
      'index.php/Api_mobile/Api_admin/cw_tickets_with_entry_requests_count_get?u_id=' +
      param.u_id
    );
  }

  //get payment involved tickets by rasier id HQ
  get_payment_involved_tickets_by_raiser_id(param) {
    return this.http.get(
      `${this.base_url
      }index.php/Api_mobile/Api_admin/cw_tickets_hq_payment_involved_get?page=${param.page ? param.page : ''
      //}api/mobile/cw_tickets_hq_payment_involved_get?page=${param.page ? param.page : ''
      }&r_id=${param.r_id ? param.r_id : ''}`
    );
  }

  //get closed cw ticket with closure requests
  get_cw_tickets_closed_with_closure_requests(param) {
    return this.http.get(
      this.base_url +
      'index.php/Api_mobile/Api_admin/closed_cw_tickets_with_closure_requests?u_id='
      // 'api/mobile/closed_cw_tickets_with_closure_requests?u_id='
      +
      param.u_id +
      '&&page=' +
      param.page
    );
  }

  //get open cw ticket with entry requests
  get_cw_tickets_open_with_entry_requests(param) {
    return this.http.get(
      this.base_url +
      'index.php/Api_mobile/Api_admin/cw_tickets_with_entry_requests_get?u_id=' +
      param.u_id +
      '&&page=' +
      param.page
    );
  }
  //get closed cw ticket with approvel
  get_cw_tickets_closed_with_approval(param) {
    return this.http.get(
      this.base_url +
      'index.php/Api_mobile/Api_admin/cw_tickets_with_entry_approved_get?u_id=' +
      param.u_id +
      '&&page=' +
      param.page
    );
  }
  //get closed cw ticket with actions - hq
  get_cw_tickets_with_actions(param) {
    return this.http.get(
      this.base_url +
      'index.php/Api_mobile/Api_admin/cw_tickets_with_actions_get?d_id=' +
      param.d_id +
      '&&page=' +
      param.page +
      (param.filter ? '&&filter=' + param.filter : '') +
      (param.open_state ? '&&open_state=' + param.open_state : '')
    );
  }

  //get arg complaint
  get_arg_complaints(param) {
    return this.http.get(
      `${this.base_url}index.php/Api_mobile/Api_admin/arg_complaints_get?page=${param.page ? param.page : ''
      // `${this.base_url}api/mobile/arg_complaints_get?page=${param.page ? param.page : ''
      }&u_id=${param.u_id ? param.u_id : ''}
        ${param['type'] ? '&type=' + param.type : ''}
        ${param['d_id'] ? '&d_id=' + param.d_id : ''}`
    );
  }
  //get arg complaint by c_id like
  get_arg_complaints_by_search(param) {
    return this.http.get(
      `${this.base_url
      }index.php/Api_mobile/Api_admin/arg_complaints_search_get?page=${param.page ? param.page : ''
      //}api/mobile/arg_complaints_search_get?page=${param.page ? param.page : ''
      }&u_id=${param.u_id ? param.u_id : ''}
      ${param['type'] ? '&type=' + param.type : ''}
      ${param['d_id'] ? '&d_id=' + param.d_id : ''}`
    );
  }

  //get arg complaint unread count
  get_arg_complaints_count() {
    return this.http.get(
      `${this.base_url}index.php/Api_mobile/Api_admin/arg_complaints_unread_count_get`
      // `${this.base_url}api/mobile/arg_complaints_unread_count_get`
    );
  }

  //update arg complaint view status
  update_arg_complaints_view_status(param) {
    return this.http.get(
      this.base_url +
      'index.php/Api_mobile/Api_admin/arg_complaints_status_update?c_id=' +
      param['c_id'] +
      '&status=' +
      param['status']
    );
  }

  post_admin(params) {
    return this.http.post(
      // 'http://192.168.1.74/tn-pk-smart/' +
      //   'index.php/Api_mobile/Api_admin/admin_post',
      this.base_url + 'index.php/Api_mobile/Api_admin/admin_post',
      //this.base_url + 'api/mobile/admin_post',
      params
    );
  }
  getTesterNumber() {
    return this.http.get(
      this.base_url + 'index.php/Api_mobile/Api_admin/tester_number_get'
    );
  }

  generic_post(url, params) {
    return this.http.post(url, params);
  }

  get_id_key() {
    return this.http.get(
      this.base_url + 'index.php/Api_mobile/Api_admin/id_key_get'
      // this.base_url + 'api/mobile/id_key_get'
    );
  }
  post_civil_work_update(params) {
    return this.http.post(
      this.base_url + 'index.php/Api_mobile/Api_admin/update_civil_work',
      params
    );
  }
  post_fence_work_update(params) {
    return this.http.post(
      this.base_url + 'index.php/Api_mobile/Api_admin/update_fence_work',
      params
    );
  }

  get_master_districts() {
    return this.http.get(
      this.base_url + 'index.php/Api_mobile/Api_admin/all_districts_get'
    );
  }

  get_station_status(param) {
    return this.http.get(
      this.base_url +
      'index.php/Api_mobile/Api_admin/get_station_status?id=' +
      param.id
    );
  }

  get_station_status_by_district_id(param) {
    return this.http.get(
      this.base_url +
      'index.php/Api_mobile/Api_admin/arg_stations_by_district_get?d_id=' +
      param.id
    );
  }
  get_master_taluks_by_district_id(param) {
    return this.http.get(
      this.base_url +
      'index.php/Api_mobile/Api_admin/taluks_by_district_id_get?d_id=' +
      param.id
    );
  }

  get_master_firkas_by_taluk_id(param) {
    return this.http.get(
      this.base_url +
      'index.php/Api_mobile/Api_admin/firkas_by_taluk_id_get?t_id=' +
      param.id
    );
  }

  get_master_villages_by_firka_id(param) {
    return this.http.get(
      this.base_url +
      'index.php/Api_mobile/Api_admin/villages_by_firka_id_get?f_id=' +
      param.id
    );
  }

  get_arg_aws_stations() {
    return this.http.get(
      this.base_url + 'index.php/Api_mobile/Api_admin/all_rainguage_station_get'
    );
  }
  get_arg_aws_stations_by_district_id(params) {
    return this.http.get(
      this.base_url +
      'index.php/Api_mobile/Api_admin/rainguage_station_by_district_id_get?d_id=' +
      params.id
    );
  }

  get_arg_aws_station_by_id(param) {
    return this.http.get(
      this.base_url +
      'index.php/Api_mobile/Api_admin/rainguage_station_by_id_get?s_id=' +
      param.id
    );
  }

  get_arg_aws_station_img_by_id(param) {
    return this.http.get(
      this.base_url +
      'index.php/Api_mobile/Api_admin/rainguage_station_img_by_id_get?s_id=' +
      param.id
    );
  }

  get_inventory_departments() {
    return this.http.get(
      this.base_url + 'index.php/Api_mobile/Api_inventory/get_departments'
    );
  }

  get_inventory_sources() {
    return this.http.get(
      this.base_url + 'index.php/Api_mobile/Api_inventory/get_sources'
    );
  }

  get_equipment_list() {
    return this.http.get(
      this.base_url + 'index.php/Api_mobile/Api_inventory/get_inventory'
    );
  }

  post_inventory(params) {
    return this.http.post(
      this.base_url + 'index.php/Api_mobile/Api_inventory/add_inventory',
      params
    );
  }

  validate_inventory_coords(params) {
    return this.http.get(
      this.base_url +
      'index.php/Api_mobile/api_inventory/validate_by_lat_long_get?lat=' +
      params.lat +
      '&lng=' +
      params.lng +
      '&t_id=' +
      params.t_id
    );
  }

  get_inventory_stockhouse_get(param) {
    const url =
      // 'http://localhost/tn-pk-smart/index.php/Api_mobile/Api_inventory/inventory_stockhouse_nearby_get?lat=' +
      // 'http://203.156.108.109/tnsmart_dev/index.php/Api_mobile/Api_inventory/inventory_stockhouse_nearby_get?lat=' +
      this.base_url +
      'index.php/Api_mobile/Api_inventory/inventory_stockhouse_nearby_get?lat=' +
      param['lat'] +
      '&lng=' +
      param['lng'] +
      (param['s_filter'] ? '&s_filter=' + param['s_filter'] : '') +
      (param['i_filter'] ? '&i_filter=' + param['i_filter'] : '');

    return this.http.get(url);

    // this.base_url + 'index.php/Api_mobile/Api_inventory/inventory_stockhouse_nearby_get'
  }

  get_inventory_items_list(param) {
    return this.http.get(
      // 'http://localhost/tn-pk-smart/index.php/Api_mobile/Api_inventory/inventory_items_list_get?unique_id=' +
      // 'http://203.156.108.109/tnsmart_dev/index.php/Api_mobile/Api_inventory/inventory_items_list_get?unique_id=' +
      this.base_url +
      'index.php/Api_mobile/Api_inventory/inventory_items_list_get?unique_id=' +
      param['unique_id']
      // this.base_url + 'index.php/Api_mobile/Api_inventory/inventory_items_list_get?unique_id=' +
      //   param['unique_id']'
    );
  }

  //relief_shelters
  get_relief_Shelters(param) {
    return this.http.get(
      this.base_url +
      'index.php/Api_mobile/api_relief_center/all_shelters_get?id=' +
      param.id
    );
  }
  //relief_shelters
  get_relief_Shelter_dis_tal_id(param) {
    return this.http.get(
      this.base_url +
      'index.php/Api_mobile/api_relief_center/shelter_dis_tal_by_vil_get?id=' +
      param.id
    );
  }

  post_relief_Shelters(params) {
    return this.http.post(
      this.base_url + 'index.php/Api_mobile/api_relief_center/admin_post',
      params
    );
  }

  post_vendor(params) {
    return this.http.post(
      this.base_url + 'index.php/Api_mobile/Api_vendor/vendor_post',
      params
    );
  }

  get_mem_area_type() {
    return this.http.get(this.base_url + 'index.php/API/Memorandum/area_type');
  }
  get_mem_house_type() {
    return this.http.get(this.base_url + 'index.php/API/Memorandum/house_type');
  }
  get_mem_damage_cause_type() {
    return this.http.get(
      this.base_url + 'index.php/API/Memorandum/cause_damage'
    );
  }
  get_mem_house_damage_type() {
    return this.http.get(
      this.base_url + 'index.php/API/Memorandum/damage_type'
    );
  }
}
