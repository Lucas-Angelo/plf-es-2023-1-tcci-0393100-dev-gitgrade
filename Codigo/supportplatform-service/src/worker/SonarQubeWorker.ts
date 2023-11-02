import { parentPort } from "worker_threads";
import SonarQubeAnalyzer from "../sonarqube/SonarQubeAnalyzer";

let isDone = false;

if (parentPort) {
    parentPort.once(
        "message",
        async ({ repositoryName, projectKey, projectName }) => {
            try {
                const sonarQubeAnalyzer = new SonarQubeAnalyzer(repositoryName);
                sonarQubeAnalyzer.setProjectKey(projectKey);
                sonarQubeAnalyzer.setProjectName(projectName);
                await sonarQubeAnalyzer.run();
                if (parentPort) parentPort.postMessage("done");
                isDone = true;
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error("Error in worker thread:", error);
                if (parentPort) parentPort.postMessage("error");
            }
        }
    );
}

// Notify the main thread if the worker is being terminated.
process.on("exit", () => {
    if (!isDone) {
        if (parentPort) parentPort.postMessage("terminated");
    }
});
