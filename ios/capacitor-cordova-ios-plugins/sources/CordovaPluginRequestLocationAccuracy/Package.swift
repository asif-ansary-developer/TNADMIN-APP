// swift-tools-version: 5.9

import PackageDescription

let package = Package(
    name: "CordovaPluginRequestLocationAccuracy",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "CordovaPluginRequestLocationAccuracy",
            targets: ["CordovaPluginRequestLocationAccuracy"]
        )
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "8.0.2")
    ],
    targets: [
        .target(
            name: "CordovaPluginRequestLocationAccuracy",
            dependencies: [
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: ".",
            publicHeadersPath: "."
        )
    ]
)