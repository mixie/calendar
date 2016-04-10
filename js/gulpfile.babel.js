import gulp from 'gulp'
import gutil from 'gulp-util'
import path from 'path'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'

import {webpack_production, webpack_development} from './webpack.conf'


gulp.task('default', ['webpack-dev-server'])


gulp.task('webpack', function(callback) {
  webpack(webpack_production, function(err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack', err)
    }
    callback()
  })
})


gulp.task('webpack-dev-server', function(callback) {
  let compiler = webpack(webpack_development);

  new WebpackDevServer(compiler, {
    hot: true,
    contentBase: path.join(__dirname, 'build'),
  }).listen(8080, 'localhost', function(err) {
    if (err) {
      throw new gutil.PluginError('webpack-dev-server', err)
    }
  })
})
