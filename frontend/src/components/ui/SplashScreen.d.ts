export interface BootTask {
    label: string;
    run: () => Promise<void>;
}
interface SplashScreenProps {
    onReady: () => void;
    appName?: string;
    version?: string;
    tasks: BootTask[];
    minDisplayMs?: number;
}
export declare function SplashScreen({ onReady, appName, version, tasks, minDisplayMs, }: SplashScreenProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=SplashScreen.d.ts.map