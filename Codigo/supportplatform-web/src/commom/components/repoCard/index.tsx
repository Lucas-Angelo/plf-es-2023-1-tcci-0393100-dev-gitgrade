import { Link } from "react-router-dom";
import Card from "../card";
import { Button, Link as PrimerLink, Octicon, Box } from "@primer/react";
import { RepoIcon } from "@primer/octicons-react";
import appRoutes from "../../routes/appRoutes";
import React from "react";
import EvaluationMethodLink from "../evaluationMethodLink";
import SyncRepositoryButton from "../syncRepositoryButton";

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

    synchronizing: boolean | undefined;

    lastSyncAt?: Date;
}

const dateFormat = new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
});

export default function RepoCard(props: IRepoCardProps) {
    return (
        <Card.Root>
            <Card.Title>
                <Octicon
                    icon={RepoIcon}
                    sx={{ mr: 2 }}
                />
                <PrimerLink
                    as={Link}
                    to={appRoutes.repo["detail"].link(props.id)}
                    style={{ textDecoration: "none" }}
                >
                    {props.name}
                </PrimerLink>

                {props.lastSyncAt && (
                    <Box
                        sx={{
                            fontSize: "12px",
                            color: "gray",
                        }}
                    >
                        Última sincronização:{" "}
                        {dateFormat.format(new Date(props.lastSyncAt))}
                    </Box>
                )}
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
                <SyncRepositoryButton
                    repositoryId={props.id}
                    synchronizing={props.synchronizing ?? false}
                    variant="default"
                />
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
