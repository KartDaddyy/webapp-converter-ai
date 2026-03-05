import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

function buildFlutterFiles(appName, safeAppName, code, pubspec) {
  const bundleId = `com.example.${safeAppName}`;

  const androidManifest = `<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application
        android:label="${appName}"
        android:name="\${applicationName}"
        android:icon="@mipmap/ic_launcher">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:theme="@style/LaunchTheme"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">
            <meta-data
              android:name="io.flutter.embedding.android.NormalTheme"
              android:resource="@style/NormalTheme" />
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
        <meta-data
            android:name="flutterEmbedding"
            android:value="2" />
    </application>
</manifest>`;

  const buildGradle = `def localProperties = new Properties()
def localPropertiesFile = rootProject.file('local.properties')
if (localPropertiesFile.exists()) {
    localPropertiesFile.withReader('UTF-8') { reader ->
        localProperties.load(reader)
    }
}

def flutterRoot = localProperties.getProperty('flutter.sdk')

apply plugin: 'com.android.application'
apply from: "\$flutterRoot/packages/flutter_tools/gradle/flutter.gradle"

android {
    namespace "com.example.${safeAppName}"
    compileSdkVersion 34
    defaultConfig {
        applicationId "com.example.${safeAppName}"
        minSdkVersion 21
        targetSdkVersion 34
        versionCode 1
        versionName "1.0"
    }
    buildTypes {
        release {
            signingConfig signingConfigs.debug
        }
    }
}

flutter {
    source '../..'
}`;

  const rootBuildGradle = `buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.1.0'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.buildDir = '../build'
subprojects {
    project.buildDir = "\${rootProject.buildDir}/\${project.name}"
}
subprojects {
    project.evaluationDependsOn(':app')
}

tasks.register("clean", Delete) {
    delete rootProject.buildDir
}`;

  const gradleSettings = `include ':app'

def localPropertiesFile = new File(rootProject.projectDir, "local.properties")
def properties = new Properties()

assert localPropertiesFile.exists()
localPropertiesFile.withReader("UTF-8") { reader -> properties.load(reader) }

def flutterSdkPath = properties.getProperty("flutter.sdk")
assert flutterSdkPath != null, "flutter.sdk not set in local.properties"
apply from: "\$flutterSdkPath/packages/flutter_tools/gradle/app_plugin_loader.gradle"`;

  const mainActivity = `package com.example.${safeAppName}

import io.flutter.embedding.android.FlutterActivity

class MainActivity: FlutterActivity()`;

  // iOS pbxproj (minimal but valid for Codemagic)
  const pbxproj = `// !$*UTF8*$!
{
	archiveVersion = 1;
	classes = {
	};
	objectVersion = 54;
	objects = {
		97C146E61CF9000F007C117D /* Project object */ = {
			isa = PBXProject;
			buildConfigurationList = 97C146E91CF9000F007C117D /* Build configuration list for PBXProject "${appName}" */;
			compatibilityVersion = "Xcode 9.3";
			developmentRegion = en;
			hasScannedForEncodings = 0;
			knownRegions = (
				en,
				Base,
			);
			mainGroup = 97C146E51CF9000F007C117D;
			productRefGroup = 97C146EF1CF9000F007C117D /* Products */;
			projectDirPath = "";
			projectRoot = "";
			targets = (
				97C146ED1CF9000F007C117D /* Runner */,
			);
		};
		97C146ED1CF9000F007C117D /* Runner */ = {
			isa = PBXNativeTarget;
			buildConfigurationList = 97C147051CF9000F007C117D /* Build configuration list for PBXNativeTarget "Runner" */;
			buildPhases = (
			);
			buildRules = (
			);
			dependencies = (
			);
			name = Runner;
			productName = Runner;
			productReference = 97C146EE1CF9000F007C117D /* Runner.app */;
			productType = "com.apple.product-type.application";
		};
		97C146EE1CF9000F007C117D /* Runner.app */ = {
			isa = PBXFileReference;
			explicitFileType = wrapper.application;
			includeInIndex = 0;
			path = Runner.app;
			sourceTree = BUILT_PRODUCTS_DIR;
		};
		97C146E51CF9000F007C117D = {
			isa = PBXGroup;
			children = (
				97C146EF1CF9000F007C117D /* Products */,
			);
			sourceTree = "<group>";
		};
		97C146EF1CF9000F007C117D /* Products */ = {
			isa = PBXGroup;
			children = (
				97C146EE1CF9000F007C117D /* Runner.app */,
			);
			name = Products;
			sourceTree = "<group>";
		};
		97C146E91CF9000F007C117D /* Build configuration list for PBXProject "${appName}" */ = {
			isa = XCConfigurationList;
			buildConfigurations = (
				97C147031CF9000F007C117D /* Debug */,
				97C147041CF9000F007C117D /* Release */,
				248D2A061CF800AD007C117D /* Profile */,
			);
			defaultConfigurationIsVisible = 0;
			defaultConfigurationName = Release;
		};
		97C147051CF9000F007C117D /* Build configuration list for PBXNativeTarget "Runner" */ = {
			isa = XCConfigurationList;
			buildConfigurations = (
				97C147061CF9000F007C117D /* Debug */,
				97C147071CF9000F007C117D /* Release */,
				248D2A071CF800AD007C117D /* Profile */,
			);
			defaultConfigurationIsVisible = 0;
			defaultConfigurationName = Release;
		};
		97C147031CF9000F007C117D /* Debug */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ALWAYS_SEARCH_USER_PATHS = NO;
				BUNDLE_IDENTIFIER = "${bundleId}";
				CURRENT_PROJECT_VERSION = "$(FLUTTER_BUILD_NUMBER)";
				INFOPLIST_FILE = Runner/Info.plist;
				PRODUCT_BUNDLE_IDENTIFIER = "${bundleId}";
				PRODUCT_NAME = "$(TARGET_NAME)";
			};
			name = Debug;
		};
		97C147041CF9000F007C117D /* Release */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ALWAYS_SEARCH_USER_PATHS = NO;
				BUNDLE_IDENTIFIER = "${bundleId}";
				CURRENT_PROJECT_VERSION = "$(FLUTTER_BUILD_NUMBER)";
				INFOPLIST_FILE = Runner/Info.plist;
				PRODUCT_BUNDLE_IDENTIFIER = "${bundleId}";
				PRODUCT_NAME = "$(TARGET_NAME)";
			};
			name = Release;
		};
		248D2A061CF800AD007C117D /* Profile */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ALWAYS_SEARCH_USER_PATHS = NO;
				BUNDLE_IDENTIFIER = "${bundleId}";
				CURRENT_PROJECT_VERSION = "$(FLUTTER_BUILD_NUMBER)";
				INFOPLIST_FILE = Runner/Info.plist;
				PRODUCT_BUNDLE_IDENTIFIER = "${bundleId}";
				PRODUCT_NAME = "$(TARGET_NAME)";
			};
			name = Profile;
		};
		97C147061CF9000F007C117D /* Debug */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				BUNDLE_IDENTIFIER = "${bundleId}";
				PRODUCT_BUNDLE_IDENTIFIER = "${bundleId}";
				PRODUCT_NAME = "$(TARGET_NAME)";
			};
			name = Debug;
		};
		97C147071CF9000F007C117D /* Release */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				BUNDLE_IDENTIFIER = "${bundleId}";
				PRODUCT_BUNDLE_IDENTIFIER = "${bundleId}";
				PRODUCT_NAME = "$(TARGET_NAME)";
			};
			name = Release;
		};
		248D2A071CF800AD007C117D /* Profile */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				BUNDLE_IDENTIFIER = "${bundleId}";
				PRODUCT_BUNDLE_IDENTIFIER = "${bundleId}";
				PRODUCT_NAME = "$(TARGET_NAME)";
			};
			name = Profile;
		};
	};
	rootObject = 97C146E61CF9000F007C117D /* Project object */;
}`;

  const infoPlist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleDevelopmentRegion</key>
	<string>$(DEVELOPMENT_LANGUAGE)</string>
	<key>CFBundleDisplayName</key>
	<string>${appName}</string>
	<key>CFBundleExecutable</key>
	<string>$(EXECUTABLE_NAME)</string>
	<key>CFBundleIdentifier</key>
	<string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
	<key>CFBundleInfoDictionaryVersion</key>
	<string>6.0</string>
	<key>CFBundleName</key>
	<string>${appName}</string>
	<key>CFBundlePackageType</key>
	<string>APPL</string>
	<key>CFBundleShortVersionString</key>
	<string>$(FLUTTER_BUILD_NAME)</string>
	<key>CFBundleSignature</key>
	<string>????</string>
	<key>CFBundleVersion</key>
	<string>$(FLUTTER_BUILD_NUMBER)</string>
	<key>LSRequiresIPhoneOS</key>
	<true/>
	<key>UILaunchStoryboardName</key>
	<string>LaunchScreen</string>
	<key>UIMainStoryboardFile</key>
	<string>Main</string>
	<key>UISupportedInterfaceOrientations</key>
	<array>
		<string>UIInterfaceOrientationPortrait</string>
		<string>UIInterfaceOrientationLandscapeLeft</string>
		<string>UIInterfaceOrientationLandscapeRight</string>
	</array>
	<key>UISupportedInterfaceOrientations~ipad</key>
	<array>
		<string>UIInterfaceOrientationPortrait</string>
		<string>UIInterfaceOrientationPortraitUpsideDown</string>
		<string>UIInterfaceOrientationLandscapeLeft</string>
		<string>UIInterfaceOrientationLandscapeRight</string>
	</array>
	<key>CADisableMinimumFrameDurationOnPhone</key>
	<true/>
	<key>UIApplicationSupportsIndirectInputEvents</key>
	<true/>
</dict>
</plist>`;

  const appDelegate = `import UIKit
import Flutter

@UIApplicationMain
@objc class AppDelegate: FlutterAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    GeneratedPluginRegistrant.register(with: self)
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
}`;

  const generatedPluginRegistrant_h = `//
//  Generated file. Do not edit.
//

// clang-format off

#ifndef GeneratedPluginRegistrant_h
#define GeneratedPluginRegistrant_h

#import <Flutter/Flutter.h>

NS_ASSUME_NONNULL_BEGIN

@interface GeneratedPluginRegistrant : NSObject
+ (void)registerWithRegistry:(NSObject<FlutterPluginRegistry>*)registry;
@end

NS_ASSUME_NONNULL_END
#endif /* GeneratedPluginRegistrant_h */`;

  const generatedPluginRegistrant_m = `//
//  Generated file. Do not edit.
//

// clang-format off

#import "GeneratedPluginRegistrant.h"

@implementation GeneratedPluginRegistrant

+ (void)registerWithRegistry:(NSObject<FlutterPluginRegistry>*)registry {
}

@end`;

  return [
    { path: "lib/main.dart", content: code },
    { path: "pubspec.yaml", content: pubspec },
    { path: "android/app/src/main/AndroidManifest.xml", content: androidManifest },
    { path: "android/app/build.gradle", content: buildGradle },
    { path: "android/build.gradle", content: rootBuildGradle },
    { path: "android/settings.gradle", content: gradleSettings },
    { path: "android/app/src/main/kotlin/com/example/${safeAppName}/MainActivity.kt", content: mainActivity },
    { path: "ios/Runner.xcodeproj/project.pbxproj", content: pbxproj },
    { path: "ios/Runner/Info.plist", content: infoPlist },
    { path: "ios/Runner/AppDelegate.swift", content: appDelegate },
    { path: "ios/Runner/GeneratedPluginRegistrant.h", content: generatedPluginRegistrant_h },
    { path: "ios/Runner/GeneratedPluginRegistrant.m", content: generatedPluginRegistrant_m },
  ];
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { owner, repo, project } = await req.json();
    if (!owner || !repo || !project) {
      return Response.json({ error: 'Missing owner, repo, or project' }, { status: 400 });
    }

    const appName = project.analysis?.siteName || project.name || "app";
    const safeAppName = appName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const code = project.flutter_code || "import 'package:flutter/material.dart';\nvoid main() => runApp(const MaterialApp(home: Scaffold(body: Center(child: Text('Hello World')))));\n";

    const pubspec = `name: ${safeAppName}
description: Generated Flutter app from ${project.url || "web"}
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^2.0.0

flutter:
  uses-material-design: true
`;

    const files = buildFlutterFiles(appName, safeAppName, code, pubspec);

    const { accessToken } = await base44.asServiceRole.connectors.getConnection("github");
    const ghHeaders = {
      "Authorization": `Bearer ${accessToken}`,
      "Accept": "application/vnd.github+json",
      "Content-Type": "application/json"
    };
    const apiBase = `https://api.github.com/repos/${owner}/${repo}`;

    // Get current branch SHA
    const branchRes = await fetch(`${apiBase}/git/ref/heads/main`, { headers: ghHeaders });
    let baseSha = null;
    if (branchRes.ok) {
      const branchData = await branchRes.json();
      baseSha = branchData.object.sha;
    }

    // Create blobs
    const blobs = await Promise.all(files.map(async (f) => {
      const blobRes = await fetch(`${apiBase}/git/blobs`, {
        method: "POST",
        headers: ghHeaders,
        body: JSON.stringify({ content: f.content, encoding: "utf-8" })
      });
      const blobData = await blobRes.json();
      return { path: f.path, mode: "100644", type: "blob", sha: blobData.sha };
    }));

    // Create tree
    const treeBody = { tree: blobs };
    if (baseSha) {
      const commitRes = await fetch(`${apiBase}/git/commits/${baseSha}`, { headers: ghHeaders });
      const commitData = await commitRes.json();
      treeBody.base_tree = commitData.tree.sha;
    }

    const treeRes = await fetch(`${apiBase}/git/trees`, {
      method: "POST",
      headers: ghHeaders,
      body: JSON.stringify(treeBody)
    });
    const treeData = await treeRes.json();

    // Create commit
    const commitBody = {
      message: "chore: update Flutter app from WebApp Converter AI",
      tree: treeData.sha,
    };
    if (baseSha) commitBody.parents = [baseSha];

    const newCommitRes = await fetch(`${apiBase}/git/commits`, {
      method: "POST",
      headers: ghHeaders,
      body: JSON.stringify(commitBody)
    });
    const newCommitData = await newCommitRes.json();

    // Update or create ref
    if (baseSha) {
      await fetch(`${apiBase}/git/refs/heads/main`, {
        method: "PATCH",
        headers: ghHeaders,
        body: JSON.stringify({ sha: newCommitData.sha, force: true })
      });
    } else {
      await fetch(`${apiBase}/git/refs`, {
        method: "POST",
        headers: ghHeaders,
        body: JSON.stringify({ ref: "refs/heads/main", sha: newCommitData.sha })
      });
    }

    return Response.json({ success: true, commitSha: newCommitData.sha });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});