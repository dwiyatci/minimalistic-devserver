/**
 * Created by glenn on 8/5/16.
 */

import 'babel-polyfill';
import { identity } from 'lodash';
import $ from 'jquery';
import './app.css';

$(() => {
  $('#app').text(identity('d\'akujem, natália'));
});
