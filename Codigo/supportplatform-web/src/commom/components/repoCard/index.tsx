import { Link } from "react-router-dom";
import Card from "../card";
import { Button, Label, Link as PrimerLink, Octicon } from "@primer/react";
import { RepoIcon } from "@primer/octicons-react";
import appRoutes from "../../routes/appRoutes";
import React from "react";

interface IRepoCardProps {
    id: number;
    name: string;
    evaluationMethodName?: string;
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
            {props.evaluationMethodName && (
                <Card.Labels>
                    <Label variant="accent">{props.evaluationMethodName}</Label>
                </Card.Labels>
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
