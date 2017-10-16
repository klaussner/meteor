// This has been moved out of the `mongo` package so it can be used by the tool
// via isopacket, without having to also load ddp-server.

Package.describe({
  summary: "Wrapper around the mongo npm package",
  version: "2.2.33",
  documentation: null
});

Npm.depends({
  // Use the 3.0.0 branch of `node-mongodb-native`.
  mongodb: "git://github.com/mongodb/node-mongodb-native.git#b0b04ae7870ccfca1db5b92702467662353222e2"
});

Package.onUse(function (api) {
  api.addFiles("wrapper.js", "server");
  api.export([
    "NpmModuleMongodb",
    "NpmModuleMongodbVersion",
  ], "server");
});
