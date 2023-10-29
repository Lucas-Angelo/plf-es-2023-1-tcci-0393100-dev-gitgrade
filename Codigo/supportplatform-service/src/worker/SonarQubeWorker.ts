import { parentPort } from "worker_threads";
import SonarQubeAnalyzer from "../sonarqube/SonarQubeAnalyzer";

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
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error("Error in worker thread:", error);
                if (parentPort) parentPort.postMessage("error");
            }
        }
    );
}
