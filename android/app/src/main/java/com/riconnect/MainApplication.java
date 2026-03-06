package com.riconnect;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;
import android.app.Application;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
  private final ReactNativeHost mReactNativeHost = new DefaultReactNativeHost(this) {
    @Override public boolean getUseDeveloperSupport() { return BuildConfig.DEBUG; }
    @Override public List<ReactPackage> getPackages() { return new PackageList(this).getPackages(); }
    @Override public String getJSMainModuleName() { return "index"; }
    @Override protected Boolean isNewArchEnabled() { return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED; }
    @Override protected Boolean isHermesEnabled() { return BuildConfig.IS_HERMES_ENABLED; }
  };
  @Override public ReactNativeHost getReactNativeHost() { return mReactNativeHost; }
  @Override public void onCreate() { super.onCreate(); SoLoader.init(this, false); }
}