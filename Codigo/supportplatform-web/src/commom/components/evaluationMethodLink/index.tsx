import { Link } from "react-router-dom";
import appRoutes from "../../routes/appRoutes";
import { Box, Label } from "@primer/react";

interface IEvaluationMethodLinkProps {
    id: number;
    description: string;
    semester: number;
    year: number;
}

export default function EvaluationMethodLink(
    props: IEvaluationMethodLinkProps
) {
    return (
        <Link to={appRoutes.evaluationMethod.detail.link(props.id)}>
            <Box>
                <Label
                    variant="accent"
                    sx={{
                        ":hover": {
                            cursor: "pointer",
                            opacity: 0.8,
                            transition: "opacity 0.2s",
                        },
                    }}
                >
                    {props.description} - {props.year}/{props.semester}
                </Label>
            </Box>
        </Link>
    );
}
