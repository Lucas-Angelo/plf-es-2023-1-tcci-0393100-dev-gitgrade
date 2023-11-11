import { Button } from "@primer/react";
import { useFetcher } from "react-router-dom";
import appRoutes from "../../routes/appRoutes";

interface ICloneEvaluationMethodButtonProps {
    evaluationMethodId: number;
}

export default function CloneEvaluationMethodButton(
    props: ICloneEvaluationMethodButtonProps
) {
    const fetcher = useFetcher();
    const submitUrl = appRoutes.evaluationMethod.detail.clone.link(
        props.evaluationMethodId
    );

    const isCloning = fetcher.state === "submitting";

    return (
        <fetcher.Form
            method="POST"
            action={submitUrl}
        >
            <Button
                variant="default"
                disabled={isCloning}
                type="submit"
            >
                {isCloning ? "Duplicando..." : "Duplicar"}
            </Button>
        </fetcher.Form>
    );
}
