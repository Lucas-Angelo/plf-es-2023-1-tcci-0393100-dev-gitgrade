interface ICardLabelsProps {
    children?: React.ReactNode;
}
export default function CardLabels(props: ICardLabelsProps) {
    return <div>{props.children}</div>;
}
