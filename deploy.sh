npm ci
npm run build-bundle
sudo mkdir -p /var/www/bigbluebutton-default/assets/plugins
sudo cp dist/manifest.json /var/www/bigbluebutton-default/assets/plugins/RemoteCameraPluginManifest.json
sudo cp dist/RemoteCameraPlugin.js /var/www/bigbluebutton-default/assets/plugins/RemoteCameraPlugin.js
