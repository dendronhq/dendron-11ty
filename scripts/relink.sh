VERSION="0.20.1-alpha.14"
COMMON_SERVER_VERSION="0.20.1-alpha.13"

pkg1="@dendronhq/engine-server@$VERSION"
pkg2="@dendronhq/common-server@$COMMON_SERVER_VERSION"
yarn unlink @dendronhq/engine-server
yarn unlink @dendronhq/common-server
echo "installing $pkg"
yarn add --force $pkg1
yarn add --force $pkg2
