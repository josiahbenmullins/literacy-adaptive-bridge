import UIKit
import WebKit
import Capacitor

class GNTBridgeViewController: CAPBridgeViewController {

    override func capacitorDidLoad() {
        super.capacitorDidLoad()

        webView?.scrollView.bounces = true
        webView?.scrollView.alwaysBounceVertical = true
    }
}