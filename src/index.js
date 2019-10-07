/**
 * Created by glenn on 05.08.16.
 */

import { identity } from 'lodash';
import $ from 'jquery';
import './app.css';

$(() => {
  $('#app').text(identity('Dzień dobry, Karolina! ;)'));
});
