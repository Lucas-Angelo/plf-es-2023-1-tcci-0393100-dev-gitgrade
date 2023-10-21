import { Link } from "react-router-dom";
import Card from "../../../../../commom/components/card";
import { Button, Link as PrimerLink, Octicon } from "@primer/react";
import { ArchiveIcon } from "@primer/octicons-react";
import appRoutes from "../../../../../commom/routes/appRoutes";

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
                <Link
                    to={appRoutes.evaluationMethod["detail"].link(props.id)}
                    style={{ textDecoration: "none" }}
                >
                    <PrimerLink as="span">
                        {props.name} - {props.year}/{props.semester}
                    </PrimerLink>
                </Link>
            </Card.Title>
            <Card.Actions>
                <Button>Duplicar</Button>
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
