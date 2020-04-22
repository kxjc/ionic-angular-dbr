import {
    Component, 
    ɵCompiler_compileModuleSync__POST_R3__
} from "@angular/core";
import { Plugins, CameraResultType, CameraSource } from "@capacitor/core";
import { Platform, ToastController } from "@ionic/angular";

import Dynamsoft from "dynamsoft-javascript-barcode";
import { timingSafeEqual } from "crypto";

@Component({
    selector: "app-home",
    templateUrl: "home.page.html",
    styleUrls: ["home.page.scss"]
})
export class HomePage {
    private platform: Platform;
    public toastMsgs: any = [];
    public barcodeResults: any = [];

    constructor(platform: Platform, public toastController: ToastController) {
        this.platform = platform; 
        this.initializeDBR();
    }

    reader = null;
    scanner = null;

    async initializeDBR() {
        this.reader = this.reader || (await Dynamsoft.BarcodeReader.createInstance()); 
        this.scanner = this.scanner || (await Dynamsoft.BarcodeScanner.createInstance()); 
        // this.scanner.singleFrameMode = true;
    }

    async readBarcodeFromImage(file) {
        try {
            this.barcodeResults = [];
            let results = await this.reader.decode(file);
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
            let scanSettings = await this.scanner.getScanSettings();
            // disregard duplicated results found in a specified time period
            scanSettings.duplicateForgetTime = 1000;
            // set a scan interval so the library may release the CPU from time to time
            scanSettings.intervalTime = 2000;
            await this.scanner.updateScanSettings(scanSettings);

            this.scanner.onUnduplicatedRead = (txt, result) => {
                this.sendToast(txt);
            };

            await this.scanner.show();
            document.getElementsByClassName(
                "dbrScanner-cvs-scanarea"
            )[0].parentElement.style.height = "90%";
        } catch (ex) {
            alert(ex);
        }
    }

    async sendToast(barcodeText) {
        this.toastMsgs.push(barcodeText);
        const toast = await this.toastController.create({
            message: this.toastMsgs
                .toString()
                .split(",")
                .join("\n"),
            duration: 3000
        });
        toast.present();
        toast.onDidDismiss().then(() => {
            this.toastMsgs = [];
        });
    }
}
