import React from "react";
import { useSearchParams } from "react-router-dom";
import Modal from "../modal";

interface ISearchParamControlledModalProps {
    searchParam: string;
    openValue: string;
    header: React.ReactNode;
    children: React.ReactNode;
    "aria-label"?: string;
}

export default function SearchParamControlledModal(
    props: ISearchParamControlledModalProps
) {
    const [searchParams, setSearchParams] = useSearchParams();

    function handleModalClose() {
        setSearchParams((previousSearchParams) => {
            const previousSearchParamsCopy = new URLSearchParams(
                previousSearchParams
            );
            previousSearchParamsCopy.delete(props.searchParam);
            return previousSearchParamsCopy;
        });
    }
    return (
        <Modal
            onClose={handleModalClose}
            isOpen={searchParams.get(props.searchParam) === props.openValue}
            header={props.header}
        >
            {props.children}
        </Modal>
    );
}
