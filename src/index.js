/**
 * Created by glenn on 05.08.16.
 */

import './polyfill';

import _ from 'lodash';
import $ from 'jquery';
import './app.css';

$(() => {
  $('#app').text(_.identity('Szia, Zsófia! ;)'));
});
