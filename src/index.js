/**
 * Created by glenn on 05.08.16.
 */

import _ from 'lodash';
import $ from 'jquery';
import './app.css';

$(() => {
  $('#app').text(_.identity('Hallo, Laura! ;)'));
});
