import { Link } from "react-router-dom";
import Card from "../card";
import { Button, Link as PrimerLink, Octicon } from "@primer/react";
import { RepoIcon } from "@primer/octicons-react";
import appRoutes from "../../routes/appRoutes";
import React from "react";
import EvaluationMethodLink from "../evaluationMethodLink";

interface IRepoCardProps {
    id: number;
    name: string;
    evaluationMethod?: {
        id: number;
        description: string;
        semester: number;
        year: number;
    };
    children?: React.ReactNode;
}

export default function RepoCard(props: IRepoCardProps) {
    return (
        <Card.Root>
            <Card.Title>
                <Octicon
                    icon={RepoIcon}
                    sx={{ mr: 2 }}
                />
                <Link
                    to={appRoutes.repo["detail"].link(props.id)}
                    style={{ textDecoration: "none" }}
                >
                    <PrimerLink as="span">{props.name}</PrimerLink>
                </Link>
            </Card.Title>
            {props.evaluationMethod && (
                <EvaluationMethodLink
                    description={props.evaluationMethod.description}
                    semester={props.evaluationMethod.semester}
                    year={props.evaluationMethod.year}
                    id={props.evaluationMethod.id}
                />
            )}
            <Card.Actions>
                {props.children}
                <Button>Sincronizar</Button>
                <Link
                    to={appRoutes.repo["detail"].link(props.id)}
                    style={{ textDecoration: "none" }}
                >
                    <Button variant="primary">Abrir</Button>
                </Link>
            </Card.Actions>
        </Card.Root>
    );
}
