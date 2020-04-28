import { Component } from "@angular/core";
import { Platform, LoadingController } from "@ionic/angular";

import Dynamsoft from "dynamsoft-javascript-barcode";

@Component({
    selector: "app-home",
    templateUrl: "home.page.html",
    styleUrls: ["home.page.scss"]
})
export class HomePage {
    private platform: Platform;
    public isScanning: boolean = false;
    public barcodeResults: any = [];
    public videoResults: any = [];

    constructor(platform: Platform, public loadingController: LoadingController) {
        this.platform = platform; 
        this.initializeDBR();
    }

    reader = null;
    scanner = null;

    async initializeDBR() {
        this.reader = this.reader || (await Dynamsoft.BarcodeReader.createInstance()); 
        this.scanner = this.scanner || (await Dynamsoft.BarcodeScanner.createInstance()); 
        // this.scanner.singleFrameMode = true;
        this.scanner.setUIElement(document.getElementById('scanner'))
    }

    async readBarcodeFromImage(file) {
        try {
            this.barcodeResults = []; 
            this.videoResults = [];
            this.reader.getRuntimeSettings();
            this.reader.updateRuntimeSettings('speed');
            this.presentLoading();
            let results = await this.reader.decode(file);
            this.dismissLoading();
            if(results.length){
                this.barcodeResults = results;
            } else {
                this.barcodeResults.push({barcodeText: "No barcodes found."})
            }
        } catch (ex) {
            alert(ex);
        }
    }
    async readBarcodeFromVideo() {
        try {
            this.isScanning = true;
            this.videoResults = []; 
            this.barcodeResults = [];
            let scanSettings = await this.scanner.getScanSettings();
            // disregard duplicated results found in a specified time period
            scanSettings.duplicateForgetTime = 1000;
            // set a scan interval so the library may release the CPU from time to time
            scanSettings.intervalTime = 2000;
            await this.scanner.updateScanSettings(scanSettings);

            this.scanner.onUnduplicatedRead = (txt, result) => {
                this.videoResults.push(txt);
            };

            await this.scanner.show();
        } catch (ex) {
            alert(ex);
        }
    }

    async presentLoading() {
        const loading = await this.loadingController.create({
            message: 'Decoding barcodes...'
        });
        await loading.present();
    }

    async dismissLoading() {
       await this.loadingController.dismiss();
    }
}
