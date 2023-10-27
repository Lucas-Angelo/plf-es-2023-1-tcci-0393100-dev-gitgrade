// sonarqube-scanner.d.ts

declare module "sonarqube-scanner" {
    interface ScannerParameters {
        serverUrl?: string;
        token?: string;
        options?: {
            [key: string]: string;
        };
    }

    type ScannerCallback = () => void;

    function sonarqubeScanner(
        parameters: ScannerParameters,
        callback?: ScannerCallback
    ): void;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    namespace customScanner {
        function sonarqubeScanner(
            parameters: ScannerParameters,
            callback?: ScannerCallback
        ): void;
    }

    export = sonarqubeScanner;
}
