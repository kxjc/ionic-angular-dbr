import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import Dynamsoft from 'dynamsoft-javascript-barcode';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    Dynamsoft.BarcodeReader.engineResourcePath = "https://cdn.jsdelivr.net/npm/dynamsoft-javascript-barcode@7.3.0-v2/dist/";
    // Please visit https://www.dynamsoft.com/CustomerPortal/Portal/TrialLicense.aspx to get a trial license. 
    Dynamsoft.BarcodeReader.productKeys = "t0068MgAAADcOB47dibaMd0Hpe8N+9G3AcVoUNfCkl4V3cAh0TXhsmbiJewPxP0eOBnp0QzjNmMitkEn+Iz6Phm5rvC5YVp0=";
  }
}
