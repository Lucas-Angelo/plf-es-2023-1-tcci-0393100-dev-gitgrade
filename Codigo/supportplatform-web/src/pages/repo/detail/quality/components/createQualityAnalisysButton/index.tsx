import { Button } from "@primer/react";
import { useFetcher } from "react-router-dom";

interface ICreateQualityAnalisysButtonProps {
    analyzing?: boolean;
}

export default function CreateQualityAnalisysButton(
    props: ICreateQualityAnalisysButtonProps
) {
    const fetcher = useFetcher();

    const isAnalyzing = props.analyzing || fetcher.state === "submitting";

    return (
        <fetcher.Form method="POST">
            <Button
                variant="primary"
                type="submit"
                disabled={isAnalyzing}
            >
                {isAnalyzing
                    ? "Analisando código..."
                    : "Executar análise de código"}
            </Button>
        </fetcher.Form>
    );
}
