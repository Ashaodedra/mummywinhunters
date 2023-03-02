const gulp = require('gulp');
const poEditor = require('../poeditor/script/index');

gulp.task('spreadsheet:get', async () => await poEditor.getFromSpreadsheet());
