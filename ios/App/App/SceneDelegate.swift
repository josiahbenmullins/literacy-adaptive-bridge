import UIKit
import Capacitor

class GNTBridgeViewController: CAPBridgeViewController {

    private var hasReceivedInitialSafeArea = false

    override func capacitorDidLoad() {
        super.capacitorDidLoad()

        // Restore the normal iOS rubber-band scrolling feel.
        webView?.scrollView.bounces = true
        webView?.scrollView.alwaysBounceVertical = true

        scheduleSafeAreaUpdates()
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        scheduleSafeAreaUpdates()
    }

    override func viewSafeAreaInsetsDidChange() {
        super.viewSafeAreaInsetsDidChange()
        applyNativeSafeAreaToWebApp()
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        applyNativeSafeAreaToWebApp()
    }

    private func scheduleSafeAreaUpdates() {
        // UIKit can briefly report 0 during first launch.
        let delays: [Double] = [0.0, 0.05, 0.15, 0.35, 0.70]

        for delay in delays {
            DispatchQueue.main.asyncAfter(deadline: .now() + delay) { [weak self] in
                self?.applyNativeSafeAreaToWebApp()
            }
        }
    }

    private func applyNativeSafeAreaToWebApp() {
        guard webView != nil else { return }

        let viewTop = view.safeAreaInsets.top
        let windowTop = view.window?.safeAreaInsets.top ?? 0
        let top = max(viewTop, windowTop)

        let viewBottom = view.safeAreaInsets.bottom
        let windowBottom = view.window?.safeAreaInsets.bottom ?? 0
        let bottom = max(viewBottom, windowBottom)

        // During first launch only, ignore the temporary 0 inset.
        // Once a real safe area has been received, allow later values
        // (including 0 in landscape) so rotation can shrink the top spacing.
        if !hasReceivedInitialSafeArea {
            guard top > 0 else { return }
            hasReceivedInitialSafeArea = true
        }

        let javascript = """
        document.documentElement.classList.add('native-ios');
        document.documentElement.style.setProperty('--native-safe-area-top', '\(top)px');
        document.documentElement.style.setProperty('--native-safe-area-bottom', '\(bottom)px');
        """

        webView?.evaluateJavaScript(javascript, completionHandler: nil)
    }
}

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(
        _ scene: UIScene,
        willConnectTo session: UISceneSession,
        options connectionOptions: UIScene.ConnectionOptions
    ) {
        guard let windowScene = scene as? UIWindowScene else { return }

        window = UIWindow(windowScene: windowScene)
        window?.rootViewController = GNTBridgeViewController()
        window?.makeKeyAndVisible()

        SceneDelegateProxy.shared.scene(
            scene,
            willConnectTo: session,
            options: connectionOptions
        )
    }

    func scene(
        _ scene: UIScene,
        openURLContexts URLContexts: Set<UIOpenURLContext>
    ) {
        SceneDelegateProxy.shared.scene(
            scene,
            openURLContexts: URLContexts
        )
    }

    func scene(
        _ scene: UIScene,
        continue userActivity: NSUserActivity
    ) {
        SceneDelegateProxy.shared.scene(
            scene,
            continue: userActivity
        )
    }
}
