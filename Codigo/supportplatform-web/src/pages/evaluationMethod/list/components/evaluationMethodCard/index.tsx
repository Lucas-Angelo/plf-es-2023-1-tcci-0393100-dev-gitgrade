import { Link } from "react-router-dom";
import Card from "../../../../../commom/components/card";
import { Button, Link as PrimerLink, Octicon } from "@primer/react";
import { ArchiveIcon } from "@primer/octicons-react";
import appRoutes from "../../../../../commom/routes/appRoutes";
import CloneEvaluationMethodButton from "../../../../../commom/components/cloneEvaluationMethodButton";

interface IEvaluationMethodCardProps {
    id: number;
    name: string;
    semester: number;
    year: number;
}

export default function EvaluationMethodCard(
    props: IEvaluationMethodCardProps
) {
    return (
        <Card.Root>
            <Card.Title>
                <Octicon
                    icon={ArchiveIcon}
                    sx={{ mr: 2 }}
                />
                <PrimerLink
                    as={Link}
                    to={appRoutes.evaluationMethod["detail"].link(props.id)}
                    style={{ textDecoration: "none" }}
                >
                    {props.name} - {props.year}/{props.semester}
                </PrimerLink>
            </Card.Title>
            <Card.Actions>
                <CloneEvaluationMethodButton evaluationMethodId={props.id} />
                <Link
                    to={appRoutes.evaluationMethod["detail"].link(props.id)}
                    style={{ textDecoration: "none" }}
                >
                    <Button variant="primary">Abrir</Button>
                </Link>
            </Card.Actions>
        </Card.Root>
    );
}
