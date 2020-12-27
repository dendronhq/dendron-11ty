ENGINE_SERVER_VERSION="0.21.1-alpha.8"
COMMON_SERVER_VERSION="0.21.1-alpha.2"

pkg1="@dendronhq/engine-server@$ENGINE_SERVER_VERSION"
pkg2="@dendronhq/common-server@$COMMON_SERVER_VERSION"

yarn unlink @dendronhq/engine-server
yarn unlink @dendronhq/common-server

yarn add --force $pkg1
yarn add --force $pkg2
